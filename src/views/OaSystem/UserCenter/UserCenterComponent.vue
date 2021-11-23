<template>
  <div>
    <el-select
      v-show="page === 'index'"
      v-model="type"
      placeholder="请选择"
      size="mini"
      style="width: 100px;margin-left: 10px;"
      @change="buildParams"
    >
      <el-option label="全部" value="99" />
      <el-option label="任务" value="1" />
      <el-option label="审批" value="2" />
    </el-select>
    <el-input
      v-show="page === 'index'"
      v-model="searchName"
      placeholder="搜索"
      class="input-with-select"
      clearable
      size="mini"
      style="width: 200px;margin-left: 10px;"
      @clear="buildParams"
    >
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
            v-if="item.prop === 'type'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
            <template v-slot="scope">
              <el-tag>{{ scope.row.type === '1'?'审批':'任务' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop === 'statusName'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
            <template v-slot="scope">
              <div v-if="scope.row.type === '1'">
                <!--审批-->
                <el-tag v-if="scope.row.statusName === '待提交'">待提交</el-tag>
                <el-tag v-if="scope.row.statusName === '审批中'" type="warning">审批中</el-tag>
                <el-tag v-if="scope.row.statusName === '已完成'" type="success">已通过</el-tag>
                <el-tag v-if="scope.row.statusName === '被驳回'" type="danger">被驳回</el-tag>
                <el-tag v-if="scope.row.statusName === '已撤回'" type="info">已撤回</el-tag>
              </div>
              <div v-else>
                <!--任务-->
                <el-tag v-if="scope.row.statusName === '待办'">待办</el-tag>
                <el-tag v-if="scope.row.statusName === '待阅'" type="warning">待阅</el-tag>
                <el-tag v-if="scope.row.statusName === '办结'" type="success">办结</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop !== 'mainId' && item.prop !== 'statusFlag'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          />
        </template>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.statusFlag === '1' || scope.row.statusFlag === '2'">
              <!--statusFlag=1时说明是我创建的进行中的任务，此时可以查看和删除-->
              <!-- statusFlag=2时说明是我创建的已办结的任务，此时可以查看和删除 -->
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-view"
                @click="handlePreviewTask(scope.row)"
              >
                查看
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDeleteTask(scope.row)"
              >
                删除
              </el-button>
            </div>
            <div v-if="scope.row.statusFlag === '3' || scope.row.statusFlag === '4' || scope.row.statusFlag === '5'">
              <!--当statusFlag=3时，说明是发给我的待办的任务，此时只有处理按钮-->
              <!--当statusFlag=4时，说明是发给我的待阅的任务，此时只有处理按钮-->
              <!--当statusFlag=5时，说明是发给我的任务，但是我已办结，此时只有查看按钮-->
              <el-button
                type="primary"
                size="mini"
                @click="handleTask(scope.row)"
              >
                {{ scope.row.statusFlag === '5' ? '查看' : '处理' }}
              </el-button>
            </div>
            <div v-if="scope.row.statusFlag === '6' || scope.row.statusFlag === '8' || scope.row.statusFlag === '9'">
              <!--statusFlag=6是我创建的待提交的审批 8是我创建的被驳回的审批 9是我创建的已撤回的审批 这三种状态都可以编辑和删除-->
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editApproval(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="delApproval(scope.row)"
              >
                删除
              </el-button>
            </div>
            <div v-if="scope.row.statusFlag === '7'">
              <!-- statusFlag=7是我创建的审批中的审批，此时可以查看和撤回 -->
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-view"
                @click="previewApprovalDetail(scope.row)"
              >
                查看
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-refresh-left"
                @click="withdrawApproval(scope.row)"
              >
                撤回
              </el-button>
            </div>
            <div v-if="scope.row.statusFlag === '10'">
              <!-- statusFlag=10是我创建的已通过的审批，此时可以只查看 -->
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-view"
                @click="previewApprovalDetail(scope.row)"
              >
                查看
              </el-button>
            </div>
            <div v-if="scope.row.statusFlag === '11' || scope.row.statusFlag === '12'">
              <!-- statusFlag=11 12是我收到的待办和待阅的审批，此时可以只可以处理 -->
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-mouse"
                @click="handleApproval(scope.row)"
              >
                处理
              </el-button>
            </div>
            <div v-if="scope.row.statusFlag === '13'">
              <!-- statusFlag=13是我收到的已处理的审批，此时只可以查看 -->
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-view"
                @click="previewApprovalDetail(scope.row)"
              >
                查看
              </el-button>
            </div>
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
    <handle-approval
      :visible.sync="showHandleApproval"
      :approval-id="approvalId"
      @onHandled="onHandleApproval"
    />
    <preview-task
      v-show="page === 'PreviewTask'"
      ref="previewTask"
      @close="onReturnIndexPage"
    />
    <handle-task
      v-show="page === 'HandleTask'"
      ref="handleTask"
      @close="onReturnIndexPage"
    />
  </div>
</template>

<script>
import HandleTask from '@/views/OaSystem/taskManager/components/HandleTask'
import HandleApproval from '@/views/OaSystem/OnlineApproval/ApprovalManager/MyTodoApproval/components/HandleApproval'
import PreviewTask from '@/views/OaSystem/taskManager/components/PreviewTask'
import BaseTable from '@/components/tableBase'
import EditApproval from '@/views/OaSystem/OnlineApproval/ApprovalManager/MyCreatedApproval/components/EditApproval'
import ShowApprovalDetail from '@/views/OaSystem/OnlineApproval/components/ShowApprovalDetail'
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'UserCenterComponent',
  components: {
    BaseTable, EditApproval, ShowApprovalDetail, PreviewTask, HandleApproval, HandleTask
  },
  props: {
    flag: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      columnWidth: [],
      requestConfig: {},
      showApprovalDetail: false,
      showHandleApproval: false,
      approvalId: 0,
      page: 'index',
      searchName: '',
      type: '99'
    }
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: 'jiangoaoffice/Office/wxmini/GetMiniOfficeList.php',
        parameter: {
          page: 1,
          rows: 10,
          flag: this.flag,
          searchName: this.searchName,
          type: this.type
        }
      }
    },
    previewApprovalDetail(row) {
      this.approvalId = row.mainId
      this.showApprovalDetail = true
    },
    handleApproval(row) {
      this.approvalId = row.workId
      this.showHandleApproval = true
    },
    withdrawApproval(row) {
      this.$confirm('您确定要撤回该审批吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/jiangoaoffice/Office/work/ModifyBackOfficeWork.php', {
          param: rsaUtil.encryption({
            workId: row.mainId
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
    editApproval(row) {
      this.page = 'editApproval'
      this.$refs.editApproval.loadApprovalDetail(row.mainId)
    },
    delApproval(row) {
      this.$confirm('您确定要删除该审批吗，删除后不可恢复？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/jiangoaoffice/Office/work/DelOfficeWork.php', {
          param: rsaUtil.encryption({
            workId: row.mainId
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
    onHandleApproval() {
      this.requestConfig = Object.assign({}, this.requestConfig)
    },
    onReturnIndexPage() {
      this.page = 'index'
      this.requestConfig = Object.assign({}, this.requestConfig)
    },
    handlePreviewTask(row) {
      this.page = 'PreviewTask'
      this.$nextTick(() => {
        this.$refs.previewTask.loadTask(row.mainId)
      })
    },
    handleTask(row) {
      this.page = 'HandleTask'
      this.$nextTick(() => {
        this.$refs.handleTask.loadTask(row.mainId)
      })
    },
    handleDeleteTask(row) {
      this.$confirm('您确定要删除该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/jiangoaoffice/Office/task/DeleteOfficeTask.php', {
              param: rsaUtil.encryption({
                taskId: row.mainId
              })
            }, {
              baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
            })
            .then(res => {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.requestConfig = Object.assign({}, this.requestConfig)
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
