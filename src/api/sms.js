import request from '@/utils/request'
// 引入RSA加密
import rsaUtil from '@/utils/rsaUtil'

/**
 * 验证码登录 获取验证码
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetSmsCode(data) {
  return request({
    url: '/login/verification_login_Sms_send.php',
    method: 'post',
    data: 'param=' + rsaUtil.encryption_xxcy(data),
    baseURL: 'https://xyxxcygcxx.guolianrobot.com'
  })
}

/**
 * 校验登录验证码是否正确
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function SmsCodeLogin(data) {
  return request({
    url: '/login/verification_login_Sms_check.php',
    method: 'post',
    data: 'param=' + rsaUtil.encryption_xxcy(data),
    baseURL: 'https://xyxxcygcxx.guolianrobot.com'
  })
}

/**
 * 获取修改密码的验证码
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetModifyPassSmsCode(data) {
  return request({
    url: '/login/modify_password_Sms_send.php',
    method: 'post',
    data: 'param=' + rsaUtil.encryption_xxcy(data),
    baseURL: 'https://xyxxcygcxx.guolianrobot.com'
  })
}

/**
 * 校验修改密码验证码
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function CheckModifyPassSmsCode(data) {
  return request({
    url: '/login/modify_password_Sms_check.php',
    method: 'post',
    data: 'param=' + rsaUtil.encryption_xxcy(data),
    baseURL: 'https://xyxxcygcxx.guolianrobot.com'
  })
}

/**
 * 获取修改手机号码验证码
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetModifyPhoneSmsCode(data) {
  return request({
    url: '/login/replace_phone_Sms_send.php',
    method: 'post',
    data: 'param=' + rsaUtil.encryption_xxcy(data),
    baseURL: 'https://xyxxcygcxx.guolianrobot.com'
  })
}

/**
 * 校验修改手机号吗验证码
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function CheckModifyPhoneSmsCode(data) {
  return request({
    url: '/login/replace_phone_Sms_check.php',
    method: 'post',
    data: 'param=' + rsaUtil.encryption_xxcy(data),
    baseURL: 'https://xyxxcygcxx.guolianrobot.com'
  })
}
