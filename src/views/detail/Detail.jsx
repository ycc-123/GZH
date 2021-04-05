import React, { Component, createRef, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { Toast } from 'antd-mobile'
import HandleError from 'commons/handleError'

/* import wx from 'weixin-js-sdk' */

import DetailSwiper from './childCom/DetailSwiper'
import DetailGoodsInfo from './childCom/DetailGoodsInfo'
import DetailCourier from './childCom/DetailCourier'
import DetailPhotoInfo from './childCom/DetailPhotoInfo'
import DetailRecommend from './childCom/DetailRecommend'
import DetailBottomBar from './childCom/DetailBottomBar'
import DetailButton from './childCom/DetailButton'
/* import DetailPingjia from './childCom/DetailPingjia' */


import { getQueryString } from 'commons/AuthFunction'
import Share from 'content/share/Share'
import BetterScroll from 'common/betterScroll/BetterScroll'
import Subscribe from 'content/subscribe/Subscribe'
import Modal from 'common/modal/Modal'

import { store } from 'store/index'

import { _detailApi } from 'network/detail'
import { _wxConfig } from "network/profile"
import { _chatRoom } from "network/live"
import { _setPVUV } from 'network/api'

import { setTitle } from 'commons/utils'

import './style/detail.css'

// import Goods from 'commons/goods'


const wx = window.wx

class Detail extends Component {
  constructor(props) {
    super(props)
    // props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.isApplet = store.getState().appConfig.isApplet
    this.state = {
      ys: '',
      kc: '',
      data: '',
      recommend: [],
      num: '',
      showDrawer: false,
      share: false,
      LIVE: 'off',
      height: 'calc((100vh) - env(safe-area-inset-bottom))',
      deliverrecord: [],
      subscribe: false
    }
    this.scroll = createRef()
  }
  render() {
    const { goodsinfo, tuanorder_progress, groupinfo, deliverrecord } = this.state.data
    console.log(goodsinfo)
    console.log(this.state.data)
    const { recommend, num, share, ys, kc, LIVE, height, subscribe, showDrawer, memberExpiration = false } = this.state
    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc((100vh - 1.28rem) - env(safe-area-inset-bottom))'
    }
    let swiper
    // 当商品轮播数据长度为0时
    if (goodsinfo && goodsinfo.advs.length !== 0) {
      swiper = (
        <DetailSwiper dataList={goodsinfo.advs} index_video={goodsinfo.index_video} refresh={this.refresh} />
      )
    } else if (goodsinfo && goodsinfo.gimg) {
      swiper = (
        <DetailSwiper dataList={goodsinfo.gimg} index_video={goodsinfo.index_video} refresh={this.refresh} />
      )
    }

    const { isApplet } = store.getState().appConfig

    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--tab-color)' }}>
        {
          subscribe && !isApplet &&
          <Fragment>
            <div className='mask' onClick={(e) => { this.stop(e) }}></div>
            <Modal>
              <img style={{ width: '6rem', height: '6rem' }} src={goodsinfo.qrcodeImg} />
              <p className='focus-p'>为保证您正常接收订单信息，</p>
              <p className='focus-p'>请长按识别二维码再参与</p>
            </Modal>
          </Fragment>
        }
        <div className='detail' style={{ height: goodsinfo ? 'calc((100vh - 1.28rem) - env(safe-area-inset-bottom))' : '100vh', padding: '0 .32rem', overflowY: 'auto' }}>
          {goodsinfo && <DetailButton LIVE={LIVE} share={this.changeShare} />}
          {swiper}
          {
            goodsinfo && <DetailGoodsInfo
              ys={ys}
              kc={kc}
              goods={goodsinfo}
              tuanorder_progress={tuanorder_progress}
              groupinfo={groupinfo}
              deliverrecord={deliverrecord}
              memberExpiration={memberExpiration}
              refresh={this.refresh}
              showDrawer={this.showDrawer} />
          }
          {/* {goodsinfo && goodsinfo.isfree === '1' && < DetailCourier />} */}
          {/* <DetailPingjia /> */}
          {
            goodsinfo && <DetailPhotoInfo goods={goodsinfo} refresh={this.refresh} />
          }
          {
            recommend && <DetailRecommend dataList={recommend} changeData={this.changeData} />
          }
        </div>
        {
          groupinfo && <Share type={1} active={share} changeActive={this.changeShare} show={this.changeShare} />
        }
        {
          goodsinfo &&
          <HandleError>
            <DetailBottomBar
              goods={goodsinfo}
              num={num}
              groupinfo={groupinfo}
              decrementNum={this.decrementNum}
              incrementNum={this.incrementNum}
              hideDrawer={this.hideDrawer}
              showDrawer={this.showDrawer}
              goHome={this.goHome}
              goCart={this.goCart}
              exchangeCard={this.exchangeCard}
              style={showDrawer}
              memberExpiration={memberExpiration}
            />
          </HandleError>
        }
        {
          !isApplet && <Subscribe />
        }
      </div>
    )
  }

  stop(e) {
    // e.preventDefault()
    e.stopPropagation()
    // console.log(e)
  }

  // clearComponent = () => {
  //   dropByCacheKey('DetailComponent')
  //   console.log('清楚了详情页的缓存')
  // }

  // UNSAFE_componentWillMount = () => {
  //   window.addEventListener("popstate", this.clearComponent, false)
  // }

  // componentWillUnmount = () => {
  //   window.removeEventListener("popstate", this.clearComponent, false);
  // }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   return JSON.stringify(this.state) !== JSON.stringify(nextState)
  // }



  componentDidRecover = () => {
    const { uniacid, wxUserInfo: { openid } } = store.getState().appConfig
    const puv_config = {
      action: 'puv',
      data: {
        uniacid,
        openid,
        goodsid: this.props.match.params.id
      }
    }

    axios.all([
      _setPVUV(),
      _detailApi(puv_config)
    ])
    setTitle('商品详情')
  }

  componentDidMount = () => {
    setTitle('商品详情')

    const { appConfig } = store.getState()
    let wxUserInfo = appConfig.wxUserInfo

    // const { isApplet } = store.getState().appConfig

    const detail_config = {
      action: 'goods_detail',
      data: {
        uniacid: appConfig.uniacid,
        id: this.props.match.params.id,
        openid: wxUserInfo.openid
      }
    }
    const like_config = {
      action: 'guess_like',
      data: {
        uniacid: appConfig.uniacid,
        openid: wxUserInfo.openid,
        app: 1
      }
    }

    const lianjie_config = {
      action: 'goodsDetailShare',
      data: {
        uniacid: appConfig.uniacid,
        gid: this.props.match.params.id,
        openid: wxUserInfo.openid,
      }
    }

    const live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }

    const puv_config = {
      action: 'puv',
      data: {
        uniacid: appConfig.uniacid,
        openid: wxUserInfo.openid,
        goodsid: this.props.match.params.id
      }
    }

    let subscribe = true





    axios.all([
      _detailApi(detail_config).catch(err => ''),
      _detailApi(like_config).catch(err => ''),
      _detailApi(lianjie_config).catch(err => ''),
      _chatRoom(live_config).catch(err => ''),
      _setPVUV().catch(err => ''),
      _detailApi(puv_config).catch(err => '')
    ]).then(res => {
      if (res[0].data.status === 400) {
        Toast.info(res[0].data.msg)
        setTimeout(() => {
          this.props.history.replace('/home')
        }, 1000)
      } else {

        if (!res[0].data.data.goodsinfo) {
          Toast.info('商品信息丢失，请联系商家或者刷新页面')
        }

        if (res[0].data.data.goodsinfo.selltype !== '0') {
          if (parseInt(res[0].data.data.groupinfo.tuan_id) !== 0 && parseInt(res[0].data.data.groupinfo.one_group) === 1) {
            this.props.history.replace(`/group/${res[0].data.data.groupinfo.tuan_id}`)
            return
          }
        }

        if ((res[0].data.data.goodsinfo.subscribe === '1' && res[0].data.data.goodsinfo.official_account === 1) || res[0].data.data.goodsinfo.subscribe === '0') {
          subscribe = false
        }



        this.setState({
          ys: res[0].data.data.issell,
          kc: res[0].data.data.showPubStock,
          data: res[0].data.data,
          recommend: res[1].data.data.status ? res[1].data.data.data : [],
          // recommend: res[1].data.data.data,
          num: parseInt(this.props.match.params.num),
          LIVE: (res[3] && res[3].data && res[3].data.LIVE) || 'off',
          subscribe,
          memberExpiration: res[0]?.data?.data?.memberExpiration
        }, async () => {
          let mid = getQueryString('mid')
          let startUrl
          let endUrl = window.location.href.substring(window.location.href.indexOf('#'))
          if (mid) {
            // 当前用户是兼职人员
            if (wxUserInfo.enable === '1') {
              startUrl = window.location.href.substring(0, window.location.href.indexOf('mid') + 3) + `=${wxUserInfo.id}`
              this.link = startUrl + endUrl
            } else if (wxUserInfo.enable === null || wxUserInfo.enable === '0') {
              // 不是兼职人员
              startUrl = window.location.href.substring(0, window.location.href.indexOf('mid') - 1)
              this.link = startUrl + endUrl
            }

          } else {
            // 没有mid
            if (wxUserInfo.enable === '1') {
              startUrl = window.location.href.substring(0, window.location.href.indexOf('#')) + `&mid=${wxUserInfo.id}`
              this.link = startUrl + endUrl
            } else {
              this.link = window.location.href
            }
          }

          const { share_title, share_image, share_desc } = res[2].data.data
          // 分享标题 图片 文字描述
          let title = share_title
          let imgUrl = share_image
          let desc = share_desc


          let that = this
          wx.ready(function () {
            // 新版
            wx.updateAppMessageShareData({
              title,
              desc,
              link: that.link,
              imgUrl,
              success: function () {
              },
              fail: function (err) {
                Toast.info(err)
              }
            })
            wx.updateTimelineShareData({
              title,
              link: that.link,
              imgUrl,
              success: function () {
              },
              fail: function (err) {
                Toast.info(err)
              }
            })
            // 旧版
            wx.onMenuShareTimeline({
              title,
              link: that.link,
              imgUrl,
              success: function () {
                // 用户点击了分享后执行的回调函数
              },
              fail: function (err) {
                Toast.info(err)
              }
            })
            wx.onMenuShareAppMessage({
              title,
              desc,
              link: that.link,
              imgUrl,
              type: '',
              dataUrl: '',
              success: function () {
                // 用户点击了分享后执行的回调函数
              },
              fail: function (err) {
                Toast.info(err)
              }
            })
          })

          this.refresh()
        })
      }

    })
  }


  goHome = () => {
    const { isApplet } = store.getState().appConfig
    if (isApplet) {
      window.navigateToWebWiew('#/home')
    } else {
      this.props.history.replace('/home')
    }
  }

  goCart = () => {
    this.props.history.replace('/cart')
  }

  /**
   * 
   * time: 2020-12-22
   * content: 提货卡提交
   * author: lkd
   * 
   * */
  exchangeCard = () => {
    const { goodsinfo } = this.state.data
    this.props.history.push({ pathname: `/submit/3/${goodsinfo.id}/3/1/0/0` })
  }

  changeShare = () => {
    this.setState({
      share: !this.state.share
    })
  }

  refresh = () => {
    if (this && this.scroll && this.scroll.current && this.scroll.current.BScroll) {
      this.scroll.current.BScroll.refresh()
    }

  }

  componentWillUnmount = () => {
    this.goods = null
  }

  showDrawer = () => {
    this.setState({
      showDrawer: true
    })
  }

  hideDrawer = () => {
    this.setState({
      showDrawer: false,
    })
  }

  decrementNum = () => {
    let { num } = this.state

    if (num > 1) {
      num -= 1
    }
    this.setState({
      num
    })
  }
  incrementNum = () => {
    let { num, data } = this.state
    if (data.goodsinfo.one_limit) {
      if (num === parseInt(data.goodsinfo.one_limit)) {
        Toast.info(`当前商品最大购买${data.goodsinfo.one_limit}`, 1)
      } else {
        num += 1
        this.setState({
          num
        })
      }
    } else if (num === parseInt(data.goodsinfo.gnum)) {
      Toast.info(`当前商品数量不能超过${data.goodsinfo.gnum}`, 1)
    }
  }
}

export default withRouter(Detail);