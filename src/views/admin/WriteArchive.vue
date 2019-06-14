<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px 36px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentTab=='write'">写作</el-breadcrumb-item>
        <el-breadcrumb-item v-else-if="currentTab=='comments'">评论管理</el-breadcrumb-item>
        <el-breadcrumb-item v-else-if="currentTab=='media-center'">文章媒体库管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="better-scroll-white" style="padding:0 36px">
      <el-tabs v-model="currentTab" @tab-click="handleTabClick">
        <el-tab-pane label="写作" name="write">
          <div v-if="currentArchiveObject" class="blog-editor-container">
            <el-input type="text" v-model="currentArchiveObject.title" placeholder="请输入文章标题" maxlength="100" show-word-limit class="btn-block mb-2"></el-input>
            <mavon-editor v-if="currentArchiveObject.type=='markdown'" v-model="currentArchiveContent" @save="saveChange()" :style="'height:' + getBestEditorHeight() + 'px;border: 1px solid #ddd;'"/>
            <fish-editor v-if="currentArchiveObject.type=='html'" v-model="currentArchiveContent" @save="saveChange()" :style="'height:' + getBestEditorHeight() + 'px'" v-bind:height="getBestEditorHeight()"></fish-editor>
          </div>
          <div v-if="currentArchiveObject" style="margin-top: 20px">
              文章格式：<el-select v-model="currentArchiveType" placeholder="请选择" style="width: 120px" @change="handleArcType">
                <el-option v-for="item in archiveTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 5px;">{{ item.text }}</span>
                </el-option>
              </el-select>
              <div class="btn-inline float-right">
                <el-tooltip class="item" effect="dark" content="编辑文章基本信息" placement="left">
                  <el-button icon="el-icon-edit" circle @click="editingBasicObject=true"></el-button>
                </el-tooltip>
                <el-button v-if="getArchiveCanUnPublish()" round @click="jump('/post/' + currentArchiveObject.id)"><i class="fa fa-eye mr-2"></i>转到文章页面</el-button>
                
                <el-button v-if="getArchiveCanPublish()" round ><i class="fa fa-paper-plane-o mr-2" @click="publish"></i>发布文章</el-button>
                <el-button v-if="getArchiveCanUnPublish()" type="info" round @click="unPublish">撤回文章</el-button>
                
                <el-button v-if="getArchiveCanPublish()" round @click="saveChange('draft')"><i class="fa fa-pencil-square-o mr-2"></i>保存到草稿</el-button>
                <el-button v-else type="success" round @click="saveChange"><i class="fa fa-floppy-o mr-2"></i>保存更改</el-button>
                
                <el-button v-if="getArchiveCanUnChange()" type="danger" round @click="cancelChange">放弃更改</el-button>
                <el-button v-else type="danger" round disabled>放弃更改</el-button>
              </div>
            </div>
          
          <div v-else class="container" :style="'height:' + getBestEditorHeight() + 'px'">
            <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
              <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
              <p class="text-secondary mt-2">
                <span class="h4">加载文章失败</span>
                <br>{{ currentArchiveLoadError }}
              </p>
              <div class="btn-inline">
                <el-button round @click="jump('/admin/manage-archives/')">返回主页</el-button>&nbsp;
                <el-button v-if="currentArchiveErrorCanRetry" type="primary" round @click="jump('/admin/')">重试</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评论管理" name="comments">
          <div v-if="commentListLoadStatus.indexOf('error')==0" class="box">
            <div class="container" style="height:450px">
              <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
                <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
                <p class="text-secondary mt-2">
                  <span class="h4">加载失败</span>
                  <br>
                  {{ commentListLoadStatus.split(':')[1] }}
                </p>
                <el-button type="primary" round @click="loadComments">重试</el-button>
              </div>
            </div>
          </div>
          <el-table v-else ref="commentsTable" :data="commentListData" tooltip-effect="dark" style="width: 100%" empty-text="这篇文章还没有评论哦！" @selection-change="handleCommentListSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户名/IP" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.authorId">{{ scope.row.authorId }}<br/></span>
                <span v-if="scope.row.authorIp">{{ scope.row.authorIp }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="postDate" label="日期"></el-table-column>
            <el-table-column prop="commentContent" label="内容" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="comment-preview" v-html="getCommentContent(scope.row.commentContent)"></div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleCommentMoreInfo(scope.$index, scope.row)">更多信息</el-button>
                <el-button size="mini" type="danger" @click="handleCommentDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
             每页显示：<el-pagination
              class="btn-inline float-right"
              background
              layout="prev, pager, next"
              :page-count="commentListPageAll"
              :current-page="commentListPageCurrent"
              v-on:current-change="handleCommentListPage"
            ></el-pagination>
            <el-select style="width:90px" v-model="commentListPageSize" placeholder="请选择" @change="loadComments" size="small">
              <el-option
                v-for="item in commentListSizeOpinions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            &nbsp;
            <el-button size="small" type="danger" @click="handleCommentDeleteSelect">删除选中项</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="媒体库" name="media-center"></el-tab-pane>
      </el-tabs>
    </el-main>
    <el-dialog
      title="文章设置"
      :visible.sync="editingBasicObject"
      class="dialog-auto-width-50">
      <el-form v-if="currentArchiveObject" size="small" ref="formBasicObject" :model="currentArchiveObject" label-width="100px" :label-position="isMobileView ? 'top' : 'right'">
        <el-form-item>
          <b>基本设置</b>
        </el-form-item> 
        <hr>
        <el-form-item label="文章路径参数">
           <el-input type="text" v-model="currentArchiveObject.urlName" placeholder="文章路径参数，为空则不使用参数" maxlength="100" show-word-limit></el-input>
          <span class="text-secondary">/post/{postUrlName}</span>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="currentArchiveObject.enableComment">允许评论</el-checkbox>
          <el-checkbox v-model="currentArchiveShowLastModifyDate">自动添加修改日期</el-checkbox>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input type="textarea" placeholder="请输入文章摘要" v-model="currentArchiveObject.previewText"></el-input>
        </el-form-item>
        <el-form-item label="文章缩略图">
        </el-form-item>
        <el-form-item>
          <b>分类和标签</b>
        </el-form-item> 
        <hr>
        <el-form-item label="分类">
          <el-select v-model="currentArchiveCategory" placeholder="请选择" class="btn-block">
            <el-option key="nonez" label="(不分类)" value="nonez"></el-option>
            <el-option 
              v-for="item in archiveCategories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              filterable>
               <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 5px;">{{ item.text }}</span>
            </el-option>
          </el-select>
          <el-button icon="el-icon-refresh" class="mt-2" round @click="loadCategories(true)">刷新分类列表</el-button>
        </el-form-item>
        <el-form-item label="标签">
          <el-cascader
            v-if="archiveTags && currentArchiveTags"
            placeholder="文章的标签，可直接输入名字搜索"
            :options="archiveTags"
            :props="{ multiple: true }"
            v-model="currentArchiveTags"
            class="btn-block"
            filterable>
          </el-cascader> 
          <el-button icon="el-icon-refresh" class="mt-2" round @click="loadTags(true)">刷新标签列表</el-button>
        </el-form-item>
        <el-form-item>
          <span v-if="currentUserCanManageClassfications" class="text-secondary">请前往 <a :href="getJumpRealUrl('/admin/manage-classfication/')" target="_blank">分类和标签页面</a> 管理分类和标签。</span>
          <span v-else class="text-secondary">您必须拥有 <span class="text-primary">管理分类和标签</span> 权限，才能添加分类和标签。</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editingBasicObject=false">确定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import $ from "jquery";
import Chart from "chart.js";
import serverConsts from "../../constants/serverConsts.js";
import toast from "../../assets/lib/toast/toast.simply.js";
import base64 from "../../assets/lib/base64/base64.min.js";
import FishEditor from '../../components/FishEditor'

export default {
  name: "WriteArchive",
  data() {
    return {
      currentUser: null,
      currentUserIsAdmin: false,
      currentUserCanManageClassfications: false,

      currentTab: "write",

      currentArchiveLoadError: '',
      currentArchiveErrorCanRetry: false,
      currentIsNew: true,
      currentArchiveObject: null,
      currentArchiveObjectBackup: null,
      currentArchiveContent: null,
      currentArchiveType: null,
      currentArchiveShowLastModifyDate: false,
      currentArchiveTags: null,
      currentArchiveCategory: null,

      editingBasicObject: false,

      archiveTags: null,
      archiveCategories: null,
      archiveTypes: [
        {
          value: 'markdown',
          label: 'Markdown',
          text: '以 Markdown 格式解析文章'
        },
        {
          value: 'html',
          label: 'HTML',
          text: '以纯 HTML 格式解析文章'
        }
      ],


      commentListData: null,
      commentListPageAll: 0,
      commentListPageSize: 20,
      commentListPageCurrent: 1,
      commentListLoadStatus: "notload",
      commentListSortBy: "view",
      commentListSelection: [],

      commentListSizeOpinions: [
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
  computed: {
    isMobileView: function(){
      return document.body.clientWidth < 576;
    },
  },
  mounted() {
    this.init();
  },
  components: {
    'fish-editor': FishEditor
  },
  methods: {
    init: function() {
      this.$store.dispatch("global/resetHeader");
      this.$store.dispatch("global/setAdminPanel", true);
      this.$store.dispatch("global/switchFooter", false);
      this.$store.dispatch("global/setHeaderMenuStyle", "main-menu-white full");
      window.onbeforeunload = function() { return "请确认您的文章保存了以后再离开此页面哦！"; };
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getBestEditorHeight(){
      return document.body.clientHeight - 165 -55
    },
    authInfoInited(authed) {
      if (authed) {
        this.currentUser = this.$store.getters["auth/authInfo"];
        this.currentUserIsAdmin = this.currentUser.level == serverConsts.UserLevels.admin;
        this.currentUserCanManageClassfications = this.Utils.getUserHasPrivilege(this.currentUser, serverConsts.UserPrivileges.manageClassAndTags);

        //Load
        var archive = this.$route.query.archive;
        if (archive) this.loadPostObject(archive);
        else this.loadNewPostObject();
        this.loadTags();
        this.loadCategories();
        this.handleTabClick();
      }
    },

    //Gets
    getArchiveCanPublish() {
      return this.currentArchiveObject.status == serverConsts.ArchiveStatus.PRIVATE || this.currentArchiveObject.status == serverConsts.ArchiveStatus.DRAFT;
    },
    getArchiveCanUnPublish() {
      return this.currentArchiveObject.status == serverConsts.ArchiveStatus.PUBLISH;
    },
    getArchiveCanUnChange() {
      return !this.currentIsNew;
    },
    getPostStatusString(post) {
      return this.Utils.getPostStatusString(post.status);
    },
    getCommentContent(content){
      if (!this.Utils.isNullOrEmpty(content)) {
        var a = this.Utils.isBase64(content)
          ? base64.decode(content)
          : content;
        var showdown  = require('showdown');
        var b = new showdown.Converter();
        return b.makeHtml(a);
        
      }
      return "";
    },

    //Events
    handleTabClick(tab) {
      if(this.currentTab == 'comments' && this.commentListLoadStatus == 'notload')
        this.loadComments();
    },
    handleArcType(type) {
      this.$swal({
        type: 'warning', // 弹框类型
        title: '真的要修改文章类型吗', //标题
        text: "注意，修改文章类型以后会使用不同的编辑器，需要您手动修改文章，以保证显示正常", //显示内容
        confirmButtonColor: '#3085d6',// 确定按钮的 颜色
        confirmButtonText: '确定',// 确定按钮的 文字
        showCancelButton: true, // 是否显示取消按钮
        cancelButtonColor: '#aaa', // 取消按钮的 颜色
        cancelButtonText: "取消", // 取消按钮的 文字
        focusCancel: true, // 是否聚焦 取消按钮
        reverseButtons: true  // 是否 反转 两个按钮的位置 默认是  左边 确定  右边 取消
      }).then((isConfirm) => {
        if (isConfirm.value) {
          this.currentArchiveObject.type = type;
          toast.toast('修改文章类型成功！', 'success')
        }else {
          this.currentArchiveType = this.currentArchiveObject.type;
        }
      });
    },
    handleCommentDelete(index, comment){
      this.$swal({
        type: "warning",
        title: "删除这一条评论吗?",
        html: "<h5>注意，此操作不能恢复！</h5><div class='sweetalert-content-box'><b>ID：</b>" + comment.id + '</div>',
        confirmButtonColor: "#d33",
        confirmButtonText: "确定删除",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        cancelButtonText: "取消",
        focusCancel: true,
        reverseButtons: true
      }).then(isConfirm => {
        if (isConfirm.value) {
          this.axios.delete(this.NET.API_URL + "/post/" + this.currentArchiveObject.id + '/comments/' + comment.id).then(response => {
            if (response.data.success) {
              toast.toast("成功删除 1 条评论", "success");
              this.loadComments();
            }
            else this.$swal("删除失败", response.message, "error");
          }).catch(response => { this.$swal("删除失败", "错误信息：" + response, "error"); });
        }
      })
    },
    handleCommentDeleteSelect(){
      if(this.commentListSelection.length==0){
        this.$swal('请选中一个条目','','info');
        return;
      }
      this.$swal({
        type: "warning",
        title: "删除选中的 " + this.commentListSelection.length + " 条评论吗?",
        confirmButtonColor: "#d33",
        confirmButtonText: "确定删除",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        cancelButtonText: "取消",
        focusCancel: true,
        reverseButtons: true
      }).then(isConfirm => {
        if (isConfirm.value) {
          var delPosts = { comments: [] };
          var i = 0;
          for(var key in this.commentListSelection) {
            delPosts.comments[i] = this.commentListSelection[key].id;
            i++;
          }
          this.axios.delete(this.NET.API_URL + "/post/" + this.currentArchiveObject.id + '/comments', delPosts).then(response => {
            if (response.data.success) {
              toast.toast("成功删除 " + this.commentListSelection.length + " 条评论", "success");
              this.loadComments();
            }
            else this.$swal("删除失败", response.message, "error");
          }).catch(response => { this.$swal("删除失败", "错误信息：" + response, "error"); });
        }
      })
    },
    handleCommentMoreInfo(index, comment){
      this.$swal({
        type: "info",
        title: "评论详细信息",
        html: "<div class='sweetalert-content-box'><b>ID：</b>" + comment.id + "<br />" + 
        "<b>发布用户 ID：</b>" + comment.authorId + "<br />" + 
        "<b>发布用户 IP：</b>" + comment.authorIp + "<br />" + 
        "<b>发布用户邮箱地址：</b>" + comment.authorMail + "<br />" + 
        "<b>发布用户名字：</b>" + comment.authorName + "<br />" + 
        "<b>发布用户主页地址：</b>" + comment.authorWebsite + "<br />" + 
        "<b>发布时间：</b>" + comment.postDate + "<br />" + 
        "</div>",
        confirmButtonText: "确定",
      });
    },
    handleCommentListPage(p){
      this.loadComments();
    },
    handleCommentListSelectionChange(val) {
      this.commentListSelection = val;
    },

    //Data
    loadPostObject(idOrUrlName) {
      this.currentIsNew = false;
      this.axios.get(this.NET.API_URL + "/post/" + idOrUrlName + "?authPrivate=true").then(response => {
        if(response.data.success){
          this.currentArchiveObject = response.data.data;
          this.currentArchiveType = response.data.data.type;
          this.currentArchiveObjectBackup = this.Utils.clone(this.currentArchiveObject);
          this.loadPDataStart();
        }else{
          this.currentArchiveObject = null;
          this.currentArchiveLoadError = response.data.message;
          this.currentArchiveErrorCanRetry = false;
        }
      }).catch(response => {
        this.currentArchiveLoadError = response;
        this.currentArchiveErrorCanRetry = true;
      });
    },
    loadNewPostObject() {
      this.currentIsNew = true;
      this.currentArchiveObject = {
        author: this.currentUser.friendlyName ? this.currentUser.friendlyName : this.currentUser.name ,
        authorId: this.currentUser.id,
        commentCount: 0,
        content: "",
        enableComment: true,
        headimg: "",
        headimgMask: false,
        id: 0,
        postClass: "",
        postDate: "",
        postNextId: 0,
        postNextTitle: "",
        postPrefix: 0,
        postPrvId: 0,
        postTagNames: [],
        previewImage: "",
        previewText: "",
        status: 1,
        tags: "",
        title: "",
        type: "markdown",
        urlName: "",
        viewCount: 0,
        showInList: true,
        showCatalog: true
      };
    },
    loadTags(t){
      this.axios.get(this.NET.API_URL + '/tags').then((response) => {
        if(response.data.success){
          this.archiveTags = [];
          var arrOrg = response.data.data, arr = this.archiveTags;
          Object.keys(arrOrg).forEach(function(key){
            arr.push({
              label: arrOrg[key].name,
              value: arrOrg[key].id
            })
          })
          if(t) toast.toast('刷新文章标签列表成功', 'success', 3000);
        }else if(t) toast.toast('刷新文章标签列表失败：' + response.data.message, 'success', 6000);
      }).catch((err) => {
        if(t) toast.toast('刷新文章标签列表失败：' + err, 'success', 6000);
      });
    },
    loadCategories(t){
      this.axios.get(this.NET.API_URL + '/classes').then((response) => {
        if(response.data.success){
          this.archiveCategories = [];
          var arrOrg = response.data.data, arr = this.archiveCategories;
          Object.keys(arrOrg).forEach(function(key){
            arr.push({
              label: arrOrg[key].title,
              text: arrOrg[key].previewText,
              value: arrOrg[key].urlName,
            })
          })

          if(t) toast.toast('刷新文章分类列表成功', 'success', 3000);
        }else if(t) toast.toast('刷新文章分类列表失败：' + response.data.message, 'success', 6000);
      }).catch((err) => {
        if(t) toast.toast('刷新文章分类列表失败：' + err, 'success', 6000);
      });
    },
    loadPDataStart(){
      this.currentArchiveShowLastModifyDate = !this.Utils.isNullOrEmpty(this.currentArchiveObject.lastmodifyDate);
      this.currentArchiveCategory = this.currentArchiveObject.postClass ? this.currentArchiveObject.postClass.split(':')[0] : 'nonez';
      if(!this.Utils.isNullOrEmpty(this.currentArchiveObject.tags)){
        var arr =  this.currentArchiveObject.tags.split('-');
        this.currentArchiveTags = [];
        for(var key in arr) {
          if(!this.Utils.isNullOrEmpty(arr[key])){
            this.currentArchiveTags.push(arr[key]);
          }
        }
      }
      if(this.currentArchiveObject.content)
        this.currentArchiveContent = base64.decode(this.currentArchiveObject.content);
      else this.currentArchiveContent = '';
    },
    loadComments(){
      this.commentListLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/post/" + this.currentArchiveObject.id + '/comments/' +
        (this.commentListPageCurrent - 1) +
        "/" +
        this.commentListPageSize;
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.commentListData = response.data.data.content;
            this.commentListPageAll = response.data.data.totalPages;
            this.commentListLoadStatus = "loaded";
          } else this.commentListLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.commentListLoadStatus = "error:" + response;
        });
    },


    //参数验证
    saveValidate(){
      if(this.Utils.isNullOrEmpty(this.currentArchiveObject.title)) {
        this.$swal('您正在提交没有标题的文章', '您必须输入文章的标题才能保存文章哦', 'warning');
        return true;
      }
      if(this.Utils.isNullOrEmpty(this.currentArchiveContent)) {
        this.$swal('您正在提交一篇空的文章', '您必须写一些文章内容才能保存文章哦', 'warning');
        return true;
      }
    },
    //文章提交操作
    //保存
    saveSubmit(targetStatus, successCallback){

      //先验证参数
      if(this.saveValidate()){
        successCallback(false);
        return;
      }

      //同步一些已修改数据至 Object 中
      this.currentArchiveObject.type = this.archiveType;
      //生成Tags标签数据
      var tagsStr = '-';
      for(var key in this.currentArchiveTags) 
        tagsStr += this.currentArchiveTags[key] + '-';
      this.currentArchiveObject.tags = tagsStr!='-' ? tagsStr : null;
      this.currentArchiveObject.lastmodifyDate = this.currentArchiveShowLastModifyDate ? new Date().format('YYYY-MM-dd HH:ii:ss') : null;
      if(this.currentArchiveCategory){
        var str = null;
        for(var key in this.archiveCategories) {
          if(this.archiveCategories[key].value == this.currentArchiveCategory){
            str = this.archiveCategories[key].value + ':' + this.archiveCategories[key].label;
            break;
          }
        }
        this.currentArchiveObject.postClass = str;
      }
      this.currentArchiveObject.type = this.currentArchiveType;
      if(this.currentArchiveObject.postClass == 'nonez')
        this.currentArchiveObject.postClass = '';
      //拷贝内容
      this.currentArchiveObject.content = base64.encode(this.currentArchiveContent);
      //设置一些初始值
      if (this.currentIsNew) {
        if (this.Utils.isNullOrEmpty(this.currentArchiveObject.urlName)) genPostUrlName(); 
        if (this.currentUser) {
        //设置作者id
        this.currentArchiveObject.authorId = this.currentUser.id;
        //设置作者名字 
        if(!this.Utils.isNullOrEmpty(this.currentUser.friendlyName))
          this.currentArchiveObject.author = this.currentUser.friendlyName;
        else if(!this.Utils.isNullOrEmpty(this.currentUser.name))
          this.currentArchiveObject.author = this.currentUser.name;
        }      
      }
      //修改文章状态
      if(targetStatus!=-1){
        this.currentArchiveObject.status = targetStatus;
        this.currentArchiveObject = targetStatus;
      }
      setTimeout(() => {
        //提交
        if (this.currentIsNew) {
          this.axios.post(this.NET.API_URL + "/post", this.currentArchiveObject).then(response => {
            if (response.data.success) {
              //重新刷新返回的数据
              this.currentArchiveObject = response.data.data;
              this.currentArchiveObjectBackup = this.Utils.clone(this.currentArchiveObject);
              this.currentIsNew = false;
              successCallback();
              this.$swal("文章保存成功！", '', "success");
            } else {
              successCallback(false);
              this.$swal("抱歉！新建文章失败", response.data.message, "error");
            }
          }).catch(response => {
            successCallback(false);
            this.$swal("新建文章失败", "错误信息：" + response + '。 请检查您的网络？', "error"); 
          });
        } else{
          this.axios.put(this.NET.API_URL + "/post/" + this.currentArchiveObject.id, this.currentArchiveObject).then(response => {
            if (response.data.success) successCallback(true); 
            else {
              successCallback(false);
              this.$swal("抱歉！提交文章失败了", response.data.message, "error");
            }
          }).catch(response => {
            successCallback(false);
            this.$swal("提交文章失败了", "错误信息：" + response + '。 请检查您的网络？', "error"); 
          });
        }
      }, 600);
    },

    //放弃修改
    cancelChange() {
      this.$swal({
        type: 'warning', title: '真的要放弃修改吗', text: "注意，您的未保存修改将会丢失！", confirmButtonColor: '#d33', confirmButtonText: '确定',
        showCancelButton: true, cancelButtonColor: '#3085d6',
        cancelButtonText: "取消", focusCancel: true, reverseButtons: true
      }).then((isConfirm) => {
        if (isConfirm.value) {
          this.Utils.cloneValue(this.currentArchiveObject, this.currentArchiveObjectBackup);
          this.this.loadPDataStart();
          toast.toast('已将文章恢复为修改前状态', 'success')
        }
      });
    },
    //保存修改
    saveChange(st) {
      this.$swal({
        type: 'question', title: '您真的要现在保存修改吗', text: "", confirmButtonColor: '#3085d6', confirmButtonText: '保存',
        showCancelButton: true, cancelButtonColor: '#999', cancelButtonText: "再改改", focusCancel: true, reverseButtons: true
      }).then((isConfirm) => {
        if (isConfirm.value) {
          var targetStatus = -1;
          var t = toast.toast('正在提交文章', 'loading', -1);
          if (st=='draft') targetStatus = serverConsts.ArchiveStatus.DRAFT;
          else if(st=='private') targetStatus = serverConsts.ArchiveStatus.PRIVATE;
          else if(st=='publish') targetStatus = serverConsts.ArchiveStatus.PUBLISH;
          this.saveSubmit(targetStatus, (success) => {
            toast.toastClose(t);
            if(success) this.$swal('文章修改提交成功！', '', 'success')
          });
        }
      });
    },
    //发布
    publish() {
      this.$swal({
        type: 'warning', title: '真的要发布文章吗', text: "您的文章将会被发布", confirmButtonColor: '#3085d6', confirmButtonText: '立即发布',
        showCancelButton: true, cancelButtonColor: '#999', cancelButtonText: "再改改", focusCancel: true, reverseButtons: true
      }).then((isConfirm) => {
        if (isConfirm.value) {
          var t = toast('正在提交文章', 'loading', -1);
          this.saveSubmit(serverConsts.ArchiveStatus.PUBLISH, (success) => {
            toast.toastClose(t);
            if(success) swal('文章发布成功！', '', 'success')
          });                  
        }
      });
    },
    //撤回
    unPublish() {
      this.$swal({
        type: 'warning', title: '真的要撤回文章吗', text: "撤回后您的文章只有您自己能看到（它将被保存在草稿箱中）", confirmButtonColor: '#3085d6', confirmButtonText: '确定撤回',
        showCancelButton: true, cancelButtonColor: '#999', cancelButtonText: "取消", focusCancel: true, reverseButtons: true
      }).then((isConfirm) => {
        if (isConfirm.value) {
          var t = toast('正在撤回文章', 'loading', -1);
          this.saveSubmit(serverConsts.ArchiveStatus.DRAFT, (success) => {
            toast.toastClose(t);
            if(success) toast.toast('成功将文章撤回到草稿箱', 'success');
          });                  
        }
      });
    },

  }
};
</script>

<style>
.blog-editor-container{
  overflow: hidden;
}
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
.swal2-container.swal2-shown{
  z-index: 3000;
}
.v-note-op div[type=button]{
  -webkit-appearance: none;
}
.v-note-op.shadow{
  border-bottom: 1px solid #ddd!important;
  box-shadow: none!important;
}
.v-note-wrapper.fullscreen{
  height: auto!important;
}
.comment-preview{
  display: block;
  overflow: hidden;
}
.comment-preview *{
  text-overflow: ellipsis;
  overflow: hidden;
}
.comment-preview p{
  margin: 0;
}
</style>
