import React, { Component } from 'react'

import Swiper from 'swiper'
import "swiper/css/swiper.css"


class SwiperComponent extends Component {
  render() {
    const { config, dataList } = this.props
    return (
      <div className='Swiper' style={config} ref='ss'>
        <div className="swiper-container banner-swiper" ref='swiper'>
          <div className="swiper-wrapper" ref='wrapper'>
            {dataList.map((item, index) => {
              return (
                <div key={item.id + index} className='swiper-slide'>
                  <img className='banner-img' src={item.thumb} alt="" data-link={item.link} />
                </div>
              )
            })}
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    );
  }
 
  componentDidMount = () => {
    if (this.props.number === 1) {
      this.refs.ss.style.marginTop = '.16rem'
    }
    // const that = this
    let loop = false
    if (this.refs.wrapper.querySelectorAll('.swiper-slide').length > 1) {
      loop = true
    }
    if (this.swiper) {
      this.swiper.destroy(false)
      this.swiper = null
    }
    this.swiper = new Swiper(this.refs.swiper, {
      loop,     // 是否循环
      // freeMode: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },     // 自动播放   时间为4秒
      speed: 1000,        // 速度   越小越快
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      observer: true,//修改swiper自己或子元素时，自动初始化swiper
      observeParents: true,//修改swiper的父元素时，自动初始化swiper
      observeSlideChildren: true,
      on: {
        slideChangeTransitionEnd() {
          this.update()
        },
        click(e) {
          // console.log(e.target.getAttribute('data-link'))
          window.location.href = e.target.getAttribute('data-link')
        }
      }
    })
    let wrapper = this.refs.wrapper
    let promise = Array.prototype.map.call(wrapper.querySelectorAll('img'), function (img) {
      return new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
    })
    Promise.all(promise).then(() => {
      if (this.props.refresh) {
        this.props.refresh()
      }
    })

    console.log(this.swiper)

  }
}


export default SwiperComponent;