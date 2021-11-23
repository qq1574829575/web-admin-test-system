<template>
  <el-dialog
    title="发起审批"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="80%"
    :close-on-click-modal="false"
    modal-append-to-body
    @open="onOpen"
  >
    <el-scrollbar style="height: 60vh;margin-top: -30px;" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="left">
        <el-form-item label="填写审批表单" prop="approvalForm">
          <tinymce-editor v-if="visible" :content.sync="form.approvalForm" />
        </el-form-item>
        <el-form-item label="审批流程" prop="approvalNodes">
          <un-editable-approval-process
            :process-nodes="form.approvalNodes"
          />
        </el-form-item>
        <el-form-item label="附件(可选)">
          <upload-file
            url="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/work/UploadStartWorkFile.php"
            :data="generateRsaData()"
            @onUploadSuccess="onUploadSuccess"
          />
          <show-closable-file-list :file-list="form.uploadFileList" :del-file="onDelFile" />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div style="text-align: right;margin-top: 20px;">
      <el-button
        type="success"
        icon="el-icon-circle-check"
        @click="createApproval('2')"
      >
        发起审批
      </el-button>
      <el-button
        type="success"
        icon="el-icon-circle-check"
        plain
        @click="createApproval('1')"
      >
        保存草稿
      </el-button>
    </div>
    <select-first-reviewer-dialog
      :visible.sync="showSelectFirstReviewerDialog"
      :flag="3"
      @onSelect="onSelectFirstReviewer"
    />
  </el-dialog>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import TinymceEditor from '../../../components/TinymceEditor'
import UploadFile from '../../../components/UploadFile'
import UnEditableApprovalProcess from '../../../components/UnEditableApprovalProcess'
import ShowClosableFileList from '../../../components/ShowClosableFileList'
import store from '@/store'
import SelectFirstReviewerDialog from '../../../components/SelectFirstReviewerDialog'
export default {
  name: 'CreateApprovalDialog',
  components: {
    SelectFirstReviewerDialog,
    ShowClosableFileList, UnEditableApprovalProcess, UploadFile, TinymceEditor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        approvalName: '',
        approvalForm: '',
        approvalNodes: [],
        uploadFileList: []
      },
      rules: {
        approvalForm: [{ required: true, trigger: 'change', message: '请填写审批表单' }],
        approvalNodes: [{ required: true, trigger: 'change', message: '审批流程节点' }]
      },
      processList: [],
      showSelectFirstReviewerDialog: false,
      nextTeacherIdArr: []
    }
  },
  mounted() {
    this.getProcessList()
  },
  methods: {
    onOpen() {
      if (this.formId) {
        this.loadProcess()
      }
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    getProcessList() {
      this.$http.post('/jiangoaoffice/Office/work/GetDeptTeacherFormList.php', {
        param: rsaUtil.encryption(),
        formName: ''
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.processList = res.data.rows.map(row => {
          return {
            label: row.deptName,
            value: row.deptId,
            children: row.formArr.map(form => {
              return {
                label: form.formName,
                value: form.formId
              }
            })
          }
        })
      })
    },
    loadProcess() {
      this.$http.post('/jiangoaoffice/Office/work/GetWorkFormDetail.php', {
        param: rsaUtil.encryption({
          formId: this.formId
        })
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.form.approvalName = res.data.rows[0].formName
        this.form.approvalForm = res.data.rows[0].formContent
        this.form.approvalNodes = res.data.rows[0].formNodeArr
        this.form.approvalNodes = [[
          {
            nodeDeptId: 0,
            nodeDeptName: store.state.userInfo.Rootname,
            nodePosition: store.state.userInfo.Rootname
          }
        ]].concat(this.form.approvalNodes)
      })
    },
    generateRsaData() {
      return {
        param: rsaUtil.encryption()
      }
    },
    onUploadSuccess(res) {
      if (res.code === 1) {
        this.form.uploadFileList.push(res.rows)
        this.$notify({
          title: '提示',
          type: 'success',
          message: res.message
        })
      } else {
        this.$notify({
          title: '提示',
          type: 'error',
          message: res.message
        })
      }
    },
    onDelFile(index, file) {
      this.$confirm('您确定要删除文件' + file.accessoryTitle + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/jiangoaoffice/Office/work/DelWorkFromAddr.php', {
          param: rsaUtil.encryption(),
          accessoryAddr: file.accessoryAddr
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        }).then(res => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: res.data.message
          })
          this.form.uploadFileList.splice(index, 1)
        })
      }).catch(() => {
      })
    },
    createApproval(flag) {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 兼容第一级就需要用户选择审核人的情况
          if (this.form.approvalNodes[1][0].nodePosition === '用户选择') {
            this.showSelectFirstReviewerDialog = true
          } else {
            if (flag === '1') {
              this.confirm('1')
            } else {
              this.$confirm('您确定要发起该审批吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.confirm('2')
              }).catch((err) => {
                console.log(err)
              })
            }
          }
        }
      })
    },
    onSelectFirstReviewer(reviewers) {
      this.nextTeacherIdArr = reviewers
      this.form.approvalNodes[1] = reviewers.map(reviewer => {
        return {
          nodeDeptId: 0,
          nodeDeptName: '副校长-' + reviewer.teacherName,
          nodePosition: reviewer.teacherName
        }
      })
      this.form.approvalNodes = Object.assign([], this.form.approvalNodes)
      this.confirm('3')
    },
    confirm(flag) {
      this.$http.post('/jiangoaoffice/Office/work/CreateOfficeWork.php', {
        param: rsaUtil.encryption(),
        workName: this.form.approvalName,
        workRemark: '',
        workContent: this.form.approvalForm,
        workFileArr: JSON.stringify(this.form.uploadFileList),
        formId: this.formId,
        nextTeacherIdArr: this.nextTeacherIdArr === 0 ? 0 : JSON.stringify(this.nextTeacherIdArr),
        flag: flag
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.$notify({
          title: '提示',
          type: 'success',
          message: res.data.message
        })
        this.$refs.form.resetFields()
        this.form.approvalProcess = null
        this.onClose()
      })
    }
  }
}
</script>

<style scoped>

</style>
