<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from "./store";

export default {
  methods: {
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
  width: 100%;
  height: 100%;
}
</style>
