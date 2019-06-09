<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>文章列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="better-scroll-white" style="padding:0 24px">
      <el-tabs v-model="currentTab" @tab-click="handleTabClick">
        <el-tab-pane label="所有文章" name="all">
          <div v-if="postListAllLoadStatus.indexOf('error')==0" class="box">
            <div class="container" style="height:450px">
              <div
                class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column"
              >
                <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
                <p class="text-secondary mt-2">
                  <span class="h4">加载失败</span>
                  <br>
                  {{ postListAllLoadStatus.split(':')[0] }}
                </p>
                <el-button type="primary" round @click="loadListAll">重试</el-button>
              </div>
            </div>
          </div>
          <el-table
            v-else
            ref="listAll"
            empty-text="这里空空如也，赶快去写一篇文章吧！"
            :data="postListAllData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="postListAllLoadStatus=='loading'"
          >
            <el-table-column prop="id" label="ID" width="40"></el-table-column>
            <el-table-column label="置顶" width="50">
              <template slot-scope="scope">{{ scope.row.topMost ? '是' : '' }}</template>
            </el-table-column>
            <el-table-column prop="title" label="文章标题"></el-table-column>
            <el-table-column label="所属分类" width="130">
              <template
                slot-scope="scope"
              >{{ scope.row.postClass ? scope.row.postClass.split(':')[0] : '' }}</template>
            </el-table-column>
            <el-table-column label="浏览/评论/赞" width="110">
              <template
                slot-scope="scope"
              >{{ scope.row.viewCount + '/' + scope.row.commentCount + '/' + scope.row.likeCount }}</template>
            </el-table-column>
            <el-table-column label="文章状态" width="90">
              <template slot-scope="scope">{{ getPostStatusString(scope.row) }}</template>
            </el-table-column>
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
              :page-count="postListAllPageAll"
              :current-page="postListAllPageCurrent"
              v-on:current-change="handleAllPage"
            ></el-pagination>
            <el-checkbox
              v-if="currentUserIsAdmin"
              v-model="postListAllShowAllArchives"
              @change="loadListAll"
            >显示所有用户的文章</el-checkbox>每页显示：
            <el-select
              style="width:90px"
              v-model="postListAllPageSize"
              placeholder="请选择"
              @change="loadListAll"
              size="small"
            >
              <el-option
                v-for="item in postListSizeOpinions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>&nbsp;&nbsp;排序：
            <el-select
              style="width:130px"
              v-model="postListAllSortBy"
              placeholder="请选择"
              @change="loadListAll"
              size="small"
            >
              <el-option
                v-for="item in postListSortOpinions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-tab-pane>
        <el-tab-pane label="草稿箱" name="draft">
          <div v-if="postListDraftLoadStatus.indexOf('error')==0" class="box">
            <div class="container" style="height:450px">
              <div
                class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column"
              >
                <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
                <p class="text-secondary mt-2">
                  <span class="h4">加载失败</span>
                  <br>
                  {{ postListDraftLoadStatus.split(':')[0] }}
                </p>
                <el-button type="primary" round @click="loadListDraft">重试</el-button>
              </div>
            </div>
          </div>
          <el-table
            v-else
            ref="listDraft"
            :data="postListDraftData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="postListDraftLoadStatus=='loading'"
          >
            <el-table-column prop="id" label="ID" width="40"></el-table-column>
            <el-table-column prop="title" label="文章标题"></el-table-column>
            <el-table-column label="所属分类" width="130">
              <template
                slot-scope="scope"
              >{{ scope.row.postClass ? scope.row.postClass.split(':')[0] : '' }}</template>
            </el-table-column>
            <el-table-column label="最近一次的修改日期">
              <template
                slot-scope="scope"
              >{{ scope.row.lastmodifyDate ? scope.row.lastmodifyDate : scope.postDate }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="handlePublish(scope.$index, scope.row)"
                >发布文章</el-button>
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
              :page-count="postListDraftPageAll"
              :current-page="postListDraftPageCurrent"
              v-on:current-change="handleDraftPage"
            ></el-pagination>每页显示：
            <el-select
              style="width:90px"
              v-model="postListDraftPageSize"
              placeholder="请选择"
              @change="loadListDraft"
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
        <el-tab-pane label="已发布" name="publish">
          <div v-if="postListPublishLoadStatus.indexOf('error')==0" class="box">
            <div class="container" style="height:450px">
              <div
                class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column"
              >
                <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
                <p class="text-secondary mt-2">
                  <span class="h4">加载失败</span>
                  <br>
                  {{ postListPublishLoadStatus.split(':')[0] }}
                </p>
                <el-button type="primary" round @click="loadListPublish">重试</el-button>
              </div>
            </div>
          </div>
          <el-table
            v-else
            ref="listPublish"
            empty-text="这里空空如也，赶快去写一篇文章吧！"
            :data="postListPublishData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="postListPublishLoadStatus=='loading'"
          >
            <el-table-column prop="id" label="ID" width="40"></el-table-column>
            <el-table-column prop="id" label="置顶" width="50">
              <template slot-scope="scope">{{ scope.row.topMost ? '是' : '' }}</template>
            </el-table-column>
            <el-table-column prop="title" label="文章标题"></el-table-column>
            <el-table-column label="所属分类" width="130">
              <template
                slot-scope="scope"
              >{{ scope.row.postClass ? scope.row.postClass.split(':')[0] : '' }}</template>
            </el-table-column>
            <el-table-column label="浏览/评论/赞" width="110">
              <template
                slot-scope="scope"
              >{{ scope.row.viewCount + '/' + scope.row.commentCount + '/' + scope.row.likeCount }}</template>
            </el-table-column>
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
              :page-count="postListPublishPageAll"
              :current-page="postListPublishPageCurrent"
              v-on:current-change="handlePublishPage"
            ></el-pagination>每页显示：
            <el-select
              style="width:90px"
              v-model="postListPublishPageSize"
              placeholder="请选择"
              @change="loadListPublish"
              size="small"
            >
              <el-option
                v-for="item in postListSizeOpinions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>&nbsp;&nbsp;排序：
            <el-select
              style="width:130px"
              v-model="postListPublishSortBy"
              placeholder="请选择"
              @change="loadListPublish"
              size="small"
            >
              <el-option
                v-for="item in postListSortOpinions"
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
  name: "ManageArchives",
  data() {
    return {
      postListAllData: null,
      postListAllPageAll: 0,
      postListAllPageSize: 20,
      postListAllPageCurrent: 1,
      postListAllLoadStatus: "notload",
      postListAllShowAllArchives: false,
      postListAllSortBy: "date",

      postListDraftData: null,
      postListDraftPageAll: 0,
      postListDraftPageSize: 20,
      postListDraftPageCurrent: 1,
      postListDraftLoadStatus: "notload",

      postListPublishData: null,
      postListPublishPageAll: 0,
      postListPublishPageSize: 20,
      postListPublishPageCurrent: 1,
      postListPublishLoadStatus: "notload",
      postListPublishSortBy: "view",

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
      postListSortOpinions: [
        {
          value: "date",
          label: "按日期排序"
        },
        {
          value: "name",
          label: "按名称排序"
        },
        {
          value: "view",
          label: "按浏览量排序"
        }
      ],

      currentUser: null,
      currentUserIsAdmin: false,

      currentTab: "all"
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
      this.loadListAll();
    },

    //Gets
    getPostStatusString(post) {
      return this.Utils.getPostStatusString(post.status);
    },

    //Events
    handleTabClick(tab) {
      if (tab.name == "all" && this.postListAllLoadStatus == "notload")
        this.loadListAll();
      if (tab.name == "draft" && this.postListDraftLoadStatus == "notload")
        this.loadListDraft();
      if (tab.name == "publish" && this.postListPublishLoadStatus == "notload")
        this.loadListPublish();
    },
    handlePublish(index, post) {
      window.open(this.getJumpRealUrl(serverConsts.PartPositions.editArchive + "?archive=" + post.id + "&publish=click"));
    },
    handleEdit(index, post) {
      window.open(this.getJumpRealUrl(serverConsts.PartPositions.editArchive + "?archive=" + post.id));
    },
    handleDelete(index, post) {
      this.$swal({
        type: "warning",
        title: "您真的要删除这一篇文章吗?",
        html: "<h5>注意，此操作不能恢复！</h5><b>标题：</b>" + post.title + "<br /><b>ID：</b>" + post.id,
        confirmButtonColor: "#d33",
        confirmButtonText: "确定删除",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        cancelButtonText: "取消",
        focusCancel: true,
        reverseButtons: true
      }).then(isConfirm => {
        if (isConfirm.value) {
          this.axios.delete(this.NET.API_URL + "/post/" + post.id).then(response => {
            if (response.data.success) {
              toast.toast("成功删除一篇文章", "success");
              if(this.currentTab == 'all') this.loadListAll();
              else if(this.currentTab == 'draft') this.loadListDraft();
              else if(this.currentTab == 'publish') this.loadListPublish();
            }
            else this.$swal("删除失败", response.message, "error");
          }).catch(response => {
            this.$swal("删除失败", "错误信息：" + response, "error");
          });
        }
      });
    },
    handleAllPage(page) {
      this.postListAllPageCurrent = page;
      this.loadListAll();
    },
    handleDraftPage(page) {
      this.postListDraftPageCurrent = page;
      this.loadListDraft();
    },
    handlePublishPage(page) {
      this.postListPublishPageCurrent = page;
      this.loadListPublish();
    },

    //Datas
    loadListAll() {
      this.postListAllLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/posts/page/" +
        (this.postListAllPageCurrent - 1) +
        "/" +
        this.postListAllPageSize +
        "?sortBy=" +
        this.postListAllSortBy +
        "&byStatus=all&noTopMost=true&byUser=" +
        (this.postListAllShowAllArchives ? "0" : this.currentUser.id);
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.postListAllData = response.data.data.content;
            this.postListAllPageAll = response.data.data.totalPages;
            this.postListAllLoadStatus = "loaded";
            this.reloadPostStats("all");
          } else this.postListAllLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.postListAllLoadStatus = "error:" + response;
        });
    },
    loadListDraft() {
      this.postListDraftLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/posts/page/" +
        (this.postListDraftPageCurrent - 1) +
        "/" +
        this.postListDraftPageSize +
        "?sortBy=date&byStatus=draft&noTopMost=true&byUser=" +
        this.currentUser.id;
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.postListDraftData = response.data.data.content;
            this.postListDraftPageAll = response.data.data.totalPages;
            this.postListDraftLoadStatus = "loaded";
          } else
            this.postListDraftLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.postListDraftLoadStatus = "error:" + response;
        });
    },
    loadListPublish() {
      this.postListPublishLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/posts/page/" +
        (this.postListPublishPageCurrent - 1) +
        "/" +
        this.postListPublishPageSize +
        "?sortBy=" +
        this.postListPublishSortBy +
        "&byStatus=publish&byUser=" +
        this.currentUser.id;
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.postListPublishData = response.data.data.content;
            this.postListPublishPageAll = response.data.data.totalPages;
            this.postListPublishLoadStatus = "loaded";
            this.reloadPostStats("publish");
          } else
            this.postListPublishLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.postListPublishLoadStatus = "error:" + response;
        });
    },
    //重载文章状态信息：浏览量、评论数等
    reloadPostStats: function(page) {
      var getPosts = { archives: [] };
      var contentPosts = null;
      if (page == "all") contentPosts = this.postListAllData;
      else if (page == "publish") contentPosts = this.postListPublishData;
      else if (page == "draft") contentPosts = this.postListDraftData;

      for (var key in contentPosts)
        if (contentPosts[key].id) getPosts.archives.push(contentPosts[key].id);

      var findOldPosts = function(id) {
        for (var key in contentPosts)
          if (contentPosts[key].id == id) return contentPosts[key];
        return null;
      };
      var reloadPostsStat = function(arr) {
        for (var key in arr) {
          var o = findOldPosts(key);
          if (o) {
            o.viewCount = arr[key].viewCount;
            o.commentCount = arr[key].commentCount;
            o.likeCount = arr[key].likeCount;
          }
        }
      };

      this.axios
        .post(this.NET.API_URL + "/posts/stat", getPosts)
        .then(response => {
          if (response.data.success) reloadPostsStat(response.data);
        })
        .catch(response => {
          console.log(response);
        });
    }
  }
};
</script>