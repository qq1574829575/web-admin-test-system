import request from '@/utils/request'
// 引入RSA加密
import rsaUtil from '@/utils/rsaUtil'

export function getMajorList(data) {
  return request({
    url: '/xxcyxuefei/newAdmin/GetMajorList.php',
    method: 'post',
    data: {
      param: rsaUtil.encryption_xxcy()
    },
    baseURL: 'https://www.xyxxcygcxx.guolianrobot.com'
  })
}

export function addMealList(data) {
  return request({
    url: '/xxcyxuefei/newAdmin/AddMealList.php',
    method: 'post',
    data: {
      param: rsaUtil.encryption_xxcy(data)
    },
    baseURL: 'https://www.xyxxcygcxx.guolianrobot.com'
  })
}

export function deleteMealList(data) {
  return request({
    url: '/xxcyxuefei/newAdmin/DeleteMealList.php',
    method: 'post',
    data: {
      param: rsaUtil.encryption_xxcy(data)
    },
    baseURL: 'https://www.xyxxcygcxx.guolianrobot.com'
  })
}

export function getMealList() {
  return request({
    url: '/xxcyxuefei/newAdmin/GetMealList.php',
    method: 'post',
    data: {
      param: rsaUtil.encryption_xxcy()
    },
    baseURL: 'https://www.xyxxcygcxx.guolianrobot.com'
  })
}

export function editPayType(data) {
  return request({
    url: '/xxcyxuefei/newAdmin/EditPayType.php',
    method: 'post',
    data: 'param=' + rsaUtil.encryption_xxcy(data),
    baseURL: 'https://www.xyxxcygcxx.guolianrobot.com'
  })
}

export function deletePayType(data) {
  return request({
    url: '/xxcyxuefei/newAdmin/DeletePayType.php',
    method: 'post',
    data: {
      param: rsaUtil.encryption_xxcy(data)
    },
    baseURL: 'https://www.xyxxcygcxx.guolianrobot.com'
  })
}

export function addPayType(data) {
  return request({
    url: '/xxcyxuefei/newAdmin/AddPayType.php',
    method: 'post',
    data: {
      param: rsaUtil.encryption_xxcy(data)
    },
    baseURL: 'https://www.xyxxcygcxx.guolianrobot.com'
  })
}
