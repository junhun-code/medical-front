<template>
  <div class="record-table">
    <el-table
      ref="multipleTable"
      :data="recordList"
      border
      stripe
      tooltip-effect="dark"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45" fixed></el-table-column>
      <el-table-column prop="id" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="状态" width="120"></el-table-column>
      <el-table-column prop="importName" label="入库人员"></el-table-column>
      <el-table-column label="入库时间" width="100">
        <template slot-scope="scope">{{
          scope.row.importTime | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="sketchName" label="处理人员"></el-table-column>
      <el-table-column label="勾画时间" width="100">
        <template slot-scope="scope">{{
          scope.row.sketchTime | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="auditorName" label="审核人员"></el-table-column>
      <el-table-column label="审核时间" width="100">
        <template slot-scope="scope">{{
          scope.row.auditTime | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column
        prop="fileType"
        label="数据格式"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="trainVersion"
        label="训练版本"
        width="80"
      ></el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="openSketchPage(scope.row)"
            >勾画</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "record-table",
  props: ["recordList"],
  data() {
    return {
      multipleSelection: []
    };
  },
  components: {},
  filters: {
    dateFormat(value) {
      return dayjs(value).format("YYYY-MM-DD");
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    openSketchPage(item) {
      const { href } = this.$router.resolve({
        name: "sketch",
        query: {
          fileRecordId: item.id,
          fileUuid: item.fileUuid
        }
      });
      window.open(href, "_blank");
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.record-table {
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
}
</style>
