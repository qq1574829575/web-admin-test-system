<template>
  <el-upload
    class="upload-demo"
    :action="url"
    :on-success="handleUploadSuccess"
    :before-upload="beforeUpload"
    accept=".rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,.jpg,.png,.gif,.jpeg"
    :data="data"
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
    <div slot="tip" class="el-upload__tip">
      支持上传的文件：.rar .zip .doc .docx .pdf .xlsx .jpg...
    </div>
  </el-upload>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    url: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      uploadBtnConfig: {
        title: '点击上传',
        loading: false,
        disabled: false
      }
    }
  },
  methods: {
    beforeUpload() {
      this.uploadBtnConfig.title = '正在上传'
      this.uploadBtnConfig.loading = true
      this.uploadBtnConfig.disabled = true
    },
    handleUploadSuccess(res, file) {
      this.uploadBtnConfig.title = '点击上传'
      this.uploadBtnConfig.loading = false
      this.uploadBtnConfig.disabled = false
      this.$emit('onUploadSuccess', res, file)
    }
  }
}
</script>

<style scoped>

</style>
