<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="80%"
  >
    <fc-designer ref="designer" height="60vh">
    </fc-designer>
    <div style="text-align:right;">
      <el-button type="primary" @click="complete">完成</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'AddFormItemDialog',
  props: {
    name: {
      type: String,
      default: '添加表单项'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    complete() {
      const rule = this.$refs.designer.getRule()
      const options = this.$refs.designer.getOption()
      this.$emit('onDesignFormSuccess', rule, options)
    }
  }
}
</script>

<style scoped>
</style>
