<template>
  <header :id="headerStyle">
    <div v-if="pageBackgroundImage" class="bg-img" id="def-header-bg" :style="'background-image: url(' + pageBackgroundImage + ');'">
      <div v-if="pageBackgroundOverlay" class="overlay" :style="'opacity: ' + pageBackgroundOverlayOpactity + ';'"></div>
    </div>
    <div :class="'container main-menu ' + headerMenuStyle">
    <div class="container">
      <div class="row">
        <div class="col nav-title d-flex align-items-center justify-content-between ">
        <div class="nav-header-text">
          <span class="logo" id="header-logo"></span>
          <a href="/" id="header-title">ALONE SPACE</a>
        </div>
        <button type="button" class="icon-menu" id="mobile-nav-toggle"></button>
        <nav id="nav-menu-container" class="nav-menu-container">
          <ul class="nav-menu sf-js-enabled sf-arrows" style="touch-action: auto;" id="header-menu">
            <li v-for="(menu, index) in menuData" :key="index" :class="isMenuActive(menu.link)">
              <a v-if="isMenuActive(menu.link)=='menu-active'">{{ menu.name }}</a>
              <a v-else :href="getMenuRealUrl(menu.link)">{{ menu.name }}</a>
            </li>
            <li v-if="currentAuthed" class="nav-user">
              <button v-if="currentUserLevel == 'admin'" type="button" class="flat-pill flat-btn flat-btn-transparent flat-danger mr-2" v-on:click="gotToWriteArchive()">写文章</button>
              <div id="current_user_center_dropdown" class="dropdown">
                <img lass="current-user-head" :src="currentUserHead" >
                <span v-if="currentUserMessageCount>0" class="current-user-message-count">{{ currentUserMessageCount }}</span>
                <div class="dropdown-menu shadow-dirty dropdown-menu-right">
                  <div class="message-list" id="current_user_message_list">
                    
                  </div>
                </div>
              </div>
              <div id="current_user_dropdown" class="dropdown">
                <span class="current-user-name" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="0,20" >
                  {{ currentUserName }}
                  <i></i>
                </span>
                <div v-if="currentUserLevel == 'admin' || currentUserLevel == 'write'" class="dropdown-menu dropdown-menu-right shadow-dirty">
                  <a class="dropdown-item" :href="getMenuRealUrl('/admin/')">博客控制台</a>
                  <a class="dropdown-item" :href="getMenuRealUrl('/admin/write-archives/')">写文章</a>
                  <a class="dropdown-item" :href="getMenuRealUrl('/admin/manage-archives/')">文章管理</a>
                  <a class="dropdown-item" :href="getMenuRealUrl('/admin/user-center/')">个人信息</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" :href="getMenuRealUrl('/sign-out/')">退出登录</a>
                </div>
                <div v-else-if="currentUserLevel == 'guest'" class="dropdown-menu dropdown-menu-right shadow-dirty">
                  <a class="dropdown-item" :href="getMenuRealUrl('/user/')">我的个人信息</a>
                  <a class="dropdown-item" :href="getMenuRealUrl('/sign-out/')">退出登录</a>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        </div>
      </div>
      <div v-if="pageShowBreadcrumb && pageBreadcrumb" class="main-breadcrumb">
        <div class="container">
          <div class="row justify-content-start">
            <div class="col">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li v-for="(item, index) in pageBreadcrumb" :key="index" 
                    :class="'breadcrumb-item' + (item.active ? ' active' : '')">
                    <span v-if="item.active">{{ item.title }}</span>
                    <a v-else :href="item.link">{{ item.title }}</a>
                    </li>
                </ol>
              </nav>
            </div>
          </div> 
        </div> 
      </div>
      </div>
    </div>

  </header>
</template>

<script>
import Vue from "vue";
import { mapState,mapGetters,mapActions } from 'vuex';

export default {
  name: "Header",
  computed: mapState({

    headerStyle: state => state.global.globalHeaderStyle,
    headerMenuStyle: state => state.global.globalHeaderMenuStyle,
    pageBackgroundImage: state => state.global.globalPageBackgroundImage,
    pageBackgroundOverlay: state => state.global.globalPageBackgroundOverlay,
    pageBackgroundOverlayOpactity: state => state.global.globalPageBackgroundOverlayOpactity,
    pageBreadcrumb: state => state.global.globalPageBreadcrumb,
    pageShowBreadcrumb: state => state.global.globalPageShowBreadcrumb,
  }),
  data() {
    return {
      menuDataOrg: [
        {
          name: "主页",
          link: "/"
        },
        {
          name: "文章",
          link: "/archives/"
        },
        {
          name: "归档",
          link: "/archives/month/"
        },
        {
          name: "关于",
          link: "/archives/post/about/"
        }
      ],
      menuData: null,
      currentAuthed: false,
      currentUserName: '',
      currentUserHead: '',
      currentUserLevel: '',
      currentUserMessageCount: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      this.reset();
    },
    isMenuActive(link) {
      return this.$route.path + "/" == link || this.$route.path == link
        ? "menu-active"
        : "";
    },
    addItem(menuItem) {
      var newArr = this.Utils.mergeJsonArray(this.menuDataOrg, { 0:menuItem });
      this.menuData = newArr;
    },
    reset(){
      var newArr = this.Utils.mergeJsonArray(this.menuDataOrg, {});
      this.menuData = newArr;
    },
    getMenuRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    gotToWriteArchive(){
      location.href = this.getMenuRealUrl('/admin/write-archive/')
    },
    initLoginInfo(authInfo) {
      if(authInfo){
        this.currentAuthed = true;
        if(authInfo.friendlyName) this.currentUserName = authInfo.friendlyName;
        else this.currentUserName = authInfo.name;
        if(authInfo.headimg) this.currentUserHead = this.Utils.getImageUrlFormHash(authInfo.headimg);
        else this.currentUserHead = require("../../assets/images/default/head-default.png");
        if(authInfo.level==this.ServerConsts.UserLevels.admin) this.currentUserLevel = 'admin';
        else if(authInfo.level==this.ServerConsts.UserLevels.writer) this.currentUserLevel = 'writer';
        else if(authInfo.level==this.ServerConsts.UserLevels.guest) this.currentUserLevel = 'guest';
      }else this.currentAuthed = false;
    },
    resetAuthInfo() {
      this.currentAuthed = false;
    }
  }
};
</script>

<style>
  /*
  #header .main-menu-white .nav-menu-container .menu-active > a{
    border-radius: 15px;
    background-color: rgba(255,255,255,.2);
    padding: 3px 13px 0 13px;
  }
  #header .main-menu-black .nav-menu-container .menu-active > a{
    border-radius: 15px;
    background-color: rgba(0,0,0,.2);
    padding: 3px 13px 0 13px;
  }
  */
</style>
