'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  const wechat = app.middlewares.wechat({
    token: 'zldl',
    appid: 'wxc04ca1666d781d0a',
    encodingAESKey: ''
  });
  router.get('/wechat', wechat);
  router.post('/wechat', wechat);
};
