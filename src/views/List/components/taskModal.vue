<template>
  <div class="task-modal">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务类型">
        <el-select v-model="form.type" placeholder="请选择任务类型">
          <el-option label="审核" value="audit"></el-option>
          <el-option label="勾画" value="sktech"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员分配">
        <el-select
          v-if="form.type === 'audit'"
          v-model="form.auditUser"
          placeholder="请选择任务人员"
        >
          <el-option
            v-for="(item, index) in auditUserList"
            :key="index"
            :label="item.realName"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          v-if="form.type === 'sktech'"
          v-model="form.sketchUser"
          placeholder="请选择任务人员"
        >
          <el-option
            v-for="(item, index) in sketchUserList"
            :key="index"
            :label="item.realName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="taskAllot">分配</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "task-modal",
  props: ["auditUserList", "sketchUserList", "selectedRecords"],
  computed: {},
  data() {
    return {
      form: {
        type: "audit", // audit, sktech
        auditUser: "",
        sketchUser: ""
      }
    };
  },
  watch: {},
  components: {},
  methods: {
    closeTaskModal() {
      this.$emit("updateTaskModal", false);
    },
    // 任务分配
    taskAllot() {
      let selectedUser =
        this.form.type === "audit" ? this.form.auditUser : this.form.sketchUser;

      if (!selectedUser) {
        this.$message.info("请选择人员");
        return;
      }

      let fileRecordIdList = this.selectedRecords.map(item => item.id);

      let formVal = {
        fileRecordIdList: fileRecordIdList,
        userId: selectedUser.id || undefined,
        userName: selectedUser.realName || undefined,
        operate: this.form.type === "sktech" ? 1 : 2
      };
      this.$axios.post("/msci/cmscp/datamanage/task/allot", formVal).then(
        res => {
          if (res.data.status === 0) {
            this.$message("任务分配成功");
            this.closeTaskModal();
          } else {
            this.$message.error("任务分配失败");
          }
        },
        err => {
          this.$message.error("任务分配失败");
        }
      );
    }
  }
};
</script>

<style lang="less" scoped></style>
