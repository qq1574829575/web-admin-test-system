<template>
  <el-card class="fq-custom-card">
    <el-input
      v-show="page === 'index'"
      v-model="searchContent"
      placeholder="搜索审批名称"
      class="input-with-select"
      size="mini"
      style="width: 300px"
      clearable
      @clear="buildParams"
    >
      <el-select
        slot="prepend"
        v-model="searchType"
        placeholder="请选择"
        style="width: 120px"
        @change="buildParams"
      >
        <el-option label="全部" value="" />
        <el-option label="待提交" value="1" />
        <el-option label="审批中" value="2" />
        <el-option label="被驳回" value="5" />
        <el-option label="已撤回" value="7" />
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="buildParams" />
    </el-input>
    <base-table
      v-show="page === 'index'"
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
            width="120"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '1'">待提交</el-tag>
              <el-tag v-if="scope.row.status === '2'" type="warning">审批中</el-tag>
              <el-tag v-if="scope.row.status === '3'" type="success">已通过</el-tag>
              <!--<el-tag v-if="scope.row.status === '4'" type="warning">待阅</el-tag>-->
              <el-tag v-if="scope.row.status === '5'" type="danger">被驳回</el-tag>
              <!--<el-tag v-if="scope.row.status === '6'" type="danger">被驳回</el-tag>-->
              <el-tag v-if="scope.row.status === '7'" type="info">已撤回</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop === 'workName'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            v-else-if="item.prop !== 'workId' && item.prop !== 'workContent' && item.prop !== 'formNodeArr' && item.prop !== 'deptName'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
            show-overflow-tooltip
          />
        </template>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === '1' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '7'"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editApproval(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === '2' || scope.row.status === '4' || scope.row.status === '3'"
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="previewApprovalDetail(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="scope.row.status === '2'"
              size="mini"
              type="danger"
              icon="el-icon-refresh-left"
              @click="withdrawApproval(scope.row)"
            >
              撤回
            </el-button>
            <el-button
              v-if="scope.row.status === '1' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '7'"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delApproval(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>
    <show-approval-detail
      :visible.sync="showApprovalDetail"
      :approval-id="approvalId"
    />
    <edit-approval
      v-show="page === 'editApproval'"
      ref="editApproval"
      @close="onReturnIndexPage"
    />
  </el-card>
</template>

<script>
import BaseTable from '@/components/tableBase'
import { mapState } from 'vuex'
import rsaUtil from '@/utils/rsaUtil'
import ShowApprovalDetail from '../../components/ShowApprovalDetail'
import EditApproval from './components/EditApproval'
export default {
  name: 'Index',
  components: { EditApproval, ShowApprovalDetail, BaseTable },
  data() {
    return {
      page: 'index',
      columnWidth: [],
      requestConfig: {},
      searchContent: '',
      searchType: '',
      approvalId: 0,
      showApprovalDetail: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    onReturnIndexPage() {
      this.page = 'index'
      this.requestConfig = Object.assign({}, this.requestConfig)
    },
    buildParams() {
      this.requestConfig = {
        url: '/jiangoaoffice/Office/work/GetMineOfficeWorkList.php',
        parameter: {
          page: 1,
          rows: 10,
          workName: this.searchContent,
          status: this.searchType
        }
      }
    },
    editApproval(row) {
      this.page = 'editApproval'
      this.$refs.editApproval.loadApprovalDetail(row.workId)
    },
    previewApprovalDetail(row) {
      this.approvalId = row.workId
      this.showApprovalDetail = true
    },
    withdrawApproval(row) {
      this.$confirm('您确定要撤回该审批吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/jiangoaoffice/Office/work/ModifyBackOfficeWork.php', {
          param: rsaUtil.encryption({
            workId: row.workId
          })
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        }).then(res => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: res.data.message
          })
          this.requestConfig = Object.assign({}, this.requestConfig)
        })
      }).catch(() => {})
    },
    delApproval(row) {
      this.$confirm('您确定要删除该审批吗，删除后不可恢复？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/jiangoaoffice/Office/work/DelOfficeWork.php', {
          param: rsaUtil.encryption({
            workId: row.workId
          })
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        }).then(res => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: res.data.message
          })
          this.requestConfig = Object.assign({}, this.requestConfig)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
