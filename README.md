# [egg + co-wechat快速搭建微信公众号对接服务](http://blog.csdn.net/zhaolandelong/article/details/79093502)

### 准备工作

*外网可访问的服务器地址，可利用花生壳代理到本地，方便开发调试（参考[微信后台开发第一步：nodeJS+express接入微信后台详细教程](https://www.cnblogs.com/xuange306/p/4971702.html)）

*测试公众号，可用微信公众平台提供的测试号（[接口测试号申请](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421137522)）

*node v7.6.0以上，koa2依赖async（[koa中文官网](https://koa.bootcss.com/)）

*把测试公众号的二维码发给你的ta，启动服务后开撩

### 创建项目及初始化

全局安装egg-init，这是egg的脚手架，可快速生成工程目录（[快速初始化](https://eggjs.org/zh-cn/intro/quickstart.html#快速初始化)）。

```bash
$ npm i egg-init -g  
$ egg-init wechat-egg --type=simple  
$ cd wechat-egg  
$ npm i  
```

启动项目：

```bash
$ npm run dev  
$ open localhost:7001
```

如果成功看到“hi, egg”就证明启动成功了。这个页面没用，可以关掉，主要是npm run dev可以热重启服务，很方便开发。当然，如果程序报错它是会结束的，这时候还是需要手动重启。

`注：egg启动的默认端口是7001，这个要跟上面提到的花生壳内网穿透匹配上，后面会有用。`

### 开始写业务

安装[co-wechat](https://github.com/node-webot/co-wechat)

```bash
$ npm i -S koa co-wechat
```

因为[co-wechat](https://github.com/node-webot/co-wechat)是个中间件，所以我们也把它放到middleware下面去，不过还需要进行一层封装。

在app目录下新建middleware目录，并新建wechat.js文件。

```js
// app/middleware/wechat.js  
const wechat = require('co-wechat');  
  
module.exports = (options, app) => {  
    return wechat(options).middleware(async (message, ctx) => {  
        // TODO  
    });  
}; 
```

因为[co-wechat](https://github.com/node-webot/co-wechat)的调用还是有点跟标准不一样的，只export整个包是不行的，要按如上封装一下（参考使用koa的中间件）。TODO就是业务代码，后面还会把它丰富，并抽离到service。但是！！！！！由于后面还有一步微信验证，所以这里暂时还`不能写任何代码！！！不能写任何代码！！！不能写任何代码！！！`

然后配置一下router，添加两项

```js
// app/router.js  
const wechat = app.middlewares.wechat({  
    token: '微信后台配置',  
    appid: '微信后台提供',  
    encodingAESKey: '微信后台配置此时写成空字符串就行了'  
});  
router.get('/wechat', wechat);  
router.post('/wechat', wechat);  
```

上面声明了一个wechat变量，来返回一个接受了config参数的结果，其结果是个function，可参考co-wechat的说明去理解。下面的get、post都要绑定，是因为get用来通过微信后台配置时候的验证用的，post才是正常的业务逻辑，此处需要结合微信的文档去理解，不理解也没关系，后面会有另外一篇纯手动实现微信对接的文章去梳理。

最后，关掉egg的csrf

```js
// config/config.default.js    
  config.security = {  
    csrf: {  
      enable: false,  
      ignoreJSON: true  
    }  
  }; 
```

OK，此时已经距离成功只有一步之遥了。打开你自己的微信测试公众号，在接口配置信息修改里填入信息。记得开启花生壳，url输入花生壳里映射的域名，别忘了在后面加上/wechat。如：http://yoururl.com/wechat

![pic](http://img.blog.csdn.net/20180117155110534?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvemhhb2xhbmRlbG9uZw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

点击“提交”，如果验证成功，证明已经绑上了，如果不成功，请回头走一遍每一个细节。如果绑定成功了，下面就可以写一些真正的业务代码了。还记得上面提到的 app/middleware/wechat.js 里面的 TODO部分吗？可以往里面加东西了。但是如果你还要重复上面的“接口配置信息修改”操作，那么记得把这部分暂时注释掉。

编辑 app/middleware/wechat.js

```js
// app/middleware/wechat.js  
const wechat = require('co-wechat');  
  
module.exports = (options, app) => {  
    return wechat(options).middleware(async (message, ctx) => {  
        // TODO  
        let { MsgType, Content } = message;  
        if (MsgType === 'text') {  
            let reply;  
            switch (Content) {  
                case '12345':  
                    reply = '上山打老虎';  
                    break;  
                case 'kiki':  
                    reply = '是我媳妇';  
                    break;  
                default:  
                    const msgs = [  
                        '我媳妇老漂亮了',  
                        '我媳妇会做饭',  
                        '我媳妇会煎药',  
                        '我媳妇吃的可多了',  
                        '我媳妇可能睡了',  
                        '我媳妇叫kiki',  
                        '我媳妇会打太极拳',  
                        '我媳妇总掉头发',  
                        '我媳妇可爱哭了',  
                        '我媳妇有点二'  
                    ];  
                    let rand = Math.floor(Math.random() * msgs.length);  
                    reply = msgs[rand];  
            }  
            return reply;  
        } else {  
            return '欢迎光临';  
        }  
    });  
}; 
```

然后就可以去公众号里发信息，各种调戏了。理论上，这部分业务代码应该抽到service里面，包括之前的一些config信息，也应该放到config里面，此处就不做展开了，留给大家自由发挥吧。在正确的结果基础上改，才知道自己哪里写的有问题不是。

### 注意事项

最后重申一下注意事项：

*调试时记得开启花生壳

*本机的端口号要与内网穿透的端口号匹配上

*记得把egg的csrf关掉

*微信后台的各种id、token要跟代码里的对上

*在微信后台的“接口配置信息修改”操作时，记得把业务代码先暂时注释掉
