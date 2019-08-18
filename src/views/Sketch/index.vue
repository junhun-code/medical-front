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
        <el-popover placement="right" width="240" trigger="click">
          <tab-list class="tab-list-wrap"></tab-list>
          <el-button type="info" slot="reference" style="margin-right: 10px;"
            >选择对象</el-button
          >
        </el-popover>
        <el-button-group>
          <el-button>确认</el-button>
          <el-button v-if="rejectRight">驳回</el-button>
          <el-button v-if="auditRight">审核</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="fabric-wrap">
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
        :file-record-id="fileRecordId"
        :file-target-list="fileTargetList"
        :sketch-target-list="sketchTargetList"
        :sketch-groups="sketchGroups"
        :targe-id="targeId"
        @selectFileTarget="setFileRecordTarget"
      ></fabric>
    </div>
    <div class="pagination-control">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
        <el-button type="primary"
          >下一页<i class="el-icon-arrow-right el-icon--right"></i
        ></el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import fabric from "./components/fabric";
import tabList from "./components/tabList";
import { mapState } from "vuex";
export default {
  data() {
    return {
      fileRecordId: undefined,
      fileUuid: undefined,
      fileRecordDetail: {},
      sketchGroups: [], // 勾画的集合
      imageUrl: "",
      drawType: "pen",
      fileTargetList: [],
      sketchTargetList: [],
      targeId: null
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
    tabList
  },
  methods: {
    // 数据列表、勾画权限查询
    getPerms() {
      this.$axios.get("/jspxcms/dataManage/perms").then(
        res => {
          if (res.data.status === 0) {
            this.$store.commit("SET_DATA_MANAGE_PERMS", res.data.data);
          } else {
            this.$message.error("权限查询失败");
          }
        },
        err => {
          this.$message.error("权限查询失败");
        }
      );
    },
    // 图片详情
    getFileRecord() {
      let params = {
        fileRecordId: this.fileRecordId
      };
      this.$axios
        .get("/jspxcms/fileRecord/get", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.fileRecordDetail = res.data.data;
            this.targeId = this.fileRecordDetail.targeId;
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
          }
        })
        .catch(err => {});
    },
    // 影像打标签
    setFileRecordTarget(id) {
      let params = {
        fileRecordId: this.fileRecordId,
        targetId: id
      };
      this.$axios
        .get("/jspxcms/fileRecord/targeted", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.targeId = id;
            this.$message.success("影像打标签成功");
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(err => {});
    },
    // 影像下载
    fileRecordDownload() {
      this.imageUrl = `/jspxcms/cmscp/datamanage/fileRecord/download?fileRecordId=${
        this.fileRecordId
      }&uuid=${this.fileUuid}`;
    },
    // 影像标签列表
    getFileTargeList() {
      let params = {
        type: 1
      };
      this.$axios
        .get("/jspxcms/cmscp/datamanage/target/list", { params })
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
        .get("/jspxcms/cmscp/datamanage/target/list", { params })
        .then(res => {
          if (res.data.status === 0) {
            this.sketchTargetList = res.data.data;
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.fileRecordId = this.$route.query.fileRecordId;
    this.fileUuid = this.$route.query.fileUuid;
    this.getPerms();
    this.getFileRecord();
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
  .pagination-control {
    display: flex;
    justify-content: center;
  }
}
</style>
