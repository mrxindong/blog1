'use strict';
// const userDao=require('../service/userDao');
const crypto =require('crypto');

class Users {
    constructor(){
        this.encryption = this.encryption.bind(this);
        this.login = this.login.bind(this);
        this.resetuser = this.resetuser.bind(this);
    };
    async login(req, res, next){
        let username=req.body.username;
        let password=req.body.password;
        try{
            if (!username) {
                throw new Error('用户名参数错误')
            }else if(!password){
                throw new Error('密码参数错误')
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
        const newpassword = this.encryption(password);//加密传来的密码
        let result=await userDao.find(username,newpassword);
        if(result && result.length>0){
            req.session.user=result[0];//设置session
            res.json({
                code:200,
                message:'',
                result:"ok"
            })
        }else{
            res.json({
                code:500,
                message:'用户名或者密码错误',
                result:""
            })
        }       
    };
    //加密密码 （MD5加盐）
    encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	};
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
    };
    //修改用户信息
    async resetuser(req, res, next){
        let username=req.body.username;
        let password=req.body.password;
        
        var userid=req.session.user.id;
        try{
            if (!username) {
                throw new Error('用户名参数错误')
            }else if(!password){
                throw new Error('密码参数错误')
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
        const newpassword = this.encryption(password);//加密传来的密码
        let result=await userDao.resetuser(userid,username,newpassword);
        if(result.affectedRows>0){
            req.session.user=result[0];//设置session
            res.json({
                code:200,
                message:'',
                result:'ok'
            })
        }else{
            res.json({
                code:500,
                message:'修改账号信息失败',
                result:""
            })
        }              
    };
    //获取用户信息
    async getuserinfo(req, res, next){
        var userid=req.session.user.id;
        
        let result=await userDao.getuserinfo(userid);
        if(result && result.length>0){
            res.json({
                code:200,
                message:'',
                result
            })
        }else{
            res.json({
                code:500,
                message:'用户信息查询失败',
                result:""
            })
        }                
    };
    //退出登录
    async loginout(req, res, next){
        req.session.user=null;
        res.json({
            code:200,
            message:'',
            result:''
        })            
    };
} 

module.exports = new Users()