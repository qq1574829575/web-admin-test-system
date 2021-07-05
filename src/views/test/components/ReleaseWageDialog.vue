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
      <el-table-column align="center" label="月份">
        <template slot-scope="scope">
          {{ scope.row.wageDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否已上传">
        <template>
          <el-tag type="success">已上传</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否已发布">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '3'" type="success">已发布</el-tag>
          <el-tag v-else type="danger">未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '1'" type="text" size="mini" @click="releaseWage(scope)">发布</el-button>
          <el-button v-if="scope.row.status === '1'" type="text" size="mini" @click="cancelWage(scope)">撤销工资</el-button>
          <el-button v-if="scope.row.status === '1'" type="text" size="mini" @click="cancelAllowance(scope)">撤销津贴</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  name: 'ReleaseWageDialog',
  props: {
    name: {
      type: String,
      default: '工资发布'
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
        url: '/personnelsystem/PersonSystem/wage/GetWageSubmitList.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school({
            page: this.page,
            rows: this.rows
          })
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.rows
        this.pageConfig.total = res.total
      })
    },
    onClose() {
      this.$parent.getList()
      this.$emit('update:visible', false)
    },
    handleSizeChange(val) {
      this.rows = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    releaseWage(data) {
      this.$confirm('您确定要发布' + data.row.wageDate + '的工资数据吗？发布后将不能撤销。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/personnelsystem/PersonSystem/wage/ModifyGroupTeacherWage.php',
          method: 'post',
          baseURL: 'http://www.unifiedplatform.guolianrobot.com',
          data: {
            param: rsaUtil.encryption_school({
              wageDate: data.row.wageDate,
              status: 3
            })
          }
        }).then(res => {
          this.getList()
          this.$notify({
            title: '提示',
            message: res.message,
            duration: 0
          })
        })
      }).catch(() => {
      })
    },
    cancelWage(data) {
      this.$confirm('您确定要撤销' + data.row.wageDate + '的工资数据吗？撤销后您还可以重新上传。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/personnelsystem/PersonSystem/wage/ModifyGroupTeacherWage.php',
          method: 'post',
          baseURL: 'http://www.unifiedplatform.guolianrobot.com',
          data: {
            param: rsaUtil.encryption_school({
              wageDate: data.row.wageDate,
              status: 4
            })
          }
        }).then(res => {
          this.getList()
          this.$notify({
            title: '提示',
            message: res.message,
            duration: 0
          })
        })
      }).catch(() => {
      })
    },
    cancelAllowance(data) {
      this.$confirm('您确定要撤销' + data.row.wageDate + '的津贴数据吗？撤销后您还可以重新上传。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/personnelsystem/PersonSystem/wage/ModifyGroupAllowance.php',
          method: 'post',
          baseURL: 'http://www.unifiedplatform.guolianrobot.com',
          data: {
            param: rsaUtil.encryption_school({
              wageDate: data.row.wageDate,
              status: 4
            })
          }
        }).then(res => {
          this.getList()
          this.$notify({
            title: '提示',
            message: res.message,
            duration: 0
          })
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
</style>
