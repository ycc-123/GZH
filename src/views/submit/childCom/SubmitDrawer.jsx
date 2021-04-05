import React, { Component } from 'react'
import styled from 'styled-components'

import BetterScroll from 'common/betterScroll/BetterScroll'


class SubmitDrawer extends Component {
  render() {
    const { hide, delivery_time, leftIndex, rightIndex, } = this.props
    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: '6.77rem'
    }
    return (
      <SubmitDrawerStyle>
        <div className='mask' style={{ display: hide ? 'block' : 'none' }}
          onClick={(e) => { this.props.hideDarwer(e) }}>
        </div>
        <div className='drawer' style={{ bottom: hide ? '0' : '-11.43rem' }}>
          <div className='head'>
            送达时间
              <img src='https://res.lexiangpingou.cn/images/vip/chacha.png' alt=""
              onClick={(e) => { this.props.hideDarwer(e) }} />
          </div>
          <div className='left' style={{ background: '#F9FBFF' }}>
            <ul >
              {delivery_time.map((item, index) => {
                return (
                  <li key={item.id + index}
                    style={{
                      color: leftIndex === index ? 'var(--theme-font-color)' : ' ',
                      borderLeft: leftIndex === index ? '.13rem solid #ff833a' : '',
                      background: leftIndex === index ? '#fff' : '#F9FBFF',

                    }}
                    className='left-li'
                    onClick={() => { this.changeLeft(index) }}>
                    {item.name}</li>
                )
              })}
            </ul>
          </div>
          <div className='right'>
            {delivery_time.map((item, index) => {
              return (
                <ul className='right-ul' key={item.id + index} style={{ display: leftIndex === index ? 'block' : 'none', height: '6.77rem' }}>
                  <BetterScroll config={scollConfig}
                    style={scrollStyle}
                    ref={`scroll${index}`}>
                    {Array.isArray(item.time) && item.time.map((item1, index1) => {
                      return (
                        <li key={index1 + 1}
                          style={{ opacity: item1.isshow === 0 ? '.3' : '1' }}
                          className='right-li'
                          onClick={() => { this.changeRight(index, index1) }}>
                          {item1.name.replace("-", " ~ ")}
                          <span className='weight'>承载量</span>
                          <span className='li-num' style={{ color: item1.isshow === 0 ? 'var(--common-font-color)' : 'var(--theme-font-color)' }}>{item1.num}</span>
                          <span className='li-total'>/{item1.content}</span>
                          {rightIndex[leftIndex] === index1 && <img src='https://res.lexiangpingou.cn/images/vip/select1.png' className='select1' alt='' />}
                        </li>
                      )
                    })}
                  </BetterScroll>

                </ul>
              )
            })}
          </div>
          <div className='s-ok'>
            <button
              onClick={(e) => { this.props.hideDarwer(e) }}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8.88rem', height: '.95rem', color: '#fff', background: 'var(--theme-font-color)', borderRadius: '.47rem' }}>确定</button>
          </div>
        </div>
      </SubmitDrawerStyle>
    );
  }
  changeLeft = (index) => {
    this.props.changeLeft(index)
    this.timer = setTimeout(() => {
      this.refs.scroll0.BScroll.refresh()
      this.refs.scroll1.BScroll.refresh()
      this.refs.scroll2.BScroll.refresh()
    }, 100)
  }

  changeRight = (index, value) => {
    this.props.changeRight(index, value)
    // if (index === 0) {
    //   this.refs.scroll0.BScroll.refresh()
    //   console.log(this.refs.scroll0.BScroll)
    // } else if (index === 1) {
    //   this.refs.scroll1.BScroll.refresh()
    //   console.log(this.refs.scroll1.BScroll)
    // } else {
    //   this.refs.scroll2.BScroll.refresh()
    //   console.log(this.refs.scroll2.BScroll)
    // }
  }


  changeOption = () => {
    const { leftIndex, rightIndex } = this.props
    // let li = document.querySelectorAll('.right-ul')[leftIndex].querySelectorAll('li')[rightIndex[leftIndex]]
    let li = document.querySelectorAll('.right-ul')[leftIndex].querySelectorAll('li')
    li.forEach(item => {
      item.style.color = 'var(--common-font-color)'
    })
    if (rightIndex[leftIndex] >= 0) {
      li[rightIndex[leftIndex]].style.color = 'var(--theme-font-color)'
    }

  }

  componentDidMount = () => {
    this.changeOption()

  }

  componentDidUpdate = () => {
    this.changeOption()
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer)
  }




  /* shouldComponentUpdate = (nextProps) => {
  return JSON.stringify(this.state) !== JSON.stringify(nextState) || JSON.stringify(this.props) !== JSON.stringify(nextProps)
  } */
}

const SubmitDrawerStyle = styled.div`

.s-ok {
  position: relative;
  height: 2.21rem;
  width: 100%;
}

.select1 {
  position: absolute;
  right: .32rem;
  top: 50%;
  transform: translate(0, -50%);
  width: .53rem;
  height: .53rem;
}

.mask {
position: fixed;
top: 0;
left: 0;
width: 100vw;;
height: 100vh;
display: block;
background: rgba(0,0,0,.5);
transition: display .3s;
}


.drawer {
position: fixed;
left: 0;
z-index: 9999 !important;
bottom: -11.43rem;
width: 100vw;
height: 10.13rem;
transition: bottom .3s;
background: #fff;
border-top-left-radius: .13rem;
border-top-right-radius: .13rem;
}

.head {
position: relative;
display: flex;
padding: 0 .4rem;
height: 1.1rem;
align-items: center;
border-bottom: .013rem solid #ccc;
}

.head img {
position: absolute;
right: .4rem;
width: .53rem;
height: .53rem;
}

.left {
display: inline-block;
height: 6.77rem;
}

.left-li {
position: relative;
width: 2.83rem;
height: 1.17rem;
line-height: 1.17rem;
text-align: center;
font-size: .32rem;
}

.bobobo {
border-left: .13rem solid var(--theme-font-color);
}

.right {
float: right;
width: 70%;

}

.right-li {
position: relative;
display: flex;
align-items: baseline;
width: 100%;
height: 1.17rem;
padding-left: .5rem;
line-height: 1.17rem;
text-align: left;
font-size: .32rem;
color: var(--common-font-color)
}

.weight {
margin-left: .4rem;
color: #474747;
}


.li-num {
font-size: .4rem;
color: var(--theme-font-color);
}

.li-total {
color: var(--common-font-color);
}


`

export default SubmitDrawer;