import React, { PureComponent } from "react"
import SaleGoodsItem from "../saleGoods/SaleGoodsItem"
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'

import BetterScroll from "common/betterScroll/BetterScroll"

import TuanDrawer from './TuanDrawer'
import DanDrawer from './DanDrawer'

import { _submitApi } from 'network/submit'
import { _homeApi } from "network/home"

import { store } from "store/index"

class ShopingGoods extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            cartImg: 'https://res.lexiangpingou.cn/images/vip/shopcart.png',
            saleGoodsImg: '',
            bagShow: false, // 购物袋显示
            nowSaleShow: false,
            ptac: true,
            dmac: false,
            allGoodsList: [],
            danGoods: '', // 选规格的商品
            tuanGoods: '', // 选规格的商品
            num: '',
            showDanDrawer: false,
            showTuanDrawer: false,
            cartNum: store.getState().cartGoods.reduce((oldValue, item) => {
                return oldValue + parseInt(item.num)
            }, 0),
            danMai: [],
            network: true
        }
        this.cancelSub = store.subscribe(() => {
            this.setState({
                cartNum: store.getState().cartGoods.reduce((oldValue, item) => {
                    return oldValue + parseInt(item.num)
                }, 0)
            })
        })


        this.shopingBag = this.shopingBag.bind(this)
        const { appConfig } = store.getState()
        const { memberUserInfo } = store.getState()
        let memberid = memberUserInfo.id
        const { uniacid } = appConfig
        const { openid } = appConfig.wxUserInfo
        this.newUniacid = uniacid
        this.newMemberid = memberid

        this.networkConfig = {
            liveGoodsList: {
                action: 'shopajax_pub',
                data: {
                    uniacid,
                    openid,
                    page: 1,
                    pagesize: 1000,
                    livegoods: 1
                }
            }

        }

    }

    async componentDidMount() {
        let homeRes = await _homeApi(this.networkConfig.liveGoodsList)
        if (homeRes.data.status === 200) {
            let danMai = homeRes.data.data.list.filter(item => item.selltype === '0')
            let pinTuan = homeRes.data.data.list.filter(item => item.selltype === '1' || item.selltype === '4' || item.selltype === '6' || item.selltype === '7')
            this.setState({
                allGoodsList: homeRes.data.data.list,
                saleGoodsImg: homeRes.data.data.list[0].gimg,
                danMai,
                pinTuan
            }, () => {
                this.refs.scrollTuan.BScroll.refresh()
                this.refs.scrollDan.BScroll.refresh()
            })
        }
    }

    componentDidUpdate = async () => {
        const { network } = this.state
        if (network) {
            let homeRes = await _homeApi(this.networkConfig.liveGoodsList)
            if (homeRes.data.status === 200) {
                let danMai = homeRes.data.data.list.filter(item => item.selltype === '0')
                let pinTuan = homeRes.data.data.list.filter(item => item.selltype === '1' || item.selltype === '4' || item.selltype === '6' || item.selltype === '7')
                this.setState({
                    allGoodsList: homeRes.data.data.list,
                    saleGoodsImg: homeRes.data.data.list[0].gimg,
                    danMai,
                    pinTuan,
                    network: false
                }, () => {
                    this.refs.scrollTuan.BScroll.refresh()
                    this.refs.scrollDan.BScroll.refresh()
                })
            }
        }
    }

    render() {
        const modalIsShow = this.state.bagShow ? 'block' : 'none'
        const ptActive = this.state.ptac ? 'ptac' : 'pt';
        const dmActive = this.state.dmac ? 'dmac' : 'dm';
        const ptShow = this.state.ptac ? 'flex' : 'none';
        const dmShow = this.state.dmac ? 'flex' : 'none';
        const cartShow = this.state.dmac ? 'block' : 'none';
        const { nowSaleDetail } = this.props
        const { allGoodsList, danGoods, tuanGoods, showDanDrawer, showTuanDrawer, num, danMai, cartNum } = this.state
        const { cartGoods } = store.getState()
        const scollConfig = {
            probeType: 1
        }
        const scrollStyle = {
            top: '.2rem',
            height: '8rem'
        }

        if (allGoodsList.length !== 0) {
            allGoodsList.forEach(item => {
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
        }
        return (
            <ShopingGoodsStyle>
                <TuanDrawer
                    style={showTuanDrawer}
                    hideDrawer={this.hideTuanDrawer}
                    goods={tuanGoods}
                    num={num}
                    decrementNum={this.decrementNum}
                    incrementNum={this.incrementNum}
                />
                <DanDrawer
                    style={showDanDrawer}
                    hideDrawer={this.hideDanDrawer}
                    goods={danGoods}
                    num={num}
                    decrementNum={this.decrementNum}
                    incrementNum={this.incrementNum}
                />
                <div className="shopinggoods">
                    <div className="nowSaleGoods">
                        <div className="onShowGoods" onClick={() => {
                            this.props.history.push(`/detail/${nowSaleDetail.id}/1`)
                        }}>
                            <img src={nowSaleDetail.gimg} alt='' />
                            <p>当前在售商品</p>
                        </div>
                    </div>

                    <div className="shopingBag">
                        <div className="livemask" style={{ display: this.state.bagShow ? 'block' : 'none' }} onClick={this.shopingBag}></div>
                        <div style={{ display: modalIsShow }} className="bagSaleModal">
                            <div>
                                <span>全部商品（{this.state.allGoodsList.length}）</span>
                                <div className="bagContent">
                                    <div className="bagTopTab">
                                        <span className={ptActive} onClick={this.changeSelected.bind(this)}>
                                            拼团商品
                                              </span>
                                        <span className={dmActive} onClick={this.changeSelected.bind(this)}>
                                            单买商品
                                              </span>
                                    </div>
                                    <div style={{ display: ptShow }} className="pingtuan">
                                        <BetterScroll ref="scrollTuan" config={scollConfig} style={scrollStyle}>
                                            {this.state.bagShow && this.state.allGoodsList.map((item, key) => {
                                                return (
                                                    (item.selltype === "1" || item.selltype === '4' || item.selltype === '6' || item.selltype === '7') &&
                                                    <SaleGoodsItem type="cart" item={item} key={key + item.id} optionsGoods={this.optionsTuanGoods} bagShow={this.state.bagShow} />
                                                )
                                            })}
                                        </BetterScroll>
                                    </div>


                                    <div className="danmai" style={{ display: dmShow }}>
                                        <BetterScroll ref="scrollDan" config={scollConfig} style={scrollStyle}>
                                            {this.state.bagShow && this.state.allGoodsList.map((item, key) => {
                                                return (
                                                    item.selltype === "0" &&
                                                    <SaleGoodsItem type="cart" item={item} key={key + item.id} optionsGoods={this.optionsDanGoods} />
                                                )
                                            })}
                                        </BetterScroll>
                                    </div>
                                    <button style={{ display: cartShow }} onClick={() => { this.goSubmit() }} className='live-button-cart'>
                                        去结算  ({cartNum})
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="shopCart" onClick={this.shopingBag}>
                        <img src={this.state.cartImg} alt="" />
                        <p>购物</p>
                    </div>
                </div>

            </ShopingGoodsStyle>
        )
    }

    goSubmit = () => {
        let cartArrId = []
        const { isApplet } = store.getState().appConfig
        store.getState().cartGoods.forEach(item => {
            if (item.checked) {
                cartArrId.push(item.id)
            }

        })
        const cartConfig = {
            action: 'cartToAccount',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                cartids: cartArrId,
                openid: store.getState().appConfig.wxUserInfo.openid,
            }
        }
        _submitApi(cartConfig).then(res => {
            if (parseInt(res.data.status) === 200) {
                // this.props.history.push({ pathname: '/submit/1/0/1/0/0/0' })
                isApplet ? window.navigateToWebWiew('#/submit/1/0/1/0/0/0') : this.props.history.push('/submit/1/0/1/0/0/0')
            } else if (parseInt(res.data.status) === 400) {
                Toast.info(res.data.msg, 1)
            }
        })
    }

    optionsDanGoods = newgoods => {
        // const { goods } = this.state
        this.setState({
            danGoods: newgoods,
            showDanDrawer: true,
            num: 1
        })
    }

    optionsTuanGoods = newgoods => {
        // const { goods } = this.state
        this.setState({
            tuanGoods: newgoods,
            showTuanDrawer: true,
            num: 1
        })
    }

    hideDanDrawer = () => {
        this.setState({
            showDanDrawer: false,
        })
    }

    showDanDrawer = (e) => {
        e.stopPropagation()
        if (this.state.goods) {
            this.setState({
                showDanDrawer: true
            })
        }
    }

    hideTuanDrawer = () => {
        this.setState({
            showTuanDrawer: false,
        })
    }

    showTuanDrawer = (e) => {
        e.stopPropagation()
        if (this.state.goods) {
            this.setState({
                showTuanDrawer: true
            })
        }
    }

    decrementNum = () => {
        let { num } = this.state
        if (parseInt(num) > 1) {
            num = parseInt(num) - 1
        }
        this.setState({
            num: parseInt(num)
        })
    }


    incrementNum = () => {
        let { num, goods } = this.state
        if (goods.one_limit) {
            if (parseInt(num) === parseInt(goods.one_limit)) {
                Toast.info(`当前商品最大购买${goods.one_limit}`, 1)
            } else {
                num = parseInt(num) + 1
                this.setState({
                    num
                })
            }
        } else if (num === parseInt(goods.gnum)) {
            Toast.info(`当前商品数量不能超过${goods.gnum}`, 1)
        }
    }


    changeSelected(e) {
        let className = e.target.className
        _homeApi(this.networkConfig.liveGoodsList).then(res => {
            if (res.data.status === 200) {
                let danMai = res.data.data.list.filter(item => item.selltype === '0')
                let pinTuan = res.data.data.list.filter(item => item.selltype === '1' || item.selltype === '4')
                if (className === 'pt') {
                    this.setState({
                        ptac: true,
                        dmac: false,
                        allGoodsList: res.data.data.list,
                        saleGoodsImg: res.data.data.list[0].gimg,
                        danMai,
                        pinTuan,
                    }, () => {
                        this.refs.scrollTuan.BScroll.refresh()
                        this.refs.scrollDan.BScroll.refresh()
                    })
                } else {
                    this.setState({
                        ptac: false,
                        dmac: true,
                        allGoodsList: res.data.data.list,
                        saleGoodsImg: res.data.data.list[0].gimg,
                        danMai,
                        pinTuan,
                    }, () => {
                        this.refs.scrollTuan.BScroll.refresh()
                        this.refs.scrollDan.BScroll.refresh()
                    })
                }
            }
        })
    }

    shopingBag() {
        this.setState({
            bagShow: !this.state.bagShow,
            network: !this.state.network
        }, () => {
            this.refs.scrollTuan.BScroll.refresh()
            this.refs.scrollDan.BScroll.refresh()
        })
    }
}

const ShopingGoodsStyle = styled.div`

.live-button-cart {
    position: absolute;
    bottom: .64rem;
    left: 50%;
    transform: translate(-50%, 0);
    width: 5.41rem;
    height: .95rem;
    background-color: var(--common-font-color);
    opacity: .8;    
    border-radius: .47rem;
    color: #fff;
}

.shopCart{
  z-index: 55;
  position: absolute;
  left: 7.63rem;
  bottom:7rem;
  width: 2.33rem;
  height: 2.33rem;
}

.shopCart>img{
  width: 100%;
  height: 100%;
}
.shopCart>p{
  color: white;
  font-size: .29rem;
  font-weight: 500;
  position: absolute;
  top: 1.15rem;
  left: .9rem;
}



//购物带
.bagSaleModal{
  position: fixed;
  height: 9.84rem;
  z-index: 1000;
  bottom: env(safe-area-inset-bottom);
}

.bagSaleModal>div{
  display: flex;
  flex-direction: column;
}

.bagSaleModal>div>span{
  color: white;
  margin-left: .36rem;
  width:3.59rem;
  height:0.39rem;
  font-size:0.4rem;
  font-weight:800;
  margin-bottom: .2rem;
}
.bagContent {
  position: relative;
  z-index: 55;
  width: 100vw;
  height: 9.74rem;
  color: white;
  border-radius: .4rem;
  background-color: white;
}


.bagTopTab{
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;
    background:rgba(255,227,226,1);
    color:black;
}

.bagTopTab>span{
    padding-top: .2rem;
    font-size:0.32rem;
    width:50%;
    display: block;
    height:0.92rem;

}

.dmac{
    color: white;
    background:rgba(235,84,77,1);
    border-top-left-radius: .6rem;
}

.ptac{
    color: white;
    background:rgba(235,84,77,1);
    border-top-right-radius: .6rem;
}

.livemask{
    position: fixed;
    top: 0;
    z-index: 99;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0);
}


.nowSaleGoods{
  z-index:100;
  color:white;
  background-color: rgba(0,0,0,0);
  position: fixed;
  bottom:4rem;
  right: .23rem;
  width: 2rem;
}
.onShowGoods>img{
  border-radius:.2rem;
  width: 1.6rem;
  height: 1.6rem;
}

.onShowGoods>p{
    font-size:.28rem;
}

.onShowGoods{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


//
// .nowSaleModal{
//   position: absolute;
//   left: 0rem;
//   height: 9.84rem;
//   z-index: 200;
//   top:7rem;
// }
//
// .nowSaleModal>div{
//   display: flex;
//   flex-direction: column;
// }
//
// .nowSaleModal>div>span{
//   color: white;
//   margin-left: .36rem;
//   width:2.59rem;
//   height:0.39rem;
//   font-size:0.4rem;
//   font-weight:800;
//   margin-bottom: .2rem;
// }


.modalContent{
  width: 100vw;
  height: 9.74rem;
  color: white;
  border-radius: .4rem;
  background-color: white;
  overflow: auto;
}

.shopinggoods{
    -webkit-overflow-scrolling: touch;
}

`

export default withRouter(ShopingGoods)