const mysqlHelper=require('./mysqlHelper');
const log = require('log4js').getLogger("basicDao");

let basicDao={   
    //查询
    find:async (userid)=>{
        let sql="select * from basic  where userid=:userid";
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
    findbydomain:async (domain)=>{
        let sql="select * from basic  where domain=:domain";
        let params={};
        params.domain=domain;
        let result;
        try {
            result=await mysqlHelper.aQuery(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //修改
    update:async (domain,blogname,author,email,desc,location,logo,footer,viewcount,userid)=>{
        let sql="update basic set domain=:domain,blogname=:blogname,author=:author,email=:email,`desc`=:desc,location=:location,logo=:logo,footer=:footer,viewcount=:viewcount where userid=:userid";
        let params={};
        params.domain=domain;
        params.blogname=blogname;
        params.author=author;
        params.email=email;
        params.desc=desc;
        params.location=location;
        params.logo=logo;
        params.footer=footer;
        params.viewcount=viewcount;
        params.userid=userid;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
     //添加
     insert:async (domain,blogname,author,email,desc,location,logo,footer,viewcount,userid)=>{
        let sql="insert into basic values(NULL,:domain,:blogname,:author,:email,:desc,:location,:logo,:footer,:viewcount,:userid)";
        let params={};
        params.domain=domain;
        params.blogname=blogname;
        params.author=author;
        params.email=email;
        params.desc=desc;
        params.location=location;
        params.logo=logo;
        params.footer=footer;
        params.viewcount=viewcount;
        params.userid=userid;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    updateviewcount:async (userid)=>{
        let sql="update basic set viewcount=viewcount+1 where userid=:userid";
        let params={};
        params.userid=userid;
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

module.exports=basicDao;