import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { store } from 'store/index'

class DetailShareButton extends Component {
  render() {
    const { isApplet } = store.getState().appConfig
    return (
      <DetailShareButtonSytle>
        <div className='button' style={{ display: isApplet ? 'none' : 'block' }} onClick={() => { this.props.history.go(-1) }}>
          返回
        </div>
        <img style={{ display: isApplet ? 'none' : 'block' }} src='https://res.lexiangpingou.cn/images/vip/return1.png' alt="" className='img' />
      </DetailShareButtonSytle>

    )
  }
}

const DetailShareButtonSytle = styled.div`

.button {
  position: fixed;
  z-index: 999999 !important ;
  top: .21rem;
  left: .47rem;
  width: 1.03rem;
  height: .96rem;
  line-height: .96rem;
  text-align: center;
  color: #fff;
}

.img {
  position: fixed;
  z-index: 999;
  top: .21rem;
  left: .47rem;
  width: 1.03rem;
  height: .96rem;
}

`

export default withRouter(DetailShareButton)