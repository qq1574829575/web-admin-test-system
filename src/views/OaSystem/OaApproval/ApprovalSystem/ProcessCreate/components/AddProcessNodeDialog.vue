<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="right">
      <el-form-item label="流程节点名称:" prop="processNodeName">
        <el-input v-model="form.processNodeName" placeholder="流程节点名称" />
      </el-form-item>
      <el-form-item label="审核节点:" prop="approvalNodeList">
        <el-button size="mini" type="primary" @click="addApprovalNodeDialogVisible = true">增加审核节点</el-button>
        <el-table
          :data="form.approvalNodeList"
          style="width: 100%"
          size="mini"
          border
        >
          <el-table-column
            prop="approvalNodeName"
            label="审核节点名称"
          />
          <el-table-column
            label="审核人类型"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.approvalNodeReviewerType === '1'">指定</el-tag>
              <el-tag v-else>用户自行选择审核人</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="审核人"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.approvalNodeReviewerType === '1'">
                <el-tag v-for="(item,index) in scope.row.approvalNodeReviewers" :key="index">{{ item.teacherName }}</el-tag>
              </div>
              <el-tag v-else>用户自行选择审核人</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
    <add-approval-node-dialog :visible.sync="addApprovalNodeDialogVisible" @onAddApprovalNodeSuccess="onAddApprovalNodeSuccess" />
  </el-dialog>
</template>

<script>

import AddApprovalNodeDialog from '@/views/OaSystem/OaApproval/ApprovalSystem/ProcessCreate/components/AddApprovalNodeDialog'
export default {
  name: 'AddProcessNodeDialog',
  components: { AddApprovalNodeDialog },
  props: {
    name: {
      type: String,
      default: '增加流程节点'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addApprovalNodeDialogVisible: false,
      form: {
        processNodeName: '',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-time',
        color: '#909399',
        approvalNodeList: [],
        handleStatus: '0' // 节点处理状态 0待处理 1处理中 2已通过 3已驳回
      },
      rules: {
        processNodeName: [{ required: true, trigger: 'change', message: '请输入流程节点名称' }],
        approvalNodeList: [{ required: true, trigger: 'change', message: '请至少添加一个审核节点' }]
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
    onAddApprovalNodeSuccess(data) {
      this.addApprovalNodeDialogVisible = false
      this.form.approvalNodeList.push(data)
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('onAddProcessNodeSuccess', Object.assign({}, this.form))
          this.form.processNodeName = ''
          this.form.approvalNodeList = []
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
