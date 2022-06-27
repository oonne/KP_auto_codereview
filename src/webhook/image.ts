import https from 'https';
import crypto from 'crypto';
import config from '../../config/config';

const notice = (data: Buffer) => {
  const imgBase64 = data.toString('base64');
  const imgMd5 = crypto.createHash('md5').update(data).digest('hex');
  const postData = JSON.stringify({
    msgtype: 'image',
    image: {
      base64: imgBase64,
      md5: imgMd5,
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
