<template>
  <div class="screen-modal">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="入库时间">
        <el-date-picker
          v-model="form.importTime"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="form.auditTime"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "screen-modal",
  props: [],
  data() {
    return {
      form: {
        importTime: "",
        auditTime: "",
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
