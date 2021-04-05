import React, { Component } from 'react';
import styled from 'styled-components'
import GoodsItem from './GoodsItem'
import { _orderAction } from 'network/order'
import { withRouter } from 'react-router-dom'
import { Toast } from "antd-mobile";
import { store } from 'store/index'
import DetailGoodsItem from "views/order/detail/childCom/DetailGoodsItem"

import { getUrlValue } from 'commons/utils'

const wx = window.wx


const OrderItemStyle = styled.div`
/* ------ */

.orderItem{
  color: var(--common-font-color);
  background-color: #fff;
  border-radius:.133rem;
  margin-top: .32rem;
  display:flex;
  flex-direction:column;
}

.orderStatus{
  height: 1.02666rem;
  border-bottom: solid rgba(0, 0, 0, 0.1) .027rem;
  display: flex;
  align-items: center;
}

.orderNo{
  color:#ccc;
  position:absolute;
  left: .5rem;
}
.orderNoTitle{
  color:var(--theme-font-color);
  font-size:.35rem;
  position:absolute;
  right: .5rem;
  font-weight: 600;
}

/* 商品详情块 */

.orderGoods{
  border-bottom: solid rgba(0, 0, 0, 0.1) .027rem;
  display:flex;
  flex-direction:column;
}
.orderTotalInfo{
  padding-bottom: .2rem;
}

.totalInfo{
  display: flex;
  flex-direction: row-reverse;
}
.totalInfo>span{
  margin-right:.25rem;
}
.realPayment{
    
    padding-right:.25rem;
    padding-top:.26rem;
    font-size: .35rem;
//  font-weight: bold;
}
.totalFee{
    padding-top:.3rem;
    color:#c3c3c3;
}
.dicount{
    padding-top:.3rem;
    color:#c3c3c3;
}
`


class OrderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {}


    const { appConfig } = store.getState()
    const { uniacid } = appConfig
    const { wxUserInfo } = appConfig
    const { openid } = wxUserInfo
    this.networkConfig = {
      cancelOrder: {
        action: 'cancelOrder',
        data: {
          orderno: ''
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
    }
  }

  render() {

    const { item } = this.props
    const { isIOS } = store.getState().appConfig
    /**
     * 
     * time: 2020-12-29
     * author: lkd
     * content: 自助核销按钮对接
     * @param {item} 订单信息
     * @param {item.status} 订单状态  0待付款 1已付款 2待收货 3已签收 4已退款 5没用上 6部分退款 7已退款(现在在用) 8待发货 9已取消 10待退款 11退款异常 12不能退款
     * 
     * */

    return (
      <OrderItemStyle>
        <div className="orderItem">
          <div className="orderStatus">
            <p className="orderNo">订单号 {item.status === '0' && item.orderno.replace((item.orderno.substr(item.orderno.length - 4)), '****')}
              {item.status !== '0' && item.orderno}
            </p>
            <p className="orderNoTitle">{item.statusname}</p>
          </div>

          <div className="orderGoods">

            <ul>
              {
                //单买
                item.goods && item.goods.map((item, key) => {
                  return (
                    <GoodsItem orderDetail={this.seeOrderDetail} goodsInfo={item} key={key + item.id} />
                  )
                })
              }
              {
                // 拼团
                !item.goods && <DetailGoodsItem orderDetail={this.seeOrderDetail} goodsInfo={item} />
              }
            </ul>

            <div className="orderTotalInfo">
              <div className="totalInfo">
                {item.status !== '0' && <span className="realPayment">
                  实付款￥{item.realprice}
                </span>}
                {item.selltype === '4' && (item.status === '2' || item.status === '3' || item.status === '8' || item.status === '10') && <span className="totalFee">退款{item.refund}</span>}
                <span className="dicount">优惠￥{item.discount_fee ? item.discount_fee : '0.00'}</span>
                <span className="totalFee">  总价{item.price}</span>


              </div>

            </div>

          </div>

          <div className="orderOption">

            {
              item.status === '2' && <button style={{ color: 'var(--theme-font-color)', border: 'var(--theme-font-color) solid .027rem', lineHeight: isIOS ? '.69rem' : '' }}
                className="orderOpBtn" onClick={this.received}>确认收货</button>
            }

            {
              item.status !== '9' && <button className="orderOpBtn" style={{ lineHeight: isIOS ? '.69rem' : '' }} onClick={this.seeOrderDetail}>订单详情</button>
            }

            {
              (item.is_tuan === '1' && item.status !== '0' && item.status !== '9') && <button className="orderOpBtn" style={{ lineHeight: isIOS ? '.69rem' : '' }} onClick={this.goGroup}>团详情</button>
            }


            {/* {
              item.status === '3' && <button className="orderOpBtn" onClick={() => { this.props.history.push(`/sale/${item.orderno}`) }}>申请售后</button>
            } */}

            {
              ((item.service === '1' && item.servestype === '0') || (item.service === '1' && item.servestype >= '1')) &&
              <button className="orderOpBtn" style={{ lineHeight: isIOS ? '.69rem' : '' }} onClick={() => { this.jumpSale(item) }}>
                {(item.service === '1' && item.servestype === '2') || (item.service === '1' && item.servestype === '3') || (item.service === '1' && item.servestype === '1') ? '售后详情' : '申请售后'}
              </button>
            }

            {
              item.status === '0' && <button className="orderOpBtn" style={{ lineHeight: isIOS ? '.69rem' : '' }} onClick={this.cancelOrder}>取消订单</button>
            }

            {
              item.status === '0' && <button className="orderOpBtn" onClick={this.goPay} style={{ color: 'var(--theme-font-color)', border: 'var(--theme-font-color) solid .027rem', lineHeight: isIOS ? '.69rem' : '' }} >去支付</button>
            }

            {
              item.bukuanstatus === '1' && item.selltype === '7' && <button className="orderOpBtn" onClick={() => this.goPayment(item)} style={{ color: 'var(--theme-font-color)', border: 'var(--theme-font-color) solid .027rem', lineHeight: isIOS ? '.69rem' : '' }} >补交尾款</button>
            }

            {
              item.status === '9' && <button className="orderOpBtn" style={{ lineHeight: isIOS ? '.69rem' : '' }} >订单已取消</button>
            }

            {
              (item.status === '2' || item.status === '5' || item.status === '8') && item.dispatchtype === '3' && !(item.selltype === '5' && item.issued === '0') && < button className="orderOpBtn" style={{ lineHeight: isIOS ? '.69rem' : '' }} onClick={() => this.wxScan()}>自助核销</button>
            }

            {/*{*/}
            {/*    item.status === '3' && <button className="orderOpBtn" onClick={this.evaluate}>去评价</button>*/}
            {/*}*/}

            {/*{*/}
            {/*    item.statusname === '到店自提' && <button className="orderOpBtn">核销</button>*/}
            {/*}*/}

          </div>
        </div>
      </OrderItemStyle >

    )
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props)
  }

  goPayment(item) {
    const { isApplet } = store.getState().appConfig
    isApplet ? wx.navigateToWebWiew(`#/payment/${item.orderno}/0`) : this.props.history.push(`/payment/${item.orderno}/0`)
  }

  jumpSale(item) {
    const { service, servestype, feedtype } = item
    const { isApplet } = store.getState().appConfig
    if (service === '1' && servestype === '0' && !feedtype) {
      isApplet ? wx.navigateToWebWiew(`#/sale/${item.orderno}`) : this.props.history.push(`/sale/${item.orderno}`)
    } else if ((service === '1' && servestype === '1') || (service === '1' && servestype === '2') || (service === '1' && servestype === '3') || feedtype) {
      isApplet ? wx.navigateToWebWiew(`#/sale/detail/${item.id}`) : this.props.history.push(`/sale/detail/${item.id}`)
    }
  }

  wxScan() {
    const wx = window.wx
    const { orderno } = this.props.item
    let that = this
    wx.ready(() => {
      wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode", "barCode"],
        success: function (res) {
          let result = res.resultStr
          let openid = getUrlValue(result, 'openid')
          let storeid = getUrlValue(result, 'storeid')
          if (openid && storeid) {
            that.props.history.push({ pathname: `/zitihexiao/${orderno}`, search: `oid=${openid}&sid=${storeid}` })
          } else {
            let sIndex = result.lastIndexOf('\/')
            let oIndex = result.substring(0, sIndex).lastIndexOf('\/')
            let storeid = result.substring(sIndex + 1, result.length)
            let openid = result.substring(oIndex + 1, sIndex)
            that.props.history.push({ pathname: `/zitihexiao/${orderno}`, search: `oid=${openid}&sid=${storeid}` })
          }
        }
      })
    })
  }


  received = async () => {
    this.networkConfig.received.data.orderno = this.props.item.orderno
    let Res = await _orderAction(this.networkConfig.received)
    Toast.success(Res.data.msg, 2)
    if (Res.data.status === 200) {
      window.location.reload();
    }
  }

  goPay = () => {
    let buytype = null
    if (Number(this.props.item.g_id) > 0) {
      if (this.props.item.is_tuan === "0") {
        buytype = 1
      } else {
        buytype = 2
      }
    } else {
      buytype = 1
    }

    this.props.isApplet ? window.navigateToWebWiew(`#/pay/${buytype}/${this.props.item.orderno}/${this.props.item.id}`) :
      this.props.history.push(`/pay/${buytype}/${this.props.item.orderno}/${this.props.item.id}`)

  }

  seeOrderDetail = () => {
    if (this.props.isApplet) {
      window.navigateToWebWiew(`#/order/detail/${this.props.item.orderno}/${this.props.item.id}`)
    } else {
      this.props.history.push(`/order/detail/${this.props.item.orderno}/${this.props.item.id}`)
    }
  }

  evaluate = () => {

    if (this.props.isApplet) {
      window.navigateToWebWiew(`#/order/evaluate/${this.props.item.orderno}/${this.props.item.id}`)
    } else {
      this.props.history.push(`/order/evaluate/${this.props.item.orderno}/${this.props.item.id}`)
    }
  }

  cancelOrder = async () => {
    this.networkConfig.cancelOrder.data.orderno = this.props.item.orderno
    let cancelRes = await _orderAction(this.networkConfig.cancelOrder)
    if (cancelRes.data.status === 200) {
      Toast.success(cancelRes.data.msg, 2)
      this.props.cancelOrderList(this.props.index)
    } else {
      Toast.fail(cancelRes.data.msg, 2)
    }
  }
  goGroup = () => {
    if (this.props.isApplet) {
      window.navigateToWebWiew(`#/group/${this.props.item.tuan_id}`)
    } else {
      this.props.history.push(`/group/${this.props.item.tuan_id}`)
    }
  }
}

export default withRouter(OrderItem);