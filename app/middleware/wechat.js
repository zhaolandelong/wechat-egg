const wechat = require('co-wechat');
const wechatService = require('../service/wechat.js');

module.exports = (options, app) => {
    return wechat(options).middleware(wechatService);
};