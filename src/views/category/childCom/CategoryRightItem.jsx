import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'


import { store } from 'store/index'
import { getCartData } from 'store/actionCreators'

import { _showCart, _cartApi } from 'network/cart'
import { _detailApi } from 'network/detail'

class CategoryRightgoods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      num: this.props.goods.num
    }
    this.click = true
  }
  render() {
    const { goods, ys, kc, memberExpiration } = this.props
    const { icons } = store.getState().mallConfig
    const show = parseInt(goods.num) === 0 ? 'block' : 'none'
    const showNum = parseInt(goods.num) === 0 ? 'none' : 'block'
    const kca = parseInt(kc) === 1 ? 'none' : 'block'
    const ysa = parseInt(ys) === 1 ? 'none' : 'block'
    let price, groupText
    console.log(memberExpiration)

    if (goods.is_experience === '2' && goods.selltype !== '0') {
      price = goods.gprice
      groupText = '去兑换'
    } else if (goods.hasoption === '1' && goods.selltype === '0') {
      price = goods.option_price
    } else if (goods.selltype === '0') {
      price = goods.oprice
    } else if (goods.selltype === '1') {
      price = goods.gprice
      groupText = '去开团'
    } else if (goods.selltype === '4') {
      price = goods.gprice
      groupText = '阶梯团'
    } else if (goods.selltype === '6') {
      price = goods.gprice
      groupText = '新专团'
    } else if (goods.selltype === '7') {
      price = goods.preprice
      groupText = '订金团'
    }

    return (
      <CategoryRightgoodsStyle>
        <li className='category-goods clearfix' onClick={(e) => { this.goDetail(e, goods.id) }} >
          <img className='category-img' src={goods.gimg} alt="" onClick={(e) => { this.goDetail(e, goods.id) }} />
          <div className='category-goods-info'>
            <p>{goods.gname}</p>
            <p>市场价: <span>￥</span> {goods.mprice} {(goods.selltype === '1' || goods.selltype === '4' || goods.selltype === '6') && <>
              <img src='https://res.lexiangpingou.cn/images/vip/team.png' className='team-img' alt='' />
              <label className='team'>
                {goods.groupnum}人团
              </label></>}</p>
            <p>
              <span>&yen;</span>{price}
              {
                memberExpiration &&
                <button className='category-button-left'>会员价</button>
              }
              {
                memberExpiration &&
                <button className='category-button-right'><span>￥</span>{goods.selltype === '0' ? goods.danmai_memberprice : goods.pintuan_memberprice}</button>
              }
            </p>
            <p className='yskc'>
              <span style={{ display: ysa }}> 已售<span>{goods.salenum}</span></span>
              <span style={{ display: kca }}> 库存{goods.isshow === '3' ? '0' : goods.gnum}</span>
            </p>
            {goods.selltype === '0' && goods.hasoption === '0' &&
              <img className='category-goods-img'
                style={{ display: show }}
                src={icons.goods_cart}
                onClick={(e) => { this.addCart(e) }}
                alt="" />}

            {
              goods.selltype === '0' && goods.hasoption !== '0' &&
              <img className='category-goods-img'
                src={icons.goods_cart}
                alt="" />
            }
            {(goods.isshow === '3' || goods.gnum === '0') && <img src='https://res.lexiangpingou.cn/images/vip/maiwan.png' className='__--__' alt='' />}

          </div>
          {
            goods.selltype === '0' && goods.hasoption === '0' && <div className='calculate_1' style={{ display: showNum }} onClick={(e) => { e.stopPropagation() }}>
              <div className='decrement_1' onClick={(e) => { this.editCart(e) }}>
              </div>
              {goods.num}
              <div className='increment_1' onClick={(e) => { this.editCart(e) }}>
              </div>
            </div>
          }

          {(goods.selltype === '1' || goods.selltype === '4' || goods.selltype === '6' || goods.selltype === '7' || goods.is_experience === '2') && <button className='goods-button'>{groupText}</button>}
        </li>
      </CategoryRightgoodsStyle>
    );
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.state) !== JSON.stringify(nextState) || this.props.history.location.pathname === '/category'
  }

  goDetail = (e, id) => {
    const { isApplet } = store.getState().appConfig
    e.stopPropagation()
    const { goods } = this.props
    console.log(goods)
    const { appConfig } = store.getState()
    if (Number(goods.one_group) === 1) {
      const config = {
        action: 'goods_detail',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          id
        }
      }
      _detailApi(config).then(res => {
        if (res.data.data.groupinfo.tuan_id !== '' && res.data.data.groupinfo.tuan_id !== 0) {

          isApplet ? window.navigateToWebWiew(`#/group/${res.data.data.groupinfo.tuan_id}`) : this.props.history.push({ pathname: `/group/${res.data.data.groupinfo.tuan_id}` })
          // this.props.history.push({ pathname: `/group/${res.data.data.groupinfo.tuan_id}` })
        } else {
          // this.props.history.push({ pathname: `/detail/${id}/1` })
          isApplet ? window.navigateToWebWiew(`#/detail/${id}/1`) : this.props.history.push(`/detail/${id}/1`)
        }
      })
    } else {
      if (this.props.goods.num === 0) {
        isApplet ? window.navigateToWebWiew(`#/detail/${id}/1`) : this.props.history.push(`/detail/${id}/1`)
      } else {
        // this.props.history.push({ pathname: `/detail/${id}/${this.props.goods.num}` })
        isApplet ? window.navigateToWebWiew(`#/detail/${id}/${this.props.goods.num}`) : this.props.history.push(`/detail/${id}/${this.props.goods.num}`)
      }
    }

  }




  // 添加到购物车
  addCart = async e => {
    e.stopPropagation()
    let { goods } = this.props
    const { appConfig } = store.getState()
    if (goods.isshow !== '3') {
      if (goods.gnum > 0) {
        if (goods.spike === '1') {
          this.countdown = parseInt(this.props.goods.spike_end) - (Date.parse(new Date()) / 1000)
          // this.countdown = -2
          this.distanceCountdown = parseInt(this.props.goods.spike_start) - (Date.parse(new Date()) / 1000)
          if (this.distanceCountdown >= 0) {
            Toast.info('活动未开始')
            return
          } else if (this.countdown <= 0) {
            Toast.info('活动已结束')
            return
          }
        }
        goods.num = 1
        this.add_config = {
          action: 'cartAdd',
          data: {
            uniacid: appConfig.uniacid,
            openid: appConfig.wxUserInfo.openid,
            gid: goods.id,
            num: goods.num
          }
        }
        const result = await _cartApi(this.add_config)
        if (result.data.status === 200) {
          const action = getCartData(result.data.data)
          store.dispatch(action)
          const cartGoodsItem = result.data.data.find(item => {
            return item.sid === goods.id
          })
          this.setState({
            num: cartGoodsItem.num
          })
        } else if (result.data.status === 400) {
          Toast.info(result.data.msg, 1)
        }
      }
    }
  }

  // 修改购物车
  editCart = async (e) => {
    e.stopPropagation()
    const { goods } = this.props
    const { appConfig } = store.getState()
    // 判断是否为加
    if (e.target.className === 'increment_1') {
      this.click = false
      // 存在限购
      if (goods.one_limit) {
        if (parseInt(goods.one_limit) === parseInt(goods.num)) {
          this.click = true
          Toast.info(`当前商品最大可购买${goods.one_limit}`, 1)
        } else {
          goods.num = parseInt(goods.num) + 1
          const add_config = {
            action: 'cartAdd',
            data: {
              uniacid: appConfig.uniacid,
              openid: appConfig.wxUserInfo.openid,
              gid: goods.id,
              num: goods.num
            }
          }
          const result = await _cartApi(add_config)
          if (result.data.status === 200) {
            const action = getCartData(result.data.data)
            store.dispatch(action)
            const cartGoodsItem = result.data.data.find(item => {
              return item.sid === goods.id
            })
            console.log(cartGoodsItem.num)
            this.setState({
              num: cartGoodsItem.num
            }, () => {
              this.click = true
            })
          } else {
            // 错误处理
            goods.num = parseInt(goods.num) - 1
            Toast.info(result, 1)
            this.click = true
          }

        }
      } else if (parseInt(goods.num) === parseInt(goods.gnum)) {
        Toast.info(`当前商品不能超过库存${goods.gnum}`, 1)
      } else { // 不存在限购直接进来
        goods.num = parseInt(goods.num) + 1
        const add_config = {
          action: 'cartAdd',
          data: {
            uniacid: appConfig.uniacid,
            openid: appConfig.wxUserInfo.openid,
            gid: goods.id,
            num: goods.num
          }
        }
        const result = await _cartApi(add_config)
        const action = getCartData(result.data.data)
        store.dispatch(action)
        const cartGoodsItem = result.data.data.find(item => {
          return item.sid === goods.id
        })
        console.log(cartGoodsItem.num)
        this.setState({
          num: cartGoodsItem.num
        }, () => {
          setTimeout(() => {
            this.click = true
          })
        })
      }
    } else if (e.target.className === 'decrement_1' && this.click) {  // 减
      this.click = false
      goods.num = parseInt(goods.num) - 1
      if (goods.num === 0) {
        const del_cart = {
          action: 'cartDel',
          data: {
            uniacid: store.getState().appConfig.uniacid,
            cart_id: store.getState().cartGoods.find(item => item.sid === goods.id).id
          }
        }
        const del = await _cartApi(del_cart)
        const result = await _showCart()
        const action = getCartData(result.data.data)
        store.dispatch(action)
        this.setState({ num: 0 }, () => {
          setTimeout(() => {
            this.click = true
          }, 100)
        })
      } else {
        const add_config = {
          action: 'cartAdd',
          data: {
            uniacid: appConfig.uniacid,
            openid: appConfig.wxUserInfo.openid,
            gid: goods.id,
            num: goods.num
          }
        }
        console.log(add_config)
        const result = await _cartApi(add_config)
        const action = getCartData(result.data.data)
        store.dispatch(action)
        const cartGoodsItem = result.data.data.find(item => {
          return item.sid === goods.id
        })
        this.setState({
          num: cartGoodsItem.num
        }, () => {
          setTimeout(() => {
            this.click = true
          }, 100)
        })
      }
    }



  }

}

const CategoryRightgoodsStyle = styled.div`
.yskc{
  font-size: .32rem;
  display:flex;
}
.team {
  position: absolute;
  font-size: .33rem;
  right: 0;
}

.team-img {
  position: absolute;
  right: 1rem;
  width: .35rem;
  height: auto;
}

.__--__ {
  position: absolute;
  z-index: 10;
  bottom: 0;
  right: 0;
  width: 1.87rem;
  height: auto
}

.categoryRight {
  position: relative;
  float: left;
  top: .2rem;
  height: calc(100vh - 1.48rem);
  width: 7.26rem;
  overflow: hidden;
}

.category-goods {
  position: relative;
  overflow: hidden;
  width: 7.17rem;
  height: 2.56rem;
  line-height: 1;
  padding: .17rem;
  margin-bottom: .17rem;
  border-radius: .2rem;
  background-color: #fff;
}

.category-img {
  display: block;
  float: left;
  width: 2.2204rem;
  height: 2.2204rem;
  margin-right: .15rem;
}

.category-goods-info {
  position: relative;
  width: calc(100% - 2.3704rem);
  height: 100%;
  float: left;
}

.category-goods-info p:first-child {
  font-size: .32rem;
  margin-bottom: .24rem;
  text-align: justify;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #4d4d4d;
  font-weight: bold;
}

.category-goods-info p:nth-child(2) {
  position: relative;
  align-items: center;
  text-decoration: line-through;
  margin-bottom: .15rem;
  display: flex;
  font-size: .3rem;
  color: #c2c2c2;
}

.category-goods-info p:nth-child(3) {
  position: relative;
  display: flex;
  font-size: .4rem;
  color: var(--theme-font-color);
  height: .5rem;
}

.category-button-left, .category-button-right {
  position: absolute;
  left: 1.5rem;
  height: 100%;
  border: none;
  font-size: .26rem !important;
}

.category-button-left {
  width: 1rem;
  background: #f5702a;
  border-top-left-radius: .08rem;
  border-bottom-left-radius: .08rem;
  color: white;
}

.category-button-right {
  padding: 0 .1rem;
  left: 2.5rem;
  font-weight: bold;
  font-size: .27rem !important;
  border-top-right-radius: .08rem;
  border-bottom-right-radius: .08rem;
  color: var(--theme-font-color);
  background: #ffe4d5;
}

.category-goods-info p:nth-child(3) span {
  font-size: .3rem;
  margin-top: .09rem;
}

.category-goods-info p:nth-child(4) {
  width: 100%;
  position: absolute;
  color: #484848;
  bottom: 0;
  opacity: .8;
  font-size: .24rem;
}

.category-goods-info p:nth-child(4) span {
  margin-right: .2rem;
}

.category-goods-img {
  position: absolute;
  bottom: 0;
  right: 0;
  width: .56rem;
  height: .56rem;
}

.category-goods .goods-img img {
  margin-left: 1.2rem;
}

.goods-button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-font-color);
  bottom: .17rem;
  right: 0;
  border: none;
  width: 1.6rem;
  height: .6rem !important;
  font-size: .3rem;
  color: white;
  border-top-left-radius: .4rem;
  border-bottom-left-radius: .4rem;
}

.goods-button::after {
  content: '';
    position: absolute;
    display: inline-block;
    top: 50%;
    right: 9%;
    width: .12rem;
    height: .12rem;
    border-top: .03rem solid #fff;
    border-right: .03rem solid #fff;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: translate(0, -50%) rotate(45deg);
}

.calculate {
  line-height: .6rem;
  text-align: center;
  color: #f5702a;
}

`

export default withRouter(CategoryRightgoods)