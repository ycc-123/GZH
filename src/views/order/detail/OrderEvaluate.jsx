import React, { Component } from 'react'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'
import { _evaluationPage } from 'network/order'
import { store } from "store/index";
// 售后评价页面
export default class OrderEvaluate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            evaluationdan: [],
            evaluationPing: '',
            type: '',
            ping: false,
            pinga: false,
            pingb: false,
            pingc: false,
            active: false,
            color: 'var(--theme-font-color)',
            border: '1px solid var(--theme-font-color)'
        }
    }

    componentDidMount() {
        let { id } = this.props.match.params
        const { appConfig } = store.getState()
        const evaluationPageConfig = {
            action: 'evaluationPage',
            data: {
                uniacid: appConfig.uniacid,
                openid: appConfig.wxUserInfo.openid,
                id

            }
        }
        _evaluationPage(evaluationPageConfig).then(res => {

            // 判断是不是团
            let type = res.data.data[0].selltype
            console.log(type)
            this.setState({
                type
            })
            if (this.state.type === "0") {
                console.log(res)
                let evaluationdan = res.data.data[0].goods
                this.setState({
                    evaluationdan,
                })
            } else {
                console.log(res)
                let evaluationPing = res.data.data[0]
                this.setState({
                    evaluationPing,
                })
                console.log(this.state.evaluationPing)
            }

        })

    }

    active = () => {
        if (this.state.color === 'var(--theme-font-color)' || this.state.border === '1px solid var(--theme-font-color)') {
            this.setState({
                color: '#474747',
                border: '1px solid #e6e6e6'
            })
        } else if (this.state.color === '#474747' || this.state.border === '1px solid #e6e6e6') {
            this.setState({
                color: 'var(--theme-font-color)',
                border: '1px solid var(--theme-font-color)',
            })
        }
    }
    del = () => {
        this.setState({
            ping: !this.state.ping
        })
    }








    render() {
        const scrollConfig = {
            probeType: 1
        }
        const scrollStyle = {
            height: 'calc(100vh -5rem)',
            padding: '.4rem .32rem',
            position: 'relative'
        }

        return (
            <SoftStyle>
                <div className='soft'>

                    <BetterScroll config={scrollConfig} style={scrollStyle}>
                        <div className='header'>
                            {
                                this.state.type === 0 && this.state.evaluationdan.map((item, key) => {
                                    console.log(item)
                                    return (
                                        <div className='header_top' key={key}>
                                            <span><img className='img' src={item.gimg} alt="售后" /></span>
                                            <span className='order'>
                                                <p className='order_title'>{item.goodsname}</p>
                                                <p className='order_count'>数量：{item.num}</p>
                                                <p className='order_money'>￥{item.oprice}</p>
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='conter'>
                            <div>
                                <ul className='evaluate'>
                                    <li onClick={this.active.bind(this)}
                                        style={{ color: this.state.color, border: this.state.border }}
                                    >好用</li>
                                    <li

                                    >正品</li>
                                    <li

                                    >便宜</li>
                                    <li

                                    >物流快</li>
                                    <li

                                    >质量好</li>
                                    <li

                                    >服务好</li>
                                    <li

                                    >其他</li>
                                </ul>
                            </div>
                            <div>
                                <ul className='evaluate_conter'>
                                    <li >
                                        <span><img onClick={this.del.bind(this)} src={this.state.ping === false ? 'https://res.lexiangpingou.cn/images/vip/hao1.png' : 'https://res.lexiangpingou.cn/images/vip/address1.png'} alt="" /></span>
                                        {/* { this.state.ping === "1"?require('assets/img/hao1.png'):require('assets/img/address1.png')} */}
                                        {/* <p>好评</p> */}
                                    </li>
                                    <li>
                                        <img src='https://res.lexiangpingou.cn/images/vip/zhong1.png' alt="" />
                                        {/* <p>中评</p> */}
                                    </li>
                                    <li>
                                        <img src='https://res.lexiangpingou.cn/images/vip/cha1.png' alt="" />

                                    </li>
                                </ul>
                            </div>
                            <div></div>
                            <div><textarea className='area' placeholder='简单描述你所能提供的产品'></textarea></div>
                            <div className='footer'><button className='button'>立即评价</button></div>
                        </div>
                    </BetterScroll>
                </div>
            </SoftStyle>
        )
    }
}
const SoftStyle = styled.div`

.evaluate{
    display:flex;
    flex-flow: wrap;
}
.evaluate li{
    height:.6rem;
    width:2.3rem;
    border:1px solid #e6e6e6;
    border-radius: .2rem;
    text-align:center;
    margin-left:.6rem;
    margin-top:.4rem;
    color:#474747;

}
.evaluate_conter{
    display:flex;
    flex:row;
    border-top:1px solid #dadada;
    border-bottom:1px solid #dadada;
    margin-top:.3rem;
    padding-left:.1rem;
    height:1.2rem;
}
.evaluate_conter li{
    color:var(--theme-font-color);
    display:flex;
    flex:1;
    align-items:center;
    padding-left:.3rem;
}
.tex{
    width:100%;
}
.evaluate_conter img{
    margin-top:.1rem;
    height: .8rem;
    margin-left: .2rem;
    object-fit: cover;
}
.evaluate_conter li p{
    margin-top:.2rem;
    margin-left:.2rem;
}
.area{
    border-top:1px solid #dadada;
    border-bottom:1px solid #dadada;
    border-left:none;
    border-right:none;
    margin-top:.4rem;
    height:3.6rem;
    width: 100%;
}
.button{
    margin-top:.8rem;
    height:.9rem;
    width:5rem;
    text-align:center;
    background-color: var(--theme-font-color);
    color:#fff;
    border-radius: .5rem;
}
.footer{
    display:flex;
    align-items:center;
    justify-content: center;
}
.order_money{
    margin-top:.18rem;
}
.conter{
    width:100%;
    height:11rem;
    margin-top:.16rem;
    background-color: #fff;
    border-radius: .2rem;
}
.header{
    width:100%;
    height:2.36rem;
    background-color: #fff;
    border-radius: .2rem;
}
.header_top{
    display:flex;
    flex:row;
}
.img{
    
    margin-top:.18rem;
    height: 2rem;
    margin-left: .2rem;
    object-fit: cover;
}
.order{
    margin-top:.18rem;
    margin-left:.18rem;
}
.order_title{
    color:#474747;
    font-size:.3rem;
    
}
.order_count{
    color:#b2b2b2;
    font-size:.3rem;
    margin-top:.14rem;
}

`