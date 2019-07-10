const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/userRouter');
const config = require("./config/default");
const log4js = require('log4js');
var session = require('express-session');
var ueditor = require("ueditor");//加载ueditor 模块
var URL = require("url");


const app = express();


var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//跨域处理
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", '3.2.1')
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});


/**
 * log4js配置
 */
let logConfig = require("./config/log4js.json");
log4js.configure(logConfig);
let log = log4js.getLogger("app");

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  name: config.session.name,
  secret: config.session.secret,
  resave: true,//(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。
  saveUninitialized: false,//初始化session时是否保存到存储。默认为true， 但是(后续版本)有可能默认失效，所以最好手动添加。
  cookie: config.session.cookie
}))
app.use(express.static(path.join(__dirname, 'public')));


//使用ueditor模块，注意这块一定要放在 声明静态资源下方
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
  //客户端上传文件设置
  var ActionType = req.query.action;
  if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
      var file_url = '/ue/img/';//默认图片上传地址
      /*其他上传格式的地址*/
      if (ActionType === 'uploadfile') {
          file_url = '/ue/file/'; //附件
      }
      if (ActionType === 'uploadvideo') {
          file_url = '/ue/video/'; //视频
      }
      res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
      res.setHeader('Content-Type', 'text/html');
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
      var dir_url = '/ue/img/';
      res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端获取配置信息
  else {
      //console.log('config.json')
      ////application/x-www-form-urlencoded

      res.setHeader('Content-Type', 'application/json');
      
      res.redirect('/ueditor_json/config.json');
  }
}));



//拦截验证，不能再直接访问内容，后台请求必须先登录成功后才可以访问内容
app.use(function (req, res, next) {
  var flag = filterUrl(req.url);
  var url = req.url;
  if (url.split('/').length > 1) {
    var urlflag = url.split('/')[1];
    //是后台请求
    if (urlflag == "admin") {
      //未携带session
      console.log(req.session.user);
      if (!req.session.user) {
        if (url== "/admin/users/login") {
          next(); //如果请求的地址是登录则通过，进行下一个请求
        } else {
          //未登录或登录超时
          res.json({ code: 304, message: "用戶已失效", result: {} });
        }
      } else {
        //已携带session
        if(url== "/admin/islogin"){
          //页面判断是否已登录
          res.json({ code: 200, message: req.session.user, result: {} });
        }else{
          req.session._garbage = Date();
          req.session.touch();
          if (flag) {
            res.json({ code: 500, message: "请求参数中含有特殊字符", result: {} });
          } else {
            next();
          }
        }

      }
    }else{
      //前台请求
      next();
    }
  }

});

function filterUrl(url) {

  var flag = false;

  var pattern = new RegExp("[%`~!@#$^*()|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");

  if (url.indexOf("?") > 0) {

    var arg = URL.parse(url, true).query;
    for (param in arg) {
      if (pattern.test(arg[param])) {
        console.log(arg[param]);
        flag = true;
        break;
      }
    }
  }
  return flag;
}

indexRouter(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.json({ code: 404, message: "", result: {} });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  log.info("app.js捕获的错误:" + req.originalUrl + ":" + err.message);
  // render the error page
  res.status(err.status || 500);
  res.json({ code: 500, message: err.message, result: {} });
});

app.listen(config.port,'127.0.0.1');
module.exports = app;
