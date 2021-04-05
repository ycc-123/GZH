import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'
import barCode from 'jsbarcode'
import QRCode from 'qrcodejs2'

import { getUrlValue } from 'commons/utils'

import { setTitle } from 'commons/utils'

const wx = window.wx

class Hexiao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponStatus: [
        { id: 'c101', content: '手机微信核销码' },
        { id: 'c102', content: '收银台扫码枪核销码' },
      ],
      tabsIsShow: 'wsy',
    }
    let { orderdetail } = this.props
    this.changeActive = this.changeActive.bind(this)
    this.createYiWeiMa = this.createYiWeiMa.bind(this, orderdetail.orderno)
    this.createErWeiMa = this.createErWeiMa.bind(this, orderdetail.orderno)
  }

  changeActive(e, index) {
    if (e.target.className !== 'active') {
      const li = document.querySelectorAll('.navbar>li')
      li.forEach((item, itemIndex) => {
        item.classList.remove('active')
        if (index === itemIndex) {
          item.classList.add('active')
          console.log('aa', item.innerHTML, this.state.tabsIsShow)
          switch (item.innerHTML) {
            case '手机微信核销码':
              this.setState({
                tabsIsShow: 'wsy'
              })
              break;
            case '收银台扫码枪核销码':
              this.setState({
                tabsIsShow: 'ysy'
              })
              break;
            default:
              break;
          }
        }
      })
    }
  }

  createErWeiMa(orderno, e) {
    let baseurl = window.location.href
    let regs = baseurl.replace(/(#\/\w.*)/i, '#/zitihexiao/')
    console.log('fdf', regs)

    regs = regs + orderno
    console.log('fdf', regs)
    let erweima = this.refs.erweima
    new QRCode(erweima, {
      width: 130,
      height: 130,
      text: regs,
    })
  }

  createYiWeiMa(orderno, e) {
    let yiweima = this.refs.yiweima
    barCode(yiweima, orderno, {
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
    console.log(123)
  }


  closeNow = () => {
    this.props.close()
  }

  componentDidMount() {
    setTitle('自提核销')
    this.createErWeiMa()
    this.createYiWeiMa()
    // 默认选中第一个
    const li = document.querySelector('.navbar>li')
    li.classList.add('active')
    this.refs.scroll123.BScroll.refresh()
  }

  wxScan() {
    const wx = window.wx
    const { orderno } = this.props.item
    let that = this
    wx.ready(() => {
      wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode", "barCode"],
        success: function (res) {
          let result = res.resultStr
          let openid = getUrlValue(result, 'openid')
          let storeid = getUrlValue(result, 'storeid')
          if (openid && storeid) {
            that.props.history.push({ pathname: `/zitihexiao/${orderno}`, search: `oid=${openid}&sid=${storeid}` })
          } else {
            let sIndex = result.lastIndexOf('\/')
            let oIndex = result.substring(0, sIndex).lastIndexOf('\/')
            let storeid = result.substring(sIndex + 1, result.length)
            let openid = result.substring(oIndex + 1, sIndex)
            that.props.history.push({ pathname: `/zitihexiao/${orderno}`, search: `oid=${openid}&sid=${storeid}` })
          }
        }
      })
    })
  }

  componentDidUpdate = () => {
    this.refs.scroll123.BScroll.refresh()
  }

  render() {
    const { orderdetail } = this.props
    const wsy = this.state.tabsIsShow === 'wsy' ? 'block' : 'none';
    const ysy = this.state.tabsIsShow === 'ysy' ? 'block' : 'none';
    const scrollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      padding: '0 .32rem',
      height: 'calc(100vh - 0px)'
    }
    return (
      <HexiaoStyle>
        <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll123'>
          <div className='conter' >
            <div className='header'>
              <p>自提核销凭证</p>
            </div>
            <div className="hexiaoHeader">
              <ul className="navbar">
                {
                  this.state.couponStatus.map((item, index) => {
                    return (
                      <li key={index + item.id} onClick={(e) => { this.changeActive(e, index) }}>{item.content}</li>
                    )
                  })
                }
              </ul>
            </div>
            <div className="hexiaoArea" style={{ "display": wsy }}>
              <div ref='erweima'></div>
              <div>【请将本二维码出示给核销员】</div>
              <ul className='xiangqing'>
                <li>
                  <p>提货点</p>
                  <p style={{ width: '70%', textAlign: 'right' }}>{orderdetail.sto.storename}</p>
                </li>
                <li>
                  <p>提货地址</p>
                  <p style={{ width: '70%', textAlign: 'right' }}>{orderdetail.sto.address}</p>
                </li>
                <li>
                  <p>联系电话</p>
                  <p>{orderdetail.sto.tel}</p>
                </li>
                <li>
                  <p>商品名称</p>
                  <p style={{ width: '70%', textAlign: 'right' }}>{
                    orderdetail.selltype === '0' ? orderdetail.goods[0].goodsname : orderdetail.goodsname
                  }</p>
                </li>
                <li>
                  <p>数量</p>
                  <p>{
                    orderdetail.selltype === '0' ? orderdetail.goods[0].num : orderdetail.gnum
                  }</p>
                </li>
                <li>
                  <p>实付金额</p>
                  <p>￥{orderdetail.realprice}</p>
                </li>
              </ul>
            </div>


            <div className="hexiaoArea" style={{ "display": ysy }}>
              <div><img ref="yiweima" className='yiweima' src='https://res.lexiangpingou.cn/images/vip/payma.png' alt="" /></div>
              <div>{orderdetail.orderno}</div>

              <ul className='xiangqing'>
                <li>
                  <p>提货点</p>
                  <p style={{ width: '70%', textAlign: 'right' }}>{orderdetail.sto.storename}</p>
                </li>
                <li>
                  <p>提货地址</p>
                  <p style={{ width: '70%', textAlign: 'right' }}>{orderdetail.sto.address}</p>
                </li>
                <li>
                  <p>联系电话</p>
                  <p>{orderdetail.sto.tel}</p>
                </li>
                <li>
                  <p>商品名称</p>
                  <p style={{ width: '70%', textAlign: 'right' }}>{
                    orderdetail.selltype === '0' ? orderdetail.goods[0].goodsname : orderdetail.goodsname
                  }</p>
                </li>
                <li>
                  <p>数量</p>
                  <p>{
                    orderdetail.selltype === '0' ? orderdetail.goods[0].num : orderdetail.gnum
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
            <button style={{ backgroundColor: '#ffffff' }} className='btn-l' onClick={() => this.wxScan()} >自助核销</button>
            <button style={{ backgroundColor: '#FA5151' }} className='btn-r' onClick={this.closeNow}>关闭</button>
          </div>
        </BetterScroll>
      </HexiaoStyle>
    )
  }
}

export default withRouter(Hexiao)

const HexiaoStyle = styled.div`
.hexiaoArea .yiweima{
    height:3rem;
    object-fit: cover;
}
.conter{
    width: 100%;
    height: auto;
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
    align-items: center;
    justify-content: space-between;
    padding: .3rem 0;
    border-bottom:1px solid #e5e5e5;
}
.btn{
    display:flex;
    justify-content: space-between;
}
.btn-l{
    margin:0 auto;
    margin: .4rem 0;
    height:1rem;
    width:4rem;
    background-color: #fff;
    color:#474747;
    border-radius: .2rem;

}
.btn-r{
    margin:0 auto;
    margin: .4rem 0;
    height:1rem;
    width:4rem;
    background-color: #FA5151;
    color:#FFFFFF;
    border-radius: .2rem;

}
`
