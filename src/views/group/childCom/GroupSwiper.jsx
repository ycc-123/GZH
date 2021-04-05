import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import Swiper from 'swiper'
import "swiper/css/swiper.css"

const GroupSwiper = (props) => {

  const groupSwiper = useRef()
  const [swiper, setSwiper] = useState(null)
  const [record, setRecord] = useState(() => props.record)

  useEffect(() => {
    if (swiper) {
      swiper.destroy()
      setSwiper(null)
    }
    let num, loop, length = record.length
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
    setSwiper(new Swiper(groupSwiper.current, {
      loop,
      direction: 'vertical',
      slidesPerView: num,
      freeMode: true,
      autoplay: length > 3 ? {
        delay: 0,
        stopOnLastSlide: false,
        disableOnInteraction: true
      } : false,
      speed: 800
    }))
  }, [record])


  return (
    <GroupSwiperStyle>
      <div className='group-swiper'>
        <div className="swiper-container swiper-no-swiping" ref={groupSwiper}>
          <div className="swiper-wrapper">
            {record.map((item, index) => {
              return (
                <div key={index} className='swiper-slide group-record-item' key={index} style={{ height: '.325rem' }}>
                  <p className='group-content' key={index}>{item.content}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </GroupSwiperStyle>
  )
}

const GroupSwiperStyle = styled.div`

.swiper-container {
  height: auto;
  max-height: 2.1rem;
}

.group-record-item {
  display: flex;
  flex-direction: column;
}

.group-content {
  display: flex;
  align-items: center;
  font-size: .32rem;
}


`


export default GroupSwiper