<template>
  <div class="app">
        <el-header>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="4"><div class=""></div></el-col>
            <el-col :span="16" c>
              <el-menu :default-active="activeIndex"
                       class="el-menu-demo"
                       mode="horizontal"
                       @select="handleSelect"
                       background-color="#0086b3" text-color="#fff" router="router"
              >
                <el-menu-item index="index">小区物业管理系统</el-menu-item>
                <el-menu-item index="fee">费用管理</el-menu-item>
                <el-menu-item index="repair">在线报修</el-menu-item>
                <el-menu-item index="article">社区交流</el-menu-item>
                <el-menu-item index="tousu">物业投诉</el-menu-item>
                <el-submenu index="5" style="float: right">
                  <template slot="title">
                    <el-avatar v-if="user.avatar"> <img :src="user.avatar"> </el-avatar>
                    <el-avatar v-else> {{user.username}} </el-avatar>
                  </template>
                  <el-menu-item>
                    <el-upload
                              :action="this.url"
                               :on-success="handleAvatorSuccess"
                               :before-upload="beforeAvatorUpload">
                      <p style="margin-top: 0px">上传头像</p>
                    </el-upload>
                  </el-menu-item>
                  <el-menu-item @click="logout">退出</el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
            <el-col :span="4"><div class="left-nav"></div></el-col>
          </el-row>
        </el-header>
    <el-container>
      <el-main>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
          <el-col :span="16">
            <router-view></router-view>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple"></div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  created() {
    this.init()
  },
  data() {
    return {
      id : "",
      url:"",
      user:"",
    }
  },
  methods: {
    handleSelect(key, keyPath) {
    },
    logout() {
      window.sessionStorage.clear();
      this.$router.push({path: "/login"})
    },
    init() {
      let user = window.sessionStorage.getItem("userInfo")
      this.id = JSON.parse(user).userid
      this.user=JSON.parse(user)
      this.url="http://localhost:9000/user/uploadImg?id="+this.id
    },
    //上传图片之间检验
    beforeAvatorUpload(file) {
      let reg = /(jpg|png|gif|JPG|PNG|GIF|jpeg|JPEG)/
      const isJPG = (reg.test(file.type));
      if (!isJPG) {
        this.$message.error('只能上传图片')
        return false;
      }
      const isLt2M = (file.size / 1024) < 2;
      if (isLt2M) {
        this.$message.error('只能上传2m以下大小图片')
        return false;
      }
      // let fd = new FormData();
      // fd.append('file',file);//传文件
      // fd.append('id',this.id);//传其他参数
      // console.log(this.id)
      // this.$http.post('/user/uploadImg',fd).then(function(res){
      //   alert('成功');
      // })
      return true
    },
    //上传成功后
    handleAvatorSuccess(res) {
      let _this = this;
      console.log(res)
      if (res.code === 200) {
        this.$message.success("上传成功");
        sessionStorage.setItem("userInfo",JSON.stringify(res.user))
        this.$router.go(0)
      } else {
        this.$message.error("上传失败");
      }
    },
  },

}
</script>
<style lang="less">
.el-header{
  background-color: #0086b3;
}
.el-main {
  background-color: #eaedf1;
  height: 100%;
}
.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 120px!important;
}

</style>
