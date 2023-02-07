import https from 'https';
import config from '../../config/config';

// 名称转为手机号
const getMobileList = (nameList: string[]): string[] => {
  const mobileList: string[] = [];
  nameList.forEach((name) => {
    const user = config.userList.find((mentionedUser) => mentionedUser.username === name);
    if (!user) {
      return;
    }
    mobileList.push(user.mobile);
  });
  return mobileList;
};

/*
 * 发送机器人提示
 * content: 内容
 * type: 只简单支持 markdown 和 text
 * mentionedList: 需要@人的列表
 */
type Type = 'text' | 'markdown';
const notice = (content: string, type: Type = 'text', mentionedList: string[] = []) => {
  const postData = type === 'markdown' ? JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      content,
    },
  }) : JSON.stringify({
    msgtype: 'text',
    text: {
      content,
      mentioned_mobile_list: getMobileList(mentionedList),
    },
  });
  const options = {
    hostname: 'qyapi.weixin.qq.com',
    port: 443,
    path: config.noticeHook,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Content-Length': Buffer.byteLength(postData),
    },
  };
  const req = https.request(options);
  req.write(postData);
  req.end();
};

export default notice;
