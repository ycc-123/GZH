import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'

import DetailPhotoInfo from './childCom/DetailPhotoInfo'
import DetailRecommend from './childCom/DetailRecommend'
import GroupBottomBar from './childCom/GroupBottomBar'
// import DetailPingjia from './childCom/DetailPingjia'
import DetailDrawer from './childCom/DetailDrawer'
import GroupCantjilu from './childCom/GroupCantjilu'
import GroupCantwupin from './childCom/GroupCantwupin'
import GroupShare from './childCom/GroupShare'

import { setTitle } from 'commons/utils'
import BetterScroll from 'common/betterScroll/BetterScroll'
import { getQueryString } from 'commons/AuthFunction'
import Modal from 'common/modal/Modal'
import Subscribe from 'content/subscribe/Subscribe'
import HandleError from 'commons/handleError'

import axios from 'axios'
import { _detailApi } from 'network/detail'
import { _wxConfig } from "network/profile"
import { _chatRoom } from "network/live"

import './style/group.css'

import { store } from 'store/index'
import { saveAppConfig } from "store/actionCreators"

const wx = window.wx

class Detail extends Component {
  constructor(props) {
    super(props)
    /* props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover) */
    this.isApplet = store.getState().appConfig.isApplet
    this.state = {
      data: {},
      num: 1,
      showDrawer: false,
      recommend: '',
      showShare: null,
      link: null,
      share: null,
      LIVE: 'off',
      live: '',
      height: 'calc((100vh) - env(safe-area-inset-bottom))',
      newUser: false,
      subscribe: false
    }
    this.puv_config = {
      action: 'puv',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        tuan_id: this.props.match.params.id
      }
    }
  }
  render() {
    const { data, num, showDrawer, recommend, groupstatus,
      showShare, link, img, share, LIVE, live, height, newUser, subscribe } = this.state
    const { goodsinfo } = this.state.data
    console.log(data)
    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc((100vh - 1.28rem) - env(safe-area-inset-bottom))'
    }
    const { isApplet } = store.getState().appConfig
    return (
      <Fragment>
        <div className='group' style={{ position: 'relative', height }}>
          <BetterScroll
            config={scollConfig}
            style={scrollStyle}
            ref='scroll'>
            {data.goodsinfo && <GroupCantwupin data={data} refresh={this.refresh} groupstatus={groupstatus} type={1} LIVE={LIVE} live={live} />}
            {data.goodsinfo && <GroupCantjilu data={data} groupstatus={groupstatus} refresh={this.refresh} />}
            {data.goodsinfo && <DetailPhotoInfo goods={data.goodsinfo} refresh={this.refresh} />}
            {recommend && <DetailRecommend dataList={recommend} />}
          </BetterScroll>
          {
            data.goodsinfo &&
            <GroupBottomBar userInfo={data.tuaninfo[0]}
              lacknum={data.lacknum}
              data={data}
              type={1}
              hideDrawer={this.hideDrawer}
              showDrawer={this.showDrawer}
              groupstatus={groupstatus}
              changeShow={this.changeShow} />
          }
          {data.goodsinfo && <DetailDrawer
            goods={goodsinfo}
            num={num}
            data={data}
            type={data.goodsinfo.hasoption === '1' ? 1 : 0}
            decrementNum={this.decrementNum}
            incrementNum={this.incrementNum}
            hideDrawer={this.hideDrawer}
            showDrawer={this.showDrawer}
            style={showDrawer} />}
          {data.goodsinfo && <GroupShare show={showShare} data={data} changeShow={this.changeShow} link={link} img={img} share={share} />}
        </div>
        <Subscribe />
        {
          subscribe && !isApplet &&
          <Fragment>
            <div className='mask'></div>
            <Modal>
              <img style={{ width: '6rem', height: '6rem' }} src={goodsinfo.qrcodeImg} />
              <p className='focus-p'>为保证您正常接收订单信息，</p>
              <p className='focus-p'>请长按识别二维码再参与</p>
            </Modal>
          </Fragment>
        }
        {newUser && <Fragment>
          <div className='mask'></div>
          <Modal>
            <div className='new-user-box'>
              <div className='new-user-__-1'></div>
              <div className='new-user-__-2'></div>
              <img src='https://res.lexiangpingou.cn/images/vip/20201127/newuser.png' />
              <p className='new-user-__-3'>火蝶云提醒您</p>
              <p className='new-user-__-4'>此商品为新用户专享团，老用户请重新开团</p>
              <button onClick={() => this.props.history.push('/home')}>返回首页</button>
            </div>
          </Modal>
        </Fragment>}

      </Fragment>

    );
  }

  UNSAFE_componentWillMount = async () => {

    setTitle('团详情')

    let { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo

    let detail_config, like_config, lianjie_config, live_config
    detail_config = {
      // 组团详情页
      action: 'tuanDetails',
      data: {
        uniacid: appConfig.uniacid,
        openid: appConfig.wxUserInfo.openid,
        tuan_id: this.props.match.params.id
      }
    }
    like_config = {
      // 猜你喜欢
      action: 'guess_like',
      data: {
        uniacid: appConfig.uniacid,
        app: 1
      }
    }

    lianjie_config = {
      action: 'tuanShare',
      data: {
        uniacid: appConfig.uniacid,
        tuan_id: this.props.match.params.id,
        openid: appConfig.wxUserInfo.openid,
      }
    }

    live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }

    axios.all([
      _detailApi(detail_config),
      _detailApi(like_config),
      _detailApi(lianjie_config),
      _chatRoom(live_config).catch(err => ''),
      _detailApi(this.puv_config)
    ]).then(res => {
      if (res[0].data.status === 400) {
        Toast.info(res[0].data.msg)
        setTimeout(() => {
          this.props.history.replace('/home')
        }, 1000)
      } else {
        const { share_title, share_image, share_desc } = res[2].data.data
        let title = share_title
        let imgUrl = share_image
        let desc = share_desc
        let show, newUser = false, subscribe = true
        // 组团中并且没有加入拼团
        if (res[0].data.data.goodsinfo.groupstatus === '3' && res[0].data.data.isjoin === 0) {
          show = false
        } else if (res[0].data.data.goodsinfo.groupstatus === '2') {
          show = false
        } else if (res[0].data.data.goodsinfo.groupstatus === '3' && res[0].data.data.isjoin === 1) {
          show = true
        }

        // 强制关注
        if ((res[0].data.data.goodsinfo.subscribe === '1' && res[0].data.data.goodsinfo.official_account === 1) || res[0].data.data.goodsinfo.subscribe === '0') {
          subscribe = false
        }

        if (res[0].data.data.goodsinfo.selltype === '6') {
          if (!(res[0].data.data.istuanfirst === 1 && res[0].data.data.goodsinfo.isnewuser === 0) || res[0].data.data.goodsinfo.isnewuser === 1) {
            newUser = true
          }
        }

        this.setState({
          data: res[0].data.data,
          recommend: res[1].data.data.status ? res[1].data.data.data : [],
          groupstatus: res[0].data.data.goodsinfo.groupstatus,
          showShare: show,
          link: (res[2].data && res[2].data.data && res[2].data.data.group_style_url) || '',
          img: (res[2].data && res[2].data.data && res[2].data.data.group_style_img) || '',
          share: (res[2].data && res[2].data.data) || '',
          LIVE: (res[3] && res[3].data && res[3].data.LIVE) || 'off',
          live: res[3].data,
          newUser,
          subscribe
        }, async () => {
          this.refresh()
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

          let that = this
          wx.ready(function () {
            // 获取地理位置
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                appConfig.wxUserInfo.lng = res.longitude
                appConfig.wxUserInfo.lat = res.latitude
                const action = saveAppConfig(appConfig)
                store.dispatch(action)
              }
            })
            // 新版
            wx.updateAppMessageShareData({
              title,
              link: that.link,
              imgUrl,
              desc,
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
        })
      }
    })
  }

  changeShow = () => {
    this.setState({
      showShare: !this.state.showShare,
      show: false
    })
  }

  refresh = () => {
    this.refs.scroll.BScroll.refresh()
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
    let { num } = this.state
    num += 1
    console.log(num)
    console.log('123123')
    this.setState({
      num
    })
  }
}

export default withRouter(Detail);