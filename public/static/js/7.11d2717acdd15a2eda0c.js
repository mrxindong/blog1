webpackJsonp([7],{JuGN:function(e,r){},LsaP:function(e,r,t){"use strict";var n={render:function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",{staticClass:"logindiv"},[t("div",{staticClass:"logindiv_from"},[t("ul",[t("li",[t("el-input",{attrs:{placeholder:"请输入用户名"},model:{value:e.username,callback:function(r){e.username=r},expression:"username"}},[t("template",{slot:"prepend"},[e._v("用户名")])],2)],1),e._v(" "),t("li",[t("el-input",{attrs:{placeholder:"请输入密码",type:"password"},model:{value:e.pwd,callback:function(r){e.pwd=r},expression:"pwd"}},[t("template",{slot:"prepend"},[e._v("密 码")])],2)],1),e._v(" "),t("li",[t("el-input",{attrs:{placeholder:"请输入左侧验证码"},model:{value:e.picLyanzhengma,callback:function(r){e.picLyanzhengma=r},expression:"picLyanzhengma"}},[t("template",{slot:"prepend"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.checkCode,expression:"checkCode"}],staticClass:"codeimg",attrs:{type:"button"},domProps:{value:e.checkCode},on:{click:e.createCode,input:function(r){r.target.composing||(e.checkCode=r.target.value)}}})])],2)],1),e._v(" "),t("li",[t("input",{staticClass:"btnlogin",attrs:{type:"button",value:"登   录"},on:{click:e.login}})]),e._v(" "),t("li",[t("span",{ref:"errmsg",staticClass:"err"})])])])])},staticRenderFns:[]};r.a=n},aPQh:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("rz3w"),a=t.n(n);for(var s in n)"default"!==s&&function(e){t.d(r,e,function(){return n[e]})}(s);var i=t("LsaP");var o=function(e){t("JuGN")},c=t("VU/8")(a.a,i.a,!1,o,"data-v-a9b552c0",null);r.default=c.exports},rz3w:function(e,r,t){"use strict";var n;Object.defineProperty(r,"__esModule",{value:!0}),r.default={data:function(){return{username:"",pwd:"",picLyanzhengma:"",checkCode:""}},methods:{createCode:function(){n="";for(var e=new Array(0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"),r=0;r<4;r++){var t=Math.floor(36*Math.random());n+=e[t]}this.checkCode=n},checkLpicma:function(){var e=this.picLyanzhengma.toUpperCase();if(""==e)this.$refs.errmsg.innerHTML="error:请输入验证码";else{if(e==this.checkCode)return!0;this.$refs.errmsg.innerHTML="error:验证码错误",this.createCode(),this.picLyanzhengma=""}},login:function(){var e=this;""==this.username.trim()?this.$refs.errmsg.innerHTML="error:请输入用户名":""==this.pwd.trim()?this.$refs.errmsg.innerHTML="error:请输入密码":this.pwd.trim().length<6?this.$refs.errmsg.innerHTML="error:密码长度至少6位":this.checkLpicma()&&this.$axios.post("/admin/users/login","username="+this.username+"&password="+this.pwd).then(function(r){200==r.data.code&&"ok"==r.data.result?e.$router.push({name:"adminindex"}):500==r.data.code&&(e.$refs.errmsg.innerHTML="error:"+r.data.message)}).catch(function(r){e.$refs.errmsg.innerHTML="登录出错:"+r})}},created:function(){this.createCode()}}}});
//# sourceMappingURL=7.11d2717acdd15a2eda0c.js.map