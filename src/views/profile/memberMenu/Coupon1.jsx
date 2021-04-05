import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { _getCoupon } from 'network/profile'
import { store } from 'store'
import { Coupon } from 'store/actionCreators'


import BetterScroll from 'common/betterScroll/BetterScroll'

import CouponItem from './CouponItem'


class Coupon1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponStatus: [
        { id: 'c101', content: '未使用' },
        { id: 'c102', content: '已使用' },
        { id: 'c103', content: '已过期' }
      ],
      tabsIsShow: 'wsy',
      show: false,
      expired: [],
      unused: [],
      used: [],
      showImg: false
    }

    this.changeActive = this.changeActive.bind(this)

  }

  changeActive(e, index) {
    if (e.target.className !== 'active') {
      const li = document.querySelectorAll('.navbar>li')
      li.forEach((item, itemIndex) => {
        item.classList.remove('active')
        if (index === itemIndex) {
          item.classList.add('active')
          // console.log('aa', item.innerHTML, this.state.tabsIsShow)
          switch (item.innerHTML) {
            case '未使用':
              this.setState({
                tabsIsShow: 'wsy'
              }, () => {
                this.refs.scroll.BScroll.refresh()
              })
              break;
            case '已使用':
              this.setState({
                tabsIsShow: 'ysy'
              }, () => {
                this.refs.scroll1.BScroll.refresh()
              })
              break;
            case '已过期':
              this.setState({
                tabsIsShow: 'ygq'
              }, () => {
                this.refs.scroll2.BScroll.refresh()
              })
              break;
            default:
              break;
          }
        }
      })
    }
  }

  componentDidMount() {
    // 默认选中第一个
    const li = document.querySelector('.navbar>li')
    li.classList.add('active')
    const { price } = this.props.match.params
    // 接口
    const couponConfig = {
      action: 'getCoupon',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        price: price ? price : ''
      }
    }

    _getCoupon(couponConfig).then(res => {
      let data = res.data
      if (data.status === 200) {
        let { expired, unused, used } = data.data
        this.setState({
          expired,
          unused: unused,
          used,
          showImg: true
        }, () => {
          this.refs.scroll.BScroll.refresh()
        })
      }
    })
  }

  ChangeDetailShow() {
    this.setState({
      isDetail: !this.state.isDetail
    })
  }

  render() {

    document.title = "优惠券";

    const wsy = this.state.tabsIsShow === 'wsy' ? 'block' : 'none';
    const ysy = this.state.tabsIsShow === 'ysy' ? 'block' : 'none';
    const ygq = this.state.tabsIsShow === 'ygq' ? 'block' : 'none';

    const scrollConfig = {
      probeType: 1
    }

    const scrollStyle = {
      height: 'calc((100vh - 1.2rem) - env(safe-area-inset-bottom))'
    }


    return (
      <CouponStyle>
        <div className="couponPage">

          <div className="couponHeader">
            <ul className="navbar">
              {
                this.state.couponStatus.map((item, index) => {
                  return (
                    <li key={index + item.id} style={{ flex: '1', textAlign: 'center', lineHeight: '.8rem' }} onClick={(e) => { this.changeActive(e, index) }}>{item.content}</li>
                  )
                })
              }
            </ul>
          </div>


          <div className="couponContainer">

            <div className="couponArea" style={{ "display": wsy }}>
              <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll'>
                {
                  this.state.unused.map((value, key) => {
                    // console.log(value.id)
                    // const action = Coupon(value.id)
                    // store.dispatch(action)
                    return (
                      <CouponItem values={value} status={this.state.tabsIsShow} key={key + value.id} />
                    )
                  })
                }
              </BetterScroll>

              {/* {this.state.unused.length === 0 && <p style={{ height: '2rem', width: '100vw', color: '#fff', fontSize: '.32rem', textAlign: 'center', lineHeight: '2rem' }}>当前商品暂无可用优惠卷</p>} */}

            </div>


            <div className="couponArea" style={{ "display": ysy }}>
              <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll1'>
                {
                  this.state.used.map((value, key) => {
                    return (
                      <CouponItem values={value} status={this.state.tabsIsShow} key={key + value.id} />
                    )
                  })
                }
              </BetterScroll>
            </div>

            <div className="couponArea" style={{ "display": ygq }}>
              <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll2'>
                {
                  this.state.expired.map((value, key) => {
                    return (
                      <CouponItem values={value} status={this.state.tabsIsShow} key={key + value.id} />
                    )
                  })
                }
              </BetterScroll>
            </div>
          </div>
          {this.state.unused.length === 0 && this.state.showImg &&
            <div style={{ display: wsy, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '3.68rem', textAlign: 'center' /* , display: 'flex', justifyContent: 'center', flexGrow: 'grow'  */ }}>
              <img src='https://res.lexiangpingou.cn/images/vip/20201127/couponw.png' alt="" style={{ width: '3.68rem', height: '4.29rem' }} />
              <p style={{ width: '100%', color: '#fff', fontSize: '.32rem', textAlign: 'center', marginTop: '.77rem' }}>暂无可用优惠券</p>
              <button onClick={this.btnClick} style={{ width: '3.11rem', height: '.95rem', lineHeight: '.95rem', backgroundColor: 'var(--theme-font-color)', fontSize: '.32rem', color: '#fff', borderRadius: '.47rem', marginTop: '.91rem' }}>返回上一页</button>
            </div>
          }

          {this.props.match.params.price && <div className='c-no'>
            不使用优惠券
            <span onClick={this.no} style={{ display: this.state.show ? 'none' : 'block' }} ></span>
            <img className='img' src='https://res.lexiangpingou.cn/images/vip/select1.png' style={{ display: this.state.show ? 'block' : 'none' }} />
          </div>}
        </div>
      </CouponStyle>

    );
  }

  no = () => {
    this.setState({
      show: true
    }, () => {
      const action = Coupon('')
      store.dispatch(action)
      this.timer = setTimeout(() => {
        this.props.history.go(-1)
      }, 200)
    })
  }

  btnClick = () => {
    if (this.props.history.length === 1) {
      this.props.history.replace('/home')
    } else {
      this.props.history.go(-1)
    }
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer)
  }

}


const CouponStyle = styled.div`

.c-no {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  height: 1.17rem;
  width: 100%;
  line-height: 1.17rem;
  padding-left: .4rem;
}

.c-no span {
  display: inline-block;
  position: absolute;
  top: 50%;
  -webkit-transform: translate(0,-50%);
  -ms-transform: translate(0,-50%);
  transform: translate(0,-50%);
  right: .4rem;
  width: .53rem;
  height: .53rem;
  border: 1px solid #ccc;
  border-radius: 50%;
}

.c-no .img {
  position: absolute;
  top: 50%;
  transform: translate(0,-50%);
  right: .4rem;
  width: .53rem;
  height: .53rem;
  border: 1px solid #ccc;
  border-radius: 50%;
}

.conten{
  position:relative;
  width: 100%;
  // height: 3.3rem;
  // background-color:red;

}
.zhang{
  position:absolute;
  bottom: .5rem;
  right: .2rem;
  height:2rem;
  object-fit: cover;
}
.jiantou{
  height:.16rem;
  object-fit: cover;
}
.ygqColor{
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: gray(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}

.ysyColor{
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: gray(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
}


.couponPage {
  height: calc(100vh - 0px);
  background-color: var(--bg-color);
}

.couponHeader{
  height: .8rem;
  background-color: var(--box-bg-color);
}
.couponHeader>ul {
  display: flex;
  height: .8rem;
  background-color: #fff;
}

.active{
  color:var(--theme-font-color);
  border-bottom: 2px var(--theme-font-color) solid;
}


.couponContainer{
  margin-top: .4rem;
}

.couponContent{
  margin-bottom: .2rem;
}

.couponArea{
  display: flex;
  flex-direction: column;
}
.areaTop{
  border-radius: .13rem;
  height: 2.4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: .027rem;
  background-color: #fff;
  align-items: center ;
}
.couponQuota{
  color: var(--theme-font-color);
  font-weight: bold;
  font-size: .7rem;
}
.couponQuota>span{
  font-size: .4rem;
  font-weight:initial;
}
.couponClass{
  margin-left: .4rem;
}

.couponClass>ul{
  padding-left: .3rem;
}

.couponClass>ul>li{
  list-style: disc;
  color: #ccc;
  line-height: .6rem;
}
.couponClass>p{
  color: var(--common-font-color);
  list-style: none;
  font-size: .43rem;
  // font-weight: bold;
  letter-spacing: .03rem;
  margin-bottom: .2rem;
}

.couponOption>button{
  background-color: var(--theme-font-color);
  color:white;
  width: 1.8666rem;
  height: .8rem;
  border-radius: 1rem;
  margin-right: .2rem;
}


.areaBottom{
  border-bottom:1px solid #e5e5e5;
  border-radius:.2rem;
  background-color: #fff;
  color: var(--common-font-color);
  display:flex;
  flex-direction: row;
  justify-content: space-between;
}

.areaBottom>p{
  margin: .2rem .32rem;
}
.areaBottom>div{
  margin-top:.12rem;
  margin-bottom:.2rem;
  margin-right: .32rem;
}

.couponDetail{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-top: #ccc solid .027rem;
  height: 2.2rem;
  background-color: white;
  border-radius: .13rem;

}
.couponDetail>img{
  width: 4.2666rem;
  /* margin-left: .4rem; */
}

.couponDiv{
  position:relative;
  background-color: white;
  height:3.5rem;
  border-radius: 0 0  .2rem .2rem;
}
.couponcode{
  position:absolute;
  top:.4rem;
  left: 50%;
  transform: translate(-50%, 0);
  height:2rem;
  object-fit: cover;
}
.detailRight{
  margin-left:.5rem;
  padding-top:2.6rem;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-evenly;
}
.detailRight span{
  color: #797979;
  font-size:.32rem;
}
.time{
  padding-left:.2rem;
  color: #797979;
}
.name{
  font-weight:900;
  color: #797979;
}
`
export default withRouter(Coupon1);