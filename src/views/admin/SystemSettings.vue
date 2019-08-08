<template>
  <el-container>
    <el-header class="admin-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main v-if="currentUserHasPrivilege" class="better-scroll-white">
      <el-tabs v-model="currentTab" @tab-click="handleTabClick" :tabPosition="isMobileView ? 'top':'left'">
        <el-tab-pane label="通用设置" name="common">
           <el-form class="ml-3" :label-position="isMobileView ? 'top':'left'" label-width="80px" size="medium">
            <el-form-item label="站点标题">
              <el-input v-model="setSiteName"></el-input>
            </el-form-item>
            <el-form-item label="站点路径">
              <el-input v-model="setSiteAddress" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="页脚文字">
              <el-input v-model="setFooterText"></el-input>
            </el-form-item>
            <hr>
            <el-form-item>
              <el-button type="success" @click="saveSettings">保存修改</el-button>
              <el-button type="danger" @click="cancelChangeSettings">放弃修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="高级设置" name="more">
          <el-form class="ml-3" :label-position="isMobileView ? 'top':'left'" label-width="130px" size="medium">
            <el-form-item>
              <h5>系统用户操作</h5>
            </el-form-item>
            <hr>
            <el-form-item label="允许匿名用户评论">
              <el-switch v-model="setAnonymousComment" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="开放注册">
              <el-switch v-model="setAllowRegister" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item>
              <h5>用户数据收集</h5>
            </el-form-item>
            <hr>
            <el-form-item label="收集用户访问信息">
              <el-switch v-model="setCollectVisitorStat" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              <div class="text-secondary">关闭后，仪表盘中将不再获得用户访问数据</div>
            </el-form-item>
            <el-form-item label="用户访问信息排除页面路径">
              <el-table
                ref="setCollectVisitorStatExcludeTable"
                :data="setCollectVisitorStatExclude" tooltip-effect="dark"
                style="width: 100%">
                <el-table-column label="路径" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row }}</template>
                </el-table-column>
                <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteExcludeItem(scope.$index, tableData)" type="text" size="small">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>   
              <div style="margin-top: 20px">
                <el-button  @click="addExcludeItem()">添加</el-button>
              </div>
              <div class="text-secondary mt-2">填写您不想收集用户访问数据的页面路径，以绝对路径表示，例如 <span class="text-primary">/archoves/post/about</span> 是一个有效的路径。</div>
            </el-form-item>
            <el-form-item label="用户访问日志保留天数">
              <el-input-number v-model="setMaxStatSaveDays" :min="10" :max="365" label="用户访问日志保留天数"></el-input-number> 天
            </el-form-item>
            <hr>
            <el-form-item>
              <el-button type="success" @click="saveSettings">保存修改</el-button>
              <el-button type="danger" @click="cancelChangeSettings">放弃修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="查看系统日志" name="logs">
          <error-page v-if="sysLogLoadStatus.indexOf('error')==0" v-bind:error="sysLogLoadStatus" v-bind:height="'450px'" @retry="loadSystemLog"></error-page> 
          <el-table
            v-else
            ref="listSysLog"
            :data="sysLogData"
            tooltip-effect="dark"
            class="ml-3"
            style="width: 100%"
            v-loading="sysLogLoadStatus=='loading'"
          >
            <el-table-column prop="datetime" label="日志时间" width="185"></el-table-column>
            <el-table-column prop="userId" label="用户ID" width="80"></el-table-column>
            <el-table-column prop="userName" label="用户名字" width="185"></el-table-column>
            <el-table-column prop="ip" label="用户IP" width="150"></el-table-column>
            <el-table-column prop="action" label="操作"></el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-pagination
              class="btn-inline float-right"
              background
              layout="prev, pager, next"
              :page-count="sysLogPageAll"
              :current-page="sysLogPageCurrent"
              v-on:current-change="(p) =&gt; { loadSystemLog(p) }"
            ></el-pagination>每页显示：
            <el-select
              style="width:90px"
              v-model="sysLogPageSize"
              placeholder="请选择"
              @change="loadSystemLog"
              size="small"
            >
              <el-option
                v-for="item in sysLogSizeOpinions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-tab-pane>
        <el-tab-pane label="查看访问日志" name="vlogs">
          <error-page v-if="sysLogLoadStatus.indexOf('error')==0" v-bind:error="visitLoadStatus" v-bind:height="'450px'" @retry="loadVisitLog"></error-page> 
          <el-table
            v-else
            ref="listVisitorLog"
            :data="visitLogData"
            tooltip-effect="dark"
            class="ml-3"
            style="width: 100%"
            v-loading="visitLoadStatus=='loading'"
          >
            <el-table-column prop="id" label="ID" width="40"></el-table-column>
            <el-table-column prop="date" label="时间" width="100"></el-table-column>
            <el-table-column prop="count" label="访问数" width="70"></el-table-column>
            <el-table-column prop="url" label="访问路径"></el-table-column>
            
          </el-table>
          <div style="margin-top: 20px">
            <el-pagination
              class="btn-inline float-right"
              background
              layout="prev, pager, next"
              :page-count="visitPageAll"
              :current-page="visitPageCurrent"
              v-on:current-change="(p) =&gt; { loadVisitLog(p) }"
            ></el-pagination>每页显示：
            <el-select
              style="width:90px"
              v-model="visitPageSize"
              placeholder="请选择"
              @change="loadVisitLog"
              size="small"
            >
              <el-option
                v-for="item in sysLogSizeOpinions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统信息" name="about">
          <div class="ml-3">
            <h5>系统信息</h5>
            <span class="text-primary">系统版本</span> : {{ vSystemVersion }}<br/>
            <span class="text-primary">后端地址</span> : {{ vApiUrl }}<br/>
            <span class="text-primary">后端版本</span> : {{ vApiVersion }}<br/>
            <span class="text-primary">启动时间</span> : {{ vSystemStartupDay }}<br/>
            <span class="text-primary">运行天数</span> : {{ vSystemRunDay }}<br/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-main v-else>
      <div class="container" style="height:450px">
        <div class="box full text-center text-danger d-flex justify-content-center align-items-center flex-column">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 3.5em"></i>
          <p class="text-secondary mt-2">
            <span class="h4">您当前无权访问此页面</span>
            <br>您必须拥有 <span class="text-primary">修改系统设置</span> 权限，才能查看此页面。
          </p>
          <el-button type="primary" round @click="jump('/admin/')">返回主页</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Chart from "chart.js";
import serverConsts from '../../constants/serverConsts.js'
import toastSimply from '../../assets/lib/toast/toast.simply';

export default {
  name: "SystemSetting",
  data() {
    return {
      currentTab: 'common',
      currentUserIsAdmin: false,
      currentUserHasPrivilege: false,

      sysLogData: null,
      sysLogPageAll: 0,
      sysLogPageSize: 20,
      sysLogPageCurrent: 1,
      sysLogLoadStatus: "notload",
      sysLogSizeOpinions: [
        {
          value: 10,
          label: "10条"
        },
        {
          value: 20,
          label: "20条"
        },
        {
          value: 30,
          label: "30条"
        },
        {
          value: 50,
          label: "50条"
        },
        {
          value: 100,
          label: "100条"
        }
      ],

      visitLogData: null,
      visitPageAll: 0,
      visitPageSize: 20,
      visitPageCurrent: 1,
      visitLoadStatus: "notload",

      setSiteName: '',
      setSiteAddress: '',
      setFooterText: '',
      setCollectVisitorStat: true,
      setCollectVisitorStatExclude: [],
      setAllowRegister: false,
      setAnonymousComment: false,
      setMaxStatSaveDays: 30,

      setLoaded: false,
      collectVisitorStatExcludeSelectItems: null,

      vLoaded: false,
      vSystemVersion: '',
      vApiUrl: '',
      vApiVersion: '正在获取...',
      vSystemRunDay: '正在获取...',
      vSystemStartupDay: '正在获取...',
    };
  },
  computed: {
    isMobileView: function(){
      return document.body.clientWidth < 768;
    },
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
      this.loadSettings();
    },
    jump(link) {
      location.href = this.getJumpRealUrl(link);
    },
    getJumpRealUrl(link) {
      return this.NET.URL_PREFIX + link;
    },
    authInfoInited(authed) {
      if(authed){ 
        this.currentUser = this.$store.getters["auth/authInfo"];
        if(this.currentUser) this.currentUserIsAdmin = this.currentUser.level == serverConsts.UserLevels.admin;
        this.currentUserHasPrivilege = this.Utils.getUserHasPrivilege(this.currentUser, serverConsts.UserPrivileges.globalSettings);
      }
    },

    //Events

    handleTabClick(){
      if(this.currentTab=='logs'&&this.sysLogLoadStatus=='notload')
        this.loadSystemLog();
      if(this.currentTab=='vlogs'&&this.visitLoadStatus=='notload')
        this.loadVisitLog();
      if(this.currentTab=='common' || this.currentTab=='more' &&!this.setLoaded)
        this.loadSettings();
      if(this.currentTab=='about' &&!this.vLoaded)
        this.loadSysInfo();
    },

    addExcludeItem(){
      this.$prompt('请输入要排除的路径', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.setCollectVisitorStatExclude.push(value);
      }).catch(() => {});
    },
    deleteExcludeItem(index, row){
      this.$confirm('删除此条目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setCollectVisitorStatExclude.pop(row);
      }).catch(() => {});
    },

    //Data

    loadSystemLog(p) {
      if(p) this.sysLogPageCurrent = p;
      this.sysLogLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/stat/oplog/" +
        (this.sysLogPageCurrent - 1) +
        "/" +
        this.sysLogPageSize;
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.sysLogData = response.data.data.content;
            this.sysLogPageAll = response.data.data.totalPages;
            this.sysLogLoadStatus = "loaded";
          } else
            this.sysLogLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.sysLogLoadStatus = "error:" + response;
        });
    },
    loadVisitLog(p) {
      if(p) this.visitPageCurrent = p;
      this.visitLoadStatus = "loading";
      var url =
        this.NET.API_URL +
        "/stat/daylog/" +
        (this.visitPageCurrent - 1) +
        "/" +
        this.visitPageSize;
      this.axios
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.visitLogData = response.data.data.content;
            this.visitPageAll = response.data.data.totalPages;
            this.visitLoadStatus = "loaded";
          } else
            this.visitLoadStatus = "error:" + response.data.message;
        })
        .catch(response => {
          this.visitLoadStatus = "error:" + response;
        });
    },
    loadSettings(){
      this.setLoaded = true;
      this.setSiteName = serverSettings.SiteTitle;
      this.setSiteAddress = location.origin;
      this.setFooterText = serverSettings.FooterText;
      this.setCollectVisitorStat = serverSettings.CollectVisitorStat;
      this.setCollectVisitorStatExclude = this.Utils.clone(serverSettings.CollectVisitorStatExclude);
      this.setAllowRegister = serverSettings.AllowRegister;
      this.setAnonymousComment = serverSettings.AnonymousComment;
      this.setMaxStatSaveDays = serverSettings.MaxStatSaveDays;
    },
    loadSysInfo(){
      this.vLoaded = true;
      this.vApiUrl = this.NET.API_URL;
      this.vSystemVersion = this.NET.ClientVersion;
      this.axios.get(this.NET.API_URL + '/version').then((response) => {
        if(response.data.success) this.vApiVersion = response.data.data;
        else this.vApiVersion = '获取失败';
      }).catch(() => { this.vApiVersion = '获取失败'; });
      this.axios.get(this.NET.API_URL + '/stat/runDay').then((response) => {
        if(response.data.success){ 
          this.vSystemStartupDay = response.data.data.startupDate;
          this.vSystemRunDay = response.data.data.runDay + ' 天';
        }
        else {
          this.vSystemRunDay = '获取失败';
          this.vSystemStartupDay ='获取失败';
        }
      }).catch(() => { this.vSystemRunDay = '获取失败';this.vSystemStartupDay ='获取失败'; });


    },

    //保存设置
    saveSettings(){
      this.$confirm('确定保存修改?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => { 
        var newSettings = {
          SiteTitle: this.setSiteName,
          FooterText: this.setFooterText,
          CollectVisitorStat: this.setCollectVisitorStat,
          CollectVisitorStatExclude: this.setCollectVisitorStatExclude,
          AllowRegister: this.setAllowRegister,
          AnonymousComment: this.setAnonymousComment,
          MaxStatSaveDays: this.setMaxStatSaveDays,
        };
        this.axios.put(this.NET.API_URL + '/settings.json', newSettings).then((response) => {
          if(response.data.success) {
            toastSimply.toast('修改设置成功', 'success', 3000);
            window.serverSettings = newSettings;
          }
          else toastSimply.toast('修改设置失败！' + response.data.message,'error',6000);
        }).catch((response) => {
          toastSimply.toast('修改设置失败！' + response,'error',6000);
        });
      }).catch(() => {});
    },
    cancelChangeSettings(){
      this.$confirm('确定删放弃您的修改?', '提示', {
        confirmButtonText: '放弃',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { this.loadSettings(); }).catch(() => {});
    },
  }
};
</script>
