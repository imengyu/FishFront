<template>

</template>

<script>
import jQuery from 'jquery'

export default {
  name: "Archives",
  data() {
    return {

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
        this.$parent.publicHeaderStyleReset();
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