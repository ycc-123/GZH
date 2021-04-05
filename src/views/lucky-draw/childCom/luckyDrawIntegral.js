import React, { memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { setTitle } from 'commons/utils'

const styleConfig = { height: '100%' }
const scollConfig = { probeType: 1 }

const luckyDrawIntegral = memo(props => {

  const [integralState, setIntegralState] = useState(() => {
    const state = {
      integralList: []
    }
    return state
  })

  const scroll = useRef()

  useEffect(() => {
    setTitle('积分记录')
    setTimeout(() => {
      setIntegralState(prev => {
        const newState = {
          integralList: [
            { id: 1, name: '抽奖获得积分', time: '2020-1-20' },
            { id: 2, name: '抽奖获得一张20元优惠券', time: '2020-1-19' },
            { id: 3, name: '消耗积分抽奖', time: '2020-1-18' },
          ]
        }
        return { ...prev, ...newState }
      })
    }, 500)
  }, [])

  return (
    <Style>

      <img className='bg' src={require('assets/img/l-integral-bg.jpg')} alt='' />
      <p className='text'>我的积分</p>
      <div className='box'>
        <img className='integral-big' src={require('assets/img/integral-big.png')} alt='' />
        <p className='integral-num'>123</p>
      </div>
      <ul className='integral-info'>
        <BetterScroll style={styleConfig} config={scollConfig} ref={scroll}>
          {
            integralState.integralList.map((item, index) => {
              return (
                <li className='info' key={index}>
                  <div className='left'>
                    <p className='left-p1'>{item.name}</p>
                    <p className='left-p2'>{item.time}</p>
                  </div>
                  <div className='right'>
                    <img className='small' src={require('assets/img/integral-small.png')} />
                    <span className='right-num'>+10</span>
                  </div>
                </li>
              )
            })
          }
        </BetterScroll>
      </ul>
    </Style>
  );
})

const Style = styled.div`

width: 100vw;
height: 100vh;
overflow: hidden;
background-color: #F6F1EE;

.bg {
  position: relative;
  display: block;
  width: 100vw;
  height: 4.57rem;
}

.text {
  position: absolute;
  top: .77rem;
  left: .55rem;
  font-size: .37rem;
  color: #fff;
}

.box {
  position: absolute;
  top: 1.57rem;
  left: .55rem;
  display: flex;
  align-items: center;
}

.integral-big {
  width: .96rem;
  height: .96rem;
}

.integral-num {
  margin-left: .24rem;
  font-size: .96rem;
  color: #fff;
}

.integral-info {
  position: relative;
  top: -1.48rem;
  z-index: 2;
  margin: 0 auto;
  width: 8.53rem;
  height: calc(100vh - 4.57rem + 1.4rem);
  background-color: #fff;
  border-top-left-radius: .21rem;
  border-top-right-radius: .21rem;
}

.small {
  width: .37rem;
  height: .37rem;
}


.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .43rem .6rem;
  font-size: .37rem;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.left-p1 {
  color: #333;
  font-size: .37rem;
}

.left-p2 {
  font-size: .32rem;
  color: #B3B3B3;
}

.right {
  display: flex;
  align-items: center;
}

.right-num {
  margin-left: .1rem;
  font-size: .37rem;
  color: #FD7438;
}

`

export default luckyDrawIntegral