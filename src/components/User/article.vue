<template>
  <div>
    <el-card style="width: 80%;margin:12px auto" shadow="hover" @click.native="f">
      <h2>标题</h2>
      <div style="font-size: 12px">
        <p style="text-align:right">作者：jack</p>
        <p style="text-align:right">发布时间：jack</p>
      </div>
      <HR/>
      <p>{{ this.filtersText(this.content) }}</p>
      <img v-if="this.img.length>0" :src="img[0]" width="480" height="320">
    </el-card>
    <el-card style="width: 80%;margin:12px auto">
      <h3>标题</h3>
      <HR/>
      <p>内容内容内容内容内容内容内容</p>
    </el-card>
    <el-card style="width: 80%;margin:12px auto">
      <h3>标题</h3>
      <HR/>
      <p>内容内容内容内容内容内容内容</p>
    </el-card>
    <el-card style="width: 80%;margin:12px auto">
      <h3>标题</h3>
      <HR/>
      <p>内容内容内容内容内容内容内容</p>
    </el-card>
  </div>


</template>

<script>
export default {
  created() {
    this.img = this.getImgSrc(this.content)
  },
  data() {
    return {
      content: "<p><img src=\"http://localhost:9000/img/test/16484061344617e20bebc7675ba0d5b8049c136ce1ff0.jpeg\"></p><p>北国风光，千里冰封，万里雪飘。</p><p>望长城内外，惟余莽莽；大河上下，顿失滔滔。</p><p>山舞银蛇，原驰蜡象，欲与天公试比高。</p><p>须晴日，看红装素裹，分外妖娆。</p><p>江山如此多娇，引无数英雄竞折腰。</p><p><span style=\"color: rgb(204, 0, 0);\">惜秦皇汉武，</span>略输文采；唐宗宋祖，稍逊风骚。</p><p>一代天骄，成吉思汗，只识弯弓射大雕。</p><p>俱往矣，数风流人物，还看今朝。</p>",
      img: [],
    }
  },
  methods: {
    getImgSrc(rich) {
      var imgList = [];
      rich.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
        imgList.push(capture);
      });
      console.log(imgList)
      return imgList;
    },
    filtersText(val) {
      return val.replace(/<[^>]+>/g, "");
    },
    f(){
      this.$router.push("/details")
    }
  }
}
</script>

<style scoped>

</style>
