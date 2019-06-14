<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px 36px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分类和标签</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main v-if="currentUserHasPrivilege" class="better-scroll-white" style="padding:0 36px">
      <el-tabs v-model="currentTab" @tab-click="handleTabClick">
        <el-tab-pane label="标签管理" name="tags">
          <div class="tags" v-if="contentTags && !tagsLoading">
            <div
              v-for="(tag, index) in contentTags"
              class="tag-mgr-item" :key="index"
              :style="'background-color:' + tag.color"
            >
              {{ tag.name }}
              <a href="javascript:;" v-on:click="handleEditTag(tag)">
                <i class="fa fa-pencil"></i>
              </a>
              <a href="javascript:;" v-on:click="handleDeleteTag(tag.id)">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
          <div v-else-if="tagsLoading" class="simple-loading-center">
            <div class="simple-loading-container">
              <span class="simple-loading"></span>
              <p>拼命加载中</p>
            </div>
          </div>
          <button type="button" class="btn btn-success mt-3" v-on:click="handleAddTag()">
            <i class="fa fa-plus"></i>
            添加标签
          </button>
        </el-tab-pane>
        <el-tab-pane label="分类管理" name="categories">
          <div v-if="postListCategoriesLoadStatus.indexOf('error')==0" class="box">
            <div class="container" style="height:450px">
              <div
                class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column"
              >
                <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
                <p class="text-secondary mt-2">
                  <span class="h4">加载失败</span>
                  <br>
                  {{ postListCategoriesLoadStatus.split(':')[1] }}
                </p>
                <el-button type="primary" round @click="loadListCategories">重试</el-button>
              </div>
            </div>
          </div>
          <el-table
            v-else
            ref="listCategories"
            empty-text="这里空空如也，什么都没有"
            :data="postListCategoriesData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="postListCategoriesLoadStatus=='loading'"
          >
            <el-table-column prop="id" label="ID" width="40"></el-table-column>
            <el-table-column prop="title" label="名称"></el-table-column>
            <el-table-column prop="previewText" label="说明文字"></el-table-column>
            <el-table-column prop="urlName" label="URL路径"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEditClass(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteClass(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-pagination
              class="btn-inline float-right"
              background
              layout="prev, pager, next"
              :page-count="postListCategoriesPageCurrent"
              :current-page="postListCategoriesPageCurrent"
              v-on:current-change="handleCategoriesPage"
            ></el-pagination>每页显示：
            <el-select
              style="width:90px"
              v-model="postListCategoriesPageSize"
              placeholder="请选择"
              @change="loadListCategories"
              size="small"
            >
              <el-option
                v-for="item in postListSizeOpinions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>&nbsp;
            <el-button size="small" type="success" @click="handleAddClass()"><i class="fa fa-plus mr-2"></i>添加分类</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!--Editing dialogs-->
      <el-dialog
        :title="(currentEditingTag && currentEditingTag.new) ? '添加标签' : '编辑标签'"
        :visible.sync="editingTag"
        class="dialog-auto-width-30">
        <el-form ref="fromTag" v-if="currentEditingTag" :model="currentEditingTag" label-position="right" :rules="editingTagRules" label-width="80px">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="currentEditingTag.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="标签颜色" prop="color">
            <el-color-picker v-model="currentEditingTag.color" :predefine="predefineColors"></el-color-picker>
          </el-form-item>
          <el-form-item label="" size="mini">
            <div v-if="currentEditingTag" class="tag-mgr-item pr-2" :style="'background-color:' + currentEditingTag.color">{{ currentEditingTag.name }}</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleEditTagCancel()">取消</el-button>
          <el-button type="primary" @click="saveTag()">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="(currentEditingClass && currentEditingClass.new) ? '添加分类' : '编辑分类'"
        :visible.sync="editingClass"
        class="dialog-auto-width-50">
        <el-form ref="fromClass" v-if="currentEditingClass" :model="currentEditingClass" label-position="right" :rules="editingClassRules" label-width="120px">
          <el-form-item label="分类名称" prop="title" >
            <el-input v-model="currentEditingClass.title"></el-input>
          </el-form-item>
          <el-form-item label="URL名称" prop="urlName">
            <el-input v-model="currentEditingClass.urlName"></el-input>
          </el-form-item>
          <el-form-item label="说明文字" prop="previewText">
            <el-input v-model="currentEditingClass.previewText"></el-input>
          </el-form-item>
          <el-form-item label="预览图片URL" prop="previewImage">
            <el-input v-model="currentEditingClass.previewImage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleEditClassCancel()">取消</el-button>
          <el-button type="primary" @click="saveClass()">保存</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-main v-else>
      <div class="container" style="height:450px">
        <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
          <p class="text-secondary mt-2">
            <span class="h4">您当前无权访问此页面</span>
            <br>您必须拥有 <span class="text-primary">管理分类和标签</span> 权限，才能查看此页面。
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
  name: "ManageClassfication",
  data() {
    return {
      postListCategoriesData: null,
      postListCategoriesPageAll: 0,
      postListCategoriesPageSize: 20,
      postListCategoriesPageCurrent: 1,
      postListCategoriesLoadStatus: "notload",

      postListSizeOpinions: [
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

      tagsLoading: false,
      contentTags: null,

      currentUser: null,
      currentUserIsAdmin: false,
      currentUserHasPrivilege: false,

      currentTab: "tags",

      editingTag: false,
      editingTagRules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { max: 10, message: '名称不超过 10 个字符', trigger: 'blur' }
        ],
      }, 
      currentEditingTag: null,
      currentEditingTagBackup: null,
      predefineColors: [
        '#FF9999',
        '#CC9999',
        '#CC6699',
        '#CC3399',
        '#CC0033',
        '#FF0033',
        '#FF6666',
        '#FF6600',
        '#FF9900',
        '#FFCC33',
        '#FFFF00',
        '#CCFF66',
        '#BBE85E',
        '#99CC00',
        '#009966',
        '#15C9B1',
        '#66CCCC',
        '#0099FF',
        '#0099CC',
        '#3399CC',
      ],

      editingClass: false,
      editingClassRules: {
        title: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { max: 100, message: '名称不超过 100 个字符', trigger: 'blur' }
        ],
      }, 
      currentEditingClass: null,
      currentEditingClassBackup: null,

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
        this.currentUserHasPrivilege = this.Utils.getUserHasPrivilege(this.currentUser, serverConsts.UserPrivileges.manageClassAndTags);
        this.loadTags();
      }
    },

    //Events
    handleTabClick(tab) {
      if (
        tab.name == "categories" &&
        this.postListCategoriesLoadStatus == "notload"
      )
        this.loadListCategories();
    },
    handleEditClass(index, category) {
      this.editingClass = true;
      this.currentEditingClassBackup = this.Utils.clone(category);//克隆一个原对象
      this.currentEditingClass = category;
    },
    handleEditClassCancel(){
      this.editingClass = false;
      this.Utils.cloneValue(this.currentEditingClass, this.currentEditingClassBackup);
      this.currentEditingClassBackup = null;
    },
    handleDeleteClass(index, category) {
      this.$swal({
        type: "warning",
        title: "您真的要删除这个分类吗?",
        html:
          "<h5>注意，此操作不能恢复！</h5><div class='sweetalert-content-box'><b>标题：</b>" +
          category.title +
          "<br /><b>ID：</b>" +
          category.id + "</div>",
        confirmButtonColor: "#d33",
        confirmButtonText: "确定删除",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        cancelButtonText: "取消",
        focusCancel: true,
        reverseButtons: true
      }).then(isConfirm => {
        if (isConfirm.value) {
           this.axios.delete(this.NET.API_URL + '/class/' + category.id).then(response => {
            if (response.data.success) {
              toast.toast('删除分类成功', 'success')
              this.loadListCategories();
            } else {
              this.$swal("删除分类失败", response.data.message, "error");
            }
          }).catch(response => {
            this.$swal("删除分类失败", "错误信息：" + response, "error");
          });
        }
      });
    },
    handleCategoriesPage(page) {
      this.postListCategoriesPageCurrent = page;
      this.loadListCategories();
    },
    handleAddClass(){
      this.editingClass = true;
      this.currentEditingClass = {
        id: 0,
        title: '',
        urlName: '',
        previewText: '',
        previewImage: '',
        new: true
      };
    },
    handleAddTag(){
      this.editingTag = true;
      this.currentEditingTag = {
        id: 0,
        name: '',
        color: '#000',
        new: true
      };
    },
    handleDeleteTag(tagid){
      this.$swal({
        type: "warning",
        title: "您真的要删除这个标签吗?",
        html: "<h5>注意，此操作不能恢复！</h5><div class='sweetalert-content-box'><b>ID：</b>" + tagid + "</div>",
        confirmButtonColor: "#d33",
        confirmButtonText: "确定删除",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        cancelButtonText: "取消",
        focusCancel: true,
        reverseButtons: true
      }).then(isConfirm => {
        if (isConfirm.value) {
           this.axios.delete(this.NET.API_URL + '/tag/' + tagid).then(response => {
            if (response.data.success) {
              toast.toast('删除标签成功', 'success')
              //清除旧标签数据
              var newData = {};
              for (var key in this.contentTags) { if (this.contentTags[key].id != tagid) newData[key] = this.contentTags[key] }
              this.contentTags = newData;
            } else {
              this.$swal("删除标签失败", response.data.message, "error");
            }
          }).catch(response => {
            this.$swal("删除标签失败", "错误信息：" + response, "error");
          });
        }
      });
    },
    handleEditTag(tag){
      this.editingTag = true;
      this.currentEditingTag = tag;
      this.currentEditingTagBackup = this.Utils.clone(tag);//克隆一个原对象
    },
    handleEditTagCancel(){
      this.editingTag = false;
      this.Utils.cloneValue(this.currentEditingTag, this.currentEditingTagBackup);
      this.currentEditingTagBackup = null;
    },

    loadTags() {

      this.tagsLoading = true;
      this.axios
        .get(this.NET.API_URL + '/tags')
        .then(response => {
          if (response.data.success) {
            this.contentTags = response.data.data;
            this.tagsLoading = false;
          } else {
            this.tagsLoading = false;
            this.$swal("加载标签时发生了错误!", response.data.message, "error");
          }
        })
        .catch(response => {
          this.tagsLoading = false;
          this.$swal("加载标签时发生了错误!", "错误信息：" + response.data.message, "error");
        });
    },
    loadListCategories() {
      this.postListCategoriesLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/classes/" +
        (this.postListCategoriesPageCurrent - 1) +
        "/" +
        this.postListCategoriesPageSize;
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.postListCategoriesData = response.data.data.content;
            this.postListCategoriesPageAll = response.data.data.totalPages;
            this.postListCategoriesLoadStatus = "loaded";
          } else
            this.postListCategorieshLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.postListCategorieshLoadStatus = "error:" + response;
        });
    },

    saveTag(){
      this.$refs['fromTag'].validate((valid) => {
        if (valid) {
          this.editingTag = false;
          if(this.currentEditingTag){
            if(this.currentEditingTag.new){
              //POST 新的条目
              this.axios.post(this.NET.API_URL + '/tag', this.currentEditingTag).then(response => {
              if (response.data.success) {
                toast.toast('添加标签成功', 'success')
                //刷新数据
                var newData = {}, i=0;
                for (var key in this.contentTags) {
                  newData[key] = this.contentTags[key];
                  i++
                }
                this.currentEditingTag.new = undefined;
                newData[i]=this.currentEditingTag;
                this.contentTags = newData;
                this.currentEditingTag = null;
              } else this.$swal("添加标签失败", response.data.message, "error");
              }).catch(response => {
                this.$swal("添加标签失败", "错误信息：" + response, "error");
              });
            }else{
              //PUT 修改条目
              this.axios.put(this.NET.API_URL + '/tag/' + this.currentEditingTag.id, this.currentEditingTag).then(response => {
              if (response.data.success) {
                toast.toast('更新标签成功', 'success')
                this.currentEditingTag = null;
              } else this.$swal("更新标签失败", response.data.message, "error");
              }).catch(response => {
                this.$swal("更新标签失败", "错误信息：" + response, "error");
              });
            }
          }
        } else return false;
      });
    },
    saveClass(){
      this.$refs['fromClass'].validate((valid) => {
        if (valid) {
          this.editingClass = false;
          if(this.currentEditingClass){
            if(this.currentEditingClass.new){
              //POST 新的条目
              this.axios.post(this.NET.API_URL + '/class', this.currentEditingClass).then(response => {
              if (response.data.success) {
                toast.toast('添加分类成功', 'success')
                //刷新数据
                var newData = {}, i=0;
                for (var key in this.postListCategoriesData) {
                  newData[key] = this.postListCategoriesData[key];
                  i++
                }
                this.currentEditingClass.new = undefined;
                newData[i]=this.currentEditingTag;
                this.postListCategoriesData = newData;
                this.currentEditingClass = null;
              } else this.$swal("添加分类失败", response.data.message, "error");
              }).catch(response => {
                this.$swal("添加分类失败", "错误信息：" + response, "error");
              });
            }else{
              //PUT 修改条目
              this.axios.put(this.NET.API_URL + '/class/' + this.currentEditingClass.id, this.currentEditingClass).then(response => {
              if (response.data.success) {
                toast.toast('更新分类成功', 'success')
                this.currentEditingClass = null;
              } else this.$swal("更新分类失败", response.data.message, "error");
              }).catch(response => {
                this.$swal("更新分类失败", "错误信息：" + response, "error");
              });
            }
          }
        } else return false;
      });
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
@media (max-width: 425px) {
  .dialog-auto-width-50 .el-dialog,
  .dialog-auto-width-30 .el-dialog {
    width: 90%;
  }
}
</style>
