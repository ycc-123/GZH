import React, { useState, useRef, useEffect, useCallback, memo, useLayoutEffect } from 'react'
import EventBus from 'commons/event'
import styled from 'styled-components'
import CaptchaMini from 'captcha-mini'
import { Toast } from 'antd-mobile'

const SubmitExchange = memo(props => {

  /**
   * 
   * time: 2020-12-23
   * content: 验证对接
   * author: lkd
   * @param {__code__} 随机生成验证码范围
   * @param {code} 随机生成验证码
   * @param {content} 用户输入的验证码
   * @param {cartNumber} 提货卡卡号
   * @param {cartPassword} 提货卡密码
   * @param {info} 提货说明
   * 
  */

  // const [__code__] = useState('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  const [__code__] = useState('0123456789')
  const [code, setCode] = useState(0)
  const [info, setInfo] = useState([])
  const [content, setContent] = useState('')
  const [cartNumber, setCartNumber] = useState('')
  const [cartPassword, setCartPassword] = useState('')
  const [windowHeight] = useState(window.innerHeight)
  const [divHeight, setDivHeight] = useState(0)

  const canvas = useRef()
  const inputNumber = useRef()

  useEffect(() => {
    if (props.description) {
      let info = props.description.split("\n")
      setInfo(info)
    }
    generateCanvas()
  }, [])

  useEffect(() => {
    EventBus.addListener('obtain', checkCode)
    // window.addEventListener('resize', handelFocus)
    return () => {
      EventBus.removeListener('obtain', checkCode)
      // window.removeEventListener('resize', handelFocus)
      props.refresh()
    }
  })

  // 校验验证码
  const checkCode = useCallback(() => {
    if (!cartNumber) {
      Toast.info('请填写兑换编码', 1)
      return
    }
    if (!cartPassword) {
      Toast.info('请填写兑换密码', 1)
      return
    }
    if (content.toLowerCase() === code.toLowerCase()) {
      EventBus.emit('through', cartNumber, cartPassword)
    } else {
      Toast.info('验证码错误', 1)
    }
  }, [content, code, cartNumber, cartPassword])


  // 切换验证码
  const changeCode = useCallback(() => {
    generateCanvas()
  }, [code])

  // 生成canvas
  const generateCanvas = useCallback(() => {
    let str = ''
    for (let i = 0; i < 4; i++) {
      let ran = parseInt((Math.random() * 11))
      str += __code__.charAt(ran)
    }
    let captcha = new CaptchaMini({
      lineWidth: 2,   //线条宽度
      lineNum: 5,       //线条数量
      dotR: 2,          //点的半径
      dotNum: 20,       //点的数量
      preGroundColor: [0, 149],    //前景色区间 
      backGroundColor: [151, 255], //背景色区间
      fontSize: 100,           //字体大小
      fontFamily: ['Georgia', '微软雅黑', 'Helvetica', 'Arial'],  //字体类型
      fontStyle: 'fill',      //字体绘制方法，有fill和stroke
      content: str,  //验证码内容
      length: 4    //验证码长度
    })
    captcha.draw(canvas.current, res => {
      setCode(res)
    })
  }, [code])

  const handelFocus = useCallback(() => {
    EventBus.emit('changeHeight')
  }, [])

  // function handelFocus() {
  //   EventBus.emit('changeHeight')
  // }



  return (
    <Style>
      <div className='info'>
        <input className='cart-number'
          placeholder='请输入兑换编码'
          value={cartNumber}
          onFocus={handelFocus}
          // onClick={handelFocus}
          onChange={e => { setCartNumber(e.target.value) }}
          ref={inputNumber}
        />
        <input className='cart-password'
          placeholder='请输入兑换密码'
          value={cartPassword}
          onFocus={handelFocus}
          onChange={e => { setCartPassword(e.target.value) }}
        />

        <div className='box'>
          <input
            className='verification-code'
            value={content}
            onFocus={handelFocus}
            onChange={e => { setContent(e.target.value) }}
            maxLength={4}
          />
          <canvas ref={canvas} className='canvas'></canvas>
          <span className='text' onClick={changeCode}>看不清，换一张!</span>
        </div>
      </div>
      {
        info.length > 0 &&
        <div className='info'>
          <ul>
            {
              info.map((item, index) => {
                return (
                  <li key={index} className='li-i'>{index + 1}:&ensp;{item}</li>
                )
              })
            }
          </ul>
        </div>
      }
    </Style>
  );
})

const Style = styled.div`

.info {
  margin-bottom: .16rem;
  padding: .32rem;
  border-radius: .13rem;
  background-color: #fff;
}

.cart-number::-webkit-input-placeholder,
.cart-password::-webkit-input-placeholder {
  color: var(--common-font-color);
}

.li-i {
  font-size: .32rem;
}

.cart-number, 
.cart-password {
  margin-bottom: .27rem;
  padding-left: .32rem;
  width: 100%;
  height: 1.19rem;
  font-size: .32rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: var(--common-font-color);
}

.box {
  display: flex;
  align-items: center;
  height: 1.19rem;

}

.verification-code {
  display: inline-block;
  width: 30%;
  height: 1.19rem;
  text-align: center;
  font-size: .6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}


.canvas {
  margin-left: .2rem;
  width: 25%;
  height: 1rem;
  border: 1px solid #ccc;
}

.text {
  margin-left: .2rem;
  font-size: .32rem;
  text-decoration: underline;
  color: rgb(116, 176, 59);
}





`

export default SubmitExchange;