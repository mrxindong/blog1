'use strict';
const express =require('express');
const commentContro =require('../controller/commentContro');
const router = express.Router();

//前台评论
router.post('/add', commentContro.addcomment);//提交评论
router.get('/list', commentContro.getcommentsbyarticleid);//前台-获取评论列表
router.get('/count', commentContro.getcommentcount);//前台-获取评论总条数


//后台
router.get('/adminlist', commentContro.getcommentlist);//后台 获取所有的评论列表

router.get('/delete/:id', commentContro.deletecommentbyid);//删除评论


router.get('/topasslist/:id', commentContro.topasslist);//后台 获取所有的评论列表

router.post('/updatetime', commentContro.updatetime);//修改评论时间

router.get('/detail', commentContro.getcommentdetail);//获取评论详情





module.exports=router;