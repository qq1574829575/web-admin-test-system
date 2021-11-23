<template>
  <!--不可编辑审批流程组件-->
  <el-timeline>
    <el-timeline-item
      v-for="(nodeReviews, index) in processNodes"
      :key="index"
    >
      <div v-for="(nodeReview,nodeReviewIndex) in nodeReviews" :key="nodeReviewIndex">
        <div v-if="index === 0">
          {{ nodeReview.nodeDeptName }}
          <i
            class="el-icon-user"
            style="color: #409EFF;font-size: 15px"
          >
            <span style="font-size: 8px">发起人</span>
          </i>
          <el-popover
            v-if="nodeReview.accessoryArr && nodeReview.accessoryArr.length > 0"
            placement="top"
            width="400"
            trigger="hover"
          >
            <show-file-list :file-list="nodeReview.accessoryArr" />
            <i
              slot="reference"
              class="el-icon-folder"
              style="cursor:pointer;color: #409EFF;font-size: 15px;margin-left: 5px;"
            >
              <span style="font-size: 8px">附件</span>
            </i>
          </el-popover>
        </div>
        <div v-else>
          {{ nodeReview.nodeDeptName }}
          <i
            v-if="nodeReview.status === '3'"
            class="el-icon-circle-check"
            style="color: #67C23A;font-size: 15px"
          >
            <span style="font-size: 8px">审核通过</span>
          </i>
          <i
            v-else-if="nodeReview.status === '2'"
            class="el-icon-time"
            style="color: #409EFF;font-size: 15px"
          >
            <span style="font-size: 8px">待审核</span>
          </i>
          <i
            v-else-if="nodeReview.status === '9'"
            class="el-icon-warning-outline"
            style="color: #F56C6C;font-size: 15px"
          >
            <span style="font-size: 8px">被驳回：{{ nodeReview.workRefuse }}</span>
          </i>
          <el-popover
            v-if="nodeReview.accessoryArr && nodeReview.accessoryArr.length > 0"
            placement="top"
            width="400"
            trigger="hover"
          >
            <show-file-list :file-list="nodeReview.accessoryArr" />
            <i
              slot="reference"
              class="el-icon-folder"
              style="cursor:pointer;color: #409EFF;font-size: 15px;margin-left: 5px;"
            >
              <span style="font-size: 8px">附件</span>
            </i>
          </el-popover>
        </div>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import ShowFileList from './ShowFileList'
export default {
  name: 'UnEditableApprovalProcess',
  components: { ShowFileList },
  props: {
    processNodes: {
      type: Array,
      default: function() {
        return []
      }
    },
    showNodeStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss">
</style>
