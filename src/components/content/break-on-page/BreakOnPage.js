import React, { memo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { store } from 'store/index'

const BreakOnPage = memo(props => {
  console.log(props.path)

  const history = useHistory()

  const back = useCallback(() => {
    const { isApplet } = store.getState().appConfig
    if (isApplet) {
      if (history.length === 1) {
        window.navigateToWebWiew(`#${props.path}`)
      } else {
        window.navigateGoBack()
      }
    } else {
      if (history.length === 1) {
        history.replace(`${props.path}`)
      } else {
        history.goBack()
      }
    }
  }, [props.path])

  return (
    <Style>
      <div className='back' onClick={back}>
        返回
      </div>
      <img src='https://res.lexiangpingou.cn/images/vip/return1.png' alt="" className='img' />
    </Style>
  )
})

const Style = styled.div`

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

`

export default BreakOnPage;