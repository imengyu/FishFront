<template>
  <div>
    这里什么也没有
  </div>
</template>

<script>
import jQuery from 'jquery'

export default {
  name: "Month",
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
    authInfoInited(){
      
    },
    
  }
};
</script>