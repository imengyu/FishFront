<template>
  <article id="main" class="md-padding bg-grey-no-border">
    <div class="container">
      <div class="row">
        <div v-if="currentUserLoadStatus=='loaded'" class="container">
          <div class="row justify-content-center align-items-center">
            <div class="col-sm-12 col-md-7 col-lg-5">
              <div class="blog-side-content mt-3 no-display-sm no-display-md">
                <div v-if="currentUserEditing" class="blog-side-head mb-3">
                  <div
                    class="author"
                    :style="'background: url('+getUserCardBackground()+') center center no-repeat;'"
                  >
                    <img :src="getUserHead()" alt="head-img" class="img-responsive mt-3">
                  </div>
                  <div class="author_name">
                    <div class="h3 mt-2">编辑个人信息</div>

                    <label for="userEmail" class="mt-2 mr-2">性别</label>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="radioMale"
                        name="radioMale"
                        class="custom-control-input"
                        v-on:change="setGender(true)"
                      >
                      <label class="custom-control-label" for="radioMale">
                        <i class="fa fa-mars mr-2 text-primary"></i>男
                      </label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="radioFemale"
                        name="radioFemale"
                        class="custom-control-input"
                        v-on:change="setGender(false)"
                      >
                      <label class="custom-control-label" for="radioFemale">
                        <i class="fa fa-venus mr-2" style="color: #f76fe5"></i>女
                      </label>
                    </div>
                    <input
                      type="text"
                      class="flat mt-2"
                      id="userFriendlyName"
                      placeholder="我的昵称"
                      v-model="currentUser.friendlyName"
                    >
                    <input
                      type="text"
                      class="flat mt-2"
                      id="userHome"
                      placeholder="我的个人主页地址"
                      v-model="currentUser.home"
                    >
                    <input
                      type="text"
                      class="flat mt-2"
                      id="userHead"
                      placeholder="我的头像URL地址"
                      v-model="currentUser.headimg"
                    >
                    <input
                      type="text"
                      class="flat mt-2"
                      id="userCardBackground"
                      placeholder="名片背景URL地址"
                      v-model="currentUser.cardBackground"
                    >
                    <textarea
                      rows="3"
                      class="flat mt-2"
                      id="userIntroduction"
                      placeholder="我的个人简介文字"
                      v-model="currentUser.introduction"
                    ></textarea>
                  </div>
                  <button class="btn btn-primary flat-pill" v-on:click="save()">保存</button>
                  <button class="btn btn-secondary flat-pill" onclick="location.reload(true)">取消</button>
                </div>
                <div v-else class="blog-side-head mb-3">
                  <a
                    style="position:absolute;right:25px;top:139px;z-index:100;background-color: #fff;padding-bottom: .65rem;"
                    class="btn flat-round flat-icon"
                    href="javascript:;"
                    v-on:click="edit()"
                    title="编辑个人信息"
                    data-toggle="tooltip"
                    v-if="currentAuthed"
                  >
                    <i class="fa fa-pencil"></i>
                  </a>
                  <a
                    style="position:absolute;right:75px;top:139px;z-index:100;background-color: #fff;padding-bottom: .65rem;"
                    class="btn flat-round flat-icon"
                    href="javascript:;"
                    v-on:click="messageCenter()"
                    title="我的消息"
                    data-toggle="tooltip"
                    v-if="currentAuthed"
                  >
                    <i class="fa fa-commenting-o"></i>
                    <span
                      v-if="currentAuthedUser.messageCount"
                      class="current-user-message-count"
                      style="position: absolute;font-size: 10px;background-color: #ff5029;color: #fff;border-radius: 13px;right: 2px;top: -4px;height: 16px;padding: 0 4px;line-height: 16px;text-align: center;"
                    >{{ currentAuthedUser.messageCount }}</span>
                  </a>
                  <div
                    class="author"
                    :style="'background: url('+getUserCardBackground()+') center center no-repeat;'"
                  >
                    <img :src="getUserHead()" alt="head-img" class="img-responsive mt-3">
                  </div>
                  <div class="author_name">
                    <a v-if="currentUser.gender == '男'">
                      <i class="fa fa-mars mr-2 text-primary"></i>
                    </a>
                    <a v-if="currentUser.gender == '女'">
                      <i class="fa fa-venus mr-2" style="color: #f76fe5"></i>
                    </a>
                    <a :href="currentUser.home" target="_blank">{{ getFriendlyName() }}</a>
                    <span v-if="currentUser.level==1">博主</span>
                  </div>
                  <p
                    v-if="currentUser.introduction&&currentUser.introduction!=''"
                    v-html="currentUser.introduction"
                  ></p>
                  <p v-else class="text-secondary">Ta 很懒，什么简介也没写~</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="currentUserLoadStatus=='loading'"
          style="max-width: 400px;margin: 0 auto; padding: 10px"
        >
          <div class="simple-loading-center">
            <div class="simple-loading-container">
              <span class="simple-loading"></span>
              <p>拼命加载中</p>
            </div>
          </div>
        </div>
        <div
          v-else-if="currentUserLoadStatus=='failed'"
          style="max-width: 400px;margin: 0 auto; padding: 10px"
        >
          <div
            class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column"
          >
            <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
            <p class="text-secondary mt-2">
              <span class="h4">404</span>
              <br>页面加载失败了（T-T）
              <br>
              {{ currentUserLoadError }}
            </p>
            <button type="button" class="btn btn-primary" onclick="location.href='/'">返回首页</button>
          </div>
        </div>
      </div>
    </div>


  </article>
</template>

<script>
import jQuery from "jquery"; var $ = jQuery;
import toast from "../assets/lib/toast/toast.simply.js";
import serverConsts from '../constants/serverConsts.js'

export default {
  name: "UserInfo",
  data() {
    return {
      currentAuthedUser: null,
      currentAuthed: false,

      currentUserEditing: false,
      currentUser: null,
      currentUserLoadStatus: "notload",
      currentUserLoadError: "",
      currentMessageTitle: "",
      currentMessageContent: ""
    };
  },
  mounted() {
    this.init();
  },
  watch:{
    $route(to,from){
      this.loadUser();
    }
  },
  methods: {
    init: function() {
      this.loadUser();
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    authInfoInited() {
      var authedUser = this.$store.getters["auth/authInfo"];
      if (authedUser) {
        this.currentAuthedUser = authedUser;
        if (this.currentUser && this.currentUser.id == this.currentAuthedUser.id)
            this.currentAuthed = true;
      }
    },
    loadUser: function() {
      var main = this;
      var currentUserId = this.$route.params.userid;
      if (!this.Utils.isNumber(currentUserId) || currentUserId == "user")
        currentUserId = "0";
      var url = this.NET.API_URL + "/user/" + currentUserId;
      $.ajax({
        url: url,
        success: function(response) {
          if (response.success) {
            main.currentUserLoadStatus = "loaded";
            main.currentUser = response.data;
            if (
              main.currentAuthedUser &&
              main.currentAuthedUser.id == main.currentUser.id
            ) {
              main.currentAuthed = true;
              if (!main.Utils.isNullOrEmpty(location.hash)) {
                if (location.hash.indexOf("#message-") == 0) {
                  main.messageCenter();
                }
              }
            }
          } else {
            main.currentUserLoadStatus = "failed";
            main.currentUserLoadError = response.message;
          }
        },
        error: function(xhr, err) {
          main.currentUserLoadStatus = "failed";
          main.currentUserLoadError = err;
        }
      });
    },
    edit() {
      var main = this;
      if (this.currentAuthedUser) {
        if (
          this.currentAuthedUser.level == serverConsts.UserLevels.writer ||
          this.currentAuthedUser.level == serverConsts.UserLevels.admin
        ) {
          this.jump("/admin/user-center/");
        } else {
          this.currentUserEditing = true;
          setTimeout(function() {
            if (main.currentUser.gender == "男") {
              $("#radioMale").prop("checked", true);
              $("#radioFemale").prop("checked", false);
            } else if (main.currentUser.gender == "女") {
              $("#radioMale").prop("checked", false);
              $("#radioFemale").prop("checked", true);
            }
          }, 200);
        }
      }
    },
    save() {
      var t = toast.toast("正在提交中...", "loading", -1);
      var main = this;
      $.ajax({
        url: address_blog_api + "user/" + main.currentUser.id + "",
        type: "put",
        dataType: "json",
        data: JSON.stringify(main.currentUser),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
          toast.toastClose(t);
          if (response.success) {
            toast("修改个人信息成功！", "success", 5000);
            main.currentUserEditing = false;
          } else main.$swal("修改个人信息失败", response.message, "error");
        },
        error: function(xhr, err) {
          toast.toastClose(t);
          toast.toast("修改个人信息失败 : " + err, "error", 5000);
        }
      });
    },
    setGender(m) {
      if (m) {
        this.currentUser.gender = "男";
        $("#radioMale").prop("checked", true);
        $("#radioFemale").prop("checked", false);
      } else {
        this.currentUser.gender = "女";
        $("#radioMale").prop("checked", false);
        $("#radioFemale").prop("checked", true);
      }
    },
    getFriendlyName() {
      if (this.currentUser) {
        if (!this.Utils.isNullOrEmpty(this.currentUser.friendlyName))
          return this.currentUser.friendlyName;
        return this.currentUser.name;
      }
      return "加载失败";
    },
    getUserHead() {
      if (this.Utils.isNullOrEmpty(this.currentUser.headimg))
        return require("../assets/images/default/head-default.png");
      else return this.Utils.getImageUrlFormHash(this.currentUser.headimg);
    },
    getUserCardBackground() {
      if (this.Utils.isNullOrEmpty(this.currentUser.cardBackground))
        return require("../assets/images/background/mebg.jpg");
      else return this.Utils.getImageUrlFormHash(this.currentUser.cardBackground);
    },
  }
};
</script>

<style scoped>
.user-head {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 80px;
  left: 50%;
  margin-left: -50px;
  background-color: #efeff4;
  border-radius: 50%;
  padding: 18px;
}

.user-head img {
  width: 64px;
  height: 64px;
}
</style>
