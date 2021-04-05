import React, { Component } from 'react'
import styled from 'styled-components'


import BetterScroll from 'common/betterScroll/BetterScroll'
import Template from 'common/template/Template'


class PayAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    const scollConfig = {
      probeType: 1,
    }

    const scrollStyle = {
      top: '50%',
      left: '50%',
      transform: "translate(-50%,-50%)",
      width: "7.87rem",
      height: "10rem"
    }
    const { data } = this.props
    return (
      <PayAlertStyle>
        <div style={{ display: this.props.isshow ? 'block' : 'none' }}>
          <Template />
          <div className="tankuang" >
            <BetterScroll
              ref='scroll'
              config={scollConfig}
              style={scrollStyle}>
              <div className="tankuangframe1">
                <div className="tankuangframe1text">订单详情</div>
                <img className="tankuangframe1img" src='https://res.lexiangpingou.cn/images/vip/chacha.png' alt=""
                  onClick={() => { this.props.info() }}
                />
              </div>
              <div className="xiantiao"></div>
              <div className="tankuangframe2">
                <div className="tankuangframe2text1">收货地址</div>
                <div>
                  <div className="tankuangframe2text2">{data.address}</div>
                  <div className="tankuangframe2kuang">
                    <div className="tankuangframe2text2">收货人</div>
                    <div className="tankuangframe2text3">{data.mobile}</div>
                  </div>
                </div>
                <div className="xiantiao"></div>
              </div>

              <div className="tankuangframe2">
                <div className="tankuangframe2text1">{data.goodsname}</div>
                <div>
                  <div className="tankuangframe2kuangd">
                    <div className="tankuangframe2text2">规格</div>
                    <div className="tankuangframe2text2">{data === '' ? '无' : ''}</div>
                  </div>
                  <div className="tankuangframe2kuangd">
                    <div className="tankuangframe2text2">数量</div>
                    <div className="tankuangframe2text3">X{data.gnum}</div>
                  </div>
                </div>
                <div className="xiantiao"></div>
              </div>

              <div className="tankuangframe2">
                <div className="tankuangframe2text1">优惠金额</div>
                <div>
                  <div className="tankuangframe2kuangd">
                    <div className="tankuangframe2text2">优惠券</div>
                    <div className="tankuangframe2text2">￥0.00</div>
                  </div>
                  <div className="tankuangframe2kuangd">
                    <div className="tankuangframe2text2">其他折扣</div>
                    <div className="tankuangframe2text3">-</div>
                  </div>
                </div>
                <div className="xiantiao"></div>
              </div>
              <div className="tankuangframe2">
                <div className="tankuangframe2text1">备注信息</div>
                <div className="tankuangframe2text2">无</div>
              </div>
              <div className="tankuangframe2">
                <div className="tankuangframe2text1">备注信息</div>
                <div className="tankuangframe2text2">无</div>
              </div><div className="tankuangframe2">
                <div className="tankuangframe2text1">备注信息</div>
                <div className="tankuangframe2text2">无</div>
              </div><div className="tankuangframe2">
                <div className="tankuangframe2text1">备注信息</div>
                <div className="tankuangframe2text2">无</div>
              </div><div className="tankuangframe2">
                <div className="tankuangframe2text1">备注信息</div>
                <div className="tankuangframe2text2">无</div>
              </div><div className="tankuangframe2">
                <div className="tankuangframe2text1">备注信息</div>
                <div className="tankuangframe2text2">无</div>
              </div><div className="tankuangframe2">
                <div className="tankuangframe2text1">备注信息</div>
                <div className="tankuangframe2text2">无</div>
              </div>
            </BetterScroll>
          </div>
        </div>


      </PayAlertStyle>
    );
  }

  componentDidUpdate = () => {
    // this.refs.scroll.BScroll.options.bounce.top = false
    this.refs.scroll.BScroll.refresh()
  }
}

const PayAlertStyle = styled.div`
.tankuang{
  width:7.87rem;
  height:10rem;
  position: absolute;
  z-index: 9999999 !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background:white;
  border-radius: 0.2rem;
}
.xiantiao{
  width:100%;
  height:0.01rem;
  background:#CCC;
}
.tankuangframe1{
  display:flex;
  justify-content:space-between;
  height:1.2rem;
  line-height:1.2rem;
  width:100%;
  align-items:center;
  padding:0 0.4rem;
}
.tankuangframe1text{
  font-size:0.32rem;
  font-weight:600;
}
.tankuangframe1img{
  position: absolute;
  right: .4rem;
  width: .53rem;
  height: .53rem;
}
.tankuangframe2{
  padding:0 0.4rem;
}
.tankuangframe2text1{
  font-size:0.35rem;
  font-weight:600;
  margin:0.35rem 0;
}
.tankuangframe2kuang{
  display:flex;
}
.tankuangframe2text2{
  font-size:0.32rem;
  color:#CCC;
}
.tankuangframe2text3{
  font-size:0.32rem;
  color:#CCC;
  margin:0 0 0.3rem 0.13rem ;
}
.tankuangframe2kuangd{
  display:flex;
  justify-content: space-between;
}

`

export default PayAlert;