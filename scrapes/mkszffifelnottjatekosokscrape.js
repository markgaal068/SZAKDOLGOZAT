// Játékoskeret (fénykép + versenyengedély-statisztikák) lekérése az MKSZ
// sportszervezet-oldaláról.
//
// Menete:
// 1. Betölti a csapat sportszervezet-oldalát, rákattint a "VERSENYENGEDÉLYEK"
//    fülre - ez adja a jelenlegi szezon minden játékosának nevét + statisztikáit.
// 2. Minden sorra rákattint (ez a Vue router miatt a
//    mksz.hu/jatekos-adatlap/<id> oldalra navigál át ugyanabban a lapban),
//    onnan kiolvassa a fényképet (img.player-profile-img) és a profil URL-t.
// 3. Visszalép a csapatoldalra a következő sorhoz.
//
// FONTOS: a "pozíció" (Kapus/Átlövő/stb.) sem a versenyengedély-táblázatban,
// sem a játékos adatlapján nincs feltüntetve - ezt admin felületen utólag,
// kézzel kell kitölteni minden játékosnál.
//
// Más csapatokhoz ugyanígy kell megkeresni a saját sportszervezet-oldalukat,
// és a SPORTSZERVEZET_URL + OUTPUT_FILE értékeket átírni.
//
// Futtatás: node scrapes/mkszffifelnottjatekosokscrape.js
// Eredmény: public/teamdatas/kezilabda/ffifelnott/mkszffifelnottjatekosok.json

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SPORTSZERVEZET_URL = 'https://mksz.hu/sportszervezet/162?alversenyId=320226457&ev=2025';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'teamdatas', 'kezilabda', 'ffifelnott', 'mkszffifelnottjatekosok.json');

function toTitleCase(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// "BLAHÓ BALÁZS" -> { last_name: "Blahó", first_name: "Balázs" }
// "NÉMETH MARTIN TIBOR" -> { last_name: "Németh", first_name: "Martin Tibor" }
// Magyar névsorrendet feltételezve: az első szó a vezetéknév.
function splitName(fullNameUpper) {
  const parts = fullNameUpper.trim().split(/\s+/);
  const [lastRaw, ...restRaw] = parts;
  return {
    last_name: toTitleCase(lastRaw),
    first_name: restRaw.map(toTitleCase).join(' '),
  };
}

// A táblázat adatai a fülre kattintás után némi (nem konzisztens) késéssel
// töltődnek be - ezért fix sleep helyett arra várunk, amíg ténylegesen
// megjelenik legalább egy adatsor a fejléc alatt.
async function findVersenyengedelyekTableRowCount(page) {
  return page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('table'));
    const target = tables.find((t) => {
      const header = Array.from(t.querySelectorAll('tr')[0]?.querySelectorAll('td,th') || []).map((c) =>
        c.textContent.trim().toUpperCase()
      );
      return header.includes('SZÜL. DÁTUM');
    });
    return target ? target.querySelectorAll('tr').length : 0;
  });
}

async function dismissCookieBanner(page) {
  await page.evaluate(() => {
    const target = document.querySelector('button.cc-nb-okagree');
    if (target) target.click();
  }).catch(() => {});
}

// A fül szövege ("Versenyengedélyek") belső felépítése aktív/inaktív
// állapottól függően változhat (pl. lehet benne extra elem), ezért nem a
// leaf node-ra szűrünk, hanem közvetlenül az a.nav-link elemek szövegére.
async function clickTab(page) {
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('a.nav-link'));
    const target = tabs.find((e) => e.textContent.trim().toUpperCase() === 'VERSENYENGEDÉLYEK');
    if (target) target.click();
  });
}

async function clickVersenyengedelyekTab(page) {
  await dismissCookieBanner(page);
  await clickTab(page);

  // Legfeljebb ~20 másodpercig várunk, amíg megjelenik legalább egy sor -
  // időnként újra rákattintunk, mert az első kattintás nem mindig fog meg
  // (pl. a süti-banner vagy egy késve betöltő elem miatt).
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const count = await findVersenyengedelyekTableRowCount(page);
    if (count > 1) return;
    if (i % 6 === 5) await clickTab(page); // ~3 másodpercenként újrapróbál
  }
  console.log('  (figyelem: a versenyengedélyek táblázat nem töltött be adatot a várakozási időn belül)');
}

async function getPlayerRows(page) {
  return page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('table'));
    const target = tables.find((t) => {
      const header = Array.from(t.querySelectorAll('tr')[0]?.querySelectorAll('td,th') || []).map((c) =>
        c.textContent.trim().toUpperCase()
      );
      return header.includes('SZÜL. DÁTUM');
    });
    if (!target) return [];
    return Array.from(target.querySelectorAll('tr'))
      .slice(1)
      .map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim()));
  });
}

async function scrapePlayers() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(SPORTSZERVEZET_URL, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await clickVersenyengedelyekTab(page);

  const rows = await getPlayerRows(page);
  console.log(`${rows.length} játékos sor található a versenyengedélyek táblázatban.`);

  const players = [];

  for (const row of rows) {
    const [fullName, birthYear, merkozes, gy, d, v, lottGol, sargaLap, ketPerc, kizaras, kizarFeljel, hetmeteres, hetmeteresGol] = row;

    const navigated = await page.evaluate((name) => {
      const cells = Array.from(document.querySelectorAll('td'));
      const target = cells.find((c) => c.textContent.trim() === name);
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, fullName);

    if (!navigated) {
      console.log(`Nem sikerült rákattintani: ${fullName}`);
      continue;
    }

    await page
      .waitForFunction(() => location.href.includes('/jatekos-adatlap/'), { timeout: 10000 })
      .catch(() => console.log(`  (nem navigált át időben: ${fullName})`));

    const profileUrl = page.url();

    // FONTOS: a kliensoldali (Vue router) navigáció után a kép src néha még
    // az ELŐZŐ játékos fotóját mutatja egy pillanatig, mire lecserélődik -
    // ez néha véletlenszerűen a dummy/placeholder képet eredményezte a
    // kiolvasáskor. Ehelyett a profil URL-t egy TELJES, friss oldalbetöltéssel
    // (page.goto) nyitjuk meg újra, ami garantáltan a helyes képpel indul.
    await page.goto(profileUrl, { waitUntil: 'networkidle2' });
    await page
      .waitForSelector('img.player-profile-img', { timeout: 8000 })
      .catch(() => console.log(`  (nem jelent meg a profilkép időben: ${fullName})`));

    const photo = await page.evaluate(
      () => document.querySelector('img.player-profile-img')?.src || ''
    );

    const { first_name, last_name } = splitName(fullName);

    players.push({
      first_name,
      last_name,
      position: '',
      birth_year: birthYear || '',
      image_link: photo,
      profile_link: profileUrl,
      stats: {
        merkozes: merkozes || '',
        gy: gy || '',
        d: d || '',
        v: v || '',
        lott_gol: lottGol || '',
        sarga_lap: sargaLap || '',
        ket_perc: ketPerc || '',
        kizaras: kizaras || '',
        kizar_feljelentes: kizarFeljel || '',
        hetmeteres: hetmeteres || '',
        hetmeteres_gol: hetmeteresGol || '',
      },
    });

    console.log(`Feldolgozva: ${fullName} -> ${photo ? 'kép OK' : 'NINCS KÉP'}`);

    // Vissza a csapatoldalra a következő sorhoz
    await page.goto(SPORTSZERVEZET_URL, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));
    await clickVersenyengedelyekTab(page);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(players, null, 2));
  console.log(`\nMentve: ${OUTPUT_FILE} (${players.length} játékos)`);

  await browser.close();
}

scrapePlayers();
