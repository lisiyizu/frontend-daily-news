# 前端日报

## 一个小工具，定时爬取前端文章，并发送到钉钉群
Github:[frontend-daily-news](https://github.com/frontendnote/frontend-daily-news)

## 效果演示
<img width="" src="http://www.frontendnote.com/images/WX20180824-152253.png" />

## How to use?

1. [手动安装puppeteer依赖的chromium](http://www.frontendnote.com/2018/08/10/linux-an-zhuang-puppeteer/)

2. 安装依赖
``` bash
yarn install
#或者
npm install
```

3. 修改钉钉机器人Token<br/>
在根目录config.js中修改需要通知的钉钉机器人Token

4. 测试
``` bash
node test
# 显示钉钉通知成功则程序OK
```

5. 部署程序<br/>
程序每天早上10点定时抓取并发送消息，如果需要修改定时器，请查看index.js
``` bash
node index
```

## 程序持久运行
1. 全局安装PM2
``` bash
yarn global add pm2
# 或者
npm install pm2 -g
```

2. 启动服务
``` bash
pm2 start pm2.json
```
