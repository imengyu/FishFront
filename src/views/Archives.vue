<template>
  <article id="main" class="sm-padding bg-grey">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <slider v-if="blogDataListSlider" :sliderinit="sliderinit">
            <!-- slot  -->
            <!-- slideritem wrapped package with the components you need -->
            <slideritem v-for="(item,index) in blogDataListSlider" :key="index" class="flat-blog-slider-item">
              <a class="flat-blog-slider-inner" :href="getBlogLinkRealUrl(item)"
              :style="(item.previewImage ? ('background-image: url(' + getBlogImageRealUrl(item.previewImage) +  ');') : '')">
               
                <h2>{{ item.title }}</h2>
                <p>{{ item.previewText }}</p>
                 <div class="flat-blog-slider-mask"></div>
              </a>
            </slideritem>
            <!-- Customizable loading -->
            <div slot="loading">
              <span class="simple-loading"></span>
              <p>加载中</p>
            </div>
          </slider>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12 col-sm-12 col-lg-3">
          <side-area ref="side-area"></side-area>
        </div>
        <div class="col-12 col-sm-12 col-lg-9 blog-list-col">
          <div class="blog-list blog-side-content no-shadow mt-4 pt-2 pb-2">
            <ul v-if="blogDataList">
              <blog-item v-for="(item, index) in blogDataList" :key="index" v-bind:blog-data="item"></blog-item>
            </ul>
            <div v-if="blogDataListLoadStatus=='loading'" class="simple-loading-center text-center loading-host">
              <span class="simple-loading"></span>
              <p>加载中</p>
            </div>
            <div v-if="blogDataListLoadStatus=='error'" class="text-center text-danger">
              <div class="text-center">{{ blogDataListLoadError }}</div>
            </div>
            <div v-if="blogDataListPageCurrent &lt; blogDataListPageCount" class="text-center more-button">
              <a
                class="flat-btn flat-pill"
                v-on:click="loadArchivePage()"
                href="javascript:void(0)"
              >加载更多文章</a>
            </div>
            <div
              v-else-if="blogDataListLoadStatus=='loaded'"
              class="text-center text-secondary no-more"
            >没有更多文章了</div>
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
import { slider, slideritem } from 'vue-concise-slider'

export default {
  name: "Archives",
  data() {
    return {
      blogDataList: null,
      blogDataListLoadStatus: "",
      blogDataListLoadError: null,
      blogDataListPageSize: 15,
      blogDataListPageCount: 0,
      blogDataListPageCurrent: 0,
      blogDataListSlider: null,
      //滑动配置[obj]
      sliderinit: {
        currentPage: 0,//当前页码
        thresholdDistance: 500,//滑动判定距离
        thresholdTime: 100,//滑动判定时间
        autoplay: 1000,//自动滚动[ms]
        loop:true,//循环滚动
        direction: 'vertical',//方向设置，垂直滚动
        infinite: 1,//无限滚动前后遍历数
        slidesToScroll: 1,//每次滑动项数
      }
    };
  },
  components: {
    "blog-item": BlogItem,
    "side-area": SideArea,
    slider,
    slideritem,
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.$store.dispatch('global/resetHeader');
      this.loadArchivePage();
      this.loadArchiveTop();
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getBlogImageRealUrl(hashorurl){
      return this.Utils.getImageUrlFormHash(hashorurl);
    },
    getBlogLinkRealUrl(item){
      return this.Utils.getPostRealUrl(item);
    },
    authInfoInited() {},

    loadArchiveTop(){
      var main = this;
      jQuery.ajax({
        type: "get",
        url: main.NET.API_URL + "/posts/?maxCount=6&sortBy=date",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) {
            main.blogDataListSlider = response.data;
          }
        },
      });
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
          "/15?sortBy=date",
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
            main.reloadPostStats();
            main.blogDataListPageCurrent++;
            main.blogDataListLoadStatus = "loaded";
          } else {
            main.blogDataListLoadError = err;
            main.blogDataListLoadStatus = "error";
          }
        },
        error() {
          main.blogDataListLoadError = err;
          main.blogDataListLoadStatus = "error";
        }
      });
    },
    reloadPostStats: function() {
      var main = this;
      var getPosts = { archives: [] };

      for (var key in main.blogDataList)
        if (main.blogDataList[key].id)
          getPosts.archives.push(main.blogDataList[key].id);

      var findOldPosts = function(id) {
        for (var key in main.blogDataList)
          if (main.blogDataList[key].id == id) return main.blogDataList[key];
        return null;
      };
      var reloadPostsStat = function(arr) {
        for (var key in arr) {
          var o = findOldPosts(key);
          if (o) {
            o.viewCount = arr[key].viewCount;
            o.commentCount = arr[key].commentCount;
          }
        }
      };

      $.ajax({
        url: main.NET.API_URL + "/posts/stat",
        type: "post",
        data: JSON.stringify(getPosts),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
          if (response.success) reloadPostsStat(response.data);
        },
        error: function(xhr, err) {}
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
  .loading-host{
    min-height: 300px;
    width: 100%;
  }
  .loading-host p{
    margin-top: 10px;
  }
</style>
