import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/index',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/Sysout/logout',
    method: 'post'
  })
}


export function requestInit() {
  return request({
    url: '/install/init',
    method: 'post'
  })
}
