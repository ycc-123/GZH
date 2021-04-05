import React, { PureComponent } from 'react'

import { store } from 'store/index'

import { _api } from 'network/api'

class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
  }

  componentDidCatch(error, errorInfo) {
    /**
     * 
     * time: 2020-12-29
     * author: lkd
     * content: 路由懒加载错误处理
     * @param {error} 错误
     * @param {errorInfo} 错误信息
     * 
     * */
    const { appConfig } = store.getState()
    const config = {
      action: 'errlog',
      data: {
        uniacid: appConfig.uniacid,
        content: String(error) + '------------------------->' + String(errorInfo.componentStack).split("\n"),
        message: '出错了',
        openid: appConfig.wxUserInfo.openid
      }
    }

    // 处理懒加载引起的错误
    if (String(error).includes('Loading chunk') || String(error).includes('Loading CSS chunk')) {

      // 错误日志 刷新页面
      _api(config).then(res => { window.location.reload() }).catch(err => { window.location.reload() })
    } else {
      _api(config)
      this.setState({
        error,
        errorInfo: true
      })
    }
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div style={{ width: '100vw', height: 'auto', color: 'red', fontSize: '.32rem', textAlign: 'center' }}>
          出现错误了
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary