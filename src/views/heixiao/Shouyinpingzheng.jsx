import React, { Component } from 'react'
import styled from 'styled-components'

class Shouyinpg extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true
    }
  }
  render() {
    return (
      <ShouyinpgStyle>
        <div className="zongkuang">
          <div className="Shouyinpgtopframe">
            <div className="Shouyinpgtoptext">线下门店</div>
            <div className="Shouyinpgkuang">
              <div className="Shouyinpgtoptext2">请选择线下门店</div>
              <img className="Shouyinpgtopimg" />
            </div>
          </div>
          <div className="Shouyinpgframe">
            <div className="Shouyinpgtex1">线下收银凭证</div>
            <div className="xiantiao"></div>
            <div className="sypzsypzframe">
              <div className="sypzframe">
                <div className="sypztext1">订单号</div>
                <div className="sypztext2">2020-07-20 10:00:00</div>
              </div>
              <div className="sypzframe">
                <div className="sypztext1">收银员</div>
                <div className="sypztext2">哦</div>
              </div>
              <div className="sypzframe">
                <div className="sypztext1">实收款</div>
                <div className="sypztext3">￥19.9</div>
              </div>
              
            </div>


            
          </div>
          {/* <div className="btnframe"> */}
              <button className="btn1">返回首页</button>
              <button className="btn2">确认核销</button>
            {/* </div> */}
        </div>

      </ShouyinpgStyle>
    )
  }
}

const ShouyinpgStyle = styled.div`
.zongkuang{
  padding:0 0.32rem;
}
.Shouyinpgtopframe{
  display:flex;
  justify-content:space-between;
  padding:0 0.32rem;
  width:100%;
  height:1.2rem;
  line-height:1.2rem;
  background:white;
  border-radius:0.1rem;
  margin:0.15rem 0;
}

.Shouyinpgtoptext{
  display:flex;
  align-items:center;
  font-size:0.4rem;
  font-weight:600;
}
.Shouyinpgkuang{
  display:flex;
  align-items: center;
}
.Shouyinpgtoptext2{
  font-size:0.32rem;
  color:#CCC;
  margin-right:0.17rem;
}
.Shouyinpgtopimg{
  width:0.27rem;
  height:0.27rem;
  background:black;
}
.Shouyinpgframe{
  width:100%;
  height:4.93rem;
  background:white;
  border-radius:0.1rem;
}
.Shouyinpgtex1{
  width:100%;
  height:2rem;
  line-height:2rem;
  font-size:0.5rem;
  font-weight:600;
  text-align:center;
}
.xiantiao{
  width:100%;
  height:0.01rem;
  background:#CCC;
}
.sypzsypzframe{
  padding:0.4rem 0.4rem 0 0.4rem;
  width:100%;
  height:3.13rem;
}
.sypzframe{
  display:flex;
  justify-content:space-between;
  margin-bottom: 0.25rem;
}
.sypztext1{
  font-size:0.32rem;
  font-weight:600;
}
.sypztext2{
  font-size:0.32rem;
  color:#CCC;
}
.sypztext3{
  font-size:0.32rem;
  font-weight:600;
  color:var(--theme-font-color);
}
.btnframe{
  display:flex;
  justify-content:space-between;
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
export default Shouyinpg;