<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    width="40%"
    append-to-body
  >
    <el-upload
      ref="upload"
      class="upload-demo"
      action="#"
      name="file"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :limit="1"
      :multiple="false"
      :auto-upload="false"
    >
      <el-button
        slot="trigger"
        type="primary"
        size="mini"
        icon="el-icon-upload"
      >选择文件
      </el-button>
    </el-upload>
    <div v-if="failData.length > 0" style="width:100%;margin: 0 auto;font-size: 20px">
      <div>
        <i style="color: green;" class="el-icon-success" />
        {{ successMsg }}
      </div>
      <div style="margin-top: 10px;font-size: 20px">
        <i style="color: red;" class="el-icon-error" />
        {{ errorMsg }}
      </div>
      <el-button style="margin-top: 10px;" type="primary" size="mini" icon="el-icon-download" @click="handleDownload()">下载上传失败数据表格</el-button>
    </div>
    <div style="text-align:right;">
      <el-button type="primary" size="small" @click="upload">确认上传</el-button>
      <el-button type="danger" size="small" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'
const XLSX = require('xlsx')
export default {
  name: 'CwUploadDialog',
  props: {
    name: {
      type: String,
      default: '上传财务明细'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadData: [],
      failData: [],
      successMsg: '',
      errorMsg: ''
    }
  },
  methods: {
    onClose() {
      this.$refs['upload'].clearFiles()
      this.uploadData = []
      this.failData = []
      this.$emit('update:visible', false)
    },
    upload() {
      if (this.uploadData.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要上传的文件'
        })
        return
      }
      request({
        url: '/personnelsystem/PersonSystem/wage/CreateGroupCwDetail.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school(),
          cwGroup: JSON.stringify(this.uploadData)
        }
      }).then(res => {
        console.log(res)
        this.$parent.getList()
        switch (res.code) {
          case 1:
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.onClose()
            break
          case 10010:
            this.failData = res.rows
            this.successMsg = '本次共上传成功' + (this.uploadData.length - res.rows.length) + '条数据'
            this.errorMsg = '上传失败' + res.rows.length + '条数据'
            break
        }
      })
    },
    handleRemove(file, fileList) {
      this.uploadData = []
    },
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
          if (data && data.length > 0) {
            data.splice(0, 1)
            for (const item of data) {
              this.uploadData.push({
                wageDate: item[0],
                wageTeacherNo: item[1],
                wageTeacherName: item[2],
                wageCwZKK: item[3],
                wageCwKFZ: item[4],
                wageCwYFK: item[5],
                wageCwZSQK: item[6],
                wageCwBKSJ: item[7],
                wageSFGZ2: item[8],
                wageCwBankName: item[9]
              })
            }
            console.log(this.uploadData)
          }
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(file)
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const header = ['年月', '教职工号', '姓名', '暂扣款', '扣房租', '预发款', '招生欠款', '补扣税金', '上传失败原因']
        const data = []
        for (const item of this.failData) {
          data.push([item.wageDate, item.wageTeacherNo, item.wageTeacherName, item.wageCwZKK, item.wageCwKFZ, item.wageCwYFK, item.wageCwZSQK, item.wageCwBKSJ, item.ecause])
        }
        excel.export_json_to_excel({
          header: header,
          data,
          filename: '上传失败数据表格'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
