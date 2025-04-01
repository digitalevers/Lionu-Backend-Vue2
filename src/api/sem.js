import request from '@/utils/request'

//获取360的 key && secret 信息
export function get360Key() {
  return request({
    url: '/sem/get360Key',
    method: 'post'
  })
}

//生成360联调js代码
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


//获取baidu的token与转化类型数据
export function getBaiduInfo() {
  return request({
    url: '/sem/getBaiduInfo',
    method: 'post'
  })
}

//生成baidu联调js代码
export function createBaiduReportCode(data) {
  return request({
    url: '/sem/createBaiduReportCode',
    method: 'post',
    data
  })
}