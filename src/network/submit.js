import { requestPost } from './request'
import { store } from 'store/index'

export function _submitApi(config) {
  return requestPost({
    params: {
      action: config.action
    },
    data: config.data
  })
}

export function _addressList() {
  const { appConfig } = store.getState()
  return requestPost({
    params: {
      action: 'addressList'
    },
    data: {
      uniacid: appConfig.uniacid,
      openid: appConfig.wxUserInfo.openid,
    }
  })
}