import { requestPost, requestPostS } from './request'

export function _payApi(config) {
  return requestPost({
    params: {
      action: config.action
    },
    data: config.data
  })
}


export function _payApiS(config) {
  return requestPostS({
    params: {
      action: config.action
    },
    data: config.data
  })
}