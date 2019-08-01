<template>
  <div class="tool-bar">
    <el-button-group>
      <el-tooltip class="item" effect="dark" content="导入" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-upload2"
          @click="showUploadModal = true"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="导出" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-download"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="任务" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-s-order"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="筛选" placement="bottom">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-set-up"
        ></el-button>
      </el-tooltip>
    </el-button-group>

    <el-dialog title="导入" :visible.sync="showUploadModal">
      <el-form ref="form" label-width="100px">
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/jspxcms/fileRecord/zip_upload"
            :on-remove="handleFileRemove"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传压缩文件
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="导入分类">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="手术良恶性">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUploadModal = false">取 消</el-button>
        <el-button type="primary" @click="showUploadModal = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "tool-bar",
  props: [],
  data() {
    return {
      showScreeningModal: false,
      showUploadModal: false
    };
  },
  components: {},
  methods: {
    handleFileRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleFileSuccess(res, file) {
      console.log("[file]", res, file);
      this.$message({
        message: "上传文件成功",
        type: "success"
      });
    },
    handleFileError(err, file, fileList) {
      console.log(err);
      this.$message.error("上传文件失败");
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.tool-bar {
}
</style>
