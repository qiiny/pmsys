<template>
  <div class="login_container">
    <div class="title">
      <span>欢迎使用小区物业管理系统</span>
    </div>
    <div class="login_box">
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" class="login_form" label-width="0" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"><i slot="prefix" class="iconfont iconuser"></i></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password"><i slot="prefix" class="iconfont iconmima"></i>
          </el-input>
        </el-form-item>
        <template>
          <el-radio v-model="radio" label="1">用户</el-radio>
          <el-radio v-model="radio" label="2">管理员</el-radio>
        </template>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="success" @click="resetLoginForm">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单数据
      radio:"",
      loginForm: {
        username: "jack",
        password: "123456"
      },
      //验证对象
      loginRules: {
        username: [
          {required: true, message: '用户名称必填', trigger: 'blur'},//必填验证
          {min: 2, max: 15, message: '长度在2到15个字符', trigger: 'blur'}//长度验证
        ],
        password: [
          {required: true, message: '用户密码必填', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blue'}
        ],
      },
    };
  },
  methods: {
    //重置表单内容
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    //登录
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        if(this.radio==2){
          const {data: res} = await this.$http.post("admin/login", this.loginForm);
          if (res.flag === "ok") {
            window.sessionStorage.setItem("admin", res.admin)
            this.$message.success("登录成功")
            await this.$router.push({path: "/user"})
          } else {
            this.$message.error("登录失败")
          }
        }
        else {
          const {data: res} = await this.$http.post("user/login", this.loginForm);
          if (res.flag === "ok") {
            console.log(res.user)
            window.sessionStorage.setItem("user", res.user.ownerid)
            sessionStorage.setItem("userInfo",JSON.stringify(res.user))
            this.$message.success("登录成功")
            await this.$router.push({path: "/index"})
          } else {
            this.$message.error("登录失败")
          }
        }
      });
    }
  }

}
</script>

<style lang="less" scoped>
.login_container {
  background-image: url("../assets/images/xiaoqu.jpeg");
  background-size: cover;
  height: 100%;
}

.title {
  width: 600px;
  height: 300px;
  font-size: 50px;
  margin:0 auto;
  padding-top: 50px;
  font-weight:bold
}

.login_box {
  filter:alpha(Opacity=60) !important;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  margin-top: 40px;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.el-form-item{
  padding-top: 10px;
}
</style>
