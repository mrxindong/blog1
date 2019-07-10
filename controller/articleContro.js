'use strict';
const articleDao = require('../service/articleDao');
const tagDao = require('../service/tagDao');
const tagarticleDao = require('../service/tagarticleDao');
const basicDao = require('../service/basicDao');
const config = require("../config/default");
const indexarticle=require("../util/indexarticle")


class Article {
    constructor() {
        //博客管理
        this.edit = this.edit.bind(this);
        this.getbloglist = this.getbloglist.bind(this);
        this.getblogbyid = this.getblogbyid.bind(this);
        this.delandgetlist = this.delandgetlist.bind(this);
        //分类管理
        this.typeedit = this.typeedit.bind(this);
        this.typelist = this.typelist.bind(this);
        this.getblogtypebyid = this.getblogtypebyid.bind(this);
        this.delandgetbloglist = this.delandgetbloglist.bind(this);

        //判断当前分类下是否有关联的博客
        this.istypehaveblog = this.istypehaveblog.bind(this);

        //前台-------------------------------------------------

        //获取最新的一篇博客
        this.getlastblog = this.getlastblog.bind(this);
        //获取最新博客列表
        this.getlastbloglist = this.getlastbloglist.bind(this);
        //获取博客详情
        this.getblogdetail = this.getblogdetail.bind(this);
        //获取分类列表
        this.gettypelist = this.gettypelist.bind(this);
        //获取博客年份
        this.getblogyears = this.getblogyears.bind(this);
        //获取有年份的博客列表
        this.getblogbytypeyear = this.getblogbytypeyear.bind(this);
        //更新文章查看数
        this.updateblogview = this.updateblogview.bind(this);
    };
    //后台博客编辑
    async edit(req, res, next) {
        let title = req.body.title;
        let desc = req.body.desc;
        let content = req.body.content;
        let hidden = req.body.hiddenthis;
        let blogtype = req.body.blogtype;

        //blogtype
        try {
            if (!title) {
                throw new Error('标题参数错误')
            } else if (!desc) {
                throw new Error('描述参数错误')
            } else if (!content) {
                throw new Error('内容参数错误')

            } else if (!blogtype) {
                throw new Error('博客分类参数错误')
            }

        } catch (err) {
            console.log(err.message, err);
            res.send({
                code: 500,
                message: err.message,
                result: ''
            })
            return
        }
        var userid = req.session.user.id;
        var result = {};
        var createtime = new Date();
        if (req.body.createtime) {
            createtime = new Date(req.body.createtime);
        }
        if (req.query.id) {
            //修改
            result = await articleDao.editblog(title, desc, content, hidden, createtime, userid, req.query.id);
            if (result.affectedRows > 0) {
                result = await tagarticleDao.edittagarticle(blogtype, req.query.id);
                if (result.affectedRows > 0) {
                    res.json({
                        code: 200,
                        message: '',
                        result: "ok"
                    })
                } else {
                    res.json({
                        code: 500,
                        message: '分类关系修改失败',
                        result: ""
                    })
                }
            } else {
                res.json({
                    code: 500,
                    message: '博客修改失败',
                    result: ""
                })
            }

        } else {
            //添加博客
            result = await articleDao.addblog(title, desc, content, hidden, createtime, userid);
            if (result.affectedRows > 0) {
                //得到id添加分类
                result = await tagarticleDao.addtagarticle(blogtype, result.insertId);
                if (result.affectedRows > 0) {
                    res.json({
                        code: 200,
                        message: '',
                        result: "ok"
                    })
                } else {
                    res.json({
                        code: 500,
                        message: '分类关系添加失败',
                        result: ""
                    })
                }
            } else {
                res.json({
                    code: 500,
                    message: '博客添加失败',
                    result: ""
                })
            }

        }
    };
    //后台博客列表查询
    async getbloglist(req, res, next) {
        var userid = req.session.user.id;
        var title = "",
            startdate = "",
            enddate = "",
            page = "",
            pagesize = "",
            blogtype = 0;
        if (req.query.title != undefined) {
            title = req.query.title;
        }
        if (req.query.startdate != undefined) {
            startdate = req.query.startdate + " 00:00:00";
            enddate = req.query.enddate + " 23:59:59";
        }
        if (req.query.page != undefined) {
            page = req.query.page;
            pagesize = req.query.pagesize;
        }
        //分类
        if (req.query.blogtype != undefined) {
            blogtype = Number(req.query.blogtype);
        }
        let result = await articleDao.getbloglist(userid, title, startdate, enddate, page, pagesize, blogtype);
        let alllistcount = await articleDao.getbloglistcount(userid, title, startdate, enddate, blogtype);
        if (result) {
            res.json({
                code: 200,
                message: alllistcount,
                result
            })
        }
    };
    //根据文章id获取一篇博客
    async getblogbyid(req, res, next) {
        var id = req.query.id;
        let result = await articleDao.getblogbyid(id);
        let gettagid = await tagarticleDao.gettagbyarticleid(id);
        if (result && result.length > 0) {
            res.json({
                code: 200,
                message: gettagid,
                result
            })
        } else {
            res.json({
                code: 500,
                message: '无数据',
                result: ""
            })
        }
    };
    //删除一条博客并获取博客列表
    async delandgetlist(req, res, next) {
        var id = req.params.id;
        let result = await articleDao.deleteblogbyid(id); //删除博客
        if (result.affectedRows > 0) {
            result = await tagarticleDao.deletetagarticlebyarticleid(id); //删除博客分类关系
            if (result.affectedRows > 0) {
                //查询
                await this.getbloglist(req, res, next); //调取当前的查询方法
            } else {
                res.json({
                    code: 500,
                    message: '博客分类关系删除失败',
                    result: ""
                })
            }

        } else {
            res.json({
                code: 500,
                message: '博客删除失败',
                result: ""
            })
        }
    };

    //----后台分类编辑
    async typeedit(req, res, next) {
        let name = req.body.name;
        let sort= req.body.sort;
        try {
            if (!name) {
                throw new Error('分类名参数错误')
            }
            if (!sort) {
                throw new Error('分类排序参数错误')
            }
        } catch (err) {
            console.log(err.message, err);
            res.send({
                code: 500,
                message: err.message,
                result: ''
            })
            return
        }
        sort=Number(sort);
        var result = {};
        if (req.query.id) {
            //修改
            result = await tagDao.editblogtype(name,sort,req.query.id);
        } else {
            //添加
            var userid = req.session.user.id;
            result = await tagDao.addblogtype(name,sort,userid);
        }


        if (result.affectedRows > 0) {
            res.json({
                code: 200,
                message: '',
                result: "ok"
            })
        } else {
            res.json({
                code: 500,
                message: '博客分类添加失败',
                result: ""
            })
        }
    };
    //后台分类列表查询
    async typelist(req, res, next) {
        var userid = req.session.user.id;
        var name = "",
            page = "",
            pagesize = "";
        if (req.query.name != undefined) {
            name = req.query.name;
        }
        if (req.query.page != undefined) {
            page = req.query.page;
            pagesize = req.query.pagesize;
        }
        let result = await tagDao.getblogtypelist(name, userid, page, pagesize);
        let alllistcount = await tagDao.getblogtypelistcount(name, userid);
        if (result) {
            res.json({
                code: 200,
                message: alllistcount,
                result
            })
        } else {
            res.json({
                code: 500,
                message: '分类列表查询失败',
                result: ""
            })
        }
    };
    //根据分类id获取一个分类
    async getblogtypebyid(req, res, next) {
        var id = req.query.id;
        let result = await tagDao.getblogtypebyid(id);
        if (result && result.length > 0) {
            res.json({
                code: 200,
                message: '',
                result
            })
        } else {
            res.json({
                code: 500,
                message: '无数据',
                result: ""
            })
        }
    };
    //删除一个分类并获取分类列表
    async delandgetbloglist(req, res, next) {
        var id = req.params.id;
        let result = await tagDao.deleteblogtypebyid(id);
        if (result.affectedRows > 0) {
            //查询
            await this.typelist(req, res, next); //调取当前的查询方法
        } else {
            res.json({
                code: 500,
                message: '博客分类删除失败',
                result: ""
            })
        }
    };
    //判断当前分类下是否有关联的文章
    async istypehaveblog(req, res, next) {
        var id = req.query.id;
        let result = await tagarticleDao.getarticlebytagid(id);
        if (result) {
            res.json({
                code: 200,
                message: '',
                result
            })
        } else {
            res.json({
                code: 500,
                message: '获取分类下的关联文章失败',
                result: ""
            })
        }
    };
    async getsearch(req, res, next) {
        //获取userid
        let domain = req.query.domain;
        let userid = config.userid;
        if (domain) {
            //根据域名获取用户信息
            let userinfo = await basicDao.findbydomain(domain);
            if (userinfo && userinfo.length > 0) {
                //有值
                userid = userinfo[0].id;
            }
        }
        let searchkey="";
        if(req.query.searchkey){
            searchkey=req.query.searchkey;
        }
        let result = await articleDao.getsearch(userid,searchkey);
        if (result) {
            res.json({
                code: 200,
                message: '',
                result
            })
        } else {
            res.json({
                code: 500,
                message: '获取搜索内容失败',
                result: ""
            })
        }
    };
    //前台获取最新的一篇博客
    async getlastblog(req, res, next) {
        //获取userid
        let domain = req.query.domain;
        let userid = config.userid;
        if (domain) {
            //根据域名获取用户信息
            let userinfo = await basicDao.findbydomain(domain);
            if (userinfo && userinfo.length > 0) {
                //有值
                userid = userinfo[0].id;
            }
        }

        let result = await articleDao.getlastblog(userid);
        if (result) {
            res.json({
                code: 200,
                message: '',
                result
            })
        } else {
            res.json({
                code: 500,
                message: '获取最新博客失败',
                result: ""
            })
        }
    };
    //获取最新博客列表 
    async getlastbloglist(req, res, next) {
        //获取userid
        let domain = req.query.domain;
        let userid = config.userid;
        if (domain) {
            //根据域名获取用户信息
            let userinfo = await basicDao.findbydomain(domain);
            if (userinfo && userinfo.length > 0) {
                //有值
                userid = userinfo[0].id;
            }
        }
        var face = 1;
        let result;
        //得考虑是否为同一个域名的多次请求
        // if(indexarticle.getresult()){
        //     //有值
        //     result=indexarticle.getresult();
        // }else{
        //     result = await articleDao.getbloglist(userid, "", "", "", 1, 9, 0, face);
        //     indexarticle.setresult(result);
        // }
        result = await articleDao.getbloglist(userid, "", "", "", 1, 9, 0, face);
        if (result) {
            res.json({
                code: 200,
                message: '',
                result
            })
        } else {
            res.json({
                code: 500,
                message: '获取最新博客失败',
                result: ""
            })
        }
    };
    //获取博客详情
    async getblogdetail(req, res, next) {
        var id = req.query.id;
        let result = await articleDao.getfaceblogdetail(id);
        if (result) {
            if (result.length > 0) {
                res.json({
                    code: 200,
                    message: '',
                    result
                })
            } else {
                res.json({
                    code: 304,
                    message: '文章不存在', //文章不存在 或 已隐藏
                    result
                })
            }
        } else {
            res.json({
                code: 500,
                message: '获取博客详情失败',
                result: ""
            })
        }
    };
    //获取分类
    async gettypelist(req, res, next) {
        var pagesize = 10000;
        //获取userid
        let domain = req.query.domain;
        let userid = config.userid;
        if (domain) {
            //根据域名获取用户信息
            let userinfo = await basicDao.findbydomain(domain);
            if (userinfo && userinfo.length > 0) {
                //有值
                userid = userinfo[0].id;
            }
        }
        if (req.query.pagesize) {
            pagesize = req.query.pagesize;
        }
        let result = await tagDao.getblogtypelist("", userid, 1, pagesize);
        if (result) {
            res.json({
                code: 200,
                message: '',
                result
            })
        } else {
            res.json({
                code: 500,
                message: '获取分类列表',
                result: ""
            })
        }
    };
    //获取前台分类下的文章 年份
    async getblogyears(req, res, next) {
        //获取userid
        let domain = req.query.domain;
        let userid = config.userid;
        if (domain) {
            //根据域名获取用户信息
            let userinfo = await basicDao.findbydomain(domain);
            if (userinfo && userinfo.length > 0) {
                //有值
                userid = userinfo[0].id;
            }
        }
        var blogtype = 0;
        if (req.query.blogtype) {
            blogtype = req.query.blogtype;
        }
        let result = await articleDao.getblogyears(userid, blogtype);
        if (result) {
            res.json({
                code: 200,
                message: '',
                result
            })
        } else {
            res.json({
                code: 500,
                message: '获取文章年份失败',
                result: ""
            })
        }
    };
    //获取前台分类下的所有文章
    async getblogbytypeyear(req, res, next) {
        //获取userid
        let domain = req.query.domain;
        let userid = config.userid;
        if (domain) {
            //根据域名获取用户信息
            let userinfo = await basicDao.findbydomain(domain);
            if (userinfo && userinfo.length > 0) {
                //有值
                userid = userinfo[0].id;
            }
        }
        var blogtype = 0;
        if (req.query.blogtype) {
            blogtype = req.query.blogtype;
        }
        let result = await articleDao.getblogbytypeyear(userid, blogtype);
        if (result) {
            res.json({
                code: 200,
                message: '',
                result
            })
        } else {
            res.json({
                code: 500,
                message: '获取分类下的文章失败',
                result: ""
            })
        }
    };
    //更新文章查看数
    async updateblogview(req, res, next) {
        let id = req.body.id;
        try {
            if (!id) {
                throw new Error('文章id参数错误')
            }
        } catch (err) {
            console.log(err.message, err);
            res.send({
                code: 500,
                message: err.message,
                result: ''
            })
            return
        }
        let result = await articleDao.updateblogview(id);
        if (result.affectedRows > 0) {
            res.json({
                code: 200,
                message: '',
                result: 'ok'
            })
        } else {
            res.json({
                code: 500,
                message: '更新文章查看数失败',
                result: ""
            })
        }
    };
}

module.exports = new Article()