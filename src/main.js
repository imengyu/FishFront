// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import NProgress from 'nprogress'
import Loading from './components/public/Loading'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueClipboard from 'vue-clipboard2'
import NET from './constants/const.js'
import serverConsts from './constants/serverConsts.js'
import toast from './assets/lib/toast/toast.simply'

//组件初始化

Vue.use(VueClipboard)
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
var main;

//从后端加载系统设置
//因为设置必须在组件初始化之前加载完成，所以这里必须推迟VUE的加载
if(typeof window.serverSettings == 'undefined'){
  axios.get(NET.API_URL + '/settings.json').then((response) => {
    window.serverSettings = response.data;
    run();
  }).catch((e) => {
    toast.toast('加载设置失败！' + e, 'error', 6000);
    window.serverSettings = serverConsts.defaultSettings;
    run();
  })
  
}

//延迟运行
function run() {

  main = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })
  main.$nextTick(() => {
    //延迟一小会
    setTimeout(Loading.done, 500);
  })

  //当路由进入前
  router.beforeEach((to, from , next) => {
    // 每次切换页面时，调用进度条
    Loading.start();
    NProgress.start();
    next();
  });
  //当路由进入后：关闭进度条
  router.afterEach(() => {  
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done();
    //延迟一小会
    setTimeout(Loading.done, 500);
  })

}

Vue.config.productionTip = false

