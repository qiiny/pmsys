<template>
  <div>
    <el-card shadow="hover">
      <span>报修记录</span>
      <el-table
          :data="repairList"
          style="width: 100%">
        <el-table-column
            prop="date"
            label="报修时间"
            width="180">
        </el-table-column>
        <el-table-column
            prop="place"
            label="地点"
            width="180">
        </el-table-column>
        <el-table-column
            prop="repaieTime"
            label="维修时间">
        </el-table-column>
        <el-table-column
            prop="cuozuo"
            label="状态"
            width="180">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin-top: 15px" shadow="hover">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="报修类型">
          <el-select v-model="form.repairtype" clearable filterable placeholder="请选择" style="width: 50%">
            <el-option value="0" label="电类(电线点灯空调等电器电路问题)"/>
            <el-option value="1" label="水类(水管水龙头燃气管等问题)"/>
            <el-option value="2" label="场地维护(小区卫生公共设备修护等)"/>
          </el-select>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="楼栋" prop="place">
            <el-select label="楼栋" v-model="form.buildingid" clearable placeholder="请选择" style="width:100%">
              <el-option
                  v-for="item in building"
                  :key="item.buildingid"
                  :label="item.buildingname"
                  :value="item.buildingid+item.buildingname">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门牌" prop="place">
            <el-select label="门牌" v-model="form.houseid"
                       clearable placeholder="请选择" style="width:100%"
                       @click.native="getHouse(form.buildingid)">
              <el-option
                  v-for="item in house"
                  :key="item.houseid"
                  :label="item.housename"
                  :value="item.housename">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="详细地址" prop="place">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="form.place">
          </el-input>
        </el-form-item>
        <el-form-item label="详细信息" prop="remarks">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="form.remarks">
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
      repairList: [{
        date:"2022-02-16",
        place:"A栋A301 测试水龙头坏了",
        repaieTime:"2022-3-16",
        cuozuo:"已维修"
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
