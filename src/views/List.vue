<template>
  <div class="list-container">
    <div class="tool-bar">
      <el-button-group>
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-share"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
      </el-button-group>
    </div>
    <div class="list-table"></div>
  </div>
</template>

<script>
export default {
  name: 'list',
  components: {
  }
}
</script>

<style lang="less" scoped>
  .list-container {
    .tool-bar {
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .list-table {

    }
  }
</style>