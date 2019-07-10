const mysqlHelper=require('./mysqlHelper');
const log = require('log4js').getLogger("articleDao");

let articleDao={
    //添加博客
    addblog:async (title,desc,content,hidden,createtime,userid)=>{
        let sql="insert into article values (NULL,:title,:description,:content,:userid,:ishidden,:createtime,0,0) ";
        let params={};
        params.title=title;
        params.description=desc;
        params.content=content;
        params.userid=userid;
        params.ishidden=hidden;
        params.createtime=createtime;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //修改博客
    editblog:async (title,desc,content,hidden,createtime,userid,id)=>{
        let sql="update article set title=:title,description=:description,content=:content,userid=:userid,ishidden=:ishidden,createtime=:createtime where id=:id";
        let params={};
        params.title=title;
        params.description=desc;
        params.content=content;
        params.userid=userid;
        params.ishidden=hidden;
        params.createtime=createtime;
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
    //获取博客列表
    getbloglist:async (userid,title,startdate,enddate,page,pagesize,blogtype,face=0)=>{
        var params={};
        params.userid=userid;
        var sql="select a.*,ta.tag_id as tagid,t.name as tagname from article a LEFT JOIN tag_article ta  on  a.id=ta.article_id  LEFT JOIN tag t on  t.id=ta.tag_id  where a.userid=:userid";
        if(title!=""){
            sql+=" and title like '%"+title+"%'";
        }
        if(startdate!=""){
            sql+=" and createtime BETWEEN :startdate and :enddate";
            params.startdate=startdate;
            params.enddate=enddate;
        }
        if(blogtype!=0){
            sql+=" and ta.tag_id=:tagid";
            params.tagid=blogtype;
        }
        if(face==1){
            //前台,不显示隐藏的
            sql+=" and ishidden=0"; 
        }
        sql+="  order by createtime desc limit :start,:count";
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
    //获取博客总数
    getbloglistcount:async (userid,title,startdate,enddate,blogtype)=>{
        var params={};
        params.userid=userid;
        var sql="select count(a.id) as count from article a LEFT JOIN tag_article ta  on  a.id=ta.article_id  LEFT JOIN tag t on  t.id=ta.tag_id   where a.userid=:userid";
        if(title!=""){
            sql+=" and title like '%"+title+"%'";
        }
        if(startdate!=""){
            sql+=" and createtime BETWEEN :startdate and :enddate";
            params.startdate=startdate;
            params.enddate=enddate;
        }
        if(blogtype!=0){
            sql+=" and ta.tag_id=:tagid";
            params.tagid=blogtype;
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
    //根据文章id获取一篇博客
    getblogbyid:async (id)=>{
        let sql="select * from article where id=:id";
        let params={};
        params.id=id;
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //删除博客
    deleteblogbyid:async (id)=>{
        let sql="delete from article where id=:id";
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
    //获取最新博客
    getlastblog:async (userid)=>{
        let sql=`SELECT article.*,tag.id as tagid ,tag.name as tagname from article LEFT JOIN tag_article on article.id=tag_article.article_id LEFT JOIN tag on tag.id=tag_article.tag_id
        where article.createtime=(select max(createtime) as createtime from article  where userid=:userid) and ishidden=0 and article.userid=:userid`;
        let params={};
        params.userid=userid;
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //获取前台博客详情
    getfaceblogdetail:async (id)=>{
        let sql=`SELECT article.*,tag.id as tagid ,tag.name as tagname from article LEFT JOIN tag_article on article.id=tag_article.article_id LEFT JOIN tag on tag.id=tag_article.tag_id
        where ishidden=0  and  article.id=:id`;
        let params={};
        params.id=id;
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //获取前台分类下的文章 年份
    getblogyears:async (userid,blogtype)=>{
        let params={};
        params.userid=Number(userid);

        let sql=`SELECT date_format(createtime,'%Y') as year from article LEFT JOIN tag_article on article.id=tag_article.article_id LEFT JOIN tag on tag.id=tag_article.tag_id
        where ishidden=0 and article.userid=:userid`;
        if(blogtype>0){
            //分类
            sql+=" and tag.id=:blogtype";
            params.blogtype=Number(blogtype);
        }
        sql+=" group by year  order by year desc";
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //获取前台分类下的所有文章
    getblogbytypeyear:async (userid,blogtype)=>{
        let params={};
        params.userid=Number(userid);

        let sql=`SELECT date_format(createtime,'%Y') as year,article.*,tag.id as tagid ,tag.name as tagname from article LEFT JOIN tag_article on article.id=tag_article.article_id LEFT JOIN tag on tag.id=tag_article.tag_id
        where ishidden=0 and article.userid=:userid `;
        if(blogtype>0){
            //分类
            sql+=" and tag.id=:blogtype";
            params.blogtype=Number(blogtype);
        }
        sql+=" order by createtime desc";
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //更新文章查看数
    updateblogview:async (id)=>{
        let sql="update article set viewcount=viewcount+1 where id=:id";
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
    //更新文章审核过的评论数
    updatepasscommentcount:async (id)=>{
        let sql="update article set passcommentcount=passcommentcount+1 where id=:id";
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
    //搜索内容
    getsearch:async (userid,searchkey)=>{
        let sql="select * from article where ishidden=0  and userid=:userid ";
        if(searchkey!=""){
            sql+=" and title LIKE '%"+searchkey+"%' OR description LIKE '%"+searchkey+"%'";
        }
        sql+=" order by createtime desc limit 10"
        let params={};
        params.userid=userid;
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

module.exports=articleDao;