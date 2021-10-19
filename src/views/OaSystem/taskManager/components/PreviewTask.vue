<template>
  <div style="height: 100%;">
    <el-page-header content="任务详情" @back="goBack" />
    <el-scrollbar v-loading="loading" style="height: 80vh;">
      <el-descriptions
        v-if="task"
        style="margin-top: 20px;"
        :column="2"
        size="medium"
        border
      >
        <el-descriptions-item label="任务名称">
          {{ task.taskName }}
        </el-descriptions-item>
        <el-descriptions-item label="紧急程度">
          <el-tag v-if="task.taskLevel === '1'">正常</el-tag>
          <el-tag v-if="task.taskLevel === '2'" type="warning">紧急</el-tag>
          <el-tag v-if="task.taskLevel === '3'" type="danger">非常紧急</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="起始时间">
          {{ task.taskStartTime }}
        </el-descriptions-item>
        <el-descriptions-item label="截止时间">
          {{ task.taskEndTime }}
        </el-descriptions-item>
        <el-descriptions-item label="附件">
          <show-file-list :file-list="task.taskBaseFileArr" />
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions v-if="task" :column="1" size="medium" border>
        <el-descriptions-item label="任务内容">
          <div v-html="task.taskContent" />
        </el-descriptions-item>
        <el-descriptions-item label="任务成员">
          <el-table
            v-if="task.taskChildInfo[0].childTask.length > 0"
            :data="task.taskChildInfo[0].childTask"
            border
            size="mini"
            height="300px"
            style="width: 100%;"
          >
            <el-table-column prop="teacherName" align="center" label="负责人" />
            <el-table-column prop="deptName" align="center" label="所属部门" />
            <el-table-column prop="taskRemark" align="center" label="备注" />
            <el-table-column label="进度" align="center">
              <template slot-scope="scope">
                {{ scope.row.taskComProgress }}%
              </template>
            </el-table-column>
            <el-table-column prop="taskStatus" label="状态" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.taskStatus === '待阅' ? 'danger' : scope.row.taskStatus === '待办' ? 'warning' : 'success'">
                  {{ scope.row.taskStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="回传附件" align="center">
              <template slot-scope="scope">
                <show-file-list :file-list="scope.row.taskFileArr" />
              </template>
            </el-table-column>
          </el-table>
          <div v-else>无</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-scrollbar>
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import ShowFileList from '../components/ShowFileList'

export default {
  name: 'PreviewTask',
  components: { ShowFileList },
  data() {
    return {
      task: null,
      loading: false
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    loadTask(taskId) {
      this.loading = true
      this.$http
        .post('/jiangoaoffice/Office/task/GetTaskDetail.php', {
          param: rsaUtil.encryption({
            taskId: taskId
          })
        })
        .then(res => {
          this.task = res.data.rows
          this.loading = false
        })
    }
  }
}
</script>

<style>
.my-label {
  background: #e1f3d8;
}
</style>
