import React, { useState, useCallback, useEffect, memo, useRef, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Swiper from 'swiper'
import { Toast } from 'antd-mobile'

import EventBus from 'commons/event'
import { getUrlValue } from 'commons/utils'

import { store } from 'store/index'

import { SignContext } from '../Sign'

import { _api } from 'network/api'

import "swiper/css/swiper.css"

const SignHeader = memo((props) => {

  const history = useHistory()
  const location = useLocation()

  const timerCallback = useRef()
  const wrapper = useRef()
  const container = useRef()
  const swiperRef = useRef()

  const context = useContext(SignContext)

  const { origin, pathname, search, hash } = window.location

  useEffect(() => {
    swiperRef.current = new Swiper(container.current, {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      on: {
        click(e) {
          window.location.href = e.target.getAttribute('data-link')
          // console.log(e.target.getAttribute('data-link'))
        }
      }
    })
    return () => {
      clearTimeout(timerCallback.current)
      if (swiperRef.current.el) {
        swiperRef.current.destroy(false)
      }
    }
  }, [context.signState.swiperSlide])

  // console.log('头')
  const handelBtnClick = useCallback(() => {
    const groupId = getUrlValue(location.search, 'group_id')
    // 今天未签到
    if (!context.signState.isSign) {
      const { appConfig } = store.getState()
      const newDate = new Date()
      const date = newDate.getFullYear() + '-' + (parseInt(newDate.getMonth()) + 1) + '-' + newDate.getDate()
      // 配置接口data
      const api_config = {
        action: 'signin',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          date,
          is_supplementary: 0,
          id: groupId ? groupId : 0
        }
      }
      // 调用接口
      _api(api_config).then(res => {
        if (res?.data?.status === 200) {
          Toast.info('签到成功', 1)
          timerCallback.current = setTimeout(() => {
            context.todaySign(res?.data?.data)
          }, 1200)
        } else if (res?.data?.status === 400) {
          // 参数错误，后端反的
          Toast.info(res.data.msg, 2)
        } else if (res?.data?.status === 401) {
          // 签到活动未开启跳转首页
          Toast.info(res.data.msg, 2)
          timerCallback.current = setTimeout(() => {
            history.push('/home')
          }, 2100)
        } else if (res?.data?.status === 10001) {
          // 团人数已经满了
          Toast.info(res?.data?.msg, 2)
          timerCallback.current = setTimeout(() => {
            window.location.href = origin + pathname + search + '#/sign'
            window.location.reload()
          }, 2100)
        }
      })
    } else {
      Toast.info('您今天已签到', 1)
      // 切换显示
      // EventBus.emit('showSignInfoFun')
    }
  }, [context.signState.isSign])

  // 我的积分
  const myIntegral = useCallback(() => {
    // history.push('/integral/record')
    history.push('/crechang')
  }, [])

  // 规则
  const rules = useCallback(() => {
    history.push('/sign/rules')
  }, [])


  const { isSign, swiperSlide } = context.signState

  return (
    <Style>
      <img className='h-bg' src={require('assets/img/sign-b.png')} />
      <button className='h-btn' onClick={myIntegral}>我的积分</button>
      <button className='h-btn' onClick={rules} >规则</button>
      <div className='sign' onClick={handelBtnClick}>
        <img className='h-btn-big' src={require('assets/img/sign-y.png')} />
        <p className='h-btn-p'>{isSign ? '已签到' : '签到'}</p>
      </div>
      <p className='h-sign-info'>{isSign ? '今天已签到' : '今天未签到'}</p>
      {
        Array.isArray(swiperSlide) && swiperSlide.length > 0 &&
        <div className='detail-swiper'>
          <div className="swiper-container" ref={container} >
            <div className="swiper-wrapper" ref={wrapper}>
              {
                swiperSlide.map(item => {
                  return (
                    <div className='swiper-slide' key={item.id}>
                      <img src={item.lbimgarr} className='swiper-img' data-link={item.lbimgurl} />
                    </div>
                  )
                })
              }
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      }
    </Style>
  );
})

const Style = styled.header`

position: relative;
width: 100%;
padding-top: .39rem;

.h-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 4.8rem;
}

.h-btn {
  position: absolute;
  top: .32rem;
  width: 1.65rem;
  height: .53rem;
  font-size: .29rem;
  border-radius: .27rem;
  color: #fff;
  background-color: rgba(0, 0, 0, .3);
  line-height: .53rem;
}

.h-btn:nth-child(2) {
  left: .27rem;
}

.h-btn:nth-child(3) {
  right: .27rem;
}

.sign {
  position: relative;
  margin: auto ;
  width: 2.05rem;
  height: 2.05rem;
  border-radius: 50%;
}

.h-btn-big {
  width: 100%;
  height: auto;
}

.h-btn-p {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  font-size: .48rem;
  font-weight: bold;
  color: #fff;
}

.h-sign-info {
  position: relative;
  margin-top: .24rem;
  font-size: .32rem;
  font-weight: bold;
  text-align: center;
  color: #fff;
}

.swiper-container {
  margin: .2rem auto 0;
  width: 9.33rem;
  height: 2.67rem;
  border-radius: .13rem;
}

.swiper-container .swiper-img {
  display: block ;
  width: 100%;
  height: 2.67rem;
}

.swiper-pagination {
  padding-right: .24rem;
  text-align: right;
}

.swiper-pagination-bullet {
  background-color: #fff;
  opacity: 1;
}

.swiper-pagination-bullet-active {
  background-color: #ccc;
}

`

export default SignHeader;