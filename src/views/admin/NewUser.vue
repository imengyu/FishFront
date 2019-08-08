<template>
  <el-container>
    <el-header class="admin-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>作者和用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建作者账号</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main v-if="currentUserIsAdmin && !currentAddUserSuccess" class="better-scroll-white" style="padding:30px 56px 30px 36px">
      <el-form v-if="currentAddUser" ref="fromNewUser" :label-position="isMobileView ? 'top' : 'right'" label-width="200px" size="medium" :rules="currentAddUserRules" :model="currentAddUser">
        <el-form-item>
          <span class="text-secondary">新建一个用户组为 <span class="text-primary">作者</span> 的账号</span>
        </el-form-item>
        <el-form-item label="账号登录名" prop="name">
          <el-input v-model="currentAddUser.name"></el-input>
        </el-form-item>
        <el-form-item label="用户友好名字" prop="friendlyName">
          <el-input v-model="currentAddUser.friendlyName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwordTemp1">
          <el-input type="password" v-model="currentAddUser.passwordTemp1"></el-input>
        </el-form-item>
        <el-form-item label="再输入一次密码" prop="passwordTemp2">
          <el-input type="password" v-model="currentAddUser.passwordTemp2"></el-input>
        </el-form-item>
        <el-form-item>
          <br />
          <el-button type="primary" @click="submit()">新建用户</el-button>
          <el-button @click="jump('/admin/manage-users/')">管理其他用户</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-main v-else-if="currentAddUserSuccess">
      <div class="container" style="height:450px">
        <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
          <i class="fa fa-check-circle-o text-success" aria-hidden="true" style="font-size: 3.5em"></i>
          <p class="text-secondary mt-2">
            <span class="h4">用户添加成功</span>
            <br><span class="text-secondary">请登录此账号并修改个人信息</span>
          </p>
          <div>
            <el-button type="success" size="small" round @click="currentAddUserSuccess=false">继续新建用户</el-button>
            <el-button size="small" round @click="jump('/admin/manage-users/')">管理其他用户</el-button>
          </div>
        </div>
      </div>
    </el-main>
    <el-main v-else>
      <div class="container" style="height:450px">
        <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
          <p class="text-secondary mt-2">
            <span class="h4">您当前无权访问此页面</span>
            <br>只有 <span class="text-primary">管理员</span> 才能创建新用户。
          </p>
          <el-button type="primary" round @click="jump('/admin/')">返回主页</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>

import serverConsts from "../../constants/serverConsts.js";
import toast from "../../assets/lib/toast/toast.simply.js";

export default {
  name: "NewUser",
  computed: {
    isMobileView: function(){
      return document.body.clientWidth < 768;
    },
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.currentAddUser.passwordTemp1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      currentUser: null,
      currentUserIsAdmin: false,
      currentAddUserSuccess: false,
      currentAddUser: {
        name: '',
        friendlyName: '',
        passwordTemp1: '',
        passwordTemp2: '',
        passwd: '',
      },
      currentAddUserRules: {
        name: [
          { required: true, message: '请输入用户名！', trigger: 'blur' },
          { max: 250, message: '用户名不超过 250 个字符', trigger: 'blur' }
        ],
        friendlyName: [
          { required: false, message: '', trigger: 'blur' },
          { max: 50, message: '用友好名字不超过 50 个字符', trigger: 'blur' }
        ],
        passwordTemp1: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度必须在 8 ~ 20 个字符之间', trigger: 'blur' }
        ],
        passwordTemp2: [
          { required: true, message: '请再输入一次密码！', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
      }, 
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
      if(authed) {
        this.currentUser = this.$store.getters["auth/authInfo"];
        this.currentUserIsAdmin = this.currentUser.level == serverConsts.UserLevels.admin;
      }
    },

    //Submit
    submit() {
      this.$refs['fromNewUser'].validate((valid) => {
        if (valid) {
          var md5 = require('md5');
          var t = toast.toast("正在提交中...", "loading", -1);

          this.currentAddUser.passwd = md5(this.currentAddUser.passwordTemp1);
          this.currentAddUser.passwordTemp1 = '';
          this.currentAddUser.passwordTemp2 = '';
          this.axios.post(this.NET.API_URL + "/users", this.currentAddUser).then(response => {
            toast.toastClose(t);
            if (response.data.success) {
              toast.toast("添加成功！", "success", 5000);
              this.currentAddUserSuccess = true;
            } else {
              this.$swal("新建用户失败", response.data.message, "error");
            }
          }).catch(response => {
            toast.toastClose(t);
            this.$swal("新建用户失败", "错误信息：" + response, "error"); 
          });
        }
      })
    },
  }
};
</script>

<style>
.el-form-item__error{
  top: unset;
}
</style>
