import React, { Component } from 'react'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'
import QRCode from 'qrcodejs2'
import {withRouter} from 'react-router-dom'


class DaoDianTuiHuo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        let {orderdetail} = this.props
        this.createErWeiMa = this.createErWeiMa.bind(this,orderdetail.orderno)
    }



    createErWeiMa(orderno,e) {
        let baseurl = window.location.href
        let regs = baseurl.replace(/(#\/\w.*)/i,'#/tuihuohexiao/')

        regs = regs+orderno
        let erweima = this.refs.erweima
        new QRCode(erweima,{
            width: 130,
            height: 130,
            text: regs,
        })
    }


    closeNow = () =>{
        this.props.close()
    }

    componentDidMount(){
        this.createErWeiMa()

    }

    render() {
        const {orderdetail} = this.props
        const scrollConfig = {
            probeType: 1
        }
        const scrollStyle = {
            height: 'calc(100vh -.5rem)',
            padding: '.4rem .32rem',
        }
        return (
            <HexiaoStyle>
                <BetterScroll config={scrollConfig} style={scrollStyle}>
                    <div className='conter' >
                        <div className='header'>
                            <p>退货核销凭证</p>
                        </div>
                        <div className="hexiaoHeader">
                            <ul className="navbar">
                               <li>手机微信核销码</li>
                            </ul>
                        </div>
                        <div className="hexiaoArea" >
                            <div ref='erweima'></div>
                            <div>【请将本二维码出示给核销员】</div>
                            <ul className='xiangqing'>
                                <li>
                                    <p>提货点</p>
                                    <p>{orderdetail.sto.storename}</p>
                                </li>
                                <li>
                                    <p>提货地址</p>
                                    <p>{orderdetail.sto.address}</p>
                                </li>
                                <li>
                                    <p>联系电话</p>
                                    <p>{orderdetail.sto.tel}</p>
                                </li>
                                <li>
                                    <p>商品名称</p>
                                    <p>{
                                        orderdetail.selltype === '0'?orderdetail.goods[0].goodsname:orderdetail.goodsname
                                    }</p>
                                </li>
                                <li>
                                    <p>数量</p>
                                    <p>{
                                        orderdetail.selltype === '0'?orderdetail.goods[0].num:orderdetail.gnum
                                    }</p>
                                </li>
                                <li>
                                    <p>实付金额</p>
                                    <p>￥{orderdetail.realprice}</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='btn'>
                        <button style={{backgroundColor:'#ffffff'}} className='btn-l' onClick={() => {this.props.history.push(`/zitihexiao/${orderdetail.orderno}`)}} >自助核销</button>
                        <button style={{backgroundColor:'#FA5151'}} className='btn-r' onClick={this.closeNow}>关闭</button>
                    </div>
                </BetterScroll>
            </HexiaoStyle>
        )
    }
}

export default withRouter(DaoDianTuiHuo)

const HexiaoStyle = styled.div`
.hexiaoArea .yiweima{
    height:3rem;
    object-fit: cover;
}
.conter{
    width: 100%;
    height: 19rem;
    background-color: #fff;
    border-radius: .2rem;
}
.header{
    display:flex;
    align-items:center;
    justify-content: center;
    
}
.header p{
    margin:1rem auto;
    font-size:1rem;
}
.hexiaoPage{
  bockground-color:var(--theme-font-color);
}

.hexiaoHeader{
  height: .8rem;
  background-color: #fff;
}
.hexiaoHeader>ul{
    font-size:.39rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: .21666rem;
}

.active{
  color:var(--theme-font-color);
  border-bottom: .1rem var(--theme-font-color) solid;
  padding-bottom: .2rem;
}
.hexiaoArea div{
    // font-size:.3rem;
    margin-top: .3rem;
    display:flex;
    align-items:center;
    justify-content: center;
    letter-spacing: 0.15rem;
    font-size: .38rem;
    
}
.hexiaoArea img{
    height:5rem;
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
    margin-top:.8rem;
    height:1rem;
    width:4rem;
    background-color: #fff;
    color:#474747;
    border-radius: .2rem;

}
.btn-r{
    margin:0 auto;
    margin-top:.8rem;
    height:1rem;
    width:4rem;
    bockground-color: #FA5151;
    color:#FFFFFF;
    border-radius: .2rem;

}
`