<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      size="small"
      :data="tableData"
      :height="tableHeight"
      :lazy="true"
      empty-text="暂无数据"
      :default-expand-all="defaultExpandAll"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="50"
        fixed="left"
        align="center"
      />
      <el-table-column
        v-if="hasSelection"
        type="selection"
        width="55"
        fixed="left"
      />
      <slot :columnConfig="columnConfig" />
    </el-table>
    <el-pagination
      v-if="paging"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="1"
      :page-size="pageSize"
      :page-sizes="[20, 50, 100, 150, 200, 500, 1000]"
      :total="parseInt(tableTotal)"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'BaseTable',
  props: {
    hasSelection: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    showIndex: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    defaultExpandAll: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    paging: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    requestConfig: {
      type: Object,
      default: function() {
        return undefined
      }
    },
    tableName: {
      type: String,
      default: function() {
        return ''
      }
    },
    columnWidth: {
      type: Array,
      default: function() {
        return undefined
      }
    }
  },
  data() {
    return {
      currentPage: 1,
      currentRows: 20,
      pageSize: 20,
      loading: false,
      tableHeader: [], // 表头
      columnKey: [], // 列的key(列的字段名)
      columnConfig: [], // 列的配置
      tableData: [],
      tableTotal: undefined,
      tableHeight: null, // 表格高度
      screenHeight: window.innerHeight,
      timer: false
    }
  },
  watch: {
    requestConfig: function() {
      this.httpGetTable()
    },
    screenHeight(val) {
      if (!this.timer) {
        this.screenHeight = val
        this.tableHeight = this.screenHeight - 250
        this.timer = true
        setTimeout(() => {
          this.timer = false
        }, 200)
      }
    }
  },
  mounted() {
    this.getHeight()
    window.onresize = () => {
      this.screenHeight = window.innerHeight
    }
  },
  methods: {
    handleSizeChange(val) {
      this.currentRows = val
      this.httpGetTable()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.httpGetTable()
    },
    httpGetTable() {
      this.loading = true
      this.$http.post(this.requestConfig.url, {
        param: rsaUtil.encryption_school_long({
          ...this.requestConfig.data,
          page: this.currentPage,
          rows: this.currentRows
        }),
        ...this.requestConfig.notRsaData
      }).then(res => {
        this.tableData = res.rows
        this.tableTotal = res.total
        this.$emit('onGetResData', res)
        if (this.tableHeader.length === 0 || this.columnKey.length === 0) {
          for (const key in this.tableData[0]) {
            this.columnKey.push(key)
          }
          this.tableHeader = [].concat(res.title)
          const output = this.tableHeader.map((label, i) => ({
            label,
            prop: this.columnKey[i],
            width: this.columnWidth[i]
          }))
          this.columnConfig = [].concat(output)
        }
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.tableData = []
        this.tableTotal = 0
      })
    },
    getHeight() {
      this.screenHeight = window.innerHeight
      this.tableHeight = this.screenHeight - 250
    },
    handleSelectionChange(val) {
      let selectionArr = []
      selectionArr = val
      this.$emit('onSelectionChange', selectionArr, this.tableHeader)
    }
  }
}
</script>

<style scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
