<template>
  <div class="app-container">
    <el-card>
      <base-table
        v-show="switchPage === 'TaskList'"
        ref="table"
        :request-config="requestConfig"
        :column-width="columnWidth"
        show-index
        size="medium"
      >
        <template v-slot="columnConfig">
          <template v-for="item in columnConfig.columnConfig">
            <el-table-column
              v-if="item.prop === 'taskComProgress'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            >
              <template v-slot="scope">
                {{ scope.row.taskComProgress }}%
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'taskStatus'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            >
              <template v-slot="scope">
                <el-tag v-if="scope.row.taskStatus === '待阅'">待阅</el-tag>
                <el-tag v-if="scope.row.taskStatus === '待办'" type="warning">待办</el-tag>
                <el-tag v-if="scope.row.taskStatus === '办结'" type="success">办结</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop !== 'taskId'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            />
          </template>
          <el-table-column label="操作" fixed="right" width="240">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handlePreviewTask(scope.$index, scope.row)"
              >查看任务进展详情</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteTask(scope.$index, scope.row)"
              >删除任务</el-button>
            </template>
          </el-table-column>
        </template>
      </base-table>
      <preview-task
        v-show="switchPage === 'PreviewTask'"
        ref="previewTask"
        @close="switchPage = 'TaskList'"
      />
    </el-card>
  </div>
</template>

<script>
import PreviewTask from '@/views/OaSystem/OnlineOffice/MyCreatedTask/components/PreviewTask'
import BaseTable from '@/views/OaSystem/components/BaseTable'
import rsaUtil from '@/utils/rsaUtil'
import { mapGetters } from 'vuex'
export default {
  name: 'Index',
  components: { BaseTable, PreviewTask },
  data() {
    return {
      switchPage: 'TaskList',
      columnWidth: [],
      requestConfig: {}
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: '/jiangoaoffice/Office/task/GetMineTaskList.php',
        data: {
          page: 1,
          rows: 10,
          taskType: '2',
          taskName: null,
          taskTime: null,
          Rootcardid: this.userinfo.Rootcardid
        }
      }
    },
    handlePreviewTask(index, task) {
      this.switchPage = 'PreviewTask'
      this.$nextTick(() => {
        this.$refs.previewTask.loadTask(task.taskId)
      })
    },
    handleDeleteTask(index, task) {
      this.$confirm('您确定要删除该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(
          '/jiangoaoffice/Office/task/DeleteOfficeTask.php',
          {
            param: rsaUtil.encryption({
              taskId: task.taskId
            })
          }
        ).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.requestConfig = Object.assign({}, this.requestConfig)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>

</style>
