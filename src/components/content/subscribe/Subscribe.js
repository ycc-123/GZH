import React, { memo, useState, useEffect, Fragment, useCallback } from 'react'
import styled from 'styled-components'

import Modal from 'common/modal/Modal'

import { _apiUO } from 'network/api'

import './focus.css'

const Subscribe = memo((props) => {

  const [subscribe, setSubscribe] = useState(null)
  const [show, setShow] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    const action = 'isFocus'
    _apiUO(action).then(res => {
      if (res?.data?.data?.subscribe === 0) {
        setShowInfo(!showInfo)
      }
      setSubscribe(res?.data?.data)
    })
  }, [])

  const focus = useCallback(() => {
    setShow(!show)
  }, [show])

  const info = useCallback(() => {
    setShowInfo(!showInfo)
  }, [showInfo])

  return subscribe ?
    <div>
      {subscribe.subscribe === 0 && showInfo && subscribe.guanzhu === '1' && <Fragment>
        <Style>
          <div onClick={info} style={{ paddingRight: '.32rem', height: '100%', display: 'flex', alignItems: 'center' }}>
            <img className='cha' src={require('assets/img/chawhite.png')} alt='' />
          </div>
          <img className='use-t' src={subscribe.headimgsrc ? subscribe.headimgsrc : require('assets/img/d-t.png')}></img>
          <p>
            <span className='sub-a'>欢迎进入<span className='sub-a-a'>{subscribe.name}</span></span>
            <br />
            <span className='sub-b'>关注公众号，享受专属服务</span>
          </p>
          <button className='sub-btn' onClick={focus}>立即关注</button>
        </Style>
        {show && <div className='mask' onClick={focus}></div>}
        {show && <Modal>
          <img className='focus-img' src={subscribe.qrcodeImg} />
          <p className='focus-p'>为保证您正常接收订单信息，</p>
          <p className='focus-p'>请长按识别二维码再参与</p>
        </Modal>}
      </Fragment>}
    </div>
    :
    <div>

    </div>
})

const Style = styled.div`

position: fixed;
top: 0;
left: 0;
// bottom: calc((1.28rem) + env(safe-area-inset-bottom));
z-index: 998;
display: flex;
align-items: center;
width: 100vw;
height: 1.17rem;
padding: 0 .32rem;
background-color: rgba(0, 0, 0, .8);

.cha {
  width: .53rem;
  height: .53rem;
}

.use-t {
  margin-right: .32rem;
  width: .8rem;
  height: .8rem;
  border-radius: .13rem;
}

.sub-a {
  font-size: .32rem;
  font-weight: bold;
  color: #fff;
}

.sub-a-a {
  font-size: .32rem;
  font-weight: bold;
  color: var(--theme-font-color);
}

.sub-b {
  font-size: .29rem;
  font-weight: 300;
  color: #fff;
}

.sub-btn {
  position: absolute;
  right: .32rem;
  width: 2rem;
  height: .7rem;
  line-height: .7rem;
  border-radius: .4rem;
  background-color: var(--theme-font-color);
  font-size: .35rem;
  font-weight: bold;
  color: #fff;
}

`

export default Subscribe;