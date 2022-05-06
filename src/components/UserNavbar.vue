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
                <el-menu-item index="test">社区交流</el-menu-item>
                <el-menu-item index="tousu">物业投诉</el-menu-item>
                <el-submenu index="5" style="float: right">
                  <template slot="title">
                    <el-avatar> user </el-avatar>
                  </template>
                  <el-menu-item index="2-1">修改资料</el-menu-item>
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
  data() {
    return {

    }
  },
  methods: {
    handleSelect(key, keyPath) {
    },
    logout() {
      window.sessionStorage.clear();
      this.$router.push({path: "/login"})
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
</style>
