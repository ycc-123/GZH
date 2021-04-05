import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'

import LiveButton from 'content/live/LiveButton'
import TabBar from 'common/tabBar/TabBar'
import BetterScroll from 'common/betterScroll/BetterScroll'

import CartBottomBar from './childCom/CartBottomBar'
import CartGoods from './childCom/CartGoods'
import CartKong from './childCom/CartKong'
import CartGuide from './childCom/CartGuide'

import { setTitle } from 'commons/utils'

import { store } from 'store/index'
import { getCartData } from 'store/actionCreators'
import { _showCart } from 'network/cart'
import { _chatRoom } from "network/live"
import { _setPVUV } from 'network/api'


import './style/cart.css'
import axios from 'axios'

class Cart extends Component {
  constructor(props) {
    super(props)
    props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.state = {
      empty: store.getState().cartGoods.length === 0 ? 'block' : 'none',
      have: store.getState().cartGoods.length !== 0 ? 'block' : 'none',
      live: ''
    }
    this.cancelSub = store.subscribe(() => {
      this.setState({
        empty: store.getState().cartGoods.length === 0 ? 'block' : 'none',
        have: store.getState().cartGoods.length !== 0 ? 'block' : 'none'
      })
    })
  }
  render() {
    const { empty, have, live } = this.state
    const srollConfig = {
      probeType: 0,
    }
    const scrollStyle = {
      paddingTop: '.2rem',
      height: 'calc((100vh - 2.45rem) - env(safe-area-inset-bottom))'
    }

    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--tab-color)' }}>
        <CartGuide />
        <div className='cart'>
          {live !== '' && <LiveButton live={live} />}
          <CartKong style={empty} />
          <div style={{ display: have, height: 'calc(100vh - 2.45rem)' }}>
            <BetterScroll ref='cartScroll' config={srollConfig} style={scrollStyle}>
              <CartGoods refresh={this.refresh} />
            </BetterScroll>
            <CartBottomBar />
          </div>
          <TabBar />
        </div>
      </div>

    )
  }
  componentDidMount = () => {
    setTitle('购物车')
    const { appConfig } = store.getState()

    const live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }
    axios.all([
      _showCart(),
      _chatRoom(live_config).catch(err => ''),
      _setPVUV()
    ]).then(res => {
      if (res[0].data.status === 200) {
        const action = getCartData(res[0].data.data)
        store.dispatch(action)
        this.setState({
          live: (res[1] && res[1].data) || ''
        })
      } else if (res[0].data.status === 400) {
        Toast.info(res[0].data.msg, 1)
      }
    }).catch(err => {
      Toast.info('未知错误', 1)
      setTimeout(() => {
        this.props.history.goBack()
      }, 1000)
    })
  }

  componentDidCache = () => {
    // 获取组件进入缓存时scroll的y值
    this.cartGoods = store.getState().cartGoods

  }
  componentDidRecover = () => {
    setTitle('购物车')
    const { appConfig } = store.getState()
    const live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }
    axios.all([
      _showCart(),
      _chatRoom(live_config).catch(err => ''),
      _setPVUV()
    ]).then(res => {
      if (res[0].data.status === 200) {
        const action = getCartData(res[0].data.data)
        store.dispatch(action)
        this.setState({
          live: (res[1] && res[1].data) || ''
        })
      } else if (res[0].data.status === 400) {
        Toast.info(res[0].data.msg, 1)
      }
    }).catch(err => {
      Toast.info('未知错误', 1)
      setTimeout(() => {
        this.props.history.goBack()
      }, 1000)
    })
  }

  refresh = () => {
    this.refs.cartScroll.BScroll.refresh()
  }

  goHome = () => {
    this.props.history.push('/home')
  }

  componentWillUnmount = () => {
    // 取消订阅模式
    this.cancelSub()
  }
}

export default withRouter(Cart)