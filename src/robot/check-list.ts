import { Page } from 'puppeteer';
import config from '../../config/config';
import { Utils } from '../utils/index';
import type { Commit } from '../../typings/type';
import login from './login';
import AutoReview from './auto-review';
import waitRedirect from './wait-redirect';
import notice from '../webhook/notice';

const Check = async (page: Page): Promise<void> => {
  await login(page);
  await page.goto(`${config.url}/#/q/status:open`);
  await waitRedirect(page, '/q/status:open');
  console.log('检查代码...');

  // 异步循环监听中的提交列表
  const commitList: Commit[] = [];
  const rowList = await page.$$('.changeTable tbody tr');
  const rowPromise = rowList.map(async (row, i) => {
    const linkList = await row.$$('.gwt-InlineHyperlink');
    // 过滤表头
    if (!linkList.length) {
      return;
    }

    // 提交内容
    const subject = await page.evaluate((el) => el.innerText, linkList[1]);
    // 提交人
    const owner = await page.evaluate((el) => el.innerText, linkList[2]);
    // 项目
    const project = await page.evaluate((el) => el.innerText, linkList[3]);
    // 分支
    const branch = await page.evaluate((el) => el.innerText, linkList[4]);
    // 状态
    const status = await page.$eval('.cSTATUS', (el) => el?.innerText);

    // 只筛选监听中的项目
    if (!config.projectList.includes(project)) {
      return;
    }

    // 无法合并
    if (status === 'Merge Conflict') {
      notice(`${subject} 代码冲突!`, 'text', [owner as string]);
    }

    commitList.unshift({
      index: i,
      subject,
      owner,
      project,
      branch,
    });
  });
  await Promise.all(rowPromise);

  // 没有需要合并的提交
  if (!commitList.length) {
    return;
  }

  // 有需要合并的提交，依次点击
  for (let i = 0; i < commitList.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await AutoReview(page, commitList[i]);
  }
};

const Robot = async (page: Page) => {
  await Check(page);

  await Utils.wait(config.refreshInterval);
  Robot(page);
};

export default Robot;
