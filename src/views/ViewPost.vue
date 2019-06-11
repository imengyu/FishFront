<!--这一块超级乱，以后再重构，原谅我代码水平不行-->

<template>
  <div id="main">
    <article class="sm-padding bg-grey-no-border post-top">
      <div class="container">
        <!-- Post Title -->
        <div v-if="postObjectLoadStatus=='loaded' && postObject" class="row justify-content-end">
          <div class="col-lg-8 col-md-10">
            <h2 style="font-weight: bold;" class="no-anchor">{{ postObject.title }}</h2>
            <p class="blog-meta">
              <span v-if="postObject.postPrefix" v-html="getBlogPrefix()" class="mr-2"></span>
              {{ postObject.postDate }}
              <i class="fa fa-eye ml-3 mr-2"></i>
              {{ postObject.viewCount + 1 }} 浏览
              <i class="fa fa-user ml-3 mr-2"></i>
              {{ postObject.author }}
              <span
                v-if="postObject.postClass && postObject.postClass!=''"
                class="ml-3 mr-2"
              >
                <i class="fa fa-tag"></i>
                {{ postObject.postClass.split(':')[0] }}
              </span>
            </p>
          </div>
          <div class="col-lg-3 ml-3"></div>
        </div>
        <!-- Post Main Content -->
        <div
          v-if="postObjectLoadStatus=='loaded' && postObject"
          class="row justify-content-end mt-3"
        >
          <!-- Post Content -->
          <div class="col-lg-8 col-md-10 post-container">
            <div
              v-if="postHtmlContent"
              v-html="postHtmlContent"
              class="blog-content-result post-container"
              id="post_content"
            ></div>
            <div>
              <p
                v-if="postObject.lastmodifyDate"
                class="text-secondary mt-3 mb-2"
                style="font-size: 12px;"
              >本文最后在 {{ postObject.lastmodifyDate }} 进行了编辑</p>
              <div v-if="postObject.postTagNames" class="tags mt-3">
                <a
                  v-for="(tag,index) in postObject.postTagNames"
                  :key="index"
                  :class="(postObject.headimg ? 'black ' : 'light ') + 'tag'"
                  v-on:click="goViewTag(tag.id)"
                  href="#"
                  target="_blank"
                >{{ tag.name }}</a>
              </div>
              <div class="like" @click="updateLikeCount()">
                <div :class="'btn like-group' + (authedUserLiked ? ' active' : '')">
                  <div class="btn-like">
                    <a>喜欢</a>
                  </div>
                  <div class="modal-wrap">
                    <a>{{ postObject.likeCount }}</a>
                  </div>
                </div>
                <div class="share-group">
                  <a
                    href="javascript:;"
                    tabindex="0"
                    data-toggle="popover"
                    data-placement="top"
                    data-html="true"
                    data-trigger="focus"
                    data-original-title
                    class="share-circle more-share"
                  >分享</a>
                </div>
              </div>
            </div>
          </div>
          <!-- Post catalog -->
          <div class="col-lg-3 col-sm-12 ml-3 sidebar-container catalog-container">
            <div
              id="side_catalog_on_toggle"
              v-on:click="switchCatalog"
              class="side-catalog-switch"
            >目录</div>
            <div
              id="side_catalog"
              :class="'side-catalog' + (catalogFixed ? ' side-catalog-fixed' : '')"
            >
              <p id="catalog-title">
                <a
                  id="side_catalog_close_toggle"
                  href="javascript:void(0)"
                  class="side-catalog-close"
                >
                  <i class="fa fa-times"></i>
                </a>
                <a class="catalog-toggle-title" v-on:click="switchCatalog" href="javascript:;">目录</a>
              </p>
              <ul id="catalog_content" class="catalog-body"></ul>
            </div>
          </div>
        </div>
        <!-- Post Up down Navigator -->
        <div
          v-if="postObjectLoadStatus=='loaded' && postObject"
          id="post_content_end"
          class="row justify-content-end mt-3"
        >
          <div class="col-lg-4 col-md-5">
            <div
              :class="'flat-btn flat-btn-black btn-block post-page-nav left' + (postHasPrvPost ? '':' disabled')"
            >
              <a :href="getPrevPostUrl()" @click="backTop()">
                <i class="fa fa-arrow-left"></i>上一篇文章
                <p id="post-page-nav-prv">{{ postPrvPostTitle }}</p>
              </a>
            </div>
          </div>
          <div class="col-lg-4 col-md-5">
            <div
              :class="'flat-btn flat-btn-black btn-block post-page-nav right' + (postHasNextPost ? '':' disabled')"
            >
              <a :href="getNextPostUrl()" @click="backTop()">
                下一篇文章
                <i class="fa fa-arrow-right"></i>
                <p id="post-page-nav-next">{{ postNextPostTitle }}</p>
              </a>
            </div>
          </div>
          <div class="col-lg-3 ml-3"></div>
        </div>
        <!-- Post Loading mask -->
        <div v-if="postObjectLoadStatus=='loading'" class="row justify-content-center">
          <div class="simple-loading-center text-center loading-host">
            <span class="simple-loading"></span>
            <p>加载中，很快就好了</p>
          </div>
        </div>
        <div v-if="postObjectLoadStatus=='error'" class="row justify-content-center">
          <div class="text-center" style="margin-top: 50px; margin-bottom: 30px;">
            <img
              src="../assets/images/img_500.png"
              class="img-responsive"
              style="max-width: 300px;"
            >
            <br>
            <br>
            <span class="text-danger">加载错误</span>
            <br>
            {{ blogDataListLoadError }}
          </div>
        </div>
      </div>
    </article>
    <!--Comments-->
    <article v-if="postCanComment" id="comment" class="sm-padding bg-grey-no-border">
      <div class="container">
        <div class="row justify-content-end">
          <div class="col-lg-8 col-md-10 col-sm-12">
            <commenter
              ref="postComment"
              v-if="postObjectLoadStatus == 'loaded' && postObject"
              v-bind:authed-user-info="authedUserInfo"
              v-bind:current-post-id="postObject.id"
              v-bind:current-post-id-or-name="postIdOrUrlName"
            ></commenter>
          </div>
          <div class="col-lg-3 ml-3"></div>
        </div>
      </div>
    </article>
    <article v-else-if="postObjectLoadStatus == 'loaded'" id="comment" class="sm-padding bg-grey-no-border">
      <div class="container">
        <div class="row justify-content-end">
          <div class="col-lg-8 col-md-10 col-sm-12">
            <div
              class="alert alert-light text-center"
              style="background-color:#f8f9fa;font-size:18px;"
              role="alert"
            >
              评论功能已经关闭
              <br>
              <small>如果您有非常重要的信息需要评论，请联系管理员</small>
            </div>
          </div>
          <div class="col-lg-3 ml-3"></div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import jQuery from "jquery";

var $ = jQuery;

import serverConsts from "../constants/serverConsts.js";
import base64 from "../assets/lib/base64/base64.min.js";
import anchors from "../assets/lib/anchorjs/anchor.min.js";
import toast from "../assets/lib/toast/toast.simply.js";
import "../assets/lib/onePageNav/jquery.nav.js";
import "../assets/lib/highlightjs/css/vs2015.css";
import "../assets/lib/highlightjs/js/highlight.pack.js";
import "../assets/lib/BigPicture/BigPicture.min.js";

import Commenter from "../components/Commenter";

    //这一块大部分代码取旧的项目1.1版本
    //因为vue非常特殊，修改代码为vue的模式非常困难，我不想改了，就当这是祖传代码1世吧
    //原谅我懒，但是这里真的不想重构了（好像祖传代码运行还挺稳定）
    //这里有非常多的DOM操作，还有jquery，违背了vue的设计思想，大家不要学
    //我以后有精力了再重构这一块

export default {
  name: "ViewPost",
  data() {
    return {
      postIdOrUrlName: 0,
      postObject: null,
      postObjectLoadStatus: "notload",
      postOrginalContent: null,
      postHtmlContent: null,
      postPrvPostTitle: "没有了",
      postNextPostTitle: "没有了",
      postHasPrvPost: !1,
      postHasNextPost: !1,
      postCanComment: false,
      catalogFixed: false,
      catalogTop: 0,
      authed: false,
      authedUserLiked: false,
      authedUserInfo: null,
    };
  },
  components: {
    'commenter' : Commenter,
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to, from) {
      this.rePage();
    }
  },
  methods: {
    init: function() {
      this.$store.dispatch("global/resetHeader");
      if (this.$route.params.post)
        this.postIdOrUrlName = this.$route.params.post;
      this.loadPostObject();
      this.backTop();
    },
    initMenuBreadcrumb() {
      if (this.postObject) {
        this.$store.dispatch("global/setPageShowBreadcrumb", true);
        this.$store.dispatch("global/setPageBreadcrumb", [
          {
            title: "首页",
            link: this.getJumpRealUrl("/")
          },
          {
            title: "文章",
            link: this.getJumpRealUrl("/archives/")
          },
          {
            title: this.postObject.title,
            active: true
          }
        ]);
      }
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    rePage() {
      if (this.$route.params.post)
        this.postIdOrUrlName = this.$route.params.post;
      this.loadPostObject();
    },
    backTop() {
      $("html, body").animate({ scrollTop: 0 }, 300);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getNextPostUrl: function() {
      return 0 != this.postObject.postNextId
        ? this.getJumpRealUrl(
            serverConsts.PartPositions.viewPost +
              this.postObject.postNextId +
              "/"
          )
        : "javascript:void(0)";
    },
    getPrevPostUrl: function() {
      return 0 != this.postObject.postPrvId
        ? this.getJumpRealUrl(
            serverConsts.PartPositions.viewPost +
              this.postObject.postPrvId +
              "/"
          )
        : "javascript:void(0)";
    },
    getBlogPrefix() {
      return this.Utils.getPostPrefix(this.postObject.postPrefix);
    },
    goViewTag(tagId) {
      var newUrl = this.Utils.getJumpRealUrl(
        serverConsts.PartPositions.viewTag + tagId + "/"
      );
      window.open(newUrl);
    },
    updateViewCount: function() {
      var main = this;
      setTimeout(function() {
        if (document.referrer != document.location.toString())
          $.get(
            main.NET.API_URL + "/post/updateViewCount?id=" + main.postObject.id
          );
      }, 1500);
    },
    updateLikeCount: function() {
      if (this.authed) {
        var main = this;
        $.ajax({
          url:
            main.NET.API_URL +
            "/post/updateLikeCount?id=" +
            main.postObject.id +
            (main.authedUserLiked ? "&like=false" : "&like=true"),
          crossDomain: true,
          xhrFields: { withCredentials: true },
          success: function(response) {
            if (response.success) {
              main.authedUserLiked = !main.authedUserLiked;
              if (
                main.postObject &&
                typeof main.postObject.likeCount != "undefined"
              )
                main.postObject.likeCount += main.authedUserLiked ? 1 : -1;
            } else if (response.code == 489)
              toast.toast(response.message, "info", 5000);
          }
        });
      } else this.showFastLogin();
    },
    reloadPostStats: function() {
      var main = this;
      $.ajax({
        url: main.NET.API_URL + "/posts/stat/" + main.postObject.id,
        type: "get",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) {
            main.postObject.viewCount = response.data.viewCount;
            main.postObject.commentCount = response.data.commentCount;
            main.postObject.likeCount = response.data.likeCount;
            if (response.data.currentUserLiked) main.authedUserLiked = true;
          }
        },
        error: function(xhr, err) {}
      });
    },
    share: function(type) {},
    showFastLogin: function() {
      this.$refs.postComment.showFastLogin();
    },
    authInfoInited() {
      this.authed = this.$store.getters["auth/authed"];
      this.authedUserInfo = this.$store.getters["auth/authInfo"];
      console.log('authInfoInited');
    },
    loadPostObject() {
      var main = this;
      main.postObjectLoadStatus = "loading";
      jQuery.ajax({
        type: "get",
        url: main.NET.API_URL + "/post/" + main.postIdOrUrlName + "/",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) {
            main.postObject = response.data;
            main.postObjectLoadStatus = "loaded";
            main.postCanComment = main.postObject.enableComment;
            main.initMenuBreadcrumb();
            main.loadPostContent();
            main.loadPostComment();
            main.reloadPostStats();
            main.updateViewCount();
            setTimeout(main.loadPostCatalog, 1300);
            setTimeout(main.resolvePost, 1500);
          } else {
            main.blogDataListLoadError = response.message;
            main.postObjectLoadStatus = "error";
          }
        },
        error(xhr, err, e) {
          main.blogDataListLoadError = err;
          main.postObjectLoadStatus = "error";
        }
      });
    },
    loadPostContent() {
      var a = null;
      //生成HTML
      if (this.postObject.type == "html")
        a = base64.decode(this.postObject.content);
      else if (this.postObject.type == "markdown") {
        var showdown = require("showdown"),
          a = base64.decode(this.postObject.content);
        var b = new showdown.Converter();
        a = b.makeHtml(a);
      } else if (this.postObject.type == "txt") a = this.postObject.content;
      this.postHtmlContent = a;
      //设置上一篇下一篇
      if (this.postObject.postPrvTitle) {
        this.postPrvPostTitle = this.postObject.postPrvTitle;
        this.postHasPrvPost = true;
      } else {
        this.postHasPrvPost = false;
        this.postPrvPostTitle = "没有了";
      }
      if (this.postObject.postNextTitle) {
        this.postNextPostTitle = this.postObject.postNextTitle;
        this.postHasNextPost = true;
      } else {
        this.postHasNextPost = false;
        this.postNextPostTitle = "没有了";
      }
      //标题
      document.title = this.postObject.title + " - " + serverConsts.SiteTitle;
    },
    loadPostCatalog() {
      this.catalogTop = jQuery("#side_catalog").offset().top;
      //Create catalog
      var P = $("#post_content"),
        a,
        n,
        t,
        l,
        i,
        c,
        id;
      a = P.find("h1,h2,h3,h4,h5,h6");
      var $catalog_body = $("#catalog_content");
      var $catalog_scroller = $("#side_catalog");

      a.each(function() {
        n = $(this)
          .prop("tagName")
          .toLowerCase();
        $(this).attr(
          "id",
          $(this)
            .text()
            .replace(
              /(!|\"|#|\$|%|&|\'|\(|\)|\*|\+|\?|\^|\{|\}|,|\.|\/|:|;|<|=|>|@|\[|\]|\(|\)|`|\\|~| ){1}/g,
              "-"
            )
        );
        i = "#" + $(this).prop("id");
        t = $(this).text();
        c = $('<a href="' + i + '" rel="nofollow">' + t + "</a>");
        l = $('<li class="' + n + '_nav"></li>').append(c);
        $catalog_body.append(l);
      });
      // toggle side catalog
      $(".catalog-toggle").click(function(e) {
        e.preventDefault();
        $(".side-catalog").toggleClass("fold");
      });
      // onePageNav
      $catalog_body.onePageNav({
        currentClass: "active",
        changeHash: !1,
        easing: "swing",
        filter: "",
        scrollSpeed: 700,
        scrollOffset: -115,
        scrollThreshold: 0.2,
        begin: null,
        end: null,
        scrollChange: function($parent) {}
      });
      // Bulid anchors
      anchors
        .add()
        .remove(".blog-content h1")
        .remove(".no-anchor")
        .remove(".sidebar-container h5");

      var width = $(window).width();
      var catalog_floated = false,
        catalog_bottom_pined = false;
      var $post_content_end = $("#post_content_end");
      var $side_catalog = $("#side_catalog");
      var old_catalog_top = $side_catalog.offset().top - 65;

      catalogScroll();
      //Catalog scroll
      function catalogScroll() {
        if (width >= 992) {
          if ($(document).scrollTop() >= old_catalog_top && !catalog_floated) {
            $side_catalog.addClass("side-catalog-fixed");
            catalog_floated = true;
          } else if (
            $(document).scrollTop() <= old_catalog_top &&
            catalog_floated
          ) {
            $side_catalog.removeClass("side-catalog-fixed");
            catalog_floated = false;
          } else if (
            $(document).scrollTop() >
              $post_content_end.offset().top - $side_catalog.height() - 60 &&
            !catalog_bottom_pined
          ) {
            $side_catalog
              .removeClass("side-catalog-fixed")
              .attr("style", "position: absolute; top: auto; bottom: 0px;");
            catalog_bottom_pined = true;
            catalog_floated = true;
          } else if (
            $(document).scrollTop() <=
              $post_content_end.offset().top - $side_catalog.height() - 60 &&
            catalog_bottom_pined
          ) {
            $side_catalog.attr("style", "");
            catalog_bottom_pined = false;
            catalog_floated = false;
          }
        } else {
          $side_catalog.addClass("side-catalog-fixed");
          if (
            $(document).scrollTop() > $post_content_end.offset().top - 200 &&
            !catalog_bottom_pined
          ) {
            $("#side_catalog_on_toggle").fadeOut();
            if ($("body").hasClass("side-catalog-mobile-active")) {
              $("body").removeClass("side-catalog-mobile-active");
              $("#side_catalog").removeClass("side-catalog-slidein");
            }
            catalog_bottom_pined = true;
          } else if (
            $(document).scrollTop() <= $post_content_end.offset().top - 200 &&
            catalog_bottom_pined
          ) {
            catalog_bottom_pined = false;
            $("#side_catalog_on_toggle").fadeIn();
          }
        }
      }

      $(document).scroll(function(e) {
        catalogScroll();
      });
      $(window).resize(function() {
        width = $(window).width();
      });
      $(document).click(function(e) {
        var container = $(
          "#side_catalog, #side_catalog_close_toggle, #side_catalog_on_toggle"
        );
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          if ($("body").hasClass("side-catalog-mobile-active")) {
            $("body").removeClass("side-catalog-mobile-active");
            $("#side_catalog").removeClass("side-catalog-slidein");
          }
        }
      });
    },
    loadPostComment: function () {
      var main = this;
      if (this.postObject.enableComment){
        setTimeout(function () {
          //加载第一次的评论
          var postHeight = $('#comment').offset().top;
          var commentFirstLoaded = false;
          $(document).scroll(function (e) {
            if(main.postObjectLoadStatus == 'loaded' && main.postObject){
              if ($(document).scrollTop() >= (postHeight - 300) && !commentFirstLoaded) {
                if(typeof main.$refs.postComment != 'undefined')
                  main.$refs.postComment.loadPostComment();
                else 
                  main.$$children[0].loadPostComment();
                commentFirstLoaded = true;
              }
            }
          });
        }, 500);
      }
    },
    switchCatalog: function() {
      $("#side_catalog").toggleClass("side-catalog-slidein");
      $("body").toggleClass("side-catalog-mobile-active");
    },
    resolvePost() {
      var main = this;
      //前期代码处理
      //高亮代码
      $("#post_content pre code").each(function(i, block) {
        $(this).html(main.replaceBlockBadChr($(this).html()));
        $(this)
          .parent()
          .before(
            $(
              '<div class="bd-clipboard"><button class="btn-clipboard" title data-original-title="复制到剪贴板">复制</button></div>'
            )
          );
        hljs.highlightBlock(block);
      });
      //剪贴板提示
      $(".btn-clipboard").tooltip();
      //加载图片
      $("#post_content img").each(function(i, block) {
        var dsrc = $(this).attr("data-src");
        if (!main.Utils.isNullOrEmpty(dsrc))
          $(this).attr(
            "src",
            main.Utils.getImageUrlFormHashWithType(
              dsrc,
              $(this).attr("data-image-type")
            )
          );
        //图片加载失败处理
        if (
          !this.complete ||
          (typeof this.naturalWidth != "undefined" && this.naturalWidth == 0)
        ) {
          $(this)
            .bind("error.replaceSrc", function() {
              $(this).attr("src", require("../assets/images/img_failed.png"));
              $(this).attr("style", "width: 250px");
              $(this).unbind("error.replaceSrc");
            })
            .trigger("load");
        }
        if (
          this.complete &&
          (typeof this.naturalWidth != "undefined" && this.naturalWidth == 0)
        ) {
          $(this).attr("src", require("../assets/images/img_failed.png"));
          $(this).attr("style", "width: 250px");
        }
      });
      //大图支持
      $("#post_content img").click(function() {
        BigPicture({
          el: $(this).get(0),
          imgSrc: $(this).attr("src")
        });
      });
      //tooltip & popover
      //------- Enable tooltips everywhere --------//
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="popover"]').popover();
    },

    //Highlightjs
    highlightChildCode($id) {
      $("#" + $id + " pre code").each(function(i, block) {
        $(this).html(replaceBlockBadChr($(this).html()));
        hljs.highlightBlock(block);
      });
    },
    replaceBlockBadChr(str) {
      return str.replace(/^\s+|\s+$/g, "");
    }
  }
};
</script>

<style scoped>
.post-top {
  padding-top: 76px;
}
.loading-host {
  min-height: 300px;
  width: 100%;
}
.loading-host p {
  margin-top: 10px;
}
</style>