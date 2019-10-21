<template>
  <div class="version-manager">
    <div class="condition-detail">
      <div class="picture-list-wrap">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :http-request="uploadFile"
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
      versionList: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
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
    beforeUpload(file) {
      console.log(1, file);
      if (uploadMethods.getFileType(file.name) === "image") {
        return true;
      } else {
        this.$message.error("文件格式错误");
        return false;
      }
    },
    // 上传文件，获取文件流
    handleChange(file) {
      console.log(2, file);
      this.file = file.raw;
    },
    uploadFile(param) {
      console.log(123, param);
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
    .input-picture {
    }
    .output-picture {
    }
    .version-retport {
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
