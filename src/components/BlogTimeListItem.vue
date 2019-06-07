<template>
  <li
    :class="blogData.isHead ? 'blog-list-head' : ''"
    :id="(blogData.isHead) ? ('date-' + blogData.year) : ''"
  >
    <div v-if="blogData.isHead" class="blog-date">{{ blogData.year }} 发布的文章</div>
    <div v-if="!blogData.isHead" class="blog-item">
      <a target="_blank" :href="getBlogLinkRealUrl(blogData)">
        <h4>{{ blogData.title }}</h4>
        <p class="text-black">{{ blogData.previewText }}</p>
      </a>
      <div class="blog-meta">
        <div v-if="blogData.postPrefix" class="btn-inline mr-2">
          <span v-html="getBlogPrefix()"></span>
        </div>
        <i class="fa fa-clock-o"></i>
        {{ blogData.postDate.substr(0, 10) }}
        <span v-if="blogData.lastmodifyDate" class="ml-1">最近修改</span>
        {{ blogData.lastmodifyDate ? blogData.lastmodifyDate.substr(0, 10) : '' }}
        <div v-if="blogData.postClass && blogData.postClass!=''" class="btn-inline ml-2">
          <i class="fa fa-tag"></i>
          {{ blogData.postClass.split(':')[0] }}
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ["blogData"],
  name: "BlogTimeListItem",
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {},
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    getBlogLinkRealUrl() {
      return this.Utils.getPostRealUrl(this.blogData);
    },
    getBlogPrefix() {
      return this.Utils.getPostPrefix(this.blogData.postPrefix);
    }
  }
};
</script>


