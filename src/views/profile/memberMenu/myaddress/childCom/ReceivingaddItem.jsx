import React, { Component } from 'react'
import styled from 'styled-components'

class ReceivingaddItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { bottom } = this.state
    return (
      <ReceivingaddItemStyle>

        <div className='header'>
          <div><img src='https://res.lexiangpingou.cn/images/vip/addressLose.png' alt="" /></div>
          <h4>地址列表</h4>
          <div>全部删除</div>
        </div>

        <div className='xian'></div>
        <div className="yemianbeijing">
          <div className="shdzframe">
            <div className="shdzshangk">
              <div className="shdzskframe">
                <div className="shdzwzk1 shdzwzkz">
                  <div className="shdzwzk1text1">张三丰</div>
                  <div className="shdzwzk1text2">12345678910</div>
                </div>
                <div className="shdzwzk2 shdzwzkz">
                  <div className="shdzwzk2text">浙江省</div>
                  <div className="shdzwzk2text">温州市</div>
                  <div className="shdzwzk2text">瑞安市</div>
                </div>
                <div className="shdzwzk3 shdzwzkz">云州街道火蝶科技三楼</div>
              </div>
              <div className='shdzskimg_right'>
                <span className='gongs'>公司</span>
                <img className="shdzskimg" src='https://res.lexiangpingou.cn/images/vip/addressgou.png' alt="" />
              </div>
            </div>

          </div>
          <div className="shdzxiantiao"></div>
          <div className="shdzframe2">
            <div className="shdzframe2k1">
              <img className="shdzframe2k1img" src='https://res.lexiangpingou.cn/images/vip/address1.png' alt="" />
              <div className="shdzframe2k1">设为默认地址</div>
            </div>
            <div className="shdzframe2k2">
              <button className="shdzframe2k2btn">编辑</button>
              <button className="shdzframe2k2btn">删除</button>
            </div>
          </div>
        </div>

        <div className="yemianbeijing">
          <div className="shdzframe">
            <div className="shdzshangk">
              <div className="shdzskframe">
                <div className="shdzwzk1 shdzwzkz">
                  <div className="shdzwzk1text1">张三丰</div>
                  <div className="shdzwzk1text2">12345678910</div>
                </div>
                <div className="shdzwzk2 shdzwzkz">
                  <div className="shdzwzk2text">浙江省</div>
                  <div className="shdzwzk2text">温州市</div>
                  <div className="shdzwzk2text">瑞安市</div>
                </div>
                <div className="shdzwzk3 shdzwzkz">云州街道火蝶科技三楼</div>
              </div>
              <div className='shdzskimg_right'>
                <span className='gongs'>家庭</span>
                <img className="shdzskimg" src='https://res.lexiangpingou.cn/images/vip/addressgou.png' alt="" />
              </div>
            </div>

          </div>
          <div className="shdzxiantiao"></div>
          <div className="shdzframe2">
            <div className="shdzframe2k1">
              <img className="shdzframe2k1img" src='https://res.lexiangpingou.cn/images/vip/address2.png' alt="" />
              <div className="shdzframe2k1">设为默认地址</div>
            </div>
            <div className="shdzframe2k2">
              <button className="shdzframe2k2btn">编辑</button>
              <button className="shdzframe2k2btn">删除</button>
            </div>
          </div>
        </div>



        <div className="shdzbtn">
          <img className="shdzbtnimg" src='https://res.lexiangpingou.cn/images/vip/addressbtn.png' alt="" />
          <div className="shdzbtntext">添加收货地址</div>
        </div>
      </ReceivingaddItemStyle>
    )
  }
}

const ReceivingaddItemStyle = styled.div`
select{
  -webkit-appearance: none;  
  /*清除select默认样式*/
  background: url("img/order_img/drop-down.png")no-repeat right;
  /*注：上一步清除样式后，select中的三角符号也会被清除，所以需要自己添加下三角，我在此出用一个下三角背景图片填充*/
  background-size: 0.3rem;
  background-position-x: 96%;
}
.header div{
  margin-right:.5rem;
  color:#e16b2f;
}
.header img{
  margin-top:.15rem;
  margin-left:.5rem;
  object-fit: cover;
  height: .35rem;
}
.header{
  margin-top:.3rem;
  display:flex;
  justify-content: space-between;
  color:rgb(255,118,46);
  font-size:.4rem;
}
.xian{
  height:1px;
  width:100%;
  background: white;
  margin-top:.3rem;
}

.yemianbeijing{
  width: 95%;
  background: white;
  height: 3.2rem;
  margin: 0 auto;
  margin-top: 0.4rem;
  border-radius: 0.2rem;
}
.shdzframe{
  padding: 0 .32rem;
}
.shdzxiantiao{
  border-top:0.01rem solid #CCC;
  width:100%;
}
.gongs{
  border:1px solid rgb(255,118,46);
  border-radius: 0.2rem;
  color:rgb(255,118,46);
  margin-right:.2rem;
}
.shdzskimg{
  width:0.4rem;
  height:0.4rem;
  background:black;
}
.shdzshangk{
  display: flex;
  justify-content: space-between;
  align-items:center;
  height:2rem;
}
.shdzwzkz{
  display:flex;
}
.shdzwzk1{
  align-items: baseline;
}
.shdzwzk1text1{
  font-size:.4rem;
  font-weight:600;
}
.shdzwzk1text2{
  margin-left:.4rem;
  font-size:.27rem;
  font-weight:600;
}
.shdzwzk2{
  font-size:.32rem;
  font-weight:600;
}
.shdzwzk2text{
  margin-right:.14rem;
}
.shdzwzk3{
  font-size:.32rem;
}
.shdzframe2{
  display:flex;
  justify-content: space-between;
  height:1.2rem;
  align-items:center;
  padding: 0 .32rem;
}
.shdzframe2k1{
  display:flex;
}
.shdzframe2k1img{
  width:0.4rem;
  height:0.4rem;
  background:#CCC;
  margin-right: 0.27rem;
}
.shdzframe2k1{
  color:#CCC;
}
.shdzframe2k2{
  display:flex;
}
.shdzframe2k2btn{
  width:1.6rem;
  height:0.53rem;
  line-height:0.53rem;
  text-align:center;
  color:white;
  border-radius:0.3rem;
  background: var(--theme-font-color);
  margin-left:0.4rem;
}
.shdzbtn{
  width:95%;
  height:1.2rem;
  margin:0 auto;
  margin-top:0.4rem;
  border-radius:0.3rem;
  align-items:center;
  display:flex;
  justify-content:center;
  background:rgb(255,118,46);
}
.shdzbtnimg{
  width:0.4rem;
  height:0.4rem;
  background:white;
  margin-right:0.4rem;
}
.shdzbtntext{
  color:white;
  font-size:0.4rem;
}
`

export default ReceivingaddItem