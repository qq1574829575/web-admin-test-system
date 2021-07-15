import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import store from '@/store'
// import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // 请求超时时间
})

// 请求拦截
service.interceptors.request.use(
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
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200 || res.code === 1) {
      return res
    }
    Message({
      message: res.msg || res.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    if (res.code === '12342') {
      store.dispatch('user/logout').then(r => {
        location.reload()
      })
    }
    return res
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

export default service
