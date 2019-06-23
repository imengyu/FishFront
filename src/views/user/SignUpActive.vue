<template>
  <article id="main" class="sm-padding bg-grey-no-border" style="padding-top:70px">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4" style="padding:20px">
          <div v-if="currentSubmting">
            <div
              class="box full text-center d-flex justify-content-center align-items-center flex-column"
            >
              <p class="text-secondary mt-5 mb-5">
                正在激活...
                <br>
              </p>
            </div>
          </div>
          <div v-else-if="currentSuccess">
            <div
              class="box full text-center d-flex justify-content-center align-items-center flex-column"
            >
              <i
                class="fa fa-check-circle-o text-success"
                aria-hidden="true"
                style="font-size: 3.5em"
              ></i>
              <p class="text-secondary mt-2">
                激活成功
                <br>
                <span class="text-secondary">您的账号现在已经可以登录了</span>
              </p>
              <div>
                <button type="button" class="btn btn-secondary" @click="jump('/')">返回主页</button>
                <button type="button ml-2" class="btn btn-primary" @click="jump('/sign-in/')">立即登录</button>
              </div>
            </div>
          </div>
          <div v-else>
            <div
              class="box full text-center d-flex justify-content-center align-items-center flex-column"
            >
              <i
                class="fa fa-times-circle-o text-danger"
                aria-hidden="true"
                style="font-size: 3.5em"
              ></i>
              <p class="text-secondary mt-2">
                激活失败
                <br>
                <span class="text-secondary">{{ currentSubmtError }}</span>
              </p>
              <div>
                <button type="button" class="btn btn-secondary" @click="jump('/')">返回主页</button>
                <button v-if="currentSubmtCanRetry" type="button ml-2" class="btn btn-primary" @click="submitActive()">重试</button>
              </div>
            </div>
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
  name: "SignUpActive",
  data() {
    return {
      currentSuccess: false,
      currentSubmting: false,
      currentSubmtError: '',
      currentSubmtCanRetry: false,
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
      var token = this.$route.query.token;
      if(this.Utils.isNullOrEmpty(token)) this.currentSubmtError = '错误的请求';
      else this.submitActive();
    },
    submitActive() {
      this.currentSubmting = true;
      var t = toast.toast("正在提交中...", "loading", -1);
      var md5 = require('md5');
      
      this.axios.post(this.NET.API_URL + "/user/active",{
        k: this.$route.query.token
      }).then(response => {
        this.currentSubmtCanRetry = false;
        this.currentSubmting = false;
        toast.toastClose(t);
        if (response.data.success) this.currentSuccess = true;
        else this.currentSubmtError = "错误信息：" + response.data.message;
      }).catch(response => {
        this.currentSubmtCanRetry = true;
        this.currentSubmting = false;
        this.currentSubmtError = "错误信息：" + response;
        toast.toastClose(t);
      });
      
    }
  }
};
</script>