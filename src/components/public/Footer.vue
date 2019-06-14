<template>
  <footer :id="footerStyle == 'normal' ? 'footer' : ''">
    <div v-if="footerStyle == 'small'" class="row align-items-center justify-content-center mt-3">
      <p class="text-secondary">Copyright © 2019 Dreamfish.</p>
    </div>
    <div v-else-if="footerStyle == 'normal'">
      <ul class="icons">
        <li>
          <a
            href="#"
            style="color:rgb(33,143,235)"
            id="footer_qq"
            class="icon fa fa-qq"
            data-original-title
            title
          >
            <span class="label">我的 QQ</span>
          </a>
        </li>
        <li>
          <a
            href="../assets/images/mmqrcode1543412167834.jpg"
            style="color:rgb(0,184,4)"
            id="footer_weixin"
            class="icon fa fa-weixin"
            data-original-title
            title
          >
            <span class="label">我的微信</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/717021"
            style="color:#000"
            id="footer_github"
            class="icon fa fa-github"
          >
            <span class="label">我的 Github</span>
          </a>
        </li>
      </ul>
      <ul class="copyright">
        <li>
          <i class="fa fa-copyright" aria-hidden="true"></i> 2019. All rights reserved
        </li>
        <li>
          Design by
          <a class="link" href="https://www.imyzc.com/archives/post/about/">DreamFish</a>
        </li>
      </ul>
      <ul class="copyright copyright-line">
        <li>
          <a
            href="javascript:void(0)"
            target="_blank"
            class="badge badge-pill badge-dark"
            @click="compatibilityDialogShow=true"
          >推荐使用 Microsoft Edge 或 Chrome 浏览器浏览本页面</a>
        </li>
      </ul>
      <ul class="copyright">
        <li>
          <a class="link" href="https://www.miitbeian.gov.cn">浙ICP备18051956号-1</a>
        </li>
        <li>
          <a
            class="jgwab"
            target="_blank"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33080202000390"
          >
            <p>
              <i></i>浙公网安备 33080202000390号
            </p>
          </a>
        </li>
      </ul>
    </div>
    <el-tooltip class="item" effect="dark" content="返回顶部" placement="left">
      <a
        href="javascript:;"
        @click="backToTop()"
        :class="'go-top' + (backToTopShow ? ' show' : '')"
        title="返回顶部"
      >
        <i class="fa fa-angle-up"></i>
      </a>
    </el-tooltip>
    <el-dialog title="浏览器兼容性说明" :visible.sync="compatibilityDialogShow" class="dialog-auto-width">
      <span>我们网站的 CSS 和 JS 是基于最新的现代浏览器设计的。因此我们无法保证网页在低版本浏览器上能够正常显示运行，我们建议您升级到浏览器最新版本，以获得最佳的阅读体验。</span>
      <div class="caniuse-header mt-3">
        <h4>浏览器兼容详情</h4>
      </div>
      <div class="caniuse-section">
        <h5>桌面</h5>
        <table class="browser-support-table">
          <thead>
            <tr>
              <th class="chrome">
                <span>Chrome</span>
              </th>
              <th class="opera">
                <span>Opera</span>
              </th>
              <th class="firefox">
                <span>Firefox</span>
              </th>
              <th class="ie">
                <span>IE</span>
              </th>
              <th class="edge">
                <span>Edge</span>
              </th>
              <th class="safari">
                <span>Safari</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                class="a yep"
                title="<b>Google Chrome</b><br/>最低支持 Chrome 29 版本<br/>推荐使用 Chrome 72+ 版本"
                data-browser-name="Chrome"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">29 / 72+</span>
              </td>
              <td
                class="a yep-nope"
                title="<b>Opera</b><br/>最低支持 Opera 15 版本<br/>推荐使用 Opera 57+ 版本"
                data-browser-name="Opera"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">15 / 57+</span>
              </td>
              <td
                class="a yep-nope"
                title="<b>Firefox</b><br/>最低支持 Firefox 28 版本<br/>推荐使用 Firefox 65+ 版本"
                data-browser-name="Firefox"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">28 / 65+</span>
              </td>
              <td
                class="a nope"
                title="<b>Internet Explorer</b><br/><i class='fa fa-exclamation-triangle'></i> Internet Explorer 不受支持，未来也不会支持"
                data-toggle="tooltip"
                data-html="true"
                data-placement="top"
                data-browser-name="IE"
              >
                <span class="caniuse-agents-version version">
                  <i class="fa fa-times mr-2"></i>不支持
                </span>
              </td>
              <td
                class="n yep"
                title="<b>Microsoft Edge</b><br/>基本支持<br/>推荐使用最新版本"
                data-browser-name="Edge"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">12 / 18+</span>
              </td>
              <td
                class="a yep-nope"
                title="<b>Safari</b><br/>最低支持 Safari 12 版本<br/>推荐使用最新版本"
                data-browser-name="Safari"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">12 / TP</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="caniuse-section">
        <h5>移动 / 平板</h5>
        <table class="browser-support-table">
          <thead>
            <tr>
              <th class="ios_saf">
                <span>iOS Safari</span>
              </th>
              <th class="op_mob">
                <span>Opera Mobile</span>
              </th>
              <th class="op_mini">
                <span>Opera Mini</span>
              </th>
              <th class="android">
                <span>Android</span>
              </th>
              <th class="and_chr">
                <span>Android Chrome</span>
              </th>
              <th class="and_ff">
                <span>Android Firefox</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                class="a yep"
                title="<b>iOS Safari</b><br/>最低支持 Safari & Chrome for iOS 9.0 版本<br/>推荐使用 Safari & Chrome for iOS 12.1+ 版本"
                data-browser-name="iOS Safari"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">9 / 12.1+</span>
              </td>
              <td
                class="a yep-nope"
                title="<b>Opera Mobile</b><br/>最低支持 Opera Mobile 12.1 版本<br/>推荐使用 Opera Mobile 46+ 版本"
                data-browser-name="Opera Mobile"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">12.1 / 46+</span>
              </td>
              <td
                class="n unknow"
                title="<b>Opera Mini</b><br/>未知支持情况"
                data-browser-name="Opera Mini"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">
                  <i class="fa fa-question"></i>
                </span>
              </td>
              <td
                class="a yep"
                title="<b>Android 5-6.x WebView: Chromium 67</b><br/>最低支持 Android 4.4 browser<br/>推荐使用 Android 5-6.x WebView: Chromium 67"
                data-browser-name="Android"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">67+</span>
              </td>
              <td
                class="a yep-nope"
                title="<b>Android Chrome</b><br/>最低支持 Android Chrome 71+ 版本<br/>推荐使用最新版本"
                data-browser-name="Android Chrome"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">71+</span>
              </td>
              <td
                class="n yep-nope"
                title="<b>Android Firefox</b><br/>推荐使用 Android Firefox 64 版本"
                data-browser-name="Android Firefox"
                data-toggle="tooltip"
                data-placement="top"
                data-html="true"
              >
                <span class="caniuse-agents-version version">64+</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="compatibilityDialogShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </footer>
</template>

<script>
import { mapState } from "vuex";
import jQuery from "jquery";

export default {
  name: "Footer",
  data() {
    return {
      backToTopShow: false,
      compatibilityDialogShow: false
    };
  },
  computed: mapState({
    footerStyle: state => state.global.globalFooterStyle
  }),
  watch: {
    compatibilityDialogShow(to, from){
      setTimeout(function(){
        jQuery('[data-toggle="tooltip"]').tooltip()
      }, 1000)
    },
  },
  mounted() {
    window.addEventListener("scroll", this.watchScroll);
  },
  methods: {
    backToTop() {
      jQuery("html, body").animate({ scrollTop: 0 }, 300);
    },
    watchScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.backToTopShow = scrollTop > 200;
    }
  }
};
</script>

<style>
.dialog-auto-width .el-dialog {
  width: 50%;
}
@media (max-width: 425px) {
  .dialog-auto-width .el-dialog {
    width: 90%;
  }
}

.tooltip {
  z-index: 3000;
}
.caniuse {
  font-size: 0.8rem;
  background: #fffaf2;
  padding: 1.5rem;
  margin: 0;
  border-radius: 8px;
}
.caniuse .caniuse-section:last-child {
  margin-top: 1rem;
}
.caniuse h4 {
  font-size: 1.1rem;
  padding-top: 0;
  margin: 2rem 0 0.5rem 0;
}

.browser-support-table {
  border-collapse: separate !important;
  border-spacing: 0.25rem !important;
  width: 100%;
  margin: 0 0 1rem 0;
  table-layout: fixed;
  font-size: 0.75rem;
}
.browser-support-table tr {
  background: 0 0 !important;
}
.browser-support-table th {
  background: #ffdfaa;
  color: #201c29 !important;
  border: 0 !important;
  position: relative;
  line-height: 1.1;
  vertical-align: top;
  border-radius: 4px;
  padding: 1rem !important;
}
.browser-support-table th::before {
  content: "";
  display: block;
  margin: 0 auto 0.5rem;
  width: 32px;
  height: 32px;
  background-size: contain;
}

.browser-support-table th.chrome::before {
  background-image: url(../../assets/images/icon/browser-logos/chrome_64x64.png);
}
.browser-support-table th.opera::before {
  background-image: url(../../assets/images/icon/browser-logos/opera_15-32_64x64.png);
}
.browser-support-table th.firefox::before {
  background-image: url(../../assets/images/icon/browser-logos/firefox_64x64.png);
}
.browser-support-table th.ie::before {
  background-image: url(../../assets/images/icon/browser-logos/internet-explorer_9-11_64x64.png);
}
.browser-support-table th.edge::before {
  background-image: url(../../assets/images/icon/browser-logos/edge_64x64.png);
}
.browser-support-table th.safari::before {
  background-image: url(../../assets/images/icon/browser-logos/safari_64x64.png);
}

.browser-support-table th.iOS::before,
.browser-support-table th.ios::before,
.browser-support-table th.ios_saf::before {
  background-image: url(../../assets/images/icon/browser-logos/safari_64x64.png);
}
.browser-support-table th.op_mini::before,
.browser-support-table th.op_mob::before {
  background-image: url(../../assets/images/icon/browser-logos/opera_15-32_64x64.png);
}
.browser-support-table th.android::before {
  background-image: url(../../assets/images/icon/browser-logos/android-webview-beta_64x64.png);
}
.browser-support-table th.and_chr::before {
  background-image: url(../../assets/images/icon/browser-logos/chrome_64x64.png);
}
.browser-support-table th.and_ff::before {
  background-image: url(../../assets/images/icon/browser-logos/firefox_64x64.png);
}

.browser-support-table td,
.browser-support-table th {
  text-align: center !important;
  padding: 0.5rem;
  border-top: 0 !important;
  font-weight: 700;
  border-radius: 4px;
}

.browser-support-table .yep {
  background: #4ec552;
  color: #fff;
}
.browser-support-table .nope {
  background: #ff4059;
  color: #fff;
}
.browser-support-table .yep-nope {
  background: #ffa100;
  color: #fff;
}
.browser-support-table .unknow {
  background: #b3b3b3;
  color: #fff;
}

@media (max-width: 1024px) {
  .browser-support-table,
  .browser-support-table tbody,
  .browser-support-table th,
  .browser-support-table tr {
    display: block;
  }
  .browser-support-table thead {
    display: none;
  }
  .browser-support-table tr {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .browser-support-table td {
    border-radius: 4px;
    border: 0 !important;
    margin: 0 5px 5px 0;
  }
  .browser-support-table td::before {
    color: #222;
    content: attr(data-browser-name) ": ";
  }
}
</style>