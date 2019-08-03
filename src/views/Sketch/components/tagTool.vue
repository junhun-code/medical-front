<template>
  <div class="tag-tool">
    <el-button
      v-for="(item, index) in targetListSketch"
      :key="index"
      size="small"
    ></el-button>
  </div>
</template>

<script>
export default {
  name: "tag-tool",
  props: ["targetListSketch"],
  data() {
    return {};
  },
  watch: {},
  components: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.tag-tool {
  display: flex;
  flex-direction: column;
  & > button {
    flex-shrink: 0;
  }
}
</style>
