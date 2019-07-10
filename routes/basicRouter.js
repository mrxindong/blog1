'use strict';
const express =require('express');
const basicContro =require('../controller/basicContro');
const router = express.Router();


router.post('/edit', basicContro.edit);//保存基本配置
router.get('/info', basicContro.getinfo);//后台查询基本
router.get('/domaininfo', basicContro.getinfobydomain);//前台根据域名查基本信息
router.post('/view', basicContro.updateviewcount);//前台更新总浏览量


module.exports=router;