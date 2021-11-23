<template>
  <!--我的审批-->
  <el-card class="fq-custom-card">
    <el-input
      v-model="searchContent"
      placeholder="搜索审批"
      class="input-with-select"
      size="mini"
      style="width: 300px"
    >
      <el-select
        slot="prepend"
        v-model="searchType"
        placeholder="请选择"
        style="width: 100px"
        @change="buildParams"
      >
        <el-option label="全部" value="99" />
        <el-option label="待办" value="1" />
        <el-option label="待阅" value="2" />
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="buildParams" />
    </el-input>
    <base-table
      ref="table"
      :request-config="requestConfig"
      :column-width="columnWidth"
      show-index
      size="medium"
    >
      <template v-slot="columnConfig">
        <template v-for="item in columnConfig.columnConfig">
          <el-table-column
            v-if="item.prop === 'status'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
            <template>
              <el-tag>待处理</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop !== 'workId' && item.prop !== 'workContent' && item.prop !== 'formNodeArr' && item.prop !== 'deptName'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          />
        </template>
        <el-table-column label="操作" fixed="right" width="100px" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-mouse"
              @click="handleApproval(scope.row)"
            >
              处理
            </el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>
    <handle-approval
      :visible.sync="showHandleApproval"
      :approval-id="approvalId"
      @onHandled="onHandled"
    />
  </el-card>
</template>

<script>
import BaseTable from '@/components/tableBase'
import HandleApproval from './components/HandleApproval'
export default {
  name: 'Index',
  components: { HandleApproval, BaseTable },
  data() {
    return {
      columnWidth: [],
      requestConfig: {},
      searchType: '99',
      searchContent: '',
      approvalId: 0,
      showHandleApproval: false
    }
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: '/jiangoaoffice/Office/work/GetOfficeWorkList.php',
        parameter: {
          page: 1,
          rows: 10,
          workName: this.searchContent,
          readFlag: this.searchType
        }
      }
    },
    handleApproval(row) {
      this.approvalId = row.workId
      this.showHandleApproval = true
    },
    onHandled() {
      this.requestConfig = Object.assign({}, this.requestConfig)
    }
  }
}
</script>

<style scoped>

</style>
