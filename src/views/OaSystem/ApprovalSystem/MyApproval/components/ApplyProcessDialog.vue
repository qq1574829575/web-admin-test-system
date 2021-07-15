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
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >
          <el-card>
            <h4>{{ activity.content }}</h4>
            <p>{{ activity.name }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-scrollbar>
  </el-dialog>
</template>

<script>

export default {
  name: 'ApplyProcessDialog',
  props: {
    name: {
      type: String,
      default: '审批进度'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      activities: [{
        name: '张三',
        content: '通过申请',
        timestamp: '2018-04-12 20:46',
        type: 'success',
        size: 'large',
        icon: 'el-icon-success'
      }, {
        name: '李四',
        content: '情况属实，请上级批示',
        timestamp: '2018-04-03 20:46',
        type: 'success',
        size: 'large',
        icon: 'el-icon-success'
      }, {
        name: '王五',
        content: '情况属实，请上级批示',
        timestamp: '2018-04-03 20:46',
        type: 'success',
        size: 'large',
        icon: 'el-icon-success'
      }, {
        name: '赵六',
        content: '情况属实，请上级批示',
        timestamp: '2018-04-03 20:46',
        type: 'success',
        size: 'large',
        icon: 'el-icon-success'
      }, {
        name: '我',
        content: '发起申请',
        timestamp: '2018-04-03 20:46',
        type: 'success',
        size: 'large',
        icon: 'el-icon-success'
      }]
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
