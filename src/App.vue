<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from "./store";

export default {
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style lang="less">
@import "./styles/reset.less";
#app {
  width: 100%;
  height: 100%;
}
</style>
