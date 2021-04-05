import React, { Component } from 'react'
import styled from 'styled-components'
import { _memberCharge, _wxConfig } from 'network/profile'
import BetterScroll from 'common/betterScroll/BetterScroll'
import { store } from 'store'
import { Toast } from 'antd-mobile'

// import vconsole from 'vconsole'
// var vConsole = new vconsole()

const wx = window.wx

export default class Balance extends Component {

  constructor(props) {
    super(props);
    this.state = {
      member: {},
      charge: [],
      chargenotes: [],
      amountValue: "",
      paymentId: '',
      selected: 0,
    }
    this.selectColor = this.selectColor.bind(this)
    this.rechaergeNow = this.rechaergeNow.bind(this)
  }
  componentDidMount() {
    const getAllStore = {
      action: 'memberCharge',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
      }
    }
    _memberCharge(getAllStore).then((res) => {
      if (parseInt(res.data.status) === 200) {
        let { charge, chargenotes, member } = res.data.data
        this.setState({
          charge,
          chargenotes,
          member,
          paymentId: charge[0].id,
          amountValue: charge[0].member_selling
        }, () => {
          this.refs.scroll.BScroll.refresh()
        })
      } else {
        this.props.history.push('applymembership')
      }

    })
  }

  selectColor(e, key, item) {
    this.setState({
      selected: key,
      paymentId: item.id,
      amountValue: item.member_selling
    })
  }

  rechaergeNow = async () => {
    let isApplets = window.__wxjs_environment === 'miniprogram'
    const { uniacid } = store.getState().appConfig
    let baseUrl = JSON.parse(localStorage.getItem('baseUrl'))

    if (isApplets === true) {
      const payParam = {
        total_fee: this.state.amountValue,
        uniacid,
        baseUrl,
        id: this.state.paymentId,
        type: 'balance',
        openid: store.getState().appConfig.wxUserInfo.openid
      }
      window.navigateToMiniProgram(payParam)
    } else {
      const { appConfig } = store.getState()
      const confirmOrderNoConfig = {
        action: 'recharage',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          total_fee: this.state.amountValue,
          id: this.state.paymentId
        }
      }
      let result = await _memberCharge(confirmOrderNoConfig)
      const { appId, nonceStr, paySign, signType, timeStamp } = result.data.data
      let wxPackage = result.data.data.package
      let that = this
      wx.ready(function () {
        wx.chooseWXPay({
          appId,
          nonceStr,
          package: wxPackage,
          signType,
          paySign,
          timestamp: timeStamp,
          success: function (res) {
            const getAllStore = {
              action: 'memberCharge',
              data: {
                uniacid: appConfig.uniacid,
                openid: appConfig.wxUserInfo.openid,
              }
            }
            _memberCharge(getAllStore).then((res) => {
              if (res?.data?.status === 200) {
                let { chargenotes, member } = res.data.data
                that.setState({
                  chargenotes,
                  member
                }, () => {
                  that.refs.scroll.BScroll.refresh()
                })
              } else {
                Toast.info('未知错误(1004)')
              }

            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
      })
    }
  }


  render() {

    document.title = "在线充值";

    const scrollConfig = {
      probeType: 1
    }

    const scrollStyle = {
      height: 'calc((100vh - 0px) - env(safe-area-inset-bottom))'
    }

    return (
      <BalanceStyle>
        <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll'>
          <div>
            <div className='top'></div>
            <div className='yue'>账户余额（元）</div>
            <div className='yuan'><span>￥</span><div>{this.state.member.member_balance}</div></div>

            <div className='conter'>
              <ul id="selected">
                {
                  this.state.charge.map((item, key) => {
                    return (
                      <li key={item.id + key}
                        style={{
                          border: this.state.selected === key ? '2px solid var(--theme-font-color)' : ''

                        }}
                        onClick={(e) => { this.selectColor(e, key, item) }}>
                        <div className='conter_c' >
                          <div className='conter_c_t'>
                            <span className='conter_c_t_l' style={{ color: this.state.selected === key ? 'var(--theme-font-color)' : '' }}>{item.member_amount}</span>
                            <span className='conter_c_t_r' style={{ color: this.state.selected === key ? 'var(--theme-font-color)' : '' }}>元</span>
                          </div>
                          <div className='conter_c_t_f'>
                            <span className='conter_c_t_f_l'>实付：</span>
                            <span className='conter_c_t_f_r'>{item.member_selling}元</span>
                          </div>
                        </div>
                      </li>
                    )
                  })
                }
                {/*  <li

                                >
                                    <div className='conter_c' onClick={this.aa.bind(this)}>
                                        <div className='conter_c_t'>
                                            <span className='conter_c_t_l' >自定义</span>
                                            <span className='conter_c_t_r' ></span>
                                        </div>
                                        <div className='conter_c_t_f'>
                                            <span className='conter_c_t_f_l'>自定义不享折扣</span>
                                            <span className='conter_c_t_f_r'></span>
                                        </div>
                                    </div>
                                </li>*/}
              </ul>

            </div>
            <div className='footer'>
              <button onClick={() => this.rechaergeNow()} style={{ fontSize: ".32rem" }}>立即充值</button>
              <div className='jir'>
                <div className='qqq'></div>
                        充值记录
                        </div>
              <ul>
                {
                  this.state.chargenotes.map((item, key) => {
                    return (
                      <li className='card' key={key}>
                        <div className='card_l'>
                          <div className='card_l_top'>在线充值</div>
                          <p className='card_l_time'>{item.createtime}</p>
                        </div>
                        <div className='card_r'>
                          <h3>+{item.member_amount}</h3>
                          <p>-￥{item.member_selling}</p>
                        </div>
                      </li>
                    )
                  })
                }
                <div className='dou'>没有更多了~</div>
              </ul>
            </div>
          </div>
        </BetterScroll>
      </BalanceStyle>
    )
  }
}
const BalanceStyle = styled.div`

background-color: var(--bg-color);
height: calc(100vh - 0px);

.top{
    height:.51rem;
    width:.5rem;
}


.select{
    border: solid var(--thmem-font-color) .027rem;
}
.qqq{
    border-radius:.3rem;
    top:.6rem;
    left:.25rem;
    position:absolute;
    width:.15rem;
    height:.6rem;
    background-color: var(--theme-font-color);
}
.dou{
    margin-top:.3rem;
    display:flex;
    align-items:center;
    justify-content: center;
    font-size:.4rem;
}
.card_r p{
    position:absolute;
    right:0;
    font-size:.3rem;
    color:#474747;
    padding-top:.6rem;
    padding-right:.3rem;
}
.card_r h3{
    position:absolute;
    right:0;
    padding-right:.3rem;
    color:var(--theme-font-color);
}
.card_l_time{
    padding-top:.1rem;
    font-size:.3rem;
    color:#c6c6c6;
}
.card_l_top{
    letter-spacing:.1rem;
    font-size:.35rem;
    color:#474747;
}
.card{
    position:relative;
    padding-top:.2rem;
    display:flex;
    justify-content: space-between;
    margin-left:.6rem;
    height:1.5rem;
    border-bottom:1px solid #dddddd;
}


.jir{
    color:#474747;
    // font-weight:500;
    font-size:.45rem;
    padding-top:.55rem;
    letter-spacing:.1rem;
    border-bottom:1px solid #dddddd;
    height:1.5rem;
    width:100%;
    margin-left:.6rem;
}
.footer button{
    top:-.5rem;
    left:3.5rem;
    position:absolute;
    border:3px solid #fff;
    color:#fff;
    background-color: var(--theme-font-color);
    border-radius:.5rem;
    width:3rem;
    height:1rem;

}
.footer{
    position:relative;
    margin-top:1.24rem;
    width:100%;
    // height:9rem;
    border-radius:.2rem;
    background-color: #fff;
}
.custom_b{
    font-size:.2rem;
    color:#807f80;
    padding-left:.4rem;
    margin:.25rem auto;
    height:.6rem;
}
.custom{
    font-size:.6rem;
    color:#807f80;
    padding-left:.25rem;
    padding-top:.1rem;
}
.conter>ul{
    display:flex;
    flex-wrap: wrap;
    
}
.conter_c_t_f{
    padding-left:.5rem;
    padding-top:.3rem;
    margin:0 auto;
    color:#807f80;
    font-size:.3rem;
}
.conter_c_t_r{
    padding-top:.25rem;
    color:#807f80;
    font-size:.32rem;
}
.conter_c_t_l{
    padding-top:.1rem;
    padding-left:.1rem;
    color:#807f80;
    font-size:.6rem;
}
.conter_c_t{
    display:flex;
    align-items:center;
    justify-content: center;
    margin:0 auto;
    // background-color: red;
    height:2rem;
    // text-align:center;
    width:2.3rem;
    padding-top:.6rem;
    border-bottom:1px solid #e5e5e5;
    
}
.yue{
    font-size:.32rem;
    display:flex;
    align-items:center;
    justify-content: center;
    color: var(--font-color);

}
.yuan{
    display:flex;
    align-items:center;
    justify-content: center;
    color: var(--font-color);
    margin-top:.3rem;

}
.yuan span{
    margin-top:.33rem;
    font-size:.5rem;
}
.yuan div{
    font-size:.9rem;
}
.conter{
    display: flex;
    flex-wrap: wrap;
    height:100%;
    width:9.9rem;

}
.conter li{
    margin-left:.25rem;
    margin-top:.3rem;
    width:3rem;
    height:3rem;
    background-color: #fff;
    border-radius: .2rem;
}
`