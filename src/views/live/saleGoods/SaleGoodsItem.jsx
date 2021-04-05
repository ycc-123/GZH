import React, { PureComponent } from "react"
import styled from "styled-components"
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'

import LiveAddTeam from './LiveAddTeam'

import { store } from 'store/index'
import { getCartData } from 'store/actionCreators'

import { _showCart, _cartApi } from 'network/cart'
import { _detailApi } from 'network/detail'

class SaleGoodsItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

            cartImg: 'https://res.lexiangpingou.cn/images/vip/liveCart.png',

            goodsInfo: {
                gimg: 'https://res.lexiangpingou.cn/images/vip/IN7GHXp7r5ixx7XRQi0L0xhQRRXlQ7.jpg',
                goodsname: "这是一个默认商品",
                id: "101151",
                item: "dd",
                num: this.props.item.num,
                oprice: "10.00",
                sid: "50547",
            },
            cartList: [

            ],
            num: this.props.item.num,
        }
        this.click = true
    }

    render() {
        const { type, item } = this.props
        const showNum = parseInt(item.num) === 0 ? 'none' : 'block'
        console.log(item.selltype)
        if (type === 'cart') {
            // 购物袋商品
            if (item.selltype === "0") {
                // 单买
                return (
                    <SaleGoodsItemStyle>
                        <div className="goodsItem" >
                            <div className="goodsImgs">
                                <img src={item.gimg} alt="" />
                            </div>
                            <div className="goodsInfo">
                                <span className="goodsTitle">{item.gname}</span>
                                <p>1</p>
                                <div className="goodsbottom">
                                    <span className="goodsPrice goodsTextColor">
                                        <span className="price">￥{item.oprice}</span>
                                    </span>
                                    <div className="goodsCart">
                                        {item.num === 0 && <img
                                            src={this.state.cartImg}
                                            alt=""
                                            onClick={this.addCart} />}
                                        <div className='calculate1' style={{ display: showNum }} onClick={(e) => { e.stopPropagation() }}>
                                            <div className='decrement' onClick={(e) => { this.editCart(e) }}>
                                            </div>
                                            {item.num}
                                            <div className='increment' onClick={(e) => { this.editCart(e) }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SaleGoodsItemStyle>
                )
            } else if (item.selltype === "1" || item.selltype === '4' || item.selltype === '6' || item.selltype === '7') {
                //  拼团
                return (
                    <SaleGoodsItemStyle>
                        <div className="goodsItem" onClick={this.goGroup.bind(this, item.id)}>
                            <div className="goodsImgs">
                                <img src={item.gimg} alt="商品图片" />
                            </div>
                            <div className="goodsInfo">
                                <span className="goodsTitle">{item.gname}</span>
                                {item.selltype !== '7' && <span className="haomangroup">
                                    <img style={{ width: '.44rem', height: '.31rem', marginRight: '.2rem' }} src='https://res.lexiangpingou.cn/images/vip/team.png' alt='' />
                                    ‍{item.groupnum}人团
                                </span>}
                                <div className="goodsbottom">
                                    <span className="goodsPrice goodsTextColor">
                                        <span className="price">￥{item.gprice}</span>
                                    </span>
                                    <div className="goGroup" onClick={() => { this.props.optionsGoods(item) }} >
                                        去开团
                                    </div>
                                </div>
                            </div>
                        </div>
                        {item.tuaninfo && <LiveAddTeam data={item.tuaninfo} bagShow={this.props.bagShow} />}
                    </SaleGoodsItemStyle>
                )
            }
        }

    }

    goGroup(id, e) {
        // this.props.history.push(`/detail/${id}/1`)
    }

    goSubmit = () => {
        // const { item } = this.props
        // if (item.hasoption === '0') {
        //     this.props.history.push(`/submit/2/${goods.id}/1/${num}/0/0`)
        // }
    }

    hideDrawer = () => {
        this.setState({
            showDrawer: false,
        })
    }

    editCart = async (e) => {
        e.stopPropagation()
        const { item } = this.props
        const { appConfig } = store.getState()
        const wxUserInfo = appConfig.wxUserInfo
        // 判断是否为加
        if (e.target.className === 'increment') {
            this.click = false
            // 存在限购
            if (item.one_limit) {
                if (parseInt(item.one_limit) === parseInt(item.num)) {
                    this.click = true
                    Toast.info(`当前商品最大可购买${item.one_limit}`, 1)
                } else {
                    item.num = parseInt(item.num) + 1
                    const add_config = {
                        action: 'cartAdd',
                        data: {
                            uniacid: appConfig.uniacid,
                            openid: wxUserInfo.openid,
                            gid: item.id,
                            num: item.num
                        }
                    }
                    const result = await _cartApi(add_config)
                    if (result.data.status === 200) {
                        const action = getCartData(result.data.data)
                        store.dispatch(action)
                        const cartGoodsItem = result.data.data.find(value => {
                            return value.sid === item.id
                        })
                        this.setState({
                            num: cartGoodsItem.num
                        }, () => {
                            this.click = true
                        })
                    } else {
                        // 错误处理
                        item.num = parseInt(item.num) - 1
                        Toast.info(result, 1)
                        this.click = true
                    }

                }
            } else if (parseInt(item.num) === parseInt(item.gnum)) {
                Toast.info(`当前商品不能超过库存${item.gnum}`, 1)
            } else { // 不存在限购直接进来
                item.num = parseInt(item.num) + 1
                const add_config = {
                    action: 'cartAdd',
                    data: {
                        uniacid: appConfig.uniacid,
                        openid: wxUserInfo.openid,
                        gid: item.id,
                        num: item.num
                    }
                }
                const result = await _cartApi(add_config)
                const action = getCartData(result.data.data)
                store.dispatch(action)
                const cartGoodsItem = result.data.data.find(value => {
                    return value.sid === item.id
                })
                this.setState({
                    num: cartGoodsItem.num
                }, () => {
                    setTimeout(() => {
                        this.click = true
                    }, 100)
                })
            }
        } else if (e.target.className === 'decrement' && this.click) {  // 减
            this.click = false
            item.num = parseInt(item.num) - 1
            if (item.num === 0) {
                const del_cart = {
                    action: 'cartDel',
                    data: {
                        uniacid: appConfig.uniacid,
                        cart_id: store.getState().cartGoods.find(value => value.sid === item.id).id
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
                        gid: item.id,
                        num: item.num
                    }
                }
                const result = await _cartApi(add_config)
                const action = getCartData(result.data.data)
                store.dispatch(action)
                const cartGoodsItem = result.data.data.find(value => {
                    return value.sid === item.id
                })
                console.log(cartGoodsItem)
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

    // shouldComponentUpdate = (nextProps, nextState) => {
    //     return JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item) || (parseInt(this.state.num) !== parseInt(nextState.num))
    // }

    addCart = async _ => {
        const goods = this.props.item
        const { appConfig } = store.getState()
        const wxUserInfo = appConfig.wxUserInfo
        if (goods.hasoption === '1') {
            this.props.optionsGoods(goods)
        } else if (goods.hasoption === '0') {
            if (goods.isshow !== '3') {
                if (goods.gnum > 0) {
                    if (goods.spike === '1') {
                        this.countdown = parseInt(goods.spike_end) - (Date.parse(new Date()) / 1000)
                        // this.countdown = -2
                        this.distanceCountdown = parseInt(goods.spike_start) - (Date.parse(new Date()) / 1000)
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
    }




    componentDidMount = () => {
    }
}

const SaleGoodsItemStyle = styled.div`

.calculate1 {
  position: absolute;
  box-sizing: content-box;
  right: 0;
  bottom: 0;
  line-height: .63rem;
  width: 1.8rem;
  height: .63rem;
  padding: .8rem .3rem .3rem .3rem; 
  text-align: center;
  font-size: .4rem;
  color: #f5702a;
}

.decrement, .increment {
  position: absolute;
  bottom: .3rem;
  width: .63rem;
  height: .63rem;
  border-radius: 50%;
}

.decrement {
  left: .27rem;
  color: #201d1d;
  background: #dadada;
}

.increment {
  right: .3rem;
  color: #fff;
  background: red;
}

.goodsItem{
  overflow: hidden;
  position: relative;
  margin: .28rem .32rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height:2.49rem;
  // border: solid .027rem black;
  box-shadow:.05rem .05rem .1rem .05rem rgba(0, 0, 0, 0.29);
  border-radius: .13rem;
}

.goodsImgs{
    margin-right: .32rem;
    width: 2.49rem;
    height:2.49rem;
}
.goodsImgs>img{
    width: 2.49rem;
    height:2.49rem;
}

.goodsInfo{
padding-right: .2rem;
display: flex;
flex-direction: column;
flex-grow: 1;
/* 元素间隔 */
justify-content: space-between; 

}
.goodsInfo>span{
flex-basis: .7rem;
}
.goodsTitle{
    color:#474747;
}

.goodsNum{
position: relative;
right: -4rem;
}

.goodsTextColor{
    width:1.19rem;
height:0.37rem;
font-size:0.32rem;
font-family:PingFang SC;
font-weight:bold;
color:rgba(220,28,28,1);
}

.goodsbottom{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.goodsCart>img{
    width: .57rem;
    height: .57rem;
}

.goodsCart>div{
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
}

.goodsnum{
    color: black;
    padding: 0 .36rem;
}

.btn{
  display: inline-block;
  width: .63rem;
  height: .63rem;
  line-height: .63rem;
  text-align: center;
  background: #fa5151;
  border-radius: 50%;
  font-size: .48rem;
  color: #fff;
}

.plus{
    background:rgba(220,28,28,1);
}
.plus>span{

    font-size:0.4rem;
    font-weight:bold;
    color:rgba(255,255,255,1);
}

.reduce{
    background:rgba(229,229,229,1);
}
.reduce>span{
    font-size:0.4rem;
    font-weight:bold;
    color:rgba(0,0,0,1);
}


`

export default withRouter(SaleGoodsItem)