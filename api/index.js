import { myAxios } from '../utils/myAxios'
// 商家退出登录
export function businessLogOut(params) {
  return myAxios({
    url: '/businessApplets/businessLogOut',
    method: 'post',
    data: params
  })
}
// 劵码核销
export function codeWriteOff(params) {
  return myAxios({
    url: '/businessApplets/codeWriteOff',
    method: 'post',
    data: params
  })
}