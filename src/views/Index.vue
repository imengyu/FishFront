<template>
  <div>
    <div class="home-wrapper">
      <div class="container">
        <div :class="'row justify-content-center ' + (!isDetailsView ? 'main-show-center' : 'main-hide-center')">
          <div class="col-sm-12 col-md-10 col-lg-8">
            <div class="home-content">
              <div class="main-head text-center">
                <h1>DreamFish'S Blog</h1>
                <p>Cold and quiet space, cool but Useless</p>
              </div>
            </div>
          </div>
        </div>
        <div :class="'row justify-content-center ' + (isDetailsView ? 'main-show-center' : 'main-hide-center')" >
          <!-- home content -->
          <div class="col-sm-12 col-md-10 col-lg-8">
            <div class="home-content">
              <div class="main-ufo"></div>
              <div class="main-head-desp text-center">              
                <p><span class="main-alone-text">这儿是一片孤独的土地</span></p>
                <div class="white-content">
                  <h3 style="padding-top: 10px; padding-bottom: 10px;">欢迎来到 DreamFish 的博客</h3>
                  亲爱的陌生人，你好。这是我的博客，我在此分享一些技术上的学习心得
                  <br>我是 DreamFish ，一名普通大学生，对，非常垃圾和菜💩
                  <br>感谢你能来光顾如此垃圾的我的博客 （＞人＜；）
                  <br>如果你也喜欢一样的技术，我们不妨聊一聊？
                  <br>
                  <a class="link" href="/archives/post/about/">更多关于我的信息</a>
                </div>
              </div>
            </div>
          </div>
          <!-- /home content -->
        </div>
        <div :class="'row justify-content-center separated ' + (isDetailsView ? 'main-show-common' : 'main-hide-common')">
          <div class="col-sm-6 col-md-2 col-6">
            <div class="number">
              <span id="my-age">{{ statYear }}</span>
              <p>的我，碌碌无为</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-2 col-6">
            <div class="number">
              <span id="web-arc-count">{{ statArchiveCount }}</span>
              <p>我写了文章</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-2 col-6">
            <div class="number">
              <span id="web-day-visit">{{ statPv + ' / ' + statIp  }}</span>
              <p>今日访问量/访客数</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-2 col-6">
            <div class="number">
              <span id="web-live-time">{{ statSiteLive }}</span>
              <p>网站已经存在</p>
            </div>
          </div>
        </div>
        <div class="row justify-content-center separated">
          <div class="col">
            <button
              type="button"
              class="flat-pill flat-btn flat-btn-white mt-3"
              id="main-more-button"
              style="border-top-right-radius: 0px!important;border-bottom-right-radius: 0px!important;border-right: none!important"
              v-on:click="switchMain()"
            >
              <i :class="'fa fa-angle-down mr-0' + (isDetailsView ? ' revrse-180' : '')"></i>
            </button><button
              type="button"
              class="flat-pill flat-btn flat-btn-white mt-3 ml-0"
              style="border-top-left-radius: 0px!important;border-bottom-left-radius: 0px!important"
              v-on:click="jump('/archives/')"
            >进入我的博客</button>
          </div>
        </div>
      </div>
    </div>
    <div class="main-footer">
      <ul>
        <li>
          &copy; 2019
          <a class="main-link" href="/archives/post/about/">DreamFish</a>
        </li>
        <li>
          <a class="main-link" href="http://www.miitbeian.gov.cn" target="_blank">浙ICP备18051956号-1</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import jQuery from 'jquery'

export default {
  name: "Index",
  data() {
    return {
      isDetailsView: false,
      statYear: '-',
      statArchiveCount: '-',
      statPv: '-',
      statIp: '-',
      statSiteLive: '-',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.$parent.publicFooter(false);
      this.$parent.publicHeaderStyle("header");
      this.$parent.publicHeaderMeuStyle("main-menu-black");
      this.$parent.publicHeaderImage(require("../assets/images/background/background5.jpg"));
      this.loadStats();
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    switchMain() {
      this.isDetailsView = !this.isDetailsView;
    },
    loadStats(){
      var a = new Date, b, c = this.df(a, new Date("2018-11-29"));
      this.statYear = a.getFullYear() - 2e3 + " 岁";
      if(c<365) this.statSiteLive = c + " 天"
      else {
        var d = parseInt(c / 365), e = c - (d * 365);
        this.statSiteLive = d + ' 年 ' + e + " 天"
      }
      var url = this.NET.API_URL + "/stat/today";
      var main = this;
      jQuery.ajax({
        url: url,
        type: "get",
        success: function(r) {
            try {
                if (r.success) {
                    var d = r.data;
                    main.statPv = d.pv;
                    main.statIp = d.ip;
                    main.statArchiveCount = d.count + " 篇";
                    console.log("%c 您是今天第 %c " + d.ip + " %c 个访问者！ ", "color:white;background-color:black;padding:5px 0", "color:white;background-color:#6195FF;padding:5px 0", "color:white;background-color:black;padding:5px 0")
                }
            } catch (e) {}
        }
      })
    },
    df(a, e) {
      var c, b, d;
      return a = Date.parse(a),
      c = (e = Date.parse(e)) - a,
      c = Math.abs(c),
      d = Math.floor(c / 864e5)
    }
  }
};
</script>

<style scoped>
.main-head {
  position: relative;
}
.main-head h1 {
  font-size: 4em;
  padding: 0 0 0.25em 0;
  border-bottom: solid 2px #fff;
  font-weight: 200;
  text-transform: none;
  letter-spacing: 0;
  word-break: break-word;
}
.main-head-desp {
  padding-top: 75px;
  padding-bottom: 0;
  color: #fff;
  background-image: url(/images/background/bg_mc.jpg);
  background-position-y: -150px;
}
.main-head-desp p {
  text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.6);
}
.main-head-desp h2 {
  font-size: 2.5em;
  padding: 0 0.5em 0.1em 0.5em;
  font-weight: 200;
  text-transform: none;
  letter-spacing: 0;
  text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.6);
}
.main-head-desp .white-content {
  margin-bottom: 20px;
  background-color: #fff;
  color: #000;
  padding: 20px;
  box-shadow: 0px 4px 10px 2px rgba(0,0,0,.1);
}
.main-head p {
  text-transform: uppercase;
  letter-spacing: 0.325rem;
  font-weight: 400;
  font-size: 0.8em;
  padding: 0 1.25em;
  margin: 0 0 2em 0;
}
.main-footer {
  left: 50%;
  bottom: 25px;
  margin-left: -11em;
  opacity: 1;
  outline: 0;
  padding-left: 0.225em;
  position: absolute;
  text-align: center;
  width: 22em;
  z-index: 1;
  text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.6);
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
.main-footer ul {
  display: inline-block;
  list-style: none;
  margin: 0 auto;
  padding: 0;
}
.main-footer ul li {
  list-style: none;
  padding: 0 6px 0 3px;
  margin: 0;
  float: left;
  color: #dedede;
  font-weight: 400;
  font-size: 0.8em;
}
.main-footer ul li::after {
  content: "";
  display: inline-block;
  height: 10px;
  width: 1px;
  background-color: #ccc;
  margin-left: 10px;
}
.main-footer ul li:last-child::after {
  display: none;
}
.main-footer-demos {
  position: absolute;
  display: inline-block;
  bottom: 25px;
  right: 95px;
}
.main-footer-demos .icon-keyboard {
  position: absolute;
  right: -70px;
  bottom: 0;
  display: block;
  width: 54px;
  height: 46px;
  fill: #fff;
}
.main-footer-demos .demo {
  display: inline-block;
  width: 17px;
  height: 17px;
  margin: 0 4px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}
.main-footer-demos .demo:hover,
.main-footer-demos .demo:focus {
  background-color: #6195ff;
  cursor: pointer;
}
.main-footer-demos a.demo-current {
  cursor: default;
  background-color: #6195ff;
}
.main-link {
  color: #dedede;
}
.main-link:hover,
.main-link:focus {
  color: #fff;
}
.more.sw.bottom {
  bottom: 55px;
  text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.6);
}
.main-hide-center {
  transform: scale(0.6);
  transition: none;
  opacity: 0;
  height: 0;
}
.main-show-center {
  transform: scale(1);
  transition: transform 0.5s, opacity 0.8s ease-in-out;
  opacity: 1;
}

.main-show-common{
  transition: height 1s, all 0.8s ease-in-out;
  opacity: 1;
  height: auto;
}
.main-hide-common{
  transition: all 0.8s ease-in-out;
  opacity: 0;
  height: 0;
}

.main-alone-text {
    border-radius: 15px;
    background-color: #6195ff;
    text-shadow: none;
    padding: 2px 10px;
}

.main-ufo {
  position: absolute;
  height: 225px;
  width: 300px;
  top: -55px;
  left: 50%;
  margin-left: -150px;
  z-index: -1;
  background-image: url(../assets/images/blocks/ufo-small.png);
  background-repeat: no-repeat;
}

.home-wrapper {
  overflow: hidden;
  overflow-y: scroll;
}
@media (min-width: 576px) {
  .home-wrapper::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  .home-wrapper::-webkit-scrollbar-thumb {
    background: #707070;
    border-radius: 3px;
  }
  .home-wrapper::-webkit-scrollbar-thumb:hover {
    background: #e0e0e0;
  }
  .home-wrapper::-webkit-scrollbar-track {
    background: transparent;
  }
  .home-wrapper {
    padding-bottom: 100px;
  }
  .aplayer-narrow.aplayer-fix-more-active .aplayer-pic {
    display: none;
  }
  .aplayer.aplayer-fixed.aplayer-narrow.aplayer-fix-more-active .aplayer-body {
    width: 0 !important;
  }
}
@media (max-width: 576px) {
  .main-head-desp .white-content {
    background-color: #fff;
    color: #000;
    padding: 20px;
    font-size: 14px;
  }
  .main-head-desp h2 {
    font-size: 2em;
  }
  .more.sw.bottom {
    top: unset;
    bottom: 3px;
  }
  .main-footer ul li {
    text-shadow: 10px 10px 50px #000;
  }
  .main-bottom-hidden {
    visibility: hidden;
  }
  #main-status {
    margin-top: 10px;
  }
  #main-btns {
    margin-top: 5px;
    margin-bottom: 25px;
  }
  .main-footer-demos {
    position: absolute;
    display: inline-block;
    bottom: 50px;
    right: unset;
    left: 50%;
    margin-left: -36px;
  }
  .main-footer-demos .icon-keyboard {
    display: none;
  }
  .main-footer-demos .demo {
    margin: 0 0.15em;
  }
}
</style>
