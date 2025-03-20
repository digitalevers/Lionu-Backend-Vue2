import request from '@/utils/request'

//获取当前的数据采集域名
export function getDomain() {
  return request({
    url: '/settings/getDomain',
    method: 'post'
  })
}

//设置数据采集域名
export function modifyDomain(data) {
  return request({
    url: '/settings/modifyDomain',
    method: 'post',
    data
  })
}

//修改管理员密码
export function modifyPwd(data) {
  return request({
    url: '/settings/modifyPwd',
    method: 'post',
    data
  })
}
