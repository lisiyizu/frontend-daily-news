const https = require('https');
const url = require('url');
const config = require('./config');

const requestUrl = `https://oapi.dingtalk.com/robot/send?access_token=${config.dingdingToken}`;
const option = url.parse(requestUrl);
option.method = 'POST';

exports.send = function(links) {
  const data = JSON.stringify({
    feedCard: {
      links: links
    },
    msgtype: 'feedCard',
    hideAvatar: 0
  });

  option.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data, 'utf-8')
  };

  const req = https.request(option, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      chunk = JSON.parse(chunk);
      if (chunk.errcode === 0) {
        console.log('钉钉通知成功');
      } else {
        console.log(chunk);
      }
    });
  });

  req.write(data);
  req.end();
};
