import { Page } from 'puppeteer';
import config from '../../config/config';
import { Utils } from '../utils/index';
import type { Commit } from '../../typings/type';
import login from './login';
import AutoReview from './auto-review';

const Check = async (page: Page): Promise<void> => {
  await login(page);
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

    // 只筛选监听中的项目
    if (!config.projectList.includes(project)) {
      return;
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
  console.log(commitList);

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
