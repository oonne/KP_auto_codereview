import { Page } from 'puppeteer';
import openPage from './robot/open-page';
import waitRedirect from './robot/wait-redirect';
import login from './robot/login';

const AutoReview = async () => {
  // 打开页面
  const page: Page = await openPage();

  // 等待进入页面
  await waitRedirect(page, '/q/status:open');

  // 登录
  await login(page);
};

// 运行机器人
AutoReview();
