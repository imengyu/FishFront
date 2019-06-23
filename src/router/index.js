import Vue from 'vue'
import Router from 'vue-router'

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
import SignUp from '@/views/user/SignUp'

import Archives from '@/views/Archives'
import Month from '@/views/Month'
import Page404 from '@/views/Page404'
import Tags from '@/views/Tags'
import Classes from '@/views/Classes'
import ViewPost from '@/views/ViewPost'
import UserInfo from '@/views/UserInfo'

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        index: 0,
        title: '首页',
      }
    },
    {
      path: '/sign-in/',
      name: 'SignIn',
      component: SignIn, 
      meta: {
        title: '登录',
        index: 1,
      }
    },
    {
      path: '/sign-out/',
      name: 'SignOut',
      component: SignOut,
      meta: {
        title: '登出',
        index: 1,
      }
    },
    //博客主页面
    {
      path: '/archives/',
      name: 'Archives',
      component: Archives,
      meta: {
        title: '文章',
        index: 1,
      }
    },
    {
      path: '/archives/month/',
      name: 'Month',
      component: Month,
      meta: {
        title: '归档',
        index: 1,
      }
    },
    {
      path: '/archives/month/:year/:month/',
      name: 'Month',
      component: Month,
      meta: {
        title: '归档',
        index: 2,
      }
    },
    {
      path: '/archives/tags/:tag/',
      name: 'Tags',
      component: Tags,
      meta: {
        title: '标签',
        index: 2,
      }
    },
    {
      path: '/archives/categories/:category/',
      name: 'Classes',
      component: Classes,
      meta: {
        title: '分类',
        index: 2,
      }
    },
    {
      path: '/archives/post/:post/',
      name: 'ViewPost',
      component: ViewPost,
      meta: {
        title: '浏览文章',
        index: 3,
      }
    },
    {
      path: '/user/:userid/',
      name: 'UserInfo',
      component: UserInfo,
      meta: {
        title: '用户',
        index: 2,
      }
    },

    // Admin controller
    {
      path: '/admin/',
      name: 'AdminIndex',
      component: () => import(/* webpackChunkName: "admin-index" */ '@/views/admin/Index'),
      meta: {
        title: '仪表盘',
        index: 3,
      }
    },
    {
      path: '/admin/manage-archives/',
      name: 'AdminManageArchives',
      component: () => import(/* webpackChunkName: "admin-marchives" */ '@/views/admin/ManageArchives'),
      meta: {
        title: '文章管理',
        index: 4,
      }
    },
    {
      path: '/admin/write-archive/',
      name: 'AdminWriteArchive',
      component: () => import(/* webpackChunkName: "admin-warchive" */ '@/views/admin/WriteArchive'),
      meta: {
        title: '写文章',
        index: 4,
      }
    },
    {
      path: '/admin/manage-classfication/',
      name: 'AdminManageClassfication',
      component: () => import(/* webpackChunkName: "admin-mclassfication" */ '@/views/admin/ManageClassfication'),
      meta: {
        title: '标签和分类管理',
        index: 4,
      }
    },
    {
      path: '/admin/user-center/',
      name: 'AdminUserCenter',
      component: () => import(/* webpackChunkName: "admin-user" */ '@/views/admin/UserCenter'),
      meta: {
        title: '用户信息修改',
        index: 4,
      }
    },
    {
      path: '/admin/manage-users/',
      name: 'AdminManageUsers',
      component: () => import(/* webpackChunkName: "admin-musers" */ '@/views/admin/ManageUsers'),
      meta: {
        title: '管理作者和用户',
        index: 4,
      }
    },
    {
      path: '/admin/new-user/',
      name: 'AdminNewUser',
      component: () => import(/* webpackChunkName: "admin-nuser" */ '@/views/admin/NewUser'),
      meta: {
        title: '新建作者账号',
        index: 4,
      }
    },
    {
      path: '/admin/settings/',
      name: 'AdminSystemSettings',
      component: () => import(/* webpackChunkName: "admin-settings" */ '@/views/admin/SystemSettings'),
      meta: {
        title: '修改系统设置',
        index: 2,
      }
    },
    {
      path: '/admin/skin/',
      name: 'AdminSystemSkin',
      component: () => import(/* webpackChunkName: "admin-skin" */ '@/views/admin/SystemSkin'),
      meta: {
        title: '博客外观',
        index: 2,
      }
    },

    //User center
    {
      path: '/user/center/change-password/',
      name: 'UserCenterChangePassword',
      component: () => import(/* webpackChunkName: "change-password" */ '@/views/user/ChangePassword'),
      meta: {
        title: '修改密码',
        index: 4,
      }
    },
    {
      path: '/user/center/rec-password/',
      name: 'UserCenterFindPassword',
      component: () => import(/* webpackChunkName: "rec-password" */ '@/views/user/FindPassword'),
      meta: {
        title: '找回密码',
        index: 4,
      }
    },
    {
      path: '/sign-up/',
      name: 'SignUp',
      component: SignUp,
      meta: {
        title: '注册',
        index: 1,
      }
    },
    {
      path: '/user/center/active/',
      name: 'UserCenterSignUpActive',
      component: () => import(/* webpackChunkName: "center-active" */ '@/views/user/SignUpActive'),
      meta: {
        title: '激活账号',
        index: 2,
      }
    },
    
    // 404page
    {
      path: '*', // 页面不存在的情况下会跳到404页面
      name: 'Page404',
      component: Page404,
      hidden: true,
      meta: {
        title: '404 - ALONE SPACE',
        index: 0,
      }
    }
  ]
})
