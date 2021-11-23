import http from '@/utils/http'

export function GetAllPermissionRoutes() {
  return http.get('GetAllPermissionRoutes')
}

export function AddPermissionRoutes(data) {
  return http.post('AddPermissionRoutes', data)
}

export function EditPermissionRoutes(data) {
  return http.post('EditPermissionRoutes', data)
}

export function DelPermissionRoutes(data) {
  return http.post('DelPermissionRoutes', data)
}
