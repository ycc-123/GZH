import React, { Component, createRef } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { _getOrderList } from "network/order";
import { store } from 'store/index'
import BetterScroll from 'common/betterScroll/BetterScroll'
import { Toast } from "antd-mobile";
// 售后申请页面
class AfterSale extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nowOrder: {},
      areavalue: ''
    }
    this.tuikuanyuanyin = ''
    const { appConfig } = store.getState()
    const { uniacid } = appConfig
    const { openid } = appConfig.wxUserInfo
    const { orderno } = this.props.match.params
    this.scroll = createRef()
    this.networkConfig = {
      applyServes: {
        action: 'applyServes',
        data: {
          uniacid,
          openid,
          orderno,
          servicereson: '', // 退款原因
          serviceremark: '', // 退款备注
          feedbackexpress: '', // 快递
          feedbackexpresssn: '', // 快递单号
        }
      },
      getNowOrder: {
        action: 'getOrder',
        data: {
          uniacid,
          orderno,
          apply: 1
        }
      }
    }
  }
  render() {
    const { nowOrder } = this.state
    console.log(nowOrder)
    return (
      <SoftStyle>
        <div className='soft'>
          <BetterScroll config={scrollConfig} style={scrollStyle} ref={this.scroll}>
            <div className='soft-bai'>
              <div className='soft-title'>
                <div>申请售后</div>
              </div>
              <ul>
                {
                  nowOrder && Array.isArray(nowOrder.goods) ?
                    nowOrder.goods.map(item => {
                      return (
                        <li key={item.id}>
                          <div className='e-1'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>商品名称&nbsp;:</div>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '6rem', wordBreak: 'break-all' }}>{item.goodsname}</span>
                          </div>
                          <div className='count'>
                            <span className='count-l'>数 量&nbsp;:</span>
                            <span className='count-r'>x{item.num}</span>
                          </div>
                        </li>
                      )
                    }) : <li>
                      <div className='e-1'>
                        <div style={{ display: 'flex', alignItems: 'center' }}>商品名称&nbsp;:</div>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '6rem', wordBreak: 'break-all' }}>{nowOrder.goodsname}</span>
                      </div>
                      <div className='count'>
                        <span className='count-l'>数 量&nbsp;:</span>
                        <span className='count-r'>x{nowOrder.gnum}</span>
                      </div>
                    </li>
                }
                <div className='count'>
                  <span>优惠金额&nbsp;:</span>
                  <span className='count-r'>-{nowOrder.discount_fee}</span>
                </div>
                <div className='count'>
                  <span>实付金额&nbsp;:</span>
                  <span className='actual'>&yen;&nbsp;{nowOrder.realprice}</span>
                </div>
                <div className='count'>
                  <span>退款原因&nbsp;:</span>
                  <span>
                    <select className='refund' id="refund" onChange={this.selectOnChange}>
                      <option>请选择退款原因</option>
                      <option>不想买了</option>
                      <option>商品错拍</option>
                      <option>收到商品破损</option>
                      <option>商品错发/漏发</option>
                      <option>收到商品与描述不符</option>
                      <option>商品质量问题</option>
                    </select>
                  </span>
                </div>
              </ul>
              <div className='refund-t'>
                <p className='refund-b'>退款理由&nbsp;:</p>
                <div className='shuc'>
                  <textarea value={this.state.areavalue} name='areavalue' onFocus={this.onFocus} onChange={this.areaChangVlaue} type="text" className='area' placeholder='简单描述你所能提供的产品' />
                </div>
              </div>
              <div className='footer'>
                <button className='button' onClick={this.applyServes}>申请售后</button>
              </div>
            </div>
          </BetterScroll>
        </div>
      </SoftStyle>
    )
  }

  selectOnChange = () => {
    let el = document.getElementById('refund')
    this.tuikuanyuanyin = el.value
  }

  handelWindowHeight = () => {
    // this.timer = setTimeout(() => {
    //   if (this?.scroll?.current?.BScroll) {
    //     this.scroll.current.BScroll.scrollTo(0, this.scroll.current.BScroll.maxScrollY, 400)
    //   }

    // }, 400)
  }

  applyServes = async () => {
    const { nowOrder } = this.state
    console.log(nowOrder)
    this.networkConfig.applyServes.data.serviceremark = this.state.areavalue
    this.networkConfig.applyServes.data.servicereson = this.tuikuanyuanyin
    if (this.tuikuanyuanyin === '') {
      Toast.info('请选择退款原因', 2)
    } else {
      let Res = await _getOrderList(this.networkConfig.applyServes)
      if (Res.data.status === 200) {
        Toast.success(Res.data.msg, 2)
        this.timer = setTimeout(() => {
          this.props.history.replace(`/sale/detail/${nowOrder.id}`)
        }, 2100)
      } else {
        Toast.fail(Res.data.msg)
      }
    }



  }

  areaChangVlaue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async componentDidMount() {

    window.addEventListener('resize', this.handelWindowHeight)

    let orderNow = await _getOrderList(this.networkConfig.getNowOrder)
    this.setState({
      nowOrder: orderNow.data.data.list[0]
    }, () => {
      this.scroll.current.BScroll.refresh()
    })
  }

}

const scrollConfig = {
  probeType: 1
}
const scrollStyle = {
  height: '100vh',
  padding: '0 .32rem',
}

const SoftStyle = styled.div`

background-color: var(--bg-color);
height: 100vh;

option {
    // direction: rtl;
    text-align:right;
}
.soft-bai{
    width: 100%;
    background-color: #fff;
    border-radius: .2rem;
}
.soft-title{
    width:100%;
    font-size:.77rem;
    color:#474747;
    text-align: center;
}
.soft-title div{
    margin-bottom:1.1rem;
    padding-top:.97rem;
    font-size: .77rem;
    font-weight:400;
    color:#474747;
}
.goods-name{
    text-indent:.4rem;
    height:1.21rem;
    line-height:1.21rem;
    color:#474747;
    font-size:.4rem;
    border-bottom:1px solid #ddd;
    display:flex;
    justify-content:space-between;
}
.goods-name div{
    color:#474747;
    font-size:.4rem;

}
.name{
    color:#474747;
}

.count {
    display: flex;
    justify-content: space-between;
    padding: 0 .4rem;
    color:#474747;
    /* text-indent:.4rem; */
    height:1.21rem;
    line-height:1.21rem;
    font-size:.4rem;
    border-bottom:1px solid #ddd;
}

.e-1 {
  display: flex;
  justify-content: space-between;
  padding: 0 .4rem;
  min-height: 1.21rem;
  font-size: .4rem;
  border-bottom: 1px solid #ddd;
}

.count-r {
    color:#c7c7c7;
}

.actual {
    color: var(--theme-font-color);
}
.refund {
    /* margin-left:3.6rem; */
    /* line-height:1.21rem; */
    background-color: #fff;
    color:#c7c7c7;
    direction: rtl;
    border:none;
    /* border-bottom:1px solid #ddd; */
}
.refund-b{
    height:1.21rem;
    line-height:1.21rem;
    text-indent:.4rem;
    font-size:.4rem;
    color:#474747;
}
.shuc{
    display:flex;
    align-items:center;
    justify-content: center;
    margin-left:.4rem;
    margin-right:.4rem;
}

.area{
    outline:none;
    border-radius: .2rem;
    border:1px solid #ccc;
    width: 100%;
    height:2.05rem;
    font-size:.4rem;
    padding-top:.35rem;
    padding-left:.35rem;
}
.footer{
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: .8rem 0 .32rem;
}
.button{
    font-size:.4rem;
    background-color: var(--theme-font-color);
    color:#fff;
    width:4.05rem;
    height:0.95rem;
    text-align: center;
    border-radius: 5rem;
}





`

export default withRouter(AfterSale)