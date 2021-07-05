<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="50%"
    @open="getList"
  >
    <el-table
      ref="table"
      size="small"
      height="50vh"
      :data="tableData"
      :lazy="true"
      empty-text="暂无数据"
    >
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="津贴名称">
        <template slot-scope="scope">
          {{ scope.row.allowanceName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="津贴金额">
        <template slot-scope="scope">
          {{ scope.row.allowanceMoney }}
        </template>
      </el-table-column>
    </el-table>
    <el-tag style="margin-top: 15px;float:right;" type="success">合计：￥{{ total }}</el-tag>
    <el-pagination
      style="margin-top: 15px;"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="pageConfig.currentPage"
      :page-size="pageConfig.pageSize"
      :page-sizes="[pageConfig.pageSize, 20, 50, 100]"
      :total="parseInt(pageConfig.total)"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-dialog>
</template>

<script>

import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'AllowanceListDialolg',
  props: {
    name: {
      type: String,
      default: '津贴或奖励'
    },
    total: {
      type: Number,
      default: 0
    },
    wageDate: {
      type: String,
      default: ''
    },
    wageTeacherNo: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rows: 10,
      page: 1,
      tableData: [],
      pageConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    getList() {
      request({
        url: '/personnelsystem/PersonSystem/wage/GetWageAllowanceList.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school({
            page: this.page,
            rows: this.rows,
            wageDate: this.wageDate,
            wageTeacherNo: this.wageTeacherNo
          })
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.rows
        this.pageConfig.total = res.total
      })
    },
    onClose() {
      this.rows = 10
      this.page = 1
      this.tableData = []
      this.pageConfig = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.$emit('update:visible', false)
    },
    handleSizeChange(val) {
      this.rows = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    }
  }
}
</script>

<style scoped>
</style>
