<template>
  <div class="app-container">
    <el-card>
      <base-table
        ref="table"
        :request-config="requestConfig"
        :column-width="columnWidth"
        :show-index="true"
        size="medium"
      >
        <template v-slot="columnConfig">
          <template v-for="item in columnConfig.columnConfig">
            <el-table-column
              v-if="item.prop === 'handleStatus'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.handleStatus === '0'">待处理</el-tag>
                <el-tag v-if="scope.row.handleStatus === '1'" type="success">审核通过</el-tag>
                <el-tag v-if="scope.row.handleStatus === '2'" type="danger">已驳回</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'handleNode'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag>{{ scope.row.handleNode }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'status'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === '0'">待审核</el-tag>
                <el-tag v-if="scope.row.status === '1'" type="warning">审核中</el-tag>
                <el-tag v-if="scope.row.status === '2'" type="success">审核通过</el-tag>
                <el-tag v-if="scope.row.status === '3'" type="danger">已驳回</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop !== 'task_id'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            />
          </template>
          <el-table-column label="操作" width="150px" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="previewDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </el-card>
    <preview-todo-detail-dialog :visible.sync="previewTodoDetailDialogVisible" :task-id="taskId" :reviewer-id="reviewerId" />
  </div>
</template>

<script>
import BaseTable from '@/views/OaSystem/components/BaseTable'
import PreviewTodoDetailDialog from '@/views/OaSystem/TodoList/components/PreviewTodoDetailDialog'
export default {
  name: 'Index',
  components: { PreviewTodoDetailDialog, BaseTable },
  data() {
    return {
      requestConfig: {},
      columnWidth: [],
      previewTodoDetailDialogVisible: false,
      reviewerId: '4',
      taskId: ''
    }
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: '/OnlineOffice/GetMyTodoList.php',
        baseUrl: 'http://localhost:8003',
        data: {
          page: 1,
          rows: 10,
          reviewerId: this.reviewerId
        }
      }
    },
    previewDetail(row) {
      this.taskId = row.task_id
      this.previewTodoDetailDialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
