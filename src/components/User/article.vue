<template>
  <div>
    <el-card style="width: 80%;margin:12px auto" shadow="hover" @click.native="f(site)" v-for="site in articleList">
      <h2>{{ site.title }}</h2>
      <div style="font-size: 12px">
        <p style="text-align:right">作者：{{ site.author }}</p>
        <p style="text-align:right">发布时间：{{ site.createtime }}</p>
      </div>
      <HR/>
      <p class="content">{{ site.content.replace(/<[^>]+>/g, "") }}</p>
      <img v-if="getImgSrc(site.content)" :src="getImgSrc(site.content)" width="50%" height="50%">
    </el-card>
  </div>

</template>

<script>
export default {
  created() {
    this.getAllComplaint()
  },
  data() {
    return {
      //查询实体
      queryInfo: {
        title: "",
        pageNum: 1,
        pageSize: 5,
      },
      articleList: [],
      total: 0,

    }
  },
  methods: {
    getImgSrc(rich) {
      var imgList = [];
      rich.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
        imgList.push(capture);
      });
      return imgList[0];
    },
    filtersText(val) {
      return val.replace(/<[^>]+>/g, "");
    },
    f(item) {
      this.$router.push("/details")
      window.sessionStorage.setItem("article", JSON.stringify(item))
    },
    //获取所有用户
    async getAllComplaint() {
      // let {data: res} = await this.$http.get("feeWater?ownerId="+this.queryInfo.ownerid+"&PayMonth="+this.queryInfo.PayMonth+"&pageNum="+this.queryInfo.pageNum+"&pageSize="+this.queryInfo.pageSize)
      let {data: res} = await this.$http.get("article", {params: this.queryInfo})
      this.articleList = res.data;
      this.total = res.numbers;
    },
    //最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getAllComplaint();
    },
    //pageNum触发动作
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getAllComplaint();
    },
  }
}
</script>

<style scoped>
.content {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
