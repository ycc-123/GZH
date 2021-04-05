import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'

import { store } from 'store/index'
import { isSelectAllAction, getCartData } from 'store/actionCreators'

import { totalPrice, isSelectAllGoods } from 'commons/utils'


import { _submitApi } from 'network/submit'
class CartBottomBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: store.getState().cartGoods,
      bottom: 'calc((1.28rem) + env(safe-area-inset-bottom))'
    }
  }
  render() {
    const { cartGoods, mallConfig } = store.getState()
    const { bottom } = this.state
    if (cartGoods.length !== 0) {
      totalPrice()
      isSelectAllGoods()
    }
    return (
      <Fragment>
        <div className='cart-bottom-bar clearfix' style={{ bottom }}>
          <div className='global-choose'>
            {store.getState().selectAll && <img src={mallConfig.icons.select} alt=""
              onClick={this.selectAll} />}
            {!store.getState().selectAll && <img src='https://res.lexiangpingou.cn/images/vip/select.png' alt=""
              onClick={this.selectAll} />}
            全选
          </div>
          <div className='settlement' onClick={this.goSubmit}>去结算({store.getState().totalNumber})</div>
          <div className='total-price'><span>合计:￥</span>{store.getState().totalPrice}</div>
        </div>
      </Fragment>
    );
  }
  // componentWillUnmount() {
  //   // 取消订阅者模式
  //   this.cancelSub()
  // }
  selectAll = () => {
    // 先将action提交出去 改变自身的选中与未选中状态
    const action = isSelectAllAction()
    store.dispatch(action)
    // 全选  查找每一个元素的checked 如果有一个取反为true 说明有一个未选中,存在未选中的商品这时返回一个true 然后再次取反返回false
    if (!store.getState().cartGoods.find(item => !item.checked)) {
      store.getState().cartGoods.forEach(item => item.checked = false)
    } else {
      store.getState().cartGoods.forEach(item => item.checked = true)
    }
  }

  goSubmit = () => {
    let cartArrId = []
    const { appConfig } = store.getState()
    const isApplet = appConfig.isApplet
    store.getState().cartGoods.forEach(item => {
      if (item.checked) {
        cartArrId.push(item.id)
      }

    })
    const cartConfig = {
      action: 'cartToAccount',
      data: {
        uniacid: appConfig.uniacid,
        cartids: cartArrId,
        openid: appConfig.wxUserInfo.openid,
      }
    }
    _submitApi(cartConfig).then(res => {
      if (parseInt(res.data.status) === 200) {
        // this.props.history.push({ pathname: '/submit/1/0/1/0/0/0' })
        isApplet ? window.navigateToWebWiew('#/submit/1/0/1/0/0/0') : this.props.history.push('/submit/1/0/1/0/0/0')
      } else if (parseInt(res.data.status) === 400) {
        Toast.info(res.data.msg, 1)
      } else if (res.data.status === 404) {
        Toast.info('购物车的某些商品已经下架,系统默认将商品移除')
        const action = getCartData(res.data.data)
        store.dispatch(action)
      }
    })
  }
}



export default withRouter(CartBottomBar);