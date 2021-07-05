<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-scrollbar v-if="routeData" style="height: 60vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-form ref="form" :rules="rules" :model="routeData" label-width="100px" label-position="left">
        <el-form-item label="路由名称" prop="name">
          <el-input v-model="routeData.name" placeholder="路由名称" />
        </el-form-item>
        <el-form-item label="路由标题" prop="metaTitle">
          <el-input v-model="routeData.meta.title" placeholder="路由标题" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="routeData.path" placeholder="路由路径" />
        </el-form-item>
        <el-form-item label="路由组件" prop="component">
          <el-input v-model="routeData.component" placeholder="路由组件" />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="routeData.redirect" placeholder="重定向" />
        </el-form-item>
        <el-form-item label="路由图标" prop="metaIcon">
          <el-input v-model="routeData.meta.icon" placeholder="Icon图标类名" />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-switch
            v-model="routeData.hidden"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="是否粘附" prop="affix">
          <el-switch
            v-model="routeData.meta.affix"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="总是显示" prop="alwaysShow">
          <el-switch
            v-model="routeData.alwaysShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
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
  name: 'EditChildRoutesDialog',
  props: {
    name: {
      type: String,
      default: '添加路由'
    },
    visible: {
      type: Boolean,
      default: false
    },
    routeData: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkMetaTitle = (rule, value, callback) => {
      if (this.routeData.meta.title === '') {
        callback(new Error('请输入路由标题'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入路由名称' }],
        path: [{ required: true, trigger: 'blur', message: '请输入路由路径' }],
        metaTitle: [{ required: true, validator: checkMetaTitle, trigger: 'blur' }],
        component: [{ required: true, trigger: 'blur', message: '请输入路由组件地址' }]
      }
    }
  },
  methods: {
    onClose() {
      this.$parent.getRoutes()
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('onEditSuccess', this.routeData)
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
