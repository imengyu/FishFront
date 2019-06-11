<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px 36px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>写作</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="better-scroll-white" style="padding:0 36px">
      <el-tabs v-model="currentTab" @tab-click="handleTabClick">
        <el-tab-pane label="写作" name="write">

        </el-tab-pane>
        <el-tab-pane label="评论" name="comments">

        </el-tab-pane>
        <el-tab-pane label="媒体库" name="media-center">

        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import jQuery from "jquery";
import Chart from "chart.js";
import serverConsts from "../../constants/serverConsts.js";
import toast from "../../assets/lib/toast/toast.simply.js";

var $ = jQuery;

export default {
  name: "ManageArchives",
  data() {
    return {
      currentUser: null,
      currentUserIsAdmin: false,

      currentTab: "write"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.$store.dispatch("global/resetHeader");
      this.$store.dispatch("global/setAdminPanel", true);
      this.$store.dispatch("global/switchFooter", false);
      this.$store.dispatch("global/setHeaderMenuStyle", "main-menu-white full");
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    authInfoInited() {
      this.currentUser = this.$store.getters["auth/authInfo"];
      this.currentUserIsAdmin =
        this.currentUser.level == serverConsts.UserLevels.admin;
    },

    //Gets
    getPostStatusString(post) {
      return this.Utils.getPostStatusString(post.status);
    },

    //Events
    handleTabClick(tab) {
      if (tab.name == "all" && this.postListAllLoadStatus == "notload")
        this.loadListAll();
      if (tab.name == "draft" && this.postListDraftLoadStatus == "notload")
        this.loadListDraft();
      if (tab.name == "publish" && this.postListPublishLoadStatus == "notload")
        this.loadListPublish();
    },

  }
};
</script>