import request from '@/utils/request'

//渠道列表
export function getList(data) {
  return request({
    url: '/channel/list',
    method: 'post',
    data
  })
}
//渠道添加
export function requestAdd(data) {
  return request({
    url: '/channel/add',
    method: 'post',
    data
  })
}
//渠道删除
export function requestDelete(data) {
  return request({
    url: '/channel/del',
    method: 'post',
    data
  })
}