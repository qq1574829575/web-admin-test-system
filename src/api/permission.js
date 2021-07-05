import request from '@/utils/request'

export function GetAllPermissionRoutes() {
  return request({
    url: '/GetAllPermissionRoutes',
    method: 'get'
  })
}

export function AddPermissionRoutes(data) {
  return request({
    url: '/AddPermissionRoutes',
    method: 'post',
    data
  })
}

export function EditPermissionRoutes(data) {
  return request({
    url: '/EditPermissionRoutes',
    method: 'post',
    data
  })
}

export function DelPermissionRoutes(data) {
  return request({
    url: '/DelPermissionRoutes',
    method: 'post',
    data
  })
}
