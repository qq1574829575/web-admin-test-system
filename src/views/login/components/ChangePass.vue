<template>
  <div>
    <el-link
      :underline="false"
      type="primary"
      @click="handleClick"
    >找回密码
    </el-link>
    <el-dialog :visible.sync="visible" title="找回密码">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="100px" label-position="left">
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="手机号码" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="form.code" style="width: 70%" placeholder="验证码" />
          <el-button style="width: 25%;float:right;" type="primary" @click="getCode">{{ btnTitle }}</el-button>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="form.newPass" type="password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="请再次输入" prop="repeatNewPass">
          <el-input v-model="form.repeatNewPass" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirm">确认修改</el-button>
        <el-button type="danger" @click="visible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'ChangePass',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.form.repeatNewPass !== '') {
          this.$refs.form.validateField('repeatNewPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      form: {
        phone: '',
        code: '',
        newPass: '',
        repeatNewPass: ''
      },
      rules: {
        phone: [{ required: true, trigger: 'blur', message: '请输入手机号码' }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        newPass: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, min: 6, max: 18, message: '密码长度必须大于6位', trigger: 'blur' }
        ],
        repeatNewPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      timer: null,
      loading: false,
      btnTitle: '发送验证码'
    }
  },
  methods: {
    handleClick() {
      this.visible = true
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modifyPass()
        } else {
          return false
        }
      })
    },
    modifyPass() {
      // 先校验验证码 暂时先不校验验证码
      // const res = await CheckModifyPassSmsCode()
      this.loading = true
      request({
        url: '/login/update_password.php',
        method: 'post',
        data: {
          param: rsaUtil.encryption_xxcy({
            Phone: this.form.phone,
            Password: this.form.newPass
          })
        },
        baseURL: 'https://xyxxcygcxx.guolianrobot.com'
      }).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.visible = false
          this.$notify({
            title: '修改密码成功',
            message: '请使用新密码登录',
            type: 'success'
          })
        }
      }).catch(res => {
        console.log(res)
        this.loading = false
      })
    },
    async getCode() {
      if (this.form.phone === '') {
        return
      }
      const TIME_COUNT = 60
      if (!this.timer) {
        this.loading = true
        request({
          url: '/login/modify_password_Sms_send.php',
          method: 'post',
          data: {
            param: rsaUtil.encryption_xxcy({
              Phone: this.form.phone
            })
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
          console.log(res)
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
