import React, { memo, useCallback } from 'react'
import styled from 'styled-components'

const BlackList = memo(props => {

  const closeWX = useCallback(() => {
    window.wx.closeWindow()
  }, [])

  return (
    <Style>
      <div className='container'>
        <img className='bg' src={require('assets/img/blacklist-bg.png')} />
        <p className='p'>由于您多次异常交易,</p>
        <p>系统无法继续给您提供服务</p>
        <p>非常抱歉给您带来不便,</p>
        <p>如需恢复服务请联系客服!</p>
        <p className='prompt'>点击确定可以返回微信</p>
        <button className='blacklist-btn' onClick={closeWX}>确定</button>
      </div>
    </Style>
  );
})

const Style = styled.div`

position: relative;
width: 100vw;
height: 100vh;

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: .27rem;
  /* overflow: hidden; */
  background-color: #fff;
}

.bg {
  margin-top: -.7rem;
  display: block;
  width: 8.55rem;
  height: auto;
}

.container p {
  text-align: center;
  font-size: .56rem;
  color: #313131;
}

.container .p{
  margin-top: .73rem;
}

.container .prompt {
  margin-top: .6rem;
  font-size: .37rem;
  color: #787878;
}

.blacklist-btn {
  display: block;
  margin: .63rem auto .65rem ;
  width: 5.03rem;
  height: .95rem;
  background-color: #FF762E;
  border-radius: .47rem;
  color: #fff;
  font-weight: bold;
  font-size: .37rem;
}

`

export default BlackList;