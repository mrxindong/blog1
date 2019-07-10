const mysqlHelper=require('./mysqlHelper');
const log = require('log4js').getLogger("userDao");

let userDao={
    find:async (username,password)=>{
        let sql="select * from users s where ";
        let params={};
        if(username){
            sql+="s.username=:username and ";
            params.username=username;
        }
        if(password){
            sql+="s.password=:password";
            params.password=password;
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
    resetuser:async (userid,username,password)=>{
        let sql="update  users set  username=:username,password=:password where id=:id";
        let params={};
        params.id=userid;
        params.username=username;
        params.password=password;
        let result;
        try {
            result=await mysqlHelper.aExecute(sql,params);
        } catch (error) {
            log.error(error);
            console.log(error);
        }       
       return result;
    },
    //获取用户信息
    getuserinfo:async (userid)=>{
        let sql="select * from users s where id=:id ";
        let params={};
        params.id=userid;
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

module.exports=userDao;