const mysqlHelper=require('./mysqlHelper');
const log = require('log4js').getLogger("tagarticleDao");

let tagarticleDao={   
    //添加文章分类
    addtagarticle:async (tag_id,article_id)=>{
        let sql="insert into tag_article values (NULL,:tag_id,:article_id) ";
        let params={};
        params.tag_id=tag_id;
        params.article_id=article_id;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //修改文章分类
    edittagarticle:async (tag_id,article_id)=>{
        let sql="update tag_article set tag_id=:tag_id where article_id=:article_id";
        let params={};
        params.tag_id=tag_id;
        params.article_id=article_id;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //根据文章id获取他的分类
    gettagbyarticleid:async (article_id)=>{
        let sql="select * from tag_article where article_id=:article_id";
        let params={};
        params.article_id=article_id;
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //根据分类获取文章
    getarticlebytagid:async (tag_id)=>{
        let sql="select * from tag_article where tag_id=:tag_id";
        let params={};
        params.tag_id=tag_id;
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //删除文章分类关系
    deletetagarticlebyarticleid:async (article_id)=>{
        let sql="delete from tag_article where article_id=:article_id";
        let params={};
        params.article_id=article_id;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    }
}

module.exports=tagarticleDao;