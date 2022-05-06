<template>
  <div>
    <el-card shadow="hover">
      <span>投诉记录</span>
      <el-table
          :data="repairList"
          style="width: 100%">
        <el-table-column
            prop="date"
            label="投诉时间"
            width="180">
        </el-table-column>
        <el-table-column
            prop="place"
            label="投诉内容"
            width="180">
        </el-table-column>
        <el-table-column
            prop="cuozuo"
            label="业主回复">
        </el-table-column>
        <el-table-column
            prop="status"
            label="撤销投诉"
            width="180">
          <el-switch :active-value="1"
                     :inactive-value="0" v-model="sw" @change="userStateChange(scope.row)"></el-switch>

        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin-top: 15px" shadow="hover">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="发送">
        <span>物业管理人员</span>
        </el-form-item>
        <el-form-item label="详细内容" prop="place">
          <el-input
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 20}"
              placeholder="请输入内容"
              v-model="form.place">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即报修</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getBuilding()
  },
  data() {
    return {
      sw:1,
      repairList: [{
        date:"2022-02-16",
        place:"A栋楼梯太久不打扫很多垃圾，差评",
        repaieTime:"2022-3-16",
        cuozuo:"已尽快派人去维修"
      }],
      form: {
        repairtype: '',
        ownerid: '',
        place: '',
        createtime: new Date(),
        remarks: "",
        buildingid: "",
        houseid: "",
      },
      building: "",
      house: ""
    }
  },
  methods: {
    async getBuilding() {
      let {data: res} = await this.$http.get("building")
      this.building = res.data;
    },
    async getHouse(id) {
      let build=id.charAt(0)
      let {data: res} = await this.$http.get("house/building?buildingid=" + build)
      this.house = res.data;
      this.house.houseid = Number(this.house.houseid)
    },
    onSubmit(){
      this.form.place=this.form.buildingid.slice(1)+"-"+this.form.houseid+"-"+this.form.place
      console.log(this.form)
    },
    getRepairList(){

    }

  }
}
</script>

<style scoped>
.el-card{
  border-radius: 10px;
}
</style>
