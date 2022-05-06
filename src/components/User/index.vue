<template>
  <div>
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in images" :key="item" align="center">
        <img :src="item" class="image" fit="scale-down">
      </el-carousel-item>
    </el-carousel>
    <el-row :gutter="100" type="flex" class="row-bg" justify="center">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>最新公告</span>
            <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
          </div>
<!--          <div v-for="o in noticeList" :key="noticeid" class="text item">-->
<!--            {{ o.noticetitle}}-->
<!--          </div>-->
          <div class="text item">
            <span>停电公告</span><br><br>
            <span>做核酸通知</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>业主空间</span>
            <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
          </div>
          <div class="text item">
           <span>二手交易帖</span><br><br>
           <span>生活小妙招分享！</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="fee">
      <div slot="header" class="clearfix">
        <span>待缴费用</span>
        <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
      </div>
      <el-card shadow="hover">
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column
              prop="date"
              label="日期"
              width="180">
          </el-table-column>
          <el-table-column
              prop="name"
              label="姓名"
              width="180">
          </el-table-column>
          <el-table-column
              prop="address"
              label="地址">
          </el-table-column>
          <el-table-column
              prop="cuozuo"
              label="操作"
              width="180">
            <el-button>缴费</el-button>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>

</template>

<script>
export default {
  created() {
    this.getAllNotice()
  },
  data(){
    return{
      images:[
        require("@/assets/images/h1.jpeg"),
        require("@/assets/images/h2.jpeg"),
        require("@/assets/images/h3.jpeg"),
      ],
      noticeList:"",
      queryInfo: {
        noticeTitle: "",
        pageNum: 1,
        pageSize: 5,
      },
    }
  },
  methods:{
    async getAllNotice() {
      let {data: res} = await this.$http.get("notice", {params: this.queryInfo})
      this.noticeList = res.data;
    },
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.image{
  max-height: 100%;
  max-width: 100%;
}
.box-card {
  width: 600px;
}
.el-col{
  display:flex;
  justify-content:center;/*主轴上居中*/
}
.fee{
  margin-top: 20px;
}
</style>
