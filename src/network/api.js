
import { requestPost, requestPostS } from './request'

import { store } from 'store/index'

export function _api(config) {
  return requestPost({
    params: {
      action: config.action
    },
    data: config.data
  })
}

export function _apiS(config) {
  return requestPostS({
    params: {
      action: config.action
    },
    data: config.data
  })
}

export function _apiUO(action) {
  const { appConfig } = store.getState()
  return requestPost({
    params: {
      action
    },
    data: {
      uniacid: appConfig.uniacid,
      openid: appConfig.wxUserInfo.openid
    }
  })
}

export function _apiU(action) {
  const { appConfig } = store.getState()
  return requestPost({
    params: {
      action
    },
    data: {
      uniacid: appConfig.uniacid
    }
  })
}

export function _decoding(data) {
  return requestPost({
    data
  })
}

export function _storeApi() {
  return requestPost({
    params: {
      action: 'getAllStore'
    },
    data: {
      uniacid: store.getState().appConfig.uniacid,
    }
  })
}

export function _getUniacDetail() {
  return requestPostS({
    params: {
      action: 'uniacidDetail',
    },
    data: {
      uniacid: store.getState().appConfig.uniacid,
    }
  })
}

export function _setPVUV() {
  return requestPost({
    params: {
      action: 'puvindex',
    },
    data: {
      uniacid: store.getState().appConfig.uniacid,
      openid: store.getState().appConfig.wxUserInfo.openid
    }
  })
}