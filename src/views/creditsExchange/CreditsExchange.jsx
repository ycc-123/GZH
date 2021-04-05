import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'
import { Modal, Toast } from "antd-mobile";

import { store } from 'store'

import axios from 'axios'
import { _getMember, _scoreMall } from 'network/profile'
import { _api } from 'network/api'

import ScroeGoodsItem from './ScroeGoodsItem'
import ScroeCouponItem from './ScroeCouponItem'


class CreditsExchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberstoreid: '',
      memberscore: '',
      memberuniacid: '',
      goodsid: '',
      coupon: [],
      scoreGoods: [],
      exchangeType: 1,
      active: true,
      Goods: '',
      coupon_scores: '',
      creditsOptions: [
        { id: 1011, name: '兑换商品' },
        { id: 1012, name: '兑换优惠券' },
        { id: 1013, name: '兑换会员余额' }
      ],
      selectActive: 0,
      scoreBalanceList: []
    }
    this.record = this.record.bind(this)
  }

  record() {
    this.props.history.push('/integral/record')
  }

  componentDidMount() {
    const { appConfig } = store.getState()
    const getMemberConfig = {
      action: 'getMember',
      data: {
        memberid: store.getState().appConfig.wxUserInfo.id
      }
    }
    // 积分商城
    const ScoreGoodsConfig = {
      action: 'scoreMall',
      data: {
        uniacid: appConfig.uniacid
      }
    }

    const balanceConfig = {
      action: 'scoreBalanceList',
      data: {
        uniacid: appConfig.uniacid
      }
    }

    axios.all([
      _getMember(getMemberConfig).catch(err => ''),
      _scoreMall(ScoreGoodsConfig).catch(err => ''),
      _api(balanceConfig).catch(err => '')
    ]).then(res => {
      const { member_status, score_balance = 0.00 } = res[0]?.data?.data
      if (parseInt(member_status) === 1) {
        const { scoreGoods, coupon } = res[1]?.data?.data
        this.setState({
          memberscore: score_balance,
          scoreGoods,
          coupon,
          id: scoreGoods[0] ? scoreGoods[0].id : '',
          coupon_id: coupon[0] ? coupon[0].id : '',
          scoreBalanceList: res[2]?.data?.data ? res[2].data.data : []
        }, () => {
          this.refs.scroll.BScroll.refresh()
        })
      } else {
        this.props.history.replace('applymembership')
      }
    })

  }

  render() {
    const { creditsOptions, selectActive, scoreBalanceList } = this.state
    const showInfo = selectActive === 0 ? 'block' : 'none'
    const showImg = selectActive === 1 ? 'block' : 'none'
    const balance = selectActive === 2 ? 'block' : 'none'
    const sStyle = {
      padding: '0',
    }
    const scrollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc(100vh - .2rem)',
      padding: '0 .32rem',
    }

    document.title = "积分兑换";


    return (
      <CreditsStyle>
        <div className='crechang'>
          <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll'>
            <div className='header'>
              {/* <span><img src='https://res.lexiangpingou.cn/images/vip/rightjiao.png' alt="" /></span> */}
              <div style={{ position: 'absolute', top: '.12rem', right: '.12rem', width: '.45rem', height: '.45rem', borderTopRightRadius: '50%', overflow: 'hidden' }}>
                <div style={{ width: 0, height: 0, borderTop: '.45rem solid var(--theme-font-color)', borderLeft: '.45rem solid transparent' }}></div>
              </div>
              <span className='myCredits'>我的可用积分</span>
              <span className='credits'>{this.state.memberscore}</span>
              <span className='hua'>小积分大作用 有赚有花才舒心</span>
              <button className='jiru' onClick={this.record}>查看兑换记录</button>
            </div>
            <div className='credits-photo' style={sStyle}>
              <ul className='credits-option-box'>
                {creditsOptions.map((item, index) => {
                  return (
                    <li className='credits-select' key={item.id} onClick={() => this.changeActive(index)}>
                      <p>
                        <a style={{ color: index === selectActive ? 'var(--theme-font-color)' : 'var(--common--font-color)' }}>{item.name}</a>
                      </p>
                    </li>
                  )
                })}
              </ul>

              <div className='detail-goods-img' style={{ display: showInfo }}>
                <div className='goo'>
                  <div className='Goods1' >
                  </div>
                  {
                    this.state.scoreGoods.map((item, key) => {
                      console.log(item)
                      let goodsid = item.id
                      return (
                        <ScroeGoodsItem value={item} key={key + item.id} msg={goodsid} num={this.state.need_score_num}
                          stock={this.state.stock}
                          stockNum={this.state.stockNum}
                        />
                      )
                    })
                  }
                </div>
              </div>

              {/* 兑换优惠券 */}
              <div className='detail-discounts-info' style={{ display: showImg }}>
                {
                  this.state.coupon.map((item, key) => {
                    let aa = item
                    let couponId = item.id
                    let stockNums = item.stockNum
                    return (
                      <ScroeCouponItem
                        item={aa}
                        memberscore={this.state.memberscore}
                        hans={this.han.bind(this)}
                        key={key + item.id}
                        msg={couponId}
                        stockNum={stockNums}

                      ></ScroeCouponItem>

                    )
                  })
                }
              </div>

              <div className='credits-balance-box' style={{ display: balance }}>
                <ul>
                  {scoreBalanceList.map(item => {
                    return (
                      <li className='credits-balance' key={item.id}>
                        <div className='credits-balance-left'>
                          <img src='https://res.lexiangpingou.cn/images/vip/20201127/vn.png' />
                          <p style={{ marginLeft: '.4rem' }}>
                            <span style={{ fontSize: '.4rem', fontWeight: 'bold', color: 'var(--common-font-color)' }}>余额面值&yen;{item.member_amount}</span>
                            <span style={{ display: 'block', fontSize: '.32rem', fontWeight: '300', color: 'var(--common-font-color)', marginTop: '.18rem' }}>可直接当现金使用</span>
                          </p>
                        </div>
                        <div className='credits-balance-right'>
                          <p>消耗{item.scores}积分</p>
                          <button onClick={() => Modal.alert('兑换该商品', '', [
                            { text: '取消', onPress: () => console.log('cancel') },
                            { text: '确认', onPress: () => { this.rechargeBalance(item.id) } },
                          ])}>立即兑换</button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

            </div>
          </BetterScroll>
        </div>

      </CreditsStyle>
    )
  }
  changeActive = index => {
    this.setState({ selectActive: index }, () => this.refs.scroll.BScroll.refresh())
  }

  han(memberscore) {
    this.setState({
      memberscore: memberscore
    })
  }

  rechargeBalance(id) {
    const { appConfig } = store.getState()
    const config = {
      action: 'scoreRechargeBalance',
      data: {
        openid: appConfig.wxUserInfo.openid,
        uniacid: appConfig.uniacid,
        id
      }
    }
    _api(config).then(res => {
      if (res.data.status === 1) {
        Toast.info('兑换成功', 1)
        const getMemberConfig = {
          action: 'getMember',
          data: {
            memberid: store.getState().memberUserInfo.id
          }
        }
        // 积分商城
        const ScoreGoodsConfig = {
          action: 'scoreMall',
          data: {
            uniacid: appConfig.uniacid
          }
        }

        const balanceConfig = {
          action: 'scoreBalanceList',
          data: {
            uniacid: appConfig.uniacid
          }
        }

        axios.all([
          _getMember(getMemberConfig).catch(err => ''),
          _scoreMall(ScoreGoodsConfig).catch(err => ''),
          _api(balanceConfig).catch(err => '')
        ]).then(res => {
          const { score_balance = 0.00 } = res[0]?.data?.data
          const { scoreGoods, coupon } = res[1]?.data?.data
          this.setState({
            memberscore: score_balance,
            scoreGoods,
            coupon,
            id: scoreGoods[0] ? scoreGoods[0].id : '',
            coupon_id: coupon[0] ? coupon[0].id : '',
            scoreBalanceList: res[2]?.data?.data ? res[2].data.data : []
          }, () => {
            this.refs.scroll.BScroll.refresh()
          })
        })

      } else if (res.data.status === 0) {
        // 非会员
        Toast.info(res.data.msg, 1)
      }
    })
  }

}

const CreditsStyle = styled.div`

.credits-balance-right {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    float: right;
    width: calc(100% - 6.5rem);
    height: 100%;
    color: #fff;
    background-color: var(--theme-font-color);
}

.credits-balance-right  p {
    font-size: .32rem;
    font-weight: bold;
}
.credits-balance-right button {
    margin-top: .2rem;
    width: 2rem;
    height: .64rem;
    line-height: .64rem;
    font-size: .32rem;
    border-radius: .32rem;
    background-color: #fff;
    color: var(--theme-font-color);
}

.credits-balance-left {
    display: flex;
    align-items: center;
    float: left;
    width: 6.5rem;
    height: 100%;
}

.credits-balance-left img {
    margin-left: .4rem;
    width: 1.07rem;
    height: 1.07rem;
}

.credits-balance-left p {
    height: 1.07rem;
}

.credits-balance {
    margin-bottom: .13rem;
    width: 100%;
    height: 1.89rem;
    border-radius: .13rem;
    overflow: hidden;
    background-color: #fff;
}

.goo {
    display: flex;
    justify-content: space-between;
}

.credits-option-box {
    display: flex;
    margin: .13rem 0;
    width: 100%;
    height: 1.17rem;
    border-radius: .13rem;
    background-color: #fff;
}

.credits-select {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}

.credits-select p {
    width: 100%;
    height: .6rem;
    line-height: .6rem;
    font-size: .32rem;
    text-align: center;
    border-right: 1px solid var(--common-font-color);
}

.credits-select:last-child p {
    border: none;
}

.crechang {
    padding-top: .2rem;
    background-color: var(--bg-color);
}

.credits-photo {
  margin-bottom: .32rem;
  width: 100%;
  padding: .4rem;
  border-radius: .13rem;
}

.detail-photo-button{
    margin:0;
    padding-top:.2rem;
    height:1.17rem;
    // background-color: #fff;
}
.select{
    background-color: #ccc;
}

.Goods .bai img{
    width: 4.65rem;
    height: 4.65rem;

}

.Goods .bai{ 
    background-color: #fff;
    width: 4.65rem;
    overflow: hidden;
    border-radius: .13rem;
}
.goo{
    position:relative;
    display:flex;
    flex-wrap: wrap;

}
.header{
    position:relative;
    height:3rem;
    width:100%;
    background-color: #fff;
    border-radius: .2rem;
}
.header img{
    position:absolute;
    right:.2rem;
    top:.2rem;
    height: .7rem;
    object-fit: cover;
}
.myCredits{
    position:absolute;
    left:.5rem;
    top:.2rem;
    font-size:.4rem;
    color:#474747;
}
.credits{
    position:absolute;
    left:.5rem;
    top:.8rem;
    font-size:1rem;
    color:#474747;
    font-weight:800;
}
.hua{
    font-size:.35rem;
    position:absolute;
    left:.5rem;
    top:2.1rem;
    color:#a3a3a3;
}
.jiru{
    position:absolute;
    right:.5rem;
    top:1.3rem;
    color:var(--theme-font-color);
    background-color: #fff;
    height:.5rem;
    line-height:.5rem;
    border-bottom:1px solid var(--theme-font-color);
}

.qqqq{
    padding-left: .4rem;
    display:flex;
    align-items: center;
    margin-bottom: .2rem;
}

.Goods{
    position:relative;
    margin-bottom: .2rem;
}
.goods{
    height: 6.2rem;
    object-fit: cover;
}
.goods_k {
    margin: .15rem 0 .15rem;
    padding-left: .4rem;
    font-size:.28rem;
    color:#90939a;
}
.goods_t {
    margin-top: .4rem;
    padding-left: .4rem;
    font-size:.4rem;
    color: #474747;
}
.goods_c{
    font-size:.4rem;
    color:#d90000;
    font-weight:bold;
}
.goods_jifeng{
    font-size:.3rem;
    color:#474747;
}
.goods_f{
    font-size:.35rem;
    background-color: var(--theme-font-color);
    color:#fff;
    border-radius: .2rem;
    height:.65rem;
    line-height:.65rem;
    width:1.7rem;
    margin-left: 1rem;
}
.Goods1{
    position:absolute;
    right:0rem;
    top:0rem;
}

.Goods4{
    position:absolute;
    right:.32rem;
    top:11.55rem;
}

.Goods4{
    position:absolute;
    right:0;
    top:6.3rem;
}







.juanone img{
    height: 2.2rem;
    object-fit: cover;
}
.juan{
    position:relative;
    margin-top:.15rem;
}
.juan_fu{
    position:absolute;
    left:.8rem;
    top:.4rem;
    color:var(--theme-font-color);
    font-size:.4rem;
}
.kucun{
    position:absolute;
    left:.8rem;
    top:1.1rem;
    color: #90939a;
    font-size:.3rem;
}
.juan_yuan{
    font-weight:500;
    position:absolute;
    left:1.2rem;
    top:.27rem;
    color:var(--theme-font-color);
    font-size:.7rem;
}
.juan_jifen{
    position:absolute;
    left:.8rem;
    top:1.6rem;
    color:var(--theme-font-color);
}
.juan_wu{
    position:absolute;
    left:4rem;
    top:.5rem;
    font-size:.3rem;
    color:#a3a3a3;
}
.jian_yxq{
    position:absolute;
    left:3.5rem;
    top:1.2rem;
    font-size:.3rem;
    color:#a3a3a3;
}
.yuan{
    position:relative;
}
.juans1{
    // margin-top:.2rem;
}
.duihuan{
    position:absolute;
    width:1.1rem;
    height:2.2rem;
    top:0;
    left:8.2rem;
    font-size:.3rem;
    background-color: transparent;
}

`

export default withRouter(CreditsExchange)