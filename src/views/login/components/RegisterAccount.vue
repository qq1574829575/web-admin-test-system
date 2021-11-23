<template>
  <div>
    <el-link
      :underline="false"
      type="primary"
      @click="show"
    >注册账号
    </el-link>
    <el-dialog :visible.sync="visible" title="注册账号">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="120px" label-position="left">
        <el-form-item
          prop="username"
          label="手机号码"
        >
          <el-input v-model="form.username" placeholder="手机号码" />
        </el-form-item>
        <el-form-item label="请输入密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="请再次输入密码" prop="repeatPassword">
          <el-input v-model="form.repeatPassword" type="password" placeholder="请再次输入密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirm">确认注册</el-button>
        <el-button type="danger" @click="visible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RegisterAccount',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.repeatPassword !== '') {
          this.$refs.form.validateField('repeatPassword')
        }
        callback()
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      loading: false,
      form: {
        username: '',
        password: '',
        repeatPassword: ''
      },
      rules: {
        username: [{ message: '请输入手机号', trigger: 'change' }],
        password: [{ validator: validatePassword, trigger: 'change' }],
        repeatPassword: [{ validator: validateRepeatPassword, trigger: 'change' }]
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http.post('user/register', this.form)
            .then(res => {
              this.$notify.success({
                title: '提示',
                message: res.data.message
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
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
