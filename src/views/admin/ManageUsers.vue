<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px 36px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>作者和用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理作者和用户</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="better-scroll-white" style="padding:30px 56px 30px 36px">
      <div v-if="tableUsersLoadStatus.indexOf('error')==0" class="box">
        <div class="container" style="height:450px">
          <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
            <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
            <p class="text-secondary mt-2">
              <span class="h4">加载失败</span>
              <br>
              {{ tableUsersLoadStatus.split(':')[1] }}
            </p>
            <el-button type="primary" round @click="loadUserTable()">重试</el-button>
          </div>
        </div>
      </div>
      <el-table
            v-else
            empty-text="没有数据"
            :data="tableUsersDatas"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="tableUsersLoadStatus=='loading'"
          >
            <el-table-column prop="id" label="ID" width="40"></el-table-column>
            
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑用户信息</el-button>
                <el-button v-if="scope.row.level==0" size="mini" type="info" @click="handleBand(scope.$index, scope.row, true)">封禁用户</el-button>
                <el-button v-else size="mini" type="success" @click="handleBand(scope.$index, scope.row, false)">解禁用户</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">注销用户</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-pagination
              class="btn-inline float-right"
              background
              layout="prev, pager, next"
              :page-count="tableUsersPageAll"
              :current-page="tableUsersPageCurrent"
              v-on:current-change="handlePage"
            ></el-pagination>
            <el-checkbox v-model="tableUsersShowTourist" @change="loadUserTable(0)">显示游客</el-checkbox>
            每页显示：
            <el-select
              style="width:90px"
              v-model="tableUsersPageSize"
              placeholder="请选择"
              @change="loadListAll"
              size="small"
            >
              <el-option v-for="item in tableListSizeOpinions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
    </el-main>
  </el-container>
</template>

<script>
import serverConsts from "../../constants/serverConsts.js";
import toast from "../../assets/lib/toast/toast.simply.js";

export default {
  name: "ManageUsers",
  data() {
    return {
      currentUser: null,

      tableUsersPageSize: 10,
      tableUsersLoadStatus: "notload",
      tableUsersDatas: null,
      tableUsersPageCurrent: 1,
      tableUsersPageAll: 1,
      tableUsersShowTourist: false,
      tableListSizeOpinions: [
        {
          value: 10,
          label: "10条"
        },
        {
          value: 20,
          label: "20条"
        },
        {
          value: 30,
          label: "30条"
        },
        {
          value: 50,
          label: "50条"
        }
      ],
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
      this.loadUserTable();
    },

    //Gets
    getLevelCurrentUser() {
      var html = "";
      var user = this.currentUser;
      if (user.level == serverConsts.UserLevels.admin)
        html =
          '<span class="tag-post-prefix bg-danger pt-0 pb-0">管理员</span>';
      else if (user.level == serverConsts.UserLevels.writer)
        html = '<span class="tag-post-prefix bg-primary pt-0 pb-0">作者</span>';
      else if (user.level == serverConsts.UserLevels.guest)
        html = '<span class="tag-post-prefix bg-success pt-0 pb-0">游客</span>';
      else if (user.level == 0)
        html =
          '<span class="tag-post-prefix bg-secondary pt-0 pb-0">已封禁</span>';
      return html;
    },
    getPrivilegeCurrentUser() {
      var html = "";
      var user = this.currentUser;

      if (user.level == serverConsts.UserLevels.admin) {
        html +=
          '<div class="tag-mgr-item bg-dark text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理员拥有所有权限</div>';
      } else {
        if (
          getUserHasPrivilege(
            user,
            serverConsts.UserPrivileges.manageAllArchives
          )
        )
          html +=
            '<div class="tag-mgr-item bg-danger text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理所有文章权限</div>';
        if (
          getUserHasPrivilege(
            user,
            serverConsts.UserPrivileges.manageClassAndTags
          )
        )
          html +=
            '<div class="tag-mgr-item bg-primary text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理分类标签权限</div>';
        if (
          getUserHasPrivilege(
            user,
            serverConsts.UserPrivileges.manageMediaCenter
          )
        )
          html +=
            '<div class="tag-mgr-item bg-info text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理媒体库权限</div>';
        if (getUserHasPrivilege(user, serverConsts.UserPrivileges.manageUsers))
          html +=
            '<div class="tag-mgr-item bg-dark text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理其他用户权限</div>';
        if (
          getUserHasPrivilege(user, serverConsts.UserPrivileges.gaintPrivilege)
        )
          html +=
            '<div class="tag-mgr-item bg-primary text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">授予用户权限权限</div>';
        if (
          getUserHasPrivilege(user, serverConsts.UserPrivileges.globalSettings)
        )
          html +=
            '<div class="tag-mgr-item bg-warning text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">修改系统设置权限</div>';
      }
      return html;
    },
    getUserHead() {
      if (this.Utils.isNullOrEmpty(this.currentUser.headimg))
        return require("../../assets/images/default/head-default.png");
      else return this.Utils.getImageUrlFormHash(this.currentUser.headimg);
    },

    //Events

    handleEdit(index, user) {
      
    },
    handleDelete(index, user) {
      
    },
    handleBand(index, user, band){

    },
    handlePage(page){
      this.loadUserTable(page);
    },

    //Datas
    loadUserTable(page) {
      if(typeof page != 'undefined') this.tableUsersPageCurrent = page;
      this.tableUsersLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/users/" +
        (this.tableUsersPageCurrent - 1) +
        "/" +
        this.tableUsersPageSize +
        "?=" +
        (this.postListAllShowAllArchives ? "0" : this.currentUser.id);
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.tableUsersDatas = response.data.data.content;
            this.tableUsersPageAll = response.data.data.totalPages;
            this.tableUsersLoadStatus = "loaded";
          } else this.tableUsersLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.tableUsersLoadStatus = "错误: " + response;
        });

    }
  }
};
</script>

<style>
.el-form-item.el-form-item.el-form-item--medium {
  margin-bottom: 15px;
}
</style>
