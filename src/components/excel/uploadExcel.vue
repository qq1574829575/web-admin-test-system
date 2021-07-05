<template>
  <div class="import-box">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-upload"
      @click="importDialogVisible = true"
    >{{ name }}
    </el-button>
    <!-- 导入弹窗 -->
    <el-dialog
      :title="name"
      :visible.sync="importDialogVisible"
      width="40%"
      append-to-body
      @close="closeUpLoad"
    >
      <div>
        <!--<div style="color: #2D2D2D;margin-bottom: 10px;">导入文件</div>-->
        <el-upload
          ref="upload"
          class="upload-demo"
          action="#"
          name="file"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :limit="limitUpload"
          :multiple="false"
          :auto-upload="false"
        >
          <el-button
            slot="trigger"
            type="primary"
            size="mini"
          >选取文件
          </el-button>
          <!--<div-->
          <!--  slot="tip"-->
          <!--  class="el-upload__tip"-->
          <!--&gt;* 只 能 上 传 xlsx / xls 文 件-->
          <!--</div>-->
        </el-upload>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <div style="float: left">
          <el-button
            icon="el-icon-download"
            type="primary"
            size="mini"
            class="download-template"
            @click="templateDownload"
          >{{ name + '模板下载' }}
          </el-button>
        </div>
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitUpload"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ExportExcel from '@/excel/ExportExcel'

export default {
  name: 'UploadExcel',
  components: {},
  props: {
    // 网络请求地址
    url: {
      type: String,
      default: ''
    },

    // 表格名字
    name: {
      type: String,
      default: ''
    },

    // 下载模板的表头
    tHead: {
      type: Array,
      default() {
        return []
      }
    },

    // 需要替换key的数组
    propData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      limitUpload: 1,
      importDialogVisible: false,
      uploadData: []
    }
  },
  watch: {
    classId(newValue) {
      this.copyClassId = newValue
    }
  },
  mounted() {
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileTemp = null
      this.uploadData = []
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    handleChange(file, fileList) {
      this.fileTemp = file.raw
      if (this.fileTemp) {
        if (
          this.fileTemp.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          this.fileTemp.type === 'application/vnd.ms-excel'
        ) {
          this.importExcel(this.fileTemp, this.propData)
        } else {
          this.$message({
            type: 'warning',
            message: '附件格式错误，请删除后重新上传！'
          })
        }
      }
    },
    // 点击模板下载
    templateDownload() {
      ExportExcel(this.tHead, [], [], this.name)
    },
    // 提交上传导入
    submitUpload() {
      if (this.uploadData.length === 0) {
        this.$message({
          message: '请选择一个文件',
          type: 'warning'
        })
        return
      }
      this.$emit('onImportSuccess', this.uploadData)
      this.importDialogVisible = false
    },
    // 关闭上传弹框
    closeUpLoad() {
      this.$refs['upload'].clearFiles()
      this.uploadData = []
    },
    // 导入表格方法
    importExcel(obj, prop) {
      const _this = this
      // 通过DOM取文件数据
      this.file = obj
      const rABS = false // 是否将文件读取为二进制字符串
      const f = this.file
      const reader = new FileReader()
      FileReader.prototype.readAsBinaryString = function(f) {
        let binary = ''
        const rABS = false // 是否将文件读取为二进制字符串
        let wb // 读取完成的数据
        let outData
        const reader = new FileReader()
        reader.onload = function() {
          const bytes = new Uint8Array(reader.result)
          const length = bytes.byteLength
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          const XLSX = require('xlsx')
          if (rABS) {
            // eslint-disable-next-line no-undef
            wb = XLSX.read(btoa(fixdata(binary)), {
              // 手动转化
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          outData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) // outdata就是读取excel内容之后输出的东西
          // 调用getNewData替换 key 赋值给data中的数组
          _this.uploadData = _this.getNewData(outData, prop)
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    // 更换导入数组对象的key值
    getNewData(arr, key) {
      const newArr = []
      arr.forEach((item, index) => {
        const newObj = {}
        for (let i = 0; i < key.length; i++) {
          newObj[key[i]] = item[Object.keys(item)[i]]
        }
        newArr.push(newObj)
      })
      return newArr
    }
  }
}
</script>
<style lang="scss" scoped>
.import-box {
  display: inline;
  margin-left: 6px;
}
</style>
