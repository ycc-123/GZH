import React, { Component } from 'react';
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import { _forwardLottery } from 'network/profile'
import { store } from 'store/index'
import { Toast } from 'antd-mobile'


var waitPush

const ForwardLotteryStyle = styled.div`

.forwardLottery{

}
.lotteryTop{
    height: 6rem;
}

.lotteryTop>img{
    width: 100%;
    height: auto;
}

.lotteryInfo{
    margin: 0 .32rem;
    background-color: white;
    border-radius: .13rem;

}
.lotteryInfo>ul{
    margin-top: .133333rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.lotteryInfo>ul>li:first-child{
    padding: .2rem 0;
    font-size: .35rem;
    font-weight: bold;
    color: var(--common-font-color);
}
.lotteryInfo>ul>li{
    padding-bottom:.15rem;
}

.lotteryForm{
    margin: 0 .32rem;
    border-radius: .13rem;
    margin-top: .13333rem;
    height: 7rem;
    background-color: white;
}



.formContainer{
    border-radius: 1rem;
    margin: 0 .4rem;
    display: flex;
    flex-direction: column;
    padding-top: .4rem;

}

.inputItem{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background: #f4f4f4;
    padding: .3rem .4rem;
    border-radius: 1rem;
    margin-bottom: .2rem;
    position:relative;
}
.yanzma{
    // margin-left: .8rem;
    padding: .2rem 0;
    background-color: var(--theme-font-color);
    color:white;
    width: 3rem;
    text-align: center;
    border-radius: 1rem;
    position:absolute;
    top:.15rem;
    right:.2rem;
    /*left: 0;*/

}

.imgname{
    height: .47rem;
    padding-right:.2rem;
}


.inputName{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 1.0666rem;
    padding-left: .4rem;
    color: #cccccc;
}


.nowJoin{
    padding-top:.3rem;
    margin-top: .8rem;
    background-color: var(--theme-font-color);
    color:white;
    height: 1.06666rem;
    border-radius: 1rem;
    text-align:center;
    
}

.hdyTitle{
    margin-top: .4rem;
    text-align: center;
}
`
// 转发抽奖首页
class ForwardLottery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDetail: [],
            bannerImg: '',
            content: [],
            activity_region: [],
            name: '',
            phone: '',
            code: '',
            imgUrl: {
                'bg': 'https://res.lexiangpingou.cn/images/vip/lottery.png',
                'icon': 'https://res.lexiangpingou.cn/images/vip/mymy.png',
                'phone': 'https://res.lexiangpingou.cn/images/vip/Lphone.png',
                'code': 'https://res.lexiangpingou.cn/images/vip/Lcode.png',
            }
        }
        this.joinNowActive = this.joinNowActive.bind(this)
        this.inputChange = this.inputChange.bind(this)
    }

    async componentDidMount() {
        const { wxUserInfo, uniacid } = store.getState().appConfig
        const lotteryConfig = {
            // 活动详情获取
            action: 'activityDetail',
            data: {
                uniacid: uniacid,
                openid: wxUserInfo.openid,
                id: this.props.match.params.id
            }
        }

        let activeDetail = await _forwardLottery(lotteryConfig)
        if (activeDetail.data.status === 200) {

            console.log(activeDetail)
            let activity_region = activeDetail.data.data[0].activity_region
            let content = activeDetail.data.data[0].content
            let bannerImg = activeDetail.data.data[0].tab_logo
            this.setState({
                activeDetail: activeDetail.data.data,
                activity_region,
                content,
                bannerImg,
            })
        }
    }

    inputChange(e) {
        let name = e.target.name
        let value = e.target.value
        this.setState({
            [name]: value
        })
    }

    async joinNowActive(event) {
        const { wxUserInfo, uniacid } = store.getState().appConfig
        const { name, phone } = this.state
        if (name === '') {
            Toast.info('姓名不能为空', 1)
        } else if (phone.length < 11) {
            Toast.info('输入正确的手机号', 1)
        } else {
            const signlotteryCodeConfig = {
                // 报名获取活动码
                action: 'signlotteryCode',
                data: {
                    uniacid: uniacid,
                    id: this.props.match.params.id,
                    openid: wxUserInfo.openid,
                    name: this.state.name,
                    mobile: this.state.phone
                }
            }
            let joinResult = await _forwardLottery(signlotteryCodeConfig)
            if (joinResult.data.status === 200) {
                Toast.success(joinResult.data.msg, 1)
                waitPush = setTimeout(() => {
                    this.props.history.push('/lotteryseccess')
                }, 2000)
            } else {
                Toast.fail(joinResult.data.msg, 1)
                waitPush = setTimeout(() => {
                    this.props.history.push('/profile')
                }, 2000)
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(waitPush)
    }

    render() {

        document.title = "转发抽奖";


        return (
            <ForwardLotteryStyle>
                <div className="forwardLottery">

                    <div className="lotteryTop">
                        <img src={this.state.imgUrl.bg} alt="" />
                    </div>
                    <div className="lotteryInfo">
                        <ul>
                            <li>活动方式</li>
                            {this.state.content.map((item, key) => {
                                return (
                                    <li key={key}>{item}</li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="lotteryForm">
                        <form action="" onSubmit={this.joinNowActive} className="actionForm">
                            <div className="formContainer">
                                <div className="inputItem">
                                    <img src={this.state.imgUrl.icon} alt="" className="imgname" />
                                    <input type="text" name="name" onChange={this.inputChange} value={this.state.name} style={{ width: '100%', border: 'none', color: '#3e4246', backgroundColor: '#f4f4f4' }} className="inname" placeholder="请输入你的姓名" />
                                </div>

                                <div className="inputItem">
                                    <img src={this.state.imgUrl.phone} alt="" className="imgname" />
                                    <input type="text" name="phone" onChange={this.inputChange} value={this.state.phone} style={{ border: 'none', color: '3e4246', backgroundColor: '#f4f4f4' }} maxLength="11" minLength="11" className="inname" placeholder="请输入您的手机号" />
                                </div>

                                {/* <div className="inputItem" style={{ display: "block" }}>
                                    <img src={this.state.imgUrl.code} alt="" className="imgname" />
                                    <input type="text" name="code" onChange={this.inputChange} value={this.state.code} style={{ border: 'none', color: '3e4246', backgroundColor: '#f4f4f4' }} className="inname" placeholder="验证码" />
                                    <div className='yanzma'>点击获取验证码</div>
                                </div> */}
                                <div className='nowJoin' onClick={this.joinNowActive} >立即参与</div>
                            </div>
                        </form>

                    </div>
                </div>
            </ForwardLotteryStyle>
        );
    }
}

export default withRouter(ForwardLottery)