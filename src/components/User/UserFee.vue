<template>
  <div>
    <template>
      <el-card shadow="hover">
        <span>电费</span>
        <el-table
            :data="fee_power"
            style="width: 100%">
          <el-table-column
              prop="paymonth"
              label="日期"
              width="180">
          </el-table-column>
          <el-table-column
              prop="powernum"
              label="仪表读数">
          </el-table-column>
          <el-table-column
              prop="paymoney"
              label="金额">
          </el-table-column>
          <el-table-column
              prop="ispay"
              label="是否缴费">
            <template slot-scope="scope">
              {{ scope.row.ispay == 0 ? "尚未缴费" : "已缴费" }}
            </template>
          </el-table-column>
          <el-table-column
              prop="cuozuo"
              label="操作"
              width="180">
            <template slot-scope="scope">
              <el-button @click="pay(scope.row,1)" v-if="scope.row.ispay!=1?true:false">缴费</el-button>
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
              :total="power_total">
          </el-pagination>
        </div>
      </el-card>
      <el-card shadow="hover">
        <span>水费</span>
        <el-table
            :data="fee_water"
            style="width: 100%">
          <el-table-column
              prop="paymonth"
              label="日期"
              width="180" :formatter="setDate">
          </el-table-column>
          <el-table-column
              prop="waternum"
              label="仪表读数">
          </el-table-column>
          <el-table-column
              prop="paymoney"
              label="金额">
          </el-table-column>
          <el-table-column
              prop="ispay"
              label="是否缴费">
            <template slot-scope="scope">
              {{ scope.row.ispay != 1 ? "尚未缴费" : "已缴费" }}
            </template>
          </el-table-column>
          <el-table-column
              prop="cuozuo"
              label="操作"
              width="180">
            <template slot-scope="scope">
              <el-button @click="pay(scope.row,2)" v-if="scope.row.ispay!=1?true:false">缴费</el-button>
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
              :total="water_total">
          </el-pagination>
        </div>
      </el-card>
      <el-card shadow="hover">
        <span>物业费</span>
        <el-table
            :data="fee_property"
            style="width: 100%">
          <el-table-column
              prop="paymonth"
              label="日期"
              width="180">
          </el-table-column>
          <el-table-column
              prop="house"
              label="单位">
            <template slot-scope="scope">
              {{ scope.row.owner.houses.housename }}
            </template>
          </el-table-column>
          <el-table-column
              prop="paymoney"
              label="金额">
          </el-table-column>
          <el-table-column
              prop="ispay"
              label="是否缴费">
            <template slot-scope="scope">
              {{ scope.row.ispay != 1 ? "尚未缴费" : "已缴费" }}
            </template>
          </el-table-column>
          <el-table-column
              prop="cuozuo"
              label="操作"
              width="180">
            <template slot-scope="scope">
              <el-button @click="pay(scope.row,3)" v-if="scope.row.ispay!=1?true:false">缴费</el-button>
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
              :total="water_total">
          </el-pagination>
        </div>
      </el-card>
    </template>
    <el-dialog :visible.sync="DialogVisible" width="400px">
      <el-card style="text-align: center;font-size: 24px">
        <span>收款￥{{ fee.paymoney }}元</span>
        <img :src="require('@/assets/images/pay.png')" width="320" height="480">
        <el-button @click="pay(0,0)">已支付</el-button>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getFeePowerList(),
        this.getFeeWaterList(),
        this.getFeeProperty()
  },
  data() {
    return {
      DialogVisible: false,
      fee_power: [],
      fee_water: [],
      fee_property: [],
      power_total: "",
      water_total: "",
      property_total: "",
      fee: "",
      type: "",
      //查询实体
      queryInfo: {
        ownerid: "",
        PayMonth: "",
        pageNum: 1,
        pageSize: 5,
        isPay: false
      },
    }
  },
  methods: {
    async pay(money, type) {

      this.DialogVisible = !this.DialogVisible;
      if (money == 0) {
        switch (this.type) {
          case 1:
            let {data: power} = await this.$http.get("feePower/status?id=" + this.fee.powerid)
            if (power !== "success") {
              return this.$message.error("修改失败")
            }
            this.$message.success("修改成功")
            await this.getFeePowerList()
            break;
          case 2:
            let {data: water} = await this.$http.get("feeWater/status?id=" + this.fee.waterid)
            console.log(water)
            if (water !== "success") {
              return this.$message.error("修改失败")
            }
            this.$message.success("修改成功")
            await this.getFeeWaterList()
            break;
          case 3:
            let {data: property} = await this.$http.get("feeProperty/status?id=" + this.fee.propertyid)
            if (property !== "success") {
              return this.$message.error("修改失败")
            }
            this.$message.success("修改成功")
            await this.getFeeProperty()
            break;
          default:
            break;
        }
      } else {
        this.fee = money
        this.type = type;
      }
    },
    async getFeePowerList() {
      let user = window.sessionStorage.getItem("user")
      this.queryInfo.ownerid = user
      let {data: res} = await this.$http.get("feePower", {params: this.queryInfo})
      this.fee_power = res.data;
      this.power_total = res.numbers;
      console.log(this.power_total)
    },
    async getFeeWaterList() {
      let {data: res} = await this.$http.get("feeWater", {params: this.queryInfo})
      this.fee_water = res.data;
      this.water_total = res.numbers;
    },
    async getFeeProperty() {
      let {data: res} = await this.$http.get("feeProperty", {params: this.queryInfo})
      this.fee_property = res.data;
      this.property_total = res.numbers;
    },
    setDate(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD");
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

<style scoped lang="less">
.el-card {
  border-radius: 15px;
  margin-bottom: 20px;
}
</style>
