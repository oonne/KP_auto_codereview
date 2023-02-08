import { Page } from 'puppeteer';
import { Utils } from '../utils/index';
import notice from '../webhook/notice';
import error from '../webhook/error';
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

  // 无法合并处理
  const notMergeable = await page.$eval('.com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-notMergeable', (el) => el?.innerText);
  if (notMergeable) {
    // 代码无法合并通知
    notice(`<font color="warning">代码无法合并</font>
      <font color="info">${notMergeable}</font>
      > 项目: ${commit.project}
      > 提交信息: <font color="comment">${commit.subject}</font>
      > 提交分支: <font color="comment">${commit.branch}</font>
      > 提交人: <font color="comment">${commit.owner}</font>`, 'markdown');
    // 代码无法合并链接链接
    const url = await page.url();
    notice(url);

    // 把无法合并的代码abandon掉
    const actionElement = await page.$('#change_actions');
    const btnList = await actionElement?.$$('button');
    if (!btnList) {
      return;
    }
    const abandonBtn = await btnList[4].$('div');
    await page.evaluate((el) => el.click(), abandonBtn);
    await Utils.wait(1000);

    const confirmBtnmList = await page.$('.com-google-gerrit-client-change-ActionMessageBox_BinderImpl_GenCss_style-popup .com-google-gerrit-client-change-Resources-Style-button');
    await page.evaluate((el) => el.click(), confirmBtnmList);
    notice(`${commit.subject} 代码已abandon!`, 'text', [commit.owner as string]);

    await page.goBack();
    return;
  }

  // 点击code review按钮
  const reviewBtn = await page.$('.com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-infoLineHeaderButtons .com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-highlight');
  if (reviewBtn) {
    await page.evaluate((el) => el.click(), reviewBtn);
    await Utils.wait(1000);
  } else {
    error('无法review');
  }

  // 点击 summit按钮
  const submitBtn = await page.$('.com-google-gerrit-client-change-Actions_BinderImpl_GenCss_style-submit');
  if (submitBtn) {
    await page.evaluate((el) => el.click(), submitBtn);
    await Utils.wait(1000);
  } else {
    error('无法submit');
  }

  // 发通知
  notice(`准备合并代码
  > 项目: ${commit.project}
  > 提交信息: <font color="info">${commit.subject}</font>
  > 提交分支: <font color="warning">${commit.branch}</font>
  > 提交人: <font color="comment">${commit.owner}</font>`, 'markdown');

  // 截图
  const changeTable = await page.$('.changeTable tbody');
  if (changeTable) {
    const screenshot = await changeTable.screenshot();
    imageNotice(screenshot as Buffer);
  }

  // 链接
  const url = await page.url();
  notice(url);

  await page.goBack();
};

export default Check;
