import React, { Component } from 'react'
import styled from 'styled-components'

class SubmitGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const { data } = this.props
    return (
      <PayGoodsStyle>
        <div className='info'>
          <p>支付总额</p>
          <p><span>&yen;</span>{data.pay_price}</p>
          <p><span>&yen;</span>{data.pay_price}<label>(折扣后)</label></p>
          {/* <p>
            <span className='text'>{data.goodsname}</span>
            <span className='go' onClick={this.showInfo}>订单详情</span>
          </p> */}
        </div>
      </PayGoodsStyle>

    )
  }
  showInfo = () => {
    this.props.info()
  }

}

const PayGoodsStyle = styled.div`
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
  color: #FA5151;
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
/* 　text-overflow: ellipsis;
　white-space: nowrap; */
  text-align: right;
  font-size: .32rem
}

.go {
  font-size: .32rem
}

`

export default SubmitGoods;