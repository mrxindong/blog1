'use strict';
let mysql = require('promise-mysql');//require('mysql');
let config = require('../config/setting');
var log = require('log4js').getLogger("helper");
var pool = mysql.createPool(config.mysql);

let helper = {
    queryFormat: function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    },
    query: function (sql, params, callback) {
        pool.getConnection(function (err, connection) {
            connection.config.queryFormat =helper.queryFormat;
            connection.query(sql, params, function (error, results, fields) {
                connection.release();
                callback(error, results, fields);
            });
        });
    },
    aQuery: async (sql, params) => {
        let conn = await pool.getConnection();
        conn.connection.config.queryFormat =helper.queryFormat;
        let query = await conn.query(sql, params);
        conn.end();
        return query;
    },
    execute: function (sql, params, callback) {
        pool.getConnection(function (err, connection) {
            connection.config.queryFormat =helper.queryFormat;
            connection.query(sql, params, function (error, results, fields) {
                if (error) {
                    return connection.rollback(function () {
                        callback(err);
                    });
                }
                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            callback(err);
                        });
                    }
                    callback(null, results, fields);
                });
            });
        })
    },
    aExecute: async (sql, params) => {
        let conn = await pool.getConnection();
        conn.connection.config.queryFormat =helper.queryFormat;
        let query;
        try {
            query = await conn.query(sql, params);
            let commits = await conn.commit();

        } catch (error) {
            console.log(error);
            log.error(error);
            return -1;
        }

        conn.end();
        return query;
    }
}

module.exports = helper;
/* 
helper.query("select * from users",{},function(error, results, fields){
    if(error){
        console.log(error)
    }else{
        console.log(results);
    }
}) */

/* helper.execute("insert into users values('ccc','cc',3,'33',1);",{},function(error, results, fields){
    if(error){`
        console.log(error)
    }else{
        console.log(results);`
    }
}) 
 */

/* async function aa() {
    let name = 'dd', password = 'H63bjcChOp95emmnC1MYmQ==';
    let aa = await helper.aQuery("select * from users s where s.name=:name and s.password=:password" +
        " and  s.flag=1 ", { name: name, password: password });//[name,password]
    console.log(aa);
}
aa(); */

/* async function aa() {
    let aa = await helper.aExecute("insert into users values('dd','dd',3,'33',1);", {});
    console.log(aa);
}

aa(); */