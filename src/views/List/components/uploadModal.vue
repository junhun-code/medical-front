<template>
  <div class="upload-modal">
    <el-form label-width="100px">
      <el-form-item label="上传文件">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="/cmscp/datamanage/fileRecord/zip_upload"
          :before-upload="beforeUploadPackage"
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
    </el-form>
  </div>
</template>

<script>
import uploadMethods from "@/lib/upload.js";

export default {
  name: "upload-modal",
  props: [],
  data() {
    return {};
  },
  watch: {},
  components: {},
  methods: {
    closeUploadModal() {
      this.$emit("updateUploadModal", false);
    },
    beforeUploadPackage(file) {
      if (uploadMethods.getFileType(file.name) === "package") {
        return true;
      } else {
        this.$message.error("文件格式错误");
        return false;
      }
    },
    handleFileSuccess(res, file) {
      console.log("[file]", res, file);
      if (res.status === 0) {
        this.$message.success("上传文件成功");
      } else {
        this.$message.error(`上传文件失败:${res.message}`);
      }
    },
    handleFileError(err, file, fileList) {
      console.log(err);
      this.$message.error("上传文件失败");
    }
  }
};
</script>

<style lang="less" scoped></style>
