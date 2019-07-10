const mysqlHelper=require('./mysqlHelper');
const log = require('log4js').getLogger("tagDao");

let tagDao={   
    //添加分类
    addblogtype:async (name,sorts,userid)=>{
        let sql="insert into tag values (NULL,:name,0,:userid,:sorts) ";
        let params={};
        params.name=name;
        params.sorts=sorts;
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
    //修改分类
    editblogtype:async (name,sorts,id)=>{
        let sql="update tag set name=:name,sorts=:sorts where id=:id";
        let params={};
        params.name=name;
        params.sorts=sorts;
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
    //获取分类列表
    getblogtypelist:async (name,userid,page,pagesize)=>{
        var params={};
        var sql="select * from tag  where userid=:userid ";
        if(name!=""){
            sql+=" and name like '%"+name+"%'";
        }
        sql+="  order by sorts limit :start,:count";
        var start=(Number(page)-1)*Number(pagesize);
        params.userid=userid;
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
    //获取分类总条数
    getblogtypelistcount:async (name,userid)=>{
        var params={};
        var sql="select count(id) as count from tag  where userid=:userid ";
        if(name!=""){
            sql+=" and name like '%"+name+"%'";
        }
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
    //根据分类id获取一个分类
    getblogtypebyid:async (id)=>{
        let sql="select * from tag where id=:id";
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
    //删除分类
    deleteblogtypebyid:async (id)=>{
        let sql="delete from tag where id=:id";
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
    }
}

module.exports=tagDao;