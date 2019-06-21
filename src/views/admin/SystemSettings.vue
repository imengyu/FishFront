<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main v-if="currentUserHasPrivilege" class="better-scroll-white">

    </el-main>
    <el-main v-else>
      <div class="container" style="height:450px">
        <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
          <p class="text-secondary mt-2">
            <span class="h4">您当前无权访问此页面</span>
            <br>您必须拥有 <span class="text-primary">修改系统设置</span> 权限，才能查看此页面。
          </p>
          <el-button type="primary" round @click="jump('/admin/')">返回主页</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Chart from "chart.js";
import serverConsts from '../../constants/serverConsts.js'

export default {
  name: "SystemSetting",
  data() {
    return {
      currentUserIsAdmin: false,
      currentUserHasPrivilege: false,
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
    authInfoInited(authed) {
      if(authed){ 
        this.currentUser = this.$store.getters["auth/authInfo"];
        if(this.currentUser) this.currentUserIsAdmin = this.currentUser.level == serverConsts.UserLevels.admin;
        this.currentUserHasPrivilege = this.Utils.getUserHasPrivilege(this.currentUser, serverConsts.UserPrivileges.globalSettings);
      }
    },


  }
};
</script>