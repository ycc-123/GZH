import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { withRouter, Prompt } from 'react-router-dom'
import { dropByCacheKey } from 'react-router-cache-route'
import { Toast } from 'antd-mobile'

import BetterScroll from 'common/betterScroll/BetterScroll'


import { store } from 'store/index'
// import { claerH } from 'store/actionCreators'
import { _payApi, _payApiS } from 'network/pay'

import Modal from 'common/modal/Modal'

import '../order.css'

const wx = window.wx

const srollConfig = {
  probeType: 0,
}
const scrollStyle = {
  paddingTop: '.2rem',
  height: '8rem'
}

class PayWay extends Component {
  constructor(props) {
    super(props)
    this.isApplet = store.getState().appConfig.isApplet
    this.state = {
      defaultIndex: 0,
      way: [
        { id: 123123213123, name: '微信支付', src: 'https://res.lexiangpingou.cn/images/vip/wxpay.png', rate: this.props.data.wechatdiscountrate },
        { id: 12312321323, name: '会员支付', src: 'https://res.lexiangpingou.cn/images/vip/vippay.png', rate: this.props.data.memberdiscountrate }
      ],
      active: false,
      bottom: this.isApplet ? 'calc((.64rem) + env(safe-area-inset-bottom)) ' : '.64rem',
      price: this.props.data.wechatdiscountprice,
      show: false
    }
    this.scroll = createRef()
  }
  render() {
    const { defaultIndex, way, active, bottom, price, show } = this.state
    const { data } = this.props
    console.log(way)
    return (
      <PayWayStyle>
        <Prompt message={location => {
          if (location.pathname.startsWith('/paysuccess') || location.pathname.startsWith('/home') || location.pathname.startsWith('/group')) {
            return true
          } else {
            this.setState({
              active: true
            })
            return false
          }
        }} when={true} />
        {(data.dispatchtype === '2' || data.dispatchtype === '3') && <div className='mask' onClick={() => this.close()} style={{ display: show ? 'block' : 'none' }}></div>}
        <div className='info'>
          <p>支付总额</p>
          <p><span>&yen;</span>{data.pay_price}</p>
          <p><span>&yen;</span>{price}
            {this.state.way[defaultIndex].rate !== 10 && <label>(折扣后)</label>}
          </p>
          {(data.dispatchtype === '2' || data.dispatchtype === '3') && <p>
            <span className='text' style={{ width: data.goods ? data.goods[0].length >= 12 ? '4.3rem' : 'auto' : data.goodsname.length >= 12 ? '4.3rem' : 'auto' }} >{data.goods ? data.goods[0].goodsname : data.goodsname}</span>

            <span className='go' onClick={() => this.close()}>订单详情</span>
          </p>}
          {(data.dispatchtype === '2' || data.dispatchtype === '3') && <Modal>
            <div className='pay-order-info' style={{ display: show ? 'block' : 'none' }}>
              <p className='pay-order-title'>
                <span>订单详情</span>
                <img onClick={() => this.close()} alt='' className='pay-order-title-img' src='https://res.lexiangpingou.cn/images/vip/chacha.png' />
              </p>
              <BetterScroll style={scrollStyle} config={srollConfig} ref={this.scroll}>
                <div className='pay-order-info-content'>
                  <ul>
                    <li className='pay-order-info-li'>
                      <p>{data.dispatchtype === '2' ? '收货地址' : '门店地址'}</p>
                      <p>{data.dispatchtype === '2' ? data.address : data.sto.address}</p>
                      <p>{data.dispatchtype === '2' ? `${data.addname} ${data.mobile}` : `${data.sto.storename} ${data.sto.tel}`}</p>
                    </li>
                    {
                      data.goods && data.goods.map(item => {
                        return (
                          <li className='pay-order-info-li' key={item.id}>
                            <p>{item.goodsname}</p>
                            <p className='clearfix'>
                              <span style={{ float: 'left' }}>规格</span>
                              <span style={{ float: 'right' }}>{item.optionname ? item.optionname : '无'}</span>
                            </p>
                            <p className='clearfix'>
                              <span style={{ float: 'left' }}>数量</span>
                              <span style={{ float: 'right' }}>x{item.num}</span>
                            </p>
                          </li>
                        )
                      })
                    }
                    {
                      !data.goods &&
                      <li className='pay-order-info-li'>
                        <p>{data.goodsname}</p>
                        <p className='clearfix'>
                          <span style={{ float: 'left' }}>规格</span>
                          <span style={{ float: 'right' }}>{data.optionname ? data.optionname : '无'}</span>
                        </p>
                        <p className='clearfix'>
                          <span style={{ float: 'left' }}>数量</span>
                          <span style={{ float: 'right' }}>x{data.gnum}</span>
                        </p>
                      </li>
                    }
                    <li className='pay-order-info-li'>
                      <p>优惠金额</p>
                      <p className='clearfix'>
                        <span style={{ float: 'left' }}>优惠券</span>
                        <span style={{ float: 'right' }}>&yen;{data.coupon_fee ? data.coupon_fee : '0.00'}</span>
                      </p>
                      <p className='clearfix'>
                        <span style={{ float: 'left' }}>其他折扣</span>
                        <span style={{ float: 'right' }}>-</span>
                      </p>
                    </li>
                    <li className='pay-order-info-li'>
                      <p>备注信息</p>
                      <p className='clearfix'>
                        {data.remark ? data.remark : '无'}
                      </p>
                    </li>
                  </ul>
                </div>
              </BetterScroll>

            </div>
          </Modal>}

        </div>
        <div className='mark' style={{ display: active ? 'block' : 'none' }}>
          <div className="tixingkuang">
            <img className="tixingimg" src='https://res.lexiangpingou.cn/images/vip/hdlogo.png' alt='' />
            <div className="tixingtext1">火蝶云提醒您</div>
            <div className="tixingtext2">您的订单已生成，但未支付成功，确定返回吗？</div>
            <div className="tixingbtnframe">
              <button className="tixingbtn1" onClick={this.goHome}>返回首页</button>
              <button className="tixingbtn2" onClick={this.changeActive}>继续支付</button>
            </div>
          </div>
        </div>
        {way.map((item, index) => {
          return (
            <div className='way' key={item.id + index} style={{ display: index === 1 && (data.selltype === '7' || data.selltype === '4') ? 'none' : 'flex' }} onClick={() => { this.select(index) }}>
              <img src={item.src} className='pay-icon' alt="" />
              <label>{item.name}</label>
              <label style={{ marginLeft: '.13rem', fontSize: '.32rem', color: 'var(--theme-font-color)' }}>{item.rate === 10 ? '' : item.rate + '折'}</label>
              {defaultIndex === index && <img src={store.getState().mallConfig.icons.select} alt="" className='select' />}
              {defaultIndex !== index && <span alt=""></span>}
            </div>
          )
        })}
        <div className='box' style={{ bottom }}>
          <button className='zhifu' onClick={this.pay}>
            确认支付
        </button>
        </div>
      </PayWayStyle>
    );
  }


  componentDidMount = () => {
    const icon = document.querySelector('.pay-icon')
    icon.style.width = `.6rem`
    icon.style.height = `.6rem`
  }

  goHome = () => {
    this.props.history.replace('/home')
  }

  close() {
    this.setState({ show: !this.state.show }, () => this.scroll.current.BScroll.refresh())
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer)
  }

  select = index => {
    let price
    const { data } = this.props
    if (index === 0) {
      price = data.wechatdiscountprice
    } else {
      price = data.memberdiscountprice
    }
    this.setState({
      defaultIndex: index,
      price
    })
  }

  pay = () => {
    const { defaultIndex, way, price } = this.state
    const { data, buytype } = this.props

    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo

    // 微信支付2.0
    // 单买
    let that = this


    if (buytype === '1') {
      if (defaultIndex === 0) {
        let isApplets = window.__wxjs_environment === 'miniprogram'
        const { uniacid } = store.getState().appConfig
        let baseUrl = window.location.origin + '/'
        if (isApplets === true) {
          const payParam = {
            total_fee: way[0].rate === 10 ? data.pay_price : price,
            uniacid,
            orderno: data.orderno,
            baseUrl,
            groupID: '',
            type: 'payGoods'
          }
          const check_config = {
            action: 'checkBeforeWxPay',
            data: {
              openid: wxUserInfo.openid,
              uniacid: appConfig.uniacid,
              orderno: data.orderno
            }
          }
          _payApi(check_config).then(res => {
            if (parseInt(res.data.status) === 200) {
              console.log(payParam, '跳转参数')
              window.navigateToMiniProgram(payParam)
            } else if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 1)
            }
          })


        } else if (isApplets === false) {
          const check_config = {
            action: 'checkBeforeWxPay',
            data: {
              openid: wxUserInfo.openid,
              uniacid: appConfig.uniacid,
              orderno: data.orderno
            }
          }

          _payApi(check_config).then(res => {
            if (parseInt(res.data.status) === 200) {
              const config = {
                action: 'goodspay',
                data: {
                  "uniacid": `${appConfig.uniacid}`,
                  "openid": `${wxUserInfo.openid}`,
                  "orderno": `${data.orderno}`,
                  "total_fee": `${data.pay_price}`
                }
              }
              _payApi(config).then(res => {
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
                      dropByCacheKey('SubmitComponent')
                      that.props.history.replace(`/paysuccess/${data.orderno}`)
                    },
                    fail: function (err) {
                    }
                  })
                })
              })
            } else if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 1)
            }
          })


        }
      } else {
        const config = {
          action: 'payByBalance',
          data: {
            uniacid: appConfig.uniacid,
            openid: wxUserInfo.openid,
            orderno: data.orderno
          }
        }
        dropByCacheKey('SubmitComponent')
        const member_config = {
          action: 'getMember',
          data: {
            openid: wxUserInfo.openid,
          }
        }
        _payApiS(member_config).then(res => {
          if (res.data.data.member_balance) {
            const { member_balance } = res.data.data
            if (Number(member_balance) * 100 - Number(data.pay_price) * 100 > 0) {
              _payApi(config).then(res => {
                dropByCacheKey('SubmitComponent')
                if (parseInt(res.data.status) === 200) {
                  Toast.info('支付成功', 1)
                  that.timer = setTimeout(() => {
                    that.props.history.replace(`/paysuccess/${data.orderno}`)
                  }, 1300)
                } else if (parseInt(res.data.status) === 400) {
                  Toast.info(res.data.msg, 1)
                }
              })
            } else {
              Toast.info('余额不足', 1)
            }
          }
        })

      }
    } else if (buytype === '2') { // 拼团
      if (defaultIndex === 0) {

        let isApplets = window.__wxjs_environment === 'miniprogram'
        const { uniacid } = store.getState().appConfig

        let baseUrl = window.location.origin + '/'

        // let baseUrl = localStorage.getItem('baseUrl')

        if (isApplets === true) {
          const payParam = {
            total_fee: way[0].rate === 10 ? data.pay_price : price,
            uniacid,
            orderno: data.orderno,
            baseUrl,
            groupID: data.id,
            type: 'payGoods'
          }

          const check_config = {
            action: 'checkBeforeWxPay',
            data: {
              openid: wxUserInfo.openid,
              uniacid: appConfig.uniacid,
              orderno: data.orderno
            }
          }

          _payApi(check_config).then(res => {
            if (parseInt(res.data.status) === 200) {
              console.log(payParam, '跳转参数')
              window.navigateToMiniProgram(payParam)
            } else if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 1)
            }
          })

        } else if (isApplets === false) {


          const check_config = {
            action: 'checkBeforeWxPay',
            data: {
              openid: wxUserInfo.openid,
              uniacid: appConfig.uniacid,
              orderno: data.orderno
            }
          }

          _payApi(check_config).then(res => {
            if (parseInt(res.data.status) === 200) {
              const config = {
                action: 'goodspay',
                data: {
                  "uniacid": `${appConfig.uniacid}`,
                  "openid": `${wxUserInfo.openid}`,
                  "orderno": `${data.orderno}`,
                  "total_fee": `${data.pay_price}`
                }
              }
              _payApi(config).then(res => {
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
                      dropByCacheKey('SubmitComponent')
                      that.props.history.replace(`/group/${data.tuan_id}`)
                    },
                    fail: function (err) {
                    }
                  })
                })
              })
            } else if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 1)
            }
          })




        }

      } else {
        const config = {
          action: 'payByBalance',
          data: {
            uniacid: appConfig.uniacid,
            openid: wxUserInfo.openid,
            orderno: data.orderno
          }
        }

        const member_config = {
          action: 'getMember',
          data: {
            openid: wxUserInfo.openid,
          }
        }
        _payApiS(member_config).then(res => {
          if (res.data.data.member_balance) {
            const { member_balance } = res.data.data
            const { isApplet } = store.getState().appConfig

            if (Number(member_balance) * 100 - Number(data.pay_price) * 100 > 0) {
              _payApi(config).then(res => {
                dropByCacheKey('SubmitComponent')
                if (parseInt(res.data.status) === 200) {
                  Toast.info('支付成功', 1)
                  that.timer = setTimeout(() => {
                    isApplet ? window.navigateToWebWiew(`#/group/${data.tuan_id}`) : that.props.history.replace(`/group/${data.tuan_id}`)
                  }, 1300)
                } else if (parseInt(res.data.status) === 400) {
                  Toast.info(res.data.msg, 1)
                }
              })
            } else {
              Toast.info('余额不足', 1)
            }
          }
        })
      }
    }
  }

  changeActive = () => {
    this.setState({
      active: false
    })
  }

}

const PayWayStyle = styled.div`

height: 100vh;
background-color: #fff;



.info {
  width: 100%;
  /* height: 4.59rem; */
  padding: .8rem 0;
}
.info p {
  text-align: center;
}

.info p:first-child {
  font-size: .32rem;
  color: var(--common-font-color);
  opacity: .5;
}

.info p:nth-child(2) {
  margin-top: .4rem;
  text-decoration: line-through;
  font-size: .4rem;
}

.info p:nth-child(3) {
  margin-top: .4rem;
  font-weight: bold;
  font-size: .96rem;
}

.info p:nth-child(3) span {
  font-size: .4rem;
}

.info p:nth-child(3) label {
  font-size: .32rem;
  color: var(--theme-font-color);
}



.info p:nth-child(4) {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.text {
  display: inline-block;
  width: 4.3rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: .32rem;
  opacity: .5;
}

.go {
  margin-left: .2rem;
  font-size: .32rem;
  opacity: .5;
}

.tixingkuang{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 75%;
  height: 4.8rem;
  background: white;
  border-radius: 0.2rem;
}
.tixingimg{
  position: absolute;
  top: -20%;
  left: 36.5%;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border:0.1rem solid white;
}
.tixingtext1{
  margin-top:1.2rem;
  font-size:0.4rem;
  font-weight:600;
  text-align:center;
}
.tixingtext2{
  margin-top: 0.4rem;;
  font-size: 0.32rem;
  text-align: center;
}
.tixingbtnframe{
  margin-top:0.8rem;
  width:100%;
  display:flex;
  justify-content:space-between;
}
.tixingbtn1{
  width:3.07rem;
  height:0.9rem;
  line-height:0.9rem;
  text-align:center;
  margin-left:0.4rem;
  border:0.01rem solid #CCC;
  border-radius:1rem;
  font-size:0.4rem;
}
.tixingbtn2{
  width:3.07rem;
  height:0.9rem;
  line-height:0.9rem;
  text-align:center;
  margin-right:0.4rem;
  border-radius:1rem;
  color:white;
  font-size:0.4rem;
  background:rgb(255,118,46);
}


.mark {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.5);
}

.way {
  position: relative;
  align-items: center;
  height: 1.17rem;
  font-size: .4rem;
  color: var(--common-font-color);
  line-height: 1.17rem;
  border-bottom: 1px solid #ccc;
}

.pay-icon {
  margin-left: .44rem;
  margin-right: .44rem;
  width: .53rem;
  height: .53rem;
}

.pay-icon:first-child {
  width: .53rem;
  height: .53rem;
}

.select {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: .4rem;
  width: .53rem;
  height: .53rem;
}

.way span {
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: .4rem;
  width: .53rem;
  height: .53rem;
  border: 1px solid #ccc;
  border-radius: 50%;
}

.box {
  position: absolute;
  width: 9.36rem;
  padding: 0 .31rem;
}

.zhifu {
  width: 100%;
  height: 1.15rem;
  font-size: .4rem;
  color: #fff;
  border-radius: .6rem;
  background: var(--theme-font-color)
}

`

export default withRouter(PayWay);