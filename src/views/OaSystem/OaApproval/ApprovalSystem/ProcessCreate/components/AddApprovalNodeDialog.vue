<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="right">
      <el-form-item label="审核节点名称:" prop="approvalNodeName">
        <el-input v-model="form.approvalNodeName" placeholder="审核节点名称" />
      </el-form-item>
      <el-form-item label="审核节点:" prop="approvalNodeReviewers">
        <el-radio v-model="form.approvalNodeReviewerType" label="1">指定</el-radio>
        <el-radio v-model="form.approvalNodeReviewerType" label="2">用户自行选择</el-radio>
        <div v-if="form.approvalNodeReviewerType === '1'">
          <el-select
            v-model="form.approvalNodeReviewers"
            value-key="teacherId"
            multiple
            placeholder="请选择节点审核人"
            style="width: 50%;"
          >
            <el-option
              v-for="item in reviewerList"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item"
            />
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'AddApprovalNodeDialog',
  props: {
    name: {
      type: String,
      default: '增加审核节点'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const checkReviewers = (rule, value, callback) => {
      if (this.form.approvalNodeReviewerType === '1' && this.form.approvalNodeReviewers.length === 0) {
        callback(new Error('请选择节点审核人'))
      } else {
        callback()
      }
    }
    return {
      form: {
        approvalNodeName: '',
        approvalNodeReviewerType: '1',
        approvalNodeReviewers: [],
        handleStatus: '0' // 节点处理状态 0待处理 1处理中 2已通过 3已驳回
      },
      rules: {
        approvalNodeName: [{ required: true, trigger: 'change', message: '请输入审核节点名称' }],
        approvalNodeReviewers: [{ required: true, trigger: 'change', validator: checkReviewers }]
      },
      reviewerList: [
        {
          teacherId: '3',
          teacherName: '王五',
          handleStatus: '0' // 审核人处理状态 0待处理 1已通过 2已驳回
        },
        {
          teacherId: '4',
          teacherName: '孙六',
          handleStatus: '0'
        }
      ]
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.approvalNodeReviewerType === '2') {
            this.form.approvalNodeReviewers = []
          }
          this.$emit('onAddApprovalNodeSuccess', Object.assign({}, this.form))
          this.form.approvalNodeName = ''
          this.form.approvalNodeReviewers = []
          this.form.approvalNodeReviewerType = '1'
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
