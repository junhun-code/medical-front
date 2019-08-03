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
        <el-button
          :type="drawType === 'move' ? 'primary' : ''"
          size="small"
          icon="el-icon-share"
          @click="drawType = 'move'"
        ></el-button>
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
      <fabric
        :image-url="url"
        :draw-type="drawType"
        :file-record-id="fileRecordId"
        :target-list-sketch="targetListSketch"
        :sketch-groups="sketchGroups"
      ></fabric>
    </div>
  </div>
</template>

<script>
import fabric from "./components/fabric";
import tabList from "./components/tabList";
export default {
  data() {
    return {
      fileRecordId: undefined,
      fileRecordDetail: {},
      sketchGroups: [],
      url: "/201606301533460177SMP.JPG",
      drawType: "pen",
      targetListSketch: []
    };
  },
  components: {
    fabric,
    tabList
  },
  methods: {
    getFileRecord() {
      let params = {
        fileRecordId: this.fileRecordId
      };
      this.$axios
        .get("/jspxcms/fileRecord/get", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.fileRecordDetail = res.data.data;
            this.sketchGroups = this.fileRecordDetail.sketchGroups || [];
            this.sketchGroups.forEach(groupItem => {
              groupItem.sketchList.forEach(sketchItem => {
                sketchItem.x = sketchItem.positionX;
                sketchItem.y = sketchItem.positionY;
              });
            });
          }
        })
        .catch(err => {});
    },
    getTargeList() {
      let params = {
        type: 2
      };
      this.$axios
        .get("/jspxcms/target/list", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.targetListSketch = res.data.data;
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.fileRecordId = this.$route.query.id;
    this.getFileRecord();
    this.getTargeList();
  }
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
