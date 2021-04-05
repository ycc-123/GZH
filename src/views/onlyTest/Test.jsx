// import React, { Component, Fragment } from 'react'
// import Player from 'aliplayer-react'
// import { withRouter } from 'react-router-dom'


// const wx = window.wx



// class ALiYun extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       instance: null
//     }
//     this.liveClose = ""
//   }

//   render() {
//     const { playerUrl } = this.props
//     let ht = document.querySelector('html').style.fontSize.replace('px', '')
//     console.log(ht * 1.28 + 'px')
//     // let reg = new RegExp('^((http:)|(https:))')
//     // let onlineSource = playerUrl.replace(reg, '')
//     // 存在说明是IOS系统
//     const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
//     const config = {
//       id: 'alplayer',
//       source: 'rtmp://live.hkstv.hk.lxdns.com/live/hks', // 直播时直播回放时点播
//       width: document.documentElement.clientWidth + 'px',
//       height: document.documentElement.clientHeight + 'px',
//       videoWidth: '100%',
//       videoHeight: '100%',
//       autoplay: true,
//       isLive: true,
//       rePlay: false,
//       // 安卓为false ios为true
//       playsinline: ver ? true : false,
//       preload: true,
//       controlBarVisibility: "always",
//       useH5Prism: true,
//       x5_type: 'h5',
//       x5_fullscreen: ver ? true : false,
//       showBuffer: true,
//       controlBarVisibility: 'hover',
//       skinLayout: [
//         {
//           "name": "bigPlayButton",
//           "align": "blabs",
//           "x": 30,
//           "y": 80
//         },
//         {
//           "name": "prism-progress",
//           "width": "100%"

//         },
//         {
//           "name": "H5Loading",
//           "align": "cc"
//         },
//         {
//           'name': 'prism-speed-selector',
//           'x': 0,
//           'y': 0
//         },
//         {
//           "name": "errorDisplay",
//           "align": "tlabs",
//           "x": 0,
//           "y": 0
//         },
//         {
//           "name": "infoDisplay"
//         },
//         {
//           "name": "tooltip",
//           "align": "blabs",
//           "x": 0,
//           "y": 56
//         },
//         {
//           "name": "thumbnail"
//         },
//         {
//           "name": "controlBar",
//           "align": "blabs",
//           "x": -100,
//           "y": -100,
//           "children": [
//             /*{
//                 "name": "progress",
//                 "align": "blabs",
//                 "x": 0,
//                 "y": 44
//             },
//             {
//                 "name": "playButton",
//                 "align": "tl",
//                 "x": 15,
//                 "y": 12
//             },
//             {
//                 "name": "timeDisplay",
//                 "align": "tl",
//                 "x": 10,
//                 "y": 7
//             }*/
//           ]
//         }
//       ],
//       components: [
//         {
//           name: "RateComponent",
//           type: Player.components.RateComponent,
//         }
//       ]
//     }
//     return (
//       <Fragment>
//         <div className="zhibobo">
//           <Player config={config} onGetInstance={instance => this.setState({ instance })} />
//         </div>
//       </Fragment>
//     );
//   }



//   componentDidMount = () => {

//     window.addEventListener('resize', this.resizeVideo)

//     // document.querySelector('.prism-controlbar').style.display = 'none'

//   }
//   componentDidUpdate = () => {
//     const { instance } = this.state
//     console.log('实例对象', instance)
//     if (instance) {
//       this.onPlayerStatus(instance)
//     }
//   }

//   onPlayerStatus = (instance) => {
//     instance.on('onM3u8Retry', () => {
//       // 播放器直播事件结束且直播状态时 on 等待三秒

//       this.liveClose = setTimeout(() => {
//         if (this.props.liveStatus === "on") {
//           this.props.history.push('/liveover')
//         }
//       }, 3000)
//     })
//   }


//   resizeVideo = () => {
//     const { instance } = this.state
//     if (instance) {
//       instance._el.style.height = document.body.clientHeight + 'px'
//       instance._el.style.width = document.body.clientWidth + 'px'
//     }
//   }

//   componentWillUnmount() {
//     clearTimeout(this.liveClose)

//     window.removeEventListener('resize', this.resizeVideo)

//     const { instance } = this.state
//     if (instance) {
//       instance.dispose()
//     }
//   }
// }

// export default withRouter(ALiYun);