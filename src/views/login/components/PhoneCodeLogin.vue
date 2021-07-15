<template>
  <el-form ref="loginForm" v-loading="loading" :rules="loginRules" :model="loginForm" label-position="left">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="手机号码" />
    </el-form-item>
    <el-form-item prop="code">
      <el-input v-model="loginForm.code" style="width: 68%" placeholder="验证码" />
      <el-button style="width: 30%;float:right;" type="primary" @click="getCode">{{ btnTitle }}</el-button>
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
  name: 'PhoneCodeLogin',
  data() {
    return {
      loginForm: {
        username: '18279977834',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      redirect: undefined,
      otherQuery: {},
      btnTitle: '发送验证码',
      timer: null
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          request({
            url: '/login/verification_login_Sms_check.php',
            method: 'post',
            data: {
              param: rsaUtil.encryption_xxcy({ Phone: this.loginForm.username, SmsCode: this.loginForm.code })
            },
            baseURL: 'https://xyxxcygcxx.guolianrobot.com'
          }).then(res => {
            this.loading = false
            console.log(res)
          }).catch(res => {
            this.loading = false
            console.log(res)
          })
        } else {
          return false
        }
      })
    },
    async getCode() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.loading = true
        request({
          url: '/login/verification_login_Sms_send.php',
          method: 'post',
          data: {
            param: rsaUtil.encryption_xxcy({ Phone: this.loginForm.username })
          },
          baseURL: 'https://xyxxcygcxx.guolianrobot.com'
        }).then(res => {
          if (res.code === 1) {
            this.$notify({
              title: '验证码发送成功',
              message: '请注意查收',
              type: 'success'
            })
            this.count = TIME_COUNT
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.btnTitle = this.count + 'S'
                this.count--
              } else {
                this.btnTitle = '发送验证码'
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
          this.loading = false
        }).catch(res => {
          this.loading = false
          console.log(res)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
