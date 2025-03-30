import request from '@/utils/request'

//获取当前的 key && secret 信息
export function get360Key() {
  return request({
    url: '/sem/get360Key',
    method: 'post'
  })
}

//生成联调js代码
export function create360ReportCode(data) {
  return request({
    url: '/sem/create360ReportCode',
    method: 'post',
    data
  })
}

//请求360转化类型数据
export function get360ConvertTypes(data) {
  return request({
    url: '/sem/get360ConvertTypes',
    method: 'post',
    data
  })
}
