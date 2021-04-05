import React, { PureComponent } from 'react'

import { _api } from 'network/api'

import { store } from 'store/index'

export function withPVUV(WrapperComponent) {
  return class extends PureComponent {
    UNSAFE_componentWillMount() {
      const { appConfig } = store.getState()
      const config = {
        action: 'puvindex',
        data: {
          openid: appConfig.wxUserInfo.openid,
          uniacid: appConfig.uniacid
        }
      }
      _api(config).then().catch()
    }
    render() {
      return <WrapperComponent />
    }
  }
}
