import React, { Component } from 'react'
import styled from 'styled-components'
import { Modal, Toast } from "antd-mobile"

import { _scoreExchange } from 'network/profile'

import { store } from 'store'


class ScroeCouponItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CouponId: '',
            sendout: this.props.item.quantity_sendout,
            stockNum: this.props.item.stockNum,
            memberscore: '',
            stockNums: this.props.stockNum


        }
        this.ScroeCoupon = this.ScroeCoupon.bind(this)
    }
    componentDidMount() {
        this.setState({
            CouponId: this.props.msg,

        })
        console.log(this.props.item.score)
    }

    ScroeCoupon() {
        if (this.state.stockNums <= 0) {
            Toast.info('已无库存', 2)
        } else {

            // 积分兑换
            const ScroeCouponConfig = {
                action: 'scoreExchange',
                data: {
                    uniacid: store.getState().appConfig.uniacid,
                    openid: store.getState().appConfig.wxUserInfo.openid,
                    exchangeType: 2,
                    id: this.state.CouponId
                }
            }
            // Math.floor(aa * 100) / 100
            _scoreExchange(ScroeCouponConfig).then(res => {
                console.log(res)
                let member = res.data.msg
                if (this.props.memberscore <= this.props.item.score) {
                    this.setState({
                        memberscore: this.props.memberscore,
                    })
                } else {
                    this.setState({
                        memberscore: parseFloat(this.props.memberscore) - parseFloat(this.props.item.score) + ".00",
                        stockNums: this.state.stockNums - 1
                    })
                }
                // const  zxc=this.props.memberscore===1 ? this.props.memberscore - this.props.item.score + ".00" : this.props.memberscore 
                // this.setState({
                //     memberscore: zxc ,
                //     stockNums: this.state.stockNums - 1
                // })
                this.props.hans(this.state.memberscore);
                Toast.info(member)

            })
        }
    }

    formData(data) {
        return new Date(parseInt(data) * 1000).toLocaleString().replace(/:\d{0,2}$/, ' ');
    }
    render() {
        const { item } = this.props
        let datatime = item.end_time
        Number(datatime)
        const end_time = this.formData(Number(datatime))
        const quan = item
        const alert = Modal.alert;


        return (
            // <div className='juans' >
            //     <div className='juanone'>
            //         <div className='juan'>
            //             <img src='https://res.lexiangpingou.cn/images/vip/jifenb.png' alt="" />
            //             <span className='juan_fu'>￥</span><span className='juan_yuan'>{quan.value}</span>
            //             <span className='kucun'>库存:{this.state.stockNums}张</span>
            //             <span className='juan_jifen'>所需积分{quan.score}分</span>
            //             <span className='juan_wu'>{quan.name}</span>
            //             <span className='jian_yxq'>有效期至<span>{end_time}</span></span>
            //             <button className='duihuan'
            //                 onClick={() =>
            //                     alert('兑换该优惠券', '', [
            //                         { text: '取消', onPress: () => console.log('cancel') },
            //                         { text: '确认', onPress: () => { this.ScroeCoupon() } },])}
            //             ></button>
            //         </div>
            //     </div>
            // </div>
            <Style>
                <div className='box'>
                    <span className='left-round'></span>
                    <div className='content'>
                        <div style={{ marginLeft: '1rem', paddingRight: '.32rem' }}>
                            <p>
                                <span style={{ marginRight: '.1rem', fontSize: '.4rem', fontWeight: '500', color: 'var(--theme-font-color)' }}>&yen;</span>
                                <span style={{ fontSize: '.6rem', fontWeight: '800', color: 'var(--theme-font-color)', lineHeight: '1' }}>{quan.value}</span>
                            </p>
                            <p style={{ fontSize: '.32rem', color: '#474747' }}>库存:{this.state.stockNums}张</p>
                            <p style={{ fontSize: '.32rem', color: 'var(--theme-font-color)' }}>所需积分{quan.score}分</p>
                        </div>
                        <div style={{ marginLeft: '.4rem', color: 'rgba(71, 71, 71, .5)', fontSize: '.32rem' }}>
                            <p>{quan.name}</p>
                            <p style={{ marginTop: '.2rem' }}>有效期至{end_time}</p>
                        </div>
                    </div>
                    <div className='line'></div>
                    <div className='content-right' onClick={() =>
                        alert('兑换该优惠券', '', [
                            { text: '取消', onPress: () => console.log('cancel') },
                            { text: '确认', onPress: () => { this.ScroeCoupon() } },])}>
                        立即兑换
                    </div>
                    <span className='right-round'></span>
                </div>
            </Style>
        );
    }
}

const Style = styled.div`

.box {
    position: relative;
    width: 9.36rem;
    height: 2.21rem;
    margin-bottom: .13rem;
    .left-round {
        display: block;
        position: absolute;
        top: 50%;
        z-index: 10;
        transform: translate(-50%, -50%);
        width: .6rem;
        height: .6rem;
        border-radius: 50%;
        background-color: var(--bg-color);
    }
    .content {
        display: flex;
        align-items: center;
        position: relative;
        top: 0;
        left: 0;
        z-index: 1;
        width: 8.12rem;
        height: 100%;
        background-color: #fff;
        border-radius: .13rem;
    }
    .line {
        position: absolute;
        top: 50%;
        left: 3.32rem;
        transform: translate(0, -50%);
        z-index: 10;
        width: 1px;
        height: 1.4rem;
        background-color: #ccc;
    }
    .content-right {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        width: calc(100% - 8.02rem);
        height: 100%;
        background-color: var(--theme-font-color);
        writing-mode: vertical-lr;
        color: #fff;
        font-weight: bold;
        font-size: .32rem;
        border-top-right-radius: .13rem;
        border-bottom-right-radius: .13rem;
        overflow: hidden;
    }
    .right-round {
        display: block;
        position: absolute;
        top: 50%;
        right: 1.24rem;
        transform: translate(50%, -50%);
        z-index: 10;
        width: .6rem;
        height: .6rem;
        border-radius: 50%;
        background-color: var(--theme-font-color);
    }
}



`

export default ScroeCouponItem;