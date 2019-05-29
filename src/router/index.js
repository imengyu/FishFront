import Vue from 'vue'
import Router from 'vue-router'

import jquery from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '../assets/css/yzc-blog.min.css'
import '../assets/lib/font-awesome/css/font-awesome.min.css'
import 'nprogress/nprogress.css'
import serverConsts from '../constants/serverConsts.js'
import net from '../constants/const.js'
import utils from '../components/public/Utils.js'

Vue.prototype.ServerConsts = serverConsts
Vue.prototype.Utils = utils
Vue.prototype.NET = net
Vue.use(Router)

//Views
import Index from '@/views/Index'
import SignIn from '@/views/SignIn'
import SignOut from '@/views/SignOut'
import Archives from '@/views/Archives'
import Month from '@/views/Month'
import Page404 from '@/views/Page404'

export default new Router({
  /*mode: 'history',*/
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/sign-in/',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/sign-out/',
      name: 'SignOut',
      component: SignOut
    },
    //博客主页面
    {
      path: '/archives/',
      name: 'Archives',
      component: Archives
    },
    {
      path: '/archives/month/',
      name: 'Month',
      component: Month
    },


    
    // 404page
    {
      path: '*', // 页面不存在的情况下会跳到404页面
      name: 'Page404',
      component: Page404,
      hidden: true
    }
  ]
})
