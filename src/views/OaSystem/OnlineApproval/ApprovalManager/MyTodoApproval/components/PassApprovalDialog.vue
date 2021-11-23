<template>
  <el-dialog
    title="您确定要通过该审批吗？"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="500px"
    @open="onOpen"
  >
    <el-form ref="form" v-loading="loading" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="审批意见" prop="workRemark">
        <el-input v-model="form.workRemark" placeholder="您的审批意见" />
      </el-form-item>
      <el-form-item
        v-if="nextFlag === '1' || nextFlag === '3' || nextFlag === '4'"
        label="下级审核人"
        prop="nextTeacherIdArr"
      >
        <el-select
          v-model="form.nextTeacherIdArr"
          placeholder="请选择下一级审核人"
          multiple
          value-key="teacherId"
        >
          <el-option
            v-for="item in finalTeacherList"
            :key="item.teacherId"
            :label="item.teacherName"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="附件">
        <upload-file
          url="http://www.unifiedplatform.guolianrobot.com//jiangoaoffice/Office/work/UploadWorkFile.php"
          :data="generateRsaData()"
          @onUploadSuccess="onUploadSuccess"
        />
        <show-closable-file-list
          :file-list="form.uploadFileList"
          :del-file="onDelFile"
        />
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

import UploadFile from '@/views/OaSystem/taskManager/components/UploadFile'
import rsaUtil from '@/utils/rsaUtil'
import ShowClosableFileList from '@/views/OaSystem/taskManager/components/ShowClosableFileList'
export default {
  name: 'PassApprovalDialog',
  components: { ShowClosableFileList, UploadFile },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    nextFlag: {
      type: String,
      default: ''
    },
    approvalId: {
      type: Number,
      default: null
    },
    fileList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        workRemark: '',
        nextTeacherIdArr: [],
        approvalReviewers: [],
        uploadFileList: []
      },
      rules: {
        workRemark: [{ required: true, trigger: 'change', message: '请输入您的审核意见' }],
        nextTeacherIdArr: [{ required: true, trigger: 'change', message: '请选择下一级审核的校级领导' }]
      },
      finalTeacherList: []
    }
  },
  methods: {
    onOpen() {
      this.form.uploadFileList = this.fileList
      if (this.finalTeacherList.length === 0) {
        this.getFinalTeacherList()
      }
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    getFinalTeacherList() {
      if (this.nextFlag === '1' || this.nextFlag === '3' || this.nextFlag === '4') {
        this.$http
          .post('/jiangoaoffice/Office/work/GetMainLeadList.php', {
            param: rsaUtil.encryption({
              flag: this.nextFlag
            })
          }, {
            baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
          })
          .then(res => {
            this.finalTeacherList = res.data.rows
          })
      }
    },
    generateRsaData() {
      return {
        param: rsaUtil.encryption({
          workId: this.approvalId
        })
      }
    },
    onUploadSuccess(res, file) {
      if (res.code === 1) {
        this.form.uploadFileList.push(res.rows)
        this.$notify({
          title: '提示',
          type: 'success',
          message: res.message
        })
        this.$emit('onRefresh')
      } else {
        this.$notify({
          title: '提示',
          type: 'error',
          message: res.message
        })
      }
    },
    onDelFile(index, file) {
      console.log(file)
      this.$confirm('您确定要删除文件' + file.accessoryTitle + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/jiangoaoffice/Office/work/DelWorkFile.php', {
          param: rsaUtil.encryption({
            accessoryId: file.accessoryId
          })
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        }).then(res => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: res.data.message
          })
          this.form.uploadFileList.splice(index, 1)
          this.$emit('onRefresh')
        })
      }).catch(() => {
      })
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('onPass', this.form)
          this.onClose()
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
