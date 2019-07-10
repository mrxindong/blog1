'use strict';

let config = {
	port: 8000,//node监听端口号
	url: '/localhost:27017/elm',
	session: {
		name: 'SID',
		secret: 'SID',//secret的值建议使用随机字符串
		cookie: {
			httpOnly: true,
		    secure:   false,
		    maxAge:   365 * 24 * 60 * 60 * 1000,
		}
	},
	userid:1,//前台请求如果domain无可查询，使用默认的userid
}

module.exports=config;