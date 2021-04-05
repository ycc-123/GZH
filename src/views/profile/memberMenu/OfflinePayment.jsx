import React, { Component } from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode-react'
import { store } from 'store/index'
import { Toast } from "antd-mobile";
import { _getUniacDetail } from "network/api";
import { _getMember } from 'network/profile'

import axios from 'axios'

// 线下付款页面

const scrollStyle = {
    height: 'calc(100vh -.5rem)',
    padding: '.4rem .32rem',
}

export default class OfflinePayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputAmount: '',
            isShow: false,
            logo: '',
            payResultUrl: ''
        }
        this.confirmPayment = this.confirmPayment.bind(this)
        this.confirmPaymentClose = this.confirmPaymentClose.bind(this)
    }


    componentDidMount = () => {
        const getMemberConfig = {
            action: 'getMember',
            data: {
                memberid: store.getState().memberUserInfo.id

            }
        }
        axios.all([_getMember(getMemberConfig),
        _getUniacDetail()]).then(res => {
            if (parseInt(res[0].data.data.member_status) === 1) {
                this.setState({
                    logo: res[0].data.data.headimgsrc
                })
            } else {
                this.props.history.push('applymembership')
            }
        })
    }

    confirmPayment() {
        if (this.state.inputAmount === '') {
            Toast.info('请先输入金额', 2)
        } else {
            let openid = store.getState().appConfig.wxUserInfo.openid
            let memberid = store.getState().memberUserInfo.id

            let hash = window.location.hash
            let resultUrl = window.location.href.replace(hash, '#/offresult/') + this.state.inputAmount + '/' + openid + '/' + memberid
            this.setState({
                payResultUrl: resultUrl,
                isShow: !this.state.isShow
            })
        }

    }

    confirmPaymentClose() {
        this.setState({
            isShow: !this.state.isShow
        })
    }

    inputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {

        document.title = "线下收款";

        const isBlock = this.state.isShow ? 'flex' : 'none'
        return (
            <PaymentStyle>
                <div style={scrollStyle}>
                    <div className='top'>
                        <div className='top_title'>付款金额</div>
                        <div>
                            <div className='top_c'>
                                <span className='top_c_w'>￥</span>
                                <span><input placeholder='请输入付款金额' name="inputAmount" style={{ paddingLeft: ".2rem" }}
                                    onChange={this.inputChange.bind(this)}
                                    value={this.state.inputAmount} type="text" /></span>
                            </div>
                            <div className='xian'></div>
                        </div>

                    </div>

                    <div className='conter'>
                        <button className='btn' onClick={this.confirmPayment}>确认支付</button>
                    </div>

                    <div className='footer' style={{ display: isBlock }}>
                        <div id='payCodeParent'>
                            <QRCode value={this.state.payResultUrl} size={Number(180)}
                                logo={this.state.logo} logoHeight={Number(50)} logoWidth={Number(50)}
                            >
                            </QRCode>
                        </div>
                        <div className='footer_c'>请将二维码出示给核销员</div>
                        <div className="close"><img className='footer_f' onClick={this.confirmPayment} src='https://res.lexiangpingou.cn/images/vip/close.png' alt="" /></div>
                    </div>



                </div>


            </PaymentStyle>
        )
    }
}
const PaymentStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);

input::-webkit-input-placeholder{
    color:#d3d3d3;
    letter-spacing:.08rem;
    
}
.eweima{
    margin-top:.76rem;
}

.top_c_w{
    color:#474747;
    padding-left:.3rem;
    font-size:.6rem;
}
.top_c{
    margin-top:1.13rem;
}
.top_c span input{
    font-size:.5rem;
    border:none;
    color:#000;
}
.xian{
    padding-right:.4rem;
    margin-left:.4rem;
    margin-top:.2rem;
    height:1px;
    width:8.5rem;
    background-color: #ddd;
}
.top_title{
    letter-spacing:.05rem;
    font-weight:bold;
    padding-left:.4rem;
    padding-top:.4rem;
    font-size:.45rem;
    color:#474747;
}
.top{
    width:100%;
    height:3.55rem;
    background-color: #fff;
    border-radius: .1rem;
}
.conter{
    display:flex;
    align-items:center;
    justify-content: center;
    margin-top:.4rem;
}

.btn{
    letter-spacing:.05rem;
    font-size:.4rem;
    width: 100%;
    height: 1rem;
    background-color: var(--theme-font-color);
    color:#fff;
    border-radius: .1rem;
}
.footer{
    flex-direction: column;
    justify-content:center;
    align-items:center;
    margin-top:.4rem;
    background-color: #fff;
    border-radius: .1rem;
}
#payCodeParent{

    margin-top:.4rem;
}
.footer_t{
   
    // object-fit: cover;
}

.footer_c{
    letter-spacing:.01rem;
    color:#474747;
    font-size:.4rem;
    margin-top:.8rem;
}
.footer_f{
    margin-top:.8rem;
    height: .69rem;
    // margin-left: .2rem;
    object-fit: cover;
}
`