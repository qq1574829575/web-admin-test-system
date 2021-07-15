<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="70%"
    modal-append-to-body
    @open="onOpen"
  >
    <el-card v-loading="loading" :element-loading-text="`加载中...` + loadedRatio + `/` + numPages">
      <el-scrollbar v-if="src!==null" style="height: 60vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
        <pdf v-for="i in numPages" :key="i" :src="src" :page="i" @progress="loadedRatio = $event" />
      </el-scrollbar>
    </el-card>
  </el-dialog>
</template>

<script>
import pdf from 'vue-pdf'
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'PdfPreview',
  components: { pdf },
  props: {
    title: {
      type: String,
      default: '在线阅读'
    },
    visible: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      src: null,
      numPages: 0,
      loadedRatio: 0
    }
  },
  methods: {
    onOpen() {
      this.loading = true
      this.src = pdf.createLoadingTask({
        url: 'http://www.tushuguan.guolianrobot.com:37885/docunifiedplatform/webShow/ReadFile.php?param=' + rsaUtil.encryption_pdf() + '&readFileAddr=' + this.url
      })
      this.src.promise.then(pdf => {
        this.loading = false
        this.numPages = pdf.numPages
        console.log(this.numPages)
      }).catch(err => {
        console.error(err)
        this.loading = false
        this.$notify.error({
          title: '加载pdf失败',
          message: err.message,
          duration: 0
        })
      })
    },
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
</style>
