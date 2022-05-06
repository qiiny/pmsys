<template>
  <div>
    <template>
      <el-card shadow="hover">
        <span>电费</span>
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column
              prop="date"
              label="日期"
              width="180">
          </el-table-column>
          <el-table-column
              prop="type"
              label="费用类型"
              width="180">
          </el-table-column>
          <el-table-column
              prop="num"
              label="仪表读数">
          </el-table-column>
          <el-table-column
              prop="money"
              label="金额">
          </el-table-column>
          <el-table-column
              prop="pay"
              label="是否缴费">
          </el-table-column>
          <el-table-column
              prop="cuozuo"
              label="操作"
              width="180">
            <el-button>缴费</el-button>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card shadow="hover">
        <span>水费</span>
        <el-table
            :data="tableData1"
            style="width: 100%">
          <el-table-column
              prop="date"
              label="日期"
              width="180">
          </el-table-column>
          <el-table-column
              prop="type"
              label="费用类型"
              width="180">
          </el-table-column>
          <el-table-column
              prop="num"
              label="仪表读数">
          </el-table-column>
          <el-table-column
              prop="money"
              label="金额">
          </el-table-column>
          <el-table-column
              prop="pay"
              label="是否缴费">
          </el-table-column>
          <el-table-column
              prop="cuozuo"
              label="操作"
              width="180">
            <el-button>缴费</el-button>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card shadow="hover">
        <span>物业费</span>
        <el-table
            :data="tableData2"
            style="width: 100%">
          <el-table-column
              prop="date"
              label="日期"
              width="180">
          </el-table-column>
          <el-table-column
              prop="type"
              label="费用类型"
              width="180">
          </el-table-column>
          <el-table-column
              prop="num"
              label="仪表读数">
          </el-table-column>
          <el-table-column
              prop="money"
              label="金额">
          </el-table-column>
          <el-table-column
              prop="pay"
              label="是否缴费">
          </el-table-column>
          <el-table-column
              prop="cuozuo"
              label="操作"
              width="180">
            <el-button>缴费</el-button>
          </el-table-column>
        </el-table>
      </el-card>
    </template>
    <el-dialog :visible.sync="DialogVisible" width="400px">
      <el-card style="text-align: center;font-size: 24px">
        <span >收款￥55元</span>
        <img :src="require('@/assets/images/pay.png')" width="320" height="480">
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      DialogVisible:true,
      tableData: [{
        date: '2022-03',
        type: '电费',
        num: '55',
        money:"55",
        pay:"否",
      }],
      tableData1: [{
        date: '2022-03',
        type: '水费',
        num: '10',
        money:"20",
        pay:"否",
      }],
      tableData2: [{
        date: '2022-03',
        type: '物业',
        num: '无',
        money:"1000",
        pay:"否",
      }],
    }
  }
}
</script>

<style scoped lang="less">
.el-card{
  border-radius: 15px;
  margin-bottom: 20px;
}
</style>
