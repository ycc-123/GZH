import React, { useState, useEffect, useRef, memo } from 'react'
import styled from 'styled-components'

import Swiper from 'swiper'
import "swiper/css/swiper.css"

const DetailOrdernoSwiper = memo((props) => {

  const [swiper, setSwiper] = useState(null)

  const ordernoSwiper = useRef()
  const wrapper = useRef()

  useEffect(() => {
    if (swiper) {
      swiper.destroy()
      setSwiper(null)
    }
    let num, loop, length = props.orderno.length

    if (length > 3) {
      num = 4
      loop = true
    } else if (length === 3) {
      num = 3
      loop = false
    } else if (length === 2) {
      num = 2
      loop = false
    } else if (length === 1) {
      num = 1
      loop = false
    } else {
      num = 0
      loop = false
    }
    setSwiper(new Swiper(ordernoSwiper.current, {
      loop,
      direction: 'vertical',
      slidesPerView: num,
      freeMode: true,
      autoplay: length > 3 ? {
        delay: 0,
        stopOnLastSlide: false,
        disableOnInteraction: true
      } : false,     // 自动播放   时间为4秒
      speed: 800
    }))
  }, [props.orderno])

  return (
    <Style>
      <div style={{ marginBottom: '.32rem' }}>成交记录&ensp;(只显示最新的发货信息)</div>
      <div className='detail-orderno-swiper'>
        <div className="swiper-container swiper-no-swiping" ref={ordernoSwiper}>
          <div className="swiper-wrapper" ref={wrapper}>
            {props.orderno.map((item, index) => {
              return (
                <div key={index} className='swiper-slide detail-orderno-item'>
                  <p className='orderno-content'>
                    <span>恭喜订单编号：{item.orderno}</span>
                    <span>{item.status === '2' ? '待收货' : '已签收'}</span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Style>
  )
})

const Style = styled.div`
margin-bottom: .32rem;
padding: .4rem;
border-bottom: 1px solid #ccc;
border-top: 1px solid #ccc;
color: var(--common-font-color);
background-color: #fff;
border-radius: .13rem;

.swiper-container {
  height: auto;
  max-height: 2.1rem;
}

.detail-orderno-item {
  display: flex;
  flex-direction: column;
}

.orderno-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: .32rem;
}

`

export default DetailOrdernoSwiper