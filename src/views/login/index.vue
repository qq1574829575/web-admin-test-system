<template>
  <div class="login-container">
    <div style="display: flex;justify-content: center;margin-top: 25vh">
      <el-card style="width: 400px;">
        <div slot="header" class="clearfix">
          <span>登录</span>
        </div>
        <PasswordLogin @onLoginSuccess="onLoginSuccess" />
        <register-account style="display: inline" />
        <ChangePass style="display: inline;float:right;" />
      </el-card>
    </div>
  </div>
</template>

<script>
import PasswordLogin from '@/views/login/components/PasswordLogin'
import ChangePass from '@/views/login/components/ChangePass'
import router from '@/router'
import RegisterAccount from '@/views/login/components/RegisterAccount'
export default {
  name: 'Login',
  components: { RegisterAccount, ChangePass, PasswordLogin },
  data() {
    return {
      activeName: 'first',
      switchQRCodePageFlag: false,
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
    onLoginSuccess(res) {
      router.push({ path: this.redirect || '/', query: this.otherQuery })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url("../../assets/bg.jpg");
  overflow: hidden;
  .div-form-item{
    margin-bottom: 10px;
  }
}
</style>
