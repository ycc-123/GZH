import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { store } from 'store/index'

import Swiper from 'swiper'
import "swiper/css/swiper.css"

class LiveAddTeam extends Component {
  render() {
    const { data } = this.props
    return (
      <Style>
        <div className='live-team'>
          <div className="swiper-container live-swiper swiper-no-swiping" ref='liveSwiper'>
            <div className="swiper-wrapper" ref='wrapper'>
              {data.map((item, index) => {
                return (
                  <div key={index} className='swiper-slide' style={{ color: 'black' }}>
                    <div className='live-pt-box' style={{ width: '1.2rem', height: '100%', overflow: 'hidden', display: 'inline-block' }}>
                      {item.avatar.slice(0, 3).map((item, index) => {
                        return (
                          <img key={index} src={item} />
                        )
                      })}
                    </div>
                    <span style={{ position: 'absolute', marginLeft: '1.57rem', height: '.85rem', lineHeight: '.85rem', display: 'inline-block' }}>{item.selltype === '7' ? `已有${item.nownum}人, 火速参团` : `还差${item.lacknum}人成团，火速参团`}</span>
                    <button onClick={() => { this.goGroup(item.tuan_id) }}> 立即参团</button>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </Style>
    )
  }

  goGroup = id => {
    console.log(id)
    const { isApplet } = store.getState().appConfig
    isApplet ? window.navigateToWebWiew(`#/group/${id}`) : this.props.history.push(`/group/${id}`)
  }

  componentDidMount = () => {
    console.log(1232213)
    if (this.swiper) {
      this.swiper.destroy()
      this.swiper = null
    }

    this.swiper = new Swiper(this.refs.liveSwiper, {
      direction: 'vertical',
      autoplay: {
        delay: 5000
      },
      loop: false,
      speed: 1000
    })
  }



}

const Style = styled.div`


position: relative;
margin-top: 1px;
margin-left: .32rem;
padding: 0 .1rem;
width: 9.36rem;
height: .85rem;
background: #fff;
border-radius: .13rem;
box-shadow:.05rem .05rem .1rem .05rem rgba(0, 0, 0, 0.29);

.swiper-container {
  height: .85rem;
}

.swiper-slide {
  height: .85rem;
}

.live-team {
  width: 100%;
  height: 100%;
}

img {
  position: absolute;
  top: 50%;
  left: .3rem;
  transform: translate(0, -50%);
  width: .56rem;
  height: .56rem;
  border-radius: 50%;
}

.live-pt-box img:nth-child(2) {
  z-index: 20;
  left: .63rem;
}

.live-pt-box img:nth-child(3) {
  z-index: 40;
  left: .96rem;
}

button {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  width: 1.71rem;
  height: .56rem;
  line-height: .56rem;
  font-size: .28rem;
  background: #EF8E60;
  border-radius: .28rem;
  color: #fff;
}

`


export default withRouter(LiveAddTeam);

