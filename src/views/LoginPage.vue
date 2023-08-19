<template>
  <div class="d-flex jc-center flex-column al-center" style="height: 70vh">
    <h1 class="login-box-msg" style="margin: 0 0 150px 50px">
      欢迎使用后台管理系统
    </h1>

    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      ruleForm: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, message: "长度应不少于3个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    async submitForm() {
      const res = await this.$http.post("/distributor/login", this.ruleForm);
      if (res.code === 0) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", this.ruleForm.userName);
        this.$router.push({ path: `/` });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
