import React, { Component } from 'react'
import styled from 'styled-components'

class PayTixing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true
    }
  }
  render() {
    return (
      <PayTixingStyle>
        <div className="tixingkuang">
          <img className="tixingimg" />
          <div className="tixingtext1">火蝶云提醒您</div>
          <div className="tixingtext2">您的订单已生成，但未支付成功，确定返回吗？</div>
          <div className="tixingbtnframe">
            <button className="tixingbtn1">返回首页</button>
            <button className="tixingbtn2">继续支付</button>
          </div>
        </div>
      </PayTixingStyle>
    )
  }
}

const PayTixingStyle = styled.div`



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
  background: blue;
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
`
export default PayTixing;