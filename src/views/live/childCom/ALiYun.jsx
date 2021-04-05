import React, { Component, Fragment, createRef } from 'react'
// import Player from 'aliplayer-react'
import { withRouter } from 'react-router-dom'

class ALiYun extends Component {
  constructor(props) {
    super(props);
    this.liveClose = ""
    this.img = createRef()
  }

  render() {
    return (
      <Fragment>
        <div className="zhibobo" id='alplayer' >
          <img ref={this.img} onClick={() => this.initPlay()} src={require('assets/img/play.png')} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '9999', width: '1.5rem', height: '1.5rem' }} />
          {/* <div style={{ width: '100vw', height: '100vh', backgroundColor: 'red'}}></div> */}
        </div>
      </Fragment>
    );
  }


  initPlay() {
    this.img.current.style.display = 'none'
    const { playerUrl } = this.props
    const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
    let ht = document.querySelector('html').style.fontSize.replace('px', '')
    try {
      this.player = new window.Aliplayer({
        id: 'alplayer',
        source: playerUrl,
        width: document.documentElement.clientWidth + 'px',
        height: document.documentElement.clientHeight + 'px',
        videoWidth: '100%',
        videoHeight: '100%',
        autoplay: true,
        isLive: true,
        rePlay: false,
        // ios为true 安卓为false
        playsinline: ver ? true : false,
        preload: true,
        // controlBarVisibility: "always",
        useH5Prism: true,
        x5_type: 'h5',
        x5_fullscreen: ver ? true : false,
        showBuffer: true,
        controlBarVisibility: 'hover',
      }, player => {
        // player.on('playing', this.handlePlaying)
        // player.on('onM3u8Retry', this.hPlaying)
        // player.on('ended', this.end)
        if (ver) {
          const wx = window.wx
          wx.ready(() => {
            player.play()
          })
        }
      })
    } catch {
      window.location.reload()
    }
  }

  // handlePlaying = () => {
  //   console.log(this.player.getStatus())
  // }

  // end = () => {
  //   console.log('直播结束')
  // }

  // onPlayerStatus = (instance) => {
  //   instance.on('onM3u8Retry', () => {
  //     // 播放器直播事件结束且直播状态时 on 等待三秒

  //     this.liveClose = setTimeout(() => {
  //       if (this.props.liveStatus === "on") {
  //         this.props.history.push('/liveover')
  //       }
  //     }, 3000)
  //   })
  // }

  componentWillUnmount() {
    clearTimeout(this.liveClose)
    if (this.player) {
      this.player.dispose()
    }
  }
}

export default withRouter(ALiYun);