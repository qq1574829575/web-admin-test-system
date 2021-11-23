<template>
  <el-dialog
    title="驳回审批"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="500px"
  >
    <div style="width: 400px;">
      <el-input v-model="workRefuse" placeholder="驳回原因" />
    </div>
    <el-radio-group
      v-model="refuseType"
      style="margin-top: 20px;"
    >
      <el-radio :label="1">驳回该审批</el-radio>
      <el-radio :label="2">驳回上一级</el-radio>
      <!--<el-radio :label="3">驳回指定节点</el-radio>-->
    </el-radio-group>
    <div style="text-align:right;margin-top: 20px;">
      <el-button type="primary" @click="confirm">确认驳回</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'RefuseApprovalDialog',
  components: { },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refuseType: 1,
      workRefuse: ''
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$emit('onRefuse', this.refuseType, this.workRefuse)
      this.onClose()
    }
  }
}
</script>

<style scoped>
</style>
