<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
    @open="onOpen"
  >
    <el-scrollbar style="height: 60vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-form ref="form" :model="form" label-width="100px" label-position="left">
        <el-form-item
          v-for="formItem in formItems"
          :key="formItem.key"
          :label="formItem.label"
          :rules="[{required: true, message: '不能为空', trigger: 'blur'}]"
          :prop="formItem.key"
        >
          <el-input
            v-if="formItem.type === 'input'"
            v-model="formItem.value"
            size="mini"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>

<script>

export default {
  name: 'FormPreviewDialog',
  props: {
    name: {
      type: String,
      default: '表单预览'
    },
    visible: {
      type: Boolean,
      default: false
    },
    formItemList: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      formItems: []
    }
  },
  // watch: {
  //   formItemList(val) {
  //     Object.assign(this.formItems, this.formItemList)
  //   }
  // },
  methods: {
    onOpen() {
      if (this.formItemList !== '') {
        this.formItems = JSON.parse(this.formItemList)
      }
    },
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
</style>
