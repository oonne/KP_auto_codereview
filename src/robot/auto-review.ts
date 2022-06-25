import { Page } from 'puppeteer';
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
  // TODO
};

export default Check;
