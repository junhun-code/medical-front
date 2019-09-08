<template>
  <div class="record-table">
    <el-table
      ref="multipleTable"
      :data="recordList"
      :height="tableHeight"
      v-loading="loading"
      border
      stripe
      tooltip-effect="dark"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45" fixed></el-table-column>
      <el-table-column prop="id" label="序号" width="60"></el-table-column>
      <el-table-column prop="status" label="状态" width="120"></el-table-column>
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
        prop="hospitalName"
        label="医院名称"
        width="130"
      ></el-table-column>
      <el-table-column prop="hospitalId" label="医院编号"></el-table-column>
      <el-table-column prop="checkPosition" label="检查部位"></el-table-column>
      <el-table-column prop="patientId" label="患者编号"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名"></el-table-column>
      <el-table-column prop="patientSex" label="性别"></el-table-column>
      <el-table-column prop="patientAge" label="年龄"></el-table-column>
      <el-table-column
        prop="checkId"
        label="检查号"
        width="130"
      ></el-table-column>
      <el-table-column
        prop="mediaId"
        label="具体检查影像"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="trainVersion"
        label="训练版本"
        width="80"
      ></el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="openSketchPage(scope.row)"
            >查看</el-button
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
  props: ["recordList", "loading"],
  data() {
    return {
      tableHeight: 0,
      multipleSelection: []
    };
  },
  components: {},
  filters: {
    dateFormat(value) {
      if (value) {
        return dayjs(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
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
      this.$store.commit("SET_SELECTED_RECORDS", this.multipleSelection);
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
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 45; // 45表示你想要调整的表格距离底部的高度（你可以自己随意调整），因为我们一般都有放分页组件的，所以需要给它留一个高度

      // 监听窗口大小变化
      // 表格距离浏览器的高度
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 45;
      };
    });
    //thi
  }
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
