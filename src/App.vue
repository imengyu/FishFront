<template>
  <div id="app">
    <app-header ref="Header" 
      v-if="headerShow"
      v-bind:header-style="headerStyle"
      v-bind:page-background-image="pageBackgroundImage"
      v-bind:header-menu-style="headerMenuStyle"></app-header>
    <router-view 
      @publicHeader="publicHeader" 
      @publicFooter="publicFooter" 
      @publicHeaderAdd="publicHeaderAdd"
      ></router-view>
    <app-footer 
      v-if="footerShow"
      v-bind:footer-style="footerStyle"></app-footer>
  </div>
</template>

<script>
import Header from './components/public/Header'
import Footer from './components/public/Footer'
import jQuery from 'jquery'


export default {
  name: 'App',
  data(){
    return {
      headerShow: true,
      headerStyle: 'header-minimum',
      headerMenuStyle: 'main-menu-white',
      pageBackgroundImage: null,
      footerShow: true,
      footerStyle: 'normal',
      authInfo: null,
      authed: false,
      authInfoLoaded: false,
      authInfoSended: false,
    }
  },
  components: {
    'app-header': Header,
    'app-footer': Footer,
  },
  mounted() {
    this.init();
  },
  methods:{
      //是否显示头部
      publicHeader: function (bool) {
        this.headerShow = bool;
      },
      publicHeaderAdd: function (menuItem) {
        this.$refs.Header.addItem(menuItem);
      },
      publicHeaderImage: function (img) {
        this.pageBackgroundImage = img;
      },
      publicHeaderStyle: function (st) {
        this.headerStyle = st;
      },
      publicHeaderMeuStyle: function (st) {
        this.headerMenuStyle = st;
      },
      publicHeaderStyleReset: function () {
        this.headerStyle = 'header-minimum';
        this.headerMenuStyle = 'main-menu-white';
        this.pageBackgroundImage = null;
        if(this.headerShow){
          this.$refs.Header.reset();
          this.$refs.Header.initLoginInfo(this.authInfo);
        }
      },
      publicHeaderReset: function () {
        //this.headerStyle = 'header-minimum';
        //this.headerMenuStyle = 'main-menu-white';
        //this.pageBackgroundImage = null;
        if(this.headerShow){
          this.$refs.Header.reset();
          this.$refs.Header.initLoginInfo(this.authInfo);
        }
      },
      //是否显示底部
      publicFooterReset: function () {
        this.footerShow = true;
        this.footerStyle = 'normal';
      },
      publicFooter: function (bool) {
        this.footerShow = bool;
      },
      publicFooterStyle: function (st) {
        this.footerStyle = st;
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
              if(!notsend) main.sendLoginfoInited();
            }else{
              main.authInfo = null;
              main.authed = false;
              main.publicHeaderReset();
              if(!notsend) main.sendLoginfoInited();
            }
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
