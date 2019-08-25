<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from "./store";

export default {
  methods: {
    // 数据列表、勾画权限查询
    getPerms() {
      this.$axios.get("/cmscp/datamanage/dataManage/perms").then(
        res => {
          if (res.data.status === 0) {
            this.$store.commit("SET_DATA_MANAGE_PERMS", res.data.data);
          } else {
            this.$message.error("权限查询失败");
          }
        },
        err => {
          this.$message.error("权限查询失败");
        }
      );
    }
  },
  created() {},
  mounted() {
    this.getPerms();
  }
};
</script>

<style lang="less">
@import "./styles/reset.less";
#app {
  width: 100%;
  height: 100%;
}
</style>
