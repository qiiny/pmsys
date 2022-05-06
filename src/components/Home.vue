<template>
  <!--  引入布局-->
  <el-container class="home-container">
    <!--      头部-->
    <el-header>
      <div>
        <img src="../assets/images/logo1.png" alt="">
        <span>物业管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--      主体-->
    <el-container>
      <!--        侧边栏-->
      <el-aside width="200px" :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409eff"
            :collapse="isCollapse" :collapse-transition="false" router="router" :default-active="activePath">
          <!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{item.title}}</span>
            </template>
            <!--          二级菜单-->
            <el-menu-item :index="it.path+''" v-for="it in item.list" :key="it.id" @click="saveNavState(it.path)">
              <template slot="title">
                <i :class="iconsObject[it.id]"></i>
                <span>{{it.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--        主体内容-->
      <el-main>
        <router-view>

        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      //菜单列表
      menuList:[],
      isCollapse:false,
      iconsObject:{
        '1':'iconfont icon-xitong',
        '2':'iconfont icon-yezhu',
        '4':'iconfont icon-feiyongbaohan',
        '5':'iconfont icon-shuifei',
        '6':'iconfont icon-dianfei',
        '7':'iconfont icon-wuyefeiyongchuzhang',
        '8':'iconfont icon-fangchan',
        '9':'iconfont icon-fangchanfangzi',
        '10':'iconfont icon-weixiufuwu',
        '11':'iconfont icon-bulb',
        '12':'iconfont icon-shuilongtou',
        '13':'iconfont icon-changdi',
        '14':'iconfont icon-luntan',
        '15':'iconfont icon-gonggao',
        '16':'iconfont icon-luntan',
        '17':'iconfont icon-tousu',
        '18':'iconfont icon-yonghu',
        '19':'iconfont icon-yuangong'
      },
      activePath:'/welcome',
    }
  },
  created() {
    //查询menuList
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push({path: "/login"})
    },
    //获取导航菜单
    async getMenuList(){
      let {data:res} = await this.$http.get("menu/menus");
      if (res.flag===200){
        this.menuList=res.data;
      }else {
        return this.$message.error("获取列表失败");
      }
    },
    //控制伸缩
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    //保存路径
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath=activePath;
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}

img {
  width: 55px;
  height: 55px;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 0;
  color: #fff;
  align-items: center;
  font-size: 25px;

  > div {
    align-items: center;
    display: flex;
    align-content: center;

    span {
      margin-left: 15px;
    }
  }
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
i{
  margin-right: 5px;
}

</style>
