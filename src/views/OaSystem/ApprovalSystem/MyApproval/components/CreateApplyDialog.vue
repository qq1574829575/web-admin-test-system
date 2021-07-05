<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-scrollbar style="height: 60vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="100px" label-position="left">
        <el-form-item label="申请标题" prop="title">
          <el-input v-model="form.title" placeholder="申请标题" />
        </el-form-item>
        <el-form-item label="申请类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择申请类型">
            <el-option
              label="用印申请"
              value="用印申请"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="附件" prop="file">
          <el-input v-model="form.file" placeholder="附件" />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'CreateApplyDialog',
  props: {
    name: {
      type: String,
      default: '发起申请'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      form: {
        title: '',
        type: '',
        file: '测试1.doc',
        time: '2021.7.1',
        status: 1
      },
      rules: {
        title: [{ required: true, trigger: 'blur', message: '请输入申请标题' }],
        type: [{ required: true, trigger: 'blur', message: '请选择申请类型' }]
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('onCreateApply', this.form)
          this.onClose()
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
