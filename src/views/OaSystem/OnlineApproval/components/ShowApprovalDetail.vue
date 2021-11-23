<template>
  <el-dialog
    title="审批详情"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="70%"
    modal-append-to-body
    @open="onOpen"
  >
    <el-scrollbar
      style="height: 60vh;margin-top: -30px;"
      :wrap-style="[{ 'overflow-x': 'hidden'}]"
    >
      <el-descriptions :column="1" size="medium" border>
        <el-descriptions-item label="审批标题">
          {{ approvalDetail.workName }}
        </el-descriptions-item>
        <el-descriptions-item label="发起人">
          {{ approvalDetail.sponsorName }}
        </el-descriptions-item>
        <el-descriptions-item label="所属部门">
          {{ approvalDetail.deptName }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="approvalDetail.status === '1'">待提交</el-tag>
          <el-tag v-if="approvalDetail.status === '2'" type="warning">审批中</el-tag>
          <el-tag v-if="approvalDetail.status === '3'" type="success">已通过</el-tag>
          <el-tag v-if="approvalDetail.status === '4'" type="warning">待阅</el-tag>
          <el-tag v-if="approvalDetail.status === '5'" type="danger">被驳回</el-tag>
          <el-tag v-if="approvalDetail.status === '6'" type="danger">被驳回</el-tag>
          <el-tag v-if="approvalDetail.status === '7'" type="info">已撤回</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审批进度">
          <un-editable-approval-process
            :process-nodes="approvalDetail.formNodeArr"
            :show-node-status="true"
          />
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ approvalDetail.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="审批附件">
          <show-file-list :file-list="approvalDetail.accessoryArr" />
        </el-descriptions-item>
        <el-descriptions-item label="审批内容">
          <div v-html="approvalDetail.workContent" />
        </el-descriptions-item>
      </el-descriptions>
    </el-scrollbar>
    <iframe
      ref="iframe"
      :src="`/#/PrintApproval?approvalId=` + approvalId"
      style="visibility: hidden;height: 0"
    />
    <div style="text-align: right;margin-top: 10px;">
      <el-button
        type="primary"
        @click="printIframe"
      >
        打印审批表
      </el-button>
      <el-button
        @click="onClose"
      >
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import UnEditableApprovalProcess from './UnEditableApprovalProcess'
import ShowFileList from './ShowFileList'
export default {
  name: 'ShowApprovalDetail',
  components: { ShowFileList, UnEditableApprovalProcess },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    approvalId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      approvalDetail: {
        workName: '',
        status: '',
        createTime: '',
        workContent: '',
        formNodeArr: [],
        accessoryArr: []
      }
    }
  },
  methods: {
    onOpen() {
      this.loadApprovalDetail()
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    loadApprovalDetail() {
      this.$http.post('/jiangoaoffice/Office/work/GetOfficeWorkDetail.php', {
        param: rsaUtil.encryption({
          workId: this.approvalId
        })
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        if (res.data.rows && res.data.rows.length > 0) {
          this.approvalDetail = res.data.rows[0]
        }
      })
    },
    printIframe() {
      this.$refs.iframe.contentWindow.print()
    }
  }
}
</script>

<style scoped>

</style>
