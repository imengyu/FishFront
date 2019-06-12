<template>
  <article id="main" class="sm-padding bg-grey-no-border">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4" style="padding:20px">
          <div v-if="currentSuccess">
            <div
              class="box full text-center d-flex justify-content-center align-items-center flex-column"
            >
              <i
                class="fa fa-check-circle-o text-success"
                aria-hidden="true"
                style="font-size: 3.5em"
              ></i>
              <p class="text-secondary mt-2">
                修改密码成功
                <br>
                <span class="text-secondary">请牢记您的新密码</span>
              </p>
              <div>
                <button type="button" class="btn btn-secondary" @click="jump('/')">返回主页</button>
                <button
                  type="button ml-2"
                  class="btn btn-primary"
                  @click="jump('/admin/user-center/')"
                >修改个人信息</button>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="text-center mt-4">
              <div class="logon-icon">
                <img style="width:66px;height:66px" src="../../assets/images/logo/big_icon.png">
              </div>
              <p class="h2" style="margin-top: 10px;margin-bottom: 20px">更改密码</p>
              <p v-if="!currentIsRecoverPassword" class="text-secondary">
                更改
                <span v-if="currentUser" id="change_username">{{currentUser.name}}</span> 的密码
              </p>
            </div>
            <form method="post">
              <div v-if="!currentIsRecoverPassword" class="form-group">
                <input
                  :class="'flat' + validPassWord0()"
                  type="password"
                  id="change_old"
                  name="change_old"
                  placeholder="旧密码"
                  v-model="currentAddUserPasswordOld"
                >
                <div class="invalid-feedback">请输入旧密码</div>
              </div>
              <div class="form-group">
                <input
                  :class="'flat' + validPassWord1()"
                  type="password"
                  id="change_new"
                  name="change_new"
                  placeholder="新密码"
                  v-model="currentAddUserPassword"
                >
                <div v-if="currentAddUserPassword==''" class="invalid-feedback">请输入新密码</div>
                <div class="password-type p-2" id="password_type" style="display:none">
                  <p v-if="validPassWord1Len()" class="m-0 text-danger">
                    <i class="fa fa-times"></i>
                    长度在8-20位之间
                  </p>
                  <p v-else class="m-0 text-success">
                    <i class="fa fa-check"></i>
                    长度在8-20位之间
                  </p>
                  <p v-if="validPassWord1Char()" class="m-0 text-danger">
                    <i class="fa fa-times"></i>
                    必须包含数字、字母或特殊符号其中的两种
                  </p>
                  <p v-else class="m-0 text-success">
                    <i class="fa fa-check"></i>
                    必须包含数字、字母或特殊符号其中的两种
                  </p>
                  <p v-if="validPassWord1UserName()" class="m-0 text-danger">
                    <i class="fa fa-times"></i>
                    不可以与用户名相同或包含用户名
                  </p>
                  <p v-else class="m-0 text-success">
                    <i class="fa fa-check"></i>
                    不可以与用户名相同或包含用户名
                  </p>
                </div>
              </div>
              <div class="form-group">
                <input
                  :class="'flat' + validPassWord2()"
                  type="password"
                  id="change_new2"
                  name="change_new2"
                  v-model="currentAddUserPassword2"
                  placeholder="再输入一次新密码"
                >
                <div v-if="currentAddUserPassword2==''" class="invalid-feedback">请再输入一次新密码</div>
                <div
                  v-if="currentAddUserPassword!=currentAddUserPassword2"
                  class="invalid-feedback"
                >两次密码不一致，请重新输入</div>
              </div>
              <div class="form-group">
                <button
                  type="button"
                  class="flat-btn flat-btn-black mb-2 mt-3 btn-block"
                  v-on:click="submitChange()"
                >更改密码</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import jQuery from "jquery";
import serverConsts from "../../constants/serverConsts.js";
import toast from "../../assets/lib/toast/toast.simply.js";

export default {
  name: "ChangePassword",
  data() {
    return {
      currentUser: null,
      currentIsRecoverPassword: false,
      currentRecoverPasswordToken: '',
      currentSuccess: false,
      currentAddStartValid: false,
      currentAddPasswdStartValid: false,
      currentAddPasswd2StartValid: false,
      currentAddUserName: "",
      currentAddUserFriendlyName: "",
      currentAddUserPasswordOld: "",
      currentAddUserPassword: "",
      currentAddUserPassword2: ""
    };
  },
  watch:{
    $route(to,from){
      this.rePage(to);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.$store.dispatch("global/resetHeader");
      this.$store.dispatch("global/setFooterStyle", "small");
      this.$emit("publicHeaderAdd", {
        name: "用户中心",
        link: ""
      });
      this.rePage();
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    authInfoInited(authed) {
      if (authed) {
        this.currentUser = this.$store.getters["auth/authInfo"];
      } else { 
        if(this.$route.query.token){
          this.axios.put(this.NET.API_URL + '/user/x/password/token-test?token=' + this.$route.query.token).then(response => {
            if (response.data.success) {
              this.switchToRepassword(this.$route.query.token);
            } else this.jump("/sign-in/?error=ChangePasswordNeedSignIn");
          });
        }
        else this.jump("/sign-in/?error=ChangePasswordNeedSignIn");
      }
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    rePage(){
      var main = this;
      jQuery('#change_new').focus(function(){
        main.currentAddPasswdStartValid = true;
        jQuery('#password_type').slideDown();
      });
      jQuery('#change_new').blur(function(){
        if(!main.preSubmitValid())
        $('#password_type').slideUp();
      });
      jQuery('#change_new2').focus(function(){
        main.currentAddPasswd2StartValid = true;
      });
    },
    switchToRepassword(tkn) {
      this.currentIsRecoverPassword = true;
      this.currentRecoverPasswordToken = tkn;
    },
    validPassWord0() {
      if (
        this.currentAddStartValid &&
        this.Utils.isNullOrEmpty(this.currentAddUserPasswordOld)
      )
        return " is-invalid";
      return "";
    },
    validPassWord1() {
      if (
        this.currentAddPasswdStartValid &&
        (this.validPassWord1Len() ||
          this.validPassWord1Char() ||
          this.validPassWord1UserName())
      )
        return " is-invalid";
      return "";
    },
    validPassWord1Len() {
      return (
        this.Utils.isNullOrEmpty(this.currentAddUserPassword) ||
        this.currentAddUserPassword.length < 8
      );
    },
    validPassWord1Char() {
      return !new RegExp(
        /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%\^&*?]+$/
      ).test(this.currentAddUserPassword);
    },
    validPassWord1UserName() {
      var u = this.currentUserName;
      return (
        u != "" &&
        (u == this.currentAddUserPassword ||
          this.currentAddUserPassword.indexOf(u) >= 0)
      );
    },
    validPassWord2() {
      if (
        (this.currentAddStartValid || this.currentAddPasswd2StartValid) &&
        (this.Utils.isNullOrEmpty(this.currentAddUserPassword2) ||
          this.currentAddUserPassword != this.currentAddUserPassword2)
      )
        return " is-invalid";
      return "";
    },
    preSubmitValid() {
      if (
        (!this.currentIsRecoverPassword &&
          this.validPassWord0() == " is-invalid") ||
        this.validPassWord2() == " is-invalid"
      )
        return true;

      if (
        this.validPassWord1Len() ||
        this.validPassWord1Char() ||
        this.validPassWord1UserName()
      )
        return true;

      return false;
    },
    submitChange() {
      this.currentAddStartValid = true;
      if (this.preSubmitValid()) {
        jQuery("#password_type").slideDown();
        return;
      }
      if (this.currentAddUserPasswordOld == this.currentAddUserPassword) {
        this.$swal("新密码不可与旧密码相同哦！", "", "warning");
        return;
      }
      var t = toast.toast("正在提交中...", "loading", -1);
      var md5 = require('md5');
      if (this.currentIsRecoverPassword) {
        this.axios.put(this.NET.API_URL + '/user/x/password',{
          token: this.currentRecoverPasswordToken,
          newPassword: md5(this.currentAddUserPassword)
        }).then(response => {
          toast.toastClose(t);
          if (response.data.success) {
            this.currentAddSuccess = true;
          } else this.$swal("修改密码失败", response.data.message, "error");
        }).catch(response => {
          toast.toastClose(t);
          this.$swal("修改密码失败", "错误信息：" + response, "error");
        });
      } else {
        this.axios.put(this.NET.API_URL + "/user/" + this.currentUserId + "/password",{
          oldPassword: md5(this.currentAddUserPasswordOld),
          newPassword: md5(this.currentAddUserPassword)
        }).then(response => {
          toast.toastClose(t);
          if (response.data.success) {
            this.currentAddSuccess = true;
          } else this.$swal("修改密码失败", response.data.message, "error");
        }).catch(response => {
          toast.toastClose(t);
          this.$swal("修改密码失败", "错误信息：" + response, "error");
        });
      }
    }
  }
};
</script>