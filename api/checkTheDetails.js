import { myAxios } from '../utils/myAxios'
// 对账详情列表
export function orderReconDetails(params) {
  return myAxios({
    url: '/businessApplets/orderReconDetails',
    method: 'post',
    data: params
  })
}

// 对账确认
export function confirmReconciliation(params) {
  return myAxios({
    url: '/businessApplets/confirmReconciliation',
    method: 'post',
    data: params
  })
}