<template>
  <div>
    <el-card style="height: 800px;border-radius: 18px;" shadow="hover">
    </el-card>
    <div style="display: flex;margin-top: 5px">
      <el-input placeholder="请输入内容"></el-input>
      <el-button>回复</el-button>
    </div>
    <div class="author-title reply-father" >
      <el-avatar class="header-img" size="40">头像一</el-avatar>
      <div class="author-info">
        <span class="author-name">rose</span>
        <span class="author-time">2020/2/12</span>
      </div>
      <div class="icon-btn">
        <span>
          <i class="el-icon-s-comment Ri" @click="showInput(flag)">2</i>
        </span>
        <i class="el-icon-caret-top Ri">3</i>
      </div>
      <div class="talk-box">
        <p>
          <span class="reply">回复内容回复内容回复内容</span>
        </p>
      </div>
      <div style="display: flex;margin-top: 5px" v-show="flag">
        <el-input placeholder="请输入内容"></el-input>
        <el-button>回复</el-button>
      </div>
    </div>



  </div>
</template>
<script>


export default {
  data() {
    return {
      flag:false
    }
  },
  methods: {
    onDivInput: function (e) {
      this.replyComment = e.target.innerHTML;
    },
    showInput(flag){
      this.flag=!flag;
    }
  }
}
</script>
<style>
.my-reply {
  padding: 10px;
  background-color: #fafbfc;
}

.my-reply .header-img {
  display: inline-block;
  vertical-align: top;
}

.my-reply .reply-info {
  display: inline-block;
  margin-left: 5px;
  width: 90%;
}

@media screen and (max-width: 1200px) {
  .my-reply .reply-info {
    width: 80%;
  }
}

.my-reply .reply-info .reply-input {
  min-height: 20px;
  line-height: 22px;
  padding: 10px 10px;
  color: #ccc;
  background-color: #fff;
  border-radius: 5px;
}

.my-reply .reply-info .reply-input:empty:before {
  content: attr(placeholder);
}

.my-reply .reply-info .reply-input:focus:before {
  content: none;
}

.my-reply .reply-info .reply-input:focus {
  padding: 8px 8px;
  border: 2px solid #00f;
  box-shadow: none;
  outline: none;
}

.my-reply .reply-btn-box {
  height: 25px;
  margin: 10px 0;
}

.my-reply .reply-btn-box .reply-btn {
  position: relative;
  float: right;
  margin-right: 15px;
}

.my-comment-reply {
  margin-left: 50px;
}

.my-comment-reply .reply-input {
  width: auto;
}

.author-title:not(:last-child) {
  border-bottom: 1px solid rgba(178, 186, 194, 0.3);
}

.author-title {
  padding: 10px;
}

.author-title .header-img {
  display: inline-block;
  vertical-align: top;
}

.author-title .author-info {
  display: inline-block;
  margin-left: 5px;
  width: 60%;
  height: 40px;
  line-height: 20px;
}

.author-title .author-info > span {
  display: block;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.author-title .author-info .author-name {
  color: #000;
  font-size: 18px;
  font-weight: bold;
}

.author-title .author-info .author-time {
  font-size: 14px;
}

.author-title .icon-btn {
  width: 30%;
  padding: 0 !important;
  float: right;
}

@media screen and (max-width: 1200px) {
  .author-title .icon-btn {
    width: 20%;
    padding: 7px;
  }
}

.author-title .icon-btn > span {
  cursor: pointer;
}

.author-title .icon-btn .iconfont {
  margin: 0 5px;
}

.author-title .talk-box {
  margin: 0 50px;
}

.author-title .talk-box > p {
  margin: 0;
}

.author-title .talk-box .reply {
  font-size: 16px;
  color: #000;
}

.author-title .reply-box {
  margin: 10px 0 0 50px;
  background-color: #efefef;
}
Ri{
  float: right;
}
</style>
