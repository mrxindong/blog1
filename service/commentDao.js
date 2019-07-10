const mysqlHelper=require('./mysqlHelper');
const log = require('log4js').getLogger("commentDao");

let commentDao={   
    //添加评论
    addcomment:async (name,ip,content,articleid)=>{
        let sql="insert into comment values (NULL,:name,:ip,:content,NOW(),:articleid,0) ";
        let params={};
        params.name=name;
        params.ip=ip;
        params.content=content;
        params.articleid=articleid;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //获取评论列表
    getcommentsbyarticleid:async (articleid)=>{
        var params={};
        var sql="select * from comment  where articleid=:articleid and pass=1 order by id desc ";
        params.articleid=articleid;
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //获取评论总条数
    getcommentcount:async (articleid)=>{
        var params={};
        var sql="select count(id) as count from comment  where articleid=:articleid and  pass=1 ";
        params.articleid=articleid;
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //删除评论
    deletecommentbyid:async (id)=>{
        let sql="delete from comment where id=:id";
        let params={};
        params.id=id;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //通过审核
    passcomment:async (id)=>{
        let sql="update  comment set pass=1 where id=:id";
        let params={};
        params.id=id;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //后台获取评论列表
    getcommentlist:async (userid,page,pagesize,pass)=>{
        var params={};
        params.userid=userid;
        let sql="SELECT c.*,a.title,a.userid from `comment` c LEFT JOIN article a on c.articleid=a.id where userid=:userid ";
        if(pass!=-1){
            sql+=" and pass=:pass";
            params.pass=pass;
        }
        sql+="  order by time desc limit :start,:count";
        var start=(Number(page)-1)*Number(pagesize);
        params.start=start;
        params.count=Number(pagesize);

        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //后台获取评论总数
    getcommentlistcount:async (userid,pass)=>{
        var params={};
        params.userid=userid;
        let sql="SELECT count(c.id) as count from `comment` c LEFT JOIN article a on c.articleid=a.id where userid=:userid ";
        if(pass!=-1){
            sql+=" and pass=:pass";
            params.pass=pass;
        }

        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //更新评论时间
    updatetime:async (time,id)=>{
        let sql="update  comment set time=:time where id=:id";
        let params={};
        params.id=id;
        params.time=time;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //获取评论详情
    getcommentdetail:async (id)=>{
        var params={};
        params.id=id;
        let sql="SELECT c.*,a.title,a.userid from `comment` c LEFT JOIN article a on c.articleid=a.id where c.id=:id ";
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    }
}

module.exports=commentDao;