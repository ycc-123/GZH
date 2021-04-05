import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { dropByCacheKey } from 'react-router-cache-route'
import styled from 'styled-components'

import { store } from 'store/index'

class DetailButton extends Component {

  render() {
    const { isApplet } = store.getState().appConfig
    const { LIVE } = this.props
    return (
      <DetailButtonSytle>
        <div className='button' style={{ display: isApplet ? 'none' : 'block' }} onClick={this.btnClick}>
          返回
        </div>
        <img style={{ display: isApplet ? 'none' : 'block' }} src='https://res.lexiangpingou.cn/images/vip/return1.png' alt="" className='img' />
        <img className='d-share' src={require('assets/img/d-share.png')} onClick={this.props.share} />
        <div className='detail-live-box' ref='box' style={{ display: LIVE === 'on' ? 'block' : 'none' }} onClick={() => { dropByCacheKey('DetailComponent'); this.props.history.replace('/live/1013') }}>
          <div style={{ width: '100%', height: '1.08rem', position: 'relative', marginTop: '.1rem' }}>
            <div className='yuan1'></div>
            <div className='yuan2'></div>
            <ul className='yuan3'>
              <li className='yuan3-left'>
                <div className='yuan3-left1'></div>
              </li>
              <li className='yuan3-center'>
                <div className='yuan3-center1'></div>
              </li>
              <li className='yuan3-right'>
                <div className='yuan3-right1'></div>
              </li>
            </ul>
          </div>
          <div style={{ textAlign: 'center', fontSize: '.24rem', fontWeight: 'bold' }}>
            直播中
          </div>
        </div>
      </DetailButtonSytle>
    )
  }

  btnClick = () => {
    const { isApplet } = store.getState().appConfig
    dropByCacheKey('DetailComponent')
    if (isApplet) {
      window.navigateGoBack()
    } else {
      if (this.props.history.length === 1) {
        this.props.history.replace('/home')
      } else {
        this.props.history.go(-1)
      }
    }
  }

  componentDidMount = () => {
    // let box = this.refs.box
    // let windowH = document.documentElement.clientHeight
    // let bottomBar = document.querySelector('.detail-bottom-bar').offsetHeight
    // let newY, startY
    // this.startY = ''
    // box.addEventListener('touchstart', e => {
    //   this.startY = box.offsetTop
    //   startY = e.touches[0].pageY
    //   this.fnMove = e => {
    //     // 实时手指位置X轴的位置 - 手指刚移入屏幕时X轴的位置
    //     newY = e.touches[0].pageY - startY + this.startY
    //     if (newY >= 0 && windowH - box.offsetHeight - newY > bottomBar) {
    //       box.style.top = newY + 'px'
    //     }
    //   }
    //   this.fnEnd = e => {
    //     box.removeEventListener('touchmove', this.fnMove, false)
    //     box.removeEventListener('touchend', this.fnEnd, false)
    //   }
    //   // touchmove 当手指在屏幕上滑动的时候连续地触发
    //   box.addEventListener('touchmove', this.fnMove, false)
    //   // touchend 当手指离开屏幕时触发
    //   box.addEventListener('touchend', this.fnEnd, false)
    // }, false)
  }

}

const DetailButtonSytle = styled.div`

/* .detail-live {
  position: relative;
  width: 1.12rem;
  height: 1.5rem;
} */
.button {
  position: fixed;
  z-index: 991 !important;
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
  z-index: 990;
  top: .21rem;
  left: .47rem;
  width: 1.03rem;
  height: .96rem;
}

@keyframes changeHeight {
  0% {
    -webkit-transform: scaleY(1);
  }
  25% {
    -webkit-transform: scaleY(.75);
  }
  50% {
    -webkit-transform: scaleY(.5);
  }
  75% {
    -webkit-transform: scaleY(.75);
  }
  100% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes changeHeight1 {
  0% {
    -webkit-transform: scaleY(.5);
  }
  25% {
    -webkit-transform: scaleY(.75);
  }
  50% {
    -webkit-transform: scaleY(1);
  }
  75% {
    -webkit-transform: scaleY(.75);
  }
  100% {
    -webkit-transform: scaleY(.5);
  }
}

.yuan3-left1, .yuan3-center1, .yuan3-right1 {
  width: .075rem;
  height: .25rem;
  background-color: #fff;
  border-radius: .03rem;
  transition: all .5s;
}

.yuan3-left1, .yuan3-right1 {
  transform: scaleY(1);
  animation: changeHeight 1s linear infinite;
}

.yuan3-left {
  justify-content: flex-end;
}

.yuan3-right {
  justify-content: flex-start;
}

.yuan3-center {
  justify-content: center;
}

.yuan3-center1 {
  transform: scaleY(.5);
  animation: changeHeight1 1s linear infinite;
}


.yuan3-left, .yuan3-center, .yuan3-right {
  display: flex;
  align-items: center;
  flex: 1;
}

.yuan3 {
  display: flex;
  position: relative;
  top: 50%;
  left: 50%;
  width: .56rem;
  height: .56rem;
  transform: translate(-50%, -50%);
  background-color: var(--theme-font-color);
  border-radius: 50%;
}

.yuan1, .yuan2 {
  position: absolute; 
  top: 50%;
  left: 50%; 
  transform: translate(-50%, -50%);
  border: 1px solid var(--theme-font-color);
  background-color: transparent;
  border-radius: 50%;
}

.yuan2 {
  width: .76rem;
  height: .76rem;
  opacity: .7;
}

.yuan1 {
  width: .96rem; 
  height: .96rem;
  opacity: .2;
}

.detail-live-box {
  position: absolute;
  z-index: 999;
  top: 1rem;
  right: .32rem;
  width: 1.32rem;
  height: 1.6rem;
  background-color: rgba(255, 255, 255, .5);
  border-radius: .13rem;
}

`

export default withRouter(DetailButton)