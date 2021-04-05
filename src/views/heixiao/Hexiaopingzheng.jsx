import React, { Component } from 'react'
import styled from 'styled-components'

class ZitiHexiao extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true
    }
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
                <div className="dingdantext2">12454564654564</div>
              </div>
              <div className="dingdanframe">
                <div className="dingdantext1">提货人</div>
                <div className="dingdantext2">哦(15711111111)</div>
              </div>
              
            </div>
            <div className="xiantiao"></div>


            <div style={{ padding: "0 0.4rem" }}>
              <div className="wupinframe">
                <img className="wupinimg" />
                <div className="wupintextframe">
                  <div className="wupintext1">苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果</div>
                  <div className="wupintextframe2">
                    <div>规格:红色</div>
                    <div>x1</div>
                  </div>
                  <div className="wupintext2">积分200</div>
                </div>
                <img className="wupinimg2" />
              </div>

              <div className="wupinframexu">
                <img className="wupinimg" />
                <div className="wupintextframe">
                  <div className="wupintext1">苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果苹果</div>
                  <div className="wupintextframe2">
                    <div>规格:红色</div>
                    <div>x1</div>
                  </div>
                  <div className="wupintext2">积分200</div>
                </div>
              </div>
            </div>

          
          </div>

            <button className="btn1">返回首页</button>
            <button className="btn2">确认核销</button>

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
  height:9.17rem;
  background:white;
  border-radius:0.1rem;
}
.zitihexiaotex1{
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
.zitidingdanframe{
  padding:0.4rem 0.4rem 0 0.4rem;
  width:100%;
  height:2.4rem;
}
.dingdanframe{
  display:flex;
  justify-content:space-between;
  margin-bottom: 0.25rem;
}
.dingdantext1{
  font-size:0.32rem;
  font-weight:600;
}
.dingdantext2{
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