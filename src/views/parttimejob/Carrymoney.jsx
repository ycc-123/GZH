import React, { PureComponent, createRef } from 'react'
import { withRouter } from 'react-router-dom'

import styled from 'styled-components'
import { Toast } from 'antd-mobile'
import { _applywithdraw, _iwantWithdraw, _getMemberDetails } from 'network/profile'
import { store } from 'store'

class Carrymoney extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            //   active: true
            ketixin: '',
            count: '',
            yhuname: ''
        }
        this.input = new createRef()
    }

    componentDidMount() {

        const getMemberDetailsConfig = {
            action: 'getMemberDetails',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,
            }
        }

        _getMemberDetails(getMemberDetailsConfig).then(res => {
            console.log(res.data.data.nickname)
            this.setState({
                yhuname: res.data.data.nickname
            })
        })

        const iwantWithdrawConfig = {
            action: 'iwantWithdraw',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,

            }
        }

        _iwantWithdraw(iwantWithdrawConfig).then(res => {
            console.log(res)
            let ketixin = res.data.data.wallet
            this.setState({
                ketixin: ketixin ? ketixin : 0
            })
        })
    }
    quan() {
        this.input.current.value = this.state.ketixin
    }

    tixin() {
        const exchangedConfig = {
            action: 'applywithdraw',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,
                amount: this.input.current.value

            }
        }
        _applywithdraw(exchangedConfig).then(res => {
            if (res.data.status === 200) {
                Toast.info('提现成功')
            } else if (res.data.status === 400) {
                Toast.info(res.data.msg)
            }
        })
    }
    chakan() {
        this.props.history.push('/jobtxjr')
    }
    render() {
        const scrollStyle = {
            height: 'calc(100vh -.5rem)',
            padding: '.2rem .32rem 0',
        }
        return (
            <CarrymoneyStyle>
                <div style={scrollStyle}>
                    <div className='header'>
                        <div>到账账户</div>
                        <p>微信账户（{this.state.yhuname}）</p>
                    </div>

                    <div className='conter'>
                        <div>提现金额</div>
                        <div className='money'>
                            <span><input name="name" type="tel" placeholder='请输入大于1的金额' ref={this.input} /></span>
                            <span><img src='https://res.lexiangpingou.cn/images/vip/jianzclose.png' alt="" /></span>
                        </div>
                        <div className='footer'>
                            <p><span>可提现金额</span><span>￥{this.state.ketixin ? this.state.ketixin : 0}</span></p>
                            <article onClick={this.quan.bind(this)}>全部提现</article>
                        </div>
                    </div>

                    <div className='btn'>
                        <button onClick={this.tixin.bind(this)}>提现</button>
                    </div>

                    <div className='jiru' onClick={this.chakan.bind(this)}>查看提现记入</div>
                    {/* this.props.history.push('/Memberma') */}
                </div>
            </CarrymoneyStyle>
        )
    }
}
const CarrymoneyStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);

input::-webkit-input-placeholder{
    color:#d7d7d7;
}
.jiru{
    color: var(--theme-font-color);
    width:9.5rem;
    height:1rem;
    position:absolute;
    bottom:.2rem;
    text-align:center;
}
.btn button{
    color:#fff;
    background-color: var(--theme-font-color);
    width:9.3rem;
    margin-right:2rem;
    height:1rem;
    position:absolute;
    border-radius: .5rem;
    bottom:1.5rem;
}
.footer p{
    color:#474747;
}
.footer article{
    color:var(--theme-font-color);
    cursor:pointer;
}
.footer{
    margin-right:.4rem;
    display:flex;
    justify-content: space-between;
}
.money img{
    margin-left:.4rem;
    padding-top:.4rem;
    height: 1rem;
    object-fit: cover;
}
.money input{
    width:7.5rem;
    height:2rem;
    font-size:.7rem;
    background-color: transparent;
    border:none;
}
.money{
    margin-right:.4rem;
    height:2.1rem;
    border-bottom:1px solid #cecccd;
}
.conter div{
    margin-left:.3rem;
    padding-top:.3rem;
    color:#474747;
    font-size:.4rem;
}
.header div{
    margin-left:.2rem;
    display:flex;
    align-items:center;
    justify-content: center;
    color:#474747;
    font-size:.4rem;
}
.header p{
    display:flex;
    align-items:center;
    justify-content: center;
    color:#a3a3a3;
    font-size:.4rem;
}
.header{
    display:flex;
    justify-content: space-between;
    width:100%;
    height:1.5rem;
    background-color: #fff;
    border-radius: .2rem;
}
.conter{
    margin-top:.2rem;
    width:100%;
    height:4.1rem;
    background-color: #fff;
    border-radius: .2rem;
}
`

export default withRouter(Carrymoney)