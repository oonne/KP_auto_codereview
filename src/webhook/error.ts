import https from 'https';
import config from '../../config/config';

const notice = (content: string) => {
  const postData = JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      content,
    },
  });
  const options = {
    hostname: 'qyapi.weixin.qq.com',
    port: 443,
    path: config.errorHook,
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
