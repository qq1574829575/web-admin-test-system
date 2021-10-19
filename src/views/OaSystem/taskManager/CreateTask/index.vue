<template>
  <el-card style="height: 100%" class="fq-custom-card">
    <el-scrollbar style="height: 100%;">
      <el-form
        ref="taskForm"
        :model="taskForm"
        :rules="taskRules"
        label-width="100px"
        class="demo-ruleForm"
        size="medium"
      >
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskForm.taskName" />
        </el-form-item>
        <el-form-item label="紧急程度" prop="taskUrgency">
          <el-radio-group v-model="taskForm.taskUrgency">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="2">紧急</el-radio-button>
            <el-radio-button label="3">非常紧急</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务起止时间" prop="taskDuration">
          <el-date-picker
            v-model="taskForm.taskDuration"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="任务内容" prop="taskContent">
          <tinymce-editor :content.sync="taskForm.taskContent" />
        </el-form-item>
        <el-form-item label="附件" prop="taskFiles">
          <upload-file
            url="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/task/UploadStartTaskFile.php"
            :data="generateRsaData()"
            @onUploadSuccess="onUploadSuccess"
          />
          <show-closable-file-list
            :file-list="taskForm.taskFiles"
            :del-file="onDelFile"
          />
        </el-form-item>
        <el-form-item label="任务成员" prop="childTasks">
          <add-task-members ref="addTaskMembers" />
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button type="success" :loading="loading" icon="el-icon-circle-check" style="width: 150px" @click="submitForm('taskForm')">
          立即创建
        </el-button>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import { mapState } from 'vuex'
import AddTaskMembers from '../components/AddTaskMembers'
import TinymceEditor from '../components/TinymceEditor'
import UploadFile from '../components/UploadFile'
import ShowClosableFileList from '../components/ShowClosableFileList'

export default {
  components: { ShowClosableFileList, UploadFile, TinymceEditor, AddTaskMembers },
  data() {
    return {
      taskForm: {
        taskName: '',
        taskUrgency: '1',
        taskDuration: null,
        taskContent: '',
        taskFiles: [],
        childTasks: []
      },
      taskRules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  mounted() {
    this.openTipDialog()
  },
  methods: {
    openTipDialog() {
      this.$confirm('线上办公-创建任务功能仅用于向指定人员发布任务，区别于审批，请注意使用场景!', '使用须知', {
        confirmButtonText: '我已了解',
        cancelButtonText: '',
        type: 'warning',
        showCancelButton: false
      })
        .then(() => {})
        .catch(() => {})
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.taskForm.taskContent)
          this.$confirm('您确定要创建此任务吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.loading = true
              this.$http
                .post('/jiangoaoffice/Office/task/CreateOfficeTask.php', {
                  param: rsaUtil.encryption({
                    Rootcardid: this.userInfo.Rootcardid
                  }),
                  taskName: this.taskForm.taskName,
                  taskStartTime:
                    this.taskForm.taskDuration !== null
                      ? this.taskForm.taskDuration[0]
                      : '',
                  taskEndTime:
                    this.taskForm.taskDuration !== null
                      ? this.taskForm.taskDuration[1]
                      : '',
                  taskContent: this.taskForm.taskContent,
                  taskFileArr: JSON.stringify(this.taskForm.taskFiles),
                  taskLevel: this.taskForm.taskUrgency,
                  taskChild: JSON.stringify(this.$refs.addTaskMembers.getMemberList())
                })
                .then(res => {
                  this.loading = false
                  this.$notify({
                    type: 'success',
                    title: '提示',
                    message: res.data.message
                  })
                  this.$refs.taskForm.resetFields()
                })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    generateRsaData() {
      return {
        param: rsaUtil.encryption({
          Rootcardid: this.userInfo.Rootcardid
        })
      }
    },
    onUploadSuccess(res, file) {
      if (res.code === 1) {
        this.taskForm.taskFiles.push({
          accessoryTitle: file.name,
          accessoryAddr: res.rows.accessoryAddr
        })
        this.$notify({
          type: 'success',
          title: '提示',
          message: '上传成功'
        })
      } else {
        this.$notify({
          type: 'error',
          title: '提示',
          message: res.data.message
        })
      }
    },
    onDelFile(index, file) {
      this.$confirm('您确定要删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/jiangoaoffice/Office/task/DelStartTaskFile.php', {
              param: rsaUtil.encryption({
                accessoryAddr: file.accessoryAddr
              })
            }).then(res => {
              this.taskForm.taskFiles.splice(index, 1)
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'success'
              })
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss">
</style>
