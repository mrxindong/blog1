'use strict';
const express =require( 'express');
const userContro =require('../controller/userContro');
const router = express.Router();

router.post('/login', userContro.login);
router.post('/resetuser', userContro.resetuser);//修改个人账号密码

router.get('/info', userContro.getuserinfo);//后台获取个人信息

router.post('/loginout', userContro.loginout);//后台登出

module.exports=router;