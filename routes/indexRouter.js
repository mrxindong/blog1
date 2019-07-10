const userRouter =require('./userRouter');
const articleRouter =require('./articleRouter');
const commentRouter =require('./commentRouter');
const basicRouter =require('./basicRouter');
/* const express = require('express');
var app = express.Router(); */

module.exports = app => {
	app.use('/admin/users', userRouter);//后台用户模块
	app.use('/admin/article',articleRouter);//后台文章模块
	app.use('/admin/comment',commentRouter);//后台评论
	app.use('/admin/basic',basicRouter);//后台基本信息设置

	app.use('/article',articleRouter);//前台博客相关

	app.use('/comment',commentRouter);//前台评论相关

	
	app.use('/basic',basicRouter);//前台基础信息相关
	app.use('/search',articleRouter);//前台搜索相关

	

}
// module.exports = routerFn;