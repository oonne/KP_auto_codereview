import { Page } from 'puppeteer';
import { Utils } from '../utils/index';
import notice from '../webhook/notice';
import imageNotice from '../webhook/image';
import waitRedirect from './wait-redirect';
import type { Commit } from '../../typings/type';

const Check = async (page: Page, commit: Commit): Promise<void> => {
  await waitRedirect(page, '/q/status:open');

  // 选择节点的时候下标需要+1，因为nth-child是从1开始算的
  const row = await page.$(`.changeTable tbody tr:nth-child(${commit.index + 1})`);
  if (!row) {
    return;
  }
  const linkList = await row.$$('.gwt-InlineHyperlink');

  // 跳转到对应页面
  let id = '';
  await page.evaluate((el) => { id = el.innerText; el.click(); }, linkList[0]);
  await waitRedirect(page, id);

  // 点击code review按钮
  const reviewBtn = await page.$('.com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-infoLineHeaderButtons .com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-highlight');
  if (reviewBtn) {
    await page.evaluate((el) => el.click(), reviewBtn);
    await Utils.wait(1000);
  }

  // 点击 summit按钮
  const submitBtn = await page.$('.com-google-gerrit-client-change-Actions_BinderImpl_GenCss_style-submit');
  if (submitBtn) {
    await page.evaluate((el) => el.click(), submitBtn);
    await Utils.wait(1000);
  }

  // 发通知
  const url = await page.url();
  notice(`代码已合并
  > 项目: ${commit.project}
  > 提交信息: <font color="info">${commit.subject}</font>
  > 提交分支: <font color="warning">${commit.branch}</font>
  > 提交人: <font color="comment">${commit.owner}</font>
  > 链接 : ${url}`);

  // 截图
  const changeTable = await page.$('.changeTable tbody');
  if (changeTable) {
    const screenshot = await changeTable.screenshot();
    imageNotice(screenshot as Buffer);
  }

  await page.goBack();
};

export default Check;
