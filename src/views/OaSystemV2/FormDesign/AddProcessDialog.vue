<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-select v-model="value" placeholder="请选择节点审核部门（人）">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'AddProcessDialog',
  props: {
    name: {
      type: String,
      default: '添加审核节点'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [{
        value: '学院',
        label: '学院'
      }, {
        value: '学工处',
        label: '学工处'
      }, {
        value: '教务处',
        label: '教务处'
      }, {
        value: '副校长',
        label: '副校长'
      }, {
        value: '校长',
        label: '校长'
      }],
      value: ''
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    confirm() {
      const data = {
        column: 2,
        size: '',
        border: true,
        descriptionsItems: []
      }
      data.descriptionsItems.push({ label: this.value + '意见' })
      data.descriptionsItems.push({ label: this.value + '签字（盖章）' })
      this.$emit('onAddProcessSuccess', data)
    }
  }
}
</script>

<style scoped>
</style>
