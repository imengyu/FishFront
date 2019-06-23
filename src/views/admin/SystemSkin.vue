<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>博客外观</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main v-if="currentUserHasPrivilege" class="better-scroll-white">
       <el-tabs v-model="currentTab" @tab-click="handleTabClick" :tabPosition="isMobileView ? 'top' : 'left'">
        <el-tab-pane label="修改外观帮助" name="help">

        </el-tab-pane>
        <el-tab-pane label="主菜单链接" name="header-links">
          <el-table
            ref="setCollectVisitorStatExcludeTable"
            :data="setMenuItems" tooltip-effect="dark"
            style="width: 100%">
            <el-table-column label="标题" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="路径" prop="link" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editMenuItem(scope.$index, scope.row)" size="small">编辑</el-button>
                <el-button @click="deleteMenuItem(scope.$index, scope.row)" type="danger" size="small">移除</el-button>
                <el-button @click="moveItem(true, scope.row)" size="small">上移</el-button>
                <el-button @click="moveItem(false, scope.row)" size="small">下移</el-button>
              </template>
            </el-table-column>
          </el-table>   
          <div style="margin-top: 20px">
            <el-button @click="addMenuItem()">添加</el-button>
            <el-button type="success" @click="saveMenuItems">保存修改</el-button>
            <el-button type="danger" @click="cancelChangeMenuItems">放弃修改</el-button>
          </div>
          <el-dialog
            :title="setMenuItemIsAdding ? '添加菜单项' : '编辑菜单项'"
            :visible="setMenuItemIsEditing || setMenuItemIsAdding"
            class="dialog-auto-width-50">
            <el-form v-if="setMenuItemCurrentEdit" v-model="setMenuItemCurrentEdit" :rules="setMenuItemRules" ref="formAddMenuItem" size="small" :model="setMenuItemCurrentEdit" label-width="130px" :label-position="isMobileView ? 'top' : 'right'">
              <el-form-item label="菜单标题" prop="name">
                <el-input type="text" v-model="setMenuItemCurrentEdit.name" maxlength="10" show-word-limit></el-input>
              </el-form-item>    
              <el-form-item label="菜单绝对路径" prop="link">
                <el-input type="text" v-model="setMenuItemCurrentEdit.link" maxlength="240" show-word-limit></el-input>
              </el-form-item>     
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editMenuItemFinish(true)">取消</el-button>
              <el-button type="primary" @click="editMenuItemFinish(false)">确定</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="页脚社交图标" name="footer-icons">
          
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-main v-else>
      <error-page title="您当前无权访问此页面" error="您必须拥有 修改系统设置 权限，才能查看此页面。" retry-text="返回主页" @retry="jump('/admin/')"></error-page>
    </el-main>
  </el-container>
</template>

<script>
import Chart from "chart.js";
import serverConsts from '../../constants/serverConsts.js'
import ErrorPage from '../../components/ErrorPage.vue'
import toastSimply from '../../assets/lib/toast/toast.simply';

export default {
  name: "SystemSkin",
  data() {
    return {
      currentUserIsAdmin: false,
      currentUserHasPrivilege: false,

      currentTab: 'help',

      setMenuItems: [],
      setMenuItemRules: {
          name: [
            { required: true, message: '请输入菜单项名称', trigger: 'blur' },
            { max: 5, message: '长度不超过 10 个字符', trigger: 'blur' }
          ],
          link: [
            { required: true, message: '请输入菜单项链接', trigger: 'blur' },
          ],
      },
      setMenuItemCurrentEdit: null,
      setMenuItemIsEditing: false,
      setMenuItemIsAdding: false,
    };
  },
  components: {
    'error-page': ErrorPage
  },
  computed: {
    isMobileView: function(){
      return document.body.clientWidth < 768;
    },
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
      this.setMenuItems = this.Utils.clone(serverSettings.HeaderMenu);
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
    handleTabClick(){

    },
    addMenuItem(){
      this.setMenuItemIsAdding = true;
      this.setMenuItemCurrentEdit = { name: '', link: '' };
    },
    editMenuItem(index, item){
      this.setMenuItemIsEditing = true;
      this.setMenuItemCurrentEdit = item;
    },
    moveItem(u, item){
      if(u){
        var index = this.setMenuItems.indexOf(item);
        if(index > 0)
          this.setMenuItems = this.Utils.upData(this.setMenuItems, index);
      }else{
        var index = this.setMenuItems.indexOf(item);
        if(index <this.setMenuItems.length - 1 )
          this.setMenuItems = this.Utils.downData(this.setMenuItems, index);
      }
    },
    editMenuItemFinish(c){
      if(this.setMenuItemIsAdding){
        if(c) this.setMenuItemIsAdding = false;
        else{
          this.$refs.formAddMenuItem.validate((valid) => {
            if (valid) {
              this.setMenuItems.push(this.setMenuItemCurrentEdit);
              this.setMenuItemIsAdding = false;
            }
          });
        }
        
      }else if(this.setMenuItemIsEditing){
        if(c) this.setMenuItemIsEditing = false;
        else{
          this.$refs.formAddMenuItem.validate((valid) => {
            if (valid)
              this.setMenuItemIsEditing = false;
          });
        }
      }
    },
    deleteMenuItem(index, item){
      this.$confirm('确定删除此条目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setMenuItems.pop(item);
      }).catch(() => {});
    },
    saveMenuItems(){
      this.axios.post(this.NET.API_URL + '/settings', { key: 'HeaderMenu', value: this.setMenuItems}).then((response) => {
        if(response.data.success) {
          this.$confirm('修改菜单成功', '提示', {
            confirmButtonText: '刷新页面',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            location.reload(true);
          }).catch(() => {});
        }
        else toastSimply.toast('修改菜单失败！' + response.data.message,'error',6000);
      }).catch((response) => {
        toastSimply.toast('修改菜单失败！' + response,'error',6000);
      });
    },
    cancelChangeMenuItems(){
      this.$confirm('放弃对菜单的修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { this.setMenuItems = this.Utils.clone(serverSettings.HeaderMenu); }).catch(() => {});
    },


  }
};
</script>

<style>
.dialog-auto-width-30 .el-dialog {
  width: 30%;
}
.dialog-auto-width-50 .el-dialog {
  width: 50%;
}
.dialog-auto-width-70 .el-dialog {
  width: 70%;
}
@media (max-width: 425px) {
  .dialog-auto-width-50 .el-dialog,
  .dialog-auto-width-30 .el-dialog,
  .dialog-auto-width-70 .el-dialog {
    width: 90%;
  }
}
</style>