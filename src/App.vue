<template>
  <div id="app">
    <div class="header">
      <div class="header-left">
        <i
          class="el-icon-s-fold"
          v-show="!isCollapse"
          @click="handlePanel()"
        ></i>
        <i
          class="el-icon-s-unfold"
          v-show="isCollapse"
          @click="handlePanel()"
        ></i>
      </div>
      <div class="header-right"></div>
    </div>
    <div class="content">
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="currentPath"
        @select="handleSelect"
        :collapse="isCollapse"
      >
        <el-menu-item index="list">
          <i class="el-icon-files"></i>
          <span slot="title">列表</span>
        </el-menu-item>
        <el-menu-item index="sketch">
          <i class="el-icon-edit"></i>
          <span slot="title">勾画</span>
        </el-menu-item>
        <el-menu-item index="version">
          <div class="menu-active"></div>
          <i class="el-icon-document"></i>
          <span slot="title">AI</span>
        </el-menu-item>
      </el-menu>
      <div class="main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import store from "./store";

export default {
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    currentPath: function() {
      return this.$route.path.split("/")[1];
    }
  },
  methods: {
    handlePanel() {
      this.isCollapse = !this.isCollapse;
    },
    handleSelect(key, keyPath) {
      this.$router.push({
        path: "/" + key
      });
    },
    getUserInfo() {
      this.$axios
        .get("/msci/cmscp/datamanage/current/user")
        .then(res => {
          if (res.data.status === 0) {
            this.$store.commit("SET_USERINFO", res.data.data);
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(err => {});
    }
  },
  created() {},
  mounted() {
    this.getUserInfo();
  }
};
</script>

<style lang="less">
@import "./styles/reset.less";
#app {
  position: relative;
  width: 100%;
  height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 64px;
    padding: 0 16px 0 27px;
    background-color: #409eff;
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    .header-left {
      display: flex;
      align-items: center;
    }
    .header-right {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .content {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    .el-menu {
      height: 100%;
      border-right: none !important;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 4px 0px rgba(202, 202, 202, 0.5);
    }
    .menuicon {
      margin-left: 2px;
      color: #666666 !important;
      font-size: 20px;
    }
    .main {
      overflow: auto;
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 10px 20px 20px;
      background-color: #f4f5f6;
    }
  }
}
</style>
