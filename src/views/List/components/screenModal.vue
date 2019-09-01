<template>
  <div class="screen-modal">
    <el-form ref="form" :model="form" label-width="80px">
      <!-- 入库 -->
      <el-form-item label="入库时间">
        <el-date-picker
          v-model="form.importTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-select v-model="form.importUser" placeholder="请选择入库人员">
          <el-option
            v-for="(item, index) in importUserList"
            :key="index"
            :label="item.realName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 勾画 -->
      <el-form-item label="勾画时间">
        <el-date-picker
          v-model="form.sketchTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-select v-model="form.sketchUser" placeholder="请选择勾画人员">
          <el-option
            v-for="(item, index) in sketchUserList"
            :key="index"
            :label="item.realName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 审核 -->
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="form.auditTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-select v-model="form.auditUser" placeholder="请选择审核人员">
          <el-option
            v-for="(item, index) in auditUserList"
            :key="index"
            :label="item.realName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="confirmSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "screen-modal",
  props: ["importUserList", "sketchUserList", "auditUserList"],
  data() {
    return {
      form: {
        // 入库
        importUser: "",
        importTime: "",
        // 勾画
        sketchUser: "",
        sketchTime: "",
        // 审核
        auditUser: "",
        auditorTime: ""
      },
      statusList: ["未标注", "已标注", "已审核", "已驳回", "已训练"],
      allotedStatusList: ["未分配", "分配勾画", "分配审核"],
      fileTypeList: []
    };
  },
  watch: {},
  components: {},
  methods: {
    closeTaskModal() {
      this.$emit("updateTaskModal", false);
    },
    confirmSearch() {
      this.$emit("updateScreenData", this.form);
    }
  }
};
</script>

<style lang="less" scoped>
.el-select {
  margin-left: 20px;
}
</style>
