<template>
  <div class="task-list" v-loading="loading">
    <el-tabs stretch v-model="mode">
      <el-tab-pane label="勾画" name="sketch"></el-tab-pane>
      <el-tab-pane label="审核" name="audit"></el-tab-pane>
    </el-tabs>
    <div class="data-list">
      <div
        class="task-item"
        :class="{
          'task-selected':
            currentFileRecord && item && currentFileRecord.id === item.id
        }"
        v-for="(item, index) in taskList"
        :key="index"
        @click="selectCurrentFileRecord(item)"
      >
        {{ item ? item.fileName : "" }}
      </div>
    </div>
    <div class="task-pagination">
      <el-pagination
        small
        layout="prev, pager, next"
        @current-change="handleCurrentChange(item)"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "task-list",
  props: [],
  data() {
    return {
      mode: "sketch",
      loading: false,
      firstFlag: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      taskList: [],
      currentFileRecord: {
        id: "",
        fileUuid: ""
      }
    };
  },
  components: {},
  watch: {
    mode: {
      handler(newVal) {
        this.$emit("updateMode", newVal);
        this.currentPage = 1;
        this.getMyTask();
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMyTask();
    },
    // 我的任务列表
    getMyTask(mode) {
      let formVal = {
        operate: this.mode === "sketch" ? 1 : 2,
        current: this.currentPage,
        size: this.pageSize
      };
      this.loading = true;
      this.$axios.post("/cmscp/datamanage/myTask", formVal).then(
        res => {
          this.loading = false;
          if (res.data.status === 0) {
            this.taskList = res.data.data.content.map(item => item.fileRecord);
            this.total = res.data.data.totalPages;
            if (this.firstFlag && this.taskList.length) {
              // 第一次默认加载第一个数据
              this.selectCurrentFileRecord(this.taskList[0]);
              this.firstFlag = false;
            }
          } else {
            this.$message(res.data.message);
          }
        },
        err => {
          this.loading = false;
        }
      );
    },
    selectCurrentFileRecord(item) {
      this.currentFileRecord = item;
      this.$emit("updateCurrentFileRecord", item);
    }
  },
  created() {},
  mounted() {
    this.getMyTask();
  }
};
</script>

<style lang="less" scoped>
.task-list {
  flex-shrink: 0;
  width: 180px;
  display: flex;
  flex-direction: column;
  .data-list {
    flex: 1;
    .task-item {
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.2s;
      cursor: pointer;
      &:nth-child(2n) {
        background: #f5f5f5;
      }
      &:hover {
        background: #f5f7fa;
      }
      &.task-selected {
        background: #66b1ff !important;
      }
    }
  }
  .task-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>
