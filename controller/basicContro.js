'use strict';
const basicDao=require('../service/basicDao');
const config = require("../config/default");

class Basic {
    constructor(){
        this.edit = this.edit.bind(this);
        this.getinfo = this.getinfo.bind(this);
    };
    async edit(req, res, next){
        let domain=req.body.domain;
        let blogname=req.body.blogname;
        let author=req.body.author;
        let email=req.body.email;
        let desc=req.body.desc;
        let location=req.body.location;
        let logo=req.body.logo;
        let footer=req.body.footer;
        let viewcount=req.body.viewcount;

        var userid=req.session.user.id;
        try{
            if (!domain) {
                throw new Error('域名参数错误')
            }else if(!blogname){
                throw new Error('博客名参数错误')
            }else if(!author){
                throw new Error('作者参数错误')
            }else if(!email){
                throw new Error('邮箱参数错误')
            }else if(!desc){
                throw new Error('个人简介参数错误')
            }else if(!location){
                throw new Error('位置参数错误')
            }else if(!logo){
                throw new Error('logo参数错误')
            }else if(!footer){
                throw new Error('底部信息参数错误')
            }else if(!viewcount){
                throw new Error('总浏览数参数错误')
            }
        }catch(err){
            console.log(err.message, err);
            res.send({
                code:500,
                message:err.message,
                result:''
            })
            return
        }
        let result=await basicDao.find(userid);//查询是否存在这条数据
        viewcount=Number(viewcount);
        if(result && result.length>0){
            //存在，修改
            result=await basicDao.update(domain,blogname,author,email,desc,location,logo,footer,viewcount,userid);
               
        }else{
            //不存在，添加
            result=await basicDao.insert(domain,blogname,author,email,desc,location,logo,footer,viewcount,userid);
        } 
        if(result.affectedRows>0){
            res.json({
                code:200,
                message:'',
                result:'ok'
            })
        }else{
            res.json({
                code:500,
                message:'编辑基本信息失败',
                result:""
            })
        }       
    };
    //查询基本配置
    async getinfo(req, res, next){
        var userid=req.session.user.id;
        let result=await basicDao.find(userid);
        if(result && result.length>0){
            res.json({
                code:200,
                message:'',
                result
            })
        }else{
            res.json({
                code:500,
                message:'无此信息',
                result:""
            })
        }              
    };
    async getinfobydomain(req, res, next){
        let domain = req.query.domain;
        let userid = config.userid;
        if (domain) {
            //根据域名获取用户信息
            let userinfo = await basicDao.findbydomain(domain);
            if (userinfo && userinfo.length > 0) {
                //有值
                userid = userinfo[0].id;
            }
        }
        let result=await basicDao.find(userid);
        if(result && result.length>0){
            res.json({
                code:200,
                message:'',
                result
            })
        }else{
            res.json({
                code:500,
                message:'无此信息',
                result:""
            })
        }              
    };
    async updateviewcount(req, res, next){
        let userid=req.body.userid;
        try{
            if(!userid){
                throw new Error('userid参数错误')
            }
        }catch(err){
            console.log(err.message, err);
            res.send({
                code:500,
                message:err.message,
                result:''
            })
            return
        }
        let result=await basicDao.updateviewcount(userid);
        if(result.affectedRows>0){
            res.json({
                code:200,
                message:'',
                result:'ok'
            })
        }else{
            res.json({
                code:500,
                message:'更新总浏览量失败',
                result:""
            })
        }       
    };

} 

module.exports = new Basic()