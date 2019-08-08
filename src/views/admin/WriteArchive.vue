<template>
  <el-container>
    <el-header  class="admin-header">
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
            <mavon-editor ref="editorMarkdown" v-if="currentArchiveObject.type=='markdown'" v-model="currentArchiveContent" @insert-image="handleInsertImage" @save="saveChange()" :style="'height:' + getBestEditorHeight() + 'px;border: 1px solid #ddd;'" :boxShadow="false"/>
            <fish-editor ref="editorHtml" v-if="currentArchiveObject.type=='html'" v-model="currentArchiveContent" @insert-image="handleInsertImage" @save="saveChange()" :style="'height:' + getBestEditorHeight() + 'px;'"/>
          </div>
          <div v-if="currentArchiveObject" style="margin-top: 20px">
              文章格式：<el-select v-model="currentArchiveType" placeholder="请选择" style="width: 120px" @change="handleArcType">
                <el-option v-for="item in archiveTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                  <span style="float:left">{{ item.label }}</span>
                  <span style="float:right;color:#8492a6;font-size:13px;margin-left:5px;">{{ item.text }}</span>
                </el-option>
              </el-select>
              <el-button v-if="!currentIsNew" type="text" class="ml-2" @click="saveDraft" size="mini">保存草稿</el-button>
              <el-button v-else type="text" class="ml-2" disabled="disabled" size="mini">保存草稿</el-button>
              <span v-if="editingAutoSave" class="ml-3 text-secondary" style="font-size:12px">{{ editingAutoSaveLastTime }}</span>

              <div class="btn-inline float-right">
                <el-tooltip class="item" effect="dark" content="编辑文章基本信息" placement="left">
                  <el-button icon="el-icon-edit" circle @click="editingBasicObject=true"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="转到文章页面" placement="top">
                  <el-button v-if="getArchiveCanUnPublish()" circle @click="jump('/archives/post/' + currentArchiveObject.id)"><i class="fa fa-eye"></i></el-button>
                </el-tooltip>

                <el-button v-if="getArchiveCanPublish()" @click="publish()" round ><i class="fa fa-paper-plane-o mr-2"></i>发布文章</el-button>
                <el-button v-if="getArchiveCanUnPublish()" type="info" @click="unPublish()" round>撤回文章</el-button>
                
                <el-button v-if="getArchiveCanPublish()" @click="saveChange('draft')" round><i class="fa fa-pencil-square-o mr-2"></i>保存到草稿</el-button>
                <el-button v-else type="success" @click="saveChange()" round><i class="fa fa-floppy-o mr-2"></i>保存更改</el-button>
                
                <el-button v-if="getArchiveCanUnChange()" type="danger" @click="cancelChange()" round>放弃更改</el-button>
                <el-button v-else type="danger" round disabled>放弃更改</el-button>
              </div>
            </div>
          
          
          <error-page v-else v-bind:error="currentArchiveLoadError" v-bind:height="getBestEditorHeight() + 'px'"></error-page>
        </el-tab-pane>
        <el-tab-pane label="评论管理" name="comments">
          <error-page v-if="currentIsNew" v-bind:title="'您必须发布文章以后才能管理评论'" :can-retry="false"></error-page>
          <error-page v-else-if="commentListLoadStatus.indexOf('error')==0" v-bind:error="commentListLoadStatus"></error-page>
          <el-table v-else ref="commentsTable" :data="commentListData" tooltip-effect="dark" style="width: 100%" empty-text="这篇文章还没有评论哦！" @selection-change="handleCommentListSelectionChange" v-loading="commentListLoadStatus=='loading'">
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
        <el-tab-pane label="媒体库" name="media-center">
          <!--媒体库标签页-->
          <error-page v-if="currentIsNew" v-bind:title="'使用媒体库功能需要保存文章'" v-bind:error="'您也可以先保存至草稿'" :can-retry="false"></error-page>
          <el-tabs v-else tabPosition="left" v-model="currentTabMedia" @tab-click="handleTabMediaCenterClick">
            <el-tab-pane label="图片库" name="image">
              <error-page v-if="mediaImageLoadStatus.indexOf('error:')==0" v-bind:error="mediaImageLoadStatus" v-bind:height="getBestEditorHeight() + 'px'"></error-page>
              <image-list v-else ref="mediaImageList" 
                v-bind:items="mediaImageData" 
                v-bind:loaded-status="mediaImageLoadStatus"
                null-text="这里还没有图片，您可以点击下方按钮上传"
                @item-click="handleMediaImageItemClick"></image-list>
              <div style="margin-left: 15px;margin-top: 20px">
                每页显示：<el-pagination
                  class="btn-inline float-right"
                  background
                  layout="prev, pager, next"
                  :page-count="mediaImagePageCount"
                  :current-page="mediaImagePageCurrent"
                  v-on:current-change="handleMediaImageListPage"
                ></el-pagination>
                <el-select style="width:90px" v-model="mediaImagePageSize" placeholder="请选择" @change="loadMediaImages(1)" size="small">
                  <el-option
                    v-for="item in commentListSizeOpinions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                &nbsp;
                <el-button size="small" type="success" @click="handleMediaImageItemClick('add')"><i class="fa fa-plus mr-2"></i>添加图片</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="视频库" name="video">
              <error-page v-if="mediaVideoLoadStatus.indexOf('error:')==0" v-bind:error="mediaVideoLoadStatus" v-bind:height="getBestEditorHeight() + 'px'"></error-page>
              <video-list v-else ref="mediaVideoList" 
                v-bind:items="mediaVideoData" 
                v-bind:loaded-status="mediaVideoLoadStatus"
                null-text="这里还没有视频，您可以点击下方按钮上传"
                @item-click="handleMediaVideoItemClick"></video-list>
              <div style="margin-left: 15px;margin-top: 20px">
                每页显示：<el-pagination
                  class="btn-inline float-right"
                  background
                  layout="prev, pager, next"
                  :page-count="mediaVideoPageCount"
                  :current-page="mediaVideoPageCurrent"
                  v-on:current-change="handleMediaVideoListPage"
                ></el-pagination>
                <el-select style="width:90px" v-model="mediaVideoPageSize" placeholder="请选择" @change="loadMediaVideos(1)" size="small">
                  <el-option
                    v-for="item in commentListSizeOpinions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                &nbsp;
                <el-button size="small" type="success" @click="handleMediaVideoItemClick('add')"><i class="fa fa-plus mr-2"></i>添加视频</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="附件库" name="files">
              <error-page v-if="mediaFilesLoadStatus.indexOf('error:')==0" v-bind:error="mediaFilesLoadStatus" v-bind:height="getBestEditorHeight() + 'px'"></error-page>
              <file-list v-else ref="mediaFilesList" 
                v-bind:items="mediaFilesData" 
                v-bind:loaded-status="mediaFilesLoadStatus"
                null-text="这里还没有附件，您可以点击下方按钮上传"
                @item-click="handleMediaFilesItemClick"></file-list>
              <div style="margin-left: 15px;margin-top: 20px">
                每页显示：<el-pagination
                  class="btn-inline float-right"
                  background
                  layout="prev, pager, next"
                  :page-count="mediaFilesPageCount"
                  :current-page="mediaFilesPageCurrent"
                  v-on:current-change="handleMediaFilesListPage"
                ></el-pagination>
                <el-select style="width:90px" v-model="mediaFilesPageSize" placeholder="请选择" @change="loadMediaFiles(1)" size="small">
                  <el-option
                    v-for="item in commentListSizeOpinions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                &nbsp;
                <el-button size="small" type="success" @click="handleMediaFilesItemClick('add')"><i class="fa fa-plus mr-2"></i>添加附件</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>      
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <!--文章信息对话框-->
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
           <el-input type="text" v-model="currentArchiveObject.urlName" placeholder="文章路径参数，为空则不使用参数" maxlength="250" show-word-limit></el-input>
          <span class="text-secondary">/post/{postUrlName}</span>
        </el-form-item>
        <el-form-item label="文章显示目录">
          <el-switch v-model="currentArchiveObject.showCatalog" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="文章允许评论">
          <el-switch v-model="currentArchiveObject.enableComment" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="文章置顶">
          <el-switch v-model="currentArchiveObject.topMost" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="currentArchiveObject.showInList">显示在文章列表中</el-checkbox>
          <el-checkbox v-model="currentArchiveShowLastModifyDate">自动添加修改日期</el-checkbox>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="currentArchiveObject.postPrefix" placeholder="请选择">
            <el-option v-for="item in archivePrefix" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select><br/>
          <span class="text-secondary ml-3">此选项目前仅用作标记文章</span>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input type="textarea" placeholder="请输入文章摘要" v-model="currentArchiveObject.previewText"></el-input>
        </el-form-item>
        <el-form-item label="文章关键词">
          <el-input type="textarea" placeholder="请输入文章关键词，每个以英文逗号(,)分隔" v-model="currentArchiveObject.keywords"></el-input>
        </el-form-item>
        <el-form-item label="文章缩略图">
          <el-image
            style="width:100%;max-width:200px;height:auto;border:1px solid #cdcdcd;border-radius:5px;"
            :src="getArchivePreviewImage()" :fit="'contain'"></el-image>
          <br/>
          <el-button type="text" @click="handleChoosePrewImage">更换缩略图</el-button>
          <el-button type="text" @click="handleClearPrewImage">清除缩略图</el-button>
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
        <hr>
        <el-form-item label="上一篇/下一篇文章ID">
          
          <el-row :gutter="20">
            <el-col :span="10">
              <el-input placeholder="输入上一篇文章ID" v-model="currentArchiveObject.postNextId"></el-input>
            </el-col>
            <el-col :span="10">
              <el-input placeholder="输入下一篇文章ID" v-model="currentArchiveObject.postPrvId"></el-input>
            </el-col>
          </el-row>
          <span class="text-secondary">您可以自定义此文章的上一篇/下一篇对应哪篇文章的ID，填写0则认为没有上一篇/下一篇文章。</span>
          
        </el-form-item>
        <hr>
        <el-form-item label="高级设置">
          <el-switch v-model="editingBasicObjectMore" active-color="#13ce66" inactive-color="#688568"></el-switch>
        </el-form-item> 
        <el-form-item v-if="editingBasicObjectMore">
          <b>重写文章参数</b><br>
          <span class="text-secondary">如果文章显示的参数与实际不符，您可以重写它</span>
        </el-form-item> 
        <el-form-item v-if="editingBasicObjectMore" label="查看数">
          <el-input placeholder="输入查看数" v-model="currentArchiveObject.viewCount"></el-input>
        </el-form-item>
        <el-form-item v-if="editingBasicObjectMore" label="评论数">
          <el-input placeholder="输入评论数" v-model="currentArchiveObject.commentCount"></el-input>
        </el-form-item>
        <el-form-item v-if="editingBasicObjectMore" label="点赞数">
          <el-input placeholder="输入点赞数" v-model="currentArchiveObject.likeCount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editingBasicObject=false">确定</el-button>
      </span>
    </el-dialog>
    <!--上传对话框-->
    <el-dialog
      title="上传图片"
      :visible.sync="mediaImageUploading"
      class="dialog-auto-width-50">
      <uploading-list v-bind:items="mediaImageUploadingFileList" accept="image/*" @delete="handleUploadImageCancel" @select-file="handleUploadImage" ref="uploadMediaImages" name="uploadMediaImages"></uploading-list>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleUploadAddImage" round><i class="fa fa-plus mr-2"></i>添加图片</el-button>
        <el-button type="primary" @click="handleUploadImageClearFinish" round>清空已完成</el-button>
        <el-button @click="handleUploadImageClose" round>确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="上传视频"
      :visible.sync="mediaVideoUploading"
      class="dialog-auto-width-50">
      <el-alert title="为了保证上传成功，请不要关闭本页面" type="warning" close-text="知道了"></el-alert>
      <uploading-list v-bind:items="mediaVideoUploadingFileList" @delete="handleUploadVideoCancel" @select-file="handleUploadVideo" ref="uploadMediaVideos" accept="video/*" name="uploadMediaVideos"></uploading-list>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleUploadAddVideo" round><i class="fa fa-plus mr-2"></i>添加视频</el-button>
        <el-button type="primary" @click="handleUploadVideoClearFinish" round>清空已完成</el-button>
        <el-button @click="handleUploadVideoClose" round>确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="上传附件"
      :visible.sync="mediaFilesUploading"
      class="dialog-auto-width-50">
      <el-alert title="为了保证上传成功，请不要关闭本页面" type="warning" close-text="知道了"></el-alert>
      <el-alert title="我们不建议在您自己的服务器上存储大文件，因为这是不经济的做法。我们建议您在其他网盘服务商存储大文件，然后在您的文章中粘贴分享链接。" type="info" close-text="好的"></el-alert>
      <uploading-list v-bind:items="mediaFilesUploadingFileList"  @delete="handleUploadFilesCancel" @select-file="handleUploadFiles" ref="uploadMediaFiles" name="uploadMediaFiles"></uploading-list>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleUploadAddFiles" round><i class="fa fa-plus mr-2"></i>添加文件</el-button>
        <el-button type="primary" @click="handleUploadFilesClearFinish" round>清空已完成</el-button>
        <el-button @click="handleUploadFilesClose" round>确定</el-button>
      </span>
    </el-dialog>
    <!--快速插入图片和选择文章缩略图对话框-->
    <el-dialog
      :title="mediaImageChoosingPrewImage?'选择文章缩略图':'插入图片'"
      :visible.sync="mediaImageInserting"
      class="dialog-auto-width-70">
      <error-page v-if="mediaImageLoadStatus.indexOf('error:')==0" v-bind:error="mediaImageLoadStatus" v-bind:height="getBestEditorHeight() + 'px'"></error-page>
      <image-list v-else ref="mediaImageListFastInsert" 
        v-bind:items="mediaImageData" 
        v-bind:loaded-status="mediaImageLoadStatus"
        v-bind:multiple="!mediaImageChoosingPrewImage"
        null-text="这里还没有图片，您可以前往媒体库上传图片"
        type="select-list"></image-list>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="mediaImageInserting=false;currentTab='media-center';currentTabMedia='image'" round>前往媒体库管理文章图片</el-button>
        每页显示：<el-pagination class="btn-inline float-left" background layout="prev, pager, next" :page-count="mediaImagePageCount" :current-page="mediaImagePageCurrent" v-on:current-change="handleMediaImageListPage"></el-pagination>
        <el-select style="width:90px;margin-right:10px" v-model="mediaImagePageSize" placeholder="请选择" @change="loadMediaImages(1)" size="small">
          <el-option v-for="item in commentListSizeOpinions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button @click="mediaImageInserting=false" round>取消</el-button>
        <el-button type="primary" @click="mediaImageInserting=false;mediaImageChoosingPrewImage?handleMediaImageChoosePrewImage():handleMediaImageFasterInsertDoInsert()" round>确定</el-button>
      </span>
    </el-dialog>
    <!--重新登录对话框-->
    <fast-relogin ref="fastReLogin" />
  </el-container> 
</template>

<script>

import Chart from "chart.js";
import serverConsts from "../../constants/serverConsts.js";
import toast from "../../assets/lib/toast/toast.simply.js";
import base64 from "../../assets/lib/base64/base64.min.js";
import FishEditor from '../../components/FishEditor'
import MavonEditor from '../../components/mavon-editor/mavon-editor.vue'
import ImageList from '../../components/ImageList'
import VideoList from '../../components/VideoList'
import FastReLogin from '../../components/public/FastReLogin'
import FileList from '../../components/FileList'
import UploadingList from '../../components/UploadingList'
import ErrorPage from '../../components/ErrorPage'
import SparkMD5 from 'spark-md5'

export default {
  name: "WriteArchive",
  data() {
    return {
      currentUser: null,
      currentUserIsAdmin: false,
      currentUserCanManageClassfications: false,

      currentTab: "write",
      currentTabMedia: 'image',

      currentArchiveLoading: true,
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
      editingBasicObjectMore: false,

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
      archivePrefix: [],

      editingAutoSave: false,
      editingAutoSaveLastTime: null,
      editingAutoSaveInterval: null,

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

      mediaImageData: null,
      mediaImageLoadStatus: 'notload',
      mediaImagePageSize: 20,
      mediaImagePageCount: 0,
      mediaImagePageCurrent: 1,

      mediaVideoData: null,
      mediaVideoLoadStatus: 'notload',
      mediaVideoPageSize: 20,
      mediaVideoPageCount: 0,
      mediaVideoPageCurrent: 1,

      mediaFilesData: null,
      mediaFilesLoadStatus: 'notload',
      mediaFilesPageSize: 20,
      mediaFilesPageCount: 0,
      mediaFilesPageCurrent: 1,

      mediaImageUploading: false,
      mediaImageInserting: false,
      mediaImageChoosingPrewImage: false,
      mediaImageUploadShouldInset: false,
      mediaImageUploadAnySuccess: false,
      mediaImageUploadingFileList: [],
      mediaVideoUploading: false,
      mediaVideoUploadAnySuccess: false,
      mediaVideoUploadingFileList: [],
      mediaFilesUploading: false,
      mediaFilesUploadAnySuccess: false,
      mediaFilesUploadingFileList: [],

    };
  },
  computed: {
    isMobileView: function(){
      return document.body.clientWidth < 576;
    },
  },
  mounted() {
    this.init();
    this.editingAutoSaveInterval = setInterval(() => { this.saveDraft(true) }, 300000);//5分钟自动保存
    window.onbeforeunload=function(e){
      var e=window.event||e;
      e.returnValue=("请确认您的文章保存了以后再离开此页面哦！");
    }
  },
  destroyed: function () {
    clearInterval(this.editingAutoSaveInterval);
    window.onbeforeunload = undefined;
  },
  components: {
    'mavon-editor': MavonEditor,
    'fish-editor': FishEditor,
    'image-list': ImageList,
    'error-page': ErrorPage,
    'video-list': VideoList,
    'file-list': FileList,
    'uploading-list': UploadingList,
    'fast-relogin': FastReLogin
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
    getBestEditorHeight(){
      var h = window.innerHeight - 330
      return h;
    },
    authInfoInited(authed) {
      if (authed) {
        this.currentUser = this.$store.getters["auth/authInfo"];
        this.currentUserIsAdmin = this.currentUser.level == serverConsts.UserLevels.admin;
        this.currentUserCanManageClassfications = this.Utils.getUserHasPrivilege(this.currentUser, serverConsts.UserPrivileges.manageClassAndTags);

        //Load
        var archive = this.$route.query.archive;
        if (archive) this.loadPostObject(archive, () => { this.loadPartReset(); });
        else this.loadNewPostObject(() => { this.loadPartReset(); });
        this.loadTags();
        this.loadCategories();
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
    getArchivePreviewImage(){
      var src = this.Utils.isNullOrEmpty(this.currentArchiveObject.previewImage) ? 
        require('../../assets/images/default/images-default.png') : this.currentArchiveObject.previewImage;
      return src
    },

    //Events
    handleTabClick(tab) {
      if(this.currentTab == 'comments' && this.commentListLoadStatus == 'notload')
        this.loadComments();
      else if(this.currentTab == 'media-center')
        this.handleTabMediaCenterClick(null); 
    },
    handleTabMediaCenterClick(tab) {
      if(this.currentIsNew) return;
      if(this.currentTabMedia == 'image' && this.mediaImageLoadStatus == 'notload')
        this.loadMediaImages(1); 
      if(this.currentTabMedia == 'video' && this.mediaVideoLoadStatus == 'notload')
        this.loadMediaVideos(1); 
      if(this.currentTabMedia == 'files' && this.mediaFilesLoadStatus == 'notload')
        this.loadMediaFiles(1); 
    },
    handleInsertImage(type){
      if(type=='upload'){
        if(this.handleCanUploadImage()) return;
        this.mediaImageUploadShouldInset = true;
        this.mediaImageUploading = true;
      }else if(type=='select-in-media-center'){
        if(this.handleCanUploadImage()) return;
        this.handleMediaImageShowFasterInsert()
      }
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
      this.$confirm("删除这一条评论吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.NET.API_URL + "/post/" + this.currentArchiveObject.id + '/comments/' + comment.id).then(response => {
          if (response.data.success) {
            toast.toast("成功删除 1 条评论", "success");
            this.loadComments();
          }
          else this.$swal("删除失败", response.message, "error");
        }).catch(response => { this.$swal("删除失败", "错误信息：" + response, "error"); });
      });
    },
    handleCommentDeleteSelect(){
      if(this.commentListSelection.length==0){
        this.$swal('请选中一个条目','','info');
        return;
      }
      this.$confirm("确定删除选中的 " + this.commentListSelection.length + " 条评论吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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

    //Media click

    handleChoosePrewImage(){
      if(this.handleCanUploadImage()) return;
      this.mediaImageChoosingPrewImage = true;
      if(this.mediaImageLoadStatus == 'notload') this.loadMediaImages();
      this.mediaImageInserting = true;
    },
    handleClearPrewImage(){
      this.currentArchiveObject.previewImage = '';
    },
    handleMediaImageChoosePrewImage(){
      this.mediaImageChoosingPrewImage = false;
      var selectImage = this.$refs.mediaImageListFastInsert.getSelectedItems();
      if(selectImage){
        selectImage.checked = false;
        this.currentArchiveObject.previewImage = selectImage.resourcePath;
        toast.toast('修改文章缩略图成功','success');
      }
    },
    handleMediaImageFasterInsertDoInsert(){
      var selectImages = this.$refs.mediaImageListFastInsert.getSelectedItems();
      for (var key in selectImages){
        this.insertImage(selectImages[key]);
        selectImages[key].checked = false;
      }
    },
    handleMediaImageShowFasterInsert(){
      if(this.mediaImageLoadStatus == 'notload') this.loadMediaImages();
      this.mediaImageChoosingPrewImage = false;
      this.mediaImageInserting = true;
    },
    handleMediaImageItemClick(act, item){
      if(act=='del'){
        this.$confirm('此操作将删除该图片，已插入文章的图片将无法显示, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(this.NET.API_URL + '/media/' + item.id).then((response) => {
            if(response.data.success){
              toast.toast('删除图片成功！', 'success')
              this.loadMediaImages();
            }else{
              toast.toast('删除图片失败！' + response.data.message, 'error', 5000);
            }
          })
        }).catch(() => {});
      }else if(act=='edit'){
        this.$prompt('修改图片标题', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          item.title = value;
          this.axios.put(this.NET.API_URL + '/media/' + item.id, item).then((response) => {
            if(response.data.success){
              toast.toast('更新图片标题成功！', 'success')
            }else{
              toast.toast('更新图片标题失败！' + response.data.message, 'error', 5000);
            }
          })
        }).catch(() => {});
      }else if(act=='add'){
        this.mediaImageInserting = false;
        this.mediaImageUploadShouldInset = false;
        this.mediaImageUploading = true;
      }
    },
    handleMediaImageListPage(p){ this.loadMediaImages(1); },
    handleMediaVideoItemClick(act, item){
      if(act=='del'){
        this.$confirm('此操作将删除该视频，已插入文章的视频将无法显示, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(this.NET.API_URL + '/media/' + item.id).then((response) => {
            if(response.data.success){
              toast.toast('删除视频成功！', 'success')
              this.loadMediaVideos();
            }else{
              toast.toast('删除视频失败！' + response.data.message, 'error', 5000);
            }
          })
        }).catch(() => {});
      }else if(act=='insert') this.insertVideo(item);
      else if(act=='add') this.mediaVideoUploading = true;
    },
    handleMediaVideoListPage(p){ this.loadMediaVideos(1); },
    handleMediaFilesItemClick(act, item){
      if(act=='add'){ this.mediaFilesUploading = true; }
      else if(act=='del'){
        this.$confirm('此确定删除此附件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(this.NET.API_URL + '/media/' + item.id).then((response) => {
            if(response.data.success){
              toast.toast('删除附件成功！', 'success')
              this.loadMediaFiles();
            }else{
              toast.toast('删除附件失败！' + response.data.message, 'error', 5000);
            }
          })
        }).catch(() => {});
      }
    },
    handleMediaFilesListPage(p){ this.loadMediaFiles(1); },

    //Uploader

    //Image
    handleCanUploadImage(){ 
      if(this.currentIsNew){
        this.$alert('使用媒体库功能需要保存文章，请先保存您的文章哦（也可保存至草稿）', '媒体库暂时不可用');
        return true;
      }
      return false
    },
    handleUploadAddImage(){ this.$refs.uploadMediaImages.selectFiles(); },
    handleUploadImage(files){
      var arr = this.mediaImageUploadingFileList;
      var successCallback = this.mediaImageUploadShouldInset ? this.handleUploadImageSuccessAndInsert : this.handleUploadImageSuccess;
      if(this.mediaImageUploadShouldInset) this.mediaImageUploadShouldInset = false;
      for(var i=0;i<files.length;i++){
        var newItem = {
          file: files[i],
          media: {
            postId: this.currentArchiveObject.id,
            title: files[i].name,
            resourceType: 'image',
            hash: '',
          },
          text: files[i].name,
          status: null,
          percentage: 0,
          uploading: false,
          reading: false,
          successCallback: successCallback,
        }
        arr.push(newItem);
        //计算MD5值
        this.calcFileMd5(newItem, (hash, item) => { 
          console.log('file ' + item.text + ' : ' + hash);
          this.startUpload(item, hash);
        })
      }
    },
    handleUploadImageSuccess(item){ this.mediaImageUploadAnySuccess = true; },
    handleUploadImageSuccessAndInsert(item){
      this.mediaImageUploadAnySuccess = true;
      this.insertImage(item.media);
    },
    handleUploadImageCancel(item){
      if(item.uploading) this.abortUpload(item);
      this.mediaImageUploadingFileList.pop(item);
    },
    handleUploadImageClearFinish(){
      var arr = [], oldArr = this.mediaImageUploadingFileList;
      for (var i=0;i<oldArr.length;i++){
        if(oldArr[i].status != 'success')
          arr.push(oldArr[i]);
      }
      this.mediaImageUploadingFileList = arr;
    },
    handleUploadImageClose(){
      this.mediaImageUploading = false;
      if(this.mediaImageUploadAnySuccess){
        this.mediaImageUploadAnySuccess = false;
        this.loadMediaImages(1);
        this.$refs.uploadImageFiles.clearSelectFiles();
      }
    },
    //Video
    handleUploadAddVideo(){ this.$refs.uploadMediaVideos.selectFiles(); },
    handleUploadVideo(files){
      var arr = this.mediaVideoUploadingFileList,
        successCallback = this.handleUploadVideoSuccess;
      for(var i=0;i<files.length;i++){
        var newItem = {
          file: files[i],
          media: {
            postId: this.currentArchiveObject.id,
            title: files[i].name,
            resourceType: 'video',
            hash: '',
          },
          text: files[i].name,
          status: null,
          percentage: 0,
          uploading: false,
          reading: true,
          successCallback: successCallback,
        }
        arr.push(newItem);
        //计算MD5值
        this.calcFileMd5(newItem, (hash, item) => { 
          console.log('file ' + item.text + ' : ' + hash);
          this.startUpload(item, hash);
        })
      }
    },
    handleUploadVideoSuccess(item){
      this.mediaVideoUploadAnySuccess = true;
    },
    handleUploadVideoCancel(item){
      if(item.uploading) this.abortUpload(item);
      this.mediaVideoUploadingFileList.pop(item);
    },
    handleUploadVideoClearFinish(){
      var arr = [], oldArr = this.mediaVideoUploadingFileList;
      for (var i=0;i<oldArr.length;i++){
        if(oldArr[i].status != 'success')
          arr.push(oldArr[i]);
      }
      this.mediaVideoUploadingFileList = arr;
    },
    handleUploadVideoClose(){
      this.mediaVideoUploading = false;
      if(this.mediaVideoUploadAnySuccess){
        this.mediaVideoUploadAnySuccess = false;
        this.loadMediaVideos(1);
        this.$refs.uploadVideoFiles.clearSelectFiles();
      }
    },
    //Files
    handleUploadAddFiles(){ this.$refs.uploadMediaFiles.selectFiles(); },
    handleUploadFiles(files){
      var arr = this.mediaFilesUploadingFileList,
        successCallback = this.handleUploadFilesSuccess;
      for(var i=0;i<files.length;i++){
        var newItem = {
          file: files[i],
          media: {
            postId: this.currentArchiveObject.id,
            title: files[i].name,
            resourceType: 'file',
            hash: '',
          },
          text: files[i].name,
          status: null,
          percentage: 0,
          uploading: false,
          reading: true,
          successCallback: successCallback,
        }
        arr.push(newItem);
        //计算MD5值
        this.calcFileMd5(newItem, (hash, item) => { 
          console.log('file ' + item.text + ' : ' + hash);
          this.startUpload(item, hash);
        })
      }
    },
    handleUploadFilesSuccess(item){
      this.mediaFilesUploadAnySuccess = true;
    },
    handleUploadFilesCancel(item){
      if(item.uploading) this.abortUpload(item);
      this.mediaFilesUploadingFileList.pop(item);
    },
    handleUploadFilesClearFinish(){
      var arr = [], oldArr = this.mediaFilesUploadingFileList;
      for (var i=0;i<oldArr.length;i++){
        if(oldArr[i].status != 'success')
          arr.push(oldArr[i]);
      }
      this.mediaFilesUploadingFileList = arr;
    },
    handleUploadFilesClose(){
      this.mediaFilesUploading = false;
      if(this.mediaFilesUploadAnySuccess){
        this.mediaFilesUploadAnySuccess = false;
        this.loadMediaFiles(1);
        this.$refs.uploadMediaFiles.clearSelectFiles();
      }
    },
    //
    // 数据加载方法
    //

    //Data
    loadPostObject(idOrUrlName, callback) {
      this.currentIsNew = false;
      this.axios.get(this.NET.API_URL + "/post/" + idOrUrlName + "?authPrivate=true").then(response => {
        if(response.data.success){
          this.currentArchiveLoading = false;
          this.currentArchiveObject = response.data.data;
          this.currentArchiveType = response.data.data.type;
          this.currentArchiveObjectBackup = this.Utils.clone(this.currentArchiveObject);
          this.loadPDataStart();
          this.loadDraft();
        }else{
          this.currentArchiveLoading = false;
          this.currentArchiveObject = null;
          this.currentArchiveLoadError = response.data.message;
          this.currentArchiveErrorCanRetry = false;
        }
        callback();
      }).catch(response => {
        this.currentArchiveLoading = false;
        this.currentArchiveLoadError = response;
        this.currentArchiveErrorCanRetry = true;
        callback();
      });
    },
    loadNewPostObject(callback) {
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
        status: 2,
        tags: "",
        title: "",
        type: "markdown",
        urlName: "",
        viewCount: 0,
        showInList: true,
        showCatalog: true
      };
      this.currentArchiveType = this.currentArchiveObject.type;
      this.loadPDataStart();
      callback();
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
      this.currentArchiveTags = [];
      if(!this.Utils.isNullOrEmpty(this.currentArchiveObject.tags)){
        var arr =  this.currentArchiveObject.tags.split('-');
        for(var key in arr) {
          if(!this.Utils.isNullOrEmpty(arr[key])){
            this.currentArchiveTags.push(arr[key]);
          }
        }
      }
      if(this.currentArchiveObject.content)
        this.currentArchiveContent = base64.decode(this.currentArchiveObject.content);
      else this.currentArchiveContent = '';
      this.archivePrefix = [];
      var arr = serverConsts.PostPrefix;
      for(var key in arr) {
        this.archivePrefix.push({
          value: arr[key],
          label: serverConsts.PostPrefixName[key]
        });
      }
    },
    loadPartReset(){
      this.commentListLoadStatus = 'notload';
      this.commentListData = null;
      this.mediaImageLoadStatus = 'notload';
      this.mediaImageData = null;
      this.mediaVideoLoadStatus = 'notload';
      this.mediaVideoData = null;
      this.mediaFilesLoadStatus = 'notload';
      this.mediaFilesData = null;
      this.handleTabClick(null);
    },
    loadDraft() {      
      this.axios.get(this.NET.API_URL + "/post/" + this.currentArchiveObject.id + "/draft").then(response => {
        if(response.data.success && response.data.data.hasDraft){
          this.Utils.cloneValue(this.currentArchiveObject, response.data.data.json);
          this.loadPDataStart();
          this.editingAutoSave = true;
          this.editingAutoSaveLastTime = '已恢复 ' + response.data.data.lastUpdateTime + ' 保存的草稿';
          toast.toast('读取文章草稿成功！', 'success');
        }
      });
    },
    loadComments(){
      if(this.currentIsNew) return;
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
    loadMediaImages(page){
      if(typeof page != 'undefined')
        this.mediaImagePageCurrent = page;
      this.mediaImageLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/post/" + this.currentArchiveObject.id + '/media/' +
        (this.mediaImagePageCurrent - 1) +
        "/" +
        this.mediaImagePageSize + '?type=image';
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.mediaImageData = response.data.data.content;
            this.mediaImagePageCount = response.data.data.totalPages;
            this.mediaImageLoadStatus = "loaded";
          } else this.mediaImageLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.mediaImageLoadStatus = "error:" + response;
        });
    },
    loadMediaVideos(page){
      if(typeof page != 'undefined')
        this.mediaVideoPageCurrent = page;
      this.mediaVideoLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/post/" + this.currentArchiveObject.id + '/media/' +
        (this.mediaVideoPageCurrent - 1) +
        "/" +
        this.mediaVideoPageSize + '?type=video';
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.mediaVideoData = response.data.data.content;
            this.mediaVideoPageCount = response.data.data.totalPages;
            this.mediaVideoLoadStatus = "loaded";
          } else this.mediaVideoLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.mediaVideoLoadStatus = "error:" + response;
        });
    },
    loadMediaFiles(page){
      if(typeof page != 'undefined')
        this.mediaFilesPageCurrent = page;
      this.mediaFilesLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/post/" + this.currentArchiveObject.id + '/media/' +
        (this.mediaFilesPageCurrent - 1) +
        "/" +
        this.mediaFilesPageSize + '?type=file';
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.mediaFilesData = response.data.data.content;
            this.mediaFilesPageCount = response.data.data.totalPages;
            this.mediaFilesLoadStatus = "loaded";
          } else this.mediaFilesLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.mediaFilesLoadStatus = "error:" + response;
        });
    },

    //
    // 文件上传方法
    //

    //计算文件的MD5
    calcFileMd5(item, end){
      item.reading = true;
      var file = item.file;
      var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunkSize = 2097152,                             // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();
  
      fileReader.onload = function (e) {
          console.log('read chunk nr', currentChunk + 1, 'of', chunks);
          spark.append(e.target.result);                   // Append array buffer
          currentChunk++;
  
          if (currentChunk < chunks) {
              loadNext();
          } else end(spark.end(), item);  // Compute hash
      };
  
      fileReader.onerror = function () {};
  
      function loadNext() {
          var start = currentChunk * chunkSize,
              end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
    },
    //上传文件
    startUpload(uploadingItem, hash){
      uploadingItem.reading = false;
      uploadingItem.media.hash = hash;
      this.requestFileShouldMultiPartUpload(uploadingItem, (should, data) => {
        console.log('uploading : ' + uploadingItem.text + ' ' + (should ? '[single]' : '[multipart]'));
        should ? this.uploadMultipart(uploadingItem, data.chunkCount, 
          data.chunkSize, data.chunkLastSize, data.uploadMultiToken) : this.uploadSingle(uploadingItem)
      });
    },
    failUpload(uploadingItem, err){
      uploadingItem.exception = err;
      uploadingItem.status = 'exception';
      uploadingItem.uploading = false;
    },
    finishUpload(uploadingItem){
      console.log('upload finished : ' + uploadingItem.text);
      uploadingItem.uploading = false;
      uploadingItem.percentage = 100;
      uploadingItem.status = 'success';
      uploadingItem.successCallback(uploadingItem);
    },
    abortUpload(uploadingItem) {
       console.log('upload aborted : ' + uploadingItem.text);
      if(uploadingItem.uploading) {
        uploadingItem.uploading = false;
        if(uploadingItem.xhr){
          uploadingItem.markedCancel = false;
          uploadingItem.xhr.abort();
        }
      }
    },
    progressUpload(uploadingItem, percent){
      uploadingItem.percentage = percent;
    },
    //获取文件是否需要分片上传
    requestFileShouldMultiPartUpload(uploadingItem, callback){
      var size = uploadingItem.file.size, media = uploadingItem.media;
      this.axios.post(this.NET.API_URL + '/media/uploadSize?size=' + size, media).then((response) => {
        if(response.data.success) callback(response.data.data.multipart, response.data.data);
        else this.failUpload(uploadingItem, response.message);
      }).catch((response) => { this.failUpload(uploadingItem, response); });
    },
    //单文件上传
    uploadSingle(uploadingItem){
      uploadingItem.uploading = true;
      uploadingItem.isSingle = true;
      uploadingItem.xhr = new XMLHttpRequest();

      var form = new FormData();
      form.append('file', uploadingItem.file);
      form.append('media', JSON.stringify(uploadingItem.media));

      var xhr = uploadingItem.xhr;
      xhr.withCredentials = true;
      xhr.open("post", this.NET.API_URL + '/media', true);
      xhr.onload = () => {
        var result = xhr;
        var response = null;
        try { response = eval("(" + result.response + ")"); }
        catch (e) { this.failUpload(uploadingItem, e); }
        if(!uploadingItem.markedCancel) response.success ? (uploadingItem.media = response.data, this.finishUpload(uploadingItem)) : this.failUpload(uploadingItem, response.message);
      }
      xhr.onerror = () => { if(!uploadingItem.markedCancel) this.failUpload(uploadingItem, xhr.statusText); }; //请求失败
      xhr.upload.onprogress = (result) => {
          if (result.lengthComputable) {
              var percent = (result.loaded / result.total * 100).toFixed(2);
              this.progressUpload(uploadingItem, parseInt(percent));
          }
      };
      xhr.send(form);
    },
    //分片上传
    uploadMultipart(uploadingItem, chunkCount, chunkSize, chunkLastSize, uploadMultiToken){
      uploadingItem.isMultipart = true;
      uploadingItem.uploading = true;
      uploadingItem.uploadBlobs = new Array();
      uploadingItem.uploadBlobCurrent = 0;
      uploadingItem.uploadBlobAll = chunkCount;

      //文件切片

      var start = 0;
      var end;
      var index = 0;
      var filesize = uploadingItem.file.size;
      var blob = uploadingItem.file;
      var filename = uploadingItem.file.name;
      var media = JSON.stringify(uploadingItem.media);

      while (start < filesize) {
          end = start + chunkSize;

          var chunk = null;
          chunk = end > filesize?  blob.slice(start) : chunk = blob.slice(start, end);
         
          var formData = new FormData();

          formData.append("file", chunk);
          formData.append("media", media);
          formData.append("blob", index);
          formData.append("filename", filename);
          formData.append("token", uploadMultiToken);

          uploadingItem.uploadBlobs.push(formData);

          start = end;
          index++;
      }

      //开始上传
      this.uploadMultipartBlob(uploadingItem, uploadMultiToken);
    },
    uploadMultipartBlob(uploadingItem, uploadMultiToken){
      if(uploadingItem.uploadBlobCurrent < uploadingItem.uploadBlobAll){
        console.log('uploading : ' + uploadingItem.text + ' (' + uploadingItem.uploadBlobCurrent + '/' + uploadingItem.uploadBlobAll + ')');
        var xhr = new XMLHttpRequest();
        uploadingItem.xhr = xhr;
        xhr.withCredentials = true;
        xhr.open("post", this.NET.API_URL + '/media/blob', true);
        xhr.onload = () => {
          var result = xhr;
          var response = null;
          try { response = eval("(" + result.response + ")"); }
          catch (e) { this.failUpload(uploadingItem, e); }
          if(response.success) { 
            if(!uploadingItem.markedCancel) {
              uploadingItem.uploadBlobCurrent++;
              uploadingItem.media = response.data
              this.uploadMultipartBlob(uploadingItem, uploadMultiToken);
            }
          } else this.failUpload(uploadingItem, response.message);
        }
        xhr.onerror = () => { if(!uploadingItem.markedCancel) this.failUpload(uploadingItem, xhr.statusText); }; //请求失败
        xhr.upload.onprogress = (result) => {
            if (result.lengthComputable) {

              //整体进度
              var percent0 = 100 / uploadingItem.uploadBlobAll;
              var percent1 = parseInt(result.loaded / result.total * percent0);
              var percent = parseInt(uploadingItem.uploadBlobCurrent * percent0 + percent1);

              this.progressUpload(uploadingItem, percent);
            }
        };
        xhr.send(uploadingItem.uploadBlobs[uploadingItem.uploadBlobCurrent]);
      }else
        this.finishUpload(uploadingItem);
    },

    //
    // 文章写方法
    //

    insertImage(imageItem){
      if(!imageItem) return;
      if(this.currentArchiveType == 'markdown'){
        this.$refs.editorMarkdown.insertText(this.$refs.editorMarkdown.getTextareaDom(), 
        {
          prefix: '![' + imageItem.title + '](' + imageItem.resourcePath + ')',
          subfix: '',
          str: ''
        })
      }else if(this.currentArchiveType == 'html')
        this.$refs.editorHtml.insertOrReplace('<img src="' + imageItem.resourcePath + '" alt="' + imageItem.title + '"/>','',false,true);
    },
    insertVideo(videoItem){
      if(!videoItem) return;
      if(this.currentArchiveType == 'markdown'){
        this.$refs.editorMarkdown.insertText(this.$refs.editorMarkdown.getTextareaDom(), 
        {
          prefix: '<video src="' + imageItem.resourcePath + '" controls>',
          subfix: '</video>',
          str: ''
        })
      }else if(this.currentArchiveType == 'html')
        this.$refs.editorHtml.insertOrReplace('<video src="' + imageItem.resourcePath + '" controls>','</video>',false,true);
    },

    //
    // 文章操作方法
    //

    //参数验证
    saveValidate(targetStatus, noalert){
      if(this.Utils.isNullOrEmpty(this.currentArchiveObject.title)) {
        if(!noalert) this.$alert('您正在提交没有标题的文章, 必须输入文章的标题才能保存文章哦', '提交失败', { confirmButtonText: '我知道了' });
        return true;
      }
      if(((targetStatus == -1 && this.currentArchiveObject.status == serverConsts.ArchiveStatus.PUBLISH) || targetStatus == serverConsts.ArchiveStatus.PUBLISH) && this.Utils.isNullOrEmpty(this.currentArchiveContent)) {
        if(!noalert) this.$alert('您正在发布一篇空的文章, 必须写一些文章内容才能发布文章哦', '发布失败', { confirmButtonText: '我知道了' });
        return true;
      }
    },
    //文章提交操作
    //保存
    savePreAct(targetStatus){
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
      }
    },
    saveSubmit(targetStatus, successCallback){

      //先验证参数
      if(this.saveValidate(targetStatus)){
        successCallback(false);
        return;
      }
      this.savePreAct(targetStatus);  
        //提交
        if (this.currentIsNew) {
          this.axios.post(this.NET.API_URL + "/post", this.currentArchiveObject).then(response => {
            if (response.data.success) {
              //重新刷新返回的数据
              this.editingAutoSave = false;
              this.currentArchiveObject = response.data.data;
              this.currentArchiveObjectBackup = this.Utils.clone(this.currentArchiveObject);
              this.currentIsNew = false;
              successCallback();
              this.$swal("文章保存成功！", '', "success");
            } else {
              if(!successCallback(false, response.data.code == 401))
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
              this.editingAutoSave = false;
              if(!successCallback(false, response.data.code == 401))
                this.$swal("抱歉！提交文章失败了", response.data.message, "error");
            }
          }).catch(response => {
            successCallback(false);
            this.$swal("提交文章失败了", "错误信息：" + response + '。 请检查您的网络？', "error"); 
          });
        }
    },
    saveDraft(auto) {
      //先验证参数
      if(this.saveValidate(-1, auto)){
        this.editingAutoSave = true;
        this.editingAutoSaveLastTime = (auto ? '自动' : '') + '保存草稿失败，空文章不能保存草稿';
        return;
      }
      this.savePreAct(-1);
      if(this.getArchiveCanUnChange()){
        this.axios.put(this.NET.API_URL + "/post/" + this.currentArchiveObject.id + "/draft", this.currentArchiveObject).then(response => {
          if(response.data.success){
            this.editingAutoSave = true;
            this.editingAutoSaveLastTime = '已保存至草稿 ' + new Date().format("HH:ii:ss");
            toast.toast('文章已保存至草稿 ' + this.editingAutoSaveLastTime, 'success');
          }else if(response.data.code == 401){
             this.$refs.fastReLogin.doFastLogin(this.saveDraft);
          }
        });
      }
    },

    //放弃修改
    cancelChange() {
      this.$confirm('真的要放弃修改吗? 注意，您的未保存修改将会丢失，并恢复您编辑文章之前的状态！', '提示', {
        confirmButtonText: '确定放弃',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Utils.cloneValue(this.currentArchiveObject, this.currentArchiveObjectBackup);
        this.this.loadPDataStart();
        toast.toast('已将文章恢复为修改前状态', 'success')
      }).catch(() => {});;
    },
    //保存修改
    saveChange(st) {
      this.$confirm('您真的要现在保存修改吗? ', '提示', {
        confirmButtonText: '确定保存',
        cancelButtonText: '再改改',
        type: 'warning'
      }).then(() => {
        var targetStatus = -1;
        var t = toast.toast('正在提交文章', 'loading', -1);
        if (st=='draft') targetStatus = serverConsts.ArchiveStatus.DRAFT;
        else if(st=='private') targetStatus = serverConsts.ArchiveStatus.PRIVATE;
        else if(st=='publish') targetStatus = serverConsts.ArchiveStatus.PUBLISH;
        this.saveSubmit(targetStatus, (success, isAuthExpired) => {
          toast.toastClose(t);
          if(isAuthExpired){
            this.$refs.fastReLogin.doFastLogin(() => { this.saveChange(st) });
            return true
          }
          if(success) this.$swal('文章修改提交成功！', '', 'success')
        });
      }).catch(() => {});;
    },
    //发布
    publish() {

      this.$confirm('您真的要现在发布文章吗? ', '提示', {
        confirmButtonText: '确定保存',
        cancelButtonText: '再改改',
        type: 'warning'
      }).then(() => {
        var t = toast.toast('正在提交文章', 'loading', -1);
        this.saveSubmit(serverConsts.ArchiveStatus.PUBLISH, (success, isAuthExpired) => {
          toast.toastClose(t);
          if(isAuthExpired){
            this.$refs.fastReLogin.doFastLogin(this.publish);
            return true
          }
          if(success) swal('文章发布成功！', '', 'success')
        });                  
      }).catch((e) => {
        console.log(e);
      });
    },
    //撤回
    unPublish() {
      this.$confirm('真的要撤回文章吗? 撤回后您的文章只有您自己能看到（它将被保存在草稿箱中）', '提示', {
        confirmButtonText: '确定保存',
        cancelButtonText: '再改改',
        type: 'warning'
      }).then(() => {
        var t = toast.toast('正在撤回文章', 'loading', -1);
        this.saveSubmit(serverConsts.ArchiveStatus.DRAFT, (success, isAuthExpired) => {
          toast.toastClose(t);
          if(isAuthExpired){
            this.$refs.fastReLogin.doFastLogin(this.unPublish);
            return true
          }
          if(success) toast.toast('成功将文章撤回到草稿箱', 'success');
        })  
      }).catch(() => {});
    },

  }
};
</script>

<style>
.blog-editor-container{
  overflow: hidden;
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
