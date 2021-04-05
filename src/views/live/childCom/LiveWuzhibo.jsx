import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'


class LiveWuzhibo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true
    }
  }
  render() {
    return (
      <LiveWuzhiboStyle>
        <div className="wuzhibodakuang">
          <div className="container">
            <img className="wuzhiboimg" src='https://res.lexiangpingou.cn/images/vip/wuzhibo.png' />
            <div className="wuzhibotext1">暂时还没有直播哦~</div>
            <div className="wuzhibotext2">去商城里看看其他商品吧</div>
            <button className="wuzhibobtn" onClick={() => { this.props.history.push('/home') }}>去逛逛</button>
          </div>
        </div>
      </LiveWuzhiboStyle>
    )
  }
}

const LiveWuzhiboStyle = styled.div`
.wuzhibodakuang{
  // width:100vw;
  height:calc(100vh - 1.28rem);
}

.container{
margin-top:calc( (100vh - 1.28rem - 7.36rem) / 2.5 );
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
}

.wuzhiboimg{
  width:4.67rem;
  height:4.67rem;
  // margin-top:2rem;
  // background:white;
}
.wuzhibotext1{
  color:white;
  font-size:0.4rem;
  font-weight:600;
  margin-top:1.09rem;
}
.wuzhibotext2{
  color:white;
  font-size:0.4rem;
  font-weight:600;
  margin-top:0.4rem;
}
.wuzhibobtn{
  width:3.13rem;
  height:1rem;
  line-height:1rem;
  text-align:center;
  font-size:0.4rem;
  font-weight:600;
  color:white;
  background:var(--theme-font-color);
  border-radius: 0.5rem;
  margin-top: 0.73rem;
}
`
export default withRouter(LiveWuzhibo);