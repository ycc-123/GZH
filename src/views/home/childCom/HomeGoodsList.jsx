import React, { Component, Fragment } from 'react'
// import LazyLoad from 'react-lazyload'
import styled from 'styled-components'

import HomeGoodsListItem from './HomeGoodsListItem'
import GoodsListDouble from './GoodsListDouble'

import { store } from 'store/index'

import '../style/goods.css'
class HomeGoodsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
  }

  render() {
    // memberExpiration包月会员开关
    const { goodsList, issell, showPubStock, show_partjob_commission, memberExpiration } = this.props
    const { cartGoods } = store.getState()

    let isIosVerLgThan
    // goods_show_type 1 单排 2双排
    const { goods_show_type } = store.getState().mallConfig
    goodsList.forEach(item => {
      // 查找购物车商品是否和state的某个goods相等
      let newGoods = cartGoods.find(cartItem => {
        return cartItem.sid === item.id
      })
      if (newGoods) {
        item.num = newGoods.num
      } else {
        item.num = 0
      }
    })


    const { platform } = navigator
    if (platform && platform.indexOf('iPhone') !== -1 || platform.indexOf('Linux') !== -1) {
      const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      /* 图片懒加载 */
      // 判断ios是否大于12.2
      if (ver) {
        isIosVerLgThan = (ver && ver.length > 2 && ver[1] >= 12 && ver[2] >= 2) || (ver && ver.length > 2 && ver[1] >= 13);
      } else {
        isIosVerLgThan = true
      }
    } else {
      isIosVerLgThan = false
    }



    return (
      <ul className='goods-list goods-offsetTop'>
        {
          goodsList.length !== 0 ? goods_show_type === '0' ? goodsList.map((item, index) => {
            return (
              <HomeGoodsListItem
                issell={issell}
                showPubStock={showPubStock}
                isIosVerLgThan={isIosVerLgThan}
                key={item.id + index}
                goods={item}
                show_partjob_commission={show_partjob_commission}
                optionsGoods={this.optionsGoods}
                memberExpiration={memberExpiration}
              />
            )
          }) : goodsList.map((item, index) => {
            return (
              <GoodsListDouble
                issell={issell}
                showPubStock={showPubStock}
                isIosVerLgThan={isIosVerLgThan}
                key={item.id + index}
                goods={item}
                show_partjob_commission={show_partjob_commission}
                optionsGoods={this.optionsGoods}
                memberExpiration={memberExpiration}
              />
            )
          }) : < Fragment >
            <div style={{ width: '100%', marginTop: '.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src='https://res.lexiangpingou.cn/images/vip/fengleiwu.png' style={{ width: '1.6rem', height: '1.6rem', }} alt='' />
            </div>
            <p style={{ width: '100%', marginTop: '.4rem', /* marginBottom: '.4rem', */ textAlign: 'center', color: '#fff', fontSize: '.32rem', opacity: '0.7' }}>商家正在努力上新中</p>
          </Fragment>}
      </ul>
    );
  }


  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)
  }

  showDrawer = (e) => {
    e.stopPropagation();
    this.setState({
      showDrawer: true
    })
  }

  hideDrawer = (e) => {
    e.stopPropagation();
    this.setState({
      showDrawer: false,
    })
  }

  optionsGoods = (goods) => {
    this.props.optionsGoods(goods)
  }

  // componentDidMount = () => {
  //   const p = document.querySelectorAll('.laiyiquan')
  //   p.forEach(item => {
  //     if (item.offsetHeight < item.nextSibling.offsetHeight * 2) {
  //       item.nextSibling.style.marginBottom = .2 + 'rem'
  //       item.style.marginBottom = .6 + 'rem'
  //       // console.log(item.offsetHeight)
  //     } else {
  //       item.style.marginBottom = .3 + 'rem'
  //       item.nextSibling.style.marginBottom = .2 + 'rem'
  //       // console.log(item.offsetHeight)
  //     }
  //   })
  // }
  // componentDidUpdate = () => {
  //   const p = document.querySelectorAll('.laiyiquan')
  //   p.forEach(item => {
  //     if (item.offsetHeight < item.nextSibling.offsetHeight * 2) {
  //       item.nextSibling.style.marginBottom = .2 + 'rem'
  //       item.style.marginBottom = .6 + 'rem'
  //       // console.log(item.offsetHeight)
  //     } else {
  //       item.style.marginBottom = .3 + 'rem'
  //       item.nextSibling.style.marginBottom = .2 + 'rem'
  //       // console.log(item.offsetHeight)
  //     }
  //   })
  // }



  /* componentWillUnmount = () => {
    // 取消订阅模式
    this.cancelSub()
  } */

}

// const Style

export default HomeGoodsList;