import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'
import QRCode from 'qrcode.react';

import BetterScroll from 'common/betterScroll/BetterScroll'
import { _jfcheck } from 'network/profile'
import { store } from 'store'

import jsBarCode from 'jsbarcode'
// import QRCode from 'qrcodejs2'


class Hexiao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: this.props.match.params.id,
            couponStatus: [
                { id: 'c101', content: '手机微信核销码' },
                { id: 'c102', content: '收银台扫码枪核销码' },
            ],
            tabsIsShow: 'wsy',
            activeIndex: 0,
            showQRCode: false,
            url: ''


        }
        this.updateCode = this.updateCode.bind(this)
        this.changeActive = this.changeActive.bind(this)

    }

    changeActive(index) {
        this.setState({ activeIndex: index }, () => { this.refs.scroll.BScroll.refresh() })
    }

    componentDidMount() {
        this.updateCode()
        let origin, pathname, search, hash, url
        origin = window.location.origin
        pathname = window.location.pathname
        search = window.location.search
        hash = `#/Hexiaoyuan/${this.props.match.params.id}`
        url = origin + pathname + search + hash
        const confirmConfig = {
            action: 'jfcheck',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,
                orderno: 'D' + this.state.code,
                type: 0
            }
        }
        _jfcheck(confirmConfig).then(res => {
            if (res.data.status === 200) {
                let ordertype = res.data.data[0].ordertype
                let addname = res.data.data[0].goods[0].gname
                let mobile = res.data.data[0].mobile
                let orderno = res.data.data[0].orderno
                let goodsname = res.data.data[0].goods[0].gname
                let count = res.data.data[0].goods[0].gnum
                let credit = res.data.data[0].goods[0].oprice
                this.setState({
                    ordertype,
                    addname,
                    mobile,
                    orderno,
                    goodsname,
                    count,
                    credit,
                    showQRCode: true,
                    // url
                }, () => {
                    this.refs.scroll.BScroll.refresh()
                })
            } else if (res.data.status === 400) {
                Toast.info(res.data.msg, 1)
            }
        })
    }

    updateCode() {
        // let Case = this.refs.qcrcode
        // Case.innerHTML = ''
        let code = this.state.code
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

        // let baseurl = window.location.href
        // let qwe = baseurl.replace(/(#\/\w\w\w\w\w\w)/i, '#/Hexiaoyuan')
        this.refs.scroll.BScroll.refresh()
    }

    componentDidUpdate() {
        this.refs.scroll.BScroll.refresh()
    }

    render() {

        const { activeIndex, couponStatus, url, showQRCode } = this.state
        const wsy = activeIndex === 0 ? 'block' : 'none';
        const ysy = activeIndex === 1 ? 'block' : 'none';
        const scrollConfig = {
            probeType: 1
        }
        const scrollStyle = {
            height: 'calc(100vh - .5rem)',
            padding: '.4rem .32rem',
        }
        return (
            <HexiaoStyle>
                <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll'>
                    <div className='conter' >
                        <div className='header'>
                            <p>积分商品核销凭证</p>
                        </div>
                        <div className="hexiaoHeader">
                            <ul className="navbar">
                                {
                                    couponStatus.map((item, index) => {
                                        return (
                                            <li key={index + item.id}
                                                style={{
                                                    borderBottom: activeIndex === index ? '3px solid var(--theme-font-color)' : 'none',
                                                    color: activeIndex === index ? 'var(--theme-font-color)' : '#474747'
                                                }}
                                                onClick={() => this.changeActive(index)}>{item.content}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        {/* src={require('assets/img/Payment_code2.png')} */}
                        <div className="hexiaoArea" style={{ display: wsy }}>
                            {showQRCode && <div className='qr'>
                                <QRCode value={url} size={200} fgColor="#000000" level='L' />
                            </div>}
                            <div>【请将本二维码出示给核销员】</div>
                            <ul className='xiangqing'>
                                <li>
                                    <p>提货点</p>
                                    <p>火蝶科技总店</p>
                                </li>
                                <li>
                                    <p>提货地址</p>
                                    <p>玉环</p>
                                </li>
                                <li>
                                    <p>联系电话</p>
                                    <p>{this.state.mobile}</p>
                                </li>
                                <li>
                                    <p>商品名称</p>
                                    <p>{this.state.addname}</p>
                                </li>
                                <li>
                                    <p>数量</p>
                                    <p>{this.state.count}</p>
                                </li>
                                <li>
                                    <p>实付积分</p>
                                    <p>{this.state.credit}</p>
                                </li>
                            </ul>
                        </div>


                        <div className="hexiaoArea" style={{ display: ysy }}>
                            <div><img className='yiweima' ref='barcode' alt="" /></div>
                            <div>【请将本一维码出示给核销员】</div>

                            <ul className='xiangqing'>
                                <li>
                                    <p>提货点</p>
                                    <p>火蝶科技总店</p>
                                </li>
                                <li>
                                    <p>提货地址</p>
                                    <p>玉环</p>
                                </li>
                                <li>
                                    <p>联系电话</p>
                                    <p>{this.state.mobile}</p>
                                </li>
                                <li>
                                    <p>商品名称</p>
                                    <p>{this.state.addname}</p>
                                </li>
                                <li>
                                    <p>数量</p>
                                    <p >{this.state.count}</p>
                                </li>
                                <li>
                                    <p>实付积分</p>
                                    <p>{this.state.credit}</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='btn'>
                        <button className='btn-l' style={{ backgroundColor: '#ffffff' }} onClick={() => { this.props.history.push(`/Hexiaoyuan/${this.props.match.params.id}`) }}>自助核销</button>
                        <button className='btn-r' style={{ backgroundColor: '#FA5151' }} onClick={() => { this.props.history.push('/ccc') }}>关闭</button>
                    </div>
                </BetterScroll>
            </HexiaoStyle>
        )
    }
}
const HexiaoStyle = styled.div`
#qcrcode{
    padding-top:.4rem;
}
.hexiaoArea .yiweima{
    height:3rem;
    object-fit: cover;
}
.conter{
    width: 100%;
    // height: 19rem;
    background-color: #fff;
    border-radius: .2rem;
}
.header{
    display:flex;
    align-items:center;
    justify-content: center;
    padding-bottom:.99rem;
}
.navbar {
    display: flex;
    height:1.17rem;
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
}

.navbar li {
    flex: 1;
    line-height: 1.17rem;
    text-align: center;
    font-size: .39rem;
}

.header p{
    margin:0 auto;
    padding-top:.97rem;
    
    font-size:.77rem;
}
.hexiaoPage{
  background-color:var(--theme-font-color);
}

.hexiaoHeader{
  height: .8rem;
  background-color: #fff;
}

.hexiaoArea div{
    font-size:.3rem;
    margin-top: .5rem;
    display:flex;
    align-items:center;
    justify-content: center;
}
.hexiaoArea img{
    height:4rem;
    object-fit: cover;
}
.xiangqing{
    margin-left:.2rem;
    margin-right:.2rem;
    margin-top:.5rem;
}
.xiangqing li{
    font-size:.4rem;
    display:flex;
    justify-content: space-between;
    height:1.1rem;
    line-height:1rem;
    border-bottom:1px solid #e5e5e5;
}
.btn{
    display:flex;
    justify-content: space-between;
}
.btn-l{
    margin:0 auto;
    margin-top:.4rem;
    height:1rem;
    width:4.39rem;
    background-color: #fff;
    color:#474747;
    border-radius: .2rem;
}
.btn-r{
    margin:0 auto;
    margin-top:.4rem;
    height:1rem;
    width:4.39rem;
    background-color: #fa5151;
    color:#fff;
    border-radius: .2rem;
}
`


export default withRouter(Hexiao)