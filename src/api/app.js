import request from '@/utils/request'

//应用列表
export function getList(data) {
  return request({
    url: '/app/list',
    method: 'post',
    data
  })
}
//应用添加
export function requestAdd(data) {
  return request({
    url: '/app/add',
    method: 'post',
    data
  })
}
//应用轮询
export function requestEvent(data) {
  return request({
    url: '/app/event_poll',
    method: 'post',
    data
  })
}
//应用删除
export function requestDelete(data) {
  return request({
    url: '/app/del',
    method: 'post',
    data
  })
}