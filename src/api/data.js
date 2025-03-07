import request from '@/utils/request'

export function getDataList(data) {
  return request({
    url: '/data/entrance',
    method: 'post',
    data
  })
}