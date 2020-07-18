import { myAxios } from '../utils/myAxios'

export function findBusinessAppletsByMonth(params) {
  return myAxios({
    url: '/businessApplets/findBusinessAppletsByMonth',
    method: 'post',
    data: params
  })
}