<template>
  <header :id="headerStyle">
    <div v-if="pageBackgroundImage" class="bg-img" id="def-header-bg" :style="'background-image: url(' + pageBackgroundImage + ');'">
      <div v-if="pageBackgroundOverlay" class="overlay" :style="'opacity: ' + pageBackgroundOverlayOpactity + ';'"></div>
    </div>
    <!-- Admin side area button -->
    <button v-if="isAdmin && isMobileView()" class="main-admin-sideare-header-sw-button-mobile" @click="switchAdminCollape()"><i :class="'fa ' + (isAdminCollape ? 'fa-arrow-right' : 'fa-bars')" aria-hidden="true"></i></button>
    <div :class="'container main-menu ' + headerMenuStyle">
      <!-- Admin side area fix -->
      <div v-if="isAdmin" :class="'main-admin-sideare-header' + (isAdminCollape?' collape':'')">
        <el-tooltip class="item" effect="dark" :content="isAdminCollape ? '显示菜单' : '折叠菜单'" placement="bottom">
          <button class="sw-button" @click="switchAdminCollape()"><i :class="'fa ' + (isAdminCollape ? 'fa-arrow-right' : 'fa-bars')" aria-hidden="true"></i></button>
        </el-tooltip>
      </div>
      <div class="container">
        <div :class="'row ' + headerRowClass">
          <div :class="'col' + (headerColWidth?'-'+headerColWidth:'') + ' nav-title d-flex align-items-center justify-content-between'  + (isAdmin && !isMobileView() ? ' pl-1' : '')">
            <div :class="'nav-header-text d-flex align-items-center justify-content-between' + (isAdmin && !isMobileView() ? (' main-admin-sideare-header-text' + (isAdminCollape ? ' collape' : '')): '')">
              <span class="logo" id="header-logo"></span>
              <a href="/" id="header-title">{{ menuTilte }}</a>
              <nav v-if="pageBreadcrumb && pageShowBreadcrumb" class="main-breadcrumb main-menu-breadcrumb" aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li
                    v-for="(item, index) in pageBreadcrumb"
                    :key="index"
                    :class="'breadcrumb-item' + (item.active ? ' active' : '')"
                  >
                    <span v-if="item.active">{{ item.title }}</span>
                    <a v-else :href="item.link">{{ item.title }}</a>
                  </li>
                </ol>
              </nav>
            </div>
            <button type="button" :class="menuMoblieShow ? 'flat-icon-close' : 'flat-icon-menu'" id="mobile-nav-toggle" @click="menuMoblieShow=!menuMoblieShow"></button>
            <nav id="nav-menu-container" class="nav-menu-container">
              <ul class="nav-menu sf-js-enabled sf-arrows" style="touch-action: auto;" id="header-menu">
                <li v-for="(menu, index) in menuData" :key="index" :class="isMenuActive(menu)">
                  <a v-if="isMenuActive(menu)=='menu-active'">{{ menu.name }}</a>
                  <a v-else :href="getMenuRealUrl(menu.link)">{{ menu.name }}</a>
                </li>
                <!--用户头像菜单组件-->
                <header-user-menu v-if="currentAuthed" 
                  :currentUserLevel="currentUserLevel" :currentUserName="currentUserName" 
                  :currentUserHead="currentUserHead" :currentUserMessageCount="currentUserMessageCount" ></header-user-menu>
                <li v-else><a :href="getMenuRealUrl('/sign-in/')">登录</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div v-if="pageBreadcrumb && pageShowBreadcrumb" class="main-breadcrumb-tile"></div>
    <!-- Mobile nav -->
    <nav id="mobile-nav" :class="'nav-menu-container' + (menuMoblieShow ? ' show' : '')">
      <li v-if="currentAuthed" class="nav-user">
        <button
                    v-if="currentUserLevel == 'admin'"
                    type="button"
                    class="flat-pill flat-btn flat-btn-transparent flat-danger mr-2"
                    v-on:click="gotToWriteArchive()"
                  >写文章</button>
                  <div id="current_user_center_dropdown" class="dropdown">
                    <img lass="current-user-head" :src="currentUserHead">
                    <span
                      v-if="currentUserMessageCount>0"
                      class="current-user-message-count"
                    >{{ currentUserMessageCount }}</span>
                    <div class="dropdown-menu shadow-dirty dropdown-menu-right">
                      <div class="message-list" id="current_user_message_list"></div>
                    </div>
                  </div>
                  <div id="current_user_dropdown" class="dropdown">
                    <span
                      class="current-user-name"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      data-offset="0,20"
                    >
                      {{ currentUserName }}
                      <i></i>
                    </span>
                    <div
                      v-if="currentUserLevel == 'admin' || currentUserLevel == 'writer'"
                      class="dropdown-menu dropdown-menu-right shadow-dirty"
                    >
                      <a class="dropdown-item" :href="getMenuRealUrl('/admin/')">博客控制台</a>
                      <a class="dropdown-item" :href="getMenuRealUrl('/admin/write-archives/')">写文章</a>
                      <a
                        class="dropdown-item"
                        :href="getMenuRealUrl('/admin/manage-archives/')"
                      >文章管理</a>
                      <a class="dropdown-item" :href="getMenuRealUrl('/admin/user-center/')">个人信息</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" :href="getMenuRealUrl('/sign-out/')">退出登录</a>
                    </div>
                    <div
                      v-else-if="currentUserLevel == 'guest'"
                      class="dropdown-menu dropdown-menu-right shadow-dirty"
                    >
                      <a class="dropdown-item" :href="getMenuRealUrl('/user/')">我的个人信息</a>
                      <a class="dropdown-item" :href="getMenuRealUrl('/sign-out/')">退出登录</a>
                    </div>
                    <div v-else class="dropdown-menu dropdown-menu-right shadow-dirty">
                      <a class="dropdown-item" :href="getMenuRealUrl('/sign-in/')">登录</a>
                      <a class="dropdown-item" :href="getMenuRealUrl('/sign-up/')">注册</a>
                    </div>
                  </div>
                </li>                  
      <ul class="" style="touch-action: auto;" id="">
        <li v-if="!currentAuthed"><a :href="getMenuRealUrl('/sign-in/')">登录</a></li>
        <li v-for="(menu, index) in menuData" :key="index" :class="isMenuActive(menu)">
          <a v-if="isMenuActive(menu)=='menu-active'">{{ menu.name }}</a>
          <a v-else :href="getMenuRealUrl(menu.link)" @click="menuMoblieShow=false">{{ menu.name }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters, mapActions } from "vuex";
import HeaderUserMenu from "./HeaderUserMenu"

export default {
  name: "Header",
  props: ["isAdmin"],
  computed: mapState({
    headerStyle: state => state.global.globalHeaderStyle,
    headerMenuStyle: state => state.global.globalHeaderMenuStyle,
    pageBackgroundImage: state => state.global.globalPageBackgroundImage,
    pageBackgroundOverlay: state => state.global.globalPageBackgroundOverlay,
    pageBackgroundOverlayOpactity: state =>
      state.global.globalPageBackgroundOverlayOpactity,
    pageBreadcrumb: state => state.global.globalPageBreadcrumb,
    pageShowBreadcrumb: state => state.global.globalPageShowBreadcrumb,
    isAdminCollape: state => state.global.globalAdminCollape,
    headerColWidth: state => state.global.globalHeaderColWidth,
    headerRowClass: state => state.global.globalHeaderRowClass,
  }),
  data() {
    return {
      menuDataOrg: null,
      menuData: null,
      menuMoblieShow: false,
      menuTilte: '',
      currentAuthed: false,
      currentUserName: "",
      currentUserHead: "",
      currentUserLevel: "",
      currentUserMessageCount: 0,
    };
  },
  components: {
    'header-user-menu': HeaderUserMenu
  },
  mounted() {
    this.init();
    this.menuDataOrg = serverSettings.HeaderMenu;
    this.menuTilte = serverSettings.SiteTitle;
  },
  methods: {
    init() {
      this.reset();
    },
    isMenuActive(menu) {
      return menu.forceActive || this.$route.path + "/" == menu.link || this.$route.path == menu.link
        ? "menu-active"
        : "";
    },
    switchAdminCollape() {
      this.$store.dispatch("global/switchAdminCollape");
    },
    addItem(menuItem) {
      var newArr = this.Utils.mergeJsonArray(this.menuDataOrg, { 0: menuItem });
      this.menuData = newArr;
    },
    reset() {
      var newArr = this.Utils.mergeJsonArray(this.menuDataOrg, {});
      this.menuData = newArr;
    },
    getMenuRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    initLoginInfo(authInfo) {
      if (authInfo) {
        this.currentAuthed = true;
        if (authInfo.friendlyName) this.currentUserName = authInfo.friendlyName;
        else this.currentUserName = authInfo.name;
        if (authInfo.headimg)
          this.currentUserHead = authInfo.headimg;
        else
          this.currentUserHead = require("../../assets/images/default/head-default.png");
        if (authInfo.level == this.ServerConsts.UserLevels.admin)
          this.currentUserLevel = "admin";
        else if (authInfo.level == this.ServerConsts.UserLevels.writer)
          this.currentUserLevel = "writer";
        else if (authInfo.level == this.ServerConsts.UserLevels.guest)
          this.currentUserLevel = "guest";
      } else this.currentAuthed = false;
    },
    authInfoInited() {
      this.initLoginInfo(this.$store.getters["auth/authInfo"]);
    },
    resetAuthInfo() {
      this.currentAuthed = false;
    },
    isMobileView(){
      return document.body.clientWidth < 576;
    },
  }
};
</script>

<style scoped>
.main-menu-breadcrumb{
  position: absolute;
  top: 60px;
}
.main-breadcrumb-tile{
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: #fff;
  height: 50px;
  z-index: 1;
}
.main-admin-sideare-header{
  position: absolute;
  background-color: #121f3e;
  top: 0;
  left: 0;
  height: 70px;
  width: 300px;
  transition: width ease-in-out .3s;
}
.main-admin-sideare-header > button{
  position: absolute;
  top: 18px;
  left: 283px;
  transition: left ease-in-out .3s;
  z-index: 1000;
}
.main-admin-sideare-header.collape > button{
  left: 45px;
}
.main-admin-sideare-header.collape{
  width: 65px;
}
.main-admin-sideare-header-text:not(.collape) > span,
.main-admin-sideare-header-text:not(.collape) > a {
  color: #fff;
}
.main-admin-sideare-header-text:not(.collape) > .logo {
  background-image: url(../../assets/images/logo/logo-white.svg);
}
.main-admin-sideare-header-text.collape > .logo {
  visibility: hidden;
}
.main-admin-sideare-header .sw-button {
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #fff;
  color: #000;
  outline: none;
}
.main-admin-sideare-header .sw-button:hover {
  background-color: #6195FF;
  border: 2px solid #6195FF;
  color: #fff;
  outline: none;
}
.main-admin-sideare-header-sw-button-mobile{
  position: absolute;
  top: 45px;
  left: -25px;
  text-align: right;
  display: inline-block;
  width: 50px;
  height: 30px;
  border-radius: 15px;
  background-color: #fff;
  border: 2px solid #fff;
  color: #000;
  font-size: 15px;
  z-index: 3200;
  outline: none;
}
.main-admin-sideare-header-sw-button-mobile:hover,.main-admin-sideare-header-sw-button-mobile:active{
  background-color: #6195FF;
  border: 2px solid #6195FF;
  color: #fff;
  outline: none;
}

@media (max-width: 576px) {
  .main-admin-sideare-header{
    display: none;
  }
  .main-menu-breadcrumb{
    position: absolute;
    top: 40px;
  }
  .main-breadcrumb-tile{
    height: 30px;
  }
}
</style>
