<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>住户管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主体 -->
    <el-card style="border-radius: 10px">
      <!--搜索区-->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-input placeholder="请输入要搜索的内容" v-model="queryInfo.username" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表 border边框 stripe隔行变色-->
      <el-table :data="userList" border stripe>
        <!--  索引列-->
        <el-table-column prop="userid" width="40px">
        </el-table-column>
        <el-table-column label="用户昵称" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="业主名称" prop="ownerid">
          <template slot-scope="scope">
            {{ scope.row.owner.ownername }}
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="ownerid">
          <template slot-scope="scope">
            {{ scope.row.owner.houses.housename}}
          </template>
        </el-table-column>
        <el-table-column label="头像" prop="avater"  align="center">
          <el-avatar :size="100" slot-scope="scope">
              {{scope.row.username}}
          </el-avatar>
        </el-table-column>
        <el-table-column label="状态" prop="status"  align="center">
          <template slot-scope="scope">
            <el-switch :active-value="1"
                       :inactive-value="0" v-model="scope.row.status" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="deleteUser(scope.row.userid)"></el-button>
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" clearable></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" clearable type="password"></el-input>
        </el-form-item>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" clearable></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="业主编号" prop="ownerId">
          <el-select v-model="editForm.ownerid" filterable placeholder="请选择">
          <el-option
              v-for="item in owner"
              :key="item.ownerid"
              :label="item.ownerid+':'+item.ownername"
              :value="item.ownerid">
          </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editUser">确定</el-button>
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
        username: "",
        pageNum: 1,
        pageSize: 5,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      //添加跳单信息
      addForm: {
        username: "",
        password: "",
        ownerid: "",
      },
      editForm: {
        userid:"",
        username: "",
        password: "",
        ownerid: "",
      },
      owner:[],
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
      let {data: res} = await this.$http.get("user", {params: this.queryInfo})
      this.userList = res.data;
      this.total = res.numbers;
    },
    async getAllOwner(){
      let {data: res} = await this.$http.get("owner/list", {params: this.queryInfo})
      this.owner = res.data;
      console.log(this.owner)
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
      formData.append("userid", userInfo.userid);
      formData.append("status", userInfo.status);
      let {data: res} = await this.$http.put("user/status", formData)
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
        let {data: res} = await this.$http.post("user", this.addForm);
        if (res !== "success") {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功")
        this.addDialogVisible = false;
        console.log(res)
        await this.getUserList();
      })
    },
    editUser() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.put("user", this.editForm);
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
      this.editForm.userid=res.userid
      this.editForm.username=res.username
      this.editForm.password=res.password
      this.editForm.ownerid=res.ownerid
    },
    async deleteUser(id) {
      let {data: res} = await this.$http.delete("user?id=" + id)
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
