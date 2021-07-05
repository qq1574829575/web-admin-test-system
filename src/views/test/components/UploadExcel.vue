<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    action="#"
    name="file"
    :on-change="handleChange"
    :limit="1"
    :multiple="false"
    :auto-upload="false"
    :show-file-list="showFileList"
  >
    <el-button
      slot="trigger"
      type="primary"
      size="mini"
      icon="el-icon-upload"
    >{{ name }}
    </el-button>
  </el-upload>
</template>
<script>
const XLSX = require('xlsx')
export default {
  name: 'UploadExcel',
  components: {},
  props: {
    name: {
      type: String,
      default: ''
    },
    showFileList: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleChange(file, fileList) {
      if (file.raw) {
        if (
          file.raw.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.raw.type === 'application/vnd.ms-excel'
        ) {
          this.importExcel(file.raw)
          // 导入后清除文件列表，方便重复导入
          // this.$refs['upload'].clearFiles()
        } else {
          this.$message({
            type: 'warning',
            message: '附件格式错误，请删除后重新上传！'
          })
        }
      }
    },
    importExcel(obj) {
      const file = obj
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const workbook = XLSX.read(ev.target.result, {
            type: 'binary'
          })
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })
          this.$emit('onImportSuccess', data)
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(file)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
