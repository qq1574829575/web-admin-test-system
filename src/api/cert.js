import request from '@/utils/request'

export function GetGraCertUrl(data) {
  return request({
    url: '/GetGraCertUrl',
    method: 'post',
    data
  })
}

export function AddGraStudents(data) {
  return request({
    url: '/AddGraStudents',
    method: 'post',
    data
  })
}

export function GetGraStudents() {
  return request({
    url: '/GetGraStudents',
    method: 'get'
  })
}

export function EditGraStudent(data) {
  return request({
    url: '/EditGraStudent',
    method: 'post',
    data
  })
}

export function DelGraStudent(data) {
  return request({
    url: '/DelGraStudent',
    method: 'post',
    data
  })
}
