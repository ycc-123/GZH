import React, { Component } from 'react'

import styled from 'styled-components'

class PageLoading extends Component {
  render() {
    const showLoding = this.props.smallLoading ? 'block' : 'none'
    return (
      <LoadingStyle>
        <div style={{ display: showLoding }}>
          <div className='mask'></div>
          <div className='small-box'>
            <img src='https://res.lexiangpingou.cn/images/vip/smallLoading.png' alt="" />
            <p>正在加载</p>
          </div>
        </div>
      </LoadingStyle>
    )
  }
}

const LoadingStyle = styled.div`

.mask {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(255,255,255,0);
}

.small-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1.5rem;
  height: 1.5rem;
  background-color: rgba(0, 0, 0, .5);
  border-radius: .13rem;
}

.small-box img {
  width: .8rem;
  height: .8rem;
  animation: loading 1s linear infinite;
}

.small-box p {
  color: #fff;
  font-size: .32rem;
  margin-top: -.2rem;
}

`

export default PageLoading;