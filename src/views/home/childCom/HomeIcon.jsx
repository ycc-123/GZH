import React, { Component, Fragment } from 'react'

import Swiper from 'swiper'
import "swiper/css/swiper.css"

class HomeIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: []
    }
  }
  render() {
    const { data } = this.props
    const { pages } = this.state
    // 计算页数
    data.forEach((item, index) => {
      const page = Math.floor(index / 8)
      // 如果不存在将pages[page]赋值为空数组 
      if (!pages[page]) {
        pages[page] = []
      }
      pages[page].push(item)
    })
    return (
      <Fragment>
        {pages.length !== 0 && <div className='icons'>
          <div className="swiper-container" ref='icon'>
            <div className="swiper-wrapper">
              {pages.map((item, index) => {
                return (
                  <div key={index} className='swiper-slide'>
                    {item.map((item, index) => {
                      return (
                        <div key={item.id + index} className='home-icon'>
                          <div className='icon-img'>
                            <img src={item.thumb} alt="" onClick={(e) => { this.props.changeCategory(item.id) }} />
                          </div>
                          <p className='icon-desc'>
                            {item.name}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            <div className="swiper-scrollbar"></div>
          </div>
        </div>}
      </Fragment>
    )
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)
  }

  componentDidMount = () => {
    this.swiper = new Swiper(this.refs.icon, {
      scrollbar: {
        el: '.swiper-scrollbar',
        scrollbarHide: false
      }
    })
  }

  componentDidUpdate = () => {
    if (this.swiper) {
      this.swiper.destroy()
      this.swiper = null
    }
    this.swiper = new Swiper(this.refs.icon, {
      scrollbar: {
        el: '.swiper-scrollbar',
        scrollbarHide: false
      }
    })
  }

  changeCategory = (id) => {
    this.props.changeCategory(id)
  }
}

export default HomeIcon