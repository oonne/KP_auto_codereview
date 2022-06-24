import { Page } from 'puppeteer';
import { Utils } from '../utils/index';

// 跳转的时候自动重定向，需要延迟等待跳转
const waitRedirect = async (page: Page, path: string): Promise<void> => {
  await Utils.wait(1000);
  const url = page.url();
  if (url.indexOf(path) !== -1) {
    return;
  }

  console.log('等待重定向', url);
  await waitRedirect(page, path);
};

export default waitRedirect;
