import request from '@/utils/request'

//获取系统概况信息
export function getList(data) {
  return request({
    url: '/sysin/kafkaAndSpark',
    method: 'get',
    params: data
  })
}

//安装
export function sysinInstalled(data) {
  return request({
    url: '/sysin/startKafkaAndSpark',
    method: 'post',
    data
  })
}


//   sysin/startKafkaAndSpark