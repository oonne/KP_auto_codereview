import { Page } from 'puppeteer';
import errorBoundary from './error-boundary';
import openPage from './robot/open-page';
import waitRedirect from './robot/wait-redirect';
import login from './robot/login';
import checkList from './robot/check-list';

const AutoReview = async () => {
  // 打开页面
  const page: Page = await openPage();

  // 等待进入页面
  await waitRedirect(page, '/q/status:open');

  // 登录
  await login(page);

  // 定时刷新界面，检查最新提交
  checkList(page);
};

// 错误边界
errorBoundary();
// 运行机器人
AutoReview();
