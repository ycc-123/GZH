import { requestPost, requestPostS } from './request'

import { store } from 'store/index'

export function _homeApi(config) {
  return requestPost({
    params: {
      action: config.action
    },
    data: config.data
  })
}

// 获取首页轮播
export function _bannerApi() {
  return requestPost({
    params: {
      action: 'banner'
    },
    data: {
      uniacid: store.getState().appConfig.uniacid
    }
  })
}

// 获取首页广告
export function _advsApi() {
  
  return requestPostS({
    params: {
      action: 'advs'
    },
    data: {
      uniacid: store.getState().appConfig.uniacid
    }
  })
}
// 获取首页商品魔方
export function _cubeApi() {
  return requestPostS({
    params: {
      action: 'cube'
    },
    data: {
      uniacid: store.getState().appConfig.uniacid
    }
  })
}

// 获取首页通告
export function _notesApi() {
  return requestPost({
    params: {
      action: 'notes'
    },
    data: {
      uniacid: store.getState().appConfig.uniacid,
    }
  })
}

// 获取首页报单
export function _singleApi() {
  return requestPost({
    params: {
      action: 'tips'
    },
    data: {
      uniacid: store.getState().appConfig.uniacid,
    }
  })
}



