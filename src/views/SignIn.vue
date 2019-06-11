<template>
  <div class="hello">
    <div class="logon-content">
      <div class="logon-bg"></div>
      <div class="logon-bg-mask"></div>
      <div class="logon-border">
        <div class="logon-block">
          <div class="logon-center">
            <div class="text-center">
              <div class="logon-icon">
                <img src="../assets/images/logo/big_icon.png">
              </div>
            </div>
            <p class="logon-icon-text">
              <span class="text-muted text-center">登录</span>
            </p>
            <div v-if="authed" class="logon-logged">
                <span>您已登录，请不要重复登录！</span>
                <div class="row align-items-center justify-content-center mt-5">
                  <button type="button" class="flat-btn flat-btn-black flat-info" v-on:click="jump('/')">返回主页</button>
                  <button type="button" class="flat-btn flat-btn-black ml-2" v-on:click="logout()">退出登录</button>
                </div>
            </div>
            <div v-else>
            <div class="d-flex align-items-center justify-content-center">
              <button
                :class="'logon-tab mr-2' + (currentTab=='guest'?' active':'')"
                id="logon-switch-guest"
                v-on:click="currentTab='guest'"
              >快速登录</button>
              <button
                :class="'logon-tab' + (currentTab=='admin'?' active':'')"
                id="logon-switch-admin"
                v-on:click="currentTab='admin';initVerifyCode()"
              >账号登录</button>
            </div>
            <hr class="mt-0">
            <div v-if="currentTab == 'admin'" style="min-height:150px">
              <div
                v-if="logSending"
                class="simple-loading-center"
                style="height:250px;"
              >
                <div class="simple-loading-container">
                  <span class="simple-loading"></span>
                  <p>拼命加载中</p>
                </div>
              </div>
              <form v-else id="logon_form" method="post">
                <div class="form-group">
                  <input
                    :class="getValid1()"
                    type="text"
                    placeholder="用户名"
                    v-model="currentUserName"
                  >
                  <div class="invalid-feedback text-left">用户名不可为空！</div>
                </div>
                <div class="form-group">
                  <input
                    :class="getValid2()"
                    type="password"
                    placeholder="密码"
                    v-model="currentPassword"
                  >
                  <div class="invalid-feedback text-left">{{ invalidText2 }}</div>
                  <div class="mt-2 logon-act">
                    <a :href="getJumpRealUrl('/user/center/rec-passwd/')" class="logon-link float-left">忘记密码？</a>
                    <a :href="getJumpRealUrl('/sign-up/')" target="_blank" class="logon-link float-right">注册会员</a>
                  </div>
                </div>
                <div class="form-group">
                  <div id="valid_panel"></div>
                </div>
                <div class="form-group">
                  <button
                    type="button"
                    class="flat-btn flat-btn-black mb-2 mt-3 btn-block"
                    id="log_btn"
                    v-on:click="login()"
                  >登录</button>
                </div>
              </form>
            </div>
            <div v-if="currentTab == 'guest'" style="min-height:150px;padding:10px 10px 30px 10px">
              <div v-if="logSending" class="simple-loading-center" style="height:250px;">
                <div class="simple-loading-container">
                  <span class="simple-loading"></span>
                  <p>拼命加载中</p>
                </div>
              </div>
              <div v-else>暂不支持快捷登录</div>
            </div>
            </div>
            <div class="logon-footer">
              <p></p>
            </div>
          </div>
        </div>
      </div>
      <div class="logon-xfooter">
        <p>
          Copyright © 2019 Dreamfish
          <br>All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/lib/verify/verify.min.js";
import "../assets/lib/verify/verify.min.css";
import Vue from 'vue'
import jQuery from 'jquery'
import Qs from 'qs'

export default {
  name: "SignIn",
  data() {
    return {
      currentTab: "guest",
      currentUserName: "",
      currentPassword: "",
      invalidText2: "请输入密码 ！",
      logSending: false,
      verifyInited: false,
      verifyed: false,
      startValid: false,
      authed: false,
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to, from) {
      this.rePage();
    }
  },
  methods: {
    init: function() {

      this.$store.dispatch('global/resetHeader');
      this.$store.dispatch('global/switchHeader', true);
      this.$store.dispatch('global/switchFooter', false);
      this.$store.dispatch('global/setHeaderStyle', "header");
      this.$store.dispatch('global/setHeaderMenuStyle', "main-menu-black full");
      this.$store.dispatch('global/setPageBackgroundImage', require("../assets/images/background/background1.jpg"));
      this.$emit("publicHeaderAdd", {
        name: "用户中心",
        link: "/sign-in/"
      });
    
      this.rePage();
    },
    rePage(){
      var v = window.localStorage.getItem("last_user");
      if(!this.Utils.isNullOrEmpty(v)) 
        this.currentUserName = v;
      this.showErrorInfo();
    },
    showErrorInfo(){
      var a = this.$route.query.error;
      if(!this.Utils.isNullOrEmpty(a)) {
		    switch(a){
			    case 'BadRequest': this.$swal('错误的登录请求', '请检查登录请求是否正确', 'error'); break;
			    case 'SessionOut': this.$swal('您的登录信息已过期', '为了保证安全，您需要重新登录', 'warning'); break;
			    case 'RequestLogin': this.$swal('请登录', '您需要登录才能访问该页面', 'warning'); break;
			    case 'RequestMorPrivilege': this.$swal('请切换账号', '您当前没有权限进入控制台，请切换至更高级的账号', 'warning'); break;
		    }
	    }
    },
    authInfoInited(){
      this.authed = this.$store.getters["auth/authed"];
    },
    initVerifyCode: function() {
      if (this.verifyInited) return;

      var main = this;
      setTimeout(function() {
        $("#valid_panel").slideVerify({
          type: 2, //类型
          vOffset: 5, //误差量，根据需求自行调整
          vSpace: 5, //间隔
          imgName: [
            require("../assets/images/background/verify/1.jpg"),
            require("../assets/images/background/verify/2.jpg"),
            require("../assets/images/background/verify/3.jpg"),
            require("../assets/images/background/verify/4.jpg"),
            require("../assets/images/background/verify/5.jpg")
          ],
          imgSize: {
            width: "296px",
            height: "200px"
          },
          blockSize: {
            width: "40px",
            height: "40px"
          },
          barSize: {
            width: "100%",
            height: "40px"
          },
          ready: function() {},
          success: function() {
            $("#valid_panel").fadeOut(150, function() {
              $("#valid_panel").html(
                '<div class="verify-bar-area" style="border-color: rgb(92, 184, 92); background-color: rgb(255, 255, 255);height: 40px; line-height: 40px;"><span class="verify-msg" style="color: rgb(92, 184, 92);"><i class="fa fa-check-circle-o"></i> 验证成功！</span></div>'
              );
              $("#valid_panel").fadeIn(200);
            });
            main.verifyed = true;
          },
          error: function() {
            main.verifyed = false;
          }
        });
      }, 500);
    },
    resetVerifyCode: function() {
      $("#valid_panel div").remove();
      this.verifyed = true;
      this.initVerifyCode();
    },
    getValid1: function() {
      return this.startValid && this.currentUserName == ""
        ? "flat is-invalid"
        : "flat";
    },
    getValid2: function() {
      if (!this.startValid) return "flat";
      var invalid = this.currentPassword == "";
      if (invalid) this.invalidText2 = "请输入密码 ！";
      else {
        invalid = this.currentPassword.length < 8;
        if (invalid) this.invalidText2 = "密码必须大于等于 8 位";
      }
      return invalid ? "flat is-invalid" : "flat";
    },
    getRedirectUrl: function(){
      return this.$route.query.redirect_url;
    },
    getJumpRealUrl(link){
      return this.NET.URL_PREFIX + link;
    },
    jump(link){
      location.href=this.getJumpRealUrl(link)
    },
    logout: function() {
      this.$swal({
        type: 'warning',
        title: '退出帐号登录确认',
        text: '你确定要退出吗?',
        confirmButtonColor: '#d33',
        confirmButtonText: '退出',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        cancelButtonText: "取消",
      }).then((res) => {
        if (res.value) {
          this.jump('/sign-out/')
        }
      })
    },
    login: function() {
      this.startValid = true;
      if (this.getValid1() != "flat" || this.getValid2() != "flat") return;
      if (!this.verifyed) {
        this.$swal("请先完成验证以后再登录哦！", "", "warning");
        return;
      }

      var authCode = {
	      FAIL_BAD_PASSWD: -1,
        FAIL_BAD_TOKEN: -2,
        FAIL_EXPIRED: -3,
        FAIL_USER_LOCKED: -4,
        FAIL_NOUSER_FOUND: -5,
        FAIL_NOT_LOGIN: -6,
        FAIL_SERVICE_UNAVAILABLE: -7,
        FAIL_BAD_IP: -8,
	      FAIL_NO_PRIVILEGE: -9,
	      FAIL_NOT_ACTIVE: -11
      }
      var main = this;
	    var userName = this.currentUserName;
      var psw = this.currentPassword;
      var url = this.NET.API_URL + "/auth";
      var md5 = require('md5');
      this.logSending = true;
      jQuery.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({
          name: userName,
          passwd: md5(psw)
        }),
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: { withCredentials: true },
        success: function(data) {
          if (data.success) {
            main.currentPassword = '';
            if (data.data && data.data.authToken)
              main.Utils.setCookie(data.data.authTokenName, data.data.authToken);
            window.localStorage.setItem("last_user", userName);
            //通知父组件刷新顶栏登录信息
            main.$parent.initLoginInfo();
            var a = main.getRedirectUrl();
            if (!main.Utils.isNullOrEmpty(a)) location.href = decodeURIComponent(a);
            else {
              if (
                data.data && data.data.userData &&
                (data.data.userData.level == main.ServerConsts.UserLevels.writer ||
                  data.data.userData.level == main.ServerConsts.UserLevels.admin)
              )
                main.jump("/admin/");
              else main.jump("/user/");
            }
          } else {
            main.resetVerifyCode();
            main.logSending = false;
            var extendCode = data.extendCode;
            if (extendCode == authCode.FAIL_NOUSER_FOUND) {
              main.currentPassword = '';
              main.$swal("登录失败", "用户不存在。" + data.message, "error");
            } else if (extendCode == authCode.FAIL_USER_LOCKED)
              main.$swal(
                "登录失败",
                "该用户已被封禁，无法登录。请联系管理员解封。" + data.message,
                "error"
              );
            else if (extendCode == authCode.FAIL_BAD_PASSWD) {
             main.currentPassword = '';
              main.$swal("登录失败", "用户名或密码不正确。" + data.message, "error");
            } else if (extendCode == authCode.FAIL_NOT_ACTIVE) {
              main.$swal("登录失败", "请先登录邮箱激活该用户，您才能登录。", "error");
            } else main.$swal("登录失败", data.message, "error");
          }
        },
        error: function(jqXHR, errMsg) {
          main.resetVerifyCode();
          main.logSending = false;
          main.$swal("登录失败", "请求失败 : " + errMsg, "error");
        }
      });
    }
  }
};
</script>

<style>
.logon-content {
  position: absolute;
  top: 60px;
  right: 0;
  bottom: 0;
  left: 0;
}
.logon-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url(../assets/images/background/background1.jpg) top center
    no-repeat #efeff4;
  background-size: 100% auto;
  z-index: -2;
}
.logon-bg-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
.logon-border {
  display: block;
  z-index: 2;
  height: auto;
  margin: 0 auto;
  margin-top: 60px;
  background-color: rgba(255, 255, 255, 0.5);
}
.logon-icon {
  position: absolute;
  width: 100px;
  height: 100px;
  left: 50%;
  top: -60px;
  margin-left: -50px;
  background-color: #efeff4;
  border-radius: 50%;
  padding: 18px;
}
.logon-icon-text {
  text-align: center;
  margin-top: 20px;
}
.logon-icon img {
  width: 64px;
  height: 64px;
}
.logon-block {
  background: #fff;
}
.logon-center {
  position: relative;
  padding: 2rem 2rem 0rem 2rem;
  height: auto;
  margin: 0 auto;
}
.logon-footer {
  font-size: 16px;
  font-weight: 300;
  font-family: "Poppins", sans-serif;
  padding: 10px;
  border-top: 1px solid #f5f4f4;
  text-align: center;
}
.logon-xfooter {
  font-size: 16px;
  font-weight: 300;
  padding: 10px;
  text-align: center;
  color: #fff;
}
.logon-footer p {
  color: #aaa;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 2px;
}
.logon-tab {
  padding: 5px 8px;
  color: #969696;
  background-color: #fff;
  outline: 0;
  border: 0;
  border-bottom: 2px solid #fff;
  width: 48%;
}
.logon-tab:active,
.logon-tab:focus {
  outline: 0;
}
.logon-tab:hover {
  color: #000;
  outline: 0;
}
.logon-tab.active {
  color: #000;
  background-color: #fff;
  border-bottom: 2px solid #6195ff;
}
.logon-act-choose {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  margin-top: 10px;
  border: 1px solid #cecece;
  border-radius: 50px;
  padding: 5px 35px;
  background: transparent;
  outline: none;
  cursor: pointer;
}
.logon-act {
  height: 22px;
}
.logon-act-choose:hover,
.logon-act-choose:active,
.logon-act-choose:focus {
  outline: none;
  border: 1px solid #6195ff;
}
.logon-act-choose i {
  font-size: 2em;
  width: 55px;
}
.logon-act-choose span {
  margin-left: 10px;
}
.logon-link {
  color: #858585;
  font-size: 14px;
  margin-left: 0;
}
.logon-link:hover,
.logon-link:active {
  color: #6195ff;
}
.logon-logged {
  min-height: 250px;
  padding:10px 10px 30px 10px;
  text-align: center
}
.logon-logged span {
  height: 80px; 
  font-size: 14px;
  line-height: 80px;
  color: #acacac;
}

.verify-sub-block {
  display: none;
}
.verify-img-panel {
  display: none;
  position: absolute !important;
  top: -201px;
  max-width: 100%;
}
#valid_panel {
  position: relative;
}
#valid_panel:hover .verify-img-panel,
#valid_panel:active .verify-img-panel {
  display: block !important;
}
#valid_panel:hover .verify-sub-block,
#valid_panel:active .verify-sub-block {
  display: block;
}

@media screen and (min-width: 768px) {
  .logon-border {
    width: 25rem;
    padding: 20px;
  }
}
@media screen and (min-width: 400px) and (max-width: 768px) {
  .logon-border {
    margin-top: 10px;
    width: 25rem;
    padding: 15px;
  }
  .logon-icon {
    top: -50px;
  }
  .logon-icon-text {
    margin-top: 30px;
  }
}
@media screen and (max-width: 400px) {
  .logon-icon {
    top: -10px;
  }
  .logon-icon-text {
    margin-top: 65px;
  }
  .logon-content {
    top: 0;
  }
  .logon-border {
    margin-top: 0;
    width: 100%;
    padding: 10px;
  }
  .logon-bg-mask {
    display: none;
  }
  .logon-content {
    position: relative;
    display: block;
    height: auto;
  }
  .logon-xfooter {
    font-size: 16px;
    font-weight: 300;
    padding: 10px;
    text-align: center;
    color: #000;
  }
  #navbar {
    background-color: #fff;
  }
}
.logon-qr-switch {
  text-align: right;
  padding: 15px;
  padding-bottom: 0;
  position: absolute;
  top: 0;
  right: 0;
}
.logon-qr-switch i {
  font-size: 26px;
}
#logon-qrcode {
  text-align: center;
}
#logon-qrcode img {
  display: inline-block;
  margin: 0 auto;
}
</style>
