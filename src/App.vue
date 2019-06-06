<template>
  <div id="app">
    <app-header ref="Header" v-if="isHeaderShow"></app-header>
    <router-view 
      @publicHeaderAdd="publicHeaderAdd"
      ></router-view>
    <app-footer v-if="isFooterShow"></app-footer>
  </div>
</template>

<script>
import Header from './components/public/Header'
import Footer from './components/public/Footer'
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
      this.rePage();
      console.log(to.path);
    }
  },
  methods:{

      publicHeaderAdd: function (menuItem) {
        this.$refs.Header.addItem(menuItem);
      },
      publicHeaderReset() {
        if(this.$store.getters["global/isHeaderShow"]){
          this.$refs.Header.reset();
          this.$refs.Header.initLoginInfo(this.authInfo);
        }
      },

      //路由页面切换
      rePage(){
        this.initLoginInfo();
        this.publicHeaderReset();
      },
      //初始化
      init: function(){
        this.initLoginInfo();
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
          if(!notsend) main.sendLoginfoInited();
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

</style>
