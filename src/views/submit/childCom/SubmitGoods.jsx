import React, { Component } from 'react'
import styled from 'styled-components'
class SubmitGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goods: this.props.goods,
      buytype: this.props.buytype
    }
  }
  render() {
    let price
    const { goods, buytype } = this.state
    // 单买时或者拼团单买
    if (goods.selltype === '0' || (goods.selltype === '1' && buytype === '1')) {
      price = goods.oprice
    } else if (goods.selltype === '1' || goods.selltype === '4' || goods.selltype === '6') {
      price = goods.gprice
    } else if (goods.selltype === '7') {
      price = goods.preprice
    }
    return (
      <SubmitGoodsStyle>
        {Array.isArray(goods) && goods.map((item, index) => {
          return (
            <div className='submit-goods' key={item + index}>
              <div className='img'>
                <img src={item.gimg} alt="" />
              </div>
              <div className='submit-goods-info'>
                <p>{item.goodsname}</p>
                <p>商品数量: {item.num}</p>
                <p className='shanpin'>
                  <span>&yen;</span>{item.oprice}
                </p>

                {/* <div className='cart'>
                  <div className='jian' onClick={() => this.decrement(index)}>-</div>
                  <article className='wen'>{item.num}</article>
                  <div className='jia' onClick={() => this.increment(index)}>+</div>
                </div> */}


              </div>
            </div>
          )
        })}
        {!Array.isArray(goods) && <div className='submit-goods'>
          <div className='img'>
            <img src={goods.gimg} alt="" />
          </div>
          <div className='submit-goods-info'>
            <p>{goods.gname} </p>
            <p>商品数量: {goods.num}</p>

            <p className='shanpin'>
              {goods.selltype === '7' ? '订金' : ''}
              <span>&yen;</span>{price}
            </p>

            {/* <div className='cart'>
              <div className='jian'>-</div>
              <article className='wen'>{goods.num}</article>
              <div className='jia'>+</div>
            </div> */}

          </div>
        </div>}
      </SubmitGoodsStyle>
    )
  }

  /* decrement = index => {
    console.log(index)
    console.log(this.state)
  }

  increment = index => {
    let { goods } = this.state
    goods[index].num = parseInt(goods[index].num) + 1
    this.setState({
      goods
    })
  } */

}

const SubmitGoodsStyle = styled.div`
.jia{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: .05rem; 
  width:.48rem;
  height: 100%;
  background: #e0e0e0;
  color:#6f6f6f;
  text-align:center;
  border-radius: 0 .13rem .13rem 0;
  font-size: .32rem;
}
.wen{
  margin-left:.05rem;
  width:1.3rem;
  height: 100%;
  line-height: .48rem;
  background: #e0e0e0;
  color:#6f6f6f;
  text-align:center;
  font-size: .32rem;
}
.jian{
  margin-left:.05rem;
  width:.48rem;
  height: 100%;
  line-height: .48rem;
  background: #e0e0e0;
  color:#6f6f6f;
  text-align:center;
  border-radius: .13rem 0 0 .13rem;
  font-size: .32rem;
}
.cart{
  position: absolute;
  bottom: 0;
  right: 0;
  height: .48rem;
  display:flex;
  justify-content: space-between;
}
.shanpin{
  position: absolute;
  bottom: 0;
  display:flex;
  justify-content: space-between;
  font-size: .32rem;
}
.submit-goods {
  width: 100%;
  height: 2.37rem;
  padding: .16rem;
  margin-bottom: .16rem;
  border-radius: .13rem;
  background: #fff;
 
}

.img {
  float: left;
  width: 2.05rem;
  height: 100%;
}
.img img {
  width: 100%;
  height: 100%;
}

.img img{
  width: 100%;
  height: 100%;
}

.submit-goods-info {
  position: relative;
  float: left;
  margin-left: .1rem;
  // margin-bottom: 1.6rem;
  // width: calc(100% - 2.15rem);
  width: 6.8rem;
  height: 100%;
  line-height: 1;
}

.submit-goods-info p {
  font-size: .24rem;
}

.submit-goods-info p:first-child {
  text-align: justify;
  font-weight: bold;
  font-size: .32rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #10131a;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.submit-goods-info p:nth-child(2) {
  margin-top: .6rem;
  font-size: .32rem;
  color: #ccc;
}

.submit-goods-info p:last-child {
  position: absolute;
  display: flex;
  align-items: flex-end;
  bottom: 0;
  font-size: .32rem;
}

.submit-goods-info p:last-child span {
  margin-right: .1rem;
  font-size: .28rem;
}

`

export default SubmitGoods;