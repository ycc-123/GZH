import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import { getQueryString } from 'commons/AuthFunction'
import { store } from 'store/index'


import { _api } from 'network/api'

import { Toast } from 'antd-mobile'

class CouponTake extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }
  render() {
    const { data } = this.state
    let text
    if (data.coupon && data.coupon.range_type === '1') {
      text = '仅限活动商品使用'
    } else if (data.coupon && data.coupon.range_type === '2') {
      text = '全场通用'
    } else {
      text = ''
    }
    return (
      <CouponTakeStyle>
        {data.coupon && <Fragment>
          <div className='coupon-take' style={{ height: data.status === 1 ? '13.84rem' : '11.2rem' }}>
            <div className='head'/*  style={{ paddingTop: data.status === 1 ? '0' : '1.3rem' }} */>
              <p className='amount'><span>￥</span>{data.coupon ? data.coupon.value : ''}</p>
              <p className='jifen'>{data.coupon ? data.coupon.name : ''}</p>
              <p className='desc'>{text}</p>
              <p className='time'>{data.coupon ? `${data.coupon.start_time} ~ ${data.coupon.end_time} ` : ''}</p>
            </div>
            <div className='foot' style={{ height: data.status === 1 ? '7.7rem' : '5.05rem' }}>
              <p className='s'>使用说明</p>
              <p className='d'>{data.coupon ? data.coupon.description : ''}</p>
              <button ref='btn' className='coupon' onClick={this.btnClick}>领取优惠券</button>
              {data.status === 1 && <input className='input input-name' type="text" placeholder='请输入您的姓名' />}
              {data.status === 1 && <input className='input input-tel' type="text" placeholder='请输入您的手机号' maxLength='11' minLength='11' />}
            </div>
          </div>
          {data.status === 1 ? <img className='bg1' src='https://res.lexiangpingou.cn/images/vip/coupontake1.png' alt="" />
            : <img className='bg' src='https://res.lexiangpingou.cn/images/vip/coupontake.png' alt="" />}
        </Fragment>
        }
      </CouponTakeStyle>
    )
  }

  btnClick = () => {
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    const { data } = this.state
    let cpcode = getQueryString('cpcode')
    let cpid = getQueryString('cpid')
    let reg = /^[1]([3-9])[0-9]{9}$/
    let config
    if (data.status === 1) {
      let name = document.querySelector('.input-name').value
      let tel = document.querySelector('.input-tel').value
      if (name === '') {
        Toast.fail('请输入您的姓名', 1)
      } else if (!reg.test(tel)) {
        Toast.fail('手机号码格式错误', 1)
      } else {
        if (cpcode) {
          config = {
            action: 'getCoupons',
            data: {
              uniacid: appConfig.uniacid,
              openid: wxUserInfo.openid,
              id: cpid,
              code: cpcode,
              name,
              tel
            }
          }
        } else {
          config = {
            action: 'getCoupons',
            data: {
              uniacid: appConfig.uniacid,
              openid: wxUserInfo.openid,
              id: cpid,
              name,
              tel
            }
          }
        }

        _api(config).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.refs.btn.disabled = 'disabled'
            this.refs.btn.style.background = '#ccc'
            Toast.success('领取成功', 1)
            this.timer = setTimeout(() => {
              this.props.history.replace('/profile')
            }, 1000)
          } else if (parseInt(res.data.status) === 400) {
            Toast.fail(res.data.msg, 1)
          }
        })

      }
    } else {
      if (cpcode) {
        config = {
          action: 'getCoupons',
          data: {
            uniacid: appConfig.uniacid,
            openid: wxUserInfo.openid,
            id: cpid,
            code: cpcode
          }
        }
      } else {
        config = {
          action: 'getCoupons',
          data: {
            uniacid: appConfig.uniacid,
            openid: wxUserInfo.openid,
            id: cpid
          }
        }
      }
      _api(config).then(res => {
        if (parseInt(res.data.status) === 200) {
          this.refs.btn.disabled = 'disabled'
          this.refs.btn.style.background = '#ccc'
          Toast.success('领取成功', 1)
          this.timer = setTimeout(() => {
            this.props.history.replace('/profile')
          }, 1000)
        } else if (parseInt(res.data.status) === 400) {
          Toast.fail(res.data.msg, 1)
        }
      })
    }
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer)
  }


  componentDidMount = () => {
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    let cpcode = getQueryString('cpcode')
    let cpid = getQueryString('cpid')
    let copy = getQueryString('copy')
    // 存在code
    if (cpcode) {
      // 存在copy
      if (copy) {
        const config = {
          action: 'couponView',
          data: {
            uniacid: appConfig.uniacid,
            openid: wxUserInfo.openid,
            id: cpid,
            code: cpcode,
            copy
          }
        }
        _api(config).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.setState({
              data: res.data.data
            })
          } else if (parseInt(res.data.status) === 400) {
            Toast.fail(res.data.msg, 1)
            this.timer = setTimeout(() => {
              this.props.history.replace('/home')
            }, 1000)
          }
        })
      } else {
        const config = {
          action: 'couponView',
          data: {
            uniacid: appConfig.uniacid,
            openid: wxUserInfo.openid,
            id: cpid,
            code: cpcode
          }
        }
        _api(config).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.setState({
              data: res.data.data
            })
          } else if (parseInt(res.data.status) === 400) {
            Toast.fail(res.data.msg, 1)
            this.timer = setTimeout(() => {
              this.props.history.replace('/home')
            }, 1000)
          }
        })
      }
    } else {
      if (copy) {
        const config = {
          action: 'couponView',
          data: {
            uniacid: appConfig.uniacid,
            openid: wxUserInfo.openid,
            id: cpid,
            copy
          }
        }
        _api(config).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.setState({
              data: res.data.data
            })
          } else if (parseInt(res.data.status) === 400) {
            Toast.fail(res.data.msg, 1)
            this.timer = setTimeout(() => {
              this.props.history.replace('/home')
            }, 1000)
          }
        })
      } else {
        const config = {
          action: 'couponView',
          data: {
            uniacid: appConfig.uniacid,
            openid: wxUserInfo.openid,
            id: cpid
          }
        }
        _api(config).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.setState({
              data: res.data.data
            })
          } else if (parseInt(res.data.status) === 400) {
            Toast.fail(res.data.msg, 1)
            this.timer = setTimeout(() => {
              this.props.history.replace('/home')
            }, 1000)
          }
        })
      }
    }
  }
}

const CouponTakeStyle = styled.div`

.input {
  width: 100%;
  height: 1.07rem;
  border: none;
  background: rgba(201, 201, 201, 0.2);
  border-radius: .53rem;
  padding-left: .41rem;
  margin-top: .41rem;
}

.coupon-take {
  position: absolute;
  z-index: 99;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8rem;
}

.bg {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8rem;
  height: 11.2rem;
}

.bg1 {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8rem;
  height: 13.84rem;
}

.head {
  width: 100%;
  height: 6.15rem;
  color: #fff;
  text-align: center;
  padding-top: 1.3rem;
  .amount {
    margin-bottom: .79rem;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1;
    span {
      font-size: .4rem;
    }
  }

  .jifen {
    font-size: .4rem;
    margin-bottom: .8rem;
  }

  .desc {
    font-size: .32rem;
    margin-bottom: .4rem;
  }

  .time {
    font-size: .32rem;
  }

}

.foot {
  width: 100%;
  height: 5.05rem;
  padding: .4rem;
  position: relative;
  .s {
    font-size: .35rem;
    font-weight: bold;
    margin-bottom: .35rem;
  }
  
  .d {
    font-size: .32rem;
    color: #474747;
    line-height: .4rem;
    height: 1.59rem;
  } 

  .coupon {
    position: absolute;
    bottom: .4rem;
    left: 50%;
    transform: translate(-50%, 0);
    color: #fff;
    font-size: .4rem;
    width: 3.12rem;
    height: .95rem;
    background-color: var(--theme-font-color);
    border-radius: .47rem;
  }

}



`

export default withRouter(CouponTake)