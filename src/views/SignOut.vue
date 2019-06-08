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
import jQuery from 'jquery'

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
      console.log(decodeURIComponent(this.logoutLastPage));
    },
    jump(link){
      location.href=this.getJumpRealUrl(link)
    },
    jumpBack(){
      location.href = decodeURIComponent(this.logoutLastPage);
    },
    authInfoInited(){
      if(this.logoutFinish)
        return;
      if (this.$parent.getAuthed()) {
        this.signOut();
        this.logoutFinish = true;
      }else{
        this.logoutFinish = true;
        this.logoutInfo = '您没有登录';
        this.logoutDetails = '或者登录信息已经过期，请重新登录';
      }
    },
    signOut(){
        var main = this;
        jQuery.ajax({
            type: 'get',
            url: main.NET.API_URL + "/auth/auth-end",
            crossDomain: true,
            xhrFields: { withCredentials: true },
            success: function (rep) {
                main.authInfo = rep.data;
                if(rep.success){
                    if(rep.data && rep.data.authTokenName)
                        main.Utils.delCookie(rep.data.authTokenName);
                }

                main.logoutInfo = '退出登录成功';
                main.logoutDetails = '您的账号已经安全退出';
                main.logoutFinish = true;
                main.$parent.publicHeaderReset();
            },
            error: function(jqXHR, errMsg) {
                main.logoutFinish = false;
                main.logoutInfo = '退出登录失败';
                main.$swal("退出登录失败", "请求失败 : " + errMsg, "error");
            }
        })
    },
    getJumpRealUrl(link){
      return this.NET.URL_PREFIX + link;
    },
  }
};
</script>