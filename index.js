const schedule = require('node-schedule');

const spider = require('./spider');

schedule.scheduleJob('* * 10 * * *', function(){
  spider.start()
});