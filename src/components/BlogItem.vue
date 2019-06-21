<template>
    <div v-if="blogData" :class="'flat-blog-item' + (blogData.previewImage ? '' : ' no-img')">
        <h3><a :href="getBlogLinkRealUrl()" target="_blank">{{ blogData.title }}</a></h3>
        <p v-if="blogData.previewText">{{ blogData.previewText }}</p>
        <div v-if="blogData.previewImage" class="flat-blog-imghost">
            <img :src="blogData.previewImage" />
            <img class="holder" :src="blogData.previewImage" />
        </div>
        <ul class="flat-blog-meta">
            <li v-if="blogData.topMost" class="mr-2"><span class="tag-post-prefix original"><i class="fa fa-thumb-tack text-white"></i> 置顶</span></li>
            <li v-if="blogData.postPrefix" ><span v-html="getBlogPrefix()"></span></li>
            <li><i class="fa fa-clock-o"></i>{{ blogData.postDate }}</li>
            <li v-if="blogData.postClass && blogData.postClass!=''"><i class="fa fa-tag"></i>{{ blogData.postClass.split(':')[0] }}</li>
            <li><i class="fa fa-eye"></i>{{ blogData.viewCount }}</li>
            <li><i class="fa fa-comment"></i>{{ blogData.commentCount }}</li>
        </ul>
    </div>
</template>

<script>
export default {
  props: ['blogData'],
  name: "BlogItem",
  data() {
    return {

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      
    },
    jump(link){
      location.href=this.getJumpRealUrl(link)
    },
    getJumpRealUrl(link){
      return this.NET.URL_PREFIX + link;
    },
    getBlogLinkRealUrl(){
      return this.Utils.getPostRealUrl(this.blogData);
    },
    getBlogPrefix(){
      return this.Utils.getPostPrefix(this.blogData.postPrefix)
    },
  }
};
</script>


