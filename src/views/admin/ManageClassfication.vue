<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分类和标签</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="better-scroll-white" style="padding:0 24px">
      <el-tabs v-model="currentTab" @tab-click="handleTabClick">
        <el-tab-pane label="标签管理" name="tags">
          <div class="tags" v-if="contentTags && !tagsLoading">
            <div
              v-for="(tag, index) in contentTags"
              class="tag-mgr-item" :key="index"
              :style="'background-color:#' + tag.color"
            >
              {{ tag.name }}
              <a href="javascript:;" v-on:click="handleEditTag(tag.id)">
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
                  {{ postListCategoriesLoadStatus.split(':')[0] }}
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
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
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
            </el-select>
          </div>
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

      currentTab: "tags"
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
      this.loadTags();
    },

    //Events
    handleTabClick(tab) {
      if (
        tab.name == "categories" &&
        this.postListCategoriesLoadStatus == "notload"
      )
        this.loadListCategories();
    },
    handleEdit(index, post) {},
    handleDelete(index, category) {
      this.$swal({
        type: "warning",
        title: "您真的要删除这个分类吗?",
        html:
          "<h5>注意，此操作不能恢复！</h5><b>标题：</b>" +
          post.title +
          "<br /><b>ID：</b>" +
          post.id,
        confirmButtonColor: "#d33",
        confirmButtonText: "确定删除",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        cancelButtonText: "取消",
        focusCancel: true,
        reverseButtons: true
      }).then(isConfirm => {
        if (isConfirm.value) {
        }
      });
    },
    handleCategoriesPage(page) {
      this.postListCategoriesPageCurrent = page;
      this.loadListCategories();
    },
    handleAddTag(){

    },
    handleDeleteTag(tagid){

    },
    handleEditTag(tagid){

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
    }
  }
};
</script>