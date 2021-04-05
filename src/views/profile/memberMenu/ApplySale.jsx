import React, { Component } from 'react'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'

// 查看售后流程页面

export default class ApplySale extends Component {
    constructor() {
        super()
        this.state = {
        }
    }
    render() {
        const scrollConfig= {
            probeType:1
        }
        const scrollStyle={
            height: 'calc(100vh -.5rem)',
            padding: '.4rem .32rem',
        }
        return (
            <SoftStyle>
                <div className='soft'>
                    {/* <div className='xian'></div>
                    <div className='sxian1'></div>
                    <div className='sxian2'></div>
                    <div className='circle1'></div>
                    <div className='circle2'></div>
                    <div className='circle3'></div> */}
                <BetterScroll config={scrollConfig}  style={scrollStyle}>

                    <div className='xian'></div>
                    <div className='sxian1'></div>
                    <div className='sxian2'></div>
                    <div className='circle1'></div>
                    <div className='circle2'></div>
                    <div className='circle3'></div>
                <div className='hearder'>
                        <img src='https://res.lexiangpingou.cn/images/vip/soft.png' alt="售后" />
                        <div >
                            <p>已收到您的售后申请，</p>
                            <p>请耐心等待3-5个工作日。</p>
                        </div>
                    </div>
                    <div className='conter_title'>
                        <p>售后流程</p>
                    </div>

                    <div className='conter_1'>
                    <span className='yuan_li'></span>
                    <span>
                        <p className='conter_wen'>售后申请已提交</p>
                        <p className='conter_time'>
                            <span className='conter_time1'>2019-01-07  </span>
                            <span className='conter_time2'>11:53:00</span>
                        </p>
                    </span>
                    </div>

                    <div className='dispose'>
                    <div className='conter_1'>
                    <span className='yuan_li'></span>
                    <span>
                        <p className='conter_wen'>商家正在受理中</p>
                        <p className='conter_time'>
                            <span className='conter_time1'>2019-01-07  </span>
                            <span className='conter_time2'>11:53:00</span>
                        </p>
                    </span>
                    </div>
                    </div>

                    <div className='dispose'>
                    <div className='conter_1'>
                    <span className='yuan_li'></span>
                    <span>
                        <p className='conter_wen'>商家正在受理中</p>
                        <p className='conter_time'>
                            <span className='conter_time1'>2019-01-07  </span>
                            <span className='conter_time2'>11:53:00</span>
                        </p>
                    </span>
                    </div>
                    </div>
                    







                   </BetterScroll> 
                </div>
            </SoftStyle>
        )
    }
}
const SoftStyle = styled.div`

.circle1{
    position:absolute;
    top:6.1rem;
    left:.65rem;
    background-color: var(--theme-font-color);
    height:.29rem;
    width:.29rem;
    border-radius: 50%;
}
.circle2{
    position:absolute;
    top:9rem;
    left:.65rem;
    background-color: var(--theme-font-color);
    height:.29rem;
    width:.29rem;
    border-radius: 50%;
}
.circle3{
    position:absolute;
    top:11.85rem;
    left:.65rem;
    background-color: var(--theme-font-color);
    height:.29rem;
    width:.29rem;
    border-radius: 50%;
}
.sxian1{
    position:absolute;
    top:6.8rem;
    left:.78rem;
    height:1.75rem;
    width:2px;
    background-color: var(--theme-font-color);
}
.sxian2{
    position:absolute;
    top:9.7rem;
    left:.78rem;
    height:1.75rem;
    width:2px;
    background-color: var(--theme-font-color);
}
.sxian3{
    position:absolute;
    top:6.8rem;
    left:.78rem;
    height:1.75rem;
    width:2px;
    background-color: var(--theme-font-color);
}


.hearder{
    width:100%;
    background-color: #fff;
    height:3rem;
    border-radius: .3rem;

}
.hearder img{

    margin-top: .4rem;
    height: 2.2rem;
    margin-left: .5rem;
}
.hearder div{
    position:absolute;
    top:1rem;
    left:3.5rem;
    font-size:.4rem;
    letter-spacing:.04rem;
    line-height:.8rem;
    color:#474747;
}
.conter_title p{
    color:#fff;
    font-size:.6rem;
    font-weight: 500;
    margin-top: .5rem;
}
.xian{
    position:absolute;
    top:5rem;
    height:1px;
    width:10000px;
    background-color: #90939a;
}




.conter_title p{
    color:#fff;
    font-size:.6rem;
    font-weight: 500;
    margin-top: .5rem;
}
.conter_1{
    display:flex;
    flex:row;
}
.conter_1 .yuan_li{
    margin-left: .2rem;
    margin-top: 1.3rem;
    height:20px;
    width:20px;
    border:2px solid var(--theme-font-color);
    border-radius: 50%;
}

.yuan_wai{
    margin-top: 1.3rem;
    height:16px;
    width:16px;
    background-color: red;
    border-radius: 50%;
}
.conter_wen{
    margin-top: 1rem;
    margin-left:.3rem;
    font-size:.4rem;
    color:#fff;
}
.conter_time{
    margin-left:.3rem;
    font-size:.3rem;
    margin-top:.1rem;
}

.conter_time1{
    color:#b3b3b3;
    font-weight:600;
}
.conter_time2{
    color:#b3b3b3;
}
.dispose{
    margin-top:.8rem;
}

`