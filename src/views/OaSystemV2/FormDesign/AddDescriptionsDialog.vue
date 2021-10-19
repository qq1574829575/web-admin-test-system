<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-form ref="mainForm" :model="form" label-width="100px" label-position="right">
      <el-form-item label="行字段" prop="descriptionsItems">
        <div>
          <el-input v-model="label" placeholder="请输入行字段名称" size="mini" style="width: 60%" />
          <el-button type="primary" size="mini" style="margin-left: 10px;" @click="addLineItem">添加行字段</el-button>
        </div>
        <el-table
          :data="form.descriptionsItems"
          style="width: 100%"
        >
          <el-table-column
            prop="label"
            label="字段名"
          />
        </el-table>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'AddDescriptionsDialog',
  props: {
    name: {
      type: String,
      default: '添加行'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        column: 2,
        size: '',
        border: true,
        descriptionsItems: []
      },
      label: ''
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    addLineItem() {
      if (this.label === '') {
        return
      }
      this.form.descriptionsItems.push({ label: this.label })
      this.label = ''
    },
    confirm() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.form.column = this.form.descriptionsItems.length
          this.$emit('onAddDescriptionsSuccess', Object.assign({}, this.form))
          this.form.descriptionsItems = []
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
