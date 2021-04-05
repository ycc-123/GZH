import React, { Component } from 'react';
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { store } from 'store/index'
import { _MemberInfo } from 'network/profile'
import BetterScroll from 'common/betterScroll/BetterScroll'


const ConsumptionDetailStyle = styled.div`


.consumptionDetail {
  background-color: var(--bg-color);
  margin: 0 .32rem;
  margin-top:.32rem;
}
.detailTop{
  background-color:var(--box-bg-color);
  border-radius: .13rem;
  height: 3.4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: .4rem;

}
.detailTop>ul{
  flex-direction: column;
  justify-content: space-between;
  display: flex;
  margin: .4rem .4rem;
}
.detailTop>ul:nth-child(2){
  text-align:right;
}
h2{
  color:white;
  text-align:center;
  margin-bottom: .4rem;
}

.detailBottom{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color:white;
}

.detailBottom>ul{
  flex-direction: column;
  justify-content: space-between;
  display: flex;
  margin: .4rem .4rem;
}
.detailBottom>ul>li{
  padding-bottom: .2rem;
}
.detailBottom>ul:nth-child(2){
  text-align:right;
}
.detailBottom>ul>li:nth-child(5){
  
  padding-top: .4rem;
  font-weight:bold;
}

`


const scrollConfig = {
  probeType: 1
}
const scrollStyle = {
  // top:'.8rem'
}

class ConsumptionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {}
    }

    const { uniacid } = store.getState().appConfig

    this.networkConfig = {
      memOrderDetail: {
        action: 'memOrderDetail',
        data: {
          uniacid,
          orderno: '',
          type: 1
        }
      }
    }
  }
  render() {

    const { detail } = this.state

    return (

      <ConsumptionDetailStyle>
        <BetterScroll style={scrollStyle} config={scrollConfig} ref="scroll">
          {detail.goods && <div className="consumptionDetail">

            {
              detail.goods.map((item, key) => {
                return (<div key={key + item.gnum} className="detailTop">
                  <ul>
                    <li>商品名称</li>
                    <li>规格</li>
                    <li>数量</li>
                    <li>单价</li>
                    <li>小计</li>
                  </ul>

                  <ul>
                    <li>{item.goodsname}</li>
                    <li>个</li>
                    <li>{item.gnum}</li>
                    <li>￥{item.oprice}</li>
                    <li>{item.subtotal}</li>
                  </ul>

                </div>)
              })
            }


            <div className="detailBottom">
              <ul>
                <li>运费</li>
                <li>优惠金额</li>
                <li>折扣</li>
                <li>合计</li>
                <li>退款金额</li>
              </ul>

              <ul>
                <li>{detail.freight}</li>
                <li>{detail.goods_fee ? detail.goods_fee : '0.00'}</li>
                <li>{detail.discount_num}%</li>
                <li>￥{detail.pay_price}</li>
                <li>￥{detail.refund_fee}</li>
              </ul>


            </div>

          </div>}
        </BetterScroll>
      </ConsumptionDetailStyle>
    );
  }

  async componentDidMount() {

    const { orderno, type } = this.props.match.params
    this.networkConfig.memOrderDetail.data.orderno = orderno
    this.networkConfig.memOrderDetail.data.type = type
    let Res = await _MemberInfo(this.networkConfig.memOrderDetail)
    this.setState({
      detail: Res.data.data
    })
  }
}

export default withRouter(ConsumptionDetail)