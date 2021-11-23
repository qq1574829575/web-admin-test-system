<template>
  <!--可编辑审批流程组件-->
  <div style="display: flex">
    <el-tooltip
      effect="dark"
      content="添加流程节点"
      placement="top"
    >
      <div
        style="width: 60px;height: 60px;cursor:pointer;text-align: center"
        class="div-my-card"
        @click="addProcessNode"
      >
        <i class="el-icon-plus" style="font-size: 30px;transform: translateY(50%);" />
      </div>
    </el-tooltip>
    <el-timeline>
      <el-timeline-item
        v-for="(nodeReviews, index) in processNodes"
        :key="index"
      >
        <div v-for="(nodeReview,nodeReviewIndex) in nodeReviews" :key="nodeReviewIndex">
          <div>
            {{ nodeReview.nodeDeptName }}-{{ nodeReview.nodePosition }}
            <el-tooltip
              effect="dark"
              content="删除该审核人"
              placement="top"
            >
              <i
                class="el-icon-close"
                style="color: red;font-size: 15px;cursor:pointer;"
                @click="delReviewer(nodeReviewIndex,nodeReviews, index)"
              />
            </el-tooltip>
            <el-tooltip
              v-if="(nodeReviewIndex+1) === nodeReviews.length"
              effect="dark"
              content="添加审核人"
              placement="top"
            >
              <i
                class="el-icon-plus"
                style="cursor:pointer;"
                @click="addReviewer(nodeReviews)"
              />
            </el-tooltip>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <choose-reviewer-dialog
      :visible.sync="showChooseReviewer"
      @onChoose="onChooseReviewer"
    />
  </div>
</template>

<script>
import ChooseReviewerDialog from './ChooseReviewerDialog'
export default {
  name: 'EditableApprovalProcess',
  components: { ChooseReviewerDialog },
  data() {
    return {
      showChooseReviewer: false,
      chooseReviewerType: 1, // 选择审核人的方式，1添加节点，2现有节点基础上添加审核人
      addReviewProcessNode: null,
      processNodes: []
    }
  },
  methods: {
    onChooseReviewer(selectedReviewers) {
      console.log(selectedReviewers)
      const reviewers = []
      for (const reviewer of selectedReviewers) {
        let nodeDeptId = ''
        let nodePosition = ''
        let teacherNo = ''
        switch (reviewer.length) {
          case 2:
            nodeDeptId = reviewer[1].nodeDeptId
            nodePosition = reviewer[1].nodePosition
            teacherNo = reviewer[1].teacherNo
            break
          case 3:
            nodeDeptId = reviewer[2].nodeDeptId
            nodePosition = reviewer[2].nodePosition
            teacherNo = reviewer[2].teacherNo
            break
        }
        reviewers.push({
          nodeDeptName: reviewer[0].deptName,
          nodeDeptId: nodeDeptId,
          nodePosition: nodePosition,
          teacherNo: teacherNo
        })
      }
      if (this.chooseReviewerType === 1) {
        this.processNodes.push(reviewers)
      } else {
        this.addReviewProcessNode.push(...reviewers)
      }
      this.$emit('onChangeProcess', this.processNodes)
    },
    setProcessNodes(processNodes) {
      this.processNodes = processNodes
    },
    delReviewer(reviewIndex, processNode, nodeIndex) {
      if (processNode.length === 1) {
        this.processNodes.splice(nodeIndex, 1)
      } else {
        processNode.splice(reviewIndex, 1)
      }
      this.$emit('onChangeProcess', this.processNodes)
    },
    addReviewer(processNode) {
      this.chooseReviewerType = 2
      this.addReviewProcessNode = processNode
      this.showChooseReviewer = true
    },
    addProcessNode() {
      this.chooseReviewerType = 1
      this.showChooseReviewer = true
    }
  }
}
</script>

<style lang="scss">
.diy-approval-node-box{
  display: flex;
  padding: 10px;
  width: 100%;
  .diy-approval-node-box-item {
    flex-shrink: 0;
    .diy-approval-node-box-item-arrow {
      text-align: center;
      width: 50px;
    }
  }
  .diy-approval-node-box-item:first-child{
    margin-left: -15px;
    .diy-approval-node-box-item-arrow{
      display: none;
    }
  }
  .diy-approval-node-box-item:last-child{
    .div-my-card{
      margin-right: 20px;
    }
  }
}

.div-my-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>
