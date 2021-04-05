import React, { Component } from 'react'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'


export default class GroupCommission extends Component {
    render() {
        const scrollConfig = {
            probeType: 1
        }
        return (
            <GroupCommissionStyle>
                <BetterScroll config={scrollConfig}>

                    <div>
                        <div className='header'>
                            <img className='header_b' src='https://res.lexiangpingou.cn/images/vip/qmjz.png' alt="" />
                            <div className='header_money'>726.00</div>
                            <div className='btn'><button>立即提现</button></div>
                            <div className='header_wen'>
                                <div className='header_wen_one'>￥<span>19.9</span></div>
                                <div className='header_wen_two'>￥<span>19.9</span></div>
                                <div className='header_wen_three'>￥<span>19.9</span></div>
                                <div className='header_wen_four'>￥<span>19.9</span></div>
                            </div>
                        </div>

                        <div>

                            <div className='MygroupContainer'>
                                <div className='xiang'>
                                    <div className='MygroupContainer_order'>
                                        <span >组单号:</span>
                                        <span>33145522</span>
                                        <span className='MygroupContainer_time'>2020-01-03 17:02:03</span>
                                    </div>
                                </div>

                                <div className='xiang'>
                                    <div className='MygroupContainer_c'>
                                        <div>
                                            <img src='https://res.lexiangpingou.cn/images/vip/guo.png' alt="" />
                                        </div>

                                        <div className='MygroupContainer_c_t'>
                                            <p className='title'><span>广西新鲜高山香蕉当季新鲜青皮香蕉2.5kg 好 吃不贵健康美味</span></p>
                                            <p className='guige'><span>单人提成</span><span className='count1'>￥0.30</span></p>
                                            <p className='jiage'><span>团签收人数</span><span className='count2'>1人</span></p>

                                            <p className='shifu'><span>可提现金额￥19.90</span></p>
                                        </div>
                                    </div>
                                </div>



                                <div className='MygroupContainer_f'>
                                    <button className='btn1'>团详情</button>
                                </div>
                            </div>

                            <div className='MygroupContainer'>
                                <div className='xiang'>
                                    <div className='MygroupContainer_order'>
                                        <span >组单号:</span>
                                        <span>33145522</span>
                                        <span className='MygroupContainer_time'>2020-01-03 17:02:03</span>
                                    </div>
                                </div>

                                <div className='xiang'>
                                    <div className='MygroupContainer_c'>
                                        <div>
                                            <img src='https://res.lexiangpingou.cn/images/vip/guo.png' alt="" />
                                        </div>

                                        <div className='MygroupContainer_c_t'>
                                            <p className='title'><span>广西新鲜高山香蕉当季新鲜青皮香蕉2.5kg 好 吃不贵健康美味</span></p>
                                            <p className='guige'><span>单人提成</span><span className='count1'>￥0.30</span></p>
                                            <p className='jiage'><span>团签收人数</span><span className='count2'>1人</span></p>

                                            <p className='shifu'><span>可提现金额￥19.90</span></p>
                                        </div>
                                    </div>
                                </div>



                                <div className='MygroupContainer_f'>
                                    <button className='btn1'>团详情</button>
                                </div>
                            </div>
                        </div>




                    </div>
                </BetterScroll>
            </GroupCommissionStyle>

        )
    }
}

const GroupCommissionStyle = styled.div`

.MygroupHeader{
    border-radius: .2rem;
    height: .8rem;
    background-color: #fff;
  }
  .MygroupHeader>ul{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-top: .21666rem;
  }
  
  .active{
    color:var(--theme-font-color);
    border-bottom: .027rem var(--theme-font-color) solid;
    padding-bottom: .17rem;
  }

  .MygroupContainer{
    padding-bottom: .2rem;
    background-color: #fff;
    height:4.4rem;
    width:100%;
    border-radius: .2rem;
  }
  .MygroupContainer_order{
      padding-top:.2rem;
      margin-left:.2rem;
      color:#a9a9a9;
      font-size:.3rem;
      height:.8rem;
      
  }
  .xiang{
      border-bottom:1px solid #a9a9a9;
  }
.MygroupContainer_time{
    margin-left:4rem;
}

.MygroupContainer_c{
    height:2.7rem;
    display:flex;
}

.MygroupContainer_c img{
    padding-top:.3rem;
    padding-left:.3rem;
    object-fit: cover;
    height: 2.2rem;
}

.MygroupContainer_f{
    padding-left:8rem;
    padding-top:.2rem;
    
}
.btn1{
    color:#474747;
    border:1px solid #474747;
    background-color: #fff;
    border-radius: .5rem;
    height:.5rem;
    width:1.5rem;
}

.MygroupContainer_c_t{
    position:relative;
    font-size:.2rem;
}

.title{
    font-size:.3rem;
    position:absolute;
    top:.2rem;
    left:.2rem;
    color:#474747;
}
.guige{
    font-size:.3rem;
    position:absolute;
    top:1.2rem;
    left:.2rem;
    color:#c3c3c3;
}
.count1{
    font-size:.3rem;
    padding-left:4.9rem; 
}
.count2{
    font-size:.3rem;
    padding-left:4.9rem; 
}
.jiage{
    font-size:.3rem;
    position:absolute;
    top:1.8rem;
    left:.2rem;
    color:#c3c3c3;
}
.shifu{
    font-size:.3rem;
    padding-top:2.3rem;
    color:#474747;
    padding-left:4.7rem;
}















.header_wen span{
    font-size:.35rem;
    font-weight:900;
}
.header{
    position:relative; 
}
.header_b{
    margin-top:1rem;
    height: 5.07rem;
    object-fit: cover;
}
.header_money{
    top:2.7rem;
    left:1rem;
    position:absolute;
    color:#fff;
    font-size:.6rem;
}
.btn button{
    height:.8rem;
    width:2rem;
    font-size:.2rem;
    border:1px solid #fff;
    color:#fff;
    border-radius: .5rem;
    position:absolute;
    top:2.2rem;
    right:1rem;
    background-color: transparent;
}
.header_wen_one{
    top:4.7rem;
    left:.8rem;
    position:absolute;
}
.header_wen_two{
    top:4.7rem;
    left:3.2rem;
    position:absolute;
}
.header_wen_three{
    top:4.7rem;
    left:5.7rem;
    position:absolute;
}
.header_wen_four{
    top:4.7rem;
    left:8.2rem;
    position:absolute;
}
.conter{
    position:relative;
    margin-left:.4rem;
    border-radius: .2rem;
}
.conter img{
    margin-top:.2rem;
    height: 3.07rem;
    object-fit: cover;
}
.onebtn{
    top:.3rem;
    left:.2rem;
    position:absolute;
    height:2.8rem;
    width:2.7rem;
    background-color: transparent;
    // background-color: red;
}
.twobtn{
    top:.3rem;
    left:3.2rem;
    position:absolute;
    height:2.8rem;
    width:2.7rem;
    background-color: transparent;
    // background-color: red;
}
.threebtn{
    top:.3rem;
    left:6.2rem;
    position:absolute;
    height:2.8rem;
    width:2.7rem;
    background-color: transparent;
    // background-color: red;
}
  
  
  `