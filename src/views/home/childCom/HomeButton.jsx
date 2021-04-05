import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import { store } from 'store/index'

import { _getOrderDetail } from 'network/order'

class HomeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      img: '',
      qr: ''
    }
  }
  render() {
    const { isShow } = this.props
    const { active, qr } = this.state
    return (
      <HomeButtonStyle>
        <div className='mark' style={{ display: active ? 'block' : 'none' }} onClick={() => { this.props.show(); this.hide() }}>
          {qr !== '' && <img className='kefu' src={qr} />}
        </div>
        <img src='https://res.lexiangpingou.cn/images/vip/homebutton.png' alt="" className='button' ref='button' onClick={() => { this.props.show() }} />
        <img src='https://res.lexiangpingou.cn/images/vip/homechacha.png' alt="" style={{ display: isShow ? 'block' : 'none' }} ref='cha' className='cha_cha' onClick={() => { this.props.show() }} />
        <div ref='box' className='hide' style={{ display: isShow ? 'block' : 'none' }}>
          <button className='ff'></button>
          <img src='https://res.lexiangpingou.cn/images/vip/top.png' alt="" className='top' onClick={(e) => { this.top(e) }} />
          <img src='https://res.lexiangpingou.cn/images/vip/share.png' alt="" className='share' onClick={(e) => { e.stopPropagation(); this.props.share() }} />
          <img src='https://res.lexiangpingou.cn/images/vip/mes.png' alt="" className='mes' onClick={(e) => { this.showQR(e) }} />
        </div>
      </HomeButtonStyle>
    );
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)
  }

  top = (e) => {
    e.stopPropagation()
    this.props.top()
  }

  hide = () => {
    this.setState({
      active: false
    }, () => {
      console.log(this.state)
    })
  }

  showQR = async e => {
    e.stopPropagation()
    const config = {
      action: 'kefuImg',
      data: {
        uniacid: store.getState().appConfig.uniacid
      }
    }

    const result = await _getOrderDetail(config)
    this.setState({
      qr: result.data.data,
      active: true
    }, () => {
      console.log(this.state)
      console.log(this.state.active)
      console.log('能不能改变')
    })
  }

  componentDidMount = () => {
    if (document.querySelector('.tab-bar')) {
      let button = this.refs.button
      let cha = this.refs.cha
      let box = this.refs.box
      let head = document.querySelector('.home-header').offsetHeight
      let windowH = document.documentElement.clientHeight
      let tab = document.querySelector('.tab-bar').offsetHeight
      let newY
      this.startY = ''
      button.addEventListener('touchstart', e => {
        this.startY = button.offsetTop
        this.fnMove = e => {
          // 实时手指位置X轴的位置 - 手指刚移入屏幕时X轴的位置
          newY = parseInt(e.touches[0].pageY)
          if (newY >= head && windowH - newY - button.offsetHeight >= tab) {
            button.style.top = newY + 'px'
            cha.style.top = newY + 'px'
            box.style.top = newY - 37.5 + 'px'
          }

        }

        this.fnEnd = e => {
          button.removeEventListener('touchmove', this.fnMove, false)
          button.removeEventListener('touchend', this.fnEnd, false)
        }

        // touchmove 当手指在屏幕上滑动的时候连续地触发
        button.addEventListener('touchmove', this.fnMove, false)
        // touchend 当手指离开屏幕时触发
        button.addEventListener('touchend', this.fnEnd, false)
      }, false)


      cha.addEventListener('touchstart', e => {
        this.startY = button.offsetTop
        this.fnMove = e => {
          // 实时手指位置X轴的位置 - 手指刚移入屏幕时X轴的位置
          newY = parseInt(e.touches[0].pageY)
          if (newY >= head && windowH - newY - button.offsetHeight > tab) {
            button.style.top = newY + 'px'
            cha.style.top = newY + 'px'
            box.style.top = newY - 37.5 + 'px'
          }
        }

        this.fnEnd = e => {
          cha.removeEventListener('touchmove', this.fnMove, true)
          cha.removeEventListener('touchend', this.fnEnd, true)
        }
        // touchmove 当手指在屏幕上滑动的时候连续地触发
        cha.addEventListener('touchmove', this.fnMove, true)
        // touchend 当手指离开屏幕时触发
        cha.addEventListener('touchend', this.fnEnd, true)
      }, false)
    }
  }
}


const HomeButtonStyle = styled.div`

.kefu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 7rem;
  height: 7rem;
}

.mark {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.5);
}

.top {
  position: absolute;
  z-index: 998;
  width: .53rem;
  height: auto;
  bottom: .24rem;
  right: .13rem;
}

.share {
  position: absolute;
  z-index: 998;
  width: .53rem;
  height: auto;
  top: .24rem;
  right: .13rem;
}

.mes {
  position: absolute;
  z-index: 998;
  top: 50%;
  left: 1.4rem;
  transform: translate(0, -50%);
  width: .53rem;
  height: auto;
  
}

.button {
  position: absolute;
  z-index: 989;
  bottom: 4rem;
  right: .26rem;
  width: 1rem;
  height: auto;
}

.cha_cha {
  position: absolute;
  z-index: 999;
  bottom: 4rem;
  right: .26rem;
  width: 1rem;
  height: auto;
}

.hide {
  position: absolute;
  z-index: 998;
  bottom: 3rem;
  right: .32rem;
  width: 3rem;
  height: 3rem;
  overflow: hidden;
}

.ff {
  position: absolute;
  z-index: 998;
  bottom: 0;
  right: -1.22rem;
  width: 3rem;
  height: 3rem;
  background: #999;
  border-radius: 50%;
}


`

export default HomeButton;