import https from 'https';
import config from '../../config/config';

const notice = (content: string, type = 'text') => {
  const postData = type === 'markdown' ? JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      content,
    },
  }) : JSON.stringify({
    msgtype: 'text',
    text: {
      content,
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
