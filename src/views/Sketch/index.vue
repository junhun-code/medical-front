<template>
  <div class="sketch-container">
    <div class="head-info">
      <el-button-group>
        <el-button
          :type="drawType === 'pen' ? 'primary' : ''"
          size="small"
          icon="el-icon-edit"
          @click="drawType = 'pen'"
        ></el-button>
        <el-button size="small" icon="el-icon-share"></el-button>
        <el-button
          :type="drawType === 'remove' ? 'primary' : ''"
          size="small"
          icon="el-icon-delete"
          @click="drawType = 'remove'"
        ></el-button>
      </el-button-group>
      <el-button-group>
        <el-button>确认</el-button>
        <el-button>驳回</el-button>
        <el-button>审核</el-button>
      </el-button-group>
    </div>
    <div class="fabric-wrap">
      <tab-list class="tab-list-wrap"></tab-list>
      <el-image
        class="image-wrap"
        style="width: 400px; height: 300px"
        :src="url"
        :preview-src-list="[url]"
        fit="contain"
      ></el-image>
      <fabric :image-url="url" :draw-type="drawType"></fabric>
    </div>
  </div>
</template>

<script>
import fabric from "./components/fabric";
import tabList from "./components/tabList";
export default {
  data() {
    return {
      url: "/201606301533460177SMP.JPG",
      drawType: "pen"
    };
  },
  components: {
    fabric,
    tabList
  },
  methods: {},
  created() {}
};
</script>

<style lang="less" scoped>
.sketch-container {
  .head-info {
    padding: 10px 50px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fabric-wrap {
    padding: 10px 50px;
    display: flex;
    .tab-list-wrap {
      margin-right: 5px;
    }
    .image-wrap {
      margin-right: 5px;
    }
  }
}
</style>
