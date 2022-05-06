<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>维护管理</el-breadcrumb-item>
      <el-breadcrumb-item>电力维修</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主体 -->
    <el-card style="border-radius: 10px">
      <!--搜索区-->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-date-picker
              v-model="queryInfo.createTime"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="筛选月份" style="width: 50%">
          </el-date-picker>
          <el-button icon="el-icon-search" @click="getRepairList"></el-button>
        </el-col>
      </el-row>

      <!--用户列表 border边框 stripe隔行变色-->
      <el-table :data="repairList" border stripe>
        <!--  索引列-->
        <el-table-column prop="repairid" width="40px">
        </el-table-column>
        <el-table-column label="业主姓名" prop="ownerid">
          <template slot-scope="scope">
            {{ scope.row.owner.ownername }}
          </template>
        </el-table-column>
        <el-table-column label="报修地址" prop="place"></el-table-column>
        <el-table-column label="报修时间" prop="createtime" :formatter="setDate"></el-table-column>
        <el-table-column label="是否已维修" prop="isrepair">
          <template slot-scope="scope">
            {{scope.row.isrepair>0?"已派人维修":"尚未维修"}}
          </template>
        </el-table-column>
        <el-table-column label="维修时间" prop="repairtime" :formatter="setDate"></el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="指派员工" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.repairid)"></el-button>
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
    <el-dialog title="指派员工" :visible.sync="editDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="员工" prop="staff">
          <el-select v-model="editForm.staff" clearable filterable placeholder="请选择(可搜索员工名)" style="width: 50%">
            <el-option
                v-for="item in staff"
                :key="item.staffid"
                :label="item.staffid+':'+item.staffname"
                :value="item.staffid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修时间" prop="repairtime">
          <el-date-picker
              v-model="editForm.repairtime"
              type="date"
              placeholder="选择日期" style="width: 100%"
              　　　　　　 >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="editForm.remarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editRepair">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


export default {
  created() {
    this.getRepairList();
    this.getAllStaff();
  },
  data() {
    return {
      //查询实体
      queryInfo: {
        createtime: "",
        repairtype:0,
        pageNum: 1,
        pageSize: 5,
      },
      staff:[],
      repairList: [],
      total: 0,
      editDialogVisible: false,
      editForm: {
        repairid:"",
        repairtype: 0,
        staff:"",
        repairtime:new Date(),
        isrepair:1,
      },

      //表单认证
      addFormRules: {
        ownername: [
          {required: true, message: "请输入业主名称", trigger: 'blur'},
          {min: 2, max: 15, message: "请输入2到15个字符", trigger: "blur"}
        ],
        buildingid: [
          { required: true, message: '请选择楼栋', trigger: 'change' }
        ],
        houseid: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phone: [
          { required: true, validator: this.validatorPhone, trigger: 'blur' },
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
      }
    }
  },
  methods: {
    //获取所有用户
    async getRepairList() {
      let {data: res} = await this.$http.get("repair", {params: this.queryInfo})
      this.repairList = res.data;
      console.log(this.repairList)
      this.total = res.numbers;
    },
    //最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getRepairList();
    },
    //pageNum触发动作
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getRepairList();
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
    editRepair(){
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.put("repair", this.editForm);
        if (res !== "success") {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功")
        this.editDialogVisible = false;
        await this.getRepairList();
      })
    },
    async getAllStaff() {
      let {data: res} = await this.$http.get("staff/list?staffPost=0")
      this.staff = res.data;
    },
    setDate(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD");
    },
    showEditDialog(res){
      this.editForm.repairid=res.repairid
      this.editDialogVisible=true;
      console.log(this.editForm.repairId)
    },
    async deleteUser(id) {
      let {data: res} = await this.$http.delete("repair?id="+id)
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功")
      await this.getRepairList();
    },
    validatorPhone(rule, value, callback) {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
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
