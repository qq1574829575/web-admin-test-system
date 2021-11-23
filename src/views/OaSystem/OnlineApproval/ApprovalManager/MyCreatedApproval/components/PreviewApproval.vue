<template>
  <div>
    <el-descriptions :column="1" size="medium" border>
      <el-descriptions-item label="审批标题">
        <div style="font-size: 20px">
          {{ approvalDetail.workName }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="发起人">
        友文
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
      <el-descriptions-item label="附件">
        <show-file-list :file-list="approvalDetail.accessoryArr" />
      </el-descriptions-item>
      <el-descriptions-item label="审批内容">
        <div v-html="approvalDetail.workContent" />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getQueryVariable } from '@/utils'
import UnEditableApprovalProcess from '../../../components/UnEditableApprovalProcess'
import ShowFileList from '../../../components/ShowFileList'
export default {
  name: 'PreviewApproval',
  components: {
    UnEditableApprovalProcess,
    ShowFileList
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
  mounted() {
    this.loadApprovalDetail()
  },
  methods: {
    loadApprovalDetail() {
      const approvalId = getQueryVariable('approvalId')
      if (!approvalId) {
        return
      }
      this.$http.post('/jiangoaoffice/Office/work/GetScanOfficeDetail.php', {
        workId: approvalId
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.approvalDetail = res.data.rows[0]
      })
    }
  }
}
</script>

<style scoped>

</style>
