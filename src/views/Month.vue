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
              <li
                v-for="(post, index) in blogDataList"
                :key="index"
                :class="post.isHead ? 'blog-list-head' : ''"
                :id="(post.isHead) ? ('date-' + post.year) : ''"
              >
                <div v-if="post.isHead" class="blog-date">{{ post.year }} 发布的文章</div>
                <div v-if="!post.isHead" class="blog-item">
                  <a target="_blank" :href="getBlogLinkRealUrl(post)">
                    <h4 v-html="getBlogPrefix(post.postPrefix) + post.title"></h4>
                    <p class="text-black">{{ post.previewText }}</p>
                  </a>
                  <div class="blog-meta">
                    <i class="fa fa-clock-o"></i>
                    {{ post.postDate.substr(0, 10) }}
                    <span
                      v-if="post.lastmodifyDate"
                      class="ml-1"
                    >最近修改</span>
                    {{ post.lastmodifyDate ? post.lastmodifyDate.substr(0, 10) : '' }}
                  </div>
                </div>
              </li>
            </ul>
            <div
              v-if="blogDataListLoadStatus=='loading'"
              class="simple-loading-center text-center loading-host"
            >
              <span class="simple-loading"></span>
              <p>加载中</p>
            </div>
            <div v-if="blogDataListLoadStatus=='error'" class="text-center text-danger">
              <div class="text-center">{{ blogDataListLoadError }}</div>
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

export default {
  name: "Archives",
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
    "side-area": SideArea
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.$store.dispatch('global/resetHeader');
      this.$store.dispatch('global/setPageShowBreadcrumb', true);
      this.$store.dispatch('global/setPageBreadcrumb', {
        
      });
      this.loadArchivePage();
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
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
            main.blogDataListLoadError = err;
            main.blogDataListLoadStatus = "error";
          }
        },
        error() {
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
