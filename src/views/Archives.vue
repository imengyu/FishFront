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
              :style="(item.previewImage ? ('background-image: url(' + item.previewImage +  ');') : '')">
               
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
              <div class="text-center"><span class="text-danger">加载错误</span><br/>{{ blogDataListLoadError }}</div>
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
            >{{ blogDataListEmpty ? '博主真懒，居然一篇文章也没写...(*￣０￣)ノ' : '没有更多文章了'}}</div>
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
      blogDataListEmpty: false,
      blogDataListPageSize: 15,
      blogDataListPageCount: 0,
      blogDataListPageCurrent: 0,
      blogDataListSlider: null,
      //滑动配置[obj]
      sliderinit: {
        currentPage: 0,//当前页码
        thresholdDistance: 400,//滑动判定距离
        thresholdTime: 100,//滑动判定时间
        autoplay: 2000,//自动滚动[ms]
        loop: true,//循环滚动
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
    getBlogLinkRealUrl(item){
      return this.Utils.getPostRealUrl(item);
    },
    authInfoInited() {},

    loadArchiveTop(){
      this.axios.get(this.NET.API_URL + "/posts/?maxCount=6&sortBy=date").then((response) => {
        if (response.data.success)
            this.blogDataListSlider = response.data.data;
      });
    },
    loadArchivePage() {

      if (this.blogDataListLoadStatus == "loading") return;
      this.blogDataListLoadStatus = "loading";
      this.axios.get(this.NET.API_URL +
          "/posts/page/" +
          this.blogDataListPageCurrent +
          "/15?sortBy=date").then((response) => {
        if (response.data.success){
            this.blogDataListPageCount = response.data.data.totalPages;
            this.blogDataListEmpty = response.data.data.empty;
            if (this.blogDataList == null)
              this.blogDataList = response.data.data.content;
            else
              this.blogDataList = this.Utils.mergeJsonArray(this.blogDataList,response.data.data.content);
            this.reloadPostStats();
            this.blogDataListPageCurrent++;
            this.blogDataListLoadStatus = "loaded";
        }else{
          this.blogDataListLoadError = response.data.message;
          this.blogDataListLoadStatus = "error";
        }
      }).catch((err)=>{
        this.blogDataListLoadError = err;
        this.blogDataListLoadStatus = "error";
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
      this.axios
        .post(this.NET.API_URL + "/posts/stat", getPosts)
        .then(response => {
          if (response.data.success) reloadPostsStat(response.data.data);
        })
        .catch(response => {
          console.log(response);
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
