<template>
  <div class="tool-bar">
    <el-button-group>
      <el-tooltip class="item" effect="dark" content="导入" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-upload2"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="导出" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-download"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="任务" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-s-order"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="筛选" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-set-up"
        ></el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "tool-bar",
  props: [],
  data() {
    return {
      showScreeningModal: false
    };
  },
  components: {},
  methods: {},
  created() {}
};
</script>

<style lang="less" scoped>
.tool-bar {
}
</style>
