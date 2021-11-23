import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { Notification } from 'element-ui'
import router from '@/router'
// import { getOtherQuery } from '@/utils/index'

axios.defaults.timeout = 30000
axios.defaults.baseURL = 'http://192.168.110.184:9000/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截
axios.interceptors.request.use(
  config => {
    // 不序列化multipart/form-data数据，因为会导致上传文件时formData数据为空
    if (config.headers['Content-Type'] !== 'multipart/form-data') {
      // 将请求数据序列化为url编码的formdata数据
      config.data = qs.stringify(config.data)
    }
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
    if (response.data.code === 1) {
      return response
    }
    if (response.data.code === 2) {
      Notification.warning({
        title: '提示',
        message: response.data.message
      })
      store.dispatch('user/logout').then(r => {
        router.push({ path: '/login' })
      })
      return Promise.reject(new Error(response.data.message))
    }
    Notification.error({
      title: '错误',
      message: response.data.message
    })
    return Promise.reject(new Error(response.data.message))
  },
  error => {
    console.log('err' + error)
    Notification.error({
      title: '错误',
      message: error.message
    })
    return Promise.reject(error)
  }
)

export default axios
