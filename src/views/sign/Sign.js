import React, { useState, useCallback, useEffect, memo, useContext, createContext, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { Toast } from 'antd-mobile'

import BetterScroll from 'common/betterScroll/BetterScroll'

import SingHeader from './childCom/SignHeader'
import SignCalendar from './childCom/SignCalendar'
import SignUserInfo from './childCom/SignUserInfo'
import SignIntegral from './childCom/SignIntegral'

import { setTitle } from 'commons/utils'
import { documentObserver, getUrlValue } from 'commons/utils'

import { store } from 'store/index'

import axios from 'axios'
import { _api } from 'network/api'

/**
 * 
 * time: 2020-1-8
 * author: lkd
 * content: 签到基础功能开发
 * @param {isSign} boolean 今天是否签到
 * @param {isShow} boolean 是否要显示
 * @param {swiperSlide} arr 轮播数据
 * @param {monthSign} arr 本月签到天数
 * @param {score} num 签到获得积分
 * @param {todaySign} fun 签到方法
 * @param {SignContext} obj 数据共享
 * @param {avatarImg} arr 用户签到的头像
 * @param {invitationid} num 签到团的id
 * @param {supplementary_cost} num 补签消耗的积分
 * @param {teamTime} str 签到限时的文案
 * @param {supplementary} 补签开关 0 关 1 开
 * 
 * */

const wx = window.wx


const styleConfig = { height: '100vh' }
const scollConfig = { probeType: 1 }

const { origin, pathname, search, hash } = window.location

let newSearch, link

export const SignContext = createContext()

const Sign = memo(props => {

  const [signState, setSignState] = useState(() => {
    const state = {
      isSign: false,
      isShow: false,
      swiperSlide: [],
      monthSign: [],
      score: 0,
      avatarImg: [],
      teamNumber: 0,
      ison: 0,
      teamTime: null,
      invitationId: 0,
      supplementary_cost: 0,
      supplementary: 0
    }
    return state
  })

  const srcoll = useRef()
  const dom = useRef()
  const domObserver = useRef()
  const timer = useRef()

  const location = useLocation()

  useEffect(() => {
    setTitle('积分签到')
  }, [])

  useEffect(() => {
    const { appConfig } = store.getState()
    const groupId = getUrlValue(location.search, 'group_id')
    const newDate = new Date()
    const date = newDate.getFullYear() + '-' + (parseInt(newDate.getMonth()) + 1) + '-' + newDate.getDate()
    const sign_config = {
      action: 'signinInfo',
      data: {
        uniacid: appConfig.uniacid,
        openid: appConfig.wxUserInfo.openid,
        date,
        id: groupId ? groupId : 0
      }
    }

    axios.all([
      _api(sign_config)
    ]).then(res => {
      if (res[0]?.data?.status === 200) {
        const { todaysign, list, slide, avatarimg, teamnumber, ison, teamtime, invitationid, supplementary_cost, supplementary } = res[0]?.data?.data
        let sign = false
        if (todaysign === 1) {
          sign = true
        }
        const newState = {
          isSign: sign,
          swiperSlide: slide,
          monthSign: list,
          avatarImg: avatarimg,
          teamNumber: teamnumber,
          ison,
          teamTime: teamtime,
          invitationId: invitationid,
          supplementary_cost,
          supplementary
        }
        // 判断url是否存在group_id
        if (groupId) {
          // 存在id将替换为当前用户的id
          newSearch = search.replace(`?group_id=${groupId}`, `?group_id=${invitationid}`)
          link = origin + pathname + newSearch + hash
        } else {
          // 不存在将用户id拼接到url上
          link = window.location.href + `?group_id=${invitationid}`
        }
        const { isApplet } = store.getState().appConfig
        if (isApplet) {
          // 今天已经签到
          if (todaysign === 1) {
            window.history.pushState(null, null, link)
          }
        }
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
        setSignState(prev => {
          return { ...prev, ...newState }
        })
      } else if (res[0]?.data?.status === 400) {
        Toast.info(res[0].data.msg, 2)
      } else if (res[0]?.data?.status === 401) {
        // 活动时间已过期
        Toast.info(res[0].data.msg, 2)
        timer.current = setTimeout(() => {
          window.location.href = origin + pathname + search + '#/sign'
          window.location.reload()
        }, 2100)
      }
    })
    // 观察dom的改变
    domObserver.current = documentObserver(dom.current, srcoll.current.BScroll)
    return () => {
      domObserver.current.disconnect()
      clearTimeout(timer.current)
    }
  }, [])

  const todaySign = useCallback(todayData => {
    if (!signState.isSign) {
      const newState = {
        isSign: !signState.isSign,
        isShow: true,
        monthSign: todayData.signin_info,
        score: todayData.score,
        teamNumber: todayData.teamnumber,
        avatarImg: todayData.avatarimg,
        invitationId: todayData.invitationid
      }

      const groupId = getUrlValue(location.search, 'group_id')

      if (groupId) {
        newSearch = search.replace(`?group_id=${groupId}`, `?group_id=${todayData.invitationid}`)
        link = origin + pathname + newSearch + hash
      } else {
        link = window.location.href + `?group_id=${todayData.invitationid}`
      }

      const { isApplet } = store.getState().appConfig

      if (isApplet) {
        window.history.pushState(null, null, link)
      }

      // link = window.location.href + `?group_id=${invitationid}`
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

      setSignState(prev => {
        return { ...prev, ...newState }
      })
    }
  }, [])

  // console.log(signState)

  // 补签
  const supplementarySign = useCallback(supplementaryData => {
    const newState = {
      monthSign: supplementaryData.signin_info || supplementaryData.list,
      supplementary_cost: supplementaryData.supplementary_cost,
      supplementary: supplementaryData.supplementary
    }
    setSignState(prev => {
      return { ...prev, ...newState }
    })
  }, [])

  return (
    <Style ref={dom}>
      <BetterScroll style={styleConfig} config={scollConfig} ref={srcoll}>
        <SignContext.Provider value={{ todaySign, supplementarySign, signState }}>
          <SingHeader />
          <SignCalendar />
          {signState.ison === 1 && <SignUserInfo />}
        </SignContext.Provider>
      </BetterScroll>
      <SignIntegral isSign={signState.isSign} isShow={signState.isShow} score={signState.score} />
    </Style >
  );
})

const Style = styled.div`

width: 100vw;
height: 100vh;
background-color: #EBEBEB;

`

export default Sign;