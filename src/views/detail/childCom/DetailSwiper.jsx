import React, { Component, Fragment, createRef } from 'react'
import { Toast } from 'antd-mobile'

import { _api } from 'network/api'

import { store } from 'store/index'

import Swiper from 'swiper'
import "swiper/css/swiper.css"

class DetailSwiper extends Component {

  constructor(props) {
    super(props)
    this.state = {
      play: false
    }
    this.playVideo = createRef()
    this.playImgVideo = createRef()
    this.btnImgVideo = createRef()
  }

  render() {
    let swiperSlide
    const { dataList, index_video } = this.props
    const { play } = this.state
    if (dataList instanceof Array) {
      swiperSlide = (
        <Fragment>
          {dataList.map((item, index) => {
            return (
              <div key={item.id + index} className='swiper-slide'>
                {
                  index === 0 && index_video && <img
                    src={require('assets/img/play.png')}
                    className='detail-play'
                    ref={this.btnImgVideo}
                    onClick={() => this.play()}>
                  </img>
                }

                {
                  index === 0 && play && index_video && <video
                    src={index_video}
                    controlsList="nodownload nofullscreen"
                    webkit-playsinline="true"
                    x5-video-player-type="h5"
                    x5-video-orientation="portraint"
                    // preload 
                    // controls 
                    // x5-playsinline=''
                    playsinline=''
                    poster={item.thumb}
                    ref={this.playVideo}
                  // style={{ width: '9.46rem', height: 'auto' }}
                  >
                  </video>
                }
                {!index_video && <img src={item.thumb} alt="" ref='img' />}
                {index_video && index !== 0 && <img src={item.thumb} alt="" ref='img' />}
                {index_video && index === 0 && <img src={item.thumb} alt="" ref={this.playImgVideo} />}
              </div>
            )
          })}
        </Fragment>
      )
    } else {
      swiperSlide = (
        <div className='swiper-slide'>
          {
            index_video && <img
              src={require('assets/img/play.png')}
              className='detail-play'
              ref={this.btnImgVideo}
              onClick={() => this.play()}>
            </img>
          }
          {
            index_video && play && <video
              src={index_video}
              controlsList="nodownload nofullscreen"
              webkit-playsinline="true"
              x5-video-player-type="h5"
              x5-video-orientation="portraint"
              // preload 
              // controls 
              // x5-playsinline='' 
              playsinline=''
              poster={dataList}
              ref={this.playVideo}
            // style={{ width: '9.46rem', height: 'auto' }}
            >
            </video>
          }
          {index_video && <img src={dataList} alt="" ref={this.playImgVideo} />}
          {!index_video && <img src={dataList} alt='' ref='img' />}
        </div>
      )
    }
    return (
      <Fragment>
        <div className='detail-swiper'>
          <div className="swiper-container" ref='swiper'>
            <div className="swiper-wrapper" ref='wrapper'>
              {swiperSlide}
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </Fragment>

    );
  }


  play() {
    const { appConfig } = store.getState()
    const api_config = {
      action: 'play_num',
      data: {
        uniacid: appConfig.uniacid
      }
    }
    _api(api_config).then(res => {
      if (res?.data?.status === 200) {
        this.playImgVideo.current.style.display = 'none'
        this.setState({
          play: true
        }, () => {
          this.swiper.autoplay.stop()
          const video = this.playVideo.current
          const img = this.btnImgVideo.current
          video.controls = true
          video.play()
          video.poster = ''
          img.style.opacity = 0
          video.addEventListener('ended', this.start)
        })
      } else if (res?.data?.status === 400) {
        Toast.info(res.data.msg, 2)
      } else {
        Toast.info('未知错误')
      }
    })

  }

  componentDidMount() {
    const { index_video } = this.props
    let loop = false
    if (!index_video) {
      if (this.refs.wrapper.querySelectorAll('.swiper-slide').length > 1) {
        loop = true
      }
    }
    if (this.swiper) {
      this.swiper.destroy(false)
      this.swiper = null
    }
    this.swiper = new Swiper(this.refs.swiper, {
      loop,
      speed: 1000,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      observer: true,
      observeParents: true,
      on: {
        slideChangeTransitionEnd() {
          this.update()
        },
      }
    })
  }


  start = () => {
    this.swiper.autoplay.start()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    const video = this.playVideo.current
    if (video) {
      video.removeEventListener('ended', this.start)
    }
  }

}

export default DetailSwiper;