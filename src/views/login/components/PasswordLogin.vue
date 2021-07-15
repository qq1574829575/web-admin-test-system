<template>
  <el-form ref="loginForm" v-loading="loading" :rules="loginRules" :model="loginForm" label-position="left">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="手机号码/教工号" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="密码"
        @keydown.enter.native="handleLogin"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        style="width: 100%;"
        type="primary"
        @click="handleLogin"
      >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'PasswordLogin',
  data() {
    return {
      loginForm: {
        username: '18279977834',
        password: '1574829575'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入手机号码/教工号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          request({
            url: '/login/password_login.php',
            method: 'post',
            data: {
              param: rsaUtil.encryption_xxcy({ Logininfo: this.loginForm.username, Password: this.loginForm.password })
            },
            baseURL: 'https://xyxxcygcxx.guolianrobot.com'
          }).then(res => {
            this.loading = false
            if (res.code === 1) {
              const userinfo = res.rows[0]
              // 将登录后的用户信息保存到本地
              window.localStorage.setItem('userinfo', JSON.stringify(userinfo))
              // 通知父组件登录成功了
              this.$emit('onLoginSuccess')
              this.$message({
                type: 'success',
                message: '登录成功'
              })
            }
          }).catch(res => {
            this.loading = false
            console.log(res)
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
