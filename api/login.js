import { myAxios } from '../utils/myAxios'

export function codoYzm(params) {
  return myAxios({
    url: '/businessApplets/codoYzm',
    method: 'get',
    params: params
  })
}
// 获取图形码
export function generateCodeImg(params) {
  return myAxios({
    url: '/businessApplets/generateCodeImg',
    method: 'get',
    data: params
  })
}
// 发送验证码
export function sendMsg(params) {
  return myAxios({
    url: '/businessApplets/sjlogin/sendMsg',
    method: 'post',
    data: params
  })
}
// 商家登录
export function businessLogIn(params) {
  return myAxios({
    url: '/businessApplets/sjlogin/businessLogIn',
    method: 'post',
    data: params
  })
}
