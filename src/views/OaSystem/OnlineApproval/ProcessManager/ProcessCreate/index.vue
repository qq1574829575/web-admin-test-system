<template>
  <el-card class="fq-custom-card">
    <process-design ref="processDesign" />
    <div style="text-align: center;margin-top: 20px;">
      <el-button type="success" icon="el-icon-circle-check" @click="saveProcess('2')">创建流程</el-button>
      <el-button icon="el-icon-download" plain @click="saveProcess('1')">保存草稿</el-button>
    </div>
  </el-card>
</template>

<script>
import ProcessDesign from '../../components/ProcessDesign'
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'Index',
  components: { ProcessDesign },
  data() {
    return {
    }
  },
  methods: {
    saveProcess(flag) {
      const formData = this.$refs.processDesign.getFormData()
      console.log(formData)
      if (formData) {
        this.$http.post('/jiangoaoffice/Office/work/CreateWorkForm.php', {
          param: rsaUtil.encryption(),
          ...formData,
          flag: flag
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        }).then(res => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: res.data.message
          })
          this.$refs.processDesign.resetForm()
          this.$refs.processDesign.$refs.approvalProcess.setProcessNodes([])
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
