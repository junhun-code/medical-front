<template>
  <div class="list-container">
    <div class="head-info">
      <tool-bar></tool-bar>
      <div class="progress-wrap">
        <span>任务共1000例，完成进度</span>
        <div class="progress">
          <el-progress :percentage="80"></el-progress>
        </div>
      </div>
    </div>
    <div class="list-table">
      <record-table :record-list="recordList" />
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import toolBar from "./components/toolBar";
import recordTable from "./components/recordTable";
import { mapState } from "vuex";
export default {
  data() {
    return {
      recordList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  computed: {
    ...mapState(["listPerms"])
  },
  components: {
    toolBar,
    recordTable
  },
  methods: {
    // 数据列表、勾画权限查询
    getPerms() {
      this.$axios.get("/jspxcms/dataManage/perms").then(
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
    },
    getFileRecordList() {
      let formVal = {
        current: this.currentPage,
        size: this.pageSize
      };
      this.$axios
        .post("/jspxcms/cmscp/datamanage/fileRecord/list", formVal)
        .then(
          res => {
            if (res.data.status === 0) {
              this.recordList = res.data.data.content;
              this.total = res.data.data.totalElements;
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getFileRecordList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getFileRecordList();
    }
  },
  created() {
    this.getPerms();
    this.getFileRecordList();
  }
};
</script>

<style lang="less" scoped>
.list-container {
  .head-info {
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
    .el-pagination {
      float: right;
      margin: 5px 0;
    }
  }
}
</style>
