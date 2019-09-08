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
          :type="drawType === 'pan' ? 'primary' : ''"
          size="small"
          icon="el-icon-rank"
          @click="drawType = 'pan'"
        ></el-button>
        <el-button
          :type="drawType === 'remove' ? 'primary' : ''"
          size="small"
          icon="el-icon-delete"
          @click="drawType = 'remove'"
        ></el-button>
      </el-button-group>
      <div class="head-right">
        <el-button-group>
          <el-button v-if="mode === 'sketch'" @click="setSketchState"
            >确认</el-button
          >
          <el-button
            v-if="rejectRight && mode === 'audit'"
            @click="setAuditState(2)"
            >驳回</el-button
          >
          <el-button
            v-if="auditRight && mode === 'audit'"
            @click="setAuditState(1)"
            >审核</el-button
          >
        </el-button-group>
      </div>
    </div>
    <div class="fabric-wrap">
      <task-list
        class="tab-list-wrap"
        ref="taskList"
        :mode="mode"
        :currentFileRecord="currentFileRecord"
        @updateMode="updateMode"
        @updateCurrentFileRecord="updateCurrentFileRecord"
      ></task-list>
      <el-image
        class="image-wrap"
        style="width: 600px; height: 500px"
        :src="imageUrl"
        :preview-src-list="[imageUrl]"
        fit="contain"
      ></el-image>
      <fabric
        :image-url="imageUrl"
        :draw-type="drawType"
        :file-record-id="currentFileRecord.id"
        :file-target-list="fileTargetList"
        :sketch-target-list="sketchTargetList"
        :sketch-groups="sketchGroups"
        :fileTargetIdArr="fileTargetIdArr"
        @selectFileTarget="setFileRecordTarget"
        @updateLatestSketchGroups="updateLatestSketchGroups"
      ></fabric>
    </div>
    <div class="crop-wrap">
      <fabric-crop
        v-for="(item, index) in latestSketchGroups"
        :key="index"
        :index="index"
        :image-url="imageUrl"
        :sketchDetail="item"
        :sketch-target-list="sketchTargetList"
      ></fabric-crop>
    </div>
  </div>
</template>

<script>
import fabric from "./components/fabric";
import taskList from "./components/taskList";
import fabricCrop from "./components/fabricCrop";
import { mapState } from "vuex";
export default {
  data() {
    return {
      mode: "sketch", // sketch, audit
      currentFileRecord: {
        id: "",
        fileUuid: ""
      },
      fileRecordDetail: {},
      sketchGroups: [], // 勾画的集合
      latestSketchGroups: [], // 最新勾画集合
      imageUrl: "",
      drawType: "pen",
      fileTargetList: [],
      sketchTargetList: [],
      fileTargetIdArr: []
    };
  },
  computed: {
    ...mapState(["sketchPerms"]),
    sketchSettingRight() {
      return this.sketchPerms.children.some(
        item => item.perm === "fileRecord:sketchSetting"
      );
    },
    auditRight() {
      return this.sketchPerms.children.some(
        item => item.perm === "fileRecord:audit"
      );
    },
    rejectRight() {
      return this.sketchPerms.children.some(
        item => item.perm === "fileRecord:reject"
      );
    }
  },
  components: {
    fabric,
    taskList,
    fabricCrop
  },
  methods: {
    updateMode(mode) {
      this.mode = mode;
    },
    updateCurrentFileRecord(item) {
      if (!item || !item.id) return;
      this.currentFileRecord = item;
      this.getFileRecord();
    },
    // 图片详情
    getFileRecord() {
      if (!this.currentFileRecord || !this.currentFileRecord.id) return;
      let params = {
        fileRecordId: this.currentFileRecord.id
      };
      this.$axios
        .get("/msci/cmscp/datamanage/fileRecord/get", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.fileRecordDetail = res.data.data;
            this.sketchGroups = this.fileRecordDetail.sketchGroups || [];
            this.sketchGroups.forEach(groupItem => {
              groupItem.sketchList = groupItem.sketchList.map(sketchItem => {
                return {
                  x: sketchItem.positionX,
                  y: sketchItem.positionY
                };
              });
            });
            this.fileRecordDownload();
            this.initFileTargetArr();
          }
        })
        .catch(err => {});
    },
    initFileTargetArr() {
      this.fileTargetIdArr = this.fileRecordDetail.targetList.map(
        item => item.id
      );
    },
    // 影像打标签
    setFileRecordTarget(id) {
      let newArr = [];
      if (!this.fileTargetIdArr.includes(id)) {
        newArr = [...this.fileTargetIdArr, id];
      } else {
        newArr = this.fileTargetIdArr.filter(item => item !== id);
      }

      let params = {
        fileRecordId: this.currentFileRecord.id,
        targetId: newArr.join(",")
      };
      this.$axios
        .get("/msci/cmscp/datamanage/fileRecord/targeted", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.fileTargetIdArr = newArr;
            this.$message.success("影像打标签成功");
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(err => {});
    },
    // 影像下载
    fileRecordDownload() {
      if (!this.currentFileRecord || !this.currentFileRecord.id) return;
      this.imageUrl = `/msci/cmscp/datamanage/fileRecord/download?fileRecordId=${
        this.currentFileRecord.id
      }&uuid=${this.currentFileRecord.fileUuid}`;
    },
    // 影像标签列表
    getFileTargeList() {
      let params = {
        type: 1
      };
      this.$axios
        .get("/msci/cmscp/datamanage/target/list", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.fileTargetList = res.data.data;
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(err => {});
    },
    // 勾画标签列表
    getSketchTargeList() {
      let params = {
        type: 2
      };
      this.$axios
        .get("/msci/cmscp/datamanage/target/list", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.sketchTargetList = res.data.data;
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(err => {});
    },
    updateLatestSketchGroups(list) {
      this.latestSketchGroups = list;
    },
    // 下一条处理
    goToNextPagination() {
      this.nextTask();
    },
    // 勾画状态设置
    setSketchState() {
      let params = {
        fileRecordId: this.currentFileRecord.id
      };
      this.$axios
        .get("/msci/cmscp/datamanage/fileRecord/sketched", { params })
        .then(
          res => {
            if (res.data.status === 0) {
              this.$message("勾画状态设置成功");
              this.nextTask();
            } else {
              this.$message.error(res.data.message);
            }
          },
          err => {
            this.$message.error("勾画状态设置失败");
          }
        );
    },
    // 审核状态设置
    setAuditState(audit) {
      let params = {
        fileRecordId: this.currentFileRecord.id,
        audit: audit
      };
      this.$axios
        .get("/msci/cmscp/datamanage/fileRecord/audited", { params })
        .then(
          res => {
            if (res.data.status === 0) {
              this.$message("审核状态设置成功");
              this.nextTask();
            } else {
              this.$message.error(res.data.message);
            }
          },
          err => {
            this.$message.error("审核状态设置失败");
          }
        );
    },
    // 我的任务下一条
    nextTask() {
      let formVal = {
        operate: this.mode === "sketch" ? 1 : 2
      };
      this.$axios
        .post(
          `/msci/cmscp/datamanage/myTask/next?operate=${formVal.operate}`,
          formVal
        )
        .then(
          res => {
            if (res.data.status === 0) {
              console.log("下一张");
              this.updateCurrentFileRecord(res.data.data);
              this.$refs.taskList.getMyTask();
              this.$message("跳转下一页");
            } else {
              this.$message.error(res.data.message);
            }
          },
          err => {
            this.$message.error("跳转下一页失败");
          }
        );
    }
  },
  mounted() {
    this.getFileTargeList();
    this.getSketchTargeList();
  }
};
</script>

<style lang="less" scoped>
.sketch-container {
  .head-info {
    padding: 10px 20px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .head-right {
      display: flex;
      align-items: center;
    }
  }
  .fabric-wrap {
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    .tab-list-wrap {
      margin-right: 5px;
    }
    .image-wrap {
      margin-right: 5px;
    }
  }
  .crop-wrap {
    padding: 10px 20px;
    display: flex;
  }
}
</style>
