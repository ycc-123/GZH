import React, { Component, createRef } from 'react';
import { withRouter } from 'react-router-dom'
import { store } from 'store/index'
import { Coupon } from 'store/actionCreators'

import BarCode from 'jsbarcode'
import { Toast } from 'antd-mobile'

class CouponItem extends Component {
    constructor(props) {
        super(props);
        this.state = {

            codeType: 'CODE128A',
            isDetail: false,
            random: 'couponcode_' + (Math.random() * 10000).toFixed(0)
        }
        this.imgRef = createRef()

        this.ChangeDetailShow = this.ChangeDetailShow.bind(this)
    }

    ChangeDetailShow() {
        if (this.props.status === 'wsy') {
            this.setState({
                isDetail: !this.state.isDetail
            })
            console.log(132)
            let couponcode = this.props.values.couponcode
            let refCouponCode = this.refs.couponcode
            // 生成一维码
            BarCode(refCouponCode, couponcode, {
                format: this.state.codeType,// 选择要使用的条形码类型
                width: 1.5,// 设置条之间的宽度
                height: 70,// 高度
                displayValue: true,// 是否在条形码下方显示文字
                text: couponcode,// 覆盖显示的文本
                fontOptions: "400 ",//使文字加粗体或变斜体
                font: "fantasy",//设置文本的字体
                textAlign: "center",//设置文本的水平对齐方式
                textPosition: "bottom",//设置文本的垂直位置
                textMargin: 6,//设置条形码和文本之间的间距
                fontSize: 20,//设置文本的大小
                background: "white",//设置条形码的背景
                lineColor: "#474747",//设置条和文本的颜色。
                margin: 1//设置条形码周围的空白边距
            })
        }


        // this.setState({
        //   thisBarcode,
        // })

    }

    onUseCoupon(values) {

        // 如果是订单进入可以直接使用  个人中心进入跳转到首页购物

        let price = Number(this.props.match.params.price)

        // 第一达到使用条件
        // 总价 - 优惠额度 应该大于等于 0.01
        //

        if (price) {
            let least = values.at_least ? Number(values.at_least) : ""
            if (least !== "") {
                console.log(least)
                console.log(price)
                let tmp = least - price
                if (tmp < 0) {
                    // 可以使用
                    // 请求使用优惠券接口
                    // 总价 - 优惠额度 应该大于等于 0.01
                    price = price * 100
                    let cash = values.cash * 100
                    if (price - cash > 0) {
                        const action = Coupon(values)
                        store.dispatch(action)
                        Toast.info("使用成功", 1)
                        this.props.history.goBack(-1)
                    } else {
                        Toast.info('支付金额不能少于零', 2)
                    }
                } else {
                    Toast.info("还差多少" + tmp + "可以使用", 2)
                }
            }
        } else {
            this.props.history.push('/home')
        }

    }


    render() {
        const { values, status } = this.props
        const couponShow = this.state.isDetail ? '.2rem .2rem 0 0' : '.2rem';
        const detail = this.state.isDetail ? 'block' : 'none';
        const ysycolor = status === 'ysy' ? 'ysyColor' : '';
        const ygqcolor = status === 'ygq' ? 'ygqColor' : '';

        // 样式
        let styleContent = "couponContent " + ysycolor + ygqcolor
        const hdingbutton = (status === 'ysy' || status === 'ygq') ? 'none' : 'block';
        // const zhang = (status === 'ysy' || status === 'ygq') ? 'block': 'none' ;
        const yigq = (status === 'wsy' || status === 'ygq') ? 'none' : 'block';
        const yisy = (status === 'wsy' || status === 'ysy') ? 'none' : 'block';
        // console.log(ysycolor,'=====',ygqcolor,'====',hdingbutton)
        return (

            <div className={styleContent} style={{ padding: '0 .32rem' }}>
                <div className='conten'>
                    <div className="areaTop">
                        <p className="couponQuota">
                            <span>￥</span>{values.cash}
                        </p>
                        <div className="couponClass">
                            <p>{values.name}</p>
                            <ul>
                                <li>{values.is_last_least ? '无限制' : `满${values.at_least}`}</li>
                                <li>有效期至{values.end_time}</li>
                            </ul>
                        </div>
                        <img style={{ display: yigq }} className='zhang' src='https://res.lexiangpingou.cn/images/vip/aabb.png' alt="" />
                        <img style={{ display: yisy }} className='zhang' src='https://res.lexiangpingou.cn/images/vip/yiguoqi.png' alt="" />
                        <div className="couponOption">
                            <button style={{ display: hdingbutton }} onClick={() => { this.onUseCoupon(values) }}>
                                立即使用
                        </button>
                        </div>
                    </div>
                    <div className="areaBottom" style={{ borderRadius: couponShow }}>
                        <p>{values.description}</p>
                        <div onClick={this.ChangeDetailShow} >
                            {this.state.isDetail ? <img className='jiantou' src='https://res.lexiangpingou.cn/images/vip/shang.png' alt="" /> : <img className='jiantou' src='https://res.lexiangpingou.cn/images/vip/xia.png' alt="" />}
                        </div>
                    </div>
                </div>
                <div className="couponDiv" style={{ display: detail }}>
                    {/* <p>         {this.props.values.couponcode}</p> */}
                    <img className='couponcode' ref="couponcode" alt="" />
                    <div className="detailRight">
                        <span className='name'>有效日期</span>

                        <span className='time'>{values.start_time} </span>
                        <span>—</span>
                        <span> {values.end_time}</span>
                    </div>
                </div>

            </div>
        );
    }

    componentDidMount() {
        console.log(this.refs.couponcode.offsetLeft)
    }

}

export default withRouter(CouponItem)