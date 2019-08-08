<template>
  <el-container>
    <el-header class="admin-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>作者和用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="better-scroll-white" style="padding:30px 56px 30px 36px">
      <el-form v-if="currentUser" :label-position="isMobileView ? 'top' : 'right'" label-width="200px" size="medium" :model="currentUser">
        <el-form-item>
          <div class="btn-inline text-center">
            <img style="width:80px;height:80px;border-radius:50%;padding:10px" :src="getUserHead()">
            <br>
            <input type="file" name="avatar" id="avatar" accept="image/jpg, image/jpeg" aria-hidden="true" style="display: none;" v-on:change="changeHead(true)" >
            <a href="javascript:;" class="mt-2" style="font-size:14px" v-on:click="changeHead()">更换头像</a>
          </div>
        </el-form-item>
        <el-form-item label="我的名字">
          <el-input v-model="currentUser.friendlyName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="currentUser.gender" size="medium">
            <el-radio label="男"><i class="fa fa-mars mr-2 text-primary"></i>男</el-radio>
            <el-radio label="女"><i class="fa fa-venus mr-2" style="color: #f76fe5"></i>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户组">
          <div style="height: 30px" v-html="getLevelCurrentUser()"></div>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="currentUser.email"></el-input>
        </el-form-item>
        <el-form-item label="个人主页地址">
          <el-input v-model="currentUser.home"></el-input>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="currentUser.introduction"></el-input>
        </el-form-item>
        <el-form-item label="名片背景图片URL">
          <el-input v-model="currentUser.cardBackground"></el-input>
        </el-form-item>
        <el-form-item label="我的权限">
          <div style="height: 36px" v-html="getPrivilegeCurrentUser()"></div>
        </el-form-item>
        <el-form-item>
          <br />
          <el-button type="primary" @click="submit()">保存修改</el-button>
          <el-button @click="jump('/user/center/change-password/')">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>

import serverConsts from "../../constants/serverConsts.js";
import toast from "../../assets/lib/toast/toast.simply.js";

export default {
  name: "UserCenter",
  data() {
    return {
      currentUser: null
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    isMobileView: function(){
      return document.body.clientWidth < 768;
    },
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
    getLevelCurrentUser() {
      var html = "";
      var user = this.currentUser;
      if (user.level == serverConsts.UserLevels.admin)
        html = '<span class="tag-post-prefix bg-danger pt-0 pb-0">管理员</span>';
      else if (user.level == serverConsts.UserLevels.writer)
        html = '<span class="tag-post-prefix bg-primary pt-0 pb-0">作者</span>';
      else if (user.level == serverConsts.UserLevels.guest)
        html = '<span class="tag-post-prefix bg-success pt-0 pb-0">游客</span>';
      else if (user.level == 0)
        html = '<span class="tag-post-prefix bg-secondary pt-0 pb-0">已封禁</span>';
      return html;
    },
    getPrivilegeCurrentUser() {
      var html = "";
      var user = this.currentUser;

      if (user.level == serverConsts.UserLevels.admin) {
        html +=
          '<div class="tag-mgr-item bg-dark text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理员拥有所有权限</div>';
      } else {
        if (this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.manageAllArchives))
          html +=
            '<div class="tag-mgr-item bg-danger text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理所有文章权限</div>';
        if (this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.manageClassAndTags))
          html +=
            '<div class="tag-mgr-item bg-primary text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理分类标签权限</div>';
        if (this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.manageMediaCenter))
          html +=
            '<div class="tag-mgr-item bg-info text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理媒体库权限</div>';
        if (this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.manageUsers))
          html +=
            '<div class="tag-mgr-item bg-dark text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">管理其他用户权限</div>';
        if (this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.gaintPrivilege))
          html +=
            '<div class="tag-mgr-item bg-primary text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">授予用户权限权限</div>';
        if (this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.globalSettings))
          html +=
            '<div class="tag-mgr-item bg-warning text-white cursor-pointer pt-0 pb-0 mt-0 pr-3">修改系统设置权限</div>';
      }
      return html;
    },
    getUserHead() {
      if (this.Utils.isNullOrEmpty(this.currentUser.headimg))
        return require("../../assets/images/default/head-default.png");
      else return this.currentUser.headimg;
    },


    //User head
    changeHead(b) {
      if (b) this.uploadFile();
      else document.getElementById("avatar").click();
    },
    uploadFile() {
      var avatar = document.getElementById("avatar");
      var fileObj = avatar.files[0]; // js 获取文件对象
      var url = this.NET.API_URL + "/user/" + this.currentUser.id + "/head";
      var main = this;
      var t = toast.toast("正在上传...", "loading", -1);
      var xhr;

      //上传成功响应
      var uploadComplete = (evt) => {
        toast.toastClose(t);
        //服务断接收完文件返回的结果
        var data = JSON.parse(evt.target.responseText);
        if (data.success) {
          //设置 新返回的 图片 hash 值
          this.currentUser.headimg = data.data;
          toast.toast("更换头像成功", "success", 5000);
        } else
          toast.toast("上传头像失败！" + data.message + " ( " + data.extendCode + " )", "error", 8000);
      };
      //上传失败
      var uploadFailed = function uploadFailed(evt) {
        toast.toastClose(t);
        toast.toast("上传头像失败！请检查您的网络", "error", 5000);
      };

      var form = new FormData(); // FormData 对象
      form.append("file", fileObj); // 文件对象

      xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
      xhr.withCredentials = true;
      xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
      xhr.onload = uploadComplete; //请求完成
      xhr.onerror = uploadFailed; //请求失
      xhr.send(form); //开始上传，发送form数据

      avatar.value = "";
    },
    //Submit
    submit() {
      if (this.Utils.isNullOrEmpty(this.currentUser.friendlyName)){
        toast.toast("您必须填写您的用户名字", "error", 5000);
        return;
      }

      var t = toast.toast("正在提交中...", "loading", -1);
      this.axios.put(this.NET.API_URL + "/user/" + this.currentUser.id, this.currentUser).then(response => {
        toast.toastClose(t);
        if (response.data.success) {
          toast.toast("修改个人信息成功！", "success", 5000);
        } else {
          this.$swal("修改个人信息失败", response.data.message, "error");
        }
      }).catch(response => {
        toast.toastClose(t);
        this.$swal("修改个人信息失败", "错误信息：" + response, "error"); 
      });
    },
  }
};
</script>

<style>
.el-form-item.el-form-item.el-form-item--medium{
  margin-bottom: 15px;
}
</style>
