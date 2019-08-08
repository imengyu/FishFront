<template>
  <article id="main" class="sm-padding bg-grey">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-12 col-lg-3">
          <!-- Category List -->
          <div class="flat-tags mt-4 pt-2 pb-2" v-if="blogCategoryList">
            <a v-for="(category, index) in blogCategoryList" :key="index" 
              v-on:click="switchCategory(category.urlName ? category.urlName : category.id)" 
              href="javascript:void(0);" 
              :class="'flat-tag-color ' + ((blogCategoryCurrent == category.urlName || blogCategoryCurrent == blogCategoryCurrent.id) ? 'bg-primary' : 'bg-secondary') + ' btn-block text-center'" 
              :style="(index==0?'margin-top: 25px;':'') + (category.previewImage ? 'background-image:url(' + category.previewImage + ')' : '')"
              :title="category.previewText">
                <h5 style="font-size: 16px; font-weight: bold;margin-bottom: 0">{{ category.title }} </h5>
                {{ category.previewText }}
                <div class="flat-tag-mask"></div>
              </a>
          </div>
        </div>
        <div class="col-12 col-sm-12 col-lg-9 blog-list-col">
          <div class="blog-date-list mt-4 pt-2 pb-2">
            <ul v-if="blogDataList">
              <blog-time-list-item v-for="(item, index) in blogDataList" :key="index" v-bind:blog-data="item"></blog-time-list-item>
            </ul>
            <div
              v-if="blogDataListLoadStatus=='loading'"
              class="simple-loading-center text-center loading-host"
            >
              <span class="simple-loading"></span>
              <p>加载中</p>
            </div>
            <div v-if="blogDataListLoadStatus=='error'" class="text-center text-danger">
              <div class="text-center"><span class="text-danger">加载错误</span><br/>{{ blogDataListLoadError }}</div>
            </div>
            <div
              v-if="blogDataListPageCurrent &lt; blogDataListPageCount"
              class="text-center more-button"
            >
              <a
                class="flat-btn flat-pill"
                v-on:click="loadArchivePage()"
                href="javascript:void(0)"
              >加载更多文章</a>
            </div>
            <div
              v-else-if="blogDataListLoadStatus=='loaded' && blogDataList"
              class="text-center text-secondary no-more"
            >到底啦，去别处看看吧</div>
                        <div
              v-else-if="blogDataListLoadStatus=='loaded'"
              class="text-center text-secondary no-more"
            >这里没有文章哦，去别处看看吧</div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import jQuery from "jquery";
import serverConsts from '../constants/serverConsts.js'
import BlogTimeListItem from "../components/BlogTimeListItem";

export default {
  name: "Classes",
  metaInfo: {
    title: '梦欤的文章',
    meta: [
      {
        name: 'keyWords',
        content: '梦欤的博客,梦欤的小站,梦欤,梦想小鱼的小家,梦想小鱼的随手记录册,YuZeCheng,俞则成'
      },
      {
        name: 'description',
        content: '梦欤的个人小站-文章分类，文章分类归档'
      },
    ],
  },
  data() {
    return {
      blogDataList: null,
      blogDataListLoadStatus: "",
      blogDataListLoadError: null,
      blogDataListPageSize: 15,
      blogDataListPageCount: 0,
      blogDataListPageCurrent: 0,
      blogCategoryCurrent: '',
      blogCategoryList: null,
    };
  },
  mounted() {
    this.init();
  },
  watch:{
    $route(to,from){
      this.rePage();
    },
    blogCategoryCurrent(to,from){
      this.blogDataList = null;
      this.blogDataListPageCurrent = 0;
      this.loadArchivePage();
      this.initMenuBreadcrumb();
    }
  },
  components: {
    'blog-time-list-item' : BlogTimeListItem
  },
  methods: {
    init: function() {
      this.$store.dispatch('global/resetHeader');
      this.$store.dispatch('global/setPageShowBreadcrumb', true);

      this.initMenuBreadcrumb();
      this.loadArchivePage();
      this.loadArchiveCategories();
    },
    rePage(){
      if(this.$route.params.category){
        this.blogCategoryCurrent = this.$route.params.category;
      }
    },
    initMenuBreadcrumb(){
      if(this.$route.params.category){
        this.blogCategoryCurrent = this.$route.params.category;
        this.$store.dispatch('global/setPageBreadcrumb', [
          {
            title: '首页',
            link: this.getJumpRealUrl('/')
          },
          {
            title: '文章',
            link: this.getJumpRealUrl('/archives/')
          },
          {
            title: '分类',
            link: this.getJumpRealUrl('/archives/'),
          },
          {
            title: this.$route.params.category,
            link: this.getJumpRealUrl('/archives/category/' + this.$route.params.category + '/'),
            active: true
          },
        ]);
      } else {
        this.$store.dispatch('global/setPageBreadcrumb', [
          {
            title: '首页',
            link: this.getJumpRealUrl('/')
          },
          {
            title: '文章',
            link: this.getJumpRealUrl('/archives/')
          },
          {
            title: '分类',
            link: '',
            active: true
          },
        ]);
      }
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getBlogLinkRealUrl(item) {
      return this.Utils.getPostRealUrl(item);
    },
    getBlogPrefix(item) {
      return this.Utils.getPostPrefix(item.postPrefix);
    },
    authInfoInited() {
      
    },
    switchCategory(urlName){
      var newUrl = this.Utils.getJumpRealUrl(serverConsts.PartPositions.viewClass + urlName + "/");
      location.href = newUrl;
    },
    loadArchiveCategories(){
      this.axios.get(this.NET.API_URL + "/classes").then((response) => {
        if (response.data.success)
          this.blogCategoryList = response.data.data;
      });
    },
    loadArchivePage() {
      var main = this;
      if (this.blogDataListLoadStatus == "loading" || this.Utils.isNullOrEmpty(this.blogCategoryCurrent)) return;
      this.blogDataListLoadStatus = "loading";
      //https://www.imyzc.com/api/v1/posts/page/0/10?sortBy=date&noTopMost=true&byClass=linux
      jQuery.ajax({
        type: "get",
        url:
          main.NET.API_URL +
          "/posts/page/" +
          main.blogDataListPageCurrent +
          "/10?sortBy=date&noTopMost=true&byClass=" +
          main.blogCategoryCurrent,
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) {
            main.blogDataListPageCount = response.data.totalPages;
            if (main.blogDataList == null)
              main.blogDataList = response.data.content;
            else
              main.blogDataList = main.Utils.mergeJsonArray(
                main.blogDataList,
                response.data.content
              );
            main.blogDataListPageCurrent++;
            main.blogDataListLoadStatus = "loaded";
          } else {
            main.blogDataListLoadError = response.message;
            main.blogDataListLoadStatus = "error";
          }
        },
        error(xhr, err, e) {
          main.blogDataListLoadError = err;
          main.blogDataListLoadStatus = "error";
        }
      });
    }
  }
};
</script>

<style scoped>
.more-button {
  padding: 20px 0;
}
.no-more {
  padding: 30px 0;
}
.loading-host {
  min-height: 300px;
  width: 100%;
}
.loading-host p {
  margin-top: 10px;
}
</style>
