'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1516240231342_8215';

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    }
  };
  
  // add your config here
  // config.middleware = ['wechat'];
  // config.wechat = {
  //   token: 'zldl',
  //   appid: 'wxc04ca1666d781d0a',
  //   encodingAESKey: ''
  // };

  return config;
};
