<template>
  <div class="login-page">
    <section class="form_contianer">
      <div class="project-title"><h1>项目后台</h1></div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="top"
        label-width="60px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" class="login-form-button"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }]
      }
    };
  },
  components: {},
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("username", this.ruleForm.username);
          formData.append("password", this.ruleForm.password);
          this.$axios.post("/msci/site-1/datamanage/login", formData).then(
            res => {
              if (res.data.status === 0) {
                this.$message.success("登录成功");
                this.$tools.sleep(300).then(() => {
                  this.$router.replace({ path: `/list` });
                });
              } else {
                this.$message.error("登录失败");
              }
            },
            err => {
              this.$message.error("登录失败");
            }
          );
        } else {
          this.$message.error("请填写账号信息");
          return false;
        }
      });
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #003973 0, #e5e5be 100%);
  box-sizing: border-box;
  .form_contianer {
    width: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 25px 10px;
    border-radius: 5px;
    background-color: #fff;
    .project-title {
      position: absolute;
      width: 100%;
      top: -100px;
      left: 0;
      h1 {
        font-size: 40px;
        font-weight: bold;
        color: #fff;
        text-align: center;
      }
    }
    .login-form-button {
      width: 100%;
    }
  }
}
</style>
