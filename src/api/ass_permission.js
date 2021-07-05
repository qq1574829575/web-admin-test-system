import request from '@/utils/request'

export function GetAllAssPermissionRoutes() {
  return request({
    url: '/GetAllAssPermissionRoutes',
    method: 'get'
  })
}

export function AddAssPermissionRoutes(data) {
  return request({
    url: '/AddAssPermissionRoutes',
    method: 'post',
    data
  })
}

export function EditAssPermissionRoutes(data) {
  return request({
    url: '/EditAssPermissionRoutes',
    method: 'post',
    data
  })
}

export function DelAssPermissionRoutes(data) {
  return request({
    url: '/DelAssPermissionRoutes',
    method: 'post',
    data
  })
}
