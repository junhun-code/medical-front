<template>
  <div class="tool-bar">
    <el-button-group>
      <el-tooltip class="item" effect="dark" content="导入" placement="bottom">
        <el-button
          v-if="uploadRight"
          type="primary"
          size="small"
          icon="el-icon-upload2"
          @click="showUploadModal = true"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="导出" placement="bottom">
        <el-button
          v-if="downloadRight"
          type="primary"
          size="small"
          icon="el-icon-download"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="任务" placement="bottom">
        <el-button
          v-if="assignmentRight"
          type="primary"
          size="small"
          icon="el-icon-s-order"
          @click="showTaskModal = true"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="筛选" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-set-up"
          @click="showScreenModal = true"
        ></el-button>
      </el-tooltip>
    </el-button-group>

    <el-dialog width="500px" title="导入" :visible.sync="showUploadModal">
      <upload-modal @updateUploadModal="updateUploadModal"></upload-modal>
    </el-dialog>

    <el-dialog width="500px" title="任务分配" :visible.sync="showTaskModal">
      <task-modal @updateTaskModal="updateTaskModal"></task-modal>
    </el-dialog>

    <el-dialog width="500px" title="筛选" :visible.sync="showScreenModal">
      <screen-modal @updateScreenModal="updateScreenModal"></screen-modal>
    </el-dialog>
  </div>
</template>

<script>
import uploadModal from "./uploadModal";
import taskModal from "./taskModal";
import screenModal from "./screenModal";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "tool-bar",
  props: [],
  components: {
    uploadModal,
    taskModal,
    screenModal
  },
  data() {
    return {
      showUploadModal: false,
      showTaskModal: false,
      showScreenModal: false
    };
  },
  computed: {
    ...mapState(["listPerms"]),
    uploadRight() {
      return this.listPerms.children.some(
        item => item.perm === "fileRecord:zip_upload"
      );
    },
    downloadRight() {
      return this.listPerms.children.some(
        item => item.perm === "fileRecord:exportData"
      );
    },
    assignmentRight() {
      return this.listPerms.children.some(
        item => item.perm === "fileRecord:assignment"
      );
    }
  },
  methods: {
    updateUploadModal(value) {
      this.showUploadModal = value;
    },
    updateTaskModal(value) {
      this.showTaskModal = value;
    },
    updateScreenModal(value) {
      this.showTaskModal = value;
    },
    getUserList() {
      this.$axios
        .get("/fileRecord/role/userlist")
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success("影像打标签成功");
          } else {
            this.$message(res.data.message);
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.getUserList();
  }
};
</script>

<style lang="less" scoped>
.tool-bar {
}
</style>
