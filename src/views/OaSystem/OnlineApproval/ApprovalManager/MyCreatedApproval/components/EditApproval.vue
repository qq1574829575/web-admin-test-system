<template>
  <!--编辑审批组件-->
  <div>
    <el-page-header :content="`编辑 - ` + form.approvalName" @back="goBack" />
    <div style="padding: 10px;width: 80%;margin: 0 auto">
      <el-scrollbar style="height: 65vh;" :wrap-style="[{ 'overflow-x': 'hidden'}]">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="left">
          <el-form-item label="审批标题" prop="approvalName">
            <el-input v-model="form.approvalName" />
          </el-form-item>
          <el-form-item label="选择审批流程" prop="approvalProcess">
            <el-cascader
              v-model="form.approvalProcess"
              :options="processList"
              placeholder="输入名称搜索流程，如：请假"
              filterable
              style="width: 100%"
              @change="onSelectProcess"
            />
            <un-editable-approval-process
              :process-nodes="form.approvalNodes"
            />
          </el-form-item>
          <el-form-item label="填写审批表单" prop="approvalForm">
            <tinymce-editor :content.sync="form.approvalForm" />
          </el-form-item>
          <el-form-item label="附件(可选)">
            <upload-file
              url="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/work/UploadWorkFile.php"
              :data="generateRsaData()"
              @onUploadSuccess="onUploadSuccess"
            />
            <show-closable-file-list :file-list="uploadFileList" :del-file="onDelFile" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <div style="text-align: center;margin-top: 20px;">
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
  </div>
</template>

<script>
import TinymceEditor from '../../../components/TinymceEditor'
import UploadFile from '../../../components/UploadFile'
import rsaUtil from '@/utils/rsaUtil'
import UnEditableApprovalProcess from '../../../components/UnEditableApprovalProcess'
import ShowClosableFileList from '../../../components/ShowClosableFileList'
import SelectFirstReviewerDialog from '../../../components/SelectFirstReviewerDialog'
export default {
  name: 'EditApproval',
  components: { ShowClosableFileList, UnEditableApprovalProcess, UploadFile, TinymceEditor, SelectFirstReviewerDialog },
  data() {
    return {
      form: {
        approvalId: '',
        approvalName: '',
        approvalForm: '',
        approvalNodes: [],
        approvalProcess: []
      },
      rules: {
        approvalName: [{ required: true, trigger: 'change', message: '请输入审批名称' }],
        approvalForm: [{ required: true, trigger: 'change', message: '请填写审批表单' }],
        approvalProcess: [{ required: true, trigger: 'change', message: '请选择审批流程' }],
        approvalNodes: [{ required: true, trigger: 'change', message: '审批节点' }]
      },
      processList: [],
      uploadFileList: [],
      showSelectFirstReviewerDialog: false,
      nextTeacherIdArr: []
    }
  },
  mounted() {
    this.getProcessList()
  },
  methods: {
    getProcessList() {
      this.$http.post('/jiangoaoffice/Office/work/GetDeptTeacherFormList.php', {
        param: rsaUtil.encryption()
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
    getNodeRoute(tree, targetId, nodePathArray) {
      for (let index = 0; index < tree.length; index++) {
        if (tree[index].children) {
          const endRecursiveLoop = this.getNodeRoute(tree[index].children, targetId, nodePathArray)
          if (endRecursiveLoop) {
            nodePathArray.push(tree[index].value)
            return true
          }
        }
        if (tree[index].value === targetId) {
          nodePathArray.push(tree[index].value)
          return true
        }
      }
    },
    onSelectProcess(data) {
      this.$http.post('/jiangoaoffice/Office/work/GetWorkFormDetail.php', {
        param: rsaUtil.encryption({
          formId: data[1]
        })
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.$nextTick(() => {
          this.form.approvalForm = res.data.rows[0].formContent
          this.form.approvalNodes = res.data.rows[0].formNodeArr
        })
      })
    },
    loadApprovalDetail(workId) {
      this.$http.post('/jiangoaoffice/Office/work/GetOfficeWorkDetail.php', {
        param: rsaUtil.encryption({
          workId: workId
        })
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        const approvalDetail = res.data.rows[0]
        this.form.approvalId = approvalDetail.workId
        this.form.approvalName = approvalDetail.workName
        this.form.approvalForm = approvalDetail.workContent
        this.form.approvalNodes = approvalDetail.formNodeArr
        this.uploadFileList = approvalDetail.accessorySelfArr
        let nodeRoute = []
        this.getNodeRoute(this.processList, approvalDetail.formId, nodeRoute)
        nodeRoute = nodeRoute.reverse()
        this.form.approvalProcess = nodeRoute
      })
    },
    goBack() {
      this.form.approvalProcess = []
      this.$emit('close')
    },
    generateRsaData() {
      return {
        param: rsaUtil.encryption({
          workId: this.form.approvalId
        })
      }
    },
    onUploadSuccess(res) {
      if (res.code === 1) {
        this.uploadFileList.push(res.rows)
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
        this.$http.post('/jiangoaoffice/Office/work/DelWorkFile.php', {
          param: rsaUtil.encryption({
            accessoryId: file.accessoryId
          })
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        }).then(res => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: res.data.message
          })
          this.uploadFileList.splice(index, 1)
        })
      }).catch(() => {
      })
    },
    createApproval(flag) {
      if (flag === '1') {
        this.confirm(flag)
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 兼容第一级就需要用户选择审核人的情况
            console.log(this.form.approvalNodes)
            if (this.form.approvalNodes[1][0].teacherName === '待指定') {
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
      }
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
      this.$http.post('/jiangoaoffice/Office/work/ModifySubmitOfficeWork.php', {
        param: rsaUtil.encryption({
          workId: this.form.approvalId
        }),
        workName: this.form.approvalName,
        workRemark: '',
        workContent: this.form.approvalForm,
        workFileArr: JSON.stringify(this.uploadFileList),
        formId: this.form.approvalProcess[1],
        nextTeacherIdArr: JSON.stringify(this.nextTeacherIdArr),
        flag: flag
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.$notify({
          title: '提示',
          type: 'success',
          message: res.data.message
        })
        this.goBack()
      })
    }
  }
}
</script>

<style scoped>

</style>
