<template>
  <el-form ref="loginForm" v-loading="loading" :rules="loginRules" :model="loginForm" label-position="left">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="账号" />
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
import router from '@/router'
export default {
  name: 'PasswordLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'change', message: '请输入账号' }],
        password: [{ required: true, trigger: 'change', message: '请输入密码' }]
      },
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post('user/login', this.loginForm).then(res => {
            this.loading = false
            this.$notify.success({
              title: '提示',
              type: 'success',
              message: res.data.message
            })
            window.localStorage.setItem('token', res.data.token)
            window.localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
            router.push({ path: this.redirect || '/', query: this.otherQuery })
          }).catch(() => {
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
