<template>
    <div>
        <div id="comment_area">
            <h3 class="no-anchor btn-inline" id="comment-start">说点什么吧</h3>
            <div class="dropdown btn-inline float-right mb-2">
                <div v-if="authed" style="margin-right:20px;display:inline-block;">{{ 'Hi，' + authedUserName }}</div>
                <img id="comment-user-head" class="rounded-circle" src data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false" style="display:none;width:54px;height:54px;">
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="javascript:void(0)" v-on:click="aboutMe">关于我</a>
                    <a class="dropdown-item" href="javascript:void(0)" v-on:click="quitLogin">退出登录</a>
                </div>
            </div>
            <!--<button type="button" class="flat flat-icon-btn float-right" data-toggle="tooltip" data-placement="left" title="使用 Github 登录" v-on:click="loginGithub" id="comment-login-github"><i class="fa fa-github" style="font-size:28px"></i></button>-->
            <button type="button" class="btn flat flat-icon-btn float-right" data-toggle="tooltip" data-placement="left"
                title="登录" v-on:click="showFastLogin" id="comment-login">
                <i class="fa fa-sign-in" style="font-size:28px"></i>
            </button>
            <form ethod="post" id="comment_form" class="mt-3">
                <div class="row" v-if="AnonymousCanComment && !authed">
                    <div class="col-md-6">
                        <div class="form-group">
                            <input class="flat" type="text" name="comment_name" id="comment_name" placeholder="您的名字"
                                required="required" />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <input class="flat" type="email" name="comment_email" id="comment_email"
                                placeholder="您的 Email 地址" required="required" />
                        </div>
                    </div>
                </div>
                <div class="form-group" id="comment-more-group" style="display:none">
                    <div class="form-group">
                        <input class="flat" type="text" name="comment_website" id="comment_website"
                            placeholder="您的个人网站或博客地址 (可选)" />
                    </div>
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="comment_saveid" checked="checked" />
                        <label class="custom-control-label" for="comment_saveid">保存我的个人信息以便下次继续评论</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="comment_replyformail" />
                        <label class="custom-control-label" for="comment_replyformail">当有回复时发送邮件提醒我</label>
                    </div>
                </div>
                <div class="form-group">
                    <div id="comment-reply-for-outer" style="display: none;">
                        <div style="background-color:#f8f9fa;"
                            class="alert text-center d-flex justify-content-between align-items-center">
                            <span id="comment-reply-for">您正在回复</span>
                            <button type="button" class="flat-round flat-btn" id="comment-cancel-reply"
                                data-toggle="tooltip" title="取消回复 Ta" v-on:click="cancelReply">
                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <textarea v-if="isEditing" v-model="currentEditComment" class="flat" name="comment_content"
                        id="comment_content" rows="4" placeholder="说点什么吧"></textarea>
                    <div v-else-if="currentPreviewItem">
                        <div class="comment" :id="'comment-'+currentPreviewItem.id"
                            :data-name="currentPreviewItem.authorName" :data-parent="currentPreviewItem.parentComment"
                            style="width:100%">
                            <div class="comment-one">
                                <div class="comment-head">
                                    <img class="rounded-circle"
                                        :src="currentPreviewItem.authorHead?currentPreviewItem.authorHead:require('../assets/images/default/head-default.png')"
                                        :alt="currentPreviewItem.authorName">
                                    <br>
                                    <a v-if="currentPreviewItem.authorId>0" :href="getJumpRealUrl('/user/' + currentPreviewItem.authorId + '/')" target="_blank">{{ currentPreviewItem.authorName }}</a>
                                    <a v-else>{{ currentPreviewItem.authorName }}</a>
                                </div>
                                <div class="comment-body">
                                    <div class="comment-content">
                                        <a v-if="currentPreviewItem.parentComment"
                                            :href="'#comment-' + currentPreviewItem.parentComment">@{{ currentPreviewItem.parentCommentAuthorName }}:</a>
                                        <div v-html="genCommentContent(currentPreviewItem.commentContent)"></div>
                                    </div>
                                    <time class="comment-timeago"
                                        :datetime="currentPreviewItem.postDate">{{ calcDatePast(currentPreviewItem.postDate) }}</time>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="comment-faces-group" style="display:none;height:36px">
                    <ul class="icon-list faces">
                        <li v-for="(face, index) in faces" :key="index" v-on:click="faceClick(face)">{{ face }}</li>
                        <li class="note float-right">
                            <span class="text-secondary ml-2 mt-1" data-toggle="tooltip" data-html="true"
                                title="&lt;b&gt;评论中支持使用 Emoji 表情&lt;/b&gt;&lt;br /&gt;你可以在你的评论中输入其他的 Emoji 表情">
                                <i class="fa fa-info-circle"></i>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="form-group clearfix"></div>
                <div class="form-row justify-content-between">
                    <div class="col-md-6 col-sm-12 mb-2">
                        <button type="button" class="flat-round flat-btn" title="更多选项" data-toggle="tooltip"
                            data-placement="right" v-on:click="moreClick" id="comment-more">
                            <i class="fa fa-angle-down"></i>
                        </button>
                        <span class="text-secondary ml-2 mt-1" data-toggle="tooltip" data-html="true"
                            title="&lt;b&gt;我们支持在评论中使用 Markdown 语法&lt;/b&gt;&lt;br /&gt;你可以为你的评论添加漂亮的格式">
                            <i class="fa fa-info-circle"></i> 评论支持 Markdown 语法
                        </span>
                    </div>
                    <div class="col-md-6 col-sm-12 mb-2 text-right">
                        <button type="button" class="flat-round flat-btn mr-1" v-on:click="facesClick"
                            id="comment-faces" data-toggle="tooltip" title="添加表情">
                            <i class="fa fa-smile-o" style="font-size: 20px"></i>
                        </button>
                        &nbsp;
                        <button type="button" class="flat-btn flat-btn-black"
                            v-on:click="previewItem">{{ isEditing ? '预览' : '编辑' }}</button>
                        &nbsp;
                        <button v-if="AnonymousCanComment || authed" type="button" class="flat-btn flat-btn-black"
                            v-on:click="submitComment">
                            <i class="fa fa-send"></i> 提交评论
                        </button><button v-else type="button" class="flat-btn flat-btn-black btn-disable"
                            v-on:click="submitComment" disable>登录后才可以评论哦</button>
                    </div>
                </div>
            </form>
        </div>
        <div id="comment_host">
            <div v-if="loaded">
                <div v-for="(comment,index) in commentContent" :key="index" class="comment" :id="'comment-'+comment.id"
                    :data-name="comment.authorName" :data-parent="comment.parentComment">
                    <div class="comment-one">
                        <div class="comment-head">
                            <span v-if="comment.authorLevel && comment.authorLevel==1"
                                class="comment-user-tag admin">博主</span>
                            <span v-else-if="comment.authorLevel && comment.authorLevel==2"
                                class="comment-user-tag user">作者</span>
                            <img class="rounded-circle"
                                :src="comment.authorHead?comment.authorHead:require('../assets/images/default/head-default.png')"
                                :alt="comment.authorName">
                            <br>
                            <a v-if="comment.authorId>0" :href="getJumpRealUrl('/user/' + comment.authorId + '/')" target="_blank">{{ comment.authorName }}</a>
                            <a v-else>{{ comment.authorName }}</a>
                        </div>
                        <div class="comment-body">
                            <div class="comment-content">
                                <a v-if="comment.parentComment"
                                    :href="'#comment-' + comment.parentComment">@{{ comment.parentCommentAuthorName }}:</a>
                                <div v-html="genCommentContent(comment.commentContent)"></div>
                            </div>
                            <time class="comment-timeago"
                                :datetime="comment.postDate">{{ calcDatePast(comment.postDate) }}</time>
                            <a v-if="comment.authorId == authedUserId" class="comment-del" href="javascript:void(0)"
                                v-on:click="deleteComment(comment.id)">
                                <span class="fa fa-trash"></span> 删除
                            </a>
                            <a class="comment-reply" href="javascript:void(0)" v-on:click="gotoReply(comment.id)">
                                <span class="fa fa-reply"></span> 回复 Ta
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!loading && currentCommentPage &lt; allCommentPage" class="text-center">
                <a v-on:click="loadPostComment" class="flat-btn flat-pill" href="javascript:void(0)">加载更多评论</a>
            </div>
            <div v-else-if="!loading && !loadFailed && allCommentPage > 0" class="text-center text-secondary mt-4 mb-4">没有更多评论了</div>
            <div v-else-if="!loading && !loadFailed" class="text-center text-secondary mt-4 mb-4">还没有评论哦，来做第一个评论的人吧</div>
            <div v-if="loading" id="comment-loading" class="text-center">
                <span class="simple-loading"></span>
                <p class="text-secondary mt-2">正在加载评论</p>
            </div>
            <div v-if="loadFailed" class="text-secondary text-center p-4">
                <i class="fa fa-exclamation-triangle"></i>
                <br>加载评论失败
                <br>
                {{ laodErr }} {{ currentPostId }}
            </div>
        </div>
    </div>
</template>

<script>
import jQuery from "jquery";
var $ = jQuery;
import serverConsts from '../constants/serverConsts.js'
import base64 from "../assets/lib/base64/base64.min.js";

export default {
  props: [ 'currentPostId', 'currentPostIdOrName','authedUserInfo' ],
  name: "Commenter",
  data() {
    return {
      count: 0,
      faces: [
        "😂",
        "😘",
        "😍",
        "😎",
        "😊",
        "😁",
        "😭",
        "😜",
        "😝",
        "😄",
        "😡",
        "😀",
        "😥",
        "😋",
        "👍",
        "👌",
        "❤",
        "😱",
        "🐷"
      ],
      loading: true,
      loaded: false,
      loadFailed: false,
      laodErr: "",
      commentContent: null,
      currReplyItem: 0,

      isEditing: true,
      currentPreviewItem: null,
      currentEditComment: "",
      loginGithubContentTipShowed: false,

      allCommentPage: 0,
      currentCommentPage: 0,

      firstLoad: true,
      userInfoLoaded: false,
      firstLoadBlocked: false,

      authed: false,
      authedUserId: -1,
      authedUserName: "",
      userInfos: null,
      requestingUserInfo: {},
      requestingUserInfoCount: 0
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    authedUserInfo(val) {
        this.loadLastUserInfo();
    },
  },
  computed: {
    AnonymousCanComment: function(){
      return serverSettings.AnonymousComment
    },
  },
  methods: {
    init: function() {
      if(this.authedUserInfo){
        this.loadLastUserInfo();
      }
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    moreClick() {
      $("#comment-more-group").slideToggle();
      $("#comment-more i").toggleClass("revrse-180");
      $("#comment-more").tooltip("hide");
    },
    facesClick() {
      $("#comment-faces-group").slideToggle();
      $("#comment-faces").tooltip("hide");
    },
    faceClick(face) {
      if (this.Utils.isNullOrEmpty(this.currentEditComment))
        this.currentEditComment = face;
      else
        this.currentEditComment = insert(
          this.currentEditComment,
          this.Utils.getInputCursorPosition("#comment_content"),
          face
        );
    },
    loadLastUserInfo() {
      var last_cm_name = window.localStorage.getItem("last_cm_name");
      if (last_cm_name != null && last_cm_name != "")
        $("#comment_name").val(last_cm_name);
      var last_cm_mail = window.localStorage.getItem("last_cm_mail");
      if (last_cm_mail != null && last_cm_mail != "")
        $("#comment_email").val(last_cm_mail);
      var last_cm_website = window.localStorage.getItem("last_cm_website");
      if (last_cm_website != null && last_cm_website != "")
        $("#comment_website").val(last_cm_website);
      var last_cm_mail_notify = window.localStorage.getItem(
        "last_cm_mail_notify"
      );
      if (last_cm_mail_notify != null && last_cm_mail_notify == "true")
        $("#comment_replyformail").prop("checked", "checked");
      this.authInfoLoaded();
    },
    authInfoLoaded(){
        var main = this;
        if (main.authedUserInfo) {
          main.authed = true;
          main.authedUserId = main.authedUserInfo.id;
          if (!this.Utils.isNullOrEmpty(main.authedUserInfo.friendlyName))
            main.authedUserName = main.authedUserInfo.friendlyName;
          else main.authedUserName = main.authedUserInfo.name;
          $("#comment-login").hide();
          $("#comment_name")
            .attr("readonly", "readonly")
            .attr("placeholder", "");
          $("#comment_email")
            .attr("readonly", "readonly")
            .attr("placeholder", "");
          $("#comment_name").val(main.authedUserInfo.friendlyName);
          $("#comment_email").val(main.authedUserInfo.email);
          $("#comment_name_static").text(main.authedUserInfo.friendlyName);
          $("#comment_email_static").text(main.authedUserInfo.email);
          $("#comment_website").val(main.authedUserInfo.home);
          $("#comment-user-head").show();
          $("#comment-user-head").attr("src", main.authedUserInfo.headimg);
        }
    },
    loadPostComment() {
      var main = this;

      main.loaded = false;
      main.loading = true;

      if (this.firstLoad) {
        this.firstLoad = false;
        this.userInfos = {};
        //------- Enable tooltips everywhere --------//
        $('[data-toggle="tooltip"]').tooltip();
      }

      var url =
        this.NET.API_URL +
        "/post/" +
        this.currentPostId +
        "/comments/" +
        this.currentCommentPage +
        "/15";

      //Load comments
      $.ajax({
        url: url,
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) {
            main.allCommentPage = response.data.totalPages;
            if (main.commentContent == null)
              main.commentContent = response.data.content;
            else
              main.commentContent = mergeJsonArray(
                main.commentContent,
                response.data.content
              );
            main.commentContent = main.reallocCommentArray(main.commentContent);
            main.currentCommentPage++;
            main.loaded = true;
          } else {
            main.laodErr = response.message;
            main.loadFailed = true;
          }
          main.loading = false;
        },
        error: function(xhr, err) {
          main.loading = false;
          main.laodErr = err;
          main.loadFailed = true;
          main.loaded = true;
        }
      });
    },
    genCommentContent(data_content) {
      if (!this.Utils.isNullOrEmpty(data_content)) {
        var a = this.Utils.isBase64(data_content)
          ? base64.decode(data_content)
          : data_content;
        var showdown  = require('showdown');
        var b = new showdown.Converter();
        return b.makeHtml(a);
        
      }
      return "";
    },
    calcDatePast(date) {
      //计算过去的时间
      //date 时间 字符串 2000-01-09 12:00:00 格式
      date = date.substring(0, 19);
      date = date.replace(/-/g, "/");
      var o = new Date(date).getTime();
      var n = new Date().getTime();
      var f = n - o;
      var bs = f >= 0 ? "前" : "后"; //判断时间点是在当前时间的 之前 还是 之后
      f = Math.abs(f);
      if (f < 6e4) {
        return "刚刚";
      } //小于60秒,刚刚
      if (f < 36e5) {
        return parseInt(f / 6e4) + "分钟" + bs;
      } //小于1小时,按分钟
      if (f < 864e5) {
        return parseInt(f / 36e5) + "小时" + bs;
      } //小于1天按小时
      if (f < 2592e6) {
        return parseInt(f / 864e5) + "天" + bs;
      } //小于1个月(30天),按天数
      if (f < 31536e6) {
        return parseInt(f / 2592e6) + "个月" + bs;
      } //小于1年(365天),按月数
      return parseInt(f / 31536e6) + "年" + bs; //大于365天,按年算
    },
    reallocCommentArray(data) {
      for (var key in data) {
        if (data[key].parentComment != 0) {
          data[key].parentCommentAuthorName = this.findCommentAuthorName(
            data,
            data[key].parentComment
          );
        }
        if (data[key].authorId != 0) {
          var user = this.findUser(data[key].authorId);
          if (user) {
            data[key].authorHead = user.headimg;
            data[key].authorLevel = user.level;
          }
        }
      }
      return data;
    },
    findCommentAuthorName(data, id) {
      for (var key in data) {
        if (data[key].id == id) {
          return data[key].authorName;
        }
      }
      return "";
    },
    gotoReply(id) {
      $item = $("#comment-" + id);
      if ($item.length > 0) {
        this.currReplyItem = id;
        $("#comment-reply-for-outer").show();
        $("#comment-reply-for").html(
          '回复 <a href="#comment-' +
            id +
            '">@' +
            $item.attr("data-name") +
            "</a> (#" +
            id +
            ") :"
        );
        scrollToPos($("#comment-reply-for").offset().top - 90);
      }
    },
    showTip(str) {
      $("#comment-tip-text").html(str);
      $("#comment-tip-dlg").modal();
    },
    cancelReply() {
      this.currReplyItem = null;
      $("#comment-reply-for-outer").fadeOut();
    },
    previewItem() {
      if (this.isEditing) {
        if (!this.Utils.isNullOrEmpty(this.currentEditComment)) {
          this.isEditing = false;
          var data = {
            id: 999999,
            authorId: this.authed ? this.authedUserId : 0,
            authorName: $("#comment_name").val(),
            authorMail: $("#comment_mail").val(),
            authorWebsite: $("#comment_website").val(),
            authorHead: this.authed ? this.authedUserInfo.headimg : null,
            postId: this.currentPostId,
            parentComment: this.currReplyItem,
            postDate: new Date().format("yyyy-MM-dd HH:mm:ss"),
            commentContent: base64.encode(this.currentEditComment),
            parentCommentAuthorName: this.currReplyItem
              ? this.findCommentAuthorName(this.commentContent, this.currentPostId)
              : ""
          };
          this.currentPreviewItem = data;
        } else this.$swal("评论预览", "请输入您的评论再预览哦", "info");
      } else {
        this.isEditing = true;
      }
    },
    submitComment() {
      var name = $("#comment_name").val();
      var mail = $("#comment_email").val();
      var website = $("#comment_website").val();
      var id = this.currentPostId;
      var user_id = 0;
      if (this.authed && this.authedUserInfo) {
        user_id = this.authedUserInfo.id;
        if (this.authedUserInfo.friendlyName)
          name = this.authedUserInfo.friendlyName;
        if (this.authedUserInfo.name) name = this.authedUserInfo.name;
        if (this.authedUserInfo.email) mail = this.authedUserInfo.email;
        if (this.authedUserInfo.home) website = this.authedUserInfo.home;
      } else if (!serverSettings.AnonymousComment) {
        this.showFastLogin();
        return;
      }
      var content = this.currentEditComment;

      if (this.authed == false && this.Utils.isNullOrEmpty(name)) {
        this.$swal("请完善信息", "请填写您的名字（或是昵称），然后才能评论", "info");
        return;
      }
      if (this.authed == false && this.Utils.isNullOrEmpty(mail)) {
        this.$swal("请完善信息", "请填写您的邮箱，然后才能评论", "info");
        return;
      }
      if (this.Utils.isNullOrEmpty(content)) {
        this.$swal("请填写您的评论哦！", "", "info");
        return;
      }
      if (this.authed == false && $("#comment_saveid").is(":checked")) {
        window.localStorage.setItem("last_cm_name", name);
        window.localStorage.setItem("last_cm_mail", mail);
        window.localStorage.setItem("last_cm_website", website);
        window.localStorage.setItem(
          "last_cm_mail_notify",
          $("#comment_replyformail").is(":checked") ? "1" : "0"
        );
      }
      this.cancelReply();
      var data = {
        authorId: user_id,
        authorName: name,
        authorMail: mail,
        authorWebsite: website,
        postId: id,
        parentComment: this.currReplyItem,
        postDate: new Date().format("yyyy-MM-dd HH:mm:ss"),
        commentContent: base64.encode(content)
      };
      this.axios.post(this.NET.API_URL + "/post/" + id + "/comments", data).then((response) => {
         if (response.data.success) {
            $("#comment_content").val("");
            this.mergeNewItem(response.data.data);
            this.currentEditComment = "";
            this.currentPreviewItem = null;
            this.$swal(
              "发表成功!",
              "您的评论已经发表，感谢您对我们的支持！",
              "success"
            );
          } else this.$swal("抱歉！发表失败了!", "提交时发生了错误 " + response.data.message, "error");
      }).catch((response) => {
        this.$swal("抱歉！发表失败了!", "提交时发生了错误 " + response, "error");
      })
    },
    mergeNewItem(newdata) {
      var newa = {},
        i = 0;
      for (var key in this.commentContent) {
        newa[i + 1] = this.commentContent[key];
        i++;
      }
      newa[0] = newdata;
      this.commentContent = this.reallocCommentArray(newa);
    },
    deleteOldItem(id) {
      var newa = {},
        i = 0;
      for (var key in this.commentContent) {
        if (this.commentContent[key].id != id) {
          newa[i] = this.commentContent[key];
          i++;
        }
      }
      this.commentContent = newa;
    },
    reloadCommentItemUserInfo(user) {
      if (user) {
        var newa = this.commentContent;
        for (var key in newa) {
          if (newa[key].authorId == user.id) {
            newa[key].authorHead = user.headimg;
            newa[key].authorLevel = user.level;
          }
        }
        this.commentContent = newa;
        if (this.requestingUserInfoCount == 0) {
          this.loaded = false;
          this.loaded = true;
        }
      }
    },
    findUser(id) {
      var main = this;
      if (typeof main.userInfos[id] != "undefined") return main.userInfos[id];
      //Load user info
      if (typeof main.requestingUserInfo[id] == "undefined") {
        main.requestingUserInfo[id] = true;
        main.requestingUserInfoCount++;
        $.ajax({
          url: this.NET.API_URL + "/user/" + id,
          crossDomain: true,
          xhrFields: { withCredentials: true },
          success: function(response) {
            main.requestingUserInfo[id] = undefined;
            main.requestingUserInfoCount--;
            if (response.success) {
              main.userInfos[id] = response.data;
              main.reloadCommentItemUserInfo(response.data);
            }
          },
          error: function(xhr, err) {
            main.requestingUserInfoCount--;
            main.requestingUserInfo[id] = undefined;
          }
        });
      }
      return null;
    },
    showFastLogin() {
      this.jump("/sign-in/?redirect_url=" + encodeURIComponent(location.href));
    },
    quitLogin() {
      /*
      this.$swal({
        title: "退出登录",
        type: "info",
        html: '<div class="text-center"><span class="simple-loading"></span><p class="text-secondary mt-2">正在退出登录，请稍后</p></div>', // HTML
        focusConfirm: true, //聚焦到确定按钮
        showCloseButton: true //右上角关闭
      });
      */
      this.jump("/sign-out/?redirect_url=" + encodeURIComponent(location.href));
    },
    aboutMe() {
      this.jump("/user/" + this.authedUserId + "/");
    },
    deleteComment(id) {
      this.$swal({
        type: "warning", // 弹框类型
        title: "删除评论", //标题
        text: "您确定要删除这条评论吗?", //显示内容

        confirmButtonColor: "#d33", // 确定按钮的 颜色
        confirmButtonText: "确定", // 确定按钮的 文字
        showCancelButton: true, // 是否显示取消按钮
        cancelButtonColor: "#3085d6", // 取消按钮的 颜色
        cancelButtonText: "取消", // 取消按钮的 文字

        focusCancel: true, // 是否聚焦 取消按钮
        reverseButtons: true // 是否 反转 两个按钮的位置 默认是  左边 确定  右边 取消
      }).then(isConfirm => {
        if (isConfirm.value) {
          this.axios.delete(this.NET.API_URL + "/post/" + this.currentPostId + "/comments/" + id).then((response) => {
            this.$swal("删除成功！", "您的评论已经删除", "success");
            this.deleteOldItem(id);
          }).catch((response) => {
            this.$swal("抱歉！删除失败了!", "提交时发生了错误 " + response, "error");
          });
        }
      });
    },
  }
};
</script>