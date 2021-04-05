import React, { memo, useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Modal, Toast } from "antd-mobile"

import BreakOnPage from 'content/break-on-page/BreakOnPage'

import LuckyPrizeInfo from './childCom/LuckyPrizeInfo'

import { _apiUO } from 'network/api'

import { setTitle } from 'commons/utils'

import './lucky.css'
import { _api } from 'network/api'

const styleConfig = { height: '100vh' }
const scollConfig = { probeType: 1 }

/**
 * 
 * time: 2021-1-27
 * author: lkd
 * content: 抽奖功能
 * 
 * @param {onRotation} boolean 是否处于抽奖中
 * @param {discDom} dom 绑定圆盘的dom
 * @param {lamp} 灯的数量
 * @param {luckyDrawCount} num 保存用户转了几次
 * @param {oldDeg} num 保存转盘上一次的度数
 * @param {transitionEnd} fun 监听过度结束
 * @param {radian} num 每个扇形的弧度
 * @param {score} num 用户积分
 * @param {prizeInfo} obj 奖品信息
 * @param {is_free_counts} string 是否开启免费抽奖次数开关
 * @param {free_counts} num 免费抽奖次数
 * @param {wrapper} dom 包装
*/

const LuckyDraw = memo(props => {

  const [lamp] = useState(() => {
    let arr = []
    for (let i = 0; i < 24; i++) {
      arr.push({})
    }
    return arr
  })

  const [luckyDrawState, setLuckyDrawState] = useState(() => {
    const state = {
      prize: [],
      radian: 0,
      score: 0,
      prizeInfo: null,
      free_counts: 0,
      lottery_cost: null,
      is_free_counts: '0'
    }
    return state
  })

  const discDom = useRef()
  const onRotation = useRef()
  const luckyDrawCount = useRef()
  const oldDeg = useRef()
  const bigRound = useRef()
  const smallRound = useRef()
  const timer = useRef()
  const timerTwo = useRef()
  const wrapper = useRef()
  const history = useHistory()

  // useEffect(() => {

  // }, [])

  useEffect(() => {
    setTitle('抽奖')
    const fontSize = document.querySelector('html').style.fontSize.replace('px', '')
    bigRound.current = parseInt(fontSize * 9) % 2 === 0 ? parseInt(fontSize * 9) : parseInt(fontSize * 9) + 1
    smallRound.current = parseInt(fontSize * 7.8) % 2 === 0 ? parseInt(fontSize * 7.8) : parseInt(fontSize * 7.8) + 1
    // 设置默认值
    // 默认用户不处于过度过程
    onRotation.current = false
    // 默认用户抽奖次数0
    luckyDrawCount.current = 0
    // 默认上一次的度数为0
    oldDeg.current = 0
    const action = 'prize'
    _apiUO(action).then(res => {
      if (res?.data?.status === 200) {
        const { list, score, free_counts, lottery_cost, is_free_counts } = res?.data?.data
        let arr = []
        for (let i = 0; i < list.length; i++) {
          arr.push(list[i])
        }
        setLuckyDrawState(prev => {
          const newState = {
            prize: arr,
            radian: 360 / list.length,
            score,
            free_counts,
            lottery_cost,
            is_free_counts
          }
          return { ...prev, ...newState }
        })
      } else if (res?.data?.status === 400) {
        Toast.info(res.data.msg)
      }
    })

  }, [])

  useEffect(() => {
    // 移除监听副作用
    discDom.current.addEventListener('transitionend', transitionEnd)
    return () => {
      if (discDom.current) {
        discDom.current.removeEventListener('transitionend', transitionEnd)
      }
      if (timer.current) {
        clearTimeout(timer.current)
      }
      if (timerTwo.current) {
        clearTimeout(timerTwo.current)
      }
    }
  }, [])

  // 
  const transitionEnd = useCallback(() => {
    const lamp = Array.prototype.slice.call(wrapper.current.querySelectorAll('.light'))
    lamp.forEach((item, index) => {
      item.style.animationPlayState = 'paused'
      if ((index + 1) % 2 === 0) {
        item.style.animation = ''
      }
    })
    // 延迟500毫秒 加上过度时间一共 4.5s之后才能点击
    timerTwo.current = setTimeout(() => {
      onRotation.current = false
    }, 500)

  }, [])


  const luckyDrawApi = useCallback(() => {
    const action = 'getRand'
    _apiUO(action).then(res => {
      if (res?.data?.status === 200) {
        const { id, score, free_counts } = res.data.data
        const { prize, radian } = luckyDrawState
        // 当动画停止时
        onRotation.current = true
        // 随机奖品
        const prizeIndex = prize.findIndex(item => item.id === id)
        // 6等份 58个数字 29到-29
        let num = Math.floor(Math.random() * (radian - 8) + (365 - prizeIndex * radian - radian / 2))
        // let num = parseInt(Math.random() * (radian - 4) - 41)
        luckyDrawCount.current = luckyDrawCount.current + 1
        // 需要旋转的度数
        let needDeg = num + 1440 * luckyDrawCount.current
        // 保证最少转两圈圈
        if (needDeg - oldDeg.current < 1440) {
          needDeg += 720
        }
        oldDeg.current = needDeg
        discDom.current.style.transform = `rotateZ(${needDeg}deg) translate3d(0,0,0)`
        const lamp = Array.prototype.slice.call(wrapper.current.querySelectorAll('.light'))
        lamp.forEach((item, index) => {
          item.style.animationPlayState = 'running'
          if ((index + 1) % 2 === 0) {
            item.style.animation = 'yellowTwinkling 2s linear infinite'
          } else {
            item.style.animation = 'whiteTwinkling 2s linear infinite'
          }
        })

        timer.current = setTimeout(() => {
          setLuckyDrawState(prev => {
            const newState = {
              prizeInfo: res.data.data,
              score,
              free_counts
            }
            return { ...prev, ...newState }
          })
        }, 4500)

      } else if (res?.data?.status === 400) {
        Toast.info(res.data.msg, 2)
      }
    })
  }, [luckyDrawState])

  const luckyDraw = useCallback(() => {
    // 是否正在抽奖
    if (onRotation.current) {
      console.log('123')
      return
    }
    if (luckyDrawState.free_counts === 0) {
      Modal.alert(`是否消耗${luckyDrawState.lottery_cost}积分抽奖`, '', [
        { text: '取消' },
        {
          text: '确认', onPress: () => {
            // 剩余积分大于消耗积分
            if (Number(luckyDrawState.score) >= Number(luckyDrawState.lottery_cost)) {
              setLuckyDrawState(prev => {
                const newState = {
                  score: (Number(luckyDrawState.score) - Number(luckyDrawState.lottery_cost)).toFixed(2)
                }
                return { ...prev, ...newState }
              })
              luckyDrawApi()
            } else {
              Toast.info('积分不足', 2)
            }
          }
        },
      ])
    } else {
      luckyDrawApi()
    }

  }, [luckyDrawState])

  const closePrizeInfo = useCallback(() => {
    setLuckyDrawState(prev => {
      const newState = {
        prizeInfo: null
      }
      return { ...prev, ...newState }
    })
  }, [luckyDrawState])

  const luckyRules = useCallback(() => {
    history.push('/luckydraw/rules')
  }, [])

  const integralRecord = useCallback(() => {
    history.push('/crechang')
  }, [])

  return (
    <Style>
      <BreakOnPage path='/profile' />
      <button className='lucky-my-integral'>我的积分: {luckyDrawState.score}</button>
      <div className='box'>
        <img className='top' src={require('assets/img/lucky-top.png')} />
        <div className='lucky-wrapper' ref={wrapper}>
          {
            lamp.map((item, index) => {
              return (
                <div className="light" key={index} style={{ transform: 'rotate(' + index * 15 + 'deg)', borderRadius: '50%' }} ></div>
              )
            })
          }
          <div className='disc' ref={discDom} style={{ width: `${smallRound.current}px`, height: `${smallRound.current}px` }}>
            {
              luckyDrawState.prize.map((item, index) => {
                return (
                  <div
                    className={`sector sector${luckyDrawState.prize.length}`}
                    key={index}
                    style={{ transform: `rotate(${index * luckyDrawState.radian - luckyDrawState.radian / 2 - 1}deg)`, width: `${smallRound.current / 2}px`, height: `${smallRound.current}px` }}>
                    <div
                      className={`sector-inner sector-inner${luckyDrawState.prize.length}`}
                      style={{ transform: ` translateX(-${smallRound.current / 2}px) rotate(${luckyDrawState.radian + 1}deg)`, width: `${smallRound.current / 2}px`, height: `${smallRound.current}px` }}>
                      <span
                        className={`prize-text prize-text${luckyDrawState.prize.length}`}
                        style={{ transform: `rotate(${-luckyDrawState.radian / 2}deg)` }}>
                        {item.name}
                      </span>
                      {/* type 1 积分 2 优惠券 3 实物奖励 4 谢谢惠顾 */}
                      {
                        item.type === '1' &&
                        <img
                          className={`prize-img prize-img${luckyDrawState.prize.length}`}
                          src={require('assets/img/integral-big.png')} style={{ transform: `rotate(${-luckyDrawState.radian / 2}deg)` }} />
                      }

                      {
                        item.type === '2' &&
                        <img
                          className={`prize-img prize-img${luckyDrawState.prize.length}`}
                          src={require('assets/img/lucky-coupon.png')} style={{ transform: `rotate(${-luckyDrawState.radian / 2}deg)` }} />
                      }

                      {
                        item.type === '3' &&
                        <img
                          className={`prize-img prize-img${luckyDrawState.prize.length}`}
                          src={item.img} style={{ transform: `rotate(${-luckyDrawState.radian / 2}deg)` }} />
                      }

                      {
                        item.type === '4' &&
                        <img
                          className={`prize-img prize-img${luckyDrawState.prize.length}`}
                          src={require('assets/img/thank.png')} style={{ transform: `rotate(${-luckyDrawState.radian / 2}deg)` }} />
                      }


                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className='pointer' onClick={luckyDraw}>
            <div className='lucky-draw'>
              <div className='ornament'>
                <p className='text'>点击抽奖</p>
                {/* 下一版本上线免费次数 */}
                {/* <p className='num'>{luckyDrawState.is_free_counts === '1' ? `剩余0次抽奖` : `剩余${luckyDrawState.free_counts}次抽奖`}</p> */}
                <p className='num'>免费抽奖次数0</p>
              </div>
            </div>
          </div>
          <div className='angle'></div>
        </div>
        <div className='btn-bottom clearfix'>
          <button className='rules' onClick={luckyRules}>抽奖规则</button>
          <button className='integral' onClick={integralRecord} >积分</button>
        </div>
      </div>
      <LuckyPrizeInfo prizeInfo={luckyDrawState.prizeInfo} close={closePrizeInfo} />
    </Style>
  )

})

const Style = styled.div`

position: relative;
height: 100vh;
overflow-y: scroll;
background-color: #fff;

.top {
  display: block;
  width: 100vw;
  height: auto;
}

.box {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(0deg, #FF6047 0%, #FF5C5C 100%);
}

.lucky-wrapper {
  position: relative;
  top: .5rem;
  margin: auto;
  padding: .6rem;
  width: 9rem;
  height: 9rem;
  background: linear-gradient(0deg, #E91D1D 0%, #FF4851 100%);
  border-radius: 50%;
  box-shadow: 0 0 .1rem .05rem #D9201F;
  overflow: hidden;
}

.disc {
  position: relative;
  width: 7.8rem;
  height: 7.8rem;
  border-radius: 50%;
  background-color: linear-gradient(0deg, #E91D1D 0%, #FF4851 100%);
  overflow: hidden;
  transform: rotateZ(0deg) translate3d(0,0,0);
  transition: transform 4s ease-in-out; 
}


/* .disc:hover {
  transform: rotate(360deg);
} */

.sector {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transform-origin: left center;
}


.prize-text4 {
  margin-left: -.9rem;
  margin-top: .65rem;
}

.prize-img4 {
  margin-top: .5rem;
  padding-left: 1.85rem;
}



.sector5 {
  left: 3.9rem;
  width: 3.9rem;
}

.sector-inner5 {
  padding-top: .6rem;
  width: 3.9rem;
  height: 7.2rem;
}



.sector6 {
  left: 3.9rem;
  width: 3.9rem;
}

.sector-inner6 {
  padding-top: .6rem;
  width: 3.9rem;
  height: 7.2rem;
}

.prize-text6 {
  margin-left: .5rem;
  margin-top: .1rem;
}

.prize-img6 {
  margin-top: -.1rem;
  margin-left: 2.1rem;
}

.sector-inner {
  text-align: center;
  display: block;
  padding-top: .6rem;
  width: 3.9rem;
  height: 7.8rem;
  transform-origin: right center;
}

.sector:nth-child(2n+1) .sector-inner {
  background: #fef6e0;
}

.sector:nth-child(2n) .sector-inner {
  background: #fff;
}


.prize-text {
  display: block;
  font-size: .4rem;
  transform-origin: center;
  color: #d46854;
}

.prize-img {
  display: block;
  width: .93rem;
  height: .93rem;
  transform-origin: center;
  color: #d46854;
  box-sizing: content-box;
}

.pointer {
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* padding: .19rem; */
  width: 3.38rem;
  height: 3.38rem;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 .18rem .01rem #FF4851;
}

.angle {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 27.5%;
  transform: translate(-50%, 0);
  width: 0;
  height: 0;
  border-bottom: .5rem solid #E91D1D;
  border-left: .5rem solid transparent;
  border-right: .5rem solid transparent;
}

.lucky-draw {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: .2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(0deg, #E91D1D 0%, #FF4851 100%);
}

.ornament {
  margin: 0 auto;
  padding-top: .2rem;
  width: 1.69rem;
  height: 1.05rem;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
  border-radius: 50%;
}

.light {
  position: absolute;
  height: .26rem;
  width: .26rem;
  border-radius: 50%;
  top: .17rem;
  left: 4.37rem;
  transform-origin: .13rem 4.37rem;
  animation-play-state: paused;
  /* transition: all 4s ease-in-out;  */
}

.text {
  margin: 0 auto;
  width: 1.4rem;
  line-height: 1.2;
  text-align: center;
  font-size: .6rem;
  color: #fff;
}

.num {
  margin-left: -.465rem;
  margin-top: .1rem;
  width: 2.62rem;
  text-align: center;
  font-size: .32rem;
  color: #fff;
  opacity: .45;
}

.light:nth-child(2n) {
  background-color: yellow;
}

.light:nth-child(2n+1) {
  background-color: #fff;
}


.btn-bottom {
  width: 100%;
  padding: 1rem 0;
}

.rules,
.integral {
  width: 2.4rem;
  height: 1.07rem;
  font-size: .37rem;
  background-color: #FFBE1A;
  color: #FF3E21;
  border-radius: .53rem;

}

.rules {
  float: left;
  margin-left: 2rem;
}

.integral {
  float: right;
  margin-right: 2rem;
}

@keyframes yellowTwinkling {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes whiteTwinkling {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

`

export default LuckyDraw;