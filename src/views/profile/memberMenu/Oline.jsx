import React, { Component } from 'react'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'

// 会员充值页面

class Oline extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const scrollConfig = {
            probeType: 1
        }
        const scrollStyle = {
            height: 'calc(100vh - 1.5rem)',
            top: '.2rem',
            left: '.32rem',
            right: '.32rem',
            bottom: '0',
            // position: 'relative',
            // padding: '0 .32rem',
            // margin-top: '.2rem',
            // width: '100%
        }

        return (
            <PriceStyle>
                <div className='price'>

                <BetterScroll config={scrollConfig} style={scrollStyle}>
                    {/* 子组件 */}
                <div className='pricetitle'>
                    账户余额（元）
                </div>

                <div className='price-b'>
                    <div className='price-b-left'>
                    <div className='price-b-left-l'>￥</div>
                    <span className='price-b-left-r'>100.00</span>
                    </div>
                    <div className='price-b-right'>
                    <button className='price-b-right-button'>立即充值</button>
                    </div>

                </div>

                <div className='price-c'>
                    <ul className='transaction'>
                        <li className='transaction_one'>交易流水</li>
                        <div className='hr'/>
                        <li className='transaction_two'>
                        <div>
                            <p className='xiaofei'>消费余额</p>
                            <p className='time'>2020/03/03  16:11:03</p>
                        </div>
                        <span className='money'>-10.30</span>
                        </li>
                        <div className='hr'></div>
                    </ul>
                </div>

                </BetterScroll>
                </div>
            </PriceStyle>
        );
    }
}
const PriceStyle = styled.div`

.price{
    padding: 0 .32rem;
    margin-top: .2rem;


}
.hr{
    border-bottom:1px solid #eee;
    background-color: #eee;

}
.pricetitle{
    color:#fff;
    font-size: .4rem;
    font-weight: bold;
}
.price-b{
    display: flex;
    flex-direction: row;
}
.price-b-left{
    display:flex;
    color:#fff;
}
.price-b-left-l{
    font-size: .5rem;
    padding-top:2.3rem;
    

}
.price-b-left-r{
    padding-top:1.9rem;
    font-size: 0.9rem;

    
}

.price-b-right{
    
    
}


.price-b-right-button{
    color:#fff;
    text-align：center;
    font-size: .5rem;
    // font-weight: bold;
    width: 3.5rem;
    height: 1.2rem;
    border-radius: 1.5rem;
    position: absolute;
    right:0rem;
    top: 2.4rem;
    background-color: var(--theme-font-color);
}
// price-c{
//     display: flex;
//     flex-direction: column;
//     width: 100%;
//     height: 3rem;
//     background-color: white;
//     border-radius: .133rem;
//     margin-top: 0.32rem;
// }

.transaction{
    
    position: absolute;
    width:100%;
    border-radius: 0.5rem;
    height:200px;
    top:4.8rem;
    background-color: #fff;
    
}
.transaction_one{

    color:#474747;
    height:1rem;
    line-height: 1rem;
    font-size: .32rem;
    padding-left:.5rem;

}
.transaction_two{

    height:1.5rem;
    color:#474747;
    font-size: .4rem;
    padding-left:.5rem;
    line-height: 1.5rem;
    display：flex;
    flex:row;
    border-botom:1px soild red;
}
.money{
    color:#474747;
    font-size: .4rem;
    position: absolute;
    padding-left:.5rem;
}
.time{
    color:#848484;
    font-size: .32rem;
    position: absolute;
    top:1.3rem;


}
.xiaofei{
    color:#474747;
    position: absolute;
    top:0.85rem;
    font-size: .32rem;
}
.money{
    position: absolute;
    top:1.1rem;
    right:.5rem;
    color:#ff8900;
    font-size: .5rem;
}


 `
export default Oline;