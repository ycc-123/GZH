import React, { Component } from 'react';
import styled from 'styled-components'



class GoodsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    const { goodsInfo } = this.props
    console.log(goodsInfo)
    return (
      <GoodsItemStyle>
        <div>
          <li className="goodsItem" onClick={this.seeOrderDetail}>
            <div className="goodsImgs">
              <img src={goodsInfo.gimg} alt="" className="goodsImg" />
            </div>
            <div className="goodsInfo">
              <span className="goodsTitle">{goodsInfo.goodsname}</span>
              <div className="goodsPrice">
                <div className="price">￥{goodsInfo.oprice}</div>
                <div className="goodsNum">x{goodsInfo.num}</div>
              </div>
              <span className="option">
                规格：{goodsInfo.item ? goodsInfo.item : '无'}
              </span>
            </div>
          </li>
        </div>

      </GoodsItemStyle>

    );
  }

  seeOrderDetail = () => {
    this.props.orderDetail()
  }
}

export const GoodsItemStyle = styled.div`
.goodsInfo .goodsTitle{
  color:#474747;
  font-size:.35rem;
}
.goodsItem {
  padding: .4rem;
  display: flex;
}
.goodsImgs{
  width: 2.09rem;
  height:2.04rem;
}
.goodsImgs>img{
  width: 100%;
  height: 100%;
}
.goodsInfo{
  position: relative;
  padding-left:.2rem;
  display: flex;
  flex-direction: column;
}
.goodsPrice{
  font-size:.3rem;
  width:5.8rem;
  display: flex;
  justify-content: space-between;
  color:#c3c3c3;
}
.option{
  position: absolute;
  bottom: 0;
  color:#c3c3c3;
  font-size:.3rem;
}









`

export default GoodsItem;