<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
    modal-append-to-body
    :fullscreen="dialogFull"
    @open="onOpen"
  >
    <template slot="title">
      <div class="avue-crud__dialog__header">
        <span class="el-dialog__title">
          <span style="display:inline-block;background-color: #3478f5;width:3px;height:20px;margin-right:5px; float: left;margin-top:2px" />
          {{ title }}
        </span>
        <div class="avue-crud__dialog__menu" @click="onFullScreenClick">
          <i class="el-icon-full-screen" />
        </div>
      </div>
    </template>
    <el-card v-loading="loading" :element-loading-text="`加载中...` + loadedRatio + `/` + numPages">
      <el-scrollbar v-if="src!==null" :style="scrollbarStyle" :wrap-style="[{ 'overflow-x': 'hidden'}]">
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
      loadedRatio: 0,
      dialogFull: false,
      scrollbarStyle: {
        height: '60vh'
      }
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
    },
    onFullScreenClick() {
      if (this.dialogFull) {
        this.dialogFull = false
        this.scrollbarStyle.height = '60vh'
      } else {
        this.dialogFull = true
        this.scrollbarStyle.height = '80vh'
      }
    }
  }
}
</script>

<style scoped>
/*  dialog*/
.el-dialog__header {
  padding: 15px 20px 15px;
}
.el-dialog__headerbtn{
  top: 15px;
}

.el-dialog__headerbtn i {
  font-size: 25px;
}

/*dialog header*/
.el-dialog__header{
  background: #e3eaed;
}
.avue-crud__dialog__header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.el-dialog__title {
  color: rgba(0,0,0,.85);
  font-weight: 500;
  word-wrap: break-word;
}
.avue-crud__dialog__menu {
  padding-right: 20px;
  float: left;
  margin-top: -5px;
}
.avue-crud__dialog__menu i {
  color: #909399;
  font-size: 15px;
}
.el-icon-full-screen{
  cursor: pointer;
}
.el-icon-full-screen:before {
  content: "\e719";
}
</style>
