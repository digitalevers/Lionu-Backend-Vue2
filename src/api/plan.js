import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/plan/list',
    method: 'post',
    data
  })
}
//计划添加
export function requestAdd(data) {
  return request({
    url: '/plan/add',
    method: 'post',
    data
  })
}
//计划添加初始化
export function requestAddInit(data) {
  return request({
    url: '/plan/addInit',
    method: 'post',
    data
  })
}
//计划删除
export function requestDelete(data) {
  return request({
    url: '/plan/del',
    method: 'post',
    data
  })
}