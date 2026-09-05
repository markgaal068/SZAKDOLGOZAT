// Házi góllövőlista lekérése az MKSZ sportszervezet-oldaláról.
//
// Az URL felépítése: mksz.hu/sportszervezet/<CSAPAT_ID>?alversenyId=<VERSENY_ID>&ev=<ÉVAD>
// - CSAPAT_ID: az Ácsi Kinizsi SC MKSZ-en belüli azonosítója (jelenleg: 162)
// - VERSENY_ID (alversenyId): az adott szezon bajnokságának azonosítója
// - ev: az évad kezdő éve
//
// Más csapatokhoz (nőifelnőtt, leányifi, leányseri) ugyanígy kell megkeresni
// a saját sportszervezet/verseny azonosítójukat, majd egy hasonló scriptet
// írni a lenti mintára, a kimeneti fájlnevet átírva.
//
// Futtatás: node scrapes/mkszffifelnottgollovokscrape.js
// Eredmény: public/teamdatas/kezilabda/ffifelnott/mkszffifelnottgollovok.json

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SPORTSZERVEZET_URL = 'https://mksz.hu/sportszervezet/162?alversenyId=320226457&ev=2025';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'teamdatas', 'kezilabda', 'ffifelnott', 'mkszffifelnottgollovok.json');

async function scrapeTopScorers() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(SPORTSZERVEZET_URL, { waitUntil: 'networkidle2' });

  // FONTOS: a táblázatok sorrendje az oldalon NEM stabil (kliensoldali
  // tab-váltás miatt), ezért nem indexre, hanem a fejléc tartalmára
  // szűrünk. A "Házi góllövőlista" tábla fejléce: Hely / Név / Csapat /
  // Gól / M - az "Csapat" oszlop különbözteti meg a lövőstatisztika
  // táblázattól, aminek nincs "Csapat" oszlopa.
  const tableData = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('table'));
    for (const table of tables) {
      const rows = Array.from(table.querySelectorAll('tr')).map((row) =>
        Array.from(row.querySelectorAll('td, th')).map((cell) => cell.textContent.trim())
      );
      const header = rows[0] || [];
      if (header.includes('Csapat') && header.includes('Gól') && header.includes('Hely')) {
        return rows;
      }
    }
    return null;
  });

  if (!tableData) {
    console.log('A góllövőlista táblázat nem található! Lehet, hogy változott az oldal felépítése.');
    await browser.close();
    return;
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tableData, null, 2));
  console.log(`Góllövőlista elmentve: ${OUTPUT_FILE}`);

  await browser.close();
}

scrapeTopScorers();
