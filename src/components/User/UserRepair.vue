<template>
  <div>
    <el-card shadow="hover">
      <span>报修记录</span>
      <el-table
          :data="repairList"
          style="width: 100%">
        <el-table-column
            prop="createtime"
            label="报修时间"
            width="180"
            :formatter="setDate"
        >
        </el-table-column>
        <el-table-column
            prop="place"
            label="地点"
            width="180">
        </el-table-column>
        <el-table-column
            prop="repairtime"
            label="维修时间"
            width="180"
            :formatter="setDate"
        >
        </el-table-column>
        <el-table-column
            prop="remarks"
            label="详细信息">
        </el-table-column>
        <el-table-column
            prop="isrepair"
            label="状态"
            width="180">
          <template slot-scope="scope">
            <el-switch :active-value="1"
                       active-text="已维修"
                       inactive-text="尚未维修"
                       :inactive-value="0" v-model="scope.row.isrepair" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 5px 15px">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[1, 3, 5, 10]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-card style="margin-top: 15px" shadow="hover">
      <el-form ref="addFormRules" :model="form" label-width="80px"  :rules="addFormRules">
        <el-form-item label="报修类型" prop="repairtype">
          <el-select v-model="form.repairtype" clearable filterable placeholder="请选择" style="width: 50%">
            <el-option value="0" label="电类(电线点灯空调等电器电路问题)"/>
            <el-option value="1" label="水类(水管水龙头燃气管等问题)"/>
            <el-option value="2" label="场地维护(小区卫生公共设备修护等)"/>
          </el-select>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="楼栋" prop="buildingid">
            <el-select label="楼栋" v-model="form.buildingid" clearable placeholder="请选择" style="width:100%">
              <el-option
                  v-for="item in building"
                  :key="item.buildingid"
                  :label="item.buildingname"
                  :value="item.buildingid+item.buildingname">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门牌" prop="houseid">
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
          <el-button type="primary" @click="addRepair">立即报修</el-button>
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
    this.getRepairList()
  },
  data() {
    return {
      repairList: "",
      total:"",
      //查询实体
      queryInfo: {
        createtime: "",
        ownerid: window.sessionStorage.getItem("user"),
        pageNum: 1,
        pageSize: 5,
      },
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
      house: "",
      addFormRules: {
        // place: [
        //   {required: true, message: "请输入业主名称", trigger: 'blur'},
        //   {min: 2, max: 15, message: "请输入2到15个字符", trigger: "blur"}
        // ],
        buildingid: [
          { required: true, message: '请选择楼栋', trigger: 'change' }
        ],
        houseid: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        repairtype: [
          { required: true, message: '类型', trigger: 'change' }
        ],

      }
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
    //获取所有用户
    async getRepairList() {
      let {data: res} = await this.$http.get("repair", {params: this.queryInfo})
      this.repairList = res.data;
      console.log(this.repairList)
      this.total = res.numbers;
    },
    setDate(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD");
    },
    addRepair(){
      let user = window.sessionStorage.getItem("user")
      this.form.ownerid = user
      this.form.place=this.form.buildingid+"-"+this.form.houseid+"-"+this.form.place
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.post("repair", this.form);
        if (res !== "success") {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功")
        this.form=[]
        await this.getRepairList();
      })
    },
    async userStateChange(userInfo) {
      let formData = new FormData();
      formData.append("userid", userInfo.repairid);
      formData.append("status", userInfo.isrepair);
      let {data: res} = await this.$http.put("user/status", formData)
      if (res !== "success") {
        userInfo.id = !userInfo.id;
        return this.$message.error("修改失败")
      }
      this.$message.success("修改成功")
    },
    //最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList();
    },
    //pageNum触发动作
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList();
    },
  }
}
</script>

<style scoped>
.el-card{
  border-radius: 10px;
}
</style>
