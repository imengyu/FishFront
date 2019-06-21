<template>
  <div class="container" :style="'height:'+height">
    <div
      class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column"
    >
      <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
      <p class="text-secondary mt-2">
        <span class="h4">{{title}}</span>
        <br>
        {{ error.indexOf(':') ==-1? error: error.split(':')[1] }}
      </p>
      <el-button v-if="canRetry" type="primary" round @click="retry()">{{retryText}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title:{
        default: '加载失败'
    }, 
    error:{
        default: ''
    }, 
    height:{
        default: '450px'
    },
    canRetry:{
        default: true
    },
    retryText:{
        default: '重试'
    },
  },
  name: "ErrorPage",
  methods: {
      retry(){
          this.$emit('retry');
      }
  }
};
</script>

