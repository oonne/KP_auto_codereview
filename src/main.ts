import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://oonne.com');
  await page.screenshot({ path: 'oonne.png' });

  await browser.close();
})();
