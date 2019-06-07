<template>
  <article class="sm-padding bg-grey-no-border">
    <div class="container">
      <div v-if="postObjectLoadStatus=='loaded' && postObject" class="row justify-content-end">
        <div class="col-lg-8 col-md-10 post-container">
          <div
            v-if="postHtmlContent"
            v-html="postHtmlContent"
            class="blog-content-result post-container"
          ></div>
          <div>
            <p
              v-if="postObject.lastmodifyDate"
              class="text-secondary mt-3 mb-2"
              style="font-size: 13px;"
            >本文最后在 {{ postObject.lastmodifyDate }} 进行了编辑</p>
            <div class="like">
              <div class="btn like-group">
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

        <div class="col-lg-3 col-sm-12 sidebar-container catalog-container ml-3">
          <div id="side_catalog_on_toggle" class="side-catalog-switch">目录</div>
          <div id="side_catalog" class="side-catalog">
            <p id="catalog-title">
              <a
                id="side_catalog_close_toggle"
                href="javascript:void(0)"
                class="side-catalog-close"
              >
                <i class="fa fa-times"></i>
              </a>
              <a class="catalog-toggle-title">目录</a>
            </p>
            <ul id="catalog_content" class="catalog-body">
              <li class="h2_nav">
                <a href="#Hello-Markdown！" rel="nofollow">Hello Markdown！</a>
              </li>
            </ul>
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
            :class="'flat-btn flat-btn-black btn-block post-page-nav left' + (hasPrvPost ? '':' disabled')"
          >
            <a :href="getPrevPostUrl()">
              <i class="fa fa-arrow-left"></i>上一篇文章
              <p id="post-page-nav-prv">{{ prvPostTitle }}</p>
            </a>
          </div>
        </div>
        <div class="col-lg-4 col-md-5">
          <div
            :class="'flat-btn flat-btn-black btn-block post-page-nav right' + (hasNextPost ? '':' disabled')"
          >
            <a :href="getNextPostUrl()">
              下一篇文章
              <i class="fa fa-arrow-right"></i>
              <p id="post-page-nav-next">{{ nextPostTitle }}</p>
            </a>
          </div>
        </div>
        <div class="col-lg-3 ml-3"></div>
      </div>

      <div v-if="postObjectLoadStatus=='loading'" class="row justify-content-center">
        <div class="simple-loading-center text-center loading-host">
          <span class="simple-loading"></span>
          <p>加载中</p>
        </div>
      </div>
      <div v-if="postObjectLoadStatus=='error'" class="row justify-content-center">
        <div class="text-center" style="margin-top: 50px; margin-bottom: 30px;">
          <img src="../assets/images/img_500.png" class="img-responsive" style="max-width: 300px;">
          <br>
          <br>
          <span class="text-danger">加载错误</span>
          <br>
          {{ blogDataListLoadError }}
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import jQuery from "jquery";
import serverConsts from '../constants/serverConsts.js'

export default {
  name: "ViewPost",
  data() {
    return {
      postIdOrUrlName: 0,
      postObject: null,
      postObjectLoadStatus: "notload",
      postOrginalContent: null,
      postHtmlContent: null,
      prvPostTitle: "没有了",
      nextPostTitle: "没有了",
      hasPrvPost: !1,
      hasNextPost: !1,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.$store.dispatch("global/resetHeader");
      if (this.$route.params.post)
        this.postIdOrUrlName = this.$route.params.post;
      this.loadPostObject();
    },
    initMenuBreadcrumb() {
      if (this.postObject) {
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
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getNextPostUrl: function() {
      return 0 != this.postObject.postNextId ? getJumpRealUrl(serverConsts.PartPositions.viewPost + this.postObject.postNextId + "/") : "javascript:void(0)"
    },
    getPrevPostUrl: function() {
      return 0 != this.postObject.postPrvId ? getJumpRealUrl(serverConsts.PartPositions.viewPost + this.postObject.postPrvId + "/") : "javascript:void(0)"
    },


    authInfoInited() {},

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
            main.initMenuBreadcrumb();
            main.loadPostContent();
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
    loadPostContent() {}
  }
};
</script>

<style scoped>
.loading-host {
  min-height: 300px;
  width: 100%;
}
.loading-host p {
  margin-top: 10px;
}
</style>