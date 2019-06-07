<template>
  <article id="main" class="sm-padding bg-grey">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-12 blog-list-col">
          <div class="tags mt-4 pt-2 pb-2" v-if="blogTagList">
              <a v-for="(tag, index) in blogTagList" :key="index" class="tag-color tag-big"
                v-on:click="switchTag(tag.id)" href="javascript:void(0);"
                  :id="'tag_'+tag.id"
                  :style="'background-color:#'+(tag.id==blogTagCurrent?'343a40!important;font-size:18px;line-height:35px;':(tag.color+';'))">{{ tag.name }}</a>
            </div>
          <div class="blog-date-list pt-2 pb-2">
            

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
  name: "Tags",
  data() {
    return {
      blogDataList: null,
      blogDataListLoadStatus: "",
      blogDataListLoadError: null,
      blogDataListPageSize: 15,
      blogDataListPageCount: 0,
      blogDataListPageCurrent: 0,
      blogTagCurrent: '',
      blogTagList: null,
    };
  },
  mounted() {
    this.init();
  },
  watch:{
    $route(to,from){
      this.rePage();
    },
    blogTagCurrent(to,from){
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
      if(this.$route.params.tag){
        this.blogTagCurrent = this.$route.params.tag;
      }
    },
    initMenuBreadcrumb(){
      if(this.$route.params.tag)
        this.blogTagCurrent = this.$route.params.tag;
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
            title: '标签',
            link: this.getJumpRealUrl('/archives/tags/'),
            active: true
          },
        ]);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getBlogImageRealUrl(hashorurl) {
      return this.Utils.getImageUrlFormHash(hashorurl);
    },
    getBlogLinkRealUrl(item) {
      return this.Utils.getPostRealUrl(item);
    },
    getBlogPrefix(item) {
      return this.Utils.getPostPrefix(item.postPrefix);
    },
    authInfoInited() {
      
    },
    switchTag(id){
      var newUrl = this.Utils.getJumpRealUrl(serverConsts.PartPositions.viewTag + id + "/");
      location.href = newUrl;
    },
    loadArchiveCategories(){
      var main = this;
      jQuery.get(
        main.NET.API_URL + "/tags",
        function(response) {
          if (response.success) {
            main.blogTagList = response.data;
          }
        },
        "json"
      );
    },
    loadArchivePage() {
      var main = this;
      if (this.blogDataListLoadStatus == "loading" || this.Utils.isNullOrEmpty(this.blogTagCurrent)) return;
      this.blogDataListLoadStatus = "loading";
      //https://www.imyzc.com/api/v1/posts/page/0/10?sortBy=date&noTopMost=true&byClass=linux
      jQuery.ajax({
        type: "get",
        url:
          main.NET.API_URL +
          "/posts/page/" +
          main.blogDataListPageCurrent +
          "/10?sortBy=date&noTopMost=true&onlyTag=" +
          main.blogTagCurrent,
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
