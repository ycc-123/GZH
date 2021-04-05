import React, { Component } from 'react'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'

import { _jfcheck } from 'network/profile'
import { store } from 'store'

class ZitiHexiao extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true,
      order: this.props.match.params.order,
      ordertype: '',
      addname: '',
      mobile: '',
      orderno: '',
      goodsname: '',
      count: '',
      credit: '',
      img: ''
    }
    this.confirmSeccess = this.confirmSeccess.bind(this)
  }

  async confirmSeccess() {
    const confirmConfig = {
      action: 'jfcheck',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        orderno: 'D' + this.state.order,
        type: 1
      }
    }
    let checkRes = await _jfcheck(confirmConfig)
  }

  componentDidMount() {
    const confirmConfig = {
      action: 'jfcheck',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        orderno: 'D' + this.state.order,
        type: 0
      }
    }
    _jfcheck(confirmConfig).then(res => {
      if (res.data.status == 200) {
        let ordertype = res.data.data[0].ordertype
        let addname = res.data.data[0].addname
        let mobile = res.data.data[0].mobile
        let orderno = res.data.data[0].orderno
        let goodsname = res.data.data[0].goods[0].gname
        let img = res.data.data[0].goods[0].img
        let count = res.data.data[0].goods[0].gnum
        let credit = res.data.data[0].goods[0].oprice
        console.log(credit)
        this.setState({
          img,
          ordertype,
          addname,
          mobile,
          orderno,
          goodsname,
          count,
          credit
        })
      } else if (res.data.status === 400) {
        Toast.info(res.data.msg, 1)
      }
    })
  }

  render() {
    return (
      <ZitiHexiaoStyle>
        <div className="zongkuang">

          <div className="zitihexiaoframe">
            <div className="zitihexiaotex1">兑换物品核销凭证</div>
            <div className="xiantiao"></div>
            <div className="zitidingdanframe">
              <div className="dingdanframe">
                <div className="dingdantext1">订单类型</div>
                <div className="dingdantext2">积分商城订单</div>
              </div>
              <div className="dingdanframe">
                <div className="dingdantext1">订单号</div>
                <div className="dingdantext2">{this.state.orderno}</div>
              </div>
              <div className="dingdanframe">
                <div className="dingdantext1">提货人</div>
                <div className="dingdantext2">{this.state.addname}</div>
              </div>

            </div>
            <div className="xiantiao"></div>


            <div style={{ padding: ".4rem" }}>
              <div className="wupinframe">
                <img className="wupinimg" src={this.state.img} />
                <div className="wupintextframe">
                  <div className="wupintext1">{this.state.goodsname}</div>
                  <div className="wupintextframe2">
                    <div>规格:红色</div>
                    <div>x{this.state.count}</div>
                  </div>
                  <div className="wupintext2">积分{this.state.credit}</div>
                </div>
                <img className="wupinimg2" src='https://res.lexiangpingou.cn/images/vip/d.png' />
              </div>

            </div>
          </div>

          <button className="btn1" onClick={() => { this.props.history.push('/home') }}>返回首页</button>
          <button className="btn2" onClick={this.confirmSeccess}>确认核销</button>

        </div>
      </ZitiHexiaoStyle>
    )
  }
}

const ZitiHexiaoStyle = styled.div`
.zongkuang{
  padding:0 0.32rem;
}

.zitihexiaoframe{
  width:100%;
  margin-top:0.15rem;
  // height:9.17rem;
  background:white;
  border-radius:0.1rem;
}
.zitihexiaotex1{
  padding-top:.79rem;
  margin-bottom:.8rem;
  width:100%;
  color:#474747;
  // height:2rem;
  // line-height:2rem;
  font-size:0.48rem;
  font-weight:600;
  text-align:center;
}
.xiantiao{
  width:100%;
  height:0.01rem;
  background:#CCC;
}
.zitidingdanframe {
  padding: .4rem;
  width:100%;
}
.dingdanframe {
  display: flex;
  justify-content: space-between;
  margin-bottom: .4rem;
}

.dingdanframe:last-child {
  margin-bottom: 0;
}

.dingdantext1 {
  font-size:0.32rem;
  font-weight:600;
}
.dingdantext2 {
  font-size:0.32rem;
  color:#CCC;
}
.wupinframe{
  display:flex;
  align-items:center;
  width:100%;
  height:2.13rem;
  border-bottom:0.01rem solid #DA6D33;
  position:relative;
}
.wupinframexu{
  display:flex;
  align-items:center;
  width:100%;
  height:2.13rem;
}
.wupinimg{
  width:1.33rem;
  height:1.33rem;
  background:var(--theme-font-color);
  margin-right:0.4rem;
}
.wupintextframe div{
  padding-top:.05rem;
  font-size:.32rem;
}
.wupintextframe{
  width:calc(100vw - 3.17rem);
}
.wupintextframe2{
  display:flex;
  justify-content:space-between;
  color:#CCC;
  font-size:0.32rem;
}
.wupintext1{
  font-size:0.32rem;
  font-weight:600;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.wupintext2{
  font-size:0.32rem;
  color:var(--theme-font-color);
}
.wupinimg2{
  width:0.53rem;
  height:0.53rem;
  background:var(--theme-font-color);
  position:absolute;
  bottom:0;
  right:0;
}

.btn1{
  width:4.53rem;
  height:0.93rem;
  line-height:0.93rem;
  text-align:center;
  background:white;
  font-size:0.4rem;
  font-weight:600;
  border-radius:0.2rem;
  position: absolute;
  bottom: 2%;
  left: 2%;
}
.btn2{
  width:4.53rem;
  height:0.93rem;
  line-height:0.93rem;
  text-align:center;
  background:var(--theme-font-color);
  font-size:0.4rem;
  font-weight:600;
  border-radius:0.2rem;
  color:white;
  position: absolute;
  bottom: 2%;
  right: 2%;
}
`
export default ZitiHexiao;