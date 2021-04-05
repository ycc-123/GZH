//公共库
import React, { Component, createRef } from 'react';
import './style/profile.css'
import { _getMemberDetails, _controlSwitch } from 'network/profile'
import { store } from 'store'
import axios from 'axios'

// 子组件
import TabBar from 'common/tabBar/TabBar'
import ProfileHeader from './childCom/ProfileHeader'
import ProfileOrder from './childCom/ProfileOrder'
import ProfileMember from './childCom/ProfileMember'

// 公共组件
import PageLoading from 'common/pageLoading/PageLoading'
import Logo from 'content/logo/Logo'
import LiveButton from 'content/live/LiveButton'
import BetterScroll from 'common/betterScroll/BetterScroll'

// 网络请求
import { _chatRoom } from "network/live"
import { _setPVUV } from 'network/api'

// redux
import { saveControlSwitch, saveMemberUserInfo } from 'store/actionCreators'

import { setTitle } from 'commons/utils'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.isApplet = store.getState().appConfig.isApplet
    this.state = {
      memberInfo: {},
      memberMenu: [],
      memberCommision: [],
      copyright_removal: 0,
      loading: true,
      live: '',
      height: this.isApplet ? 'calc((100vh) - env(safe-area-inset-bottom))' : 'calc(100vh - 0px)',
      orderNumZeroState: JSON.parse(window.localStorage.getItem('vipEnd')).vipEnd
    }
    props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.defaultAvatar = 'https://res.lexiangpingou.cn/images/vip/defaultimg.png'
    this.scroll = createRef()
    const { appConfig } = store.getState()
    const { uniacid, wxUserInfo } = appConfig
    const { openid } = wxUserInfo
    this.networkConfig = {
      memberInfoDetail: {
        action: 'getMemberDetails',
        data: {
          uniacid,
          openid
        }
      },
      getMember: {
        action: 'getMember',
        data: {
          openid
        }
      }
    }
  }


  render() {
    const { copyright_removal, loading, live, height, orderNumZeroState } = this.state
    console.log(orderNumZeroState)
    const scrollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: orderNumZeroState !== 1 ? 'calc((100vh - 1.28rem) - env(safe-area-inset-bottom))' : 'calc(100vh - env(safe-area-inset-bottom))'
    }
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--tab-color)' }}>
        { live !== '' && <LiveButton live={live} />}
        <PageLoading loading={loading} />
        <div className="profile" style={{ height }}>
          <div style={{
            backgroundImage: 'https://res.lexiangpingou.cn/images/vip/profileBar.png")', position: "absolute",
            top: "0", height: "1rem",
          }}></div>
          <BetterScroll config={scrollConfig} style={scrollStyle} ref={this.scroll}>
            <div>
              <ProfileHeader defaultAvatar={this.defaultAvatar} memberInfo={this.state.memberInfo} />
              <div style={{ marginLeft: ".32rem", marginRight: ".32rem" }}>
                {
                  orderNumZeroState !== 1 && <ProfileOrder />
                }
                {this.state.memberMenu && <ProfileMember memberMenu={this.state.memberMenu} itemNum={this.state.memberMenu.length} />}
                {this.state.memberMenu && <ProfileMember memberMenu={this.state.memberCommision} memberInfo={this.state.memberInfo} itemNum={this.state.memberCommision.length} />}
                {copyright_removal === 0 && <Logo />}
              </div>
            </div>

          </BetterScroll>
          {
            orderNumZeroState !== 1 && <TabBar className="profile-tabar" />
          }
        </div>
      </div >

    );
  }

  async componentDidMount() {
    setTitle('个人中心')

    const { appConfig } = store.getState()
    const live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }

    let allRes = await axios.all([
      _controlSwitch().catch(err => ''),
      _getMemberDetails(this.networkConfig.getMember).catch(err => ''),
      _getMemberDetails(this.networkConfig.memberInfoDetail).catch(err => ''),
      _chatRoom(live_config).catch(err => ''),
      _setPVUV()
    ])

    // 全局功能点开关
    let controlRES = allRes[0]

    if (controlRES.data.status === 200) {
      let kaiguanData = controlRES.data.data;
      const action = saveControlSwitch(kaiguanData)
      store.dispatch(action)
    }


    // 会员主要信息
    let memberInfo = allRes[1]

    memberInfo = memberInfo.data.data
    // 获取个人中心菜单
    let memberDetail = allRes[2]

    let live = allRes[3]

    let data = memberDetail.data
    if (data.status === 200) {
      this.setState({
        memberInfo,
        memberMenu: data.data.module.first,
        memberCommision: data.data.module.second,
        copyright_removal: memberInfo.copyright_removal,
        loading: false,
        live: (live && live.data) || ''
      }, () => {
        // 存入store
        const action = saveMemberUserInfo(memberInfo)
        store.dispatch(action)
        this.scroll.current.BScroll.refresh()
      })
    }

  }

  componentDidCache = () => {
    // 组件被缓存
    console.log('List 组件被缓存')
  }

  componentDidRecover = async () => {
    // 组件被恢复
    setTitle('个人中心')
    const { appConfig } = store.getState()
    const live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }
    axios.all([
      _getMemberDetails(this.networkConfig.getMember).catch(err => ''),
      _chatRoom(live_config).catch(err => ''),
      _setPVUV().catch(err => '')
    ]).then(res => {
      if (res[0].data.status === 200) {
        this.setState({
          memberInfo: res[0].data.data,
          live: (res[1] && res[1].data) || ''
        }, () => {
          console.log(123123123123)
          const action = saveMemberUserInfo(res[0].data.data)
          store.dispatch(action)
          this.scroll.current.BScroll.refresh()
        })
      } else if (res[0].data.status === 400) {
        localStorage.clear()
        window.location.reload()
      }
    })
  }
}

export default Profile;