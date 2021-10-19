<template>
  <div class="app-container">
    <el-card>
      <el-form ref="taskForm" :model="taskForm" :rules="taskRules" label-width="100px" class="demo-ruleForm">
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
          <vue-tinymce
            v-model="taskForm.taskContent"
            :setting="setting"
          />
        </el-form-item>
        <el-form-item label="附件" prop="taskFiles">
          <el-upload
            class="upload-demo"
            action="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/task/UploadStartTaskFile.php"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            accept=".rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,.jpg"
            :data="generateRsaData()"
            :show-file-list="false"
          >
            <el-button
              size="small"
              icon="el-icon-upload"
              type="primary"
              :loading="uploadBtnConfig.loading"
              :disabled="uploadBtnConfig.disabled"
            >
              {{ uploadBtnConfig.title }}
            </el-button>
            <div slot="tip" class="el-upload__tip">支持上传的文件：.rar .zip .doc .docx .pdf .xlsx .jpg...</div>
          </el-upload>
          <el-table
            v-if="taskForm.taskFiles.length > 0"
            :data="taskForm.taskFiles"
            border
            size="mini"
            style="width: 100%;margin-top: 10px;"
          >
            <el-table-column
              prop="picName"
              label="文件名"
            />
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="taskForm.taskFiles.splice(scope.$index,1)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="任务成员" prop="childTasks">
          <el-cascader
            v-model="selectedTeacher"
            :options="deptList"
            placeholder="选择/搜索任务成员"
            filterable
            size="mini"
          />
          <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-left: 10px;" @click="addChildTask">添加任务成员</el-button>
          <el-table
            v-if="taskForm.childTasks.length > 0"
            :data="taskForm.childTasks"
            border
            size="mini"
            style="width: 100%;margin-top: 10px;"
          >
            <el-table-column
              prop="teacherName"
              label="负责人"
              align="center"
            />
            <el-table-column
              label="备注"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.childTaskRemark }}
                <el-link :underline="false" @click="editRemark(scope.row)">
                  <i class="el-icon-edit" style="font-size: 15px" />
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="taskForm.childTasks.splice(scope.$index,1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('taskForm')">立即创建</el-button>
          <el-button @click="resetForm('taskForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import { mapGetters } from 'vuex'

export default {
  components: { },
  data() {
    return {
      selectedTeacher: [],
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
      deptList: [],
      setting: {
        menubar: true,
        forced_root_block: '',
        valid_elements: '*[*]',
        toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \\\n' +
          '    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \\\n' +
          '    table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs',
        toolbar_drawer: 'sliding',
        quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
        plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em autoresize formatpainter axupimgs',
        language: 'zh_CN', // 本地化设置
        height: 650, // 编辑器高度
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
      },
      switchPage: 'main',
      uploadBtnConfig: {
        title: '点击上传',
        loading: false,
        disabled: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  mounted() {
    this.getDeptList()
  },
  methods: {
    getDeptList() {
      this.$http.post(
        '/jiangoaoffice/Office/task/GetDeptTeacherList.php',
        {
          param: rsaUtil.encryption(
            {
              teacherName: '99'
            }
          )
        }
      ).then(res => {
        this.deptList = res.rows.map((row) => {
          return {
            label: row.deptName,
            value: {
              deptId: row.deptId,
              deptName: row.deptName
            },
            children: row.deptArr.map((teacher) => {
              return {
                label: teacher.teacherName,
                value: teacher
              }
            })
          }
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(
            '/jiangoaoffice/Office/task/CreateOfficeTask.php',
            {
              param: rsaUtil.encryption({
                Rootcardid: this.userinfo.Rootcardid
              }),
              taskName: this.taskForm.taskName,
              taskStartTime: this.taskForm.taskDuration !== null ? this.taskForm.taskDuration[0] : '',
              taskEndTime: this.taskForm.taskDuration !== null ? this.taskForm.taskDuration[1] : '',
              taskContent: this.taskForm.taskContent,
              taskFileArr: JSON.stringify(this.taskForm.taskFiles),
              taskLevel: this.taskForm.taskUrgency,
              taskChild: JSON.stringify(this.taskForm.childTasks)
            }
          ).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.$refs.taskForm.resetFields()
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
          Rootcardid: '36252919960225103X'
        })
      }
    },
    beforeUpload(file) {
      this.uploadBtnConfig.title = '正在上传'
      this.uploadBtnConfig.loading = true
      this.uploadBtnConfig.disabled = true
    },
    handleUploadSuccess(res, file) {
      this.uploadBtnConfig.title = '点击上传'
      this.uploadBtnConfig.loading = false
      this.uploadBtnConfig.disabled = false
      if (res.code === 1) {
        this.taskForm.taskFiles.push({
          picName: file.name,
          picAddr: res.rows.picAddr
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
    handleDeleteChildTask(index, row) {
      this.taskForm.childTasks.splice(index, 1)
    },
    editRemark(row) {
      this.$prompt('请输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        row.childTaskRemark = value
      }).catch(() => {})
    },
    addChildTask() {
      if (this.selectedTeacher.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择任务成员'
        })
        return
      }
      // 去重
      for (let i = 0; i < this.taskForm.childTasks.length; i++) {
        if (this.selectedTeacher[1].teacherId === this.taskForm.childTasks[i].teacherId) {
          this.$message({
            type: 'warning',
            message: '成员' + this.selectedTeacher[1].teacherName + '已添加，请勿重复添加！'
          })
          this.selectedTeacher = []
          return
        }
      }
      this.taskForm.childTasks.push({
        teacherId: this.selectedTeacher[1].teacherId,
        teacherNo: this.selectedTeacher[1].teacherNo,
        teacherName: this.selectedTeacher[0].deptName + '-' + this.selectedTeacher[1].teacherName,
        childTaskRemark: ''
      })
      this.selectedTeacher = []
    }
  }
}
</script>

<style scoped>

</style>
