<template>
  <div class="version-manager">
    <div class="condition-detail">
      <div class="picture-list-wrap">
        <el-select v-model="currentFile" placeholder="请选择">
          <el-option
            v-for="item in fileList"
            :key="item.uid"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </div>
      <div class="version-list-wrap"></div>
    </div>
    <div class="version-detail">
      <div class="input-picture">
        <el-image
          v-if="currentFile.url"
          class="image-wrap"
          style="width: 100%; height: 100%;"
          :src="currentFile.url"
          :preview-src-list="[currentFile.url]"
          fit="contain"
        ></el-image>
      </div>
      <div class="output-picture">
        <fabric-show
          v-if="currentFile.url"
          :image-url="currentFile.url"
          :report="currentFile.report"
        ></fabric-show>
      </div>
      <div class="version-retport">
        <div class="version-info"></div>
        <div class="ai-info"></div>
        <div class="report-info"></div>
        <el-upload
          action="/msci/cmscp/datamanage/ai/out"
          :multiple="true"
          :before-upload="beforeUpload"
          :on-success="handleFileSuccess"
          :on-error="handleFileError"
          list-type="picture"
        >
          <el-button slot="trigger" size="small" type="primary"
            >导入测试数据</el-button
          >
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import fabricShow from "./components/fabric-show";
import { mapState } from "vuex";
import uploadMethods from "@/lib/upload.js";
export default {
  data() {
    return {
      currentFile: "",
      fileList: [],
      versionList: []
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
    fabricShow
  },
  methods: {
    beforeUpload(file) {
      if (uploadMethods.getFileType(file.name) === "image") {
        return true;
      } else {
        this.$message.error("文件格式错误");
        return false;
      }
    },
    handleFileSuccess(res, file) {
      if (res.status === 0) {
        this.$message.success("上传文件成功");
        let report = res.data;
        report.forEach(groupItem => {
          groupItem.mask = groupItem.mask.map(maskItem => {
            return {
              x: maskItem.positionX,
              y: maskItem.positionY
            };
          });
        });

        this.fileList.push({
          uid: file.uid,
          name: file.name,
          url: file.url,
          report: report
        });
      } else {
        this.$message.error(`上传文件失败:${res.message}`);
      }
    },
    handleFileError(err, file, fileList) {
      this.$message.error("上传文件失败");
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.version-manager {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .condition-detail {
    height: 60px;
    display: flex;
    justify-content: flex-start;
    .picture-list-wrap {
    }
    .version-list-wrap {
    }
  }
  .version-detail {
    flex: 1;
    display: flex;
    .input-picture {
      flex: 1;
      margin-right: 15px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
    }
    .output-picture {
      flex: 1;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
    }
    .version-retport {
      margin-left: 15px;
      width: 200px;
      .version-info {
      }
      .ai-info {
      }
      .result-info {
      }
      .button-wrap {
      }
    }
  }
}
</style>
