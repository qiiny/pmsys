<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>业主管理</el-breadcrumb-item>
      <el-breadcrumb-item>业主列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主体 -->
    <el-card style="border-radius: 10px">
      <!--搜索区-->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-input placeholder="请输入要搜索的内容" v-model="queryInfo.ownerName" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加业主</el-button>
        </el-col>
      </el-row>

      <!--用户列表 border边框 stripe隔行变色-->
      <el-table :data="ownerList" border stripe>
        <!--  索引列-->
        <el-table-column prop="ownerid" width="40px">
        </el-table-column>
        <el-table-column label="业主姓名" prop="ownername"></el-table-column>
        <el-table-column label="楼栋" prop="buildingname">
          <template slot-scope="scope">
            {{ scope.row.building.buildingname }}
          </template>
        </el-table-column>
        <el-table-column label="门牌" prop="houseName">
          <template slot-scope="scope">
            {{ scope.row.houses.housename }}
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ changeSex(scope.row.sex) }}
          </template>
        </el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="创建时间" prop="createtime" :formatter="setDate"></el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.ownerid)"></el-button>
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
    <el-dialog title="添加住户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="用户名" prop="ownername">
          <el-input v-model="addForm.ownername" clearable></el-input>
        </el-form-item>
        <el-form-item label="楼栋" prop="buildingid">
          <el-select label="楼栋" v-model="addForm.buildingid" clearable placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in building"
                :key="item.buildingid"
                :label="item.buildingname"
                :value="item.buildingid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌" prop="houseid">
          <el-select label="门牌" v-model="addForm.houseid" clearable placeholder="请选择" @click.native="getHouse(addForm.buildingid)"
                     style="width:100%">
            <el-option
                v-for="item in house"
                :key="item.houseid"
                :label="item.housename"
                :value="item.houseid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select label="性别" v-model:title="addForm.sex" clearable placeholder="请选择" style="width:100%">
            <el-option value="1" label="男"/>
            <el-option value="0" label="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="入住时间" prop="createtime">
          <el-date-picker
              v-model="addForm.createtime"
              type="date"
              placeholder="选择日期"
              　　　　　　 value-format="yyyy-MM-dd" style="width: 100%">
          </el-date-picker>
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
    <el-dialog title="修改住户" :visible.sync="editDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="用户名" prop="ownername">
          <el-input v-model="editForm.ownername" clearable></el-input>
        </el-form-item>
        <el-form-item label="楼栋" prop="buildingid">
          <el-select label="楼栋" v-model="editForm.buildingid" clearable placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in building"
                :key="item.buildingid"
                :label="item.buildingname"
                :value="item.buildingid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌" prop="houseid">
          <el-select label="门牌" v-model="editForm.houseid"
                     clearable placeholder="请选择" style="width:100%"
                     @click.native="getHouse(editForm.buildingid)">
            <el-option
                v-for="item in house"
                :key="item.houseid"
                :label="item.housename"
                :value="item.houseid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select label="性别" v-model:title="editForm.sex" clearable placeholder="请选择" style="width:100%">
            <el-option :value="1" label="男"/>
            <el-option :value="0" label="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="入住时间" prop="createtime">
          <el-date-picker
              v-model="editForm.createtime"
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
        <el-button type="primary" @click="editOwner">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


export default {
  created() {
    this.getUserList();
    this.getBuilding();
  },
  data() {
    return {
      //查询实体
      queryInfo: {
        ownerName: "",
        pageNum: 1,
        pageSize: 5,
      },
      ownerList: [],
      building: [],
      house: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      //添加跳单信息
      addForm: {
        ownername: "",
        buildingid: "",
        houseid: "",
        sex: "",
        phone: "",
        email: "",
        createtime: new Date(),
        remarks: "",
      },
      editForm: {
        ownerid:"",
        ownername: "",
        buildingid: "",
        houseid: "",
        sex: "",
        phone: "",
        email: "",
        createtime: "",
        remarks: "",
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
        createtime:[
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //获取所有用户
    async getUserList() {
      let {data: res} = await this.$http.get("owner", {params: this.queryInfo})
      this.ownerList = res.data;
      this.total = res.numbers;
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
    changeSex(value) {
      if (value === 0) {
        return "女"
      } else if (value === 1) {
        return "男"
      } else if (value === 2) {
        return "组合"
      } else {
        return "不明"
      }
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
        let {data: res} = await this.$http.post("owner", this.addForm);
        if (res !== "success") {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功")
        this.addDialogVisible = false;
        console.log(res)
        await this.getUserList();
      })
    },
    editOwner(){
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.put("owner", this.editForm);
        if (res !== "success") {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功")
        this.editDialogVisible = false;
        console.log(res)
        await this.getUserList();
      })
    },
    async getBuilding() {
      let {data: res} = await this.$http.get("building")
      this.building = res.data;
    },
    async getHouse(id) {

      let {data: res} = await this.$http.get("house/building?buildingid=" + id)
      this.house = res.data;
      this.house.houseid=Number(this.house.houseid)
    },
    setDate(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD");
    },
    showEditDialog(res){
      this.editDialogVisible=true;
      this.editForm.ownerid=res.ownerid,
      this.editForm.ownername=res.ownername,
      this.editForm.buildingid=Number(res.buildingid),
      this.editForm.houseid=Number(res.houseid),
      this.getHouse(this.editForm.buildingid),
      this.editForm.sex=res.sex,
      this.editForm.phone=res.phone,
      this.editForm.email=res.email,
      this.editForm.createtime=res.createtime,
      this.editForm.remarks=res.remarks
    },
    async deleteUser(id) {
      let {data: res} = await this.$http.delete("owner?id="+id)
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功")
      await this.getUserList();
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
