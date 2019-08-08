<template>
  <article id="main" class="sm-padding bg-grey">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-12 col-lg-3">
          <side-area ref="side-area"></side-area>
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
              v-else-if="blogDataListLoadStatus=='loaded'"
              class="text-center text-secondary no-more"
            >到底啦，去别处看看吧</div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import jQuery from "jquery";
import BlogItem from "../components/BlogItem";
import SideArea from "../components/SideArea";
import BlogTimeListItem from "../components/BlogTimeListItem";

export default {
  name: "Month",
  metaInfo: {
    title: '梦欤的文章',
    meta: [
      {
        name: 'keyWords',
        content: '梦欤的博客,梦欤的小站,梦欤,梦想小鱼的小家,梦想小鱼的随手记录册,YuZeCheng,俞则成'
      },
      {
        name: 'description',
        content: '梦欤的个人小站-文章归档，随手记录时间归档'
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
      blogDataListPageCurrent: 0
    };
  },
  components: {
    "blog-item": BlogItem,
    "side-area": SideArea,
    'blog-time-list-item' : BlogTimeListItem
  },
  mounted() {
    this.init();
  },
  watch:{
    $route(to,from){
      this.rePage();
    }
  },
  methods: {
    init: function() {
      this.$store.dispatch('global/resetHeader');
      this.$store.dispatch('global/setPageShowBreadcrumb', true);

      if(this.$route.params.year && this.$route.params.month){
        this.$store.dispatch('global/setPageBreadcrumb', [
          {
            title: '首页',
            link: this.getJumpRealUrl('/')
          },
          {
            title: '归档',
            link: this.getJumpRealUrl('/archives/month/'),
          },
          {
            title: this.$route.params.year + ' 年' + this.$route.params.month + ' 月的文章',
            link: this.getJumpRealUrl('/archives/month/' + this.$route.params.year + '/' + this.$route.params.month + '/'),
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
            title: '归档',
            link: this.getJumpRealUrl('/archives/month/'),
            active: true
          },
        ]);
      }
      this.loadArchivePage();
    },
    rePage(){
      if(this.$route.params.year && this.$route.params.month){
        var ref = '#date-' + this.$route.params.year + '-' + this.$route.params.month;
        setTimeout(function(){
          jQuery("html,body").animate({scrollTop: jQuery(ref).offset().top - "120" + "px"}, 500);
        }, 1000);
      }
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
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
    authInfoInited() {},

    resolvePostArr: function(arr) {
      var new_arr = {};
      var i = 0,
        y = "";
      for (var key in arr) {
        if (arr[key].isHead) continue;
        if (typeof arr[key].postDate != "undefined") {
          var this_y = arr[key].postDate.substr(0, 7);
          if (this_y != y) {
            y = this_y;
            new_arr[i] = {
              isHead: true,
              year: this_y
            };
            i++;
          }
        }
        new_arr[i] = arr[key];
        i++;
      }
      return new_arr;
    },
    loadArchivePage() {
      var main = this;
      if (this.blogDataListLoadStatus == "loading") return;
      this.blogDataListLoadStatus = "loading";
      jQuery.ajax({
        type: "get",
        url:
          main.NET.API_URL +
          "/posts/page/" +
          main.blogDataListPageCurrent +
          "/20?sortBy=date&noTopMost=true",
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
            main.blogDataList = main.resolvePostArr(main.blogDataList);
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
#main{
  padding-top: 30px;
}
@media (max-width: 576px) {
  #main{
    padding-top: 25px;
  }
}
</style>
