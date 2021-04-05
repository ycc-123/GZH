import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import styled from 'styled-components'
import { _getOrderDetail } from 'network/order'


import { store } from "store/index";
import GoodsItem from './childCom/DetailGoodsItem'
import { GoodsItemStyle } from '../childCom/GoodsItem'
import { Toast } from "antd-mobile";
import ZitiHexiao from "views/heixiao/Hexiao";
import BetterScroll from 'common/betterScroll/BetterScroll'
import DaoDianTuiHuo from "views/heixiao/DaoDianTuiHuo";

const wx = window.wx

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {},
      goodsInfo: [],
      showService: false,
      isShowBtn: true,
      kefuImg: 'https://dev.huodiesoft.com/addons/lexiangpingou/app/resource/images/icon/weixinCode.gif'
    }

    this.zitiIsShow = false
    this.tuihuoShow = false
    const { uniacid } = store.getState().appConfig
    const { openid } = store.getState().appConfig.wxUserInfo
    this.btn = this.state.orderDetail.btn
    this.networkConfig = {
      getKeFuImg: {
        action: "kefuImg",
        data: {
          uniacid: uniacid
        }
      },
      received: {
        action: "receipt",
        data: {
          uniacid,
          openid,
          orderno: ''
        }
      },
      orderDetail: {
        action: 'orderDetail',
        data: {
          uniacid,
          id: '',
          orderno: ''
        }
      },
      getjsapiticket: {
        action: 'getjsapiticket',
        data: {
          uniacid,
          url: window.location.href
        }
      },
      hexiaoDetail: {
        action: 'hexiaoDetail',
        data: {
          uniacid,

        }
      }
    }
  }


  render() {
    document.title = "订单详情";
    //0待付款 1已付款 2待收货 3已签收 4已退款 5没用上 6部分退款 7已退款(现在在用) 8待发货 9已取消 10待退款 11退款异常 12不能退款
    const { orderDetail, time, isShowBtn } = this.state
    // console.log(orderDetail)
    const { isApplet } = store.getState().appConfig
    const isShowService = this.state.showService ? 'block' : 'none'

    const scrollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc((100vh - 1.3rem) - env(safe-area-inset-bottom))',
    }
    console.log(orderDetail)
    return (
      <OrderDetailStyle>
        {orderDetail.btn &&
          <BetterScroll style={scrollStyle} config={scrollConfig} ref="scroll">
            <div className="orderDetail">
              <div className="detailGoodsStatus">
                <div>
                  <p className="statusText">{orderDetail.statusname}</p>
                  <p className="statusAction">
                    {
                      (orderDetail.status === '0') && <span>剩{time}自动关闭订单</span>
                    }
                    {
                      (orderDetail.status === '8') && <span>买家已付款，等待卖家发货</span>
                    }
                    {
                      (orderDetail.status === '2') && <span>剩{time}自动确认收货</span>
                    }
                    {
                      (orderDetail.status === '1') && <span>拼团成功后等待商家发货</span>
                    }
                    {
                      (orderDetail.status === '9') && <span>买家已取消订单</span>
                    }
                    {
                      (orderDetail.status === '3') && <span>已完成交易</span>
                    }
                  </p>
                </div>
              </div>
              <div className="orderDetailGoods">
                {
                  this.state.goodsInfo && this.state.goodsInfo.map((item, key) => {
                    return (
                      <GoodsItem goodsInfo={item} key={item.id + key} />
                    )
                  })
                }
                {
                  (orderDetail.selltype === '1' || orderDetail.selltype === '4' || orderDetail.selltype === '6' || orderDetail.selltype === '7') && <GoodsItemStyle>
                    <li className="goodsItem">
                      <div className="goodsImgs">
                        <img src={orderDetail.gimg} alt="" className="goodsImg" />
                      </div>
                      <div className="goodsInfo">
                        <p className="d-goods-title">{orderDetail.goodsname}</p>
                        <p className="goodsPrice" style={{ color: '#ccc', marginTop: '.2rem' }}>
                          <span className="price">￥{orderDetail.oprice}</span>
                          <span className="goodsNum">x{orderDetail.gnum}</span>
                        </p>
                        <p className="option goodsTextColor">
                          规格：{orderDetail.optionname ? orderDetail.optionname : '无'}
                        </p>
                      </div>
                    </li>
                  </GoodsItemStyle>
                }
              </div>

              {
                orderDetail.address && <div className="orderDetailAddress">
                  <div>
                    <p className="addressTop">
                      <img src='https://res.lexiangpingou.cn/images/vip/orderdw.png' alt="" />
                      <span>收货地址</span>
                    </p>
                    <p className="addressName"> {orderDetail.addname} <span
                      className="addressPhone">{orderDetail.mobile}</span></p>
                    <p className="addressInfo">{orderDetail.address}</p>
                  </div>
                </div>
              }

              {orderDetail.sendtime && <div className="orderDetailDeliveryTime">
                <p>配送时间</p>
                {orderDetail.senddate && <p>{orderDetail.senddate}</p>}
              </div>}
              <div className="orderDetailAmount">

                <div className='doog'>
                  <p>商品总额</p>
                  <p>￥{orderDetail.price}</p>

                </div>
                <div>
                  <p>运费</p>
                  <p>￥{orderDetail.freight}</p>

                </div>
                <div>
                  <p>优惠金额</p>
                  <p>￥{orderDetail.discount_fee ? orderDetail.discount_fee : '0'}</p>

                </div>
                <div>
                  <p>合计支付</p>
                  <p className="totalPrice">￥{orderDetail.realprice}</p>
                </div>

              </div>
              <div className="orderDetailOrderNumber">
                <div>
                  <p>订单编号 <span>{orderDetail.orderno}</span></p>
                  <p>下单时间 <span>{orderDetail.createtime}</span></p>
                  {orderDetail.status !== '9' && <p>支付方式 <span>{orderDetail.pay_type}</span></p>}
                  {orderDetail.delivery_time && <p>发货时间 <span>{orderDetail.delivery_time}</span></p>}
                  {orderDetail.gettime && <p>收货时间 <span>{orderDetail.gettime}</span></p>}
                </div>
              </div>



              <div className="mask" onClick={this.cusService} style={{ display: isShowService }}></div>
              <div style={{ display: isShowService }} className="cusService">

                <h3 style={{ textAlign: 'center', color: '#fff' }}>长按二维码联系客服</h3>
                <img src={this.state.kefuImg} alt="" />

              </div>
            </div>
          </BetterScroll>
        }
        <div id="zitihexiao" style={{ top: this.props.location.search === '' ? '100vh' : 0 }} className="zitihexiao">
          {orderDetail.btn && <ZitiHexiao close={this.verification} orderdetail={orderDetail} />}
        </div>

        <div id="daodiantuihuo" className="daodiantuihuo">
          {orderDetail.btn && <DaoDianTuiHuo close={this.daodiantuihuo} orderdetail={orderDetail} />}
        </div>

        {orderDetail.btn && isShowBtn && <div className="orderDetailOption">



          {
            orderDetail.btn.btn_courier === 1 && <div onClick={() => {
              window.location.href =
                `https://m.kuaidi100.com/index_all.html?type=${orderDetail.express}&postid=${orderDetail.expresssn}#input`
            }}>物流信息</div>
          }
          {
            orderDetail.btn.btn_cusService === 1 && <div onClick={this.cusService}>联系客服</div>
          }
          {
            orderDetail.btn.btn_goPay === 1 && <div style={{ color: 'var(--theme-font-color)', border: 'var(--theme-font-color) solid .027rem' }} onClick={() => { this.goPay(orderDetail) }}>去支付</div>
          }

          {
            orderDetail.btn.btn_navigation === 1 && <div onClick={this.navigation}>门店导航</div>
          }

          {
            orderDetail.btn.btn_notshow === 1 && <div>评价</div>
          }

          {
            orderDetail.btn.btn_received === 1 &&
            <div onClick={this.received.bind(this, orderDetail.orderno)}>确认收货</div>
          }

          {
            orderDetail.btn.btn_refundToStore === 1 && <div onClick={this.daodiantuihuo}>到店退货</div>
          }

          {
            orderDetail.btn.btn_tuanDetail === 1 && orderDetail.status !== '0' && <div onClick={() => {

              isApplet ? window.navigateToWebWiew(`#/group/${this.state.orderDetail.id}`) : this.props.history.push(`/group/${this.state.orderDetail.id}`)
            }}>团详情</div>
          }

          {
            orderDetail.btn.btn_verification === 1 && <div onClick={this.verification}>到店核销</div>
          }

          {
            orderDetail.btn.btn_goback === 1 && <div style={{ color: 'var(--theme-font-color)', border: 'var(--theme-font-color) solid .027rem' }} onClick={() => {
              this.props.history.push('/home')
            }}>返回首页</div>
          }
        </div>}

      </OrderDetailStyle>
    );
  }

  async componentDidMount() {
    let { orderno, id } = this.props.match.params
    this.networkConfig.orderDetail.data.id = id
    this.networkConfig.orderDetail.data.orderno = orderno
    console.log(this.props)
    _getOrderDetail(this.networkConfig.orderDetail).then(res => {
      if (res.data.status === 200) {
        let orderDetail = res.data.data
        let countdown = parseInt(new Date(orderDetail.createtime.replace(/-/g, '/')).getTime() / 1000) + 86400 - parseInt(new Date().getTime() / 1000)
        let h = parseInt(countdown / 3600)
        let m = parseInt(countdown / 60 % 60)
        let s = parseInt(countdown % 60)
        this.setState({
          orderDetail,
          goodsInfo: orderDetail.goods,
          countdown,
          time: `${h}:${m}:${s}`
        }, () => {
          this.timer = setInterval(() => {
            this.changeTime()
          }, 1000);

          this.refs.scroll.BScroll.refresh()
          if (orderDetail.dispatchtype === "3") {

          }
        })
      } else if (res.data.status === 400) {
        Toast.fail(res.data.msg)
      }
    })


    let that = this

    let origin = window.location.origin
    let pathname = window.location.pathname
    let search = window.location.search
    let hash = `#/home`
    this.link = origin + pathname + search + hash
    wx.ready(() => {
      // 新版
      wx.updateAppMessageShareData({
        title: '',
        link: that.link,
        imgUrl: '',
        desc: '',
        success: function () {
        },
        fail: function (err) {
          Toast.info(err)
        }
      })
      wx.updateTimelineShareData({
        title: '',
        link: that.link,
        imgUrl: '',
        success: function () {
        },
        fail: function (err) {
          Toast.info(err)
        }
      })
    })
  }

  changeTime = () => {
    let { countdown } = this.state
    countdown -= 1
    let h = parseInt(countdown / 3600)
    let m = parseInt(countdown / 60 % 60)
    let s = parseInt(countdown % 60)
    this.setState({
      time: `${h}:${m}:${s}`,
      countdown
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.timer)
  }

  goPay = order => {
    if (order.tuan_id === '0') {
      this.props.history.replace(`/pay/1/${order.orderno}/${order.id}`)
    } else {
      this.props.history.replace(`/pay/2/${order.orderno}/${order.id}`)
    }

  }




  daodiantuihuo = () => {
    this.tuihuoShow = !this.tuihuoShow
    let windowH = document.documentElement.clientHeight
    let flag = this.tuihuoShow ? '0' : `${windowH}px`
    let el = document.getElementById('daodiantuihuo')
    el.style.top = flag
  }

  verification = () => {
    this.zitiIsShow = !this.zitiIsShow
    let windowH = document.documentElement.clientHeight
    let flag = this.zitiIsShow ? '0' : `${windowH}px`
    let el = document.getElementById('zitihexiao')
    el.style.top = flag
    this.setState({
      isShowBtn: !this.state.isShowBtn
    })
  }

  navigation = () => {
    let { sto } = this.state.orderDetail
    wx.openLocation({
      latitude: parseFloat(sto.lat), // 纬度，浮点数，范围为90 ~ -90
      longitude: parseFloat(sto.lng), // 经度，浮点数，范围为180 ~ -180。
      name: sto.storename, // 位置名
      address: sto.address, // 地址详情说明
      scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl: window.location.href.split('#')[0] // 在查看位置界面底部显示的超链接,可点击跳转
    })
  }
  received = async (orderno, e) => {
    this.networkConfig.received.data.orderno = orderno
    let Res = await _getOrderDetail(this.networkConfig.received)
    Toast.success(Res.data.msg, 2)
    if (Res.data.status === 200) {
      window.location.reload();
    }
  }
  cusService = async () => {
    let Res = await _getOrderDetail(this.networkConfig.getKeFuImg)
    this.setState({
      showService: !this.state.showService,
      kefuImg: Res.data.data
    })
  }
}

const OrderDetailStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);

.orderDetail{
  padding: 0 .32rem;
  margin-top: .2rem;
  color: #474747;
}
.detailGoodsStatus{
  height: 1.6266rem;
  background-color: white;
  border-radius: .133rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center; 
}

.detailGoodsStatus>div{
  padding: 0 .42rem;
}

.statusText{
  color: var(--theme-font-color);
  font-weight: bold;
  font-size: .4rem;

}

.statusAction{

}

/* --------- */

.orderDetailGoods{
//   height:2.84rem;
  background-color: white;
  border-radius: .133rem;
  margin-top: .2rem; 
}

/* -------- */

.orderDetailAddress{
  background-color: white;
  border-radius: .133rem;
  margin-top: .2rem; 
}

.orderDetailAddress>div{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: .2rem .42rem;
}

.orderDetailAddress>div>p{
  line-height: .5rem;
}
.addressTop{
  display:flex;
  padding-top: .18rem;
  font-weight: bold;
}
.addressTop>img{

    padding-right: .27rem;
}

.addressInfo{
    padding-top:.03rem;
  font-weight: lighter;
}


/* ------- */
.orderDetailDeliveryTime{
  background-color: white;
  border-radius: .133rem;
  margin-top: .2rem; 
  height: 1.11rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.orderDetailDeliveryTime>p{
    padding: 0 .42rem;

}


/* ------- */

.orderDetailAmount {
  padding: .4rem;
  background-color: white;
  border-radius: .133rem;
  margin-top: .2rem; 
}
.orderDetailAmount>div{
  /* width: 100%; */
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  justify-content: space-between;
  margin-bottom: .4rem;
}

.orderDetailAmount>div>p{
  
}

.orderDetailAmount>div:last-child {
    margin-bottom: 0;
}

.totalPrice{
  font-size: .4rem;
  color: var(--theme-font-color);
  /* 212735 */
}

/* ---------- */
.orderDetailOrderNumber{
  padding: .4rem;
  background-color: white;
  border-radius: .13rem;
  margin-top: .2rem;
  display: flex;
  flex-direction: row; 
}

.orderDetailOrderNumber>div{
  display: flex;
  flex-direction: column;
}

.orderDetailOrderNumber>div>p>span{
    padding-left:.42rem;
}

.orderDetailOrderNumber>div>p{
  margin-bottom: .4rem;
}

.orderDetailOrderNumber>div>p:last-child{
  margin-bottom: 0;
}

.orderDetailOption{
  position: absolute;
  bottom: env(safe-area-inset-bottom);
  left: 0;
  width: 100vw;
  height: 1.3rem;
  background-color: white;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}

.orderDetailOption>div{
    margin-left:.15rem;
    margin-right:.15rem;
    width: 2rem;
    height: 0.77rem;
    line-height: .77rem;
    text-align: center;
    border-radius: 0.5rem;
    border: .027rem solid #474747 ;
}

.cusService{
    z-index:1000;
    position:absolute;
    width:5rem;
    height:5rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.cusService>img{
    width:100%;
    height:100%;
}

.mask{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5);
}

.cusContainer{
    display: absolute;
    top:50%;
    left:50%;  
}

.zitihexiao{
    position:absolute;
    width:100vw;
    left:0;
    z-index:10;
    background-color: #212735;
    transition: 0.9s all;

}

.daodiantuihuo{
    position:absolute;
    top:30rem;
    height: 100vh;
    width:100vw;
    left:0;
    z-index:11;
    background-color: #212735;
    transition: 0.9s all;
}

.addressName{
    padding-top:.13rem;
}

`

export default withRouter(OrderDetail);