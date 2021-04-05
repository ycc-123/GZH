import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

class CartKong extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <CartKongStyle>
        <div style={{ display: this.props.style, backgroundColor: 'var(--bg-color)', height: 'calc(100vh - 1.28rem)' }}>
          <div className="kongimgkuang">
            <img className="kongimg" src='https://res.lexiangpingou.cn/images/vip/cartk.png' alt="''" />
          </div>
          <div className="wenzi">
            <div>购物车空着哦~</div>
            <div style={{ marginTop: "0.4rem" }}>赶紧抢点东西慰劳下自己吧</div>
            <button className="kongbtn" onClick={this.goHome}>去逛逛</button>
          </div>
        </div>
      </CartKongStyle>
    );
  }
  goHome = () => {
    this.props.history.push('/home')
  }
}

const CartKongStyle = styled.div`
.kongimgkuang{
  width:100%;
  height:7.51rem;
  display: flex;
  justify-content: center;
}
.kongimg{
  width: 7.07rem;
  height: auto;
  position: absolute;
  margin-top: 3rem;
}
.wenzi{
  margin-top: 2rem;
  font-size:0.4rem;
  color: var(--font-color);
  text-align:center;
}
.kongbtn{
  margin-top:0.8rem;
  width:3.2rem;
  height:0.93rem;
  line-height:0.93rem;
  text-align:center;
  color:white;
  background: var(--theme-font-color);
  border-radius:0.45rem;

}

`

export default withRouter(CartKong);