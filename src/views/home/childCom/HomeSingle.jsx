import React, { Component } from 'react'
import styled from 'styled-components'

// import { _singleApi } from 'network/api'

class HomeSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultIndex: 0,
    }
  }
  render() {
    const { data } = this.props
    const { defaultIndex } = this.state
    return (
      <HomeSingleStyle>
        {data.map((item, index) => {
          return (
            <div className='home-single' key={index} style={{
              backgroundColor: defaultIndex === index ? 'rgba(0, 0, 0, .5)' : 'rgba(0, 0, 0, 0)',
              opacity: defaultIndex === index ? '1' : '0'
            }}>
              <img src={item.avatar} alt='' />
              <span>最新订单来自</span>
              <span>{item.city}的</span>
              <span>{item.nickname}</span>&nbsp;
              <span>{item.sec}秒前</span>
            </div>
          )
        })}
      </HomeSingleStyle>
    )
  }
  componentDidMount = () => {
    const { data } = this.props
    let single = document.querySelectorAll('.home-single')
    this.timer = setInterval(() => {
      if (single) {
        single[this.state.defaultIndex].style.backgroundColor = 'rgba(0, 0, 0, 0)'
        single[this.state.defaultIndex].style.opacity = '0'
        this.timer1 = setTimeout(() => {
          if (this.state.defaultIndex === data.length - 1) {
            this.setState({
              defaultIndex: 0
            })
          } else {
            this.setState({
              defaultIndex: this.state.defaultIndex + 1
            })
          }
        }, 1000)
      }
    }, 3000);
  }


  componentWillUnmount() {
    clearInterval(this.timer)
    clearTimeout(this.timer1)
  }

}

const HomeSingleStyle = styled.div`

.home-single {
  display: flex;
  align-items: center;
  position:absolute;
  padding-right: .2rem;
  z-index: 997;
  top: 1.5rem;
  left: .32rem;
  height: .6rem;
  border-radius: .3rem;
  color: #fff;
  font-size: .3rem;
  transition: all 1s;
}

.home-single img {
  width: .6rem;
  height: .6rem;
  border-radius: 50%;
  margin-right: .2rem;
}

`

export default HomeSingle;