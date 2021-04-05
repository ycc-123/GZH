import React, { useState, useCallback, useEffect, memo, useRef, useContext, useLayoutEffect } from 'react'
import styled from 'styled-components'
import Modal from 'common/modal/Modal'

import EventBus from 'commons/event'

import { store } from 'store'

import './style.css'


/**
 * 
 * time: 2020-1-8
 * author: lkd
 * content: 显示签到获得积分
 * @param {showSignInfo} boolean 是否显示
 * @param {handelSignInfo} fun 修改是否显示
 * showSignInfoFun 已签到的用户可以通过这个函数再次让签到信息弹出
 * 
 * */


const SignIntegral = memo((props) => {
  console.log('弹窗')

  const [showSignInfo, setShowSignInfo] = useState(false)

  const handelSignInfo = useCallback(() => {
    setShowSignInfo(!showSignInfo)
  }, [showSignInfo])

  useLayoutEffect(() => {
    if (props.isSign) {
      setShowSignInfo(true)
    }
    // else {
    //   setShowSignInfo(showSignInfo => !showSignInfo)
    // }
  }, [props.isSign])


  // useEffect(() => {
  //   EventBus.addListener('showSignInfoFun', handelSignInfo)
  //   return () => {
  //     EventBus.removeListener('showSignInfoFun', handelSignInfo)
  //   }
  // }, [])

  return (
    <div style={{ display: showSignInfo && props.isSign && props.isShow ? 'block' : 'none' }}>
      <div className='mask' style={{ background: 'rgba(0, 0, 0, .75)' }} />
      <img className='sign-share' src='https://res.lexiangpingou.cn/images/vip/sharejiantou.png' style={{ right: store.getState().appConfig.isApplet ? '15%' : '.4rem' }} />
      <Modal>
        <div style={{ display: showSignInfo && props.isSign && props.isShow ? 'block' : 'none' }}>
          <img className='sign-i' src={require('assets/img/sign-i.png')} />
          <img className='sign-cha' onClick={handelSignInfo} src={require('assets/img/sign-cha.png')} />
          <button className='sign-integral-btn'>
            邀请好友获得更多积分
          </button>bili
          <div className='sign-info'>
            <p className='sign-info-p-first'>
              恭喜您获得
              <span className='sign-info-span-first'>{props.score}</span>
              积分
              </p>
          </div>
        </div>
      </Modal>
    </div>
  )
})

export default SignIntegral;