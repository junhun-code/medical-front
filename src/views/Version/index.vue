<template>
  <div class="version-manager">
    <div class="condition-detail">
      <div class="picture-list-wrap">
        <el-select v-model="value" placeholder="请选择" @change="change">
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
      <div class="input-picture"></div>
      <div class="output-picture"></div>
      <div class="version-retport">
        <div class="version-info"></div>
        <div class="ai-info"></div>
        <div class="report-info"></div>
        <el-upload
          action=""
          :multiple="true"
          :before-upload="beforeUpload"
          :http-request="uploadFile"
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
import { mapState } from "vuex";
import uploadMethods from "@/lib/upload.js";
export default {
  data() {
    return {
      fileList: [],
      versionList: [],
      value: ""
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
  components: {},
  methods: {
    change(value) {
      console.log(value);
    },
    beforeUpload(file) {
      console.log(">>>", file);
      if (uploadMethods.getFileType(file.name) === "image") {
        return true;
      } else {
        this.$message.error("文件格式错误");
        return false;
      }
    },
    uploadFile(param) {
      // 创建表单对象
      let formVal = new FormData();
      // 后端接受参数 ，可以接受多个参数
      formVal.append("file", param.file);
      this.$axios
        .post("/msci/cmscp/datamanage/ai/out", formVal, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(
          res => {
            if (res.data.status === 0) {
              this.$message("上传成功");
              this.fileList.push(
                Object.assign(param.file, { report: res.data.data })
              );
            } else {
              this.$message.error(res.data.message);
            }
          },
          err => {
            this.$message.error("上传失败");
          }
        );
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.version-manager {
  padding: 20px;
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
    display: flex;
    .input-picture {
      flex: 1;
    }
    .output-picture {
      flex: 1;
    }
    .version-retport {
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
