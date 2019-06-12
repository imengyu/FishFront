<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px; padding: 24px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="better-scroll-white">
      <div class="box">
        <div class="row">
          <div class="col-sm-6 col-md-3 col-lg-3 number">
            <p class="text-secondary">今日 PV / 昨日 PV</p>
            <span
              v-if="statData"
              class="text-black"
            >{{ statData.pvToday + ' / ' + statData.pvYesterday }}</span>
            <span v-else class="text-warning">无数据</span>
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3 number">
            <p class="text-secondary">今日 IP / 昨日 IP</p>
            <span
              v-if="statData"
              class="text-black"
            >{{ statData.ipToday + ' / ' + statData.ipYesterday }}</span>
            <span v-else class="text-warning">无数据</span>
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3 number">
            <p class="text-secondary">新评论 / 昨日评论</p>
            <span
              v-if="statData"
              class="text-black"
            >{{ statData.commentToday + ' / ' + statData.commentYesterday }}</span>
            <span v-else class="text-warning">无数据</span>
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3 number">
            <p class="text-secondary">用户数 / 作者数</p>
            <span
              v-if="statData"
              class="text-black"
            >{{ statData.visitorCount + ' / ' + statData.authorCount }}</span>
            <span v-else class="text-warning">无数据</span>
          </div>
        </div>
      </div>
      <div class="box p-4 mt-5">
        <h5 class="box-title no-underline">近一月浏览量走势</h5>
        <canvas v-if="dayLog" id="chartDayLog" style="width:100%; height:200px;"></canvas>
        <div v-else class="text-secondary text-center mt2 mb-2">无数据</div>
      </div>
      <div class="box p-4 mt-5">
        <el-row>
          <el-col :span="12">
            <h5>TOP 10 浏览文章</h5>
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
          </el-col>
          <el-col :span="12">
            <h5>今日 TOP 10 访问页面</h5>
            <el-table :data="topTenPage" style="width: 100%">
              <el-table-column prop="url" label="URL"></el-table-column>
              <el-table-column prop="count" label="查看数" width="70"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import jQuery from "jquery";
import Chart from "chart.js";
import serverConsts from '../../constants/serverConsts.js'

var $ = jQuery;

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
      var main = this;
      if (main.statLoad) return;
      main.statLoad = true;
      jQuery.ajax({
        type: "get",
        url: main.NET.API_URL + "/stat",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) main.statData = response.data;
        }
      });
      jQuery.ajax({
        type: "get",
        url: main.NET.API_URL + "/stat/daylog",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) {
            main.dayLog = response.data;
            setTimeout(main.loadStatDayLogChart, 1000);
          }
        }
      });
      jQuery.ajax({
        type: "get",
        url: main.NET.API_URL + "/stat/topPage?maxCount=10",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) main.topTenPage = response.data;
        }
      });
      jQuery.ajax({
        type: "get",
        url: main.NET.API_URL + "/stat/topPost?maxCount=10",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        success: function(response) {
          if (response.success) main.topTenArchives = response.data;
        }
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
      var newUrl = this.Utils.getJumpRealUrl(serverConsts.PartPositions.editArchive + '?post=' + row.id);
      window.open(newUrl);
    },
    handleTopArcView(index, row) {
      window.open(this.Utils.getPostRealUrl(row));
    },

  }
};
</script>