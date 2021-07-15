<template>
  <div>
    <el-link
      :underline="false"
      type="primary"
      @click="handleClick"
    >更换手机号
    </el-link>
    <el-dialog :visible.sync="visible" title="更换手机号">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="100px" label-position="left">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idcard">
          <el-input v-model="form.idcard" placeholder="身份证号码" />
        </el-form-item>
        <el-form-item label="教工号/学号" prop="uid">
          <el-input v-model="form.uid" placeholder="教工号/学号" />
        </el-form-item>
        <el-form-item label="密保问题" prop="question">
          <el-select v-model="form.question" placeholder="请选择密保问题">
            <el-option
              v-for="item in questions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密保答案" prop="uid">
          <el-input v-model="form.answer" placeholder="密保答案" />
        </el-form-item>
        <el-form-item label="新手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="新手机号码" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="form.code" style="width: 70%" placeholder="验证码" />
          <el-button style="width: 25%;float:right;" type="primary" @click="getCode">{{ btnTitle }}</el-button>
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
  name: 'ChangePhone',
  data() {
    return {
      visible: false,
      form: {
        name: '',
        idcard: '',
        uid: '', // 教工号/学号
        question: '', // 密保问题
        answer: '', // 密保答案
        phone: '',
        code: ''
      },
      questions: [
        {
          label: '母亲的姓名是？',
          value: '1'
        },
        {
          label: '母亲的生日是？',
          value: '2'
        },
        {
          label: '父亲的姓名是？',
          value: '3'
        },
        {
          label: '父亲的生日是？',
          value: '4'
        },
        {
          label: '小学班主任的姓名是？',
          value: '5'
        },
        {
          label: '初中班主任的姓名是？',
          value: '6'
        },
        {
          label: '高中班主任的姓名是？',
          value: '7'
        },
        {
          label: '你的出生地是？',
          value: '8'
        },
        {
          label: '最喜欢的明星是?',
          value: '9'
        },
        {
          label: '最想去的地方是?',
          value: '10'
        },
        {
          label: '你最喜欢看的电影是?',
          value: '11'
        },
        {
          label: '你毕业的初中是?',
          value: '12'
        }
      ],
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        idcard: [{ required: true, trigger: 'blur', message: '请输入身份证号码' }],
        uid: [{ required: true, trigger: 'blur', message: '请输入教工号/学号' }],
        question: [{ required: true, trigger: 'blur', message: '请选择密保问题' }],
        answer: [{ required: true, trigger: 'blur', message: '请选择密保答案' }],
        phone: [{ required: true, trigger: 'blur', message: '请输入要更换的新手机号码' }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
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
          this.modifyPhone()
        } else {
          return false
        }
      })
    },
    async modifyPhone() {
      // 先校验验证码 暂时先跳过这一步骤 直接更换成功
      /* const data = {
        Phone: this.form.phone,
        SmsCode: this.form.code,
        Codetime: getCurrentTime(),
        Onlyid: uuidUtil.uuid(22, 10)
      }
      const res = await CheckModifyPhoneSmsCode(data)
      console.log(res) */
      this.loading = true
      request({
        url: '/login/update_phone.php',
        method: 'post',
        data: {
          param: rsaUtil.encryption_xxcy({
            Phone: this.form.phone,
            Name: this.form.name,
            StudentID: this.form.uid,
            QuestionID: this.form.question
          }),
          Answer: this.form.answer,
          Cardid: this.form.idcard
        },
        baseURL: 'https://xyxxcygcxx.guolianrobot.com'
      }).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.visible = false
          this.$notify({
            title: '更换手机号码成功',
            message: '请使用新的手机号码登录',
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
          url: '/login/replace_phone_Sms_send.php',
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
