<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>房产管理</el-breadcrumb-item>
      <el-breadcrumb-item>房产列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主体 -->
    <el-card style="border-radius: 10px;padding-left: 50px;padding-right: 50px">
      <!--搜索区-->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-input placeholder="请输入要搜索的内容" v-model="queryInfo.housename" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加单位</el-button>
        </el-col>
      </el-row>

      <!--用户列表 border边框 stripe隔行变色-->
      <el-table :data="houseList" border stripe>
        <!--  索引列-->
        <el-table-column prop="houseid" width="40px">
        </el-table-column>
        <el-table-column label="楼栋" prop="buildingname">
          <template slot-scope="scope">
            {{ scope.row.building.buildingname }}
          </template>
        </el-table-column>
        <el-table-column label="单位名称" prop="housename"></el-table-column>
        <el-table-column label="入住业主" prop="ownerid">
          <template slot-scope="scope">
            {{ scope.row.owner.ownername }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="登记业主" placement="top">
              <el-button type="primary" icon="el-icon-plus" size="mini"
                         @click="addOwner(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="deleteUser(scope.row.houseid)"></el-button>
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
    <el-dialog title="添加单位" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="选择楼栋" prop="buildingid">
          <el-select v-model="addForm.buildingid" filterable placeholder="请选择(可搜索业主名)">
            <el-option
                v-for="item in building"
                :key="item.buildingid"
                :label="item.buildingid+':'+item.buildingname"
                :value="item.buildingid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="单位名称" prop="housename">
          <el-input v-model="addForm.housename" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addHouse">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改单位" :visible.sync="editDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="选择楼栋" prop="buildingid">
          <el-select v-model="editForm.buildingid" filterable placeholder="请选择(可搜索业主名)">
            <el-option
                v-for="item in building"
                :key="item.buildingid"
                :label="item.buildingid+':'+item.buildingname"
                :value="item.buildingid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="单位名称" prop="housename">
          <el-input v-model="editForm.housename" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editUser">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加住户" :visible.sync="addOwnerDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="addOwnerForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="用户名" prop="ownername">
          <el-input v-model="addOwnerForm.ownername" clearable></el-input>
        </el-form-item>
        <el-form-item label="楼栋" prop="buildingid">
          <el-select label="楼栋" v-model="addOwnerForm.buildingid" clearable placeholder="请选择" style="width:100%" >
            <el-option
                v-for="item in building"
                :key="item.buildingid"
                :label="item.buildingname"
                :value="item.buildingid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌" prop="houseid">
<!--          <el-select label="门牌" v-model="addOwnerForm.houseid" clearable placeholder="请选择"-->
<!--                     @click.native="getHouse(addForm.buildingid)"-->
<!--                     style="width:100%" >-->
<!--            <el-option-->
<!--                v-for="item in house"-->
<!--                :key="item.houseid"-->
<!--                :label="item.housename"-->
<!--                :value="item.houseid">-->
<!--            </el-option>-->
<!--          </el-select>-->
          <el-input v-model="addOwnerForm.houseid" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select label="性别" v-model:title="addOwnerForm.sex" clearable placeholder="请选择" style="width:100%">
            <el-option value="1" label="男"/>
            <el-option value="0" label="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addOwnerForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addOwnerForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="入住时间" prop="createtime">
          <el-date-picker
              v-model="addOwnerForm.createtime"
              type="date"
              placeholder="选择日期"
              　　　　　　 value-format="yyyy-MM-dd" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="addOwnerForm.remarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOwnerDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


export default {
  created() {
    this.getUserList();
    this.getBuilding();
    this.getAllOwner();
  },
  data() {
    return {
      //查询实体
      queryInfo: {
        housename: "",
        pageNum: 1,
        pageSize: 5,
      },
      houseList: [],
      building: [],
      house:[],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addOwnerDialogVisible: false,
      addOwnerForm: {
        ownername: "",
        buildingid: "",
        houseid: "",
        sex: "",
        phone: "",
        email: "",
        createtime: new Date(),
        remarks: "",
      },
      //添加跳单信息
      addForm: {
        houseid: "",
        buildingid: "",
        housename: "",
        ownerid:0
      },
      editForm: {
        houseid: "",
        buildingid: "",
        housename: "",
      },
      owner: [],
      //表单认证
      addFormRules: {
        username: [
          {required: true, message: "请输入业主名称", trigger: 'blur'},
          {min: 2, max: 15, message: "请输入2到15个字符", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入业主名称", trigger: 'blur'},
          {min: 2, max: 15, message: "请输入2到15个字符", trigger: "blur"}
        ],
        ownerid: [
          {required: true, message: "请输入业主名称", trigger: 'blur'},
          {min: 2, max: 15, message: "请输入2到15个字符", trigger: "blur"}
        ],

      }
    }
  },
  methods: {
    //获取所有用户
    async getUserList() {
      let {data: res} = await this.$http.get("house", {params: this.queryInfo})
      this.houseList = res.data;
      this.total = res.numbers;
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
    addHouse() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.post("house", this.addForm);
        if (res !== "success") {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功")
        this.addDialogVisible = false;
        console.log(res)
        await this.getUserList();
      })
    },
    addUser() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.post("owner", this.addOwnerForm);
        if (res !== "success") {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功")
        this.addOwnerDialogVisible = false;
        console.log(res)
        await this.getUserList();
      })
    },
    editUser() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.put("house", this.editForm);
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
      this.editForm.houseid = ""
      let {data: res} = await this.$http.get("house/building?buildingid=" + id)
      this.house = res.data;
    },
    setDate(row, column) {
      let date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD");
    },
    showEditDialog(res) {
      this.editDialogVisible = true;
      this.editForm.buildingid=Number(res.buildingid),
          this.editForm.houseid=Number(res.houseid),
      this.editForm.housename = res.housename
    },
    addOwner(res) {
      if (res.ownerid != 0) {
        this.$alert('已登记有业主', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `登记失败`
            });
          }
        });
      } else {
        this.addOwnerDialogVisible = true;
        this.addOwnerForm.buildingid=res.buildingid
        this.addOwnerForm.houseid=res.housename
      }
  },
  async deleteUser(id) {
    let {data: res} = await this.$http.delete("house?id=" + id)
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
