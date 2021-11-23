<template>
  <!--处理审批组件-->
  <el-dialog
    title="处理审批"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="70%"
    modal-append-to-body
    @open="onOpen"
  >
    <el-scrollbar style="height: 60vh;margin-top: -30px;" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-descriptions :column="1" size="mini" border>
        <el-descriptions-item label="审批标题">
          <div style="font-size: 20px">
            {{ approvalDetail.workName }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="审批流程">
          <un-editable-approval-process
            :process-nodes="approvalDetail.formNodeArr"
            :show-node-status="true"
          />
        </el-descriptions-item>
        <el-descriptions-item label="审批表单">
          <div v-html="approvalDetail.workContent" />
        </el-descriptions-item>
        <el-descriptions-item label="审批附件">
          <show-file-list :file-list="approvalDetail.accessoryArr" />
        </el-descriptions-item>
      </el-descriptions>
    </el-scrollbar>
    <div style="text-align: right;margin-top: 20px;">
      <el-button
        type="success"
        icon="el-icon-circle-check"
        @click="showPassApprovalDialog = true"
      >
        通过并提交审核
      </el-button>
      <el-button
        type="warning"
        icon="el-icon-circle-close"
        @click="showRefuseApprovalDialog = true"
      >
        驳回
      </el-button>
    </div>
    <pass-approval-dialog
      :visible.sync="showPassApprovalDialog"
      :next-flag="approvalDetail.nextFlag"
      :approval-id="approvalId"
      :file-list="approvalDetail.accessorySelfArr"
      @onPass="passApproval"
      @onRefresh="onRefresh"
    />
    <refuse-approval-dialog
      :visible.sync="showRefuseApprovalDialog"
      @onRefuse="refuseApproval"
    />
  </el-dialog>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import UnEditableApprovalProcess from '../../../components/UnEditableApprovalProcess'
import ShowFileList from '../../../components/ShowFileList'
import PassApprovalDialog from './PassApprovalDialog'
import RefuseApprovalDialog from './RefuseApprovalDialog'

export default {
  name: 'HandleApproval',
  components: { RefuseApprovalDialog, PassApprovalDialog, ShowFileList, UnEditableApprovalProcess },
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
        nextFlag: '2',
        accessoryArr: [],
        accessorySelfArr: []
      },
      showPassApprovalDialog: false,
      showRefuseApprovalDialog: false
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
        this.approvalDetail = res.data.rows[0]
      })
    },
    onRefresh() {
      // 刷新下
      this.loadApprovalDetail()
    },
    passApproval(form) {
      // 通过审批
      this.$http.post('/jiangoaoffice/Office/work/ModifyPassOfficeWork.php', {
        param: rsaUtil.encryption({
          workId: this.approvalDetail.workId
        }),
        nextTeacherIdArr: this.approvalDetail.nextFlag === '1' || this.approvalDetail.nextFlag === '3' || this.approvalDetail.nextFlag === '4' ? JSON.stringify(form.nextTeacherIdArr) : 0,
        workContent: this.approvalDetail.workContent,
        workRemark: form.workRemark,
        workBaseFileArr: JSON.stringify(form.uploadFileList)
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.$notify({
          title: '提示',
          type: 'success',
          message: res.data.message
        })
        this.$emit('onHandled')
        this.onClose()
      })
    },
    refuseApproval(refuseType, workRefuse) {
      // 驳回审批
      this.$http.post('/jiangoaoffice/Office/work/ModifyRejectOfficeWork.php', {
        param: rsaUtil.encryption({
          workId: this.approvalDetail.workId
        }),
        flag: refuseType,
        workRefuse: workRefuse,
        refuseTeacherId: '0'
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.$notify({
          title: '提示',
          type: 'success',
          message: res.data.message
        })
        this.$emit('onHandled')
        this.onClose()
      })
    }
  }
}
</script>

<style scoped>

</style>
