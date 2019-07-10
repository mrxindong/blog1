'use strict';
const express =require('express');
const articleContro =require('../controller/articleContro');
const router = express.Router();

//博客管理
router.post('/edit', articleContro.edit);//保存博客编辑数据
router.get('/list', articleContro.getbloglist);//获取博客列表
router.get('/getblogbyid', articleContro.getblogbyid);//获取博客详情
router.get('/delandgetlist/:id', articleContro.delandgetlist);//删除一条博客，并获取博客列表

//分类管理
router.post('/typeedit', articleContro.typeedit);//保存分类编辑数据
router.get('/typelist', articleContro.typelist);//获取分类列表
router.get('/getblogtypebyid', articleContro.getblogtypebyid);//获取分类详情
router.get('/delandgetbloglist/:id', articleContro.delandgetbloglist);//删除一条分类，并获取分类列表

//判断当前分类下是否有关联的博客
router.get('/istypehaveblog', articleContro.istypehaveblog);

//前台-------------------------------------
//获取最新的一篇文章
router.get('/getlastblog', articleContro.getlastblog);

//获取最新列表
router.get('/getlastbloglist', articleContro.getlastbloglist);
//获取分类
router.get('/gettypelist', articleContro.gettypelist);
//获取博客详情
router.get('/getblogdetail', articleContro.getblogdetail);

//获取前台分类下的文章 年份
router.get('/getblogyears', articleContro.getblogyears);
//获取前台分类下的所有文章
router.get('/getblogbytypeyear', articleContro.getblogbytypeyear);

//更新文章查看数
router.post('/updateblogview', articleContro.updateblogview);


//搜索
router.get('/getsearch', articleContro.getsearch);






module.exports=router;