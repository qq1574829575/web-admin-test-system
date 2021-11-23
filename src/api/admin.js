import http from '@/utils/http'

export function GetAdminUsers() {
  return http.get('GetAdminUsers')
}

export function AddAdminUser(data) {
  return http.post('AddAdminUser', data)
}

export function EditAdminUser(data) {
  return http.post('EditAdminUser', data)
}

export function DelAdminUser(data) {
  return http.post('DelAdminUser', data)
}
