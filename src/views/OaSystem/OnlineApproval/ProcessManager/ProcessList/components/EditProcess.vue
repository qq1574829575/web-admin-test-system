<template>
  <div>
    <el-page-header content="编辑流程" @back="goBack" />
    <process-design ref="processDesign" style="margin-top: 20px;" />
    <div style="text-align: center;margin-top: 20px;">
      <el-button
        v-if="processStatus === '1'"
        type="success"
        @click="saveProcess('/jiangoaoffice/Office/work/SubmitWorkForm.php')"
      >
        发布
      </el-button>
      <el-button
        type="success"
        plain
        @click="saveProcess('/jiangoaoffice/Office/work/ModifyWorkForm.php')"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import ProcessDesign from '../../../components/ProcessDesign'
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'EditProcess',
  components: { ProcessDesign },
  data() {
    return {
      formId: '',
      processStatus: '1' // 1.暂存 2.已发布
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    loadProcess(row) {
      this.formId = row.formId
      this.processStatus = row.formStatus
      this.$refs.processDesign.loadProcess(row)
    },
    saveProcess(url) {
      const formData = this.$refs.processDesign.getFormData()
      if (formData) {
        this.$http.post(url, {
          param: rsaUtil.encryption({
            formId: this.formId
          }),
          ...formData
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        }).then(res => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: res.data.message
          })
          this.$refs.processDesign.$refs.approvalProcess.setProcessNodes([])
          this.goBack()
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
