<template>
  <div id="app">
    <app-header ref="Header" v-if="isHeaderShow"></app-header>
    <transition name="fade">
      
        <router-view 
          @publicHeaderAdd="publicHeaderAdd"
        ></router-view>
    
    </transition>
    <app-footer v-if="isFooterShow"></app-footer>
  </div>
</template>

<script>
import Header from './components/public/Header'
import Footer from './components/public/Footer'
import serverConsts from './constants/serverConsts.js'
import jQuery from 'jquery'
import { mapState } from 'vuex';

export default {
  name: 'App',
  data(){
    return {
      authInfo: null,
      authed: false,
      authInfoLoaded: false,
      authInfoSended: false,
    }
  },
  computed: mapState({  
    isFooterShow: state => state.global.globalFooterShow,
    isHeaderShow: state => state.global.globalHeaderShow,
  }),
  components: {
    'app-header': Header,
    'app-footer': Footer,
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
      sendLoginfoInited(){
        this.authInfoSended = true;
        for(var i = 0;i<this.$children.length;i++){
          if(typeof this.$children[i].authInfoInited != 'undefined')
            this.$children[i].authInfoInited();
        }
      },
      //初始化登录信息
      initLoginInfo: function(notsend){
        var main = this;
        if(main.authed) {
          main.sendLoginfoInited();
          return;
        }
        
        jQuery.ajax({
          type: 'get',
          url: main.NET.API_URL + "/auth/auth-test",
          crossDomain: true,
          xhrFields: { withCredentials: true },
          success: function (rep) {
            if(rep.success){
              main.authInfo = rep.data;
              main.authed = true;
              main.publicHeaderReset();
            }else{
              main.authInfo = null;
              main.authed = false;
              main.publicHeaderReset();
            }
            if(!notsend) main.sendLoginfoInited();
          },
          error(){
            main.authInfo = null;
            main.authed = false;
            main.publicHeaderReset();
            if(!notsend) main.sendLoginfoInited();
          }
        })
        
      },
      //获取登录信息
      getAuthInfo: function(){
        return this.authInfo;
      },
      //获取当前用户是否登录
      getAuthed: function(){
        return this.authed;
      }
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
</style>
