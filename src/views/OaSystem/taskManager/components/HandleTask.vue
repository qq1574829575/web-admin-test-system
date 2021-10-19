<template>
  <div style="height: 100%">
    <el-page-header content="处理任务" @back="goBack" />
    <div v-if="task">
      <el-alert
        v-if="task.taskStatus === '办结' || task.taskChildInfo[0].taskStatus === '办结'"
        title="任务已办结"
        type="success"
        :closable="false"
        style="margin-top: 10px;"
        show-icon
      />
    </div>
    <el-scrollbar v-if="switchPage === 'main'" v-loading="loading" style="height: 80vh;">
      <el-divider content-position="left" style="font-size: 20px">
        原始任务详情
      </el-divider>
      <el-descriptions
        v-if="task"
        :column="2"
        style="margin-top: 20px;"
        size="medium"
        border
      >
        <el-descriptions-item label="任务名称">
          {{ task.taskName }}
        </el-descriptions-item>
        <el-descriptions-item label="任务发起人">
          {{ task.sponsorName }}
        </el-descriptions-item>
        <el-descriptions-item label="起始时间">
          {{ task.taskStartTime }}
        </el-descriptions-item>
        <el-descriptions-item label="截止时间">
          {{ task.taskEndTime }}
        </el-descriptions-item>
        <el-descriptions-item label="紧急程度">
          <el-tag v-if="task.taskLevel === '1'">正常</el-tag>
          <el-tag v-if="task.taskLevel === '2'" type="warning">紧急</el-tag>
          <el-tag v-if="task.taskLevel === '3'" type="danger">非常紧急</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="附件">
          <show-file-list :file-list="task.taskBaseFileArr" />
        </el-descriptions-item>
        <el-descriptions-item label="任务内容">
          <div v-html="task.taskContent" />
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        v-if="task"
        :column="1"
        size="medium"
        border
      >
        <el-descriptions-item
          v-if="task.sponsorName === task.taskChildInfo[0].lastTeacherName"
          label="备注"
        >
          {{ task.taskChildInfo[0].taskRemark }}
        </el-descriptions-item>
      </el-descriptions>
      <div
        v-if="
          task &&
            task.taskChildInfo[0].lastTeacherName !== '无' &&
            task.sponsorName !== task.taskChildInfo[0].lastTeacherName
        "
      >
        <el-divider content-position="left">上级任务详情</el-divider>
        <el-descriptions :column="2" size="medium" border>
          <el-descriptions-item label="上级">
            {{ task.taskChildInfo[0].lastTeacherName }}
          </el-descriptions-item>
          <el-descriptions-item label="上级备注">
            {{ task.taskChildInfo[0].taskRemark }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" size="medium" border>
          <el-descriptions-item label="上级附件">
            <show-file-list :file-list="task.taskChildInfo[0].taskFrontToMeFileArr" />
          </el-descriptions-item>
          <el-descriptions-item label="上级任务内容">
            <div v-html="task.taskChildInfo[0].taskContent" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-if="task">
        <div v-if="task.taskChildInfo[0].lastTeacherName === '无'" style="margin-top: 20px;text-align: center">
          <el-button v-if="task.taskStatus !== '办结'" type="success" icon="el-icon-check" @click="endTask">
            办结任务
          </el-button>
        </div>
        <div v-else>
          <el-divider content-position="left">处理任务</el-divider>
          <div v-if="task.taskChildInfo[0].taskStatus === '办结'">
            <el-descriptions :column="2" size="medium" border>
              <el-descriptions-item label="进度">
                {{ task.taskChildInfo[0].taskComProgress }}%
              </el-descriptions-item>
              <el-descriptions-item label="完成情况">
                <div v-html="task.taskChildInfo[0].taskComContent" />
              </el-descriptions-item>
              <el-descriptions-item label="附件">
                <show-file-list :file-list="task.taskChildInfo[0].taskMeToFrontFileArr" />
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-else>
            <span>完成进度:{{ task.taskChildInfo[0].taskComProgress }}%</span>
            <el-slider
              v-model="task.taskChildInfo[0].taskComProgress"
              style="width:80%;margin-left: 10px;"
            />
            <div style="margin-top: 10px;margin-bottom: 10px;">任务完成情况说明:</div>
            <tinymce-editor :content.sync="task.taskChildInfo[0].taskComContent" />
            <div style="margin-top: 10px;margin-bottom: 10px;">完成附件:</div>
            <upload-file
              url="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/task/UploadTaskFile.php"
              :data="generateRsaData('2')"
              style="margin-top: 10px;"
              @onUploadSuccess="onUploadSuccess"
            />
            <show-closable-file-list
              :file-list="task.taskChildInfo[0].taskMeToFrontFileArr"
              :del-file="delTaskFile"
            />
          </div>
          <div
            v-if="task.taskChildInfo[0].taskStatus !== '办结'"
            style="margin-top: 20px;text-align: center;margin-bottom: 30px;"
          >
            <el-button type="primary" icon="el-icon-download" @click="saveTask">
              保存任务
            </el-button>
            <el-button type="success" icon="el-icon-check" @click="endTask">
              办结任务
            </el-button>
          </div>
        </div>
      </div>
      <div v-if="task">
        <div v-if="task.taskChildInfo[0].lastTeacherName === '无'">
          <el-divider content-position="left">
            {{ task.taskStatus === '办结' ? '任务成员' : '下发任务' }}
          </el-divider>
        </div>
        <div v-else>
          <el-divider content-position="left">
            {{ task.taskChildInfo[0].taskStatus === '办结' ? '子任务信息' : '下发子任务' }}
          </el-divider>
          <div v-if="task.taskChildInfo[0].taskStatus === '办结'">
            <el-descriptions :column="2" size="medium" border>
              <el-descriptions-item label="任务要求">
                {{ task.taskChildInfo[0].taskChildContent }}
              </el-descriptions-item>
              <el-descriptions-item label="附件">
                <show-file-list :file-list="task.taskChildInfo[0].lastBaseFileArr" />
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-else>
            <div style="margin-top: 10px;margin-bottom: 10px;">任务要求:</div>
            <tinymce-editor :content.sync="task.taskChildInfo[0].taskChildContent" />
            <div style="margin-top: 10px;margin-bottom: 10px;">任务附件:</div>
            <upload-file
              v-if="task.taskChildInfo[0].taskStatus !== '办结'"
              url="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/task/UploadTaskFile.php"
              :data="generateRsaData('1')"
              style="margin-top: 10px;"
              @onUploadSuccess="uploadChildFileSuccess"
            />
            <show-closable-file-list
              v-if="
                task.taskChildInfo[0].lastBaseFileArr &&
                  task.taskChildInfo[0].lastBaseFileArr.length > 0
              "
              :file-list="task.taskChildInfo[0].lastBaseFileArr"
              :del-file="delLastTaskFile"
            />
          </div>
        </div>
        <div
          v-if="task.taskChildInfo[0].lastTeacherName === '无' ? task.taskStatus !== '办结' : task.taskChildInfo[0].taskStatus !== '办结'"
          style="margin-top: 10px;margin-bottom: 10px;"
        >
          子任务成员:
        </div>
        <add-child-task-members
          ref="addTaskMembers"
          :member-list="task.taskChildInfo[0].childTask"
          :task-is-end="task.taskChildInfo[0].lastTeacherName === '无' ? task.taskStatus === '办结' : task.taskChildInfo[0].taskStatus === '办结'"
        />
        <el-button
          v-if="task.taskChildInfo[0].lastTeacherName === '无' ? task.taskStatus !== '办结' : task.taskChildInfo[0].taskStatus !== '办结'"
          type="primary"
          style="margin-top: 10px;"
          size="mini"
          icon="el-icon-circle-check"
          @click="saveChildTaskInfo"
        >
          下发任务
        </el-button>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import { mapState } from 'vuex'
import TinymceEditor from '../components/TinymceEditor'
import ShowFileList from '../components/ShowFileList'
import AddChildTaskMembers from '@/views/OaSystem/taskManager/components/AddChildTaskMembers'
import UploadFile from '@/views/OaSystem/taskManager/components/UploadFile'
import ShowClosableFileList from '@/views/OaSystem/taskManager/components/ShowClosableFileList'

export default {
  name: 'HandleTask',
  components: { ShowClosableFileList, UploadFile, AddChildTaskMembers, TinymceEditor, ShowFileList },
  data() {
    return {
      loading: false,
      switchPage: 'main',
      parentTaskId: '',
      task: null,
      taskRules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    loadTask(taskId) {
      this.loading = true
      this.parentTaskId = taskId
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
    },
    generateRsaData(accessoryType) {
      return {
        param: rsaUtil.encryption({
          Rootcardid: this.userInfo.Rootcardid,
          taskId: this.task.taskChildInfo[0].taskId,
          accessoryType: accessoryType
        })
      }
    },
    onUploadSuccess(res, file) {
      if (res.code === 1) {
        this.task.taskChildInfo[0].taskMeToFrontFileArr.push({
          accessoryTitle: file.name,
          accessoryId: res.rows.accessoryId
        })
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: res.message
        })
      }
    },
    delTaskFile(index, file) {
      this.$confirm('您确定要删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/jiangoaoffice/Office/task/DelTaskFile.php', {
              param: rsaUtil.encryption({
                accessoryId: file.accessoryId
              })
            })
            .then(res => {
              this.$message({
                type: 'warning',
                message: res.data.message
              })
              this.task.taskChildInfo[0].taskMeToFrontFileArr.splice(index, 1)
            })
        })
        .catch(() => {})
    },
    delLastTaskFile(index, file) {
      this.$confirm('您确定要删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/jiangoaoffice/Office/task/DelTaskFile.php', {
              param: rsaUtil.encryption({
                accessoryId: file.accessoryId
              })
            })
            .then(res => {
              this.$message({
                type: 'warning',
                message: res.data.message
              })
              this.task.taskChildInfo[0].lastBaseFileArr.splice(index, 1)
            })
        })
        .catch(() => {})
    },
    saveTask() {
      this.$http
        .post('/jiangoaoffice/Office/task/ModifyOfficeTask.php', {
          param: rsaUtil.encryption({
            taskId: this.parentTaskId
          }),
          taskComProgress: this.task.taskChildInfo[0].taskComProgress,
          taskComContent: this.task.taskChildInfo[0].taskComContent,
          taskBaseFileArr: ''
        })
        .then(res => {
          this.$message({
            type: 'warning',
            message: res.data.message
          })
          this.loadTask(this.parentTaskId)
        })
    },
    endTask() {
      this.$confirm('您确定要办结该任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.task.taskChildInfo[0].lastTeacherName !== '无') {
            // 第一级办结任务不需要保存任务，第二级以下办结任务需要保存任务，再办结任务
            this.saveTask()
          }
          this.$http
            .post('/jiangoaoffice/Office/task/EndOfficeTask.php', {
              param: rsaUtil.encryption({
                taskId: this.task.taskChildInfo[0].lastTeacherName === '无' ? this.task.taskId : this.task.taskChildInfo[0].taskId
              })
            })
            .then(res => {
              this.$message({
                type: 'warning',
                message: res.data.message
              })
              this.loadTask(this.parentTaskId)
            })
        })
        .catch(() => {})
    },
    uploadChildFileSuccess(res, file) {
      if (res.code === 1) {
        this.task.taskChildInfo[0].lastBaseFileArr.push({
          accessoryTitle: file.name,
          accessoryId: res.rows.accessoryId
        })
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: res.message
        })
      }
    },
    saveChildTaskInfo() {
      this.$http
        .post('/jiangoaoffice/Office/task/CreateChildGroupTask.php', {
          param: rsaUtil.encryption(),
          taskId:
            this.task.taskChildInfo[0].lastTeacherName === '无'
              ? this.task.taskId
              : this.task.taskChildInfo[0].taskId,
          taskContent: this.task.taskChildInfo[0].taskChildContent,
          teacherArr: JSON.stringify(this.task.taskChildInfo[0].childTask)
        })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.loadTask(this.parentTaskId)
        })
    }
  }
}
</script>

<style scoped>
.el-divider__text {
  font-size: 20px;
}
</style>
