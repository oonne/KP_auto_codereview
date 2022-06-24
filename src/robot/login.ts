import { Page } from 'puppeteer';
import waitRedirect from './wait-redirect';

const Robot = async (page: Page): Promise<void> => {
  // 已登录
  const userName = await page.$('.menuBarUserName');
  if (userName) {
    return;
  }

  // 未登录
  const loginLink = await page.$('.topmenuMenuRight>.linkMenuBar>.menuItem');
  if (!loginLink) {
    return;
  }
  const loginLinkText = await page.evaluate((node) => node.innerText, loginLink);
  if (loginLinkText !== 'Sign In') {
    return;
  }

  await loginLink.click();
  await waitRedirect(page, 'login');

  // 输入账号密码
  // todo
};

export default Robot;
