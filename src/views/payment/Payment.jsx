import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'
import QRCode from 'qrcode.react';

import { store } from 'store/index'

import { _api } from 'network/api'

const wx = window.wx


class Payment extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      wayIndex: '',
      groupInfo: {},
      payWay: [
        { id: 123, content: '微信支付', src: 'https://res.lexiangpingou.cn/images/vip/select1.png', img: 'https://res.lexiangpingou.cn/images/vip/20201127/mapay.png' },
        { id: 124, content: '到店补款', src: 'https://res.lexiangpingou.cn/images/vip/select1.png', img: 'https://res.lexiangpingou.cn/images/vip/20201127/mapay.png' },

      ],
      showQRCode: false,
      url: ''
    }
  }
  render() {
    const { wayIndex, groupInfo, payWay, showQRCode, url } = this.state
    console.log(this.props.match.params.price)
    return (
      <PaymentStyle>
        <div className='p-header'>
          <p className='p-p'>团单号：{groupInfo.tuan_id}</p>
          <img className='p-img' src='https://res.lexiangpingou.cn/images/vip/20201127/payment.png' alt='' />
        </div>

        <div className='p-info'>
          <p>
            <span>订单编号</span>
            <span>{groupInfo.orderno}</span>
          </p>
          <p>
            <span>商品名称</span>
            <span>{groupInfo.goodsname}</span>
          </p>
          <p>
            <span>补款金额</span>
            <span style={{ fontSize: '.4rem', color: 'var(--theme-font-color)', opacity: '1' }}>&yen;{this.props.match.params.price === '0' ? groupInfo.supplementprice : this.props.match.params.price}</span>
          </p>
        </div>
        <div className='p-way'>
          <p style={{ fontSize: '.4rem', fontWeight: 'bold', color: '#474747' }}>支付方式</p>
          {payWay.map((item, index) => {
            return (
              <button key={item.id} onClick={() => this.changeIndex(index)} style={{ display: (this.props.match.params.price !== '0' && index === 1) ? 'none' : 'flex' }}>
                <img src={item.img} alt='' />
                {item.content}
                {wayIndex === index && <img src='https://res.lexiangpingou.cn/images/vip/select1.png' alt="" />}
                {wayIndex !== index && <span alt=""></span>}
              </button>
            )
          })}
        </div>
        {showQRCode && <div className='qr'>
          <QRCode value={url} size={200} fgColor="#000000" />
          <div style={{ color: '#fff', textAlign: 'center', marginTop: '.5rem' }}>请将本二维码出示给核销员</div>
        </div>}
        {showQRCode && <div className='mask' onClick={() => this.hiddenMask()}></div>}



      </PaymentStyle>
    )
  }

  componentDidMount() {
    const { appConfig } = store.getState()
    const config = {
      action: 'viewSupplement',
      data: {
        master_orderno: this.props.match.params.orderno,
        uniacid: appConfig.uniacid
      }
    }

    _api(config).then(res => {
      if (res.data.status === 200) {
        this.setState({
          groupInfo: res.data.data
        })
      } else if (res.data.status === 400) {
        Toast.info(res.data.msg)
      }
    })
  }

  hiddenMask() {
    this.setState({
      showQRCode: !this.state.showQRCode,
    })
  }

  changeIndex(index) {
    let that = this
    const { orderno, price } = this.props.match.params
    this.setState({
      wayIndex: index
    }, () => {
      if (index === 1) {
        let origin, pathname, search, hash, url
        origin = window.location.origin
        pathname = window.location.pathname
        search = window.location.search
        hash = `#/zitihexiao/${orderno}`
        url = origin + pathname + search + hash
        this.setState({
          showQRCode: !this.state.showQRCode,
          url
        })
      } else {
        const { appConfig } = store.getState()
        let config
        if (price === '0') {
          config = {
            action: 'orderSupplement',
            data: {
              master_orderno: orderno,
              uniacid: appConfig.uniacid,
              openid: appConfig.wxUserInfo.openid,
              total_fee: this.state.groupInfo.supplementprice,
              type: 1,
            }
          }
        } else {
          config = {
            action: 'orderSupplement',
            data: {
              master_orderno: orderno,
              uniacid: appConfig.uniacid,
              openid: appConfig.wxUserInfo.openid,
              modifyprice: price,
              type: 1,
            }
          }
        }


        _api(config).then(res => {
          if (res.data.status === 200) {
            const { appId, nonceStr, paySign, signType, timeStamp } = res.data.data
            let wxPackage = res.data.data.package
            wx.ready(function () {
              wx.chooseWXPay({
                appId,
                nonceStr,
                package: wxPackage,
                signType,
                paySign,
                timestamp: timeStamp,
                success: function (res) {
                  that.props.history.replace('/home')
                },
                fail: function (err) {
                }
              })
            })
          }
        })
      }
    })
  }

}

const PaymentStyle = styled.div`

background-color: #fff;
height: calc(100vh - 0px);

.mask {
  background-color: rgba(0, 0, 0, .5);
}

.qr {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10000;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
}

.p-way {
  margin-top: .8rem;
  padding: 0 .26rem;
}

.p-way button {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: .4rem;
  width: 100%;
  height: 1.17rem;
  border: 1px solid var(--theme-font-color);
  border-radius: 1rem;
  font-size: .4rem;
  font-weight: bold;
  color: var(--theme-font-color);
}

.p-way button img:first-child {
  margin-left: .84rem;
  margin-right: .4rem;
  width: .4rem;
  height: .4rem;
}

.p-way button img:last-child {
  position: absolute;
  top: 50%;
  right: .4rem;
  transform: translate(0, -50%);
  width: .4rem;
  height: .4rem;
  border-radius: 50%;
}

.p-way button:last-child img:first-child{
  width: .48rem;
  height: .45rem;
}

.p-way button span {
  position: absolute;
  top: 50%;
  right: .4rem;
  transform: translate(0, -50%);
  width: .4rem;
  height: .4rem;
  border: 1px solid rgba(204, 204, 204, .5);
  border-radius: 50%;
}

.p-p {
  position: absolute;
  top: .8rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 2;
  color: #fff;
  font-size: .48rem;
}

.p-header {
  width: 100%;
  height: 3.56rem;
}

.p-img {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 3.56rem;
}

.p-info {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  margin-left: .26rem;
  margin-top: -1.4rem;
  width: 9.48rem;
  height: 2.56rem;
  border-radius: .13rem;
  background-color: #FFF;
  box-shadow:  0px 0px 3px #ccc inset, 0px 2px 3px #ccc;
}

.p-info p {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  width: 100%;
  padding: 0 .4rem;
}

.p-info p span {
  font-size: .32rem;
  font-weight: bold;
  color: #474747;
}

.p-info p span:last-child {
  opacity: .5;
}


`


export default withRouter(Payment);