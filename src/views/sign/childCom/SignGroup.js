import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'
// import Modal from 'common/modal/Modal'

import BetterScroll from 'common/betterScroll/BetterScroll'

import SignGroupCountdown from './SignGroupCountdown'

import { setTitle } from 'commons/utils'
import { getUrlValue } from 'commons/utils'

import { _api } from 'network/api'

import { store } from 'store/index'

const styleConfig = { height: '100vh' }
const scollConfig = { probeType: 1 }

const wx = window.wx

const { origin, pathname, search } = window.location

let link

const SignGroup = memo(props => {

  const [signGroupState, setSignGroupState] = useState(() => {
    const state = {
      countdown: 0,
      group: [],
      nownum: 0
    }
    return state
  })

  const [show, setShow] = useState(false)

  const scroll = useRef()
  const dom = useRef()
  const activeIndex = useRef()

  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    setTitle('组团签到')
  }, [])

  useEffect(() => {
    const groupId = getUrlValue(location.search, 'group_id')
    const api_config = {
      action: 'signinProgress',
      data: {
        id: groupId,
        uniacid: store.getState().appConfig.uniacid
      }
    }
    _api(api_config).then(res => {
      if (res?.data?.status === 200) {
        const { countdown, group, nownum, invationid } = res?.data?.data

        for (let i = group.length - 1; i >= 0; i--) {
          if (nownum >= group[i].groupnum) {
            activeIndex.current = i
            break;
          }
        }

        const newState = {
          countdown,
          group,
          nownum
        }

        link = origin + pathname + search + `#/sign?group_id=${invationid}`
        const title = '积分'
        const imgUrl = 'https://res.lexiangpingou.cn/images/53/2021/01/jisuBFOKFHf26aoRZ6brOBbOWrTrNi.png'
        const desc = '我正在参与组队签到领积分活动，人数越多，奖励越丰厚，快来和我一起参与吧！'
        wx.ready(() => {
          wx.updateAppMessageShareData({
            title,
            link,
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
            link,
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
            link,
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
            link,
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
        setSignGroupState(prev => {
          return { ...prev, ...newState }
        })
      } else {
        Toast.info('未知错误', 2)
      }
    })
  }, [])

  const changeShow = useCallback(() => {
    setShow(prev => {
      return !prev
    })
  }, [show])

  const back = useCallback(() => {
    // const { isApplet } = store.getState().appConfig
    // history.replace('/sign')
    if (history.length === 2) {
      history.replace('/sign')
    } else {
      history.goBack()
    }
  }, [])


  return (
    <Style ref={dom}>
      <div className='back' onClick={back}>
        返回
      </div>
      <img src='https://res.lexiangpingou.cn/images/vip/return1.png' alt="" className='img' />
      <BetterScroll style={styleConfig} config={scollConfig} ref={scroll}>
        <img className='bg' src={require('assets/img/sing-group-bg.png')} />
        <div className='container'>
          <p className='text'>当前队伍签到进度</p>
          <p className='info'>邀请好友，组队签到，在当天活动截止前，按照团队签到人数， 当天签到积分提升相应的倍数。</p>
          <div className='ladder-number clearfix'>
            <button className='ratio'>积分倍率</button>
            <ul className='ul'>
              {
                signGroupState.group.map((item, index) => {
                  return (
                    <li key={item.groupnum}>
                      <span>{item.multiple + '%'}</span>
                      <span>{item.groupnum}人</span>
                      {activeIndex.current === index && <img src='https://res.lexiangpingou.cn/images/vip/20201127/hand.png' style={{ marginLeft: '.84rem', width: '.45rem', height: '.35rem' }} alt="" />}
                      {activeIndex.current === index && <span style={{ marginLeft: '.44rem', color: 'var(--theme-font-color)' }}>当前人数</span>}
                    </li>
                  )
                })
              }
            </ul>
          </div>
          <SignGroupCountdown countdown={signGroupState.countdown} />
          <button className='summon' onClick={changeShow}>
            立即召唤小伙伴，一起赚积分
          </button>
        </div>
      </BetterScroll>
      <div className='mask' onClick={changeShow} style={{ background: 'rgba(0, 0, 0, .75)', display: show ? 'block' : 'none' }} />
      <img className='sign-share' style={{ display: show ? 'block' : 'none', right: store.getState().appConfig.isApplet ? '15%' : '.4rem' }} src='https://res.lexiangpingou.cn/images/vip/sharejiantou.png' />
    </Style>
  );
})

const Style = styled.div`

width: 100vw;
height: 100vh;
background-color: #fff;

.back {
  position: fixed;
  z-index: 991 !important;
  top: .21rem;
  left: .47rem;
  width: 1.03rem;
  height: .96rem;
  line-height: .96rem;
  text-align: center;
  color: #fff;
}
.img {
  position: fixed;
  z-index: 990;
  top: .21rem;
  left: .47rem;
  width: 1.03rem;
  height: .96rem;
}

.bg {
  display: block;
  width: 100%;
  height: auto;
}

.container {
  position: relative;
  top: -.2rem;
  width: 100%;
  height: 10rem;
  border-radius: .27rem;
  border-top-left-radius: .27rem;
  border-top-right-radius: .27rem;
  background-color: #fff;
  overflow: hidden;
}

.text {
  margin-top: .43rem;
  text-align: center;
  font-size: .35rem;
  font-weight: 500;
}

.info {
  margin: .47rem auto 0;
  width: 7.27rem;
  text-align: center;
  font-size: .27rem;
  color: #535353;
}

.ladder-number {
  margin: .2rem auto 0;
  padding: .3rem .5rem;
  width: 9.13rem;
}

.ratio {
  float: left;
  width: 2.03rem;
  height: .77rem;
  line-height: .77rem;
  color: #fff;
  border-top-left-radius: .13rem;
  border-bottom-left-radius: .13rem;
  background: var(--theme-font-color);
}

.ul {
  float: left;
}

.ul li {
  display: flex;
  align-items: center;
  padding: 0 .5rem;
  height: .76rem;
  border-top: 1px solid rgba(139, 139, 139, .5);
  border-left: 1px solid rgba(139, 139, 139, .5);
  border-right: 1px solid rgba(139, 139, 139, .5);
}


.ul li span:nth-child(2) {
  margin-left: .5rem;
}

.ul li:last-child {
  border-bottom: 1px solid rgba(139, 139, 139, .5);
}

.summon {
  display: block;
  margin: .4rem auto 0;
  padding: 0 .4rem;
  height: 1rem;
  border-radius: .5rem;
  background: linear-gradient(0deg, #FF8F17 0%, #FE8F17 100%);
  font-weight: 800;
  color: #fff;
  box-shadow: 0 0 .1rem .03rem #FF8F17;
}

`

export default SignGroup;