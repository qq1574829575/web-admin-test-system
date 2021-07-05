<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-scrollbar v-if="routeData" style="height: 60vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="left">
        <el-form-item label="路由名称" prop="name">
          <el-input v-model="form.name" placeholder="路由名称" />
        </el-form-item>
        <el-form-item label="路由标题" prop="metaTitle">
          <el-input v-model="form.meta.title" placeholder="路由标题" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="form.path" placeholder="路由路径" />
        </el-form-item>
        <el-form-item label="路由组件" prop="component">
          <el-input v-model="form.component" placeholder="路由组件" />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="form.redirect" placeholder="重定向" />
        </el-form-item>
        <el-form-item label="路由图标" prop="metaIcon">
          <el-input v-model="form.meta.icon" placeholder="Icon图标类名" />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-switch
            v-model="form.hidden"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="是否粘附" prop="affix">
          <el-switch
            v-model="form.meta.affix"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="总是显示" prop="alwaysShow">
          <el-switch
            v-model="form.alwaysShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button type="danger" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'AddChildRoutesDialog',
  props: {
    name: {
      type: String,
      default: '添加子路由'
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
      if (this.form.meta.title === '') {
        callback(new Error('请输入路由标题'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        path: '',
        component: '',
        hidden: false,
        alwaysShow: true,
        redirect: 'noRedirect', // 在面包屑中不可点击
        meta: {
          title: '',
          icon: '',
          affix: false // 粘附
        }
      },
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
      this.$emit('update:visible', false)
    },
    cancel() {
      this.$parent.getRoutes()
      this.onClose()
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.routeData.children) {
            this.$set(this.routeData, 'children', [])
          }
          this.routeData.children.push(this.form)
          this.$emit('onAddChildRouteSuccess', this.routeData)
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
