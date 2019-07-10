webpackJsonp([15],{"2sIx":function(e,t){},"5cCr":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("FW2P");t.default={data:function(){return{imageUrl:"",domain:"",blogname:"",author:"",email:"",desc:"",location:"",footer:"",viewcount:"",errshow:!1,errortitle:"",errordesc:""}},created:function(){var e=this;this.$axios.get("/admin/basic/info").then(function(t){if(200==t.data.code){var a=t.data.result[0];e.domain=a.domain,e.blogname=a.blogname,e.author=a.author,e.email=a.email,e.desc=a.desc,e.location=a.location,e.imageUrl=a.logo,e.footer=a.footer,e.viewcount=a.viewcount}}).catch(function(t){(0,o.catcherror)(e,"基本配置查询失败",t)})},methods:{handleAvatarSuccess:function(e,t){this.imageUrl=URL.createObjectURL(t.raw)},beforeAvatarUpload:function(e){var t="image/jpeg"===e.type,a=e.size/1024/1024<2;return t||this.$message.error("上传头像图片只能是 JPG 格式!"),a||this.$message.error("上传头像图片大小不能超过 2MB!"),t&&a},save:function(){var e=this,t=0;""!==this.viewcount&&(t=this.viewcount);var a={domain:this.domain,blogname:this.blogname,author:this.author,email:this.email,desc:this.desc,location:this.location,logo:this.imageUrl,footer:this.footer,viewcount:t};this.$axios.post("/admin/basic/edit",a).then(function(t){(0,o.checkServercode)(t,e)&&e.$message({showClose:!0,message:"基本配置保存成功！",type:"success"})}).catch(function(t){(0,o.catcherror)(e,"保存基本信息",t)})}}}},d2Ua:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("5cCr"),r=a.n(o);for(var l in o)"default"!==l&&function(e){a.d(t,e,function(){return o[e]})}(l);var i=a("w0ok");var s=function(e){a("2sIx")},n=a("VU/8")(r.a,i.a,!1,s,null,null);t.default=n.exports},w0ok:function(e,t,a){"use strict";var o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-breadcrumb",{staticStyle:{"line-height":"40px",height:"40px",background:"#f8f8f8","border-radius":"5px","padding-left":"10px","margin-bottom":"10px"},attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[e._v("基础配置")]),e._v(" "),a("el-breadcrumb-item",[e._v("其他配置")])],1),e._v(" "),e.errshow?a("errorVue",{attrs:{errortitle:e.errortitle,errordesc:e.errordesc}}):e._e(),e._v(" "),a("el-form",{ref:"form",staticStyle:{width:"60%"},attrs:{"label-width":"150px"}},[a("el-form-item",{attrs:{label:"域名"}},[a("el-input",{attrs:{placeholder:"例如:www.janneyhu.top"},model:{value:e.domain,callback:function(t){e.domain=t},expression:"domain"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"博客名称"}},[a("el-input",{attrs:{placeholder:"例如：janneyhu博客"},model:{value:e.blogname,callback:function(t){e.blogname=t},expression:"blogname"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"个人昵称"}},[a("el-input",{attrs:{placeholder:"例如：janneyhu"},model:{value:e.author,callback:function(t){e.author=t},expression:"author"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"邮箱"}},[a("el-input",{attrs:{placeholder:"展示在作者个人信息处的邮箱"},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"个人简介"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:4},placeholder:"展示在个人信息处的简介"},model:{value:e.desc,callback:function(t){e.desc=t},expression:"desc"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"所在地"}},[a("el-input",{attrs:{placeholder:"例如：北京"},model:{value:e.location,callback:function(t){e.location=t},expression:"location"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"个人头像"}},[a("el-upload",{staticClass:"avatar-uploader",attrs:{action:"https://jsonplaceholder.typicode.com/posts/","show-file-list":!1,"on-success":e.handleAvatarSuccess,"before-upload":e.beforeAvatarUpload}},[e.imageUrl?a("img",{staticClass:"avatar",attrs:{src:e.imageUrl}}):a("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1),e._v(" "),a("el-form-item",{attrs:{label:"网站底部信息"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:4},placeholder:"版权声明信息之类"},model:{value:e.footer,callback:function(t){e.footer=t},expression:"footer"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"总浏览量"}},[a("el-input",{attrs:{placeholder:"请输入正整数"},model:{value:e.viewcount,callback:function(t){e.viewcount=t},expression:"viewcount"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:e.save}},[e._v("保存")])],1)],1)],1)},staticRenderFns:[]};t.a=o}});
//# sourceMappingURL=15.11d2717acdd15a2eda0c.js.map