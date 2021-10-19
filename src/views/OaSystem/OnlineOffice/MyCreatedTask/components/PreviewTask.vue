<template>
  <div>
    <el-page-header content="任务详情" @back="goBack" />
    <el-descriptions v-if="task" style="margin-top: 20px;" :column="2" size="medium" border>
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
      <el-descriptions-item label="任务内容">
        <div v-html="task.taskContent" />
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions v-if="task" :column="1" size="medium" border>
      <el-descriptions-item label="附件" :label-class-name="`background: red`">
        <el-table
          v-if="task.taskBaseFileArr"
          :data="task.taskBaseFileArr"
          size="mini"
          style="width: 100%;"
          border
        >
          <el-table-column
            prop="accessoryTitle"
            label="文件名"
          />
          <el-table-column
            label="操作"
            width="150px"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="openUrl(scope.row.accessoryAddr)"
              >下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-else>无</div>
      </el-descriptions-item>
      <el-descriptions-item label="任务成员">
        <el-table
          v-if="task.taskChildInfo[0].childTask.length > 0"
          :data="task.taskChildInfo[0].childTask"
          border
          size="mini"
          style="width: 100%;"
        >
          <el-table-column
            prop="teacherName"
            label="负责人"
          />
          <el-table-column
            prop="deptName"
            label="所属部门"
          />
          <el-table-column
            prop="taskRemark"
            label="备注"
          />
          <el-table-column
            label="进度"
          >
            <template slot-scope="scope">
              {{ scope.row.taskComProgress }}%
            </template>
          </el-table-column>
          <el-table-column
            prop="taskStatus"
            label="状态"
          />
          <el-table-column
            width="300px"
            label="附件"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.taskFileArr.length > 0">
                <div
                  v-for="(file,index) in scope.row.taskFileArr"
                  :key="index"
                >
                  <el-link
                    @click="openUrl(file.accessoryAddr)"
                  >
                    {{ file.accessoryTitle }}
                    <i class="el-icon-download el-icon--right" style="font-size: 15px;color: #0a76a4" />
                  </el-link>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-else>无</div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'PreviewTask',
  components: { },
  data() {
    return {
      task: null
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    loadTask(taskId) {
      this.$http.post(
        '/jiangoaoffice/Office/task/GetTaskDetail.php',
        {
          param: rsaUtil.encryption({
            taskId: taskId
          })
        }
      ).then(res => {
        this.task = res.rows
      })
    },
    openUrl(url) {
      window.open(url)
    }
  }
}
</script>

<style>
.my-label {
  background: #E1F3D8;
}
</style>
