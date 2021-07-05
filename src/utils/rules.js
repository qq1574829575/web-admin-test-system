var QQV = (rule, value, callback) => {
  debugger
  if (value === '') {
    callback(new Error('输入QQ号'))
  } else if (/^[1-9][0-9]{4,10}$/.test(value)) {
    callback()
  } else {
    callback(new Error('输入正确的QQ号'))
  }
}

// 类似金钱,首位不为0,最多2位小数
export function checkNumPot2(rule, value, callback) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!value) {
    return callback(new Error('请填写数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('请填写数字,最多2位小数'))
  } else {
    callback()
  }
}

// 身份证
export function checkIdNum(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    return callback(new Error('身份证号码不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('身份证号码不正确'))
  } else {
    callback()
  }
}

// 整数
export function checkInterNum(rule, value, callback) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  if (!value) {
    return callback(new Error('请填写数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入数字'))
  } else {
    callback()
  }
}

// 验证IP
export function checkIP(rule, value, callback) {
  const reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
  if (!value) {
    return callback(new Error('请输入信息'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入正确的格式'))
  } else {
    callback()
  }
}

export default {
  QQ: [{ required: true, validator: QQV, trigger: 'blur' }],
  phone: [
    {
      required: true,
      pattern: /^([1][3,4,5,6,7,8,9])\d{9}$/,
      message: '请输入手机号码',
      trigger: 'blur' // 检验方式(blur为鼠标点击其他地方,change为检验的字符变化的时候)
    }
  ],
  postcode: [
    {
      required: true,
      pattern: /[1-9]\d{5}(?!\d)/,
      message: '请输入邮编',
      trigger: 'change'
    }
  ],
  numPot2: [{ required: true, validator: checkNumPot2, trigger: 'blur' }],
  InterNum: [{ required: true, validator: checkInterNum, trigger: 'blur' }],
  idNum: [{ required: true, validator: checkIdNum, trigger: 'blur' }],
  ipRules: [{ required: true, validator: checkIP, trigger: 'blur' }]
}
