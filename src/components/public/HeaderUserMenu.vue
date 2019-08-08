<template>
  <li class="nav-user">
    <button
      v-if="currentUserLevel == 'admin'"
      type="button"
      class="flat-pill flat-btn flat-btn-transparent flat-danger mr-2"
      v-on:click="gotToWriteArchive()"
    >写文章</button>
    <div id="current_user_center_dropdown" class="dropdown">
      <img lass="current-user-head" :src="currentUserHead">
      <span
        v-if="currentUserMessageCount>0"
        class="current-user-message-count"
      >{{ currentUserMessageCount }}</span>
      <div class="dropdown-menu shadow-dirty dropdown-menu-right">
        <div class="message-list" id="current_user_message_list"></div>
      </div>
    </div>
    <div id="current_user_dropdown" class="dropdown">
      <span
        class="current-user-name"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        data-offset="0,20"
      >
        {{ currentUserName }}
        <i></i>
      </span>
      <div
        v-if="currentUserLevel == 'admin' || currentUserLevel == 'writer'"
        class="dropdown-menu dropdown-menu-right shadow-dirty"
      >
        <a class="dropdown-item" :href="getMenuRealUrl('/admin/')">博客控制台</a>
        <a class="dropdown-item" :href="getMenuRealUrl('/admin/write-archives/')">写文章</a>
        <a class="dropdown-item" :href="getMenuRealUrl('/admin/manage-archives/')">文章管理</a>
        <a class="dropdown-item" :href="getMenuRealUrl('/admin/user-center/')">个人信息</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" :href="getMenuRealUrl('/sign-out/')">退出登录</a>
      </div>
      <div
        v-else-if="currentUserLevel == 'guest'"
        class="dropdown-menu dropdown-menu-right shadow-dirty"
      >
        <a class="dropdown-item" :href="getMenuRealUrl('/user/x/')">我的个人信息</a>
        <a class="dropdown-item" :href="getMenuRealUrl('/sign-out/')">退出登录</a>
      </div>
      <div v-else class="dropdown-menu dropdown-menu-right shadow-dirty">
        <a class="dropdown-item" :href="getMenuRealUrl('/sign-in/')">登录</a>
        <a class="dropdown-item" :href="getMenuRealUrl('/sign-up/')">注册</a>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "HeaderUserMenu",
  props: ['currentUser','currentUserLevel','currentUserName','currentUserHead','currentUserMessageCount'],
  data() {
      return {}
  },
  methods: {
    getMenuRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    gotToWriteArchive() {
      location.href = this.getMenuRealUrl("/admin/write-archive/");
    },
  }
};
</script>


