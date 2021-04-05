import React, { Component } from 'react';
import styled from 'styled-components'

const GoodsItemStyle = styled.div`


.goodsItem{
  padding: .4rem .4rem;
  display: flex;
}

.goodsImgs{

width: 2.04rem;
height:2.09rem;

}
.goodsImgs>img{
width: 100%;
height: 100%;
}
.goodsInfo {
position: relative;
padding-left: .2rem;
height: 2.09rem;
}

.goodsNum{
position: relative;
right: -4rem;
}

.goodsTextColor{
position: absolute;
bottom: 0;
color: #ccc;

.d-goods-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

}
`


class DetailGoodsItem extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        const { goodsInfo } = this.props
        console.log(goodsInfo)
        return (

            <GoodsItemStyle>
                <div onClick={this.props.orderDetail}>
                    <li className="goodsItem" >
                        <div className="goodsImgs">
                            <img src={goodsInfo.gimg} alt="" />
                        </div>
                        <div className="goodsInfo">
                            <p className="d-goods-title">{goodsInfo.goodsname}</p>
                            <p className="goodsPrice" style={{ color: '#ccc', marginTop: '.2rem' }}>
                                <span className="price">￥{goodsInfo.oprice}</span>
                                <span className="goodsNum">x{goodsInfo.num }</span>
                            </p>
                            <p className="option goodsTextColor">
                                规格：{goodsInfo.optionname ? goodsInfo.optionname : '无'}
                            </p>
                        </div>
                    </li>
                </div>

            </GoodsItemStyle>

        );
    }
}

export default DetailGoodsItem;