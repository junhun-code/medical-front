<template>
  <div class="list-container">
    <div class="head-info">
      <tool-bar @updateScreenData="updateScreenData"></tool-bar>
      <div class="progress-wrap">
        <span>任务共1000例，完成进度</span>
        <div class="progress">
          <el-progress :percentage="80"></el-progress>
        </div>
        <el-button
          type="primary"
          style="margin-left: 5px;"
          @click="openSketchPage"
          >我的任务</el-button
        >
      </div>
    </div>
    <div class="list-table">
      <record-table :record-list="recordList" />
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100, 500, 1000, 2000]"
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
export default {
  data() {
    return {
      screenData: {
        importId: undefined,
        importTimeStart: undefined,
        importTimeEnd: undefined,

        sketchId: undefined,
        sketchTimeStart: undefined,
        sketchTimeEnd: undefined,

        auditorId: undefined,
        auditorTimeStart: undefined,
        auditorTimeEnd: undefined,

        trained: undefined,
        audited: undefined,
        sketched: undefined,
        alloted: undefined,
        fileType: undefined
      },
      recordList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  components: {
    toolBar,
    recordTable
  },
  methods: {
    updateScreenData(value) {
      let screenData = {};
      //
      screenData["importId"] = value.importUser
        ? value.importUser.id
        : undefined;
      screenData["sketchId"] = value.sketchUser
        ? value.sketchUser.id
        : undefined;
      screenData["auditorId"] = value.auditUser
        ? value.auditUser.id
        : undefined;
      if (value.importTime && value.importTime.length === 2) {
        screenData["importTimeStart"] = value.importTime[0];
        screenData["importTimeEnd"] = value.importTime[1];
      }
      if (value.sketchTime && value.sketchTime.length === 2) {
        screenData["sketchTimeStart"] = value.sketchTime[0];
        screenData["sketchTimeEnd"] = value.sketchTime[1];
      }
      if (value.auditorTime && value.auditorTime.length === 2) {
        screenData["auditorTimeStart"] = value.auditorTime[0];
        screenData["auditorTimeEnd"] = value.auditorTime[1];
      }
      // 数据状态
      screenData["trained"] = 0;
      screenData["audited"] = 0;
      screenData["sketched"] = 0;
      if (value.status === "已训练") {
        screenData["trained"] = 1;
      } else if (value.status === "已驳回") {
        screenData["audited"] = 2;
      } else if (value.status === "已审核") {
        screenData["audited"] = 1;
      } else if (value.status === "已标注") {
        screenData["sketched"] = 1;
      } else if (value.status === "未标注") {
        screenData["sketched"] = 0;
      }
      screenData["alloted"] = 0;
      if (value.allotedStatus === "分配勾画审核") {
        screenData["alloted"] = 11;
      } else if (value.allotedStatus === "分配审核") {
        screenData["alloted"] = 1;
      } else if (value.allotedStatus === "分配勾画") {
        screenData["alloted"] = 10;
      } else if (value.allotedStatus === "未分配") {
        screenData["alloted"] = 0;
      }
      // 数据格式
      screenData["fileType"] = value.fileType || undefined;

      this.screenData = screenData;
      this.currentPage = 1;
      this.getFileRecordList();
    },
    getFileRecordList() {
      let formVal = {
        current: this.currentPage,
        size: this.pageSize
      };
      this.$axios
        .post(
          "/cmscp/datamanage/fileRecord/list",
          Object.assign(formVal, this.screenData)
        )
        .then(
          res => {
            if (res.data.status === 0) {
              let recordList = res.data.data.content;
              recordList.forEach(item => {
                if (item.trained) {
                  item.status = "已训练";
                } else if (item.audited == 1) {
                  item.status = "已审核";
                } else if (item.audited == 2) {
                  item.status = "已驳回";
                } else if (item.sketched) {
                  item.status = "已标注";
                } else if (item.alloted === 10) {
                  item.status = "分配勾画";
                } else if (item.alloted === 1) {
                  item.status = "分配审核";
                } else if (item.alloted === 11) {
                  item.status = "分配勾画审核";
                } else if (item.alloted === 0) {
                  item.status = "未分配";
                } else {
                  item.status = "";
                }
              });
              this.recordList = recordList;
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
    },
    openSketchPage() {
      const { href } = this.$router.resolve({
        name: "sketch",
        query: {}
      });
      window.open(href, "_blank");
    }
  },
  created() {
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
