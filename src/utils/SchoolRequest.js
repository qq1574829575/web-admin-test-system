import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'

axios.defaults.timeout = 30000
axios.defaults.baseURL = 'http://www.unifiedplatform.guolianrobot.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截
axios.interceptors.request.use(
  config => {
    // 将请求数据序列化为url编码的formdata数据
    config.data = qs.stringify(config.data)
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200 || res.code === 1) {
      return response
    }
    Message({
      message: res.msg || res.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    // if (res.code === '12342') {
    //   store.dispatch('user/logout').then(r => {
    //     location.reload()
    //   })
    // }
    return Promise.reject(new Error(res.message || res.msg || 'Error'))
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default axios
