<template>
  <div class="login-container">
    <div style="display: flex;justify-content: center;margin-top: 25vh">
      <el-card style="width: 400px;">
        <div slot="header" class="clearfix">
          <span>登录</span>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="账号密码" name="first">
            <PasswordLogin @onLoginSuccess="onLoginSuccess" />
          </el-tab-pane>
          <el-tab-pane label="短信验证" name="second">
            <PhoneCodeLogin />
          </el-tab-pane>
          <el-tab-pane label="二维码登录" name="third">
            <q-rcode-login :switch-flag="switchQRCodePageFlag" @onLoginSuccess="onLoginSuccess" />
          </el-tab-pane>
        </el-tabs>
        <ChangePass style="display: inline" />
        <ChangePhone style="display: inline;float:right;" />
      </el-card>
    </div>
  </div>
</template>

<script>
import PasswordLogin from '@/views/login/components/PasswordLogin'
import PhoneCodeLogin from '@/views/login/components/PhoneCodeLogin'
import ChangePass from '@/views/login/components/ChangePass'
import ChangePhone from '@/views/login/components/ChangePhone'
import QRcodeLogin from '@/views/login/components/QRcodeLogin'
import router from '@/router'
export default {
  name: 'Login',
  components: { QRcodeLogin, ChangePhone, ChangePass, PhoneCodeLogin, PasswordLogin },
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
    handleTabClick(tab) {
      this.switchQRCodePageFlag = tab.index === '2'
    },
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
