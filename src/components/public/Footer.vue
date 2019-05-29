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
            href="#"
            target="_blank"
            class="badge badge-pill badge-dark"
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
            href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33080202000390"
          >
            <p>
              <i></i>浙公网安备 33080202000390号
            </p>
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  props: ["footerStyle"],
  name: "Footer",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
</style>