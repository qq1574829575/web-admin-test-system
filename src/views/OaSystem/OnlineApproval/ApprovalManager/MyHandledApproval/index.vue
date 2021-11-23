<template>
  <!--已处理的审批列表-->
  <el-card class="fq-custom-card">
    <el-input
      v-model="searchContent"
      placeholder="搜索审批名称"
      class="input-with-select"
      size="mini"
      style="width: 300px"
      clearable
      @clear="buildParams"
    >
      <el-button slot="append" icon="el-icon-search" @click="buildParams" />
    </el-input>
    <base-table
      ref="table"
      :request-config="requestConfig"
      :column-width="columnWidth"
      show-index
      size="mini"
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
            <template slot-scope="scope">
              <el-tag
                size="mini"
                :type="scope.row.status === '3' ? 'success' : scope.row.status === '5' ? 'danger' : 'info'"
              >
                {{ scope.row.status === '3' ? '已通过' : scope.row.status === '5' ? '已驳回' : '发起人已撤回' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop !== 'workId' && item.prop !== 'workContent' && item.prop !== 'deptName' && item.prop !== 'formNodeArr'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          />
        </template>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="previewApprovalDetail(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>
    <show-approval-detail
      :visible.sync="showApprovalDetail"
      :approval-id="approvalId"
    />
  </el-card>
</template>

<script>
import BaseTable from '@/components/tableBase'
import ShowApprovalDetail from '@/views/OaSystem/OnlineApproval/components/ShowApprovalDetail'
export default {
  name: 'Index',
  components: { ShowApprovalDetail, BaseTable },
  data() {
    return {
      searchContent: '',
      columnWidth: [],
      requestConfig: {},
      showApprovalDetail: false,
      approvalId: 0
    }
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: '/jiangoaoffice/Office/work/GetOverOfficeWorkList.php',
        parameter: {
          page: 1,
          rows: 10,
          workName: this.searchContent
        }
      }
    },
    previewApprovalDetail(row) {
      this.approvalId = row.workId
      this.showApprovalDetail = true
    }
  }
}
</script>

<style scoped>

</style>
