import React, { Component, Fragment } from 'react'
import { Toast } from 'antd-mobile'

import { totalPrice, isSelectAllGoods } from 'commons/utils'

import { _cartApi, _showCart } from 'network/cart'


import { store } from 'store/index'
import { isSelectStore } from 'store/actionCreators'
import { getCartData } from 'store/actionCreators'

class CartGoodsItem extends Component {
  render() {
    const { goods } = this.props
    const { icons } = store.getState().mallConfig
    return (
      <Fragment>
        <li className='cart-goods-item'>
          <div className='cart-goods-box'>
            {goods.checked && <div className='choose'>
              <img src={icons.select} alt=""
                onClick={() => { this.changenChecked(this.props.index) }} />
            </div>}

            {!goods.checked && <div className='choose'>
              <img src='https://res.lexiangpingou.cn/images/vip/select.png' alt=""
                onClick={() => { this.changenChecked(this.props.index) }} />
            </div>}
            <div className='cart-goods-info'>
              <div className='cart-goods-info-img'>
                <img src={goods.img} alt="" />
              </div>
              <div className='cart-info'>
                <p className='cart-describe'>
                  {goods.goodsname}
                </p>
                {goods.title && <p className='cart-heavy'>
                  规格: {goods.title}
                </p>}
                <p className='cart-price'>
                  <span className='cart-price-span'>￥</span>
                  {goods.oprice}
                </p>
                <div className='cart-button'>
                  <button className='cart-decrement' onClick={() => { this.decrementGoods() }}>-</button>
                  <span className='cart-num'>{goods.num}</span>
                  <button className='cart-increment' onClick={() => { this.incrementGoods() }}>+</button>
                </div>
              </div>
            </div>
          </div>
          <div className='del' onClick={() => { this.deleteGoods(this.props.index, goods.sid) }}>
            <img src='https://res.lexiangpingou.cn/images/vip/delete.png' alt="''" />
          </div>
        </li>
      </Fragment>
    );
  }
  shouldComponentUpdate(nextProps) {
    // 返回true会渲染   性能优化 当选择一个商品时会默认重新渲染全部的商品
    // 通过上个商品的checked和下一个商品的checked值进行比较  不相同返回ture 渲染这个组件 否则不渲染
    return JSON.stringify(this.props) !== JSON.stringify(nextProps)
    /* return this.props.goods.checked !== nextProps.goods.checked || this.props.goods.num !== nextProps.goods.num  */
  }
  // 是否选中
  changenChecked = (index) => {
    const action = isSelectStore(index)
    store.dispatch(action)
    isSelectAllGoods()
  }
  // 删除商品
  deleteGoods = (index, id) => {
    const del_cart = {
      action: 'cartDel',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        cart_id: store.getState().cartGoods[index].id
      }
    }
    _cartApi(del_cart).then(res => {
      _showCart().then(res => {
        const action = getCartData(res.data.data)
        store.dispatch(action)
      })
    })
    totalPrice()
    this.props.refresh()
  }
  // 减少商品数量
  decrementGoods = () => {
    const { goods } = this.props
    const { appConfig } = store.getState()

    const update_cart = {
      action: 'cartUpdate',
      data: {
        uniacid: appConfig.uniacid,
        openid: appConfig.wxUserInfo.openid,
        cart_id: goods.id,
        num: parseInt(goods.num) - 1
      }
    }

    const del_cart = {
      action: 'cartDel',
      data: {
        uniacid: appConfig.uniacid,
        cart_id: goods.id
      }
    }

    if (update_cart.data.num === 0) {
      _cartApi(del_cart).then(res => {
        if (res.data.status === 200) {
          _showCart().then(res => {
            if (res.data.status === 200) {
              const action = getCartData(res.data.data)
              store.dispatch(action)
            } else if (res.data.status === 400) {
              Toast.info(res.data.msg)
            }
          })
        } else if (res.data.status === 400) {
          Toast.info(res.data.msg)
        }
      })
    } else {
      _cartApi(update_cart).then(res => {
        if (res.data.status === 200) {
          _showCart().then(res => {
            if (res.data.status === 200) {
              const action = getCartData(res.data.data)
              store.dispatch(action)
            } else if (res.data.status === 400) {
              Toast.info(res.data.msg)
            }
          })
        } else if (res.data.status === 400) {
          Toast.info(res.data.msg)
        }
      })
    }

    totalPrice()
  }
  // 增加商品数量
  incrementGoods = () => {
    const { goods } = this.props
    const { appConfig } = store.getState()
    if (parseInt(goods.num) < parseInt(goods.one_limit)) {
      const update_cart = {
        action: 'cartUpdate',
        data: {
          uniacid: appConfig.uniacid || 53,
          openid: appConfig.wxUserInfo.openid,
          cart_id: goods.id,
          num: parseInt(goods.num) + 1
        }
      }
      _cartApi(update_cart).then(res => {
        if (res.data.status === 200) {
          _showCart().then(res => {
            if (res.data.status === 200) {
              const action = getCartData(res.data.data)
              store.dispatch(action)
            } else if (res.data.status === 400) {
              Toast.info(res.data.msg)
            }
          })
        } else if (res.data.status === 400) {
          Toast.info(res.data.msg)
        }
      })
    } else {
      Toast.info(`当前商品最大可购买${goods.one_limit}`)
    }
  }


}

export default CartGoodsItem;