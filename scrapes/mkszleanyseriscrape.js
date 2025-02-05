const puppeteer = require('puppeteer');
const fs = require('fs'); // Required to write to a file

async function scrapeTable() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Load the page
  await page.goto('https://www.mksz.hu/versenyek/upNoiVersenyek/32024325/320222917', {waitUntil: 'networkidle2'});

  // Check if the table exists
  const tableExists = await page.$('table');
  if (!tableExists) {
    console.log('A táblázat nem található!');
    await browser.close();
    return;
  }

  // Extract the table data
  const tableData = await page.$$eval('table', (tables) => {
    const rows = tables[0].querySelectorAll('tr');
    return Array.from(rows).map((row) => {
      const cols = row.querySelectorAll('td');
      return Array.from(cols).map((col) => col.textContent.trim());
    });
  });

  // Save the data to a JSON file
  fs.writeFileSync('mkszleanyseri.json', JSON.stringify(tableData, null, 2));
  
  console.log('Adatok sikeresen elmentve a scraped_data.json fájlba.');

  await browser.close();
}

scrapeTable();
