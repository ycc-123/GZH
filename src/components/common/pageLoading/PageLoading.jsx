import React, { Component, Fragment } from 'react'
import './pageLoading.css'

import { store } from 'store/index'


class PageLoading extends Component {
  render() {
    let imgSrc
    const showLoding = this.props.loading ? 'block' : 'none'
    const { template_color } = store.getState().mallConfig
    if (template_color === '0') {
      imgSrc = 'https://res.lexiangpingou.cn/images/vip/20201127/loading.png'
    } else {
      imgSrc = 'https://res.lexiangpingou.cn/images/vip/99951loading-black.png'
    }
    return (
      <Fragment>
        <div className='home-loadingBg' style={{ display: showLoding }}>
          <div className='home-loading-img'>
            <img src={imgSrc} alt="" />
            <p>Loading...</p>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default PageLoading;