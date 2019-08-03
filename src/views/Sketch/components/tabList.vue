<template>
  <div class="tab-list">
    <el-tabs type="border-card">
      <el-tab-pane label="数据">数据</el-tab-pane>
      <el-tab-pane label="审核">审核</el-tab-pane>
      <el-tab-pane label="驳回">驳回</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "tab-list",
  data() {
    return {};
  },
  components: {},
  methods: {},
  created() {}
};
</script>

<style lang="less" scoped>
.tab-list {
}
</style>
