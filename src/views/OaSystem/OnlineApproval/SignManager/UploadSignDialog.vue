<template>
  <el-dialog
    title="上传签名"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="600px"
    modal-append-to-body
    @open="onOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="教师" prop="teacher">
        <el-cascader
          v-model="form.teacher"
          :options="teacherList"
          placeholder="搜索教师"
          filterable
        />
      </el-form-item>
      <el-form-item label="签名文件" prop="sign">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="http://www.unifiedplatform.guolianrobot.com/jiangoaoffice/Office/work/UploadSignFile.php"
          :on-success="onSuccess"
          accept=".png"
          :data="uploadData"
          :auto-upload="false"
          :limit="1"
          :drag="true"
          :on-exceed="onExceed"
          :on-change="onChange"
          :on-remove="onRemove"
          list-type="picture"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            支持上传的文件：.png
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="text-align: right;margin-top: 20px;">
      <el-button type="primary" @click="confirm">确认上传</el-button>
      <el-button @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'UploadSignDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      teacherList: [],
      uploadData: {},
      form: {
        teacher: [],
        sign: null
      },
      rules: {
        teacher: [{ required: true, trigger: 'change', message: '请选择教师' }],
        sign: [{ required: true, trigger: 'change', message: '请上传签名文件' }]
      }
    }
  },
  methods: {
    onOpen() {
      if (this.teacherList && this.teacherList.length > 0) {
        return
      }
      this.getTeacherList()
    },
    onClose() {
      this.form.teacher = []
      this.form.sign = null
      this.$emit('update:visible', false)
    },
    getTeacherList() {
      this.$http
        .post('/jiangoaoffice/Office/task/GetDeptTeacherList.php', {
          param: rsaUtil.encryption()
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        })
        .then(res => {
          this.teacherList = res.data.rows.map(row => {
            return {
              label: row.deptName,
              value: {
                deptId: row.deptId,
                deptName: row.deptName
              },
              children: row.deptArr.map(teacher => {
                return {
                  label: teacher.teacherName,
                  value: teacher.teacherId
                }
              })
            }
          })
        })
    },
    onChange(file) {
      if (!this.form.sign) {
        this.form.sign = file
      }
    },
    onRemove() {
      this.form.sign = null
    },
    onExceed() {
      this.$notify({
        type: 'warning',
        title: '提示',
        message: '仅可选择一个文件'
      })
    },
    onSuccess(res, file) {
      this.$refs.upload.clearFiles()
      if (res.code === 1) {
        this.$notify({
          title: '提示',
          type: 'success',
          message: res.message
        })
        this.onClose()
        this.$emit('uploadSuccess')
      } else {
        this.$notify({
          title: '提示',
          type: 'error',
          message: res.message
        })
      }
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.uploadData = {
            param: rsaUtil.encryption({
              teacherId: this.form.teacher[1]
            })
          }
          this.$nextTick(() => {
            this.$refs.upload.submit()
          })
          return true
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
