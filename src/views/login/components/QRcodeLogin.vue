<template>
  <div style="display: flex;align-items: center;flex-direction: column;width: 100%;">
    <vue-qr :text="QRCode" :size="150" />
    <div style="margin-bottom: 10px;font-size: 13px">
      <div style="display: inline">请使用掌上智慧校园APP扫一扫</div>
      <div style="display: inline;margin-left: 2px;">
        <el-tooltip class="item" effect="dark" content="更新二维码" placement="top">
          <el-button type="text" @click="getQRCode"><i class="el-icon-refresh-right" /></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'
import vueQr from 'vue-qr'

export default {
  name: 'QRcodeLogin',
  components: {
    vueQr
  },
  props: {
    switchFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      QRCode: '',
      timer: null
    }
  },
  watch: {
    switchFlag(val) {
      // 当切换到该登录页面时启动定时器定时查询二维码是否被扫描
      if (val === true) {
        this.timer = setInterval(this.isScanned, 2000)
      } else {
        // 销毁定时器
        if (this.timer !== null) {
          clearInterval(this.timer)
        }
      }
    }
  },
  mounted() {
    this.getQRCode()
  },
  beforeDestroy() {
    // 销毁定时器
    if (this.timer !== null) {
      clearInterval(this.timer)
    }
  },
  methods: {
    getQRCode() {
      request({
        url: '/login/apply_code.php',
        method: 'post',
        baseURL: 'https://www.xyxxcygcxx.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_xxcy()
        }
      }).then((res) => {
        if (res.code === 1) {
          this.QRCode = res.rows[0].Keyaccess
        }
      })
    },
    isScanned() {
      request({
        url: '/login/query_code.php',
        method: 'post',
        baseURL: 'https://www.xyxxcygcxx.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_xxcy({ Keyaccess: this.QRCode })
        }
      }).then((res) => {
        if (res.code === 1 && res.rows.flag !== '无人扫码') {
          // 将登录后的用户信息保存到本地
          window.localStorage.setItem('userinfo', JSON.stringify(res.rows[0]))
          // 通知父组件登录成功了
          this.$emit('onLoginSuccess')
          this.$message({
            type: 'success',
            message: '登录成功'
          })
        }
        if (res.code === '10011') {
          // 二维码已过期，刷新二维码
          this.getQRCode()
        }
      }).catch(res => {
        this.loading = false
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
