import { Page } from 'puppeteer';
import config from '../../config/config';
import waitRedirect from './wait-redirect';

const Robot = async (page: Page): Promise<void> => {
  // 已登录
  const menuUserName = await page.$('.menuBarUserName');
  if (menuUserName) {
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

  // 输入账号密码，点击登录
  await page.$eval('#f_user', (el, username) => { el.value = username; }, [config.username]);
  await page.$eval('#f_pass', (el, password) => { el.value = password; }, [config.password]);
  await page.$eval('#f_remember', (el) => { el.click(); });
  await page.$eval('#b_signin', (el) => { el.click(); });

  await waitRedirect(page, '/q/status:open');
};

export default Robot;
