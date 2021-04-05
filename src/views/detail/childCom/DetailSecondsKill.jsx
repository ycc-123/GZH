import React, { PureComponent } from 'react';
import styled from 'styled-components'

import EventBus from 'commons/event'
import { timestampToTime } from 'commons/timeStamp'

class DetailSecondsKill extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      countdown: parseInt(this.props.goods.spike_end) - (Date.parse(new Date()) / 1000),
      // countdown: 2,
      end_time: timestampToTime(this.props.goods.spike_end),
      start_time: timestampToTime(this.props.goods.spike_start),
      distanceCountdown: parseInt(this.props.goods.spike_start) - (Date.parse(new Date()) / 1000),
      // distanceCountdown: 2
    }
  }
  render() {
    const { goods } = this.props
    const { countdown, end_time, start_time, distanceCountdown } = this.state
    let h, m, s, hh, mm, ss
    h = parseInt(distanceCountdown > 0 ? distanceCountdown / 3600 : countdown / 3600)
    m = parseInt(distanceCountdown > 0 ? distanceCountdown / 60 % 60 : countdown / 60 % 60)
    s = parseInt(distanceCountdown > 0 ? distanceCountdown % 60 : countdown % 60)
    hh = h.toFixed().length === 1 ? `0${h}` : h
    mm = m.toFixed().length === 1 ? `0${m}` : m
    ss = s.toFixed().length === 1 ? `0${s}` : s
    return (
      <SecondsKillStyle>
        {
          (goods.spikeT === '1' || goods.spike === '1') && (goods.selltype === '0' || goods.selltype === '1') && goods.is_experience !== '2' && < div className='detail-time'>
            <img src={require('assets/img/detailtime.png')} />
            <div style={{ width: '5.83rem', height: '100%', position: 'relative', zIndex: 10 }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translate(0, -50%)', width: '5.83rem', }}>
                <p style={{ textAlign: 'center', color: '#fff', fontSize: '.32rem' }}>开始时间:<span style={{ marginLeft: '.2rem' }}>{start_time}</span></p>
                <p style={{ textAlign: 'center', color: '#fff', fontSize: '.32rem', marginTop: '.1rem' }}>结束时间:<span style={{ marginLeft: '.2rem' }}>{end_time}</span></p>
              </div>
            </div>
            <div style={{ position: 'absolute', right: '0', top: '0', width: '3.53rem', height: '100%' }}>
              <p style={{ fontSize: '.4rem', color: '#fd533a', textAlign: 'center', marginTop: '.16rem' }}>{distanceCountdown > 0 ? '倒计时' : '剩余时间'}</p>
              <p className='detail-end-time'>
                <span>{hh}</span>:
                <span>{mm}</span>:
                <span>{ss}</span>
              </p>
              {/*  */}
            </div>
          </div>
        }
      </SecondsKillStyle>
    )
  }

  countdownTime() {
    const { goods } = this.props
    this.timer = setInterval(() => {
      this.setState({
        distanceCountdown: this.state.distanceCountdown > 0 ? this.state.distanceCountdown - 1 : 0
      }, () => {
        if (this.state.distanceCountdown === 0) {
          if (goods.selltype === '0') {
            EventBus.emit('countdown', '0', 2)
            clearInterval(this.timer)
            this.startTime()
          } else {
            EventBus.emit('countdown', '1', 2)
            clearInterval(this.timer)
            this.startTime()
          }
        }
      })
    }, 1000)
  }

  startTime() {
    const { goods } = this.props
    this.start = setInterval(() => {
      this.setState({
        countdown: this.state.countdown > 0 ? this.state.countdown - 1 : 0
      }, () => {
        if (this.state.countdown === 0) {
          if (goods.selltype === '0') {
            EventBus.emit('countdown', '0', 3)
            clearInterval(this.start)
          } else {
            EventBus.emit('countdown', '1', 3)
            clearInterval(this.start)
          }
        }
      })
    }, 1000)
  }

  componentDidMount() {
    if (this.state.distanceCountdown > 0) {
      this.countdownTime()
    } else if (this.state.countdown > 0) {
      this.startTime()
    } else {
      this.setState({ countdown: 0 })
    }

  }

  componentWillUnmount() {
    clearInterval(this.timer)
    clearInterval(this.start)
  }

}

const SecondsKillStyle = styled.div`

.detail-time {
  position: relative;
  /* padding: 0 .32rem; */
  width: 100%;
  height: 1.53rem;
  background-size: 9.36rem 1.53rem;
  background-color: #fff;
  border-radius: .13rem;
}

.detail-time img {
  position: absolute;
  top: 0;
  left: 0;
  width: 9.36rem;
  height: 1.53rem;
}

.detail-end-time {
  position: absolute;
  bottom: .12rem;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
  text-align: center;
}

.detail-end-time span {
  display: inline-block;
  min-width: .5rem;
  min-height: .5rem;
  padding: .05rem;
  margin: 0 0.1rem;
  font-size: .26rem;
  background-color: #fd533a;
  color: white;
  text-align: center;
}
`

export default DetailSecondsKill;