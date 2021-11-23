<template>
  <el-scrollbar style="height: 70vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
      style="width: 80%;margin: 0 auto"
    >
      <el-form-item label="流程名称" prop="processName">
        <el-input v-model="form.processName" placeholder="请输入流程名称" />
      </el-form-item>
      <el-form-item label="流程节点" prop="approvalProcess">
        <editable-approval-process ref="approvalProcess" @onChangeProcess="onChangeProcess" />
      </el-form-item>
      <el-form-item label="流程表单" prop="processForm">
        <tinymce-editor :content.sync="form.processForm" :is-design="true" />
      </el-form-item>
    </el-form>
  </el-scrollbar>
</template>

<script>
import TinymceEditor from './TinymceEditor'
import EditableApprovalProcess from '@/views/OaSystem/OnlineApproval/components/EditableApprovalProcess'

export default {
  name: 'ProcessDesign',
  components: { EditableApprovalProcess, TinymceEditor },
  data() {
    return {
      form: {
        processName: '',
        processForm: '',
        approvalProcess: []
      },
      rules: {
        processName: [{ required: true, trigger: 'change', message: '请输入流程名称' }],
        processForm: [{ required: true, trigger: 'change', message: '请设计流程表单' }],
        approvalProcess: [{ required: true, trigger: 'change', message: '请设计流程节点' }]
      }
    }
  },
  methods: {
    changeStr(str, start, end, replaceStr) {
      return str.substr(0, start) + replaceStr + str.substr(end, str.length)
    },
    loadProcess(row) {
      this.form.processName = row.formName
      this.form.processForm = row.formContent
      this.form.approvalProcess = row.formNodeArr
      this.$refs.approvalProcess.setProcessNodes(row.formNodeArr)
    },
    getFormData() {
      let flag = false
      this.$refs.form.validate(valid => {
        flag = !!valid
      })
      if (flag) {
        return {
          formName: this.form.processName,
          formContent: this.form.processForm,
          formNodeArr: JSON.stringify(this.form.approvalProcess)
        }
      } else {
        return null
      }
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    onChangeProcess(processNode) {
      console.log(processNode)
      this.form.approvalProcess = processNode
    }
  }
}
</script>

<style scoped>

</style>
