<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-scrollbar style="height: 60vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-timeline style="margin-top: 10px;">
        <el-timeline-item
          v-for="(node, index) in nodeList"
          :key="index"
          :icon="node.icon"
          :type="node.type"
          :color="node.color"
          :size="node.size"
        >
          {{ node.nodeName }}
          <el-divider content-position="left">节点审核人</el-divider>
          <div v-if="node.reviewerRadio === '1'">
            <el-tag
              v-for="(reviewer, reviewerIndex) in node.reviewers"
              :key="reviewerIndex"
              style="margin-right: 2px;"
            >
              {{ reviewer.teacherName }}
            </el-tag>
          </div>
          <div v-else>
            <el-select
              v-model="node.reviewers"
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
        </el-timeline-item>
      </el-timeline>
    </el-scrollbar>
  </el-dialog>
</template>

<script>

export default {
  name: 'PreviewNodesDialog',
  props: {
    name: {
      type: String,
      default: '审核流程'
    },
    visible: {
      type: Boolean,
      default: false
    },
    nodeList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      reviewerList: [
        {
          teacherId: '1',
          teacherName: '张三',
          handleStatus: '0' // 审核人处理状态 0待处理 1处理中 2已通过 3已驳回
        },
        {
          teacherId: '2',
          teacherName: '李四',
          handleStatus: '0'
        }
      ]
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
</style>
