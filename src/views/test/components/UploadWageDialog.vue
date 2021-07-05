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
  name: 'UploadWageDialog',
  props: {
    name: {
      type: String,
      default: '上传工资表'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadData: null,
      successMsg: '',
      errorMsg: '',
      failData: null
    }
  },
  methods: {
    onClose() {
      this.$refs['upload'].clearFiles()
      this.uploadData = null
      this.failData = null
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
        url: '/personnelsystem/PersonSystem/wage/CreateGroupTeacherWage.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school(),
          wageGroup: JSON.stringify(this.uploadData)
        }
      }).then(res => {
        console.log(res)
        this.$parent.getList()
        switch (res.code) {
          case 1:
            this.onClose()
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            break
          case 10010:
            this.successMsg = '本次共上传成功' + (this.uploadData.length - res.rows.length) + '条数据'
            this.errorMsg = '上传失败' + res.rows.length + '条数据'
            this.failData = res.rows
            break
          default:
            this.$message({
              type: 'error',
              message: res.message || '上传失败'
            })
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
            data.splice(0, 3)
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
        const multiHeader = [['教职工编号', '部门代码', '序号', '年月', '姓名', '工资标准', '', '', '超工作量课时津贴', '', '', '各类津贴', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '小计', '应加', '', '', '', '', '', '应减', '', '', '应发工资', '五险一金', '应税工资', '六项专项附加扣除', '应交税', '工会会费', '实发工资1', '上传失败原因']]
        const multiHeader2 = [['', '', '', '', '', '预发岗位工资', '职务津贴', '绩效工资', '本科课时', '当月课时', '小计', '省级学科带头人津贴', '省级骨干教师', '学位津贴', '', '', '高职称津贴', '', '紧缺专业', '', '双师型', '延时补贴', '兼任', '', '', '副校长津贴', '其他', '', '校龄津贴', '', '班主任津贴', '班主任余额津贴', '津贴', '', '', '', '应扣', '请假或缺勤', '上一年度未完成工作', '', '', '', '', '', '', '', '']]
        const header = ['', '', '', '', '', '', '', '', '', '', '', '', '', '博士', '双证硕士', '单证硕士', '教授', '副教授', '硕士', '本科', '', '', '各类组织', '教研室职务', '督导员', '', '固定工资或津贴', '保险补助', '', '', '', '', '加班津贴', '其他津贴', '津贴或奖励', '工资核补', '', '', '', '', '', '', '', '', '', '', '']
        const merges = ['A1:A3', 'B1:B3', 'C1:C3', 'D1:D3', 'E1:E3', 'F1:H1', 'F2:F3', 'G2:G3', 'H2:H3', 'I1:K1', 'I2:I3', 'J2:J3', 'K2:K3', 'L1:AC1', 'L2:L3', 'M2:M3', 'N2:P2', 'Q2:R2', 'S2:T2', 'U2:U3', 'V2:V3', 'W2:Y2', 'Z2:Z3', 'AA2:AB2', 'AC2:AC3', 'AD1:AD3', 'AE1:AJ1', 'AE2:AE3', 'AF2:AF3', 'AG2:AJ2', 'AK1:AM1', 'AK2:AK3', 'AL2:AL3', 'AM2:AM3', 'AN1:AN3', 'AO1:AO3', 'AP1:AP3', 'AQ1:AQ3', 'AR1:AR3', 'AS1:AS3', 'AT1:AT3', 'AU1:AU3']
        excel.export_json_to_excel({
          multiHeader,
          multiHeader2,
          header: header,
          merges,
          data: this.failData,
          filename: '上传失败数据表格'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
