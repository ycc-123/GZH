import React, { memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

let h, m, s, hh, mm, ss

const SignGroupCountdown = memo(props => {
  const [countdown, setCountdown] = useState(0)

  const timer = useRef()

  useEffect(() => {
    setCountdown(props.countdown)
    timer.current = setInterval(() => {
      setCountdown(prev => {
        if (prev > 0) {
          return prev - 1
        }
      })
    }, 1000)

    return () => {
      clearInterval(timer.current)
    }

  }, [props.countdown])

  if (typeof countdown === 'number') {
    h = parseInt(countdown / 3600)
    m = parseInt(countdown / 60 % 60)
    s = parseInt(countdown % 60)
    hh = h.toFixed().length === 1 ? `0${h}` : h
    mm = m.toFixed().length === 1 ? `0${m}` : m
    ss = s.toFixed().length === 1 ? `0${s}` : s
  } else {
    hh = '00'
    mm = '00'
    ss = '00'
  }

  return (
    <Styled>
      <span></span>
      <div className='countdown'>
        剩余
        <div className='hh'>{hh}</div>
        :
        <div className='mm'>{mm}</div>
        :
        <div className='ss'>{ss}</div>
        结束
      </div>
      <span></span>
    </Styled>
  );
})

const Styled = styled.div`

margin-top: .2rem;
display: flex;
justify-content: space-between;
align-items: center;

span {
  width: 22%;
  height: 1px;
  background: #CCC;
}

.countdown {

}

.hh,
.mm,
.ss {
  display: inline-block;
  min-width: .5rem;
  min-height: .5rem;
  padding: .05rem;
  margin: 0 0.1rem;
  font-size: .26rem;
  background: black;
  color: white;
  text-align: center;
}


`

export default SignGroupCountdown;