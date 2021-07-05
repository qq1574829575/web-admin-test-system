import request from '@/utils/request'

export function GetAdminUsers() {
  return request({
    url: '/GetAdminUsers',
    method: 'get'
  })
}

export function AddAdminUser(data) {
  return request({
    url: '/AddAdminUser',
    method: 'post',
    data
  })
}

export function EditAdminUser(data) {
  return request({
    url: `/EditAdminUser`,
    method: 'post',
    data
  })
}

export function DelAdminUser(data) {
  return request({
    url: `/DelAdminUser`,
    method: 'post',
    data
  })
}
