import puppeteer from 'puppeteer';
import config from '../../config/config';

const Robot = async () => {
  // 创建浏览器
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 400 },
  });

  // 打开gerrit
  const pages = await browser.pages();
  const page = pages[0];
  await page.goto(config.url);

  return page;
};

export default Robot;
