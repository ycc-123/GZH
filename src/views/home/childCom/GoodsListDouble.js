import React, { Component, createRef } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'

import { store } from 'store/index'
import { getCartData } from 'store/actionCreators'

import { _showCart, _cartApi } from 'network/cart'
import { _detailApi } from 'network/detail'

import { imgLazyload } from 'commons/imgLazyload'

/* 
*
* goods.selltype
* 0 单买 1 拼图 4 阶梯团 6 新专团 7 定金团
*
*/


class GoodsListDouble extends Component {
  constructor(props) {
    super(props)
    this.state = {
      num: this.props.goods.num,
      displaykc: '',
      displayxl: ''
    }
    this.click = true
    this.img = createRef()
  }
  render() {
    let price, groupText
    const { icons } = store.getState().mallConfig
    const { goods, issell, showPubStock, isIosVerLgThan, memberExpiration } = this.props
    console.log(memberExpiration)
    const show = parseInt(goods.num) === 0 ? 'block' : 'none'
    const showNum = parseInt(goods.num) === 0 ? 'none' : 'block'
    const ys = parseInt(issell) === 1 ? 'none' : 'block'
    const kc = parseInt(showPubStock) === 1 ? 'none' : 'block'

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
      <HomeGoodsListItemStyle>
        <li className='goods-list-item' onClick={(e) => { this.goDetail(e, goods.id) }}>
          <div className='goods-img'>
            <img className='h-goods-img' src={isIosVerLgThan ? require('assets/img/imgload.gif') : goods.gimg} alt="" ref={this.img} />
            {/* <img className='h-goods-img' src={goods.gimg} alt="" ref={this.img} /> */}
            {/* <img src='https://res.lexiangpingou.cn/images/vip/gifgif.gif' alt="" /> */}
          </div>
          <div className='goods-info'>
            <p className='laiyiquan'>{goods.gname}</p>
            <p>市场价: <span>￥</span> {goods.mprice} {(goods.selltype === '1' || goods.selltype === '4') && <>
              <label className='team'>
                <img src='https://res.lexiangpingou.cn/images/vip/team.png' alt='' />
                {goods.groupnum}人团
              </label></>}
            </p>
            <p>
              <span>&yen;</span>{price}
              {
                memberExpiration && <button className='goods-button-left'>会员价</button>
              }
              {
                memberExpiration &&
                <button className='goods-button-right'><span>￥</span>{goods.selltype === '0' ? goods.danmai_memberprice : goods.pintuan_memberprice}</button>
              }
            </p>
            <p onClick={(e) => { this.off(e) }}>
              <span style={{ display: ys }}> 已售<span>{goods.salenum}</span></span>
              <span style={{ display: kc }}> 库存{goods.isshow === '3' ? '0' : goods.gnum}</span>
            </p>
            {
              goods.selltype === '0' && goods.hasoption === '0' && <img className='goods-info-img'
                src={icons.goods_cart}
                style={{ display: show }}
                onClick={(e) => { this.addCart(e) }}
                alt="" />
            }
            {
              goods.selltype === '0' && goods.hasoption !== '0' && <img className='goods-info-img'
                src={icons.goods_cart}
                onClick={(e) => { this.optionsGoods(e, goods) }} alt="" />
            }
          </div>
          {/* {goods.discount_zk !== undefined ? <><img className='zheimg' src='https://res.lexiangpingou.cn/images/vip/discount.png' alt="" />
            <p className='zhe'>
              <span style={{ marginTop: '-.01rem' }}>折扣</span>
              <span style={{ marginTop: '.01rem' }}>{goods.discount_zk}</span>
            </p></> : <></>} */}
          {
            goods.discount_zk &&
            <div className='discount'>
              <div style={{ width: '100%', height: '.04rem', backgroundColor: '#FCE72C' }}></div>
              <div className='content'>
                <p style={{ fontSize: '.21rem', fontWeight: 'bold', textAlign: 'center', marginTop: '.12rem' }}>折扣</p>
                <p style={{ fontSize: '.21rem', fontWeight: '500', textAlign: 'center', marginTop: '.08rem', marginBottom: '.03rem' }}>{goods.discount_zk}</p>
              </div>
              <div className='triangle'></div>
            </div>
          }

          {goods.selltype === '0' && goods.hasoption === '0' && <div className='calculate1' style={{ display: showNum }} onClick={(e) => { e.stopPropagation() }}>
            <div className='decrement' onClick={(e) => { this.editCart(e) }}>
            </div>
            {this.props.goods.num}
            <div className='increment' onClick={(e) => { this.editCart(e) }}>
            </div>
          </div>}
          {(goods.isshow === '3' || goods.gnum === '0') && <img src='https://res.lexiangpingou.cn/images/vip/maiwan.png' className='__--__' alt='' />}
          {(goods.selltype === '1' || goods.selltype === '4' || goods.selltype === '7' || goods.selltype === '6' || goods.is_experience === '2') && <button className='goods-button' >{groupText}</button>}
        </li>
      </HomeGoodsListItemStyle>
    )
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.state) !== JSON.stringify(nextState) || this.props.history.location.pathname === '/home'
  }

  componentDidMount() {
    const { gimg } = this.props.goods
    const { isIosVerLgThan } = this.props
    if (isIosVerLgThan) {
      imgLazyload(gimg, this.img.current)
    }
  }

  optionsGoods = (e, goods) => {
    e.stopPropagation()
    this.props.optionsGoods(goods)
  }

  goDetail = (e, id) => {
    const { isApplet } = store.getState().appConfig
    e.stopPropagation()
    const { goods } = this.props
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    if (Number(goods.one_group) === 1) {
      const config = {
        action: 'goods_detail',
        data: {
          uniacid: appConfig.uniacid,
          openid: wxUserInfo.openid,
          id
        }
      }
      _detailApi(config).then(res => {
        if (res.data.data.groupinfo.tuan_id !== '' && res.data.data.groupinfo.tuan_id !== 0) {

          isApplet ? window.navigateToWebWiew(`#/group/${res.data.data.groupinfo.tuan_id}`) : this.props.history.replace({ pathname: `/group/${res.data.data.groupinfo.tuan_id}` })
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


  off = (e) => {
    e.stopPropagation()
  }

  // 添加到购物车
  addCart = async e => {
    e.stopPropagation()
    let { goods } = this.props
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
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
            openid: wxUserInfo.openid,
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
    const wxUserInfo = appConfig.wxUserInfo
    // 判断是否为加
    if (e.target.className === 'increment') {
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
              openid: wxUserInfo.openid,
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
            openid: wxUserInfo.openid,
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
        this.setState({
          num: cartGoodsItem.num
        }, () => {
          setTimeout(() => {
            this.click = true
          })
        })
      }
    } else if (e.target.className === 'decrement' && this.click) {  // 减
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
            openid: wxUserInfo.openid,
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

const HomeGoodsListItemStyle = styled.div`


.discount {
  position: absolute;
  top: 0;
  left: .16rem;
  width: .56rem;
  overflow: hidden;
}

.content {
  overflow: hidden;
  background-color: var(--theme-font-color);
  color: #fff;
}

.triangle {
  width: 0;
  height: 0;
  /* border-top: .28rem solid yellow; */
  border-left: .28rem solid var(--theme-font-color);
  border-right: .28rem solid var(--theme-font-color);
  border-bottom: .08rem solid transparent;
  /* background: skyblue; */
}

.goods-commission {
  position: absolute;
  background: var(--theme-font-color);
  bottom: .3rem;
  right: 0;
  border: none;
  width: 1.85rem;
  height: .8rem !important;
  color: white;
  border-top-left-radius: .4rem;
  border-bottom-left-radius: .4rem;
}

.zheimg {
  position: absolute;
  width: .8rem;
  height: auto;
  left: .3rem;
}

.__--__ {
  position: absolute;
  z-index: 1;
  bottom: .3rem;
  right: .18rem;
  width: 2rem;
  height: auto;
}

.zhe {
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  top: .3rem;
  left: .4rem;
  font-size: .3rem;
  color: #fff;
}

.goods-list-item {
  position: relative;
  overflow: hidden;
  border-radius: .13rem;
  width: 4.61rem;
  height: 7.8rem;
  margin-top: .16rem;
  line-height: 1;
  background-color: var(--goods-bg-color);
}

.goods-img {
  width: 100%;
  height: 4.61rem;
}

.goods-img img {
  display: block;
  width: 100%;
  height: 100%;
}

.goods-info {
  position: relative;
  width: 100%;
  height: calc(100% - 4.61rem);
  overflow: hidden;
}

.goods-info p:first-child {
  margin: 0 auto;
  margin-top: .15rem;
  margin-bottom: .2rem;
  min-height: .8rem;
  text-align: justify;
  color: #474747;
  width: 4.39rem;
  font-size: .37rem;
  font-weight: bold;
  line-height: 1.15;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-info p span {
  font-size: .32rem;
}

.goods-info p:nth-child(2) {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 .15rem;
  color: #c1c1c1;
  text-decoration: line-through;
  font-size: .3rem;
}

.goods-info p:nth-child(2) img {
  margin-right: .1rem;
  margin-top: .1rem;
  width: .35rem;
}

.goods-info p:nth-child(3) {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: .2rem;
  padding-left: .15rem;
  font-size: .43rem;
  font-weight: bold;
  color: var(--theme-font-color);
  
}
.goods-info p:nth-child(3) span {
  margin-right: .1rem;
}

.goods-button-left, .goods-button-right {
  position: absolute;
  left: 2rem;
  padding: .15rem .1rem;
  border: none;
  font-size: .26rem !important;
}

.goods-button-left {
  width: 1rem;
  background: #f5702a;
  border-top-left-radius: .08rem;
  border-bottom-left-radius: .08rem;
  color: white;
}

.goods-button-right {
  left: 3rem;
  font-weight: bold;
  font-size: .27rem !important;
  border-top-right-radius: .08rem;
  border-bottom-right-radius: .08rem;
  color: var(--theme-font-color);
  background: #ffe4d5;
}

.goods-button-right span {
  font-size: .2rem !important;
}

.goods-info p:nth-child(4) {
  position: absolute;
  bottom: .11rem;
  display: flex;
  align-items: flex-end;
  padding-left: .15rem;
  width: 100%;
  color: #797979;
  font-size: .24rem;
}

.goods-info-img {
  position: absolute;
  bottom: .11rem;
  right: .4rem;
  width: .56rem;
  height: .57rem;
}

.goods-info p:nth-child(4) span {
  font-size: .24rem;
}

.goods-info p:nth-child(4) span:first-child {
  margin-right: .15rem;
}

.goods-button {
  position: absolute;
  bottom: .11rem;
  right: 0;
  border: none;
  width: 1.85rem;
  height: .8rem !important;
  line-height: .8rem;
  font-size: .32rem;
  color: white;
  border-top-left-radius: .4rem;
  border-bottom-left-radius: .4rem;
  background: var(--theme-font-color);
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

.team {
  position: absolute;
  font-size: .32rem;
  bottom: 0;
  right: .15rem;
}

.calculate1 {
  position: absolute;
  box-sizing: content-box;
  right: 0;
  bottom: 0;
  line-height: .53rem;
  width: 1.8rem;
  height: .53rem;
  padding: 1.2rem .3rem .11rem .5rem; 
  text-align: center;
  font-size: .4rem;
  color: var(--theme-font-color);
}

.decrement, .increment {
  position: absolute;
  bottom: .11rem;
  width: .53rem;
  height: .53rem;
  border-radius: 50%;
}

.increment {
  right: .3rem;
  color: #fff;
  background-color: var(--theme-font-color);
}

.num {
  
}

`

export default withRouter(GoodsListDouble);