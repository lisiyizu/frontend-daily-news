const os = require('os');
const path = require('path');

const puppeteer = require('puppeteer');

const dingding = require('./dingding');

exports.start =  async () => {

    const options = {};

    const platform = os.platform().toLocaleLowerCase();

    if ( platform === 'linux' ) {
      options.args = ['--no-sandbox', '--disable-setuid-sandbox'];
      options.executablePath = path.join(process.cwd(), '../chromium/chrome')
    }  else if ( platform === 'darwin' ) {
      options.executablePath = path.join(process.cwd(), '../chromium/Chromium.app/Contents/MacOS/Chromium')
    } else if ( platform === 'win32' ) {
      options.executablePath = path.join(process.cwd(), '../chromium/chrome.exe')
    }

  // 创建浏览器对象
  const browser = await puppeteer.launch(options);

  // 创建页面对象
  const page = await browser.newPage();

  // 监听页面输出
  page.on('console', (msg) => {
    console.log(msg._text);
  })

  // 先在搜狗搜索前端大全公众号
  // Tip:不能直接使用公众号的主页链接，会过期的，通过搜狗搜索获取链接
  await page.goto('http://weixin.sogou.com/weixin?type=1&s_from=input&query=%E5%89%8D%E7%AB%AF%E5%A4%A7%E5%85%A8&ie=utf8&_sug_=n&_sug_type_=');

  // 获取前端大全公众号的主页链接
  const url = await page.evaluate(function() {
    return document.querySelector('.news-list2').querySelector('li').querySelector('.tit').querySelector('a').getAttribute('href');
  })

  // 进入前端大全主页
  await page.goto(url);

  // 将jQuery添加到页面，便于dom操作
  await page.addScriptTag({
    url: 'https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js'
  })

  const msgs = await page.evaluate(function() {
    var arr = [];
    $('.weui_msg_card').each(function(index, weui_msg_card) {
      var date = $(weui_msg_card).children('.weui_msg_card_hd').text();
      date = date.replace(/年|月/g, '/');
      date = date.replace(/日/g, '');
      date = new Date(date);
      date.setDate(date.getDate() + 1);
      if (date.toLocaleDateString() === (new Date()).toLocaleDateString()) {

        $(weui_msg_card).children('.weui_msg_card_bd').children('.weui_media_box.appmsg').each(function(index, weui_media_box) {
          var weui_media_hd = $(weui_media_box).find('.weui_media_hd').css('background-image').replace(/url\(\"|\"\)/g, '');
          var weui_media_title = $.trim($(weui_media_box).find('.weui_media_title').text());
          var weui_media_desc = $.trim($(weui_media_box).find('.weui_media_desc').text());
          var weui_media_source;
          // msgList是文章列表，json格式，在代码里面可以找到，但是里面没有文章日期，所以上面才采用分析dom的方式，文章源地址在msgList里面可以找到
          for (var i = 0; i < msgList.list.length; i++) {
            var app_msg_ext_info = msgList.list[i].app_msg_ext_info;

            if (app_msg_ext_info.title === weui_media_title) {
              weui_media_source = app_msg_ext_info.source_url;
            }
            for (var k = 0; k < app_msg_ext_info.multi_app_msg_item_list.length; k++) {
              var multiMsg = app_msg_ext_info.multi_app_msg_item_list[k];
              if (multiMsg.title === weui_media_title) {
                weui_media_source = multiMsg.source_url
              }
            }
          }
          arr.push({
            weui_media_hd: weui_media_hd,
            weui_media_title: weui_media_title,
            weui_media_desc: weui_media_desc,
            weui_media_source: weui_media_source
          })
        })
      }
    })
    return JSON.stringify(arr);
  })

  const links = JSON.parse(msgs).map(msg => {
    return {
      title: msg.weui_media_title,
      messageURL: msg.weui_media_source,
      picURL: msg.weui_media_hd
    }
  });

  browser.close();

  dingding.send(links);

};