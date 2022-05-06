<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>费用管理</el-breadcrumb-item>
      <el-breadcrumb-item>电费管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主体 -->
    <el-card style="border-radius: 10px">
      <!--搜索区-->
      <el-row :gutter="25">
        <el-col :span="8">
          <el-form :model="queryInfo">
            <el-select v-model="queryInfo.ownerid" clearable filterable placeholder="请选择(可搜索业主名)" style="width: 50%">
              <el-option
                  v-for="item in owner"
                  :key="item.ownerid"
                  :label="item.ownerid+':'+item.ownername"
                  :value="item.ownerid">
              </el-option>
            </el-select>
            <el-date-picker
                v-model="queryInfo.PayMonth"
                type="month"
                value-format="yyyy-MM-dd"
                placeholder="筛选月份" style="width: 50%">
            </el-date-picker>
          </el-form>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-search" @click="getUserList"></el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">登记待缴电费</el-button>
        </el-col>
      </el-row>

      <!--用户列表 border边框 stripe隔行变色-->
      <el-table :data="fee_power" border stripe>
        <!--  索引列-->
        <el-table-column prop="powerid" width="40px">
        </el-table-column>
        <el-table-column label="业主姓名" prop="ownerid">
          <template slot-scope="scope">
            {{ scope.row.owner.ownername }}
          </template>
        </el-table-column>
        <el-table-column label="缴费单位" prop="house">
          <template slot-scope="scope">
            {{ scope.row.owner.houses.housename }}
          </template>
        </el-table-column>
        <el-table-column label="电费月份" prop="paymonth" :formatter="setDate"></el-table-column>
        <el-table-column label="电表读数" prop="powernum"></el-table-column>
        <el-table-column label="电费金额" prop="paymoney"></el-table-column>
        <el-table-column label="是否缴费" prop="ispay">
          <template slot-scope="scope">
            {{ scope.row.isPay = 1 ? "尚未缴费" : "已缴费" }}
          </template>
        </el-table-column>
        <el-table-column label="缴费时间" prop="PayTime" :formatter="setDate"></el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="deleteUser(scope.row.powerid)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 size-change每页最大变化数  current-change当前最大变化数 layout功能组件-->
      <div>
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
    <el-dialog title="登记待缴电费" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="业主编号" prop="ownerId">
          <el-select v-model="addForm.ownerid" filterable placeholder="请选择(可搜索业主名)">
            <el-option
                v-for="item in owner"
                :key="item.ownerid"
                :label="item.ownerid+':'+item.ownername"
                :value="item.ownerid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电费月份" prop="payMonth">
          <el-date-picker
              v-model="addForm.paymonth"
              type="month"
              placeholder="电费月份" style="width: 100%" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="电表读数" prop="powernum">
          <el-input v-model="addForm.powernum" clearable></el-input>
        </el-form-item>
        <el-form-item label="电费金额" prop="payMoney">
          <el-input v-model="addForm.paymoney" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="addForm.remarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="登记待缴电费" :visible.sync="editDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="业主编号" prop="ownerId">
          <el-select v-model="editForm.ownerid" filterable placeholder="请选择(可搜索业主名)">
            <el-option
                v-for="item in owner"
                :key="item.ownerid"
                :label="item.ownerid+':'+item.ownername"
                :value="item.ownerid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电费月份" prop="payMonth">
          <el-date-picker
              v-model="editForm.paymonth"
              type="month"
              placeholder="电费月份" style="width: 100%" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="电表读数" prop="powernum">
          <el-input v-model="editForm.powernum" clearable></el-input>
        </el-form-item>
        <el-form-item label="电费金额" prop="payMoney">
          <el-input v-model="editForm.paymoney" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="editForm.remarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editOwner">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


export default {
  created() {
    this.getUserList();

    this.getAllOwner();
  },
  data() {
    return {
      //查询实体
      queryInfo: {
        ownerid: "",
        PayMonth: "",
        pageNum: 1,
        pageSize: 5,
        isPay: false
      },
      fee_power: [],
      building: [],
      house: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      //添加跳单信息
      addForm: {
        powerid: "",
        ownerid: "",
        paymonth: "",
        powernum: "",
        paymoney: "",
        ispay: "",
        paytime: "",
        remarks: "",
      },
      editForm: {
        powerid: "",
        ownerid: "",
        paymonth: "",
        powernum: "",
        paymoney: "",
        ispay: "",
        paytime: "",
        remarks: "",
      },
      owner: [],
      //表单认证
      addFormRules: {
        ownername: [
          {required: true, message: "请输入业主名称", trigger: 'blur'},
          {min: 2, max: 15, message: "请输入2到15个字符", trigger: "blur"}
        ],
        buildingid: [
          {required: true, message: '请选择楼栋', trigger: 'change'}
        ],
        houseid: [
          {required: true, message: '请选择单位', trigger: 'change'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        phone: [
          {required: true, validator: this.validatorPhone, trigger: 'blur'},
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        createtime: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    //获取所有用户
    async getUserList() {
      console.log(123 + this.queryInfo.PayMonth)
      // let {data: res} = await this.$http.get("feeWater?ownerId="+this.queryInfo.ownerid+"&PayMonth="+this.queryInfo.PayMonth+"&pageNum="+this.queryInfo.pageNum+"&pageSize="+this.queryInfo.pageSize)
      let {data: res} = await this.$http.get("feePower", {params: this.queryInfo})
      this.fee_power = res.data;
      this.total = res.numbers;
      console.log(123 + this.queryInfo.PayMonth)
    },
    async getAllOwner() {
      let {data: res} = await this.$http.get("owner/list", {params: this.queryInfo})
      this.owner = res.data;
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
    async userStateChange(userInfo) {
      let formData = new FormData();
      formData.append("id", userInfo.id);
      formData.append("state", userInfo.state);
      let {data: res} = await this.$http.put("updateState", formData)
      if (res !== "success") {
        userInfo.id = !userInfo.id;
        return this.$message.error("修改失败")
      }
      this.$message.success("修改成功")
    },
    //监听添加用户
    addDialogClosed() {
      this.$refs.addFormRules.resetFields();
    },
    addUser() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.post("feePower", this.addForm);
        if (res !== "success") {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功")
        this.addDialogVisible = false;
        console.log(res)
        await this.getUserList();
      })
    },
    editOwner() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.put("feePower", this.editForm);
        if (res !== "success") {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功")
        this.editDialogVisible = false;
        console.log(res)
        await this.getUserList();
      })
    },

    async getHouse(id) {
      this.editForm.houseid = ""
      let {data: res} = await this.$http.get("house/building?buildingid=" + id)
      this.house = res.data;
    },
    setDate(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM");
    },
    async deleteUser(id) {
      let {data: res} = await this.$http.delete("feePower?id=" + id)
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功")
      await this.getUserList();
    },
    showEditDialog(res) {
      this.editDialogVisible = true;
      console.log(res)
      this.editForm.powerid = res.powerid,
          this.editForm.ownerid = res.ownerid,
          this.editForm.powernum = res.powernum,
          this.editForm.paymoney = res.paymoney,
          this.editForm.paytime = res.paytime,
          this.editForm.remarks = res.remarks,
          this.editForm.paymonth = res.paymonth.format("yyyy-MM-dd")
    },
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 17px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 8, 10, 0.15) !important;
}

HTML, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
