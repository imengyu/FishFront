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
                我们已经向您的邮箱发送了一封找回密码的邮件
                <br>
                <span class="text-primary">请查收此邮件，此邮件将会引导您找回密码</span>
                <br><span class="text-secondary"><small>没有收到邮件？请尝试在垃圾箱中查找，或是否被您的反垃圾邮件软件所拦截</small></span>
              </p>
              <div>
                <button type="button" class="btn btn-secondary" @click="jump('/')">返回主页</button>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="text-center mt-4">
              <div class="logon-icon"></div>
              <p class="h2" style="margin-top: 10px;margin-bottom: 20px">找回密码</p>
              <p class="text-secondary">请输入您注册此账号的邮箱或手机号，我们将会为您找回密码</p>
            </div>
            <form method="post">
              <div class="form-group">
                <input :class="'flat' + valid0()"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="邮箱或手机号"
                  v-loading="currentUserEmailOrPhoneValiding"
                  @blur="checkUserInputMessageValid()"
                  v-model="currentUserEmailOrPhone"
                >
                <div class="invalid-feedback">请输入您的邮箱</div>
              </div>
              <div class="form-group">
                <button
                  type="button"
                  class="flat-btn flat-btn-black mb-2 mt-3 btn-block"
                  v-on:click="submitChange()"
                >找回密码</button>
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
  name: "FindPassword",
  data() {
    return {
      currentUser: null,
      currentSuccess: false,
      currentAddStartValid: false,
      currentUserEmailOrPhone: '',
      currentUserEmailOrPhoneValid: true,
      currentUserEmailOrPhoneValiding: false,
      currentUserEmailOrPhoneLastValid: '',
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
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    rePage(){

    },
    checkUserInputMessageValid(){
      if(!this.Utils.isNullOrEmpty(this.currentUserEmailOrPhone) && this.currentUserEmailOrPhoneLastValid != this.currentUserEmailOrPhone && !this.currentUserEmailOrPhoneValiding){
        this.currentUserEmailOrPhoneLastValid != this.currentUserEmailOrPhone
        this.currentUserEmailOrPhoneValiding = true;
        this.axios.get(this.NET.API_URL + '/user/exists?k=' + this.currentUserEmailOrPhone).then((response) => {
          this.currentUserEmailOrPhoneValiding = false;
          if(response.data.success){
            this.currentUserEmailOrPhoneValid = response.data.data;
          }
        }).catch(() => {
          this.currentUserEmailOrPhoneValiding = false;
        });
      }
    },
    valid0(){
      if(this.currentAddStartValid && this.Utils.isNullOrEmpty(this.currentUserEmailOrPhone))
        return ' is-invalid';
      return '';
    },
    preSubmitValid(){
      return this.valid0() != '';
    },
    submitChange() {
      this.currentAddStartValid = true;
      if (this.preSubmitValid())
        return;
      if(this.currentUserEmailOrPhoneValid){
        this.axios.post(this.NET.API_URL + '/user/recoverPassword', {
          k: this.currentUserEmailOrPhone
        }).then((response) => {
          if(response.data.success)
            this.currentSuccess = true;
          else this.$swal('抱歉，提交失败了！', response.data.message, 'error');
        }).catch((e) => {
          this.$swal('抱歉，提交失败了！', e, 'error');
        });
      }
      else this.currentSuccess = true;
    }
  }
};
</script>