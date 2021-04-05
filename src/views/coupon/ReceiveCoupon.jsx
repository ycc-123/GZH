import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'

import { _api } from 'network/api'

import { store } from 'store/index'



export class ReceiveCoupon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: ''
    }
  }
  render() {
    const { data } = this.state
    return (
      <Fragment>
        {
          data !== '' && <Fragment> <ReceiveCouponStyle>
            <div className='head' style={{ width: '8.18rem', height: '6.85rem' }}>
              <p style={{ paddingTop: '3.3rem', textAlign: 'center', fontSize: '.36rem', color: '#fff' }}>恭喜获得优惠券</p>
              <p style={{ fontSize: '.8rem', marginTop: '.2rem', textAlign: 'center', color: '#fff' }}>
                <span style={{ fontSize: '.36rem', marginRight: '.1rem', color: '#fff' }}>¥</span>
                {data}
              </p>
              <p style={{ marginTop: '.4rem', fontSize: '.32rem', textAlign: 'center', color: '#fff', opacity: '.5' }}>请至我的优惠券查看</p>
            </div>
            <div className='footer' style={{ width: '8.18rem', height: '2.55rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <button style={{ marginLeft: '.32rem', border: '1px solid #ccc', backgroundColor: '#fff' }} onClick={() => { this.goCoupon() }}>查看优惠券</button>
              <button style={{ position: 'absolute', right: '.32rem', backgroundColor: 'var(--theme-font-color)', color: '#fff' }} onClick={() => { this.goHome() }}>立即选购</button>
            </div>
          </ReceiveCouponStyle>
            <img style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '8.17rem',
              height: '9.4rem',
              zIndex: '1'
            }} src='https://res.lexiangpingou.cn/images/vip/20201127/receivecoupon.png' alt="" /> </Fragment>}

      </Fragment>
    )
  }

  componentDidMount = () => {

    const { appConfig } = store.getState()

    const config = {
      action: 'getGroupCoupon',
      data: {
        id: this.props.match.params.id,
        uniacid: appConfig.uniacid,
        openid: appConfig.wxUserInfo.openid,
      }
    }
    _api(config).then(res => {
      if (res.data.status === 200) {
        this.setState({
          data: res.data.data
        })
      } else if (res.data.status === 400) {
        Toast.info(res.data.msg, 1)
        this.timer = setTimeout(() => {
          this.props.history.replace('/home')
        }, 1200)
      }
    })
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer)
  }

  goHome = () => {
    this.props.history.replace('/home')
  }

  goCoupon = () => {
    this.props.history.replace('/coupon')
  }

}

const ReceiveCouponStyle = styled.div`

position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 8.17rem;
height: 9.4rem;
z-index: 2;

button {
  width: 3.12rem;
  height: .95rem;
  line-height: .95rem;
  border-radius: .53rem;
  font-size: .32rem;
}


`

export default withRouter(ReceiveCoupon)
