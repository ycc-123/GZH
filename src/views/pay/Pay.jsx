import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { dropByCacheKey } from 'react-router-cache-route'
/* import wx from 'weixin-js-sdk' */

import PayAlert from './childCom/PayAlert'
import PayWay from './childCom/PayWay'

import Subscribe from 'content/subscribe/Subscribe'

import { store } from 'store/index'

import { _getOrderDetail } from 'network/order'

class Pay extends Component {
  constructor(props) {
    super(props)
    this.isApplet = store.getState().appConfig.isApplet
    this.state = {
      data: {},
      isshow: false,
      orderno: this.props.match.params.orderno,
      buytype: this.props.match.params.buytype,
      showRemind: false,
      height: '100vh'
    }
  }
  render() {


    document.title = "支付方式";

    const { isApplet } = store.getState().appConfig

    const { isshow, orderno, buytype, data, height } = this.state
    return (
      <PayStlye>
        <div className='pay' style={{ height }}>
          {data.id && <PayAlert isshow={isshow} info={this.info} data={data} />}
          {data.id && <PayWay orderno={orderno} buytype={buytype} data={data} isshow={isshow} />}
          {
            !isApplet && <Subscribe />
          }
        </div>
      </PayStlye>
    )
  }

  /* info = () => {
    this.setState({
      isshow: !this.state.isshow
    })
  } */

  componentDidMount = () => {
    dropByCacheKey('SubmitComponent')
    // window.addEventListener('popstate', this.showAlert, false)
    const { orderno, id } = this.props.match.params
    const orderDetailConfig = {
      // 获取订单详情
      action: 'orderDetail',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        id,
        orderno,
      }
    }
    _getOrderDetail(orderDetailConfig).then(res => {
      if (res.data.status === 200) {
        this.setState({
          data: res.data.data
        })
      }
    })
  }

  show = () => {
    this.setState({
      showRemind: true
    })
  }

  // showAlert = () => {
  //   const { orderno, id, buytype } = this.props.match.params
  //   this.props.history.replace(`/pay1/${buytype}/${orderno}/${id}`)
  // }


  // componentWillUnmount = () => {
  //   window.removeEventListener('popstate', this.showAlert, false)
  // }


}

const PayStlye = styled.div`

height: 100vh;
background-color: var(--bg-color);


.pay {
  margin: 0 .32rem;
  overflow: hidden;
  border-top-left-radius: .13rem;
  border-top-right-radius: .13rem;
}

`

export default withRouter(Pay);