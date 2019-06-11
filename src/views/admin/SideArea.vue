<template>
  <el-aside :width="isAdminCollape ? '65px' : '300px'" style="background-color: rgb(238, 241, 246)" class="better-scroll-white">
    <el-menu :default-active="getDefaultPath()" :collapse="isAdminCollape" :unique-opened="true" :router="true"> 
      <el-menu-item index="/admin/"><i class="el-icon-data-analysis"></i><span slot="title">仪表盘</span></el-menu-item>
      <el-submenu index="archives">
        <template slot="title"><i class="el-icon-notebook-2"></i><span slot="title">文章管理</span></template>
        <el-menu-item index="/admin/manage-archives/"><span slot="title">文章列表</span></el-menu-item>
        <el-menu-item index="/admin/write-archives/"><span slot="title">写文章</span></el-menu-item>
      </el-submenu>
      <el-menu-item index="/admin/media-center/"><i class="el-icon-film"></i><span slot="title">媒体库</span></el-menu-item>
      <el-menu-item index="/admin/manage-classfication/"><i class="el-icon-collection-tag"></i><span slot="title">分类和标签</span></el-menu-item>
      <el-submenu index="user-management">
        <template slot="title"><i class="el-icon-user"></i><span slot="title">作者和用户管理</span></template>
        <el-menu-item index="/admin/user-center/"><span slot="title">个人信息</span></el-menu-item>
        <el-menu-item index="/admin/manage-users/"><span slot="title">管理作者和用户</span></el-menu-item>
        <el-menu-item index="/admin/new-user/"><span slot="title">新建作者账号</span></el-menu-item>
      </el-submenu>
      <el-menu-item index="settings"><i class="el-icon-setting"></i><span slot="title">系统通用设置</span></el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import jQuery from "jquery";
import { mapState } from 'vuex';

export default {
  name: "AdminSideArea",
  data() {
    return {

    };
  },
  mounted() {
    this.init();
  },
  computed: mapState({  
    isAdminCollape: state => state.global.globalAdminCollape,
  }),
  methods: {
    init: function() {
      this.$store.dispatch("global/resetHeader");
      this.$store.dispatch("global/setAdminPanel", true);
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getDefaultPath(){
      return this.$router.path;
    },
  }
};
</script>