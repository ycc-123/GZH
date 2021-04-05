import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { _paymentCode } from 'network/profile'
import { store } from 'store'
import jsBarCode from 'jsbarcode'
import { _lives } from "network/live"
import QRCode from 'qrcode-react'

import BetterScroll from 'common/betterScroll/BetterScroll'


var memberInterval
const MemberStyle = styled.div`
.hearder{
    width: 100%;
    background-color: #fff;
    border-radius: .2rem;
}

.huiyuanfu{
    color:#474747;
    display:flex;
    align-items:center;
    justify-content: center;
    height:2.5rem;
    line-height:2.5rem;
    font-size:.77rem;
    // font-weight:600;
    letter-spacing:.08rem;
}
.xian{
    height:1px;
    width:100%;
    background-color: #ddd;
}


.footer{
    padding: .4rem 0;
    text-align:center;
    display:flex;
    align-items:center;
    justify-content: center;
}
.btn{
    font-size:0.4rem;
    letter-spacing:.08rem;
    width:4.39rem;
    height:0.99rem;
    background-color: #fa5151;
    color:#fff;
    border-radius: .1rem;
}

.imgma div{
    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
}
.imgma>div>p{
    padding-left:.3rem;
    letter-spacing: .18rem;
}
.ss{


    margin-left: .2rem;
}
.ma1{
    margin-top:.69rem;
    height: 3rem;
    margin-left: .2rem;
    object-fit: cover;
    
}
.ma2{
    margin-top:.76rem;
    height: 4rem;
    margin-left: .2rem;
    object-fit: cover;
}
.fukuanma{
    letter-spacing:.08rem;
    margin-top:.8rem;
    display:flex;
    font-size:.5rem;
    color:var(--theme-font-color);
    display:flex;
    align-items:center;
    justify-content: center;

}
.fukuanma img{
    height:.5rem;
    margin-top: .2rem;
    margin-right: .15rem;
    object-fit: cover;
}
.fukuanma_wen{
    
}
.shuaxin{
    color:#a3a3a3;
    font-size:.4rem;
    display:flex;
    align-items:center;
    justify-content: center;
    margin-top:.35rem;
    letter-spacing:.08rem;
}


`

// 付款码页面

class Memberma extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
            uniacData: {}
        }

        this.updateCode = this.updateCode.bind(this)

        const { appConfig } = store.getState()
        const { uniacid } = appConfig

        this.networkConfig = {
            uniacidDetail: {
                action: 'uniacidDetail',
                data: {
                    uniacid,
                }
            },
        }
    }



    render() {

        document.title = "付款码";

        // const scrollStyle = {
        //     height: 'calc(100vh -.5rem)',
        //     padding: '.4rem .32rem',
        // }

        const scollConfig = {
            probeType: 1
        }
        const scrollStyle = {
            height: 'calc(100vh - 0px)',
            padding: '0 .32rem'
        }

        const { code } = this.state
        return (
            <MemberStyle>
                <BetterScroll config={scollConfig}
                    style={scrollStyle}
                    ref='scroll'>
                    <div>
                        <div className='hearder' >
                            {/* <div style={{height: '5rem'}}>

                            </div> */}
                            <div className='huiyuanfu'>会员付款码</div>

                            <div className='xian'></div>
                            <div className='imgma'>
                                <div >
                                    <img ref='barcode' className='ma1' alt="条形码" />
                                    <p>{this.state.code}</p>
                                </div>
                                <div style={{ marginTop: '.4rem' }} >
                                    <QRCode value={this.state.code} size={Number(200)}
                                        logo={this.state.uniacData.headimgsrc} logoHeight={Number(50)} logoWidth={Number(50)}>
                                    </QRCode>
                                </div>
                            </div>

                            <div className='fukuanma'>
                                <div><img src='https://res.lexiangpingou.cn/images/vip/refresh.png' alt="" /></div>
                                <div className='fukuanma_wen' onClick={this.updateCode}>刷新付款码</div>
                            </div>
                            <div className='shuaxin'>每两分钟自动刷新一次</div>
                        </div>

                        <div className='footer'><button className='btn' onClick={() => { this.props.history.push('/profile') }}>返回个人中心</button></div>
                    </div>
                </BetterScroll>

            </MemberStyle>
        )
    }

    /* componentDidUpdate = () => {
        console.log(this)
        this.refs.scroll.BScroll.refresh()

    } */

    componentDidMount = async () => {
        console.log(1)
        let Res = await _lives(this.networkConfig.uniacidDetail)
        this.setState({
            uniacData: Res.data.data
        }, () => {
            this.refs.scroll.BScroll.refresh()
        })

        const paymentCodeConfig = {
            action: 'memberPayCode',
            data: {
                memberid: store.getState().memberUserInfo.id
            }
        }
        this.updateCode()
        memberInterval = setInterval(() => {
            _paymentCode(paymentCodeConfig).then(res => {
                let code = res.data.data
                this.setState({
                    code,
                }, () => {
                    this.refs.scroll.BScroll.refresh()
                })
                let refBarCode = this.refs.barcode
                jsBarCode(refBarCode, code, {
                    format: "CODE128",//选择要使用的条形码类型
                    width: 1.9,//设置条之间的宽度
                    height: 100,//高度
                    displayValue: false,//是否在条形码下方显示文字
                    font: "fantasy",//设置文本的字体
                    textAlign: "center",//设置文本的水平对齐方式
                    textPosition: "bottom",//设置文本的垂直位置
                    textMargin: 6,//设置条形码和文本之间的间距
                    fontSize: 20,//设置文本的大小
                    background: "white",//设置条形码的背景
                    lineColor: "#474747",//设置条和文本的颜色。
                    margin: 10//设置条形码周围的空白边距
                })
            })

        }, 120000)
    }

    /* componentDidUpdate = async () => {
        console.log(2)
        this.refs.scroll.BScroll.refresh()
    } */

    updateCode() {
        const paymentCodeConfig = {
            action: 'memberPayCode',
            data: {
                memberid: store.getState().memberUserInfo.id
            }
        }
        _paymentCode(paymentCodeConfig).then(res => {
            let code = res.data.data
            this.setState({
                code,
            }, () => {
                this.refs.scroll.BScroll.refresh()
            })
            let refBarCode = this.refs.barcode
            jsBarCode(refBarCode, code, {
                format: "CODE128",//选择要使用的条形码类型
                width: 1.9,//设置条之间的宽度
                height: 100,//高度
                displayValue: false,//是否在条形码下方显示文字
                font: "fantasy",//设置文本的字体
                textAlign: "center",//设置文本的水平对齐方式
                textPosition: "black",//设置文本的垂直位置
                textMargin: 6,//设置条形码和文本之间的间距
                fontSize: 20,//设置文本的大小
                background: "white",//设置条形码的背景
                lineColor: "#474747",//设置条和文本的颜色。
                margin: 10//设置条形码周围的空白边距
            })
        })
    }

    componentWillUnmount() {
        clearInterval(memberInterval)
    }
}

export default withRouter(Memberma)

