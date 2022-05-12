<template>
  <div>
    <el-card shadow="hover">
      <span>投诉记录</span>
      <el-table
          :data="repairList"
          style="width: 100%">
        <el-table-column
            prop="ownerid"
            label="投诉人"
            width="180">
          <template slot-scope="scope">
            {{ scope.row.owner.ownername }}
          </template>
        </el-table-column>
        <el-table-column
            prop="complaints"
            label="投诉内容"
            width="180">
        </el-table-column>
        <el-table-column
            prop="reply"
            label="物业回复">
        </el-table-column>
        <el-table-column
            prop="revoke"
            label="撤销投诉"
            width="180">
          <template slot-scope="scope">
            <el-switch :active-value="1"
                       :inactive-value="0" v-model="scope.row.revoke" @change="userStateChange(scope.row)"></el-switch>
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
      <el-form ref="addFormRules" :rules="addFormRules" :model="form" label-width="80px">
        <el-form-item label="发送">
          <span>物业管理人员</span>
        </el-form-item>
        <el-form-item label="详细内容" prop="complaints">
          <el-input
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 20}"
              placeholder="请输入内容"
              v-model="form.complaints">
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
    this.getRepairList()
  },
  data() {
    return {
      queryInfo: {
        createtime: "",
        ownerid: window.sessionStorage.getItem("user"),
        pageNum: 1,
        pageSize: 5,
      },
      total: "",
      repairList: "",
      form: {
        ownerid: '',
        complaints: '',
      },
      building: "",
      house: "",
      addFormRules: {
        complaints: [
          {required: true, message: "请输入投诉内容", trigger: 'blur'},
          {min: 2, max: 15, message: "请输入2到255个字符", trigger: "blur"}
        ],
      }
    }
  },
  methods: {
    addRepair() {
      let user = window.sessionStorage.getItem("user")
      this.form.ownerid = user
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.post("complaint", this.form);
        if (res !== "success") {
          return this.$message.error("投诉失败");
        }
        this.$message.success("投诉成功")
        this.form = []
        await this.getRepairList();
      })
    },
    //获取所有用户
    async getRepairList() {
      let {data: res} = await this.$http.get("complaint", {params: this.queryInfo})
      this.repairList = res.data;
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
    async userStateChange(userInfo) {
      let formData = new FormData();
      formData.append("complaintid", userInfo.complaintid);
      formData.append("revoke", userInfo.revoke);
      let {data: res} = await this.$http.put("complaint/status", formData)
      if (res !== "success") {
        userInfo.id = !userInfo.id;
        return this.$message.error("修改失败")
      }
      this.$message.success("修改成功")
    },
  }
}
</script>

<style scoped>
.el-card {
  border-radius: 10px;
}
</style>
