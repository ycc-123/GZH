import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

class HomeShareButton extends Component {
  render() {
    return (
      <HomeShareButtonSytle>
        <div className='button' onClick={() => { this.props.history.replace('/home') }}>
          返回
        </div>
        <img src='https://res.lexiangpingou.cn/images/vip/return1.png' alt="" className='img' />
      </HomeShareButtonSytle>

    )
  }
}

const HomeShareButtonSytle = styled.div`

height: 100vh;
background-color: var(--bg-color);

.button {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999 !important ;
  top: .21rem;
  left: .47rem;
  width: 1.03rem;
  height: .96rem;
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

export default withRouter(HomeShareButton)