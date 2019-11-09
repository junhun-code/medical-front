<template>
  <div class="version-manager">
    <div class="condition-detail">
      <div class="version-list-wrap">
        <el-select v-model="currentVersion" placeholder="请选择">
          <el-option
            v-for="item in versionList"
            :key="item.value"
            :label="item.name"
            :value="currentVersion"
          />
        </el-select>
      </div>
      <div class="upload-picture-wrap">
        <el-upload
          ref="upload"
          action="/msci/cmscp/datamanage/ai/out"
          :multiple="true"
          :auto-upload="false"
          list-type="picture"
          :file-list="unuploadfileList"
          :before-upload="beforeUpload"
          :on-change="handleFileChange"
        >
          <el-button slot="trigger" type="primary">导入测试数据</el-button>
          <el-button
            v-if="unuploadfileList.length"
            style="margin-left: 10px;"
            type="success"
            :loading="loading"
            @click="submitUpload"
            >上传到服务器</el-button
          >
        </el-upload>
      </div>
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
      <div class="file-list-wrap">
        <div class="file-list">
          <div
            class="box-card-wrap"
            :class="{ 'active-card': currentFile.uid === item.uid }"
            v-for="(item, index) in fileList"
            :key="index"
            @click="selectCurrentFile(item, index)"
          >
            <el-card class="box-card" shadow="hover">
              <div class="card-content">{{ item.name }}</div>
            </el-card>
          </div>
        </div>
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
      // 第一版写死
      currentVersion: 0,
      versionList: [
        {
          name: "超声智能诊断算法v1.0",
          value: 0
        }
      ],
      loading: false,
      uploadErrorNum: 0,
      unuploadfileList: [],

      currentFile: "",
      fileList: []
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
    handleFileChange(file, fileList) {
      // 初始化
      this.uploadErrorNum = 0;
      this.unuploadfileList = fileList;
    },
    submitUpload() {
      this.syncUploadFile();
    },
    syncUploadFile() {
      if (!this.unuploadfileList.length) {
        // 上传完毕
        if (!this.uploadErrorNum.length) {
          this.$message.success("上传图片成功");
        } else {
          this.$message.error(`${this.uploadErrorNum.length}张图片上传失败`);
        }
      } else {
        let currentFile = this.unuploadfileList.pop();
        let formData = new FormData(); //  用FormData存放上传文件
        formData.append("file", currentFile.raw);

        this.loading = true;
        this.$axios.post("/msci/cmscp/datamanage/ai/out", formData).then(
          res => {
            this.loading = false;
            if (res.data.status === 0) {
              let report = res.data.data;
              report.forEach(groupItem => {
                groupItem.mask = groupItem.mask.map(maskItem => {
                  return {
                    x: maskItem.positionX,
                    y: maskItem.positionY
                  };
                });
              });

              this.fileList.push({
                uid: currentFile.uid,
                name: currentFile.name,
                url: currentFile.url,
                report: report
              });

              this.syncUploadFile();
            } else {
              this.uploadErrorNum = this.uploadErrorNum + 1;
            }
          },
          err => {
            this.loading = false;
            this.uploadErrorNum = this.uploadErrorNum + 1;
          }
        );
      }
    },
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
    },
    selectCurrentFile(item, index) {
      console.log(">>>", item);
      this.currentFile = item;
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
    .version-list-wrap {
    }
    .upload-picture-wrap {
      margin-left: 10px;
      /deep/.el-upload-list--picture {
        display: none;
      }
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
    .file-list-wrap {
      position: relative;
      margin-left: 15px;
      width: 300px;
      .file-list {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: overlay;
        .box-card-wrap {
          &.active-card {
            .box-card {
              background-color: #3a8ee6;
            }
            .card-content {
              color: #ffffff;
            }
          }
          .box-card {
            margin-bottom: 10px;
            .card-content {
              overflow: hidden; /*超出部分隐藏*/
              text-overflow: ellipsis; /* 超出部分显示省略号 */
              white-space: nowrap; /*规定段落中的文本不进行换行 */
            }
          }
        }
      }
    }
  }
}
</style>
