<template>
  <div class="login_container">
    <div class="title">
      <span>欢迎使用小区物业管理系统</span>
    </div>
    <el-card class="login_box">
      <el-form ref="loginFormRef" :model="registerForm" label-position="right" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="registerForm.passwordR"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="success" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
        title="选择物业单位"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form :model="ownerForm" label-position="right" label-width="80px">
        <el-form-item label="楼栋" prop="buildingid">
          <el-select v-model="ownerForm.buildingid" placeholder="请选择活动区域">
            <el-option
                v-for="item in building"
                :key="item.buildingid"
                :label="item.buildingname"
                :value="item.buildingid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌" prop="houseid">
          <el-select label="门牌" v-model="ownerForm.houseid"
                     clearable placeholder="请选择" style="width:100%"
                     @click.native="getHouse(ownerForm.buildingid)">
            <el-option
                v-for="item in house"
                :key="item.houseid"
                :label="item.housename"
                :value="item.houseid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业主名" prop="ownername">
          <el-input v-model="ownerForm.ownername"></el-input>
        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="search">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getBuilding()
  },
  data() {
    return {
      centerDialogVisible: false,
      building: "",
      house:"",
      ownerForm: {
        ownerid: "",
        ownername: "",
        buildingid: "",
        houseid: ""
      },
      //表单数据
      registerForm: {
        username: "",
        password: "",
        passwordR: "",
        ownerid:""
      },
      userForm:{
        username: "",
        password: "",
        ownerid:""
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
    //注册
    register() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        if (this.registerForm.password != this.registerForm.passwordR) {
          this.$message.error("请确认密码")
          return;
        }
        else {
          this.$message.success("请登记物业信息")
          this.centerDialogVisible=true;
        }

      });
    },
    async getBuilding() {
      let {data: res} = await this.$http.get("building")
      this.building = res.data;
    },
    async getHouse(id) {

      let {data: res} = await this.$http.get("house/building?buildingid=" + id)
      this.house = res.data;
      this.house.houseid = Number(this.house.houseid)
    },
    async search(){
      const {data: res} = await this.$http.post("owner/search", this.ownerForm);
      if (res!=0){
        this.userForm.username=this.registerForm.username
        this.userForm.password=this.registerForm.password
        this.userForm.ownerid=res
        console.log(this.userForm.ownerid)
        const {data: re} = await this.$http.post("user", this.userForm);
        if (re == "success") {
          this.$message.success("注册成功，等待管理员审核")
          await this.$router.push("/login")
        } else {
          this.$message.error("注册失败")
        }
      }
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
  margin: 0 auto;
  padding-top: 50px;
  font-weight: bold
}

.login_box {
  filter: alpha(Opacity=60) !important;
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

.el-form {
  margin-top: 20px;
}

</style>
