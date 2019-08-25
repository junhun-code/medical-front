<template>
  <div class="task-modal">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务类型">
        <el-select v-model="form.type" placeholder="请选择任务类型">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员分配">
        <el-select v-model="form.user" placeholder="请选择任务人员">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "task-modal",
  props: [],
  data() {
    return {
      form: {
        type: "",
        user: "",
        time: ""
      }
    };
  },
  watch: {},
  components: {},
  methods: {
    closeTaskModal() {
      this.$emit("updateTaskModal", false);
    }
  }
};
</script>

<style lang="less" scoped></style>
