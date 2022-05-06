<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主体 -->
    <el-card style="border-radius: 10px">
      <!--搜索区-->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-input placeholder="请输入要搜索的内容" v-model="queryInfo.staffname" clearable @clear="getStaffList">
            <el-button slot="append" icon="el-icon-search" @click="getStaffList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加员工</el-button>
        </el-col>
      </el-row>

      <!--用户列表 border边框 stripe隔行变色-->
      <el-table :data="staffList" border stripe>
        <!--  索引列-->
        <el-table-column prop="staffid" width="40px">
        </el-table-column>
        <el-table-column label="员工名称" prop="staffname"></el-table-column>
        <el-table-column label="员工手机号码" prop="staffphone"></el-table-column>
        <el-table-column label="所处岗位" prop="staffpost">
          <template slot-scope="scope">
            {{post(scope.row.staffpost)}}
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
                         @click="deleteUser(scope.row.staffid)"></el-button>
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
        <el-form-item label="员工名称" prop="staffname">
          <el-input v-model="addForm.staffname" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工手机" prop="staffphone">
          <el-input v-model="addForm.staffphone" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工岗位" prop="staffpost">
          <el-select label="性别" v-model:title="addForm.staffpost" clearable placeholder="请选择" style="width:100%">
            <el-option value="0" label="电工"/>
            <el-option value="1" label="水管工"/>
            <el-option value="1" label="清洁工"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addStaff">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改住户" :visible.sync="editDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="员工名称" prop="staffname">
          <el-input v-model="editForm.staffname" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工手机" prop="staffphone">
          <el-input v-model="editForm.staffphone" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工岗位" prop="staffpost">
          <el-select label="性别" v-model:title="editForm.staffpost" clearable placeholder="请选择" style="width:100%">
            <el-option value="0" label="电工"/>
            <el-option value="1" label="水管工"/>
            <el-option value="1" label="清洁工"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editStaff">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


export default {
  created() {
    this.getStaffList();
  },
  data() {
    return {
      //查询实体
      queryInfo: {
        staffname: "",
        pageNum: 1,
        pageSize: 5,
        staffpost:""
      },
      staffList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      //添加跳单信息
      addForm: {
        staffid: "",
        staffname: "",
        staffphone: "",
        staffpost:""
      },
      editForm: {
        staffid: "",
        staffname: "",
        staffphone: "",
        staffpost:""
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
    async getStaffList() {
      let {data: res} = await this.$http.get("staff", {params: this.queryInfo})
      this.staffList = res.data;
      this.total = res.numbers;
    },
    //最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getStaffList();
    },
    //pageNum触发动作
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getStaffList();
    },

    //监听添加用户
    addDialogClosed() {
      this.$refs.addFormRules.resetFields();
    },
    addStaff() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.post("staff", this.addForm);
        if (res !== "success") {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功")
        this.addDialogVisible = false;
        console.log(res)
        await this.getStaffList();
      })
    },
    editStaff() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.put("staff", this.editForm);
        if (res !== "success") {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功")
        this.editDialogVisible = false;
        console.log(res)
        await this.getStaffList();
      })
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
      console.log(res.staffid)
      this.editForm.staffid=res.staffid
      this.editForm.staffname=res.staffname
      this.editForm.staffphone=res.staffphone
      this.editForm.staffpost=res.staffpost
    },
    async deleteUser(id) {
      let {data: res} = await this.$http.delete("staff?id=" + id)
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功")
      await this.getStaffList();
    },
    validatorPhone(rule, value, callback) {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    },
    post(post){
      switch (post) {
        case post="0":
          return "电工";
        case post="1":
          return "水管工";
        case post="2":
          return "清洁工";
        default:
          return "外聘专业人员"
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
