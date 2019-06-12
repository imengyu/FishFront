<template>
  <div id="app">
    <app-header ref="Header" v-if="isHeaderShow" v-bind:is-admin="isAdminPanel"></app-header>
    <div v-if="isAdminPanel">
      <el-container class="admin-area">
        <app-admin-sidearea></app-admin-sidearea>
        <el-container>
          <transition name="fade">
            <router-view ref="View" @publicHeaderAdd="publicHeaderAdd"></router-view>
          </transition>
          <el-footer class="better-footer"><span>&copy; 2019 FishBlog. UI Powered by <a href="https://element.eleme.cn">element-ui</a>.</span></el-footer>
        </el-container>
      </el-container>
    </div>
    <div v-else>
      <transition name="fade">
        <router-view @publicHeaderAdd="publicHeaderAdd"></router-view>
      </transition>
    </div>
    <app-footer ref="Footer" v-if="isFooterShow"></app-footer>
  </div>
</template>

<script>
import Header from './components/public/Header'
import Footer from './components/public/Footer'
import AdminSideArea from './views/admin/SideArea'
import serverConsts from './constants/serverConsts.js'
import { mapState } from 'vuex';

export default {
  name: 'App',
  data(){
    return {
      authInfoLoaded: false,
      authInfoSended: false,
    }
  },
  computed: mapState({  
    isFooterShow: state => state.global.globalFooterShow,
    isHeaderShow: state => state.global.globalHeaderShow,
    isAdminPanel: state => state.global.globalAdminPanel,
    isAdminCollape: state => state.global.globalAdminCollape,
  }),
  components: {
    'app-header': Header,
    'app-footer': Footer,
    'app-admin-sidearea': AdminSideArea,
  },
  mounted() {
    this.init();
  },
  watch:{
    $route(to,from){
      this.rePage(to);
      console.log(to.path);
    }
  },
  methods:{

      publicHeaderAdd: function (menuItem) {
        this.$refs.Header.addItem(menuItem);
      },
      publicHeaderReset() {
        if(this.$refs.Header)
          this.$refs.Header.reset();
      },

      //路由页面切换
      rePage(to){
        this.$nextTick(() => {
          //修改页面标题
          if (to.meta.title) document.title = to.meta.title + ' - ' + serverConsts.SiteTitle;
          else document.title = serverConsts.SiteTitle;
          this.publicHeaderReset();
          this.initLoginInfo(false);
        });　
      },
      //初始化
      init: function(){
        this.rePage(this.$route);
      },
      sendLoginfoInited(authed){
        this.authInfoSended = true;
        for(var i = 0;i<this.$children.length;i++){
          if(typeof this.$children[i].authInfoInited != 'undefined')
            this.$children[i].authInfoInited(authed);
        }
        if(this.$refs.View){
          if(typeof this.$refs.View.authInfoInited != 'undefined')
            this.$refs.View.authInfoInited(authed);
        }

      },
      //初始化登录信息
      initLoginInfo: function(notsend){
        var main = this;
        if(main.$store.getters["auth/authed"]) {
          main.sendLoginfoInited(true);
          return;
        }
        //请求服务器是否登录
        this.axios.get(main.NET.API_URL + "/auth/auth-test").then((response)=>{

          if(response.data.success){
            main.$store.dispatch("auth/setAuthInfo", response.data.data);
            main.$store.dispatch("auth/setAuthed", true);
            main.publicHeaderReset();
            if(!notsend) main.sendLoginfoInited(true);
          }else{
            main.$store.dispatch("auth/setAuthed", false);
            main.$store.dispatch("auth/setAuthInfo", null);
            main.publicHeaderReset();
            if(main.$store.getters["global/adminPanel"])
              main.redirectToLogin(response.data.data.authCode);
            else if(!notsend) main.sendLoginfoInited(false);
          }
          
        }).catch((response)=>{
          main.$store.dispatch("auth/setAuthed", false);
          main.$store.dispatch("auth/setAuthInfo", null);
          main.publicHeaderReset();
          console.log(response);
          if(!notsend) main.sendLoginfoInited(false);
        })
      },
      //重定向到登录页面使用户登录
      redirectToLogin(errCode) {
        var authCode = {
          FAIL_BAD_TOKEN: -2,
          FAIL_EXPIRED: -3,
          FAIL_NOT_LOGIN: -6,
          FAIL_BAD_IP: -8,
        };
        var err;
        if(errCode == authCode.FAIL_BAD_TOKEN || errCode == authCode.FAIL_BAD_IP) err='BadRequest';
        else if(errCode == authCode.FAIL_EXPIRED) err='SessionOut';
        else if(errCode == authCode.FAIL_NOT_LOGIN) err='RequestLogin';
        else err='UnknowErr';
        this.Utils.jump('/sign-in/?error=' + err + '&redirect_url=' + encodeURIComponent(location.href));
      },
  }

}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  will-change: transform;
  transition: all .3s;
  opacity: 1;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-active {
  opacity: 0;
}
.admin-area{
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 100%;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
}
.better-footer{
  position: relative;
  height: 35px!important;
  font-size: 14px;
}
.better-footer span{
  position: absolute;
  bottom: 5px;
  right: 30px;
  color: #a3a3a3;
}
</style>
