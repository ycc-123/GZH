import { store } from 'store/index'
import MD5 from 'js-md5'
import { requestPost } from './request'

let timestamp = new Date().getTime()
let sign = MD5('huodie2020' + timestamp)

export function _cartApi(config) {
  return requestPost({
    params: {
      action: config.action
    },
    data: config.data
  })
}


export function _showCart() {
  const { appConfig } = store.getState()
  return requestPost({
    params: {
      action: 'cartView'
    },
    data: {
      uniacid: appConfig.uniacid,
      openid: appConfig.wxUserInfo.openid,
      timestamp,
      sign
    }
  })
}


/* export function editCartGoods(op, uniacid, id, gid, num, ccid) {
  return request({
    params: {
      op,
      uniacid,
      id,
      gid,
      num,
      ccid
    }
  })
} */