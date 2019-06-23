<template>
  <el-aside :width="(isAdminCollape&&!isSideFloated) ? '65px' : '300px'"
    :class="'better-scroll-white el-aside-fix' + (isAdminCollape ? ' collape' : '')">
    <el-menu :default-active="currentPath" :collapse="isAdminCollape&&!isSideFloated" :unique-opened="true" :router="true"> 
      <el-menu-item index="/admin/"><i class="el-icon-data-analysis"></i><span slot="title">仪表盘</span></el-menu-item>
      <el-submenu index="archives">
        <template slot="title"><i class="el-icon-notebook-2"></i><span slot="title">文章管理</span></template>
        <el-menu-item index="/admin/manage-archives/"><span slot="title">文章列表</span></el-menu-item>
        <el-menu-item index="/admin/write-archive/"><span slot="title">写文章</span></el-menu-item>
      </el-submenu>
      <el-menu-item index="/admin/manage-classfication/"><i class="el-icon-collection-tag"></i><span slot="title">分类和标签</span></el-menu-item>
      <el-menu-item index="/admin/skin/"><i class="el-icon-magic-stick"></i><span slot="title">博客外观</span></el-menu-item>
      <el-submenu index="user-management">
        <template slot="title"><i class="el-icon-user"></i><span slot="title">作者和用户管理</span></template>
        <el-menu-item index="/admin/user-center/"><span slot="title">个人信息</span></el-menu-item>
        <el-menu-item index="/admin/manage-users/"><span slot="title">管理作者和用户</span></el-menu-item>
        <el-menu-item index="/admin/new-user/"><span slot="title">新建作者账号</span></el-menu-item>
      </el-submenu>
      <el-menu-item index="/admin/settings/"><i class="el-icon-setting"></i><span slot="title">系统通用设置</span></el-menu-item>
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
    isSideFloated: function(){
      return document.body.clientWidth < 768;
    },
    currentPath: function(){
      return this.$router.path ? this.$router.path : '/admin/'
    },
  }),
  methods: {
    init: function() {
      this.$store.dispatch("global/resetHeader");
      this.$store.dispatch("global/setAdminPanel", true);
      if(document.body.clientWidth < 768)
        this.$store.dispatch("global/setAdminCollape", true);
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
  }
};
</script>

<style>
/*扩展 el-aside 在移动端 以及样式修改*/
.el-aside-fix {
  background-color: #121f3e;
}
.el-aside-fix .el-menu{
  background: transparent;
  border: none;
}
.el-aside-fix .el-menu-item {
  background-color: transparent;
  font-size: 14px;
  color: #fff;
  padding: 0 20px;
  cursor: pointer;
}
.el-aside-fix .el-menu-item i,
.el-aside-fix .el-menu--inline,
.el-aside-fix .el-submenu__title,
.el-aside-fix .el-submenu__title i {
  color: #fff;
}
.el-aside-fix .el-submenu__title:hover {
    background-color: rgba(255, 255, 255, .1);
}
.el-aside-fix .el-menu-item:hover,.el-aside-fix .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, .1);
}
.el-aside-fix .el-menu-item.is-active::after {
  position: absolute;
  content: "";
  top: calc(50% - 8px);
  left: 0px;
  width: 3px;
  height: 20px;
  border-radius: 1.5px;
  background-color: #55a8fd;
}

@media (max-width: 768px) {
  .el-aside-fix {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 90%;
    transition: left ease-in-out .8s;
    background-color: #fff;
    z-index: 3100;
  }
  .el-aside-fix.collape {
    left: calc(-90%);
  }
}

</style>
