// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import NProgress from 'nprogress'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import mavonEditor from 'mavon-editor'

import 'mavon-editor/dist/css/index.css'

Vue.use(mavonEditor)
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(VueSweetalert2, options)

axios.defaults.withCredentials = true

NProgress.configure({     
  easing: 'ease',  // 动画方式    
  speed: 500,  // 递增进度条的速度    
  showSpinner: false, // 是否显示加载ico    
  trickleSpeed: 200, // 自动递增间隔    
  minimum: 0.3 // 初始化时的最小百分比
})

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674'
}

/* eslint-disable no-new */
var main = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

//当路由进入前
router.beforeEach((to, from , next) => {
  // 每次切换页面时，调用进度条
  NProgress.start();
  next();
});
//当路由进入后：关闭进度条
router.afterEach(() => {  


  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done();
})


Vue.config.productionTip = false

