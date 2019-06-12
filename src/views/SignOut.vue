<template>
  <article id="main" class="sm-padding bg-grey-no-border">
    <div class="container">
      <div class="text-center mt-4">
        <p class="h2">{{ logoutInfo }}</p>
        <p class="text-secondary">{{ logoutDetails }}</p>
      </div>
      <div v-if="logoutFinish" class="row align-items-center justify-content-center mt-5">
        <button v-if="logoutLastPage" type="button" class="btn btn-secondary" v-on:click="jumpBack()">返回上一页</button>
        <button v-else type="button" class="btn btn-secondary" v-on:click="jump('/')">返回主页</button>
        <button type="button" class="btn btn-primary ml-2" v-on:click="jump('/sign-in/')">重新登录</button>
      </div>
    </div>
  </article>
</template>

<script>

export default {
  name: "SignOut",
  data() {
    return {
        logoutInfo: '正在退出登录...',
        logoutDetails: '',
        logoutFinish: false,
        logoutLastPage: null,
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
      this.$store.dispatch('global/setFooterStyle', "small");
      this.$emit("publicHeaderAdd", {
        name: "用户中心",
        link: "/sign-out/"
      });
      this.rePage();
    },
    rePage() {
      this.logoutLastPage = this.$route.query.redirect_url;
    },
    jump(link){
      location.href=this.getJumpRealUrl(link)
    },
    jumpBack(){
      location.href = decodeURIComponent(this.logoutLastPage);
    },
    authInfoInited(authed){
      if(this.logoutFinish)
        return;
      if (authed) {
        this.signOut();
        this.logoutFinish = true;
      }else{
        this.logoutFinish = true;
        this.logoutInfo = '您没有登录';
        this.logoutDetails = '或者登录信息已经过期，请重新登录';
      }
    },
    signOut(){
      this.axios.get(this.NET.API_URL + "/auth/auth-end").then((response) => {
        if(response.data.success){
          this.logoutInfo = '退出登录成功';
          this.logoutDetails = '您的账号已经安全退出';
          this.logoutFinish = true;
          this.authInfo = null;        
          if(response.data.data && response.data.data.authTokenName)
            this.Utils.delCookie(response.data.data.authTokenName);
          this.$store.dispatch("auth/setAuthed", false);
          this.$store.dispatch("auth/setAuthInfo", null);
        }
      }).catch(response => {
        this.logoutFinish = false;
        this.logoutInfo = '退出登录失败';
        this.$swal("退出登录失败", "错误信息：" + response, "error"); 
      });
    },
    getJumpRealUrl(link){
      return this.NET.URL_PREFIX + link;
    },
  }
};
</script>