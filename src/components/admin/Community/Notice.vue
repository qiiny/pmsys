<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>社区管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主体 -->
    <el-card style="border-radius: 10px">
      <!--搜索区-->
      <el-row :gutter="25">
        <el-col :span="8">
          <el-input placeholder="请输入要搜索的内容" v-model="queryInfo.ownerName" clearable @clear="getAllNotice">
            <el-button slot="append" icon="el-icon-search" @click="getAllNotice"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">发布公告</el-button>
        </el-col>
      </el-row>

      <!--用户列表 border边框 stripe隔行变色-->
      <el-table :data="noticeList" border stripe>
        <!--  索引列-->
        <el-table-column prop="noticeid" width="40px">
        </el-table-column>
        <el-table-column label="公告标题" width="180px" prop="noticetitle">
        </el-table-column>
        <el-table-column label="发布时间" prop="noticetime" :formatter="setDate" width="180px"></el-table-column>
        <el-table-column label="公告内容" prop="content"></el-table-column>
        <el-table-column label="操作" align="center" width="180px">
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
    <el-dialog title="发布公告" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="公告标题" prop="noticetitle">
          <el-input v-model="addForm.noticetitle" clearable></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="addForm.content" clearable type="textarea"
                    :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addNotice">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑公告" :visible.sync="editDialogVisible" width="40%" @close="addDialogClosed()">
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="addFormRules"
               label-width="80px"
               label-position="right">
        <el-form-item label="公告标题" prop="noticetitle">
          <el-input v-model="editForm.noticetitle" clearable></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="editForm.content" clearable type="textarea"
                    :rows="4"></el-input>
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
    this.getAllNotice();
  },
  data() {
    return {
      //查询实体
      queryInfo: {
        noticeTitle: "",
        pageNum: 1,
        pageSize: 5,
      },
      noticeList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      //添加跳单信息
      addForm: {
        noticeid:"",
        noticetime:new Date(),
        noticetitle:"",
        content:"",
        status:"",
      },
      editForm: {
        noticeid:"",
        noticetitle:"",
        content:"",
        status:"",
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
    async getAllNotice() {
      // let {data: res} = await this.$http.get("feeWater?ownerId="+this.queryInfo.ownerid+"&PayMonth="+this.queryInfo.PayMonth+"&pageNum="+this.queryInfo.pageNum+"&pageSize="+this.queryInfo.pageSize)
      let {data: res} = await this.$http.get("notice", {params: this.queryInfo})
      this.noticeList = res.data;
      this.total = res.numbers;
    },
    //最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getAllNotice();
    },
    //pageNum触发动作
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getAllNotice();
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
    addNotice() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.post("notice", this.addForm);
        if (res !== "success") {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功")
        this.addDialogVisible = false;
        console.log(res)
        await this.getAllNotice();
      })
    },
    editOwner() {
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.put("notice", this.editForm);
        if (res !== "success") {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功")
        this.editDialogVisible = false;
        console.log(res)
        await this.getAllNotice();
      })
    },

    setDate(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM");
    },
    async deleteUser(id) {
      let {data: res} = await this.$http.delete("notice?id=" + id)
      if (res !== "success") {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功")
      await this.getAllNotice();
    },
    showEditDialog(res) {
      this.editDialogVisible = true;
      this.editForm.noticeid=res.noticeid
      this.editForm.noticetitle=res.noticetitle
      this.editForm.content=res.content
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
