// EGYETLEN script a teljes kézilabda szakosztály adatimportjához.
//
// Minden csapathoz (Férfi felnőtt, Női felnőtt, Leány serdülő) lekéri:
//   1. Bajnoki tabella          -> public/teamdatas/kezilabda/<id>/mksz<id>.json
//   2. Házi góllövőlista        -> public/teamdatas/kezilabda/<id>/mksz<id>gollovok.json
//   3. Játékoskeret (fotó+stat) -> public/teamdatas/kezilabda/<id>/mksz<id>jatekosok.json
//                                  ÉS szinkronizálja a MongoDB "players" kollekcióba
//                                  (a csapat régi játékosai lecserélődnek a frissekre).
//
// FONTOS - minden szezon elején: az MKSZ URL-ek (verseny-ID, sportszervezet
// alversenyId+ev) szezononként változnak. A lenti TEAMS tömbben mindig az
// AKTUÁLIS szezon linkjeit kell beállítani, mielőtt futtatod.
//
// Futtatás: node scrapes/kezilabda-import.js

require('dotenv').config({ path: '.env.local' });
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CSAPATOK - minden szezon elején frissítendő URL-ekkel
// ---------------------------------------------------------------------------
const TEAMS = [
    {
        id: 'ffifelnott',
        label: 'Férfi felnőtt',
        tableUrl: 'https://mksz.hu/versenyek/felnottFerfiVersenyek/32026180/320226457',
        sportszervezetUrl: 'https://mksz.hu/sportszervezet/162?alversenyId=320226457&ev=2025',
    },
    {
        id: 'noifelnott',
        label: 'Női felnőtt',
        tableUrl: 'https://mksz.hu/versenyek/felnottNoiVersenyek/32026142/320225846', // TODO: aktuális szezon verseny-URL-je (mksz.hu/versenyek/...)
        sportszervezetUrl: 'https://mksz.hu/sportszervezet/162?alversenyId=320225846&ev=2025', // TODO: aktuális szezon sportszervezet-URL-je (mksz.hu/sportszervezet/...)
    },
    {
        id: 'leanyseri',
        label: 'Leány serdülő',
        tableUrl: 'https://mksz.hu/versenyek/upNoiVersenyek/32025911/320225959',
        sportszervezetUrl: 'https://mksz.hu/sportszervezet/162?alversenyId=320225959&ev=2025',
    },
];

const OUTPUT_ROOT = path.join(__dirname, '..', 'public', 'teamdatas', 'kezilabda');

// ---------------------------------------------------------------------------
// Segédfüggvények
// ---------------------------------------------------------------------------

function toTitleCase(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// "BLAHÓ BALÁZS" -> { last_name: "Blahó", first_name: "Balázs" }
// Magyar névsorrendet feltételezve: az első szó a vezetéknév.
function splitName(fullNameUpper) {
    const parts = fullNameUpper.trim().split(/\s+/);
    const [lastRaw, ...restRaw] = parts;
    return {
        last_name: toTitleCase(lastRaw),
        first_name: restRaw.map(toTitleCase).join(' '),
    };
}

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

async function dismissCookieBanner(page) {
    await page
        .evaluate(() => {
            const target = document.querySelector('button.cc-nb-okagree');
            if (target) target.click();
        })
        .catch(() => {});
}

// A fülek (pl. "Versenyengedélyek") belső felépítése aktív/inaktív
// állapottól függően változhat, ezért nem leaf node-ra, hanem közvetlenül
// az a.nav-link elemek szövegére szűrünk.
async function clickTab(page, tabText) {
    await page.evaluate((text) => {
        const tabs = Array.from(document.querySelectorAll('a.nav-link'));
        const target = tabs.find((e) => e.textContent.trim().toUpperCase() === text);
        if (target) target.click();
    }, tabText.toUpperCase());
}

// Megkeresi azt a táblázatot, aminek fejléce tartalmazza az összes megadott
// szöveget (case-insensitive), és visszaadja a sorait (fejléc nélkül).
async function findTableRows(page, headerNeedles) {
    return page.evaluate((needles) => {
        const tables = Array.from(document.querySelectorAll('table'));
        const target = tables.find((t) => {
            const header = Array.from(t.querySelectorAll('tr')[0]?.querySelectorAll('td,th') || []).map((c) =>
                c.textContent.trim().toUpperCase()
            );
            return needles.every((n) => header.some((h) => h.includes(n)));
        });
        if (!target) return null;
        return Array.from(target.querySelectorAll('tr'))
            .slice(1)
            .map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim()));
    }, headerNeedles);
}

// Rákattint egy fülre, és legfeljebb ~20 másodpercig várja (időnkénti
// újra-kattintással), amíg a keresett táblázatban megjelenik legalább 1 sor -
// az MKSZ oldal adatbetöltése nem konzisztens időzítésű.
async function clickTabAndWaitForRows(page, tabText, headerNeedles) {
    await clickTab(page, tabText);
    for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 500));
        const rows = await findTableRows(page, headerNeedles);
        if (rows && rows.length > 0) return rows;
        if (i % 6 === 5) await clickTab(page, tabText);
    }
    console.log(`  (figyelem: "${tabText}" táblázat nem töltött be adatot a várakozási időn belül)`);
    return [];
}

// ---------------------------------------------------------------------------
// 1. Bajnoki tabella
// ---------------------------------------------------------------------------
async function scrapeTable(browser, team) {
    const page = await browser.newPage();
    await page.goto(team.tableUrl, { waitUntil: 'networkidle2' });

    const tableExists = await page.$('table');
    if (!tableExists) {
        console.log('  Tabella: nem található táblázat az oldalon.');
        await page.close();
        return;
    }

    const tableData = await page.$$eval('table', (tables) =>
        Array.from(tables[0].querySelectorAll('tr')).map((row) =>
            Array.from(row.querySelectorAll('td')).map((col) => col.textContent.trim())
        )
    );

    const outDir = path.join(OUTPUT_ROOT, team.id);
    ensureDir(outDir);
    const outFile = path.join(outDir, `mksz${team.id}.json`);
    fs.writeFileSync(outFile, JSON.stringify(tableData, null, 2));
    console.log(`  Tabella mentve (${tableData.length - 1} csapat).`);

    await page.close();
}

// Ugyanaz a csapatnév-felismerés, mint a lib/utils.js isKinizsiTeam()
// függvényében - ide külön bemásolva, mert ez a script CommonJS-ként fut,
// az pedig ES modulként van exportálva.
function isOwnTeam(name) {
    if (!name) return false;
    const normalized = name.toLowerCase().replace(/[.\s]/g, '');
    return normalized.startsWith('ácsikinizsi');
}

// ---------------------------------------------------------------------------
// 1b. Menetrend és eredmények
// ---------------------------------------------------------------------------
async function findScheduleRows(page) {
    return page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        const target = tables.find((t) => {
            const header = Array.from(t.querySelectorAll('tr')[0]?.querySelectorAll('td,th') || []).map((c) =>
                c.textContent.trim().toUpperCase()
            );
            return header.includes('DÁTUM') && header.includes('HELYSZÍN');
        });
        if (!target) return [];
        return Array.from(target.querySelectorAll('tr'))
            .slice(1)
            .map((tr) => {
                const cells = tr.querySelectorAll('td');
                const matchupCell = cells[3];
                return {
                    dateText: cells[0]?.textContent.trim() || '',
                    venue: cells[2]?.textContent.trim() || '',
                    home: matchupCell?.querySelector('.team-home')?.textContent.trim() || '',
                    guest: matchupCell?.querySelector('.team-guest')?.textContent.trim() || '',
                    resultText: cells[4]?.textContent.trim() || '',
                };
            });
    });
}

async function scrapeSchedule(page, team) {
    await dismissCookieBanner(page);

    // Ugyanaz az időzítési bizonytalanság, mint a többi táblázatnál - a
    // program/eredmény tábla a hálózati "idle" állapot UTÁN, kliensoldali
    // renderelés végén jelenik meg, ezért itt is pollozunk fix várakozás
    // helyett.
    let rawRows = [];
    for (let i = 0; i < 20; i++) {
        rawRows = await findScheduleRows(page);
        if (rawRows.length > 0) break;
        await new Promise((r) => setTimeout(r, 500));
    }

    if (rawRows.length === 0) {
        console.log('  Menetrend: nincs adat.');
        return;
    }

    const matches = rawRows.map((r) => {
        const isHome = isOwnTeam(r.home);
        const opponent = isHome ? r.guest : r.home;
        const scoreMatch = r.resultText.match(/(\d+)\s*:\s*(\d+)/);

        let result = null;
        let outcome = null;
        if (scoreMatch) {
            const homeScore = parseInt(scoreMatch[1], 10);
            const awayScore = parseInt(scoreMatch[2], 10);
            const ownScore = isHome ? homeScore : awayScore;
            const oppScore = isHome ? awayScore : homeScore;
            // Mindig "mi:ellenfél" sorrendben tároljuk, ne hazai:vendég
            // sorrendben - idegenben játszott meccsnél ez félrevezető lenne.
            result = `${ownScore}:${oppScore}`;
            outcome = ownScore > oppScore ? 'win' : ownScore < oppScore ? 'loss' : 'draw';
        }

        return {
            date: r.dateText,
            venue: r.venue,
            opponent,
            isHome,
            played: Boolean(scoreMatch),
            result,
            outcome,
        };
    });

    const outDir = path.join(OUTPUT_ROOT, team.id);
    ensureDir(outDir);
    const outFile = path.join(outDir, `mksz${team.id}menetrend.json`);
    fs.writeFileSync(outFile, JSON.stringify(matches, null, 2));
    console.log(`  Menetrend mentve (${matches.length} mérkőzés).`);
}

// ---------------------------------------------------------------------------
// 2. Házi góllövőlista
// ---------------------------------------------------------------------------
async function scrapeTopScorers(page, team) {
    await dismissCookieBanner(page);

    const rows = await clickTabAndWaitForRows(page, 'Góllövő lista', ['CSAPAT', 'GÓL', 'HELY']);
    if (rows.length === 0) {
        console.log('  Góllövőlista: nincs adat.');
        return;
    }

    const header = ['Hely', 'Név', 'Csapat', 'Gól', 'M'];
    const outDir = path.join(OUTPUT_ROOT, team.id);
    ensureDir(outDir);
    const outFile = path.join(outDir, `mksz${team.id}gollovok.json`);
    fs.writeFileSync(outFile, JSON.stringify([header, ...rows], null, 2));
    console.log(`  Góllövőlista mentve (${rows.length} játékos).`);
}

// ---------------------------------------------------------------------------
// 3. Játékoskeret (fénykép + versenyengedély-statisztika)
// ---------------------------------------------------------------------------
async function scrapePlayers(page, team) {
    await dismissCookieBanner(page);

    const rows = await clickTabAndWaitForRows(page, 'Versenyengedélyek', ['SZÜL. DÁTUM']);
    if (rows.length === 0) {
        console.log('  Játékoskeret: nincs adat.');
        return [];
    }

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
            console.log(`  Nem sikerült rákattintani: ${fullName}`);
            continue;
        }

        await page
            .waitForFunction(() => location.href.includes('/jatekos-adatlap/'), { timeout: 10000 })
            .catch(() => console.log(`    (nem navigált át időben: ${fullName})`));

        const profileUrl = page.url();

        // FONTOS: a kliensoldali (Vue router) navigáció után a kép src néha
        // még az ELŐZŐ játékos fotóját mutatja egy pillanatig - ezért a
        // profil URL-t egy TELJES, friss oldalbetöltéssel nyitjuk meg újra.
        await page.goto(profileUrl, { waitUntil: 'networkidle2' });
        await page
            .waitForSelector('img.player-profile-img', { timeout: 8000 })
            .catch(() => console.log(`    (nem jelent meg a profilkép időben: ${fullName})`));

        const photo = await page.evaluate(() => document.querySelector('img.player-profile-img')?.src || '');
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

        console.log(`  Feldolgozva: ${fullName} -> ${photo ? 'kép OK' : 'NINCS KÉP'}`);

        // Vissza a csapatoldalra a következő sorhoz
        await page.goto(team.sportszervezetUrl, { waitUntil: 'networkidle2' });
        await dismissCookieBanner(page);
        await clickTabAndWaitForRows(page, 'Versenyengedélyek', ['SZÜL. DÁTUM']);
    }

    const outDir = path.join(OUTPUT_ROOT, team.id);
    ensureDir(outDir);
    const outFile = path.join(outDir, `mksz${team.id}jatekosok.json`);
    fs.writeFileSync(outFile, JSON.stringify(players, null, 2));
    console.log(`  Játékoskeret mentve (${players.length} játékos).`);

    return players;
}

// ---------------------------------------------------------------------------
// Szinkronizálás a MongoDB-be
// ---------------------------------------------------------------------------
async function syncPlayersToMongo(team, players) {
    if (!process.env.MONGODB_URI) {
        console.log('  MONGODB_URI hiányzik (.env.local) - kihagyva az adatbázis-szinkron.');
        return;
    }
    if (players.length === 0) return;

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const collection = client.db('kinizsi').collection('players');

        await collection.deleteMany({ team: team.id });

        const docs = players.map((p, i) => ({
            team: team.id,
            first_name: p.first_name || '',
            last_name: p.last_name || '',
            position: p.position || '',
            birth_year: p.birth_year || '',
            image_link: p.image_link || '',
            profile_link: p.profile_link || '',
            stats: p.stats || null,
            createdAt: new Date(Date.now() + i).toISOString(),
        }));
        await collection.insertMany(docs);
        console.log(`  Adatbázis szinkronizálva (${docs.length} játékos).`);
    } finally {
        await client.close();
    }
}

// ---------------------------------------------------------------------------
// Fő folyamat
// ---------------------------------------------------------------------------
async function importTeam(browser, team) {
    console.log(`\n=== ${team.label} (${team.id}) ===`);

    if (!team.tableUrl || !team.sportszervezetUrl) {
        console.log('  Kihagyva: nincs beállítva URL ehhez a csapathoz (lásd TEAMS a fájl elején).');
        return;
    }

    await scrapeTable(browser, team);

    const page = await browser.newPage();
    await page.goto(team.sportszervezetUrl, { waitUntil: 'networkidle2' });

    await scrapeSchedule(page, team);
    await scrapeTopScorers(page, team);
    const players = await scrapePlayers(page, team);
    await syncPlayersToMongo(team, players);

    await page.close();
}

(async () => {
    const browser = await puppeteer.launch();

    for (const team of TEAMS) {
        await importTeam(browser, team);
    }

    await browser.close();
    console.log('\nKész - minden csapat feldolgozva.');
})();
