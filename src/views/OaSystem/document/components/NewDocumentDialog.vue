<template>
  <el-dialog
    :title="config.title"
    :visible.sync="config.visible"
    :before-close="onClose"
    append-to-body
    width="50%"
    modal-append-to-body
    @open="onOpen"
  >
    <el-form ref="form" :rules="rules" :model="formData" label-width="120px" label-position="right" size="mini">
      <el-form-item label="公文标题" prop="noticeTitle">
        <el-input v-model="formData.noticeTitle" placeholder="公文标题" />
      </el-form-item>
      <el-form-item label="文号" prop="noticeNum">
        <el-input v-model="formData.noticeNum" placeholder="公文文号" />
      </el-form-item>
      <el-form-item label="公文类型" prop="noticeType">
        <el-select v-model="formData.noticeType" placeholder="请选择公文类型">
          <el-option
            key="1"
            label="通知"
            value="通知"
          />
          <el-option
            key="2"
            label="方案"
            value="方案"
          />
          <el-option
            key="3"
            label="制度"
            value="制度"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="通知范围" prop="noticeRange">
        <el-radio v-model="radio" label="1">全校</el-radio>
        <el-radio v-model="radio" label="2">选择部门：
          <el-select
            v-model="selectedDept"
            style="width: 65%"
            placeholder="请选择"
            collapse-tags
            multiple
            clearable
            @change="radio = '2'"
          >
            <el-option
              v-for="item in options"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            />
          </el-select>
        </el-radio>
      </el-form-item>
      <el-form-item label="是否可下载" prop="isDownload">
        <el-radio v-model="formData.noticeFlag" label="1">可下载</el-radio>
        <el-radio v-model="formData.noticeFlag" label="2">不可下载</el-radio>
      </el-form-item>
      <el-form-item label="上传PDF文件" prop="noticeFileAddr">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="http://www.tushuguan.guolianrobot.com:37885/docunifiedplatform/CodeUploadPic.php"
          name="file"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :limit="1"
          accept=".pdf"
        >
          <el-button slot="trigger" type="primary" size="mini">选择PDF文件</el-button>
          <div v-if="formData.noticeFileAddr !== ''">文件已上传</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="confirm">确认</el-button>
        <el-button type="danger" size="small" @click="onClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'NewDocumentDialog',
  props: {
    config: {
      type: Object,
      default: function() {
        return {
          visible: false,
          title: '新建公文',
          type: 'add'
        }
      }
    }
  },
  data() {
    return {
      radio: '1',
      selectedDept: [],
      options: [],
      formData: {
        noticeTitle: '',
        noticeType: '通知',
        noticeNum: '',
        noticeFileAddr: '',
        noticeRange: '99',
        teacherNo: 'J00000',
        noticeFlag: '1'
      },
      rules: {
        noticeTitle: [{ required: true, trigger: 'blur', message: '请输入公文标题' }],
        noticeNum: [{ required: true, trigger: 'blur', message: '请输入公文文号' }],
        noticeType: [{ required: true, trigger: 'blur', message: '选择公文类型' }],
        noticeRange: [{ required: true, trigger: 'blur', message: '请选择通知范围' }],
        noticeFileAddr: [{ required: true, trigger: 'blur', message: '请选择PDF文件' }],
        noticeFlag: [{ required: true, trigger: 'blur', message: '请选择是否可下载' }]
      }
    }
  },
  methods: {
    onOpen() {
      this.getDeptList()
      if (this.formData.noticeRange === '99') {
        this.radio = '1'
      } else {
        this.selectedDept = JSON.parse(this.formData.noticeRange)
        this.radio = '2'
      }
      if (this.config.formData) {
        Object.assign(this.formData, this.config.formData)
      }
    },
    onClose() {
      this.selectedDept = []
      this.$refs['upload'].clearFiles()
      this.$emit('update:visible', false)
    },
    beforeUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'pdf'
      if (!extension) {
        this.$message.error('文件类型错误')
        return false
      }
      return true
    },
    handleSuccess(res, file) {
      if (res.result === true) {
        this.formData.noticeFileAddr = res.url
        this.$refs['upload'].clearFiles()
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    },
    getDeptList() {
      this.$http.post('jiangoaoffice/Office/office/GetDeptList.php', {
        param: rsaUtil.encryption_school()
      }).then(res => {
        this.options = res.rows
      })
    },
    handleChange(value) {
      console.log(value)
    },
    confirm() {
      if (this.radio === '1') {
        this.formData.noticeRange = '99'
      } else {
        if (this.selectedDept.length === 0) {
          this.formData.noticeRange = ''
        } else {
          this.formData.noticeRange = JSON.stringify(this.selectedDept)
        }
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.config.type === 'add') {
            this.$http.post('jiangoaoffice/Office/office/CreateOfficeNotice.php', {
              param: rsaUtil.encryption_school(),
              ...this.formData
            }).then(res => {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.$parent.buildParams()
              this.onClose()
            })
          } else {
            this.$http.post('jiangoaoffice/Office/office/ModifyOfficeNotice.php', {
              param: rsaUtil.encryption_school({
                noticeId: this.formData.noticeId
              }),
              ...this.formData
            }).then(res => {
              this.$parent.buildParams()
              this.onClose()
              if (res.code === 1) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
