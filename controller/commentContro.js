'use strict';
const commentDao=require('../service/commentDao');
const articleDao=require('../service/articleDao');
class Comment {
    constructor(){
        this.addcomment = this.addcomment.bind(this);
        this.getcommentsbyarticleid = this.getcommentsbyarticleid.bind(this);
        this.getcommentcount = this.getcommentcount.bind(this);
        this.deletecommentbyid = this.deletecommentbyid.bind(this);
        this.getcommentlist = this.getcommentlist.bind(this);
        this.topasslist = this.topasslist.bind(this);
        
    };
    //添加评论
    async addcomment(req, res, next){
        let name=req.body.name;
        let content=req.body.content;
        let articleid=req.body.articleid;

        //获取ip
        let ip = req.headers['x-forwarded-for']||req.ip||req.connection.remoteAddress||req.socket.remoteAddress||
req.connection.socket.remoteAddress || '';
        if(ip.split(',').length>0){
            ip = ip.split(',')[0]
        }

        try{
            if (!content) {
                throw new Error('评论内容参数错误')
            }else if(!articleid){
                throw new Error('文章id参数错误')
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
        let result=await commentDao.addcomment(name,ip,content,articleid);
        if(result.affectedRows>0){
            res.json({
                code:200,
                message:'',
                result:"ok"
            })
        }else{
            res.json({
                code:500,
                message:'评论添加失败',
                result:""
            })
        }       
    };
    //获取评论列表
    async getcommentsbyarticleid(req, res, next){
        let articleid=req.query.articleid;
        try{
            if (!articleid) {
                throw new Error('评论id参数错误')
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
        let result=await commentDao.getcommentsbyarticleid(articleid);
        if(result){
            res.json({
                code:200,
                message:'',
                result
            })
        }else{
            res.json({
                code:500,
                message:'获取评论列表失败',
                result:""
            })
        }       
    };
    //获取评论总条数
    async getcommentcount(req, res, next){
        let articleid=req.query.articleid;
        try{
            if (!articleid) {
                throw new Error('评论id参数错误')
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
        let result=await commentDao.getcommentcount(articleid);
        if(result){
            res.json({
                code:200,
                message:'',
                result
            })
        }else{
            res.json({
                code:500,
                message:'获取评论总数失败',
                result:""
            })
        }       
    };
    //删除评论
    async deletecommentbyid(req, res, next){
        let id=req.params.id;
        try{
            if (!id) {
                throw new Error('评论id参数错误')
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
        let result=await commentDao.deletecommentbyid(id);
        if(result.affectedRows>0){
            res.json({
                code:200,
                message:'',
                result:"ok"
            })
        }else{
            res.json({
                code:500,
                message:'删除评论失败',
                result:""
            })
        }       
    };
    //后台获取评论列表
    async getcommentlist(req, res, next){
        var userid=req.session.user.id;
        var pass=-1,page="",pagesize="";
        if(req.query.page!=undefined){
            page=req.query.page;
            pagesize=req.query.pagesize;
        }
        //状态
        if(req.query.pass!=undefined){
            pass=Number(req.query.pass);
        }
        let result=await commentDao.getcommentlist(userid,page,pagesize,pass);
        let alllistcount=await commentDao.getcommentlistcount(userid,pass);
        if(result){
            res.json({
                code:200,
                message:alllistcount,
                result
            })
        }    
    };
    //审核评论并获取评论列表
    async topasslist(req, res, next){
        let id=req.params.id;
        try{
            if (!id) {
                throw new Error('评论id参数错误')
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
        let result=await commentDao.passcomment(id);//审核评论
        let articleid=req.query.articleid;//获取articleid
        let r=await articleDao.updatepasscommentcount(articleid);//更新文章评论数量
        if(result.affectedRows>0&&r.affectedRows>0){
            await this.getcommentlist(req, res, next);//调取当前的查询方法
        }else{
            res.json({
                code:500,
                message:'审核评论失败',
                result:""
            })
        }         
      };
      //修改评论时间
      async updatetime(req, res, next){
        let id=req.body.id;
        let time=req.body.time;
        try{
            if (!id) {
                throw new Error('评论id参数错误')
            }
            if (!time) {
                throw new Error('评论时间参数错误')
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
        time=new Date(time);
        let result=await commentDao.updatetime(time,id);
        if(result.affectedRows>0){
            res.json({
                code:200,
                message:'',
                result:'ok'
            })
        }else{
            res.json({
                code:500,
                message:'修改评论时间失败',
                result:""
            })
        }       
    };
      //获取评论详情
         async getcommentdetail(req, res, next){
            var id=req.query.id;
            let result=await commentDao.getcommentdetail(id);
            if(result){
                if(result.length>0){
                    res.json({
                        code:200,
                        message:'',
                        result
                    })
               }else{
                    res.json({
                        code:304,
                        message:'该评论不存在',
                        result
                    })
               }
            }else{
                  res.json({
                      code:500,
                      message:'获取评论详情失败',
                      result:""
                  })
              }      
          };

} 

module.exports = new Comment()