import React, { Component } from 'react'
import styled from 'styled-components'

class DetailPingjia extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true
    }
  }
  render() {
    return (
      <DetailPingjiaStyle>
        <div className="sppjzong">
          <div className="sppjframe">
            <div className="sppjframekuang">
              <div className="sppjframetext1">商品评价</div>
              <div className="sppjframetext1">(22)</div>
            </div>
            <div className="sppjframekuang">
              <div className="sppjframetext2">全部评论</div>
              <img className="sppjframeimg" src="" alt="" />
            </div>
          </div>

          <div className="sppjframe2">
            <div className="sppjframe2k">
              <img className="sppjframe2img" src="" alt="" />
              <div>
                <div className="sppjframe2text1">用户名字</div>
                <div className="sppjframe2text2">2020-07-15 16:00:00</div>
              </div>
            </div>
            <div className="sppjframe2text3">商品评价商品评价商品评价商品评价商品评价商品评价商品评价</div>
          </div>

          <div className="sppjframe2">
            <div className="sppjframe2k">
              <img className="sppjframe2img" src="" alt="" />
              <div>
                <div className="sppjframe2text1">用户名字</div>
                <div className="sppjframe2text2">2020-07-15 16:00:00</div>
              </div>
            </div>
            <div className="sppjframe2text3">商品评价商品评价商品评价商品评价商品评价商品评价商品评价</div>
          </div>


        </div>

      </DetailPingjiaStyle>
    )
  }
}

const DetailPingjiaStyle = styled.div`
.sppjzong{
  width:100%;
  height:auto;
  padding:0 0.32rem;
}
.sppjframe{
  width:100%;
  height:2rem;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.sppjframekuang{
  display:flex;
  align-items:center;
}
.sppjframetext1{
  font-size:0.4rem;
  font-weight:600;
  color:white;
  margin-right:0.27rem;
}
.sppjframetext2{
  color:#999;
}
.sppjframeimg{
  width:0.33rem;
  height:0.33rem;
  background:white;
  margin-left:0.35rem;
}
.sppjframe2{
  
}
.sppjframe2k{
  display:flex;
  align-items:center;
  height:0.93rem;
}
.sppjframe2img{
  width:0.8rem;
  height:0.8rem;
  background:white;
  margin-right:0.13rem;
  border-radius:50%;
}
.sppjframe2text1{
  font-size:0.32rem;
  font-weight:600;
  color:white;
}
.sppjframe2text2{
  font-size:0.27rem;
  color:#999;
}
.sppjframe2text3{
  height:0.93rem;
  line-height:0.93rem;
  font-size:0.27rem;
  color:#999;
}
`
export default DetailPingjia;