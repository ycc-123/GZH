import React, { PureComponent, createRef } from 'react'
import { withRouter } from 'react-router-dom'
import EventBus from 'commons/event'



import Swiper from 'swiper'
import "swiper/css/swiper.css"

class HomeNotice extends PureComponent {
  constructor(props) {
    super(props)
    this.swiper = createRef()
    this.wrapper = createRef()
  }
  render() {
    const { data } = this.props
    return (
      <div className='notice'>
        <div className='notice-img'>
          <img src='https://res.lexiangpingou.cn/images/vip/notice.svg' alt='' />
        </div>
        <div className="swiper-container notice-swiper" ref={this.swiper}>
          <div className="swiper-wrapper" ref={this.wrapper}>
            {data.map((item, index) => {
              return (
                <div key={item.id + index} className='swiper-slide' data-id={item.id} onClick={() => { console.log(123) }}>
                  {item.title}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  componentDidMount = () => {
    let loop = false
    let that = this
    if (this.wrapper.current.querySelectorAll('.swiper-slide').length > 1) {
      loop = true
    }
    this.swiper.current.addEventListener('touchmove', this.preventDefault, { passive: false })
    this.mySwiper = new Swiper(this.swiper.current, {
      direction: 'vertical',
      noSwiping: true,
      loop,
      speed: 1000,/* 动画时间 */
      autoplay: {
        delay: 5000
      },
      on: {
        click(e) {
          that.props.history.push(`/notice/${e.target.getAttribute('data-id')}`)
        },
        touchMove() {
          EventBus.emit('noTouchMove')
        },
        touchEnd() {
          EventBus.emit('onTouchMove')
        }
      }
    })
  }

  preventDefault(e) {
    e.preventDefault()
  }

  // componentDidUpdate = () => {
  //   if (this.swiper) {
  //     this.swiper.destroy()
  //     this.swiper = null
  //   }
  //   let that = this
  //   let loop = false
  //   if (this.refs.wrapper.querySelectorAll('.swiper-slide').length > 1) {
  //     loop = true
  //   }
  //   this.swiper = new Swiper('.notice-swiper', {
  //     direction: 'vertical',
  //     autoplay: {
  //       delay: 5000
  //     },
  //     on: {
  //       click(e) {
  //         console.log(that)
  //         that.props.history.push(`/notice/${e.target.getAttribute('data-id')}`)
  //       }
  //     },
  //     loop,
  //     speed: 1000/* 动画时间 */
  //   })
  // }

}


export default withRouter(HomeNotice);

