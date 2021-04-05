import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
class HomeLive extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { style, live } = this.props
    return (
      <div className='home-live' style={{ display: style }}>
        <div className='home-live-cover' onClick={() => { this.props.history.push('/live/1003') }}>
          <img src={live.info.liveimg} alt="" style={{ width: '100%' }} />
          <img style={{ position: 'absolute', top: '.45rem', left: '.27rem', width: '2.55rem', height: '.45rem', zIndex: '1' }} src='https://res.lexiangpingou.cn/images/vip/20201127/onlive.png'></img>
          <div style={{
            position: 'absolute', bottom: '0', width: '100%', height: '.81rem', lineHeight: '.81rem',
            backgroundColor: '#000', opacity: '.8', color: '#fff', fontSize: '.32rem', textAlign: 'center'
          }}>
            {live.info.live_title}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(HomeLive);