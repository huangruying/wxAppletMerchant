import { myAxios } from '../utils/myAxios'
// 商家订单列表
export function findBusinessAppletsMonthly(params) {
  return myAxios({
    url: '/businessApplets/findBusinessAppletsMonthly',
    method: 'post',
    data: params
  })
}