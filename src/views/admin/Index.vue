<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="better-scroll-white">
      <div>
        <div class="row">
          <div class="col-sm-6 col-md-3 col-lg-3 number">
            <el-card class="box-card" shadow="never">
              <p class="text-secondary">今日 PV / 昨日 PV</p>
              <span
                v-if="statData"
                class="text-black"
              >{{ statData.pvToday + ' / ' + statData.pvYesterday }}</span>
              <span v-else class="text-warning">无数据</span>
            </el-card>
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3 number">
            <el-card class="box-card" shadow="never">
              <p class="text-secondary">今日 IP / 昨日 IP</p>
              <span
                v-if="statData"
                class="text-black"
              >{{ statData.ipToday + ' / ' + statData.ipYesterday }}</span>
              <span v-else class="text-warning">无数据</span>
            </el-card>
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3 number">
            <el-card class="box-card" shadow="never">
              <p class="text-secondary">新评论 / 昨日评论</p>
              <span
                v-if="statData"
                class="text-black"
              >{{ statData.commentToday + ' / ' + statData.commentYesterday }}</span>
              <span v-else class="text-warning">无数据</span>
            </el-card>
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3 number">
            <el-card class="box-card" shadow="never">
              <p class="text-secondary">用户数 / 作者数</p>
              <span
                v-if="statData"
                class="text-black"
              >{{ statData.visitorCount + ' / ' + statData.authorCount }}</span>
              <span v-else class="text-warning">无数据</span>
            </el-card>
          </div>
        </div>
      </div>
      <el-card class="box-card mt-4">
        <div slot="header" class="clearfix"><span>近一月浏览量走势</span></div>
        <canvas v-if="dayLog" id="chartDayLog" style="width:100%; height:200px;"></canvas>
        <div v-else class="text-secondary text-center mt2 mb-2">无数据</div>
      </el-card>
      <div class="mt-4">
        <div class="row">
          <div class="col-sm-12 col-lg-6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>TOP 10 浏览文章</span>
              </div>
              <el-table :data="topTenArchives" style="width: 100%">
                <el-table-column prop="title" label="名称"></el-table-column>
                <el-table-column prop="viewCount" label="查看数" width="70"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleTopArcEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" @click="handleTopArcView(scope.$index, scope.row)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
          <div class="col-sm-12 col-lg-6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>今日 TOP 10 访问页面</span>
              </div>
              <el-table :data="topTenPage" style="width: 100%">
                <el-table-column prop="url" label="URL"></el-table-column>
                <el-table-column prop="count" label="查看数" width="70"></el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Chart from "chart.js";
import serverConsts from '../../constants/serverConsts.js'

export default {
  name: "AdminIndex",
  data() {
    return {
      contentLoadStatus: "",
      content: null,

      statLoad: false,
      statData: null,
      dayLog: null,
      topTenPage: null,
      topTenArchives: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.$store.dispatch("global/resetHeader");
      this.$store.dispatch("global/setAdminPanel", true);
      this.$store.dispatch("global/switchFooter", false);
      this.$store.dispatch("global/setHeaderMenuStyle", "main-menu-white full");
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    authInfoInited(authed) {
      if(authed) this.loadStatSimple();
    },
    loadStatSimple() {
      if (this.statLoad) return;
      this.statLoad = true;
      this.axios.get(this.NET.API_URL + "/stat").then((response) => {
        if (response.data.success) this.statData = response.data.data;
      });
      this.axios.get(this.NET.API_URL + "/stat/daylog").then((response) => {
        if (response.data.success) {
          this.dayLog = response.data.data;
          setTimeout(this.loadStatDayLogChart, 1000);
        }
      });
      this.axios.get(this.NET.API_URL + "/stat/topPage?maxCount=10").then((response) => {
        if (response.data.success) this.topTenPage = response.data.data;
      });
      this.axios.get(this.NET.API_URL + "/stat/topPost?maxCount=10").then((response) => {
        if (response.data.success) this.topTenArchives = response.data.data;
      });
    },
    loadStatDayLogChart() {
      var labels = [];
      var datasPv = [];
      var datasIp = [];
      var datasComment = [];
      var main = this;

      for (var key in main.dayLog) {
        labels.push(main.dayLog[key].date);
        datasPv.push(main.dayLog[key].pv);
        datasIp.push(main.dayLog[key].ip);
        datasComment.push(main.dayLog[key].comment);
      }

      var ctx = document.getElementById("chartDayLog").getContext("2d");
      var myLineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "当日的评论数",
              data: datasComment,
              backgroundColor: ["rgba(138, 195, 73, 0.2)"],
              borderColor: ["rgba(76, 175, 80, 1)"],
              borderWidth: 1
            },
            {
              label: "当日访客数（基于IP）",
              data: datasIp,
              backgroundColor: ["rgba(33, 148, 242, 0.2)"],
              borderColor: ["rgba(33, 148, 242, 1)"],
              borderWidth: 1
            },
            {
              label: "当日页面查看数（PageView）",
              data: datasPv,
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 1
            }
          ]
        }
      });
    },
    handleTopArcEdit(index, row) {
      var newUrl = this.Utils.getJumpRealUrl(serverConsts.PartPositions.editArchive + '?archive=' + row.id);
      window.open(newUrl);
    },
    handleTopArcView(index, row) {
      window.open(this.Utils.getPostRealUrl(row));
    },

  }
};
</script>