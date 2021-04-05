import React, { Component, Fragment } from 'react'
import { withRouter, Prompt } from 'react-router-dom'
import styled from 'styled-components'
import { dropByCacheKey } from 'react-router-cache-route'

import { _api } from 'network/api'

import { store } from 'store/index'

import { setTitle } from 'commons/utils'

class PaySuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }
  render() {
    const { data } = this.state
    return (
      <PaySuccessStyle>
        <Prompt message={location => {
          if (location.pathname.startsWith('/home') || location.pathname.startsWith('/order/detail')) {
            return true
          } else {
            return false
          }

        }} when={true} />
        {data.id &&
          <Fragment><div className="center1">
            <div className="center1kb"></div>

            <div className="center1frame">
              <img className="center1img" src='https://res.lexiangpingou.cn/images/vip/paysuccess.png' alt="" />
              <div className="center1textframe">
                <div className="center1text1">{data.pay_type === '提货卡兑换' ? '兑换成功' : '支付成功'}</div>
                <div className="center1text2">感谢您的购买</div>
              </div>
            </div>

            <div className="center1frame2"></div>
            <div className="center1zhangdan">
              <div className="center1zdtext"><span style={{ fontSize: "0.32rem" }}>￥</span>{data.price}</div>
              <div className="center1xiantiao"></div>
              <div>
                <div className="center1zdwzframe1">
                  <div className="center1zdwz1">订单详情</div>
                  <div className="center1zdwz2">{data.orderno}</div>
                </div>
                <div className="center1zdwzframe2">
                  <div className="center1zdwz1">下单时间</div>
                  <div className="center1zdwz2">{data.ptime}</div>
                </div>
                <div className="center1zdwzframe3">
                  <div className="center1zdwz1">支付方式</div>
                  <div className="center1zdwz2">{data.pay_type}</div>
                </div>
              </div>
            </div>
          </div>

            <div className="center2">
              <div className="center2kongbai"></div>
              <button className="center2btn2" onClick={this.goHome}>继续购物</button>
              <button className="center2btn1" onClick={this.goOrderno}>订单详情</button>
              {data.dispatchtype === '3' && <button className="center2btn1" onClick={() => this.goDestruction()}>到店核销</button>}
            </div>
          </Fragment>}

      </PaySuccessStyle>

    );
  }

  goOrderno = () => {
    const { id, orderno } = this.state.data
    this.props.history.replace(`/order/detail/${orderno}/${id}`)
  }

  goHome = () => {
    const { isApplet } = store.getState().appConfig
    if (isApplet) {
      window.navigateToWebWiew('#/home')
    } else {
      this.props.history.replace('/home')
    }
  }


  goDestruction() {
    const { id, orderno } = this.state.data
    this.props.history.push({ pathname: `/order/detail/${orderno}/${id}`, search: 'type=code' })
  }


  componentDidMount = async () => {
    setTitle('支付成功')
    dropByCacheKey('SubmitComponent')
    const { uniacid } = store.getState().appConfig
    const api_config = {
      action: 'payResult',
      data: {
        uniacid,
        orderno: this.props.match.params.orderno
      }
    }
    const result = await _api(api_config)
    this.setState({
      data: result.data.data
    })
  }
}

const PaySuccessStyle = styled.div`


.ziti-prompt {
  margin-top: .4rem;
  font-size: .29rem;
  color: var(--common-font-color);
  opacity: .5;
}

body{
  background:white !important;
}
.center1{
  width:100%;
  height:4.4rem;
  background:#212735;
}
.center1kb{
  width:100%;
  height:0.8rem;
}
.center1frame{
  width:100%;
  display:flex;
  justify-content:center;
  align-items: center;
}
.center1img{
  width:1.83rem;
  height:1.33rem;
}
.center1textframe{
  margin-left:0.4rem;
  text-align:left;
}
.center1text1{
  font-size: .48rem;
  font-weight: 600;
  color:#1EBF70;
}
.center1text2{
  font-size:0.32rem;
  color:white;
}
.center1frame2{
  width:95%;
  height:0.27rem;
  margin:0 auto;
  margin-top:0.8rem;
  background:black;
  border-radius:0.1rem;
}
.center1zhangdan{
  width:87%;
  height:5.33rem;
  background:white;
  margin:0 auto;
  position: relative;
  bottom: 0.1rem;
  box-shadow: 0px 3px 10px 1px #CCC;
}
.center1zdtext{
  width:100%;
  height:2.1rem;
  line-height:2.1rem;
  font-size:0.64rem;
  font-weight:600;
  text-align: center;
}
.center1xiantiao{
  width: 100%;
  height: 0.1px;
  background: #CCC;
}
.center1zdwzframe1{
  display:flex;
  margin-top:0.6rem;
  justify-content: space-between;
}
.center1zdwzframe2{
  display:flex;
  margin-top:0.4rem;
  justify-content: space-between;
}
.center1zdwzframe3{
  display:flex;
  margin-top:0.4rem;
  justify-content: space-between;
}
.center1zdwz1{
  margin-left:0.5rem;
  font-size:0.32rem;
  font-weight:600;
}
.center1zdwz2{
  margin-right:0.5rem;
  font-size:0.32rem;
}
.center2{
  width: 100%;
  height: calc(100vh - 4.4rem);
  background: white;
  text-align: center;
}
.center2kongbai{
  width: 100%;
  height: 5.2rem;
}
.center2btn1{
  width: 5.65rem;
  height: .92rem;
  line-height: .92rem;
  text-align:center;
  border-radius: .45rem;
  border:1px solid #ccc;
  background: white;
  font-size: .4rem;
  margin-top: .4rem;
}
.center2btn2{
  width: 5.65rem;
  height: .92rem;
  line-height: .92rem;
  text-align: center;
  border-radius: .45rem;
  font-size: .4rem;
  background: var(--theme-font-color);
  color: white;
}
`

export default withRouter(PaySuccess)