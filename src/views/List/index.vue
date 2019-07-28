<template>
  <div class="list-container">
    <div class="tool-bar">
      <el-button-group>
        <el-tooltip
          class="item"
          effect="dark"
          content="导入"
          placement="bottom"
        >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-upload2"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="导出"
          placement="bottom"
        >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-download"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="任务"
          placement="bottom"
        >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-s-order"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="筛选"
          placement="bottom"
        >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-set-up"
          ></el-button>
        </el-tooltip>
      </el-button-group>
      <div class="progress-wrap">
        <span>任务共1000例，完成进度</span>
        <div class="progress">
          <el-progress
            :text-inside="true"
            :stroke-width="22"
            :percentage="80"
          ></el-progress>
        </div>
      </div>
    </div>
    <div class="list-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="日期" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "list",
  data() {
    return {
      recordList: [],
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: []
    };
  },
  components: {},
  methods: {
    getFileRecordList() {
      let formVal = {};
      this.$axios.post("/fileRecord/list", formVal).then(
        res => {
          if (res.data.success) {
            this.recordList = res.data.data;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  created() {
    this.getFileRecordList();
  }
};
</script>

<style lang="less" scoped>
.list-container {
  .tool-bar {
    padding: 10px 50px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .progress-wrap {
      display: flex;
      align-items: center;
      span {
        margin-right: 10px;
      }
      .progress {
        width: 300px;
      }
    }
  }
  .list-table {
    padding: 10px 50px;
  }
}
</style>
