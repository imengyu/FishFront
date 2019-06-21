<template>
  <div>
    <div class="blog-side-content no-shadow mt-4 no-display-sm no-display-md">
      <div v-if="showBloger && bloggerInfo" class="blog-side-head mb-3">
        <div
          class="author"
          :style="'background: url('+getUserCardBackground()+') center center no-repeat;'"
        >
          <img class="img-responsive mt-3" :src="bloggerInfo.headimg" alt="head-img">
        </div>
        <div class="author_name">
          <a :href="bloggerInfo.hone" :title="bloggerInfo.friendlyName">
            <a v-if="bloggerInfo.gender == '男'">
              <i class="fa fa-mars mr-2 text-primary"></i>
            </a>
            <a v-if="bloggerInfo.gender == '女'">
              <i class="fa fa-venus mr-2" style="color: #f76fe5"></i>
            </a>
            {{ bloggerInfo.friendlyName }}
          </a>
          <span>博主</span>
        </div>
        <p>{{ bloggerInfo.introduction }}</p>
      </div>
    </div>
    <div v-if="showTags" class="blog-side-content no-shadow mt-3">
      <h5 class="blog-title">分类标签</h5>
      <div class="tags" v-if="contentTagsLoaded">
        <a
          v-for="(tag, index) in contentTags"
          class="tag-color" v-bind:key="index"
          v-on:click="goViewTag(tag.id)"
          href="javascript:void(0);"
          :id="'tag_'+tag.id"
          :style="'background-color:'+tag.color+';'"
        >{{ tag.name }}</a>
      </div>
      <div
        v-if="contentTagsLoaded && allTagCount > 15 && !contentAllTagsLoaded"
        class="text-center mt-2"
      >
        <button v-on:click="loadMoreTags" class="flat flat-btn btn-link">显示全部</button>
      </div>
    </div>
    <div v-if="showDates" class="blog-side-content no-shadow mt-3">
      <h5 class="blog-title">文章归档</h5>
      <div class="dates" v-if="contentDatesLoaded">
        <a
          v-for="(date, index) in contentDates" v-bind:key="index"
          class="tag-color"
          v-on:click="goViewDate(date.date.substr(0,4), date.date.substr(5, 2))"
          href="javascript:void(0);"
        >{{ getDateString(date.date) + ' (' + date.count + ')' }}</a>
      </div>
      <div
        v-if="contentDatesLoaded && allDateCount > 5 && !contentAllDatesLoaded"
        class="text-center mt-2"
      >
        <button v-on:click="loadMoreDates" class="flat flat-btn btn-link">显示全部</button>
      </div>
    </div>
    <div v-if="showClass" class="blog-side-content no-shadow mt-3">
      <h5 class="blog-title">文章分类</h5>
      <div class="tags" v-if="contentClassesLoaded">
        <a
          v-for="(pclass, index) in contentClasses" v-bind:key="index" class="tag-color bg-info"
          v-on:click="goViewClass(pclass.urlName ? pclass.urlName : pclass.id)"
          href="javascript:void(0);"
        >{{ pclass.title }}</a>
      </div>
      <div
        v-if="contentClassesLoaded && allClassCount > 5 && !contentAllClassesLoaded"
        class="text-center mt-2"
      >
        <button v-on:click="loadMoreClasses" class="flat flat-btn btn-link">显示全部</button>
      </div>
    </div>
    <div
      v-if="showCustomerArea && contentCusetomerAreaHtml != ''"
      v-html="contentCusetomerAreaHtml"
      class="blog-side-content mt-3 p-0"
    ></div>
  </div>
</template>

<script>
import jQuery from 'jquery'
import NET from '../constants/const.js'
import serverConsts from '../constants/serverConsts.js'

export default {
  props: {
    showBloger: { default: true },
    showTags: { default: true },
    showDates: { default: true },
    showClass: { default: true },
    showCustomerArea: { default: true }
  },
  name: "SideArea",
  data() {
    return {
      contentTagsLoaded: false,
      contentClassesLoaded: false,
      contentDatesLoaded: false,
      contentAllTagsLoaded: false,
      contentAllClassesLoaded: false,
      contentAllDatesLoaded: false,
      contentTags: null,
      contentDates: null,
      contentClasses: null,
      contentCusetomerAreaHtml: null,
      allClassCount: 0,
      allDateCount: 0,
      allTagCount: 0,
      bloggerInfo: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
        this.loadAll();
    },
    getBlogLinkRealUrl() {
      return this.Utils.getPostRealUrl(this.blogData);
    },
    loadAll() {
      var main = this;

      var tags_url = NET.API_URL + "/tags?maxCount=15";
      var classes_url = NET.API_URL + "/classes?maxCount=5";
      var dates_url = NET.API_URL + "/month?maxCount=5";
      var blogger_url = NET.API_URL + "/user/admin";

      if (this.showBloger) {
        jQuery.get(
          blogger_url,
          function(response) {
            if (response.success) {
              main.bloggerInfo = response.data;
            }
          },
          "json"
        );
      }
      if (this.showTags) {
        jQuery.get(
          tags_url,
          function(response) {
            if (response.success) {
              main.contentTagsLoaded = true;
              main.contentTags = response.data.list;
              main.allTagCount = response.data.allCount;
            }
          },
          "json"
        );
      }
      if (this.showDates) {
        jQuery.get(
          classes_url,
          function(response) {
            if (response.success) {
              main.contentClassesLoaded = true;
              main.contentClasses = response.data.list;
              main.allClassCount = response.data.allCount;
            }
          },
          "json"
        );
      }
      if (this.showClass) {
        jQuery.get(
          dates_url,
          function(response) {
            if (response.success) {
              main.contentDatesLoaded = true;
              main.contentDates = response.data.list;
              main.allDateCount = response.data.allCount;
            }
          },
          "json"
        );
      }
      if (this.showCustomerArea) this.loadSideCustomArea();
    },
    loadMoreTags() {
      var main = this;
      jQuery.get(
        NET.API_URL + "/tags",
        function(response) {
          if (response.success) {
            main.contentTags = response.data;
            main.contentAllTagsLoaded = true;
            main.allClassCount = response.data.length;
          }
        },
        "json"
      );
    },
    loadMoreDates() {
      var main = this;
      jQuery.get(
        NET.API_URL + "/month",
        function(response) {
          if (response.success) {
            main.contentDates = response.data;
            main.contentAllDatesLoaded = true;
          }
        },
        "json"
      );
    },
    loadMoreClasses() {
      var main = this;
      jQuery.get(
        NET.API_URL + "/classes",
        function(response) {
          if (response.success) {
            main.contentClasses = response.data;
            main.contentAllClassesLoaded = true;
          }
        },
        "json"
      );
    },
    loadSideCustomArea() {
      /*if (!this.Utils.isNullOrEmpty(this.sideCustomArea))
        this.contentCusetomerAreaHtml = base64.decode(
          this.sideCustomArea.replace(" ", "+")
        );*/
    },
    goViewTag(tagId) {
      var newUrl = this.Utils.getJumpRealUrl(serverConsts.PartPositions.viewTag + tagId + "/");
      if (
        this.$route.path.indexOf(serverConsts.PartPositions.viewTag) == 0 &&
        this.$route.path != serverConsts.PartPositions.viewAll
      )
        location.href = newUrl;
      else window.open(newUrl);
    },
    goViewDate(year, month) {
      var newUrl = this.Utils.getJumpRealUrl(serverConsts.PartPositions.viewDate + year + "/" + month + "/");
      if (
        this.$route.path.indexOf(serverConsts.PartPositions.viewDate) == 0 &&
        this.$route.path != serverConsts.PartPositions.viewAll
      )
        location.href = newUrl;
      else window.open(newUrl);
    },
    goViewClass(classIdOrName) {
      var newUrl = this.Utils.getJumpRealUrl(serverConsts.PartPositions.viewClass + classIdOrName + "/");
      if (
        this.$route.path.indexOf(serverConsts.PartPositions.viewClass) == 0 &&
        this.$route.path != serverConsts.PartPositions.viewAll
      )
        location.href = newUrl;
      else window.open(newUrl);
    },
    getDateString: function(str) {
      var arr = str.split("-");
      return arr[0] + " 年 " + arr[1] + " 月";
    },
    getUserCardBackground() {
      if (!this.bloggerInfo || this.Utils.isNullOrEmpty(this.bloggerInfo.cardBackground))
        return require("../assets/images/background/mebg.jpg");
      else return this.bloggerInfo.cardBackground;
    }
  }
};
</script>


