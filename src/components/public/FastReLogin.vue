<template>
  <el-dialog title="需要验证" :visible.sync="isFastReLogin" class="dialog-auto-width-30 text-center">
    <form method="post">
      <div class="form-group with-input-button">
        您的登录信息已过期，请重新登录
      </div>
      <div class="form-group with-input-button">
        <input placeholder="密码" :type="reLoginShowPass ? 'text' : 'password'" :class="'flat' + getValid()" v-model="reLoginPass">
        <div class="invalid-feedback text-left">请输入密码 ！</div>
        <button type="button" class="input-button" style="top: 7px; right: 8px;" @mousedown="reLoginShowPass=true" @mouseup="reLoginShowPass=false"><i aria-hidden="true" class="fa fa-eye"></i></button>
        <div class="mt-2 logon-act">
          <a :href="getJumpRealUrl('/user/center/rec-password/')" target="_blank" class="logon-link float-left">忘记密码？</a>
        </div>
      </div>
      <div class="form-group">
        <button v-if="reLoginSending" type="button" disabled class="flat-btn flat-btn-black mb-2 mt-3 btn-block">正在提交</button>
        <button v-else type="button" @click="doAuth" class="flat-btn flat-btn-black mb-2 mt-3 btn-block">登录</button>
      </div>
    </form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isFastReLogin: false,
      isFastReLoginValid: false,

      reLoginShowPass: false,
      reLoginPass: '',
      reLoginSending: false,
      reLoginCallback: null
    };
  },
  methods: {
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getValid(){
      if(this.isFastReLoginValid && this.Utils.isNullOrEmpty(this.reLoginPass))
        return ' is-invalid';
      return '';
    },
    doFastLogin(callback) {
      this.reLoginCallback = callback;
      this.isFastReLogin = true;
    },
    doAuth(){
      this.isFastReLoginValid = true;
      this.reLoginSending = true;

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
      var md5 = require('md5');
      var userName = this.$store.getters["auth/authInfo"].name;
      if(this.Utils.isNullOrEmpty(userName)) return;
      if(this.Utils.isNullOrEmpty(this.reLoginPass)) return;
      this.axios.post(this.NET.API_URL + '/auth', {
        name: userName,
        passwd: md5(this.reLoginPass)
      }).then((response) => {
        this.reLoginSending = false;
        if(response.data.success){
          //Reset token
          if (response.data.data && response.data.data.authToken)
            this.Utils.setCookie(response.data.data.authTokenName, response.data.data.authToken, '/');
          if(typeof this.reLoginCallback == 'function') this.reLoginCallback();
          this.isFastReLogin = false;
        }else{
          var extendCode = response.data.data.extendCode;
            if (extendCode == authCode.FAIL_NOUSER_FOUND) {
              this.reLoginPass = '';
              this.$swal("登录失败", "用户不存在。" + data.message, "error");
            } else if (extendCode == authCode.FAIL_USER_LOCKED)
              this.$swal(
                "登录失败",
                "该用户已被封禁，无法登录。请联系管理员解封。" + data.message,
                "error"
              );
            else if (extendCode == authCode.FAIL_BAD_PASSWD) {
              this.reLoginPass = '';
              this.$swal("登录失败", "用户名或密码不正确。" + data.message, "error");
            } else if (extendCode == authCode.FAIL_NOT_ACTIVE) {
              this.$swal("登录失败", "请先登录邮箱激活该用户，您才能登录。", "error");
            } else this.$swal("登录失败", data.message, "error");
        }
      }).catch((err) => {
        this.reLoginSending = false;
        this.$alert('请检查您的网络：' + err, '登录失败', { confirmButtonText: '确定' });
      })
    },
  }
};
</script>

