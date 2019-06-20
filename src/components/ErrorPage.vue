<template>
  <div class="container" :style="'height:'+height">
    <div
      class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column"
    >
      <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
      <p class="text-secondary mt-2">
        <span class="h4">加载失败</span>
        <br>
        {{ error.split(':')[1] }}
      </p>
      <el-button type="primary" round @click="retry()">重试</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error:{
        default: ''
    }, 
    height:{
        default: '450px'
    }
  },
  name: "ErrorPage",
  methods: {
      retry(){
          this.$emit('retry');
      }
  }
};
</script>

