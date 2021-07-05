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
    <div v-if="failData && failData.length > 0" style="width:100%;margin: 0 auto;font-size: 20px">
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
  name: 'UploadAllowanceDialog',
  props: {
    name: {
      type: String,
      default: '上传津贴表'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadData: [],
      successMsg: '',
      errorMsg: '',
      failData: []
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
      const list = []
      for (const item of this.uploadData) {
        const wageDate = item[1]
        const wageTeacherNo = item[0]
        const llowanceArr = []
        item.splice(0, 3)
        for (let i = 0; i < item.length; i++) {
          if (i % 2 === 0) {
            const allowanceName = item[i]
            const allowanceMoney = item[i + 1]
            llowanceArr.push({
              allowanceName: allowanceName,
              allowanceMoney: allowanceMoney
            })
          }
        }
        const row = {
          wageDate: wageDate,
          wageTeacherNo: wageTeacherNo,
          allowanceArr: llowanceArr
        }
        list.push(row)
      }
      request({
        url: '/personnelsystem/PersonSystem/wage/CreateGroupAllowance.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school(),
          allowanceGroup: JSON.stringify(list)
        }
      }).then(res => {
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
        this.$refs['upload'].clearFiles()
        this.uploadData = []
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
            data.splice(0, 2)
            this.uploadData = data
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
        const data = []
        for (const item of this.failData) {
          const row = [item.wageTeacherNo, item.wageTeacherName, item.wageDate]
          for (const tmp of item.allowanceArr) {
            row.push(tmp.allowanceName, tmp.allowanceMoney)
          }
          row.push(item.ecause)
          data.push(row)
        }
        const multiJtHeader = []
        for (let i = 1; i <= 30; i++) {
          const tmp = ['津贴' + i, '']
          multiJtHeader.push(...tmp)
        }
        const multiHeader = [['教职工号', '姓名', '年月', ...multiJtHeader, '上传失败原因']]
        const jtHeader = []
        for (let i = 1; i <= 30; i++) {
          const tmp = ['名称', '金额']
          jtHeader.push(...tmp)
        }
        const header = ['', '', '', ...jtHeader]
        const merges = ['A1:A2', 'B1:B2', 'C1:C2', 'D1:E1', 'F1:G1', 'H1:I1', 'J1:K1', 'L1:M1', 'N1:O1', 'P1:Q1', 'R1:S1', 'T1:U1', 'V1:W1', 'X1:Y1', 'Z1:AA1', 'AB1:AC1', 'AD1:AE1', 'AF1:AG1', 'AH1:AI1', 'AJ1:AK1', 'AL1:AM1', 'AN1:AO1', 'AP1:AQ1', 'AR1:AS1', 'AT1:AU1', 'AV1:AW1', 'AX1:AY1', 'AZ1:BA1', 'BB1:BC1', 'BD1:BE1', 'BF1:BG1', 'BH1:BI1', 'BJ1:BK1', 'BL1:BL2']
        excel.export_json_to_excel({
          multiHeader,
          header: header,
          data: data,
          merges,
          filename: '上传津贴表失败数据表格',
          autoWidth: false
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
