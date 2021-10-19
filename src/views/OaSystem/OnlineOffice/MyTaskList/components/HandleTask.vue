<template>
  <div>
    <div v-if="switchPage === 'main'">
      <el-page-header content="处理任务" @back="goBack" />
      <el-alert
        v-if="task && task.taskChildInfo[0].taskStatus === '办结'"
        title="任务已办结"
        type="success"
        :closable="false"
        style="margin-top: 10px;"
        show-icon
      />
      <el-divider content-position="left" style="font-size: 20px">原始任务详情</el-divider>
      <el-descriptions v-if="task" :column="2" style="margin-top: 20px;" size="medium" border>
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
          <div v-if="task.taskBaseFileArr.length > 0">
            <div
              v-for="(file,index) in task.taskBaseFileArr"
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
          <div v-else>无</div>
        </el-descriptions-item>
        <el-descriptions-item v-if="task.sponsorName === task.taskChildInfo[0].lastTeacherName" label="备注">
          {{ task.taskChildInfo[0].taskRemark }}
        </el-descriptions-item>
        <el-descriptions-item label="任务内容">
          <div v-html="task.taskContent" />
        </el-descriptions-item>
      </el-descriptions>
      <div v-if="task && task.taskChildInfo[0].lastTeacherName !== '无' && task.sponsorName !== task.taskChildInfo[0].lastTeacherName">
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
            <div v-if="task.taskChildInfo[0].taskFrontToMeFileArr && task.taskChildInfo[0].taskFrontToMeFileArr.length > 0">
              <div
                v-for="(file,index) in task.taskChildInfo[0].taskFrontToMeFileArr"
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
            <div v-else>无</div>
          </el-descriptions-item>
          <el-descriptions-item label="上级任务内容">
            <div v-html="task.taskChildInfo[0].taskContent" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-if="task">
        <div v-if="task.taskChildInfo[0].lastTeacherName === '无'" style="margin-top: 10px;">
          <el-button type="success" icon="el-icon-check" @click="endTask">办结任务</el-button>
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
                <div
                  v-for="(file,index) in task.taskChildInfo[0].taskMeToFrontFileArr"
                  :key="index"
                >
                  <el-link
                    @click="openUrl(file.accessoryAddr)"
                  >
                    {{ file.accessoryTitle }}
                    <i class="el-icon-download el-icon--right" style="font-size: 15px;color: #0a76a4" />
                  </el-link>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-else>
            <span>完成进度:{{ task.taskChildInfo[0].taskComProgress }}%</span>
            <el-slider v-model="task.taskChildInfo[0].taskComProgress" style="width:80%" />
            <div style="margin-top: 10px;">任务完成情况说明:</div>
            <vue-tinymce
              v-model="task.taskChildInfo[0].taskComContent"
              :setting="setting"
            />
            <el-upload
              class="upload-demo"
              action="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/task/UploadTaskFile.php"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
              accept=".rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,.jpg"
              :data="generateRsaData('2')"
              :show-file-list="false"
              style="margin-top: 10px;"
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
              :data="task.taskChildInfo[0].taskMeToFrontFileArr"
              border
              size="mini"
              style="width: 100%;margin-top: 10px;"
            >
              <el-table-column
                prop="accessoryTitle"
                label="文件名"
              />
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="delTaskFile(scope.$index,scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="task.taskChildInfo[0].taskStatus !== '办结'" style="margin-top: 10px;">
            <el-button type="primary" icon="el-icon-download" @click="saveTask">保存任务</el-button>
            <el-button type="success" icon="el-icon-check" @click="endTask">办结任务</el-button>
          </div>
        </div>
      </div>
      <div v-if="task">
        <div v-if="task.taskChildInfo[0].lastTeacherName === '无'">
          <el-divider content-position="left">任务成员</el-divider>
        </div>
        <div v-else>
          <el-divider content-position="left">分配子任务</el-divider>
          <div v-if="task.taskChildInfo[0].taskStatus === '办结'">
            <el-descriptions :column="2" size="medium" border>
              <el-descriptions-item label="任务要求">
                {{ task.taskChildInfo[0].taskChildContent }}
              </el-descriptions-item>
              <el-descriptions-item label="附件">
                <div
                  v-for="(file,index) in task.taskChildInfo[0].lastBaseFileArr"
                  :key="index"
                >
                  <el-link
                    @click="openUrl(file.accessoryAddr)"
                  >
                    {{ file.accessoryTitle }}
                    <i class="el-icon-download el-icon--right" style="font-size: 15px;color: #0a76a4" />
                  </el-link>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-else>
            <div style="margin-top: 10px;">任务要求:</div>
            <vue-tinymce
              v-model="task.taskChildInfo[0].taskChildContent"
              :setting="setting"
            />
            <el-upload
              v-if="task.taskChildInfo[0].taskStatus !== '办结'"
              class="upload-demo"
              action="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/task/UploadTaskFile.php"
              :on-success="uploadChildFileSuccess"
              :before-upload="beforeUploadChildFile"
              accept=".rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,.jpg"
              :data="generateRsaData('1')"
              :show-file-list="false"
              style="margin-top: 10px;"
            >
              <el-button
                size="small"
                icon="el-icon-upload"
                type="primary"
                :loading="uploadChildFileBtnConfig.loading"
                :disabled="uploadChildFileBtnConfig.disabled"
              >
                {{ uploadChildFileBtnConfig.title }}
              </el-button>
              <div slot="tip" class="el-upload__tip">支持上传的文件：.rar .zip .doc .docx .pdf .xlsx .jpg...</div>
            </el-upload>
            <el-table
              v-if="task.taskChildInfo[0].lastBaseFileArr && task.taskChildInfo[0].lastBaseFileArr.length > 0"
              :data="task.taskChildInfo[0].lastBaseFileArr"
              border
              size="mini"
              style="width: 100%;margin-top: 10px;"
            >
              <el-table-column
                prop="accessoryTitle"
                label="文件名"
              />
              <el-table-column v-if="task.taskChildInfo[0].taskStatus !== '办结'" label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="delLastTaskFile(scope.$index,scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="task.taskChildInfo[0].taskStatus !== '办结'">
          <el-cascader
            v-model="selectedTeacher"
            :options="deptList"
            placeholder="搜索/选择子任务成员"
            size="mini"
            filterable
            style="margin-top: 10px;"
          />
          <el-button type="primary" style="margin-left: 10px;" size="mini" icon="el-icon-plus" @click="addChildTask">添加子任务成员</el-button>
        </div>
        <el-table
          v-if="task.taskChildInfo[0].childTask && task.taskChildInfo[0].childTask.length > 0"
          :data="task.taskChildInfo[0].childTask"
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
              {{ scope.row.taskRemark }}
              <el-link v-if="task.taskChildInfo[0].taskStatus !== '办结'" :underline="false" @click="editRemark(scope.row)">
                <i class="el-icon-edit" style="font-size: 15px" />
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="taskStatus"
            label="任务状态"
            align="center"
          />
          <el-table-column
            label="进度"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.taskComProgress }}%
            </template>
          </el-table-column>
          <el-table-column
            label="附件"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.taskFileArr.length > 0">
                <div
                  v-for="(file,index) in scope.row.taskFileArr"
                  :key="index"
                >
                  <el-link
                    style="font-size: 12px"
                    @click="openUrl(file.accessoryAddr)"
                  >
                    {{ file.accessoryTitle }}
                    <i class="el-icon-download el-icon--right" style="font-size: 15px;color: #0a76a4" />
                  </el-link>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="task.taskChildInfo[0].taskStatus !== '办结'" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteChildTask(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button v-if="task.taskChildInfo[0].taskStatus !== '办结'" type="primary" style="margin-top: 10px;" size="mini" icon="el-icon-circle-check" @click="saveChildTaskInfo">保存子任务信息</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import { mapGetters } from 'vuex'
export default {
  name: 'HandleTask',
  components: { },
  data() {
    return {
      switchPage: 'main',
      parentTaskId: '',
      task: null,
      taskRules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ]
      },
      deptList: [],
      selectedTeacher: [],
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
      uploadBtnConfig: {
        title: '上传附件',
        loading: false,
        disabled: false
      },
      uploadChildFileBtnConfig: {
        title: '上传附件',
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
          param: rsaUtil.encryption({
            teacherName: '99'
          })
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
    goBack() {
      this.$emit('close')
    },
    loadTask(taskId) {
      this.parentTaskId = taskId
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
    },
    generateRsaData(accessoryType) {
      return {
        param: rsaUtil.encryption({
          Rootcardid: this.userinfo.Rootcardid,
          taskId: this.task.taskChildInfo[0].taskId,
          accessoryType: accessoryType
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
    delTaskFile(index, row) {
      this.$confirm('您确定要删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(
          '/jiangoaoffice/Office/task/DelTaskFile.php',
          {
            param: rsaUtil.encryption({
              accessoryId: row.accessoryId
            })
          }
        ).then(res => {
          this.$message({
            type: 'warning',
            message: res.message
          })
          this.task.taskChildInfo[0].taskBaseFileArr.splice(index, 1)
        })
      }).catch(() => {})
    },
    delLastTaskFile(index, row) {
      this.$confirm('您确定要删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(
          '/jiangoaoffice/Office/task/DelTaskFile.php',
          {
            param: rsaUtil.encryption({
              accessoryId: row.accessoryId
            })
          }
        ).then(res => {
          this.$message({
            type: 'warning',
            message: res.message
          })
          this.task.taskChildInfo[0].lastBaseFileArr.splice(index, 1)
        })
      }).catch(() => {})
    },
    addChildTask() {
      if (this.selectedTeacher.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择子任务成员'
        })
        return
      }
      // 去重
      for (let i = 0; i < this.task.taskChildInfo[0].childTask.length; i++) {
        if (this.selectedTeacher[1].teacherId === this.task.taskChildInfo[0].childTask[i].teacherId) {
          this.$message({
            type: 'warning',
            message: '成员' + this.selectedTeacher[1].teacherName + '已添加，请勿重复添加！'
          })
          this.selectedTeacher = []
          return
        }
      }
      this.task.taskChildInfo[0].childTask.push({
        teacherId: this.selectedTeacher[1].teacherId,
        teacherNo: this.selectedTeacher[1].teacherNo,
        teacherName: this.selectedTeacher[0].deptName + '-' + this.selectedTeacher[1].teacherName,
        taskRemark: '',
        taskComProgress: '0',
        taskFileArr: []
      })
      this.selectedTeacher = []
    },
    handleDeleteChildTask(index, row) {
      this.$confirm('您确定要删除该子任务成员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.task.taskChildInfo[0].childTask.splice(index, 1)
      }).catch(() => {})
    },
    saveTask() {
      this.$http.post(
        '/jiangoaoffice/Office/task/ModifyOfficeTask.php',
        {
          param: rsaUtil.encryption({
            taskId: this.parentTaskId
          }),
          taskComProgress: this.task.taskChildInfo[0].taskComProgress,
          taskComContent: this.task.taskChildInfo[0].taskComContent,
          taskBaseFileArr: ''
        }
      ).then(res => {
        this.$message({
          type: 'warning',
          message: res.message
        })
        this.loadTask(this.parentTaskId)
      })
    },
    endTask() {
      this.$confirm('您确定要办结该任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(
          '/jiangoaoffice/Office/task/EndOfficeTask.php',
          {
            param: rsaUtil.encryption({
              taskId: this.task.taskChildInfo[0].taskId
            })
          }
        ).then(res => {
          this.$message({
            type: 'warning',
            message: res.message
          })
          this.loadTask(this.parentTaskId)
        })
      }).catch(() => {})
    },
    uploadChildFileSuccess(res, file) {
      this.uploadChildFileBtnConfig.title = '点击上传'
      this.uploadChildFileBtnConfig.loading = false
      this.uploadChildFileBtnConfig.disabled = false
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
    beforeUploadChildFile(file) {
      this.uploadChildFileBtnConfig.title = '正在上传'
      this.uploadChildFileBtnConfig.loading = true
      this.uploadChildFileBtnConfig.disabled = true
    },
    editRemark(row) {
      this.$prompt('请输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        row.taskRemark = value
      }).catch(() => {})
    },
    saveChildTaskInfo() {
      this.$http.post(
        '/jiangoaoffice/Office/task/CreateChildGroupTask.php',
        {
          param: rsaUtil.encryption(),
          taskId: this.task.taskChildInfo[0].lastTeacherName === '无' ? this.task.taskId : this.task.taskChildInfo[0].taskId,
          taskContent: this.task.taskChildInfo[0].taskChildContent,
          teacherArr: JSON.stringify(this.task.taskChildInfo[0].childTask)
        }
      ).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.loadTask(this.parentTaskId)
      })
    }
  }
}
</script>

<style scoped>
.el-divider__text{
  font-size: 20px;
}
</style>
