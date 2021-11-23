<template>
  <el-dialog
    title="编辑路由"
    :visible.sync="visible"
    :before-close="onClose"
    width="60%"
    @open="onOpen"
  >
    <el-scrollbar style="height: 60vh;margin-top: -30px;" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left">
        <el-form-item label="父路由" prop="fatherRouteTitle">
          <el-input v-model="form.fatherRouteTitle" placeholder="父路由" disabled />
        </el-form-item>
        <el-form-item label="路由标题(中文)" prop="meta.title">
          <el-input v-model="form.meta.title" placeholder="路由标题" />
        </el-form-item>
        <el-form-item label="路由名称(英文)" prop="name">
          <el-input v-model="form.name" placeholder="路由名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="form.path" placeholder="路由路径" />
        </el-form-item>
        <el-form-item label="路由组件" prop="component">
          <el-input v-model="form.component" placeholder="路由组件" />
        </el-form-item>
        <el-form-item label="重定向">
          <el-input v-model="form.redirect" placeholder="重定向" />
        </el-form-item>
        <el-form-item label="路由图标">
          <el-input v-model="form.meta.icon" placeholder="Icon图标类名" />
        </el-form-item>
        <el-form-item label="是否有效">
          <el-switch
            v-model="form.available"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-switch
            v-model="form.hidden"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="固定在标签栏">
          <el-switch
            v-model="form.meta.affix"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="总是显示">
          <el-switch
            v-model="form.alwaysShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="不缓存页面">
          <el-switch
            v-model="form.meta.noCache"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">保存</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'EditRouteDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fatherRoute: {
      type: Object,
      default: function() {
        return {
          id: '',
          meta: {
            title: ''
          }
        }
      }
    },
    route: {
      type: Object,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      form: {
        name: '',
        path: '',
        meta: {
          title: '',
          icon: '',
          noCache: false,
          affix: false // 粘附
        },
        component: '',
        hidden: false,
        alwaysShow: false,
        redirect: 'noRedirect', // 在面包屑中不可点击
        available: true,
        fatherRouteTitle: '',
        fatherRouteId: 0,
        isRootRoute: true
      },
      rules: {
        fatherRouteTitle: [{ required: true, trigger: 'change', message: '父路由异常' }],
        name: [{ required: true, trigger: 'change', message: '请输入路由名称' }],
        path: [{ required: true, trigger: 'change', message: '请输入路由路径' }],
        title: [{ required: true, trigger: 'change', message: '请输入路由标题' }],
        component: [{ required: true, trigger: 'change', message: '请输入路由组件地址' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    onOpen() {
      if (this.route) {
        this.form = this.route
        this.form.fatherRouteId = this.fatherRoute.id
        this.form.fatherRouteTitle = this.fatherRoute.meta.title
      }
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http
            .post('admin/EditRoute', {
              token: this.user.token,
              route: JSON.stringify(this.form)
            })
            .then(res => {
              this.$notify({
                title: '提示',
                type: 'success',
                message: res.data.message
              })
              this.$refs.form.resetFields()
              this.$emit('onEditRouteSuccess')
              this.onClose()
            })
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
