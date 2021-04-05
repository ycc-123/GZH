import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'

import BetterScroll from "common/betterScroll/BetterScroll"
import TabBar from 'common/tabBar/TabBar'

import LiveHuifang from './childCom/LiveHuifang'
import LiveWuzhibo from './childCom/LiveWuzhibo'
import Huifang from "./childCom/Huifang"
import ZhiBo from "./childCom/ZhiBo"

import { filterObj, setTitle } from 'commons/utils'

import axios from 'axios'
import { _chatRoom, _lives, _liveHui } from "network/live"
import { _homeApi } from 'network/home'
import { getQueryString } from 'commons/AuthFunction'


import './style/live.css'

import { store } from "store/index"


const wx = window.wx

let socketConnetion = null


// var userMember = 0

class Live extends Component {

  constructor(props) {
    super(props);
    this.state = {
      liveStatus: {}, // 直播间状态
      historyLength: '', // 直播回放数组长度
      liveHistory: [],// 直播回放数据
      userList: {},  // 聊天室用户
      loginName: '', // 登入聊天室用户
      allMsg: [], // 当前聊天室全部聊天消息
      nowSaleDetail: {}, // 当前在售商品
      avatar: {} // 直播商家头像
    }

    this.userMember = 0

    this.STImonitorLogin = null
    const { appConfig } = store.getState()
    const { memberUserInfo } = store.getState()
    const { nickname = `空昵称${Math.round(Math.random() * 100)}` } = appConfig.wxUserInfo
    const { uniacid = "" } = appConfig
    this._nickname = nickname
    this._uniacid = uniacid
    this.speaking = this.speaking.bind(this)
    this.isLoadMore = true
    this.networkConfig = {
      uniacidDetail: {
        action: 'uniacidDetail',
        data: {
          uniacid,
        }
      },
      liveHuiFang: {
        action: 'liverecord',
        data: {
          uniacid,
          page: 1,
          pagesize: 10
        }
      },
      nowSaleConfig: {
        op: 'GetMasetGoods',
        uniacid,
        memberid: appConfig.wxUserInfo.id,
        goodsid: '',
      },
      monitorLoginConfig: {
        op: 'LiveAddMemberTime',
        uniacid,
        memberid: appConfig.wxUserInfo.id,
        liverecode: 0  // 1 0 未知属性
      },
      liveRoomStatus: {
        op: 'GetLiveStatusInfo',
        uniacid,
      }
    }
    this.live_goods = {
      action: 'getMasetLiveGoods',
      data: {
        uniacid: appConfig.uniacid
      }
    }

  }



  render() {
    const { uri } = this.props.match.params
    let length;
    let live;
    let nowHuifang;
    let huifang = true;
    const { historyLength, liveHistory, nowSaleDetail, liveStatus, allMsg, loginName } = this.state
    if (historyLength !== '') {
      if (uri !== '1013') {
        nowHuifang = liveHistory.find(value => {
          return value.id === uri
        })
        if (nowHuifang && nowHuifang.uri !== "") {
          huifang = false
        }
      }
      length = historyLength
    }
    const { LIVE } = liveStatus
    let player
    if (LIVE) {
      player = liveStatus.info.player
      live = LIVE
    }

    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc((100vh - 1.2rem) - env(safe-area-inset-bottom))'
    }

    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--tab-color)' }}>

        <div className="livelive">

          {
            live === "off" && !huifang && <Huifang LIVE={LIVE ? LIVE : undefined} huifang={nowHuifang.uri}
              speaking={this.speaking} userMember={this.userMember}
              uniacImg={this.state.bigImg}
              nowSaleDetail={nowSaleDetail} allMsg={allMsg}
              loginName={loginName}
            />
          }
          {
            live === "on" &&
            <ZhiBo speaking={this.speaking} userMember={this.userMember} playerUrl={player} LIVE={LIVE ? LIVE : undefined}
              uniacImg={this.state.bigImg}
              nowSaleDetail={nowSaleDetail} allMsg={allMsg} loginName={loginName} />
          }
          {
            (live === "off" && length <= 0) && <LiveWuzhibo />
          }
          {
            (live === "off" && length > 0 && huifang) && <Fragment>
              <div className="zhibotitle" style={{ display: 'flex', width: '100%', height: '1.2rem', padding: '0 .32rem', color: 'white', alignItems: 'center' }}>
                <div className="shutiao" style={{ width: '0.07rem', height: '.39rem', backgroundColor: 'var(--theme-font-color)', marginRight: '.4rem' }}></div>
                <div className="lishihuifang" style={{ fontSize: '.32rem', fontWeight: 'bold', color: 'var(--font-color)' }}>历史回放</div>
              </div>
              <BetterScroll style={scrollStyle}
                config={scollConfig}
                loadMore={this.loadMore}
                isLoadMore={this.isLoadMore}
                ref="huifangscroll">
                <LiveHuifang liveHistory={this.state.liveHistory} LIVE={LIVE ? LIVE : undefined} />
              </BetterScroll>

            </Fragment>

          }

          {
            (live === "on" || huifang) && <TabBar />
          }
        </div>
      </div>

    )
  }


  async componentDidMount() {
    setTitle('直播')

    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    // this.socketHandel('on')


    // 直播分享
    const lianjie_config = {
      action: 'indexShare',
      data: {
        uniacid: appConfig.uniacid
      }
    }

    let allRes = await axios.all([
      _lives(this.networkConfig.uniacidDetail).catch(err => { }),
      _liveHui(this.networkConfig.liveHuiFang).catch(err => []),
      _chatRoom(this.networkConfig.liveRoomStatus).catch(err => { }),
      _homeApi(lianjie_config).catch(err => { }),
      _homeApi(this.live_goods)
    ])
    if (allRes[1].data.data.length < 10) {
      this.isLoadMore = false
    } else {
      this.isLoadMore = true
      this.networkConfig.liveHuiFang.data.page += 1
    }

    let nowSaleDetail = filterObj(allRes[4].data.data, ["gimg", "gname", "gnum", "gprice", "oprice",
      "selltype", "isshow", "id", "sid"
    ])
    this.setState({
      bigImg: allRes[0].data.data,
      liveHistory: allRes[1].data.data,
      historyLength: allRes[1].data.data.length,
      liveStatus: allRes[2].data,
      nowSaleDetail
    }, () => {
      this.socketHandel(allRes[2].data.LIVE)
      // this.refs.huifangscroll.BScroll.refresh()
      const { LIVE } = allRes[2].data
      const { live_title, liveimg, live_desc } = allRes[2].data.info
      const { share_title, share_image, share_desc } = allRes[3].data.data
      let mid = getQueryString('mid')
      let search
      if (mid) {
        // 当前用户是兼职人员
        if (wxUserInfo.enable === '1') {
          this.link = window.location.href.replace(`&mid=${mid}`, `&mid=${wxUserInfo.id}`)
          window.history.pushState(null, null, this.link)
        } else if (wxUserInfo.enable === null || wxUserInfo.enable === '0') {
          // 不是兼职人员
          this.link = window.location.href.replace(`&mid=${mid}`, '')
          window.history.pushState(null, null, this.link)
        }
      } else {
        // 没有mid
        if (wxUserInfo.enable === '1') {
          search = window.location.search
          this.link = window.location.href.replace(search, search + `&mid=${wxUserInfo.id}`)
          window.history.pushState(null, null, this.link)
        } else {
          this.link = window.location.href
        }
      }
      let that = this
      wx.ready(() => {
        // 新版
        wx.updateAppMessageShareData({
          title: LIVE === 'on' ? live_title : share_title,
          link: that.link,
          imgUrl: LIVE === 'on' ? liveimg : share_image,
          desc: LIVE === 'on' ? live_desc : share_desc,
          success: function () {
          },
          fail: function (err) {
            Toast.info(err)
          }
        })
        wx.updateTimelineShareData({
          title: LIVE === 'on' ? live_title : share_title,
          link: that.link,
          imgUrl: LIVE === 'on' ? liveimg : share_image,
          success: function () {
          },
          fail: function (err) {
            Toast.info(err)
          }
        })

        // 旧版
        wx.onMenuShareTimeline({
          title: LIVE === 'on' ? live_title : share_title,
          link: that.link,
          imgUrl: LIVE === 'on' ? liveimg : share_image,
          success: function () {
            // 用户点击了分享后执行的回调函数
          },
          fail: function (err) {
            Toast.info(err)
          }
        })
        wx.onMenuShareAppMessage({
          title: LIVE === 'on' ? live_title : share_title,
          desc: LIVE === 'on' ? live_desc : share_desc,
          link: that.link,
          imgUrl: LIVE === 'on' ? liveimg : share_image,
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

  loadMore = () => {
    const { liveHistory } = this.state
    const huifangscroll = this.refs.huifangscroll
    if (this.isLoadMore) {
      _liveHui(this.networkConfig.liveHuiFang).then(res => {
        // 如果长度不等于得时候加载 那么是到底了
        if (res.data.status === 200) {
          // 不能加载更多了
          if (res.data.data.length < 10) {
            this.isLoadMore = false
            this.setState({
              liveHistory: [...liveHistory, ...res.data.data]
            }, () => {
              huifangscroll.BScroll.finishPullUp()
              huifangscroll.BScroll.refresh()
            })
          } else {
            this.isLoadMore = true
            this.setState({
              liveHistory: [...liveHistory, ...res.data.data]
            }, () => {
              this.networkConfig.liveHuiFang.data.page += 1
              huifangscroll.BScroll.finishPullUp()
              huifangscroll.BScroll.refresh()
            })
          }
        }
      })
    }
  }




  socketHandel(liveStatus) {
    // console.log(socketConnetion )
    if (liveStatus === 'on') {
      let host = window.location.host
      if (host !== 'dev.lexiangpingou.cn') {
        socketConnetion = new WebSocket("wss://www.lexiangpingou.cn:7272")
      } else {
        socketConnetion = new WebSocket("wss://dev.huodiesoft.com:7272")
      }
      // socketConnetion = new WebSocket("wss://dev.huodiesoft.com:7272")

      socketConnetion.onopen = (e) => {
        if (this._nickname) {
          let login_data = '{"type":"login","client_name":"' +
            this._nickname.replace(/"/g, '\\"') +
            '","room_id":' +
            this._uniacid +
            "}";

          this.STImonitorLogin = setInterval(() => {
            _chatRoom(this.networkConfig.monitorLoginConfig).then(e => { })
          }, 60000)

          socketConnetion.send(login_data)
        }
      }
      // 有消息时根据 responseMessageType 显示不同的信息
      socketConnetion.onmessage = (e) => {
        let serverResponseMessage = JSON.parse(e.data)

        switch (serverResponseMessage['type']) {
          // 服务端ping 客户端，保持通信
          case 'ping':
            socketConnetion.send('{"type":"pong"}');
            break;
          // 用户进入直播间 更新用户列表
          case 'login':
            // console.log('谁进入聊天室', serverResponseMessage)
            let name = serverResponseMessage.client_name + '进入直播间'

            if (serverResponseMessage.client_list) {
              for (let i in serverResponseMessage.client_list) {
                this.userMember++
              }
            } else {
              this.userMember++
            }
            this.setState({
              userList: serverResponseMessage,
              loginName: name
            })
            // 更新dom 在线人数
            break;
          //更新当前在售商品
          case 'pushgoods':
            // 更新当前在售商品
            this.networkConfig.nowSaleConfig.goodsid = serverResponseMessage.content
            _chatRoom(this.networkConfig.nowSaleConfig).then((res) => {
              if (res.data.status === "200") {
                let nowSaleDetail = filterObj(res.data.detail, ["gimg", "gname", "gnum", "gprice", "oprice",
                  "selltype", "isshow", "id", "sid"
                ])
                this.setState({
                  nowSaleDetail,
                })
              }
            })
            break;
          //用户发言
          case 'say':
            // 添加用户发言dom
            let sayname = serverResponseMessage.from_client_name
            let saycontent = sayname + "：" + serverResponseMessage.content
            let temList = this.state.allMsg
            temList.push(saycontent)
            this.setState({
              allMsg: temList
            })
            break;
          // 用户退出直播间
          case 'logout':
            // 添加用户退出直播间dom
            // 更新人数

            this.userMember -= 1
            let outname = serverResponseMessage.from_client_name
            this.setState({
              loginName: outname + "退出直播间"
            })

            break;
          default:
            break;
        }
      }

      socketConnetion.onerror = (ev => {
        socketConnetion.close(1000, "报错断开连接")
      })
    } else {
    }
  }


  userLogoutRoom = (scn) => {
    let logout_data = '{"type":"logout","client_name":"' +
      this._nickname.replace(/"/g, '\\"') +
      '","room_id":' +
      this._uniacid +
      "}";
    scn.send(logout_data)
  }

  componentWillUnmount() {

    const { LIVE } = this.state.liveStatus
    const { isApplet } = store.getState().appConfig

    if (!isApplet) {
      let mid = getQueryString('mid')
      if (mid) {
        this.link = window.location.href.replace(`&mid=${mid}`, '')
        window.history.pushState(null, null, this.link)
      }
    }

    try {
      this.userLogoutRoom(socketConnetion)
    } catch (err) {
      console.log(err)
    }

    // this.userLogoutRoom()

    // if (LIVE === "on" && this.socketConnetion.readyState === 1) {
    //     console.log('asdasdassdsdasad')
    //     this.userLogoutRoom()
    // }

    if (LIVE === 'on') {
      socketConnetion.onclose = (e => {

      })
      socketConnetion.close(1000, "当前用户离开关闭连接")
      socketConnetion = null
    }

    clearInterval(this.STImonitorLogin)
  }
  // 聊天室发言
  speaking(content) {
    var to_client_id = 'all';
    var to_client_name = '所有人';
    socketConnetion.send(
      '{"type":"say","to_client_id":"' +
      to_client_id +
      '","to_client_name":"' +
      to_client_name +
      '","content":"' +
      content
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r") +
      '"}'
    );
  }
}

export default withRouter(Live)