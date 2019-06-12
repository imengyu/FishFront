<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px 36px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>作者和用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理作者和用户</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main v-if="currentUserCanManageUsers" class="better-scroll-white" style="padding:30px 36px 30px 36px">
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
            
            <el-table-column width="45">
              <template slot-scope="scope">
                 <img class="rounded-circle" width="32px" height="32px" :src="getUserHead(scope.row)">
              </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="40"></el-table-column>
            <el-table-column prop="name" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="friendlyName" label="昵称"></el-table-column>
            <el-table-column label="用户组/用户权限">
              <template slot-scope="scope">
                 <div v-html="getUserPrivilegeItem(scope.row)"></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="编辑用户信息" placement="left">
                    <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
                  </el-tooltip>
                  <el-button v-if="scope.row.level!=0" size="mini" type="info" @click="handleBand(scope.$index, scope.row, true)">封禁用户</el-button>
                  <el-button v-else size="mini" type="success" @click="handleBand(scope.$index, scope.row, false)">解封用户</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">注销</el-button>
                </el-button-group>
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
            <el-checkbox v-model="tableUsersShowTourist" @change="loadUserTable(1)">显示游客</el-checkbox>
            每页显示：
            <el-select
              style="width:90px"
              v-model="tableUsersPageSize"
              placeholder="请选择"
              @change="loadUserTable(1)"
              size="small"
            >
              <el-option v-for="item in tableListSizeOpinions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
    </el-main>
    <el-main v-else>
      <div class="container" style="height:450px">
        <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
          <p class="text-secondary mt-2">
            <span class="h4">您当前无权访问此页面</span>
            <br>您必须拥有 <span class="text-primary">管理其他用户</span> 权限，才能查看此页面。
          </p>
          <el-button type="primary" round @click="jump('/admin/')">返回主页</el-button>
        </div>
      </div>
    </el-main>
    <el-dialog
        title="编辑用户信息"
        :visible.sync="editingUser"
        width="50%">
        <el-form ref="fromUser" v-if="currentEditingUser" :model="currentEditingUser" label-position="right" :rules="editingUserRules" label-width="80px">
          <el-form-item label="用户名" prop="name" size="mini">
            {{ currentEditingUser.name }}
          </el-form-item>
          <el-form-item label="用户组" prop="level" size="small">
            <div class="btn-inline">
              <span v-html="getUserLevelItem(currentEditingUser)"></span>
              <el-select v-if="currentEditingUser.id>1&&currentEditingUser.level>0&&currentEditingUser.id!=currentUser.id" v-model="currentEditingUser.level" placeholder="请选择" @change="editingUserLevelChanged=true">
                <el-option v-if="currentUser.level<=1" key="1" label="管理员" :value="1"></el-option>
                <el-option key="2" label="作者" :value="2"></el-option>
                <el-option key="3" label="游客" :value="3"></el-option>
              </el-select>
              <span v-else-if="currentEditingUser.id==currentUser.id" class="text-secondary ml-2">您无法修改自己的用户组</span>
              <span v-else-if="currentEditingUser.level<currentUser.level" class="text-secondary ml-2">您没有权限设置此用户的用户组</span>
              <span v-else-if="currentEditingUser.id==1" class="text-secondary ml-2">1 号用户（根管理员）无法修改其用户组</span>
              <span v-else class="text-secondary ml-2">当前用户无法修改其用户组</span>
            </div>
          </el-form-item>
          <el-form-item label="用户权限" size="mini">
            <span v-if="currentEditingUser.level==0" class="text-secondary">当前用户已封禁，无法赋予权限，请将其解封再赋予权限</span>
            <span v-else-if="currentEditingUser.level==1" class="text-secondary">无法赋予管理员权限，管理员<b>拥有全部权限</b></span>
            <el-cascader
              v-else-if="currentUserCanGenPrivilege && currentEditingUserPrivileges"
              placeholder="要赋予该用户的权限"
              :options="currentUserCanGenPrivileges"
              :props="{ multiple: true }"
              v-model="currentEditingUserPrivileges"
              @change="editingUserPrivilegeChanged = true"
              filterable>
            </el-cascader> 
            <span v-else-if="!currentUserCanGenPrivilege" class="text-secondary">您无法赋予权限其他用户，赋予权限需要 <span class="text-primary">可分配权限给其他用户</span> 权限。</span>
            <span v-else class="text-secondary">当前用户无法赋予权限</span>
          </el-form-item>
          <el-form-item label="" size="mini">
            <span class="text-secondary btn-block">要修改密码，请前往 <a :href="getJumpRealUrl('/user/center/change-password/')" target="_blank">修改密码页面</a> 。</span>
            <span v-if="currentEditingUser.id==currentUser.id" class="text-secondary btn-block">要修改您的个人信息，请前往 <a :href="getJumpRealUrl('/admin/user-center/')" target="_blank">个人信息页面</a> 。</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleEditCancel()">取消</el-button>
          <el-button type="primary" @click="saveUser()">保存</el-button>
        </span>
      </el-dialog>
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
      currentUserCanGenPrivilege: false,
      currentUserCanGenPrivileges: null,
      currentUserCanManageUsers: false,

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

      editingUser: false,
      editingUserRules: {
        name: [
          { required: true, message: '用户名不可为空！', trigger: 'blur' },
          { max: 250, message: '名称不超过 250 个字符', trigger: 'blur' }
        ],
      }, 
      editingUserPrivilegeChanged: false,
      editingUserLevelChanged: false,

      currentEditingUser: null,
      currentEditingUserBackup: null,
      currentEditingUserPrivileges: null,


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
        this.currentUserIsAdmin = this.currentUser.level == serverConsts.UserLevels.admin;
        this.currentUserCanGenPrivilege = this.Utils.getUserHasPrivilege(this.currentUser, serverConsts.UserPrivileges.gaintPrivilege);
        this.currentUserCanManageUsers = this.Utils.getUserHasPrivilege(this.currentUser, serverConsts.UserPrivileges.manageUsers);
        this.genCanGaintPrivileges();
        this.loadUserTable();
      }
    },
    genCanGaintPrivileges(){
      this.currentUserCanGenPrivileges = [];
      var arr = this.currentUserCanGenPrivileges;
      if(this.currentUserIsAdmin){
        Object.keys(serverConsts.UserPrivileges).forEach(function(key){
          arr.push({ 
            value: serverConsts.UserPrivileges[key], 
            label: serverConsts.UserPrivilegesName[key] ? serverConsts.UserPrivilegesName[key] : '', 
          })
        });
      }else{
        var u = this.Utils, u2 = this.currentUser;
        Object.keys(serverConsts.UserPrivileges).forEach(function(key){
          if(u.getUserHasPrivilege(u2, serverConsts.UserPrivileges[key])) 
            arr.push({ 
              value: serverConsts.UserPrivileges[key], 
              label: serverConsts.UserPrivilegesName[key] ? serverConsts.UserPrivilegesName[key] : '', 
            })
        });
      }
    },

    //Gets
    getUserHead(user) {
      if (this.Utils.isNullOrEmpty(user.headimg))
        return require("../../assets/images/default/head-default.png");
      else return this.Utils.getImageUrlFormHash(user.headimg);
    },
    getUserLevelItem(user){
      var html = '';
      if(user.level == serverConsts.UserLevels.admin) html = '<span class="tag-post-prefix bg-danger">管理员</span>';
      else if(user.level == serverConsts.UserLevels.writer) html = '<span class="tag-post-prefix bg-primary">作者</span>';
      else if(user.level == serverConsts.UserLevels.guest) html = '<span class="tag-post-prefix bg-success">游客</span>';
      else if(user.level == 0) html = '<span class="tag-post-prefix bg-secondary">已封禁</span>';
      return html;
    },
    getUserPrivilegeItem(user){
      var html = '';
      if(user.level == serverConsts.UserLevels.admin) html = '<span class="tag-post-prefix bg-danger">管理员</span>';
      else if(user.level == serverConsts.UserLevels.writer) html = '<span class="tag-post-prefix bg-primary">作者</span>';
      else if(user.level == serverConsts.UserLevels.guest) html = '<span class="tag-post-prefix bg-success">游客</span>';
      else if(user.level == 0) html = '<span class="tag-post-prefix bg-secondary">已封禁</span>';
      html += '&nbsp;&nbsp;';
                        
      if(user.level == serverConsts.UserLevels.admin){

      }else if(user.level == serverConsts.UserLevels.writer){
        if(this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.manageAllArchives)) html += '<span class="tag-post-prefix bg-danger">管理所有文章权限</span>';
        if(this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.manageClassAndTags)) html += '<span class="tag-post-prefix bg-primary">管理分类标签权限</span>';
        if(this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.manageMediaCenter)) html += '<span class="tag-post-prefix album">管理媒体库权限</span>';
        if(this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.manageUsers)) html += '<span class="tag-post-prefix video">管理其他用户权限</span>';
        if(this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.gaintPrivilege)) html += '<span class="tag-post-prefix reprint">授予用户权限权限</span>';
        if(this.Utils.getUserHasPrivilege(user, serverConsts.UserPrivileges.globalSettings)) html += '<span class="tag-post-prefix bg-warning">修改系统设置权限</span>';
      }
      return html;
    },

    //Events

    handleEdit(index, user) {
      this.currentEditingUser = user;
      this.currentEditingUserBackup = this.Utils.clone(user);
      this.editingUser = true;
      this.editingUserPrivilegeChanged = false;
      this.editingUserLevelChanged = false;
      this.currentEditingUserPrivileges = [];
      //
      var arr = this.currentEditingUserPrivileges, u = this.Utils;
      Object.keys(serverConsts.UserPrivileges).forEach(function(key){
        if(u.getUserHasPrivilege(user, serverConsts.UserPrivileges[key])) 
          arr.push(serverConsts.UserPrivileges[key])
      });
    },
    handleDelete(index, user) {
      if(user.id == 1) toast.toast('无法注销根管理员', 'error', 3500);
      else if(user.level == serverConsts.UserLevels.admin) toast.toast('无法注销管理员用户', 'error', 3500);
      else if(user.id == this.currentUser.id) toast.toast('您不能注销自己', 'error', 3500);
      else {
        this.$swal({
          type: "warning",
          title: "您真的要注销此用户吗?",
          html: "<h5>注意，此操作不能恢复！</h5><div class='sweetalert-content-box'><b>用户 ID：</b>" + user.id + "<br /><b>用户名：</b>" + user.name + (user.friendlyName ? ' (' + user.friendlyName + ')' : '') + "</div>",
          confirmButtonColor: "#d33",
          confirmButtonText: "确定注销",
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          cancelButtonText: "取消",
          focusCancel: true,
          reverseButtons: true
        }).then(isConfirm => {
          if (isConfirm.value) {
            this.axios.delete(this.NET.API_URL + '/user/' + user.id).then(response => {
              if (response.data.success) {
                toast.toast('注销用户成功', 'success')
                this.loadUserTable();
              } else this.$swal("注销用户失败", response.data.message, "error");
            }).catch(response => {
              this.$swal("注销用户失败", "错误信息：" + response, "error");
            });
          }
        });
      }
    },
    handleBand(index, user, band){
      if(user.id == 1) toast.toast('无法' +  (band ? '封禁' : '解封') + '根管理员', 'error', 3500);
      else if(user.level == serverConsts.UserLevels.admin && this.currentUser.level > serverConsts.UserLevels.admin) 
        toast.toast('您没有权限' +  (band ? '封禁' : '解封') + '此管理员用户', 'error', 3500);
      else if(user.id == this.currentUser.id) toast.toast('您不能注销自己', 'error', 3500);
      else{
        this.$swal({
          type: "warning",
          title: "您真的要" + (band ? '封禁' : '解封') + "此用户吗?",
          html: (band ? "用户会被封禁，无法登录" : '') + "<div class='sweetalert-content-box'><b>用户 ID：</b>" + user.id + "<br /><b>用户名：</b>" + user.name + (user.friendlyName ? ' (' + user.friendlyName + ')' : '') + "</div>",
          confirmButtonColor: "#d33",
          confirmButtonText: "确定" +  (band ? '封禁' : '解封'),
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          cancelButtonText: "取消",
          focusCancel: true,
          reverseButtons: true
        }).then(isConfirm => {
          if (isConfirm.value) {
            if(band){
              this.axios.post(this.NET.API_URL + '/user/' + user.id + '/ban').then(response => {
                if (response.data.success) {
                  toast.toast('封禁用户成功', 'success')
                  this.loadUserTable();
                } else this.$swal("封禁用户失败", response.data.message, "error");
              }).catch(response => {
                this.$swal("封禁用户失败", "错误信息：" + response, "error");
              });
            }else{
              this.axios.post(this.NET.API_URL + '/user/' + user.id + '/unban').then(response => {
                if (response.data.success) {
                  toast.toast('解封用户成功', 'success')
                  this.loadUserTable();
                } else this.$swal("解封用户失败", response.data.message, "error");
              }).catch(response => {
                this.$swal("解封用户失败", "错误信息：" + response, "error");
              });
            }
          }
        });
      }
    },
    handlePage(page){
      this.loadUserTable(page);
    },
    handleEditCancel(){
      this.editingUser = false;
      this.Utils.cloneValue(this.currentEditingUser, this.currentEditingUserBackup);
      this.currentEditingUserBackup = null;
      this.currentEditingUserPrivileges = null;
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
        "?includeTourist=" +
        (this.tableUsersShowTourist ? "true" : 'false');
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

    },
    saveUser(){
       this.$refs['fromUser'].validate((valid) => {
         if (valid) {
            if(this.editingUserPrivilegeChanged){
              var newPrivilege = 0, arr = this.currentEditingUserPrivileges;
              Object.keys(arr).forEach(function(key){ newPrivilege |= arr[key]; });
              this.axios.post(this.NET.API_URL + '/user/' + this.currentEditingUser.id + '/privilege', { privilege: newPrivilege }).then(response => {
                if (response.data.success) {
                  this.currentEditingUser.privilege = newPrivilege;
                  toast.toast('修改用户权限成功', 'success')
                }
                else this.$swal("修改用户权限失败", response.data.message, "error");
              }).catch(response => {
                this.$swal("修改用户权限失败", "错误信息：" + response, "error");
              });
            }
            if(this.editingUserLevelChanged){
              this.axios.post(this.NET.API_URL + '/user/' + this.currentEditingUser.id + '/level', { level: this.currentEditingUser.level }).then(response => {
                if (response.data.success) toast.toast('修改用户用户组成功', 'success')
                else {
                  this.currentEditingUser.level = this.currentEditingUserBackup.level;
                  this.$swal("修改用户用户组失败", response.data.message, "error");
                }
              }).catch(response => {
                 this.currentEditingUser.level = this.currentEditingUserBackup.level;
                this.$swal("修改用户用户组失败", "错误信息：" + response, "error");
              });
            }
            this.editingUser = false;
         }
       });
    },
  }
};
</script>

<style>
.el-form-item.el-form-item.el-form-item--medium {
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
