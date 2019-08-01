<template>
  <div class="sketch-container">
    <div class="head-info">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-edit"></el-button>
        <el-button type="primary" size="small" icon="el-icon-share"></el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-delete"
        ></el-button>
      </el-button-group>
      <el-button-group>
        <el-button>确认</el-button>
        <el-button>驳回</el-button>
        <el-button>审核</el-button>
      </el-button-group>
    </div>
    <div class="fabric-wrap">
      <fabric></fabric>
    </div>
  </div>
</template>

<script>
import fabric from "./components/fabric";
export default {
  data() {
    return {};
  },
  components: {
    fabric
  },
  methods: {},
  created() {}
};
</script>

<style lang="less" scoped>
.sketch-container {
  .head-info {
    padding: 10px 50px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
