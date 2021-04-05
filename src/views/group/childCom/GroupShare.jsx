import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { getQueryString } from 'commons/AuthFunction'


import { store } from 'store/index'

import qrcode from 'commons/qrcode/index.js'

class GroupShare extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    let showView
    const { show, data, link, img } = this.props
    // 组团中
    if (show) {
      // 箭头
      if (data.group_style === '1' && data.isjoin !== 0) {
        showView = 1
      } else if (data.group_style === '2' && data.isjoin !== 0) {
        // 海报
        showView = 2
      } else if (data.group_style === '0' && data.isjoin !== 0) {
        // 二维码
        showView = 0
      }
    }
    const { isApplet } = store.getState().appConfig
    return (
      <GroupShareStyle>
        <div className='mark' style={{ display: show ? 'block' : 'none' }} onClick={this.change} >
          {showView === 1 && <img src='https://res.lexiangpingou.cn/images/vip/chacha.png' className='cha' onClick={this.change} />}
          {showView === 1 && <img src='https://res.lexiangpingou.cn/images/vip/sharejiantou.png' alt='' className='jiantou' style={{ right: isApplet ? '15%' : '.4rem' }} />}
          {showView === 2 && img !== '' && <img className='me' onClick={this.goPage} src={img} />}
          {showView === 2 && <img src='https://res.lexiangpingou.cn/images/vip/chacha.png' className='cha' onClick={this.change} />}
          {showView === 0 && <img alt="" ref='image' style={{ width: '250px', height: '409px', position: 'absolute', transform: 'translate(-50%, -50%)', left: '50%', top: '50%', border: 'none', opacity: '0' }} />}
          {showView === 0 && <p ref='p' style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translate(-50%, 0)', fontSize: '.32rem', color: '#fff', opacity: '0' }}>长按图片保存</p>}
        </div>
      </GroupShareStyle>
    )
  }

  goPage = () => {
    const { link } = this.props
    window.location.href = link
  }

  change = () => {
    this.props.changeShow()
    /* this.setState({

    }) */
  }

  // shouldComponentUpdate = (nextProps) => {
  //   // console.log(JSON.stringify(this.state) !== JSON.stringify(nextState))
  //   return JSON.stringify(this.props) !== JSON.stringify(nextProps)
  // }

  QR = () => {
    const { share } = this.props
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    let mid = getQueryString('mid')
    // 兼职人员
    let url, search
    if (mid) {
      // 当前用户是兼职人员
      if (wxUserInfo.enable === '1') {
        url = window.location.href.replace(`&mid=${mid}`, `&mid=${wxUserInfo.id}`)
        this.link = url
      } else if (wxUserInfo.enable === null || wxUserInfo.enable === '0') {
        // 不是兼职人员
        url = window.location.href.replace(`&mid=${mid}`, '')
        this.link = url
      }

    } else {
      // 没有mid
      if (wxUserInfo.enable === '1') {
        search = window.location.search
        url = window.location.href.replace(search, search + `&mid=${wxUserInfo.id}`)
        this.link = url
      } else {
        this.link = window.location.href
      }
    }



    // if (mid) {
    //   // 当前用户是兼职人员
    //   if (wxUserInfo.enable === '1') {
    //     let startUrl = window.location.href.substring(0, window.location.href.indexOf('mid') + 3) + `=${store.getState().appConfig.wxUserInfo.id}`
    //     this.link = startUrl + `#/group/${this.props.match.params.id}`
    //   } else if (wxUserInfo.enable === null || wxUserInfo.enable === '0') {
    //     // 不是兼职人员
    //     let startUrl = window.location.href.substring(0, window.location.href.indexOf('mid'))
    //     this.link = startUrl + `#/group/${this.props.match.params.id}`
    //   }

    // } else {
    //   // 没有mid
    //   let startUrl = window.location.href.substring(0, window.location.href.indexOf('mid'))
    //   this.link = startUrl + `#/group/${this.props.match.params.id}`
    // }

    const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
    let boxW, textSetOffHeight
    let px = 2

    if (ver) {
      textSetOffHeight = 344.5
      if (share.selltype === '1') {
        if (parseInt(share.neednum) < 10) {
          boxW = 31
        } else if (parseInt(share.neednum) < 100) {
          boxW = 37
        } else if (parseInt(share.neednum) < 1000) {
          boxW = 41
        }
      } else if (share.selltype === '7') {
        if (parseInt(share.nownum) < 10) {
          boxW = 48
        } else if (parseInt(share.nownum) < 100) {
          boxW = 53
        } else if (parseInt(share.nownum) < 1000) {
          boxW = 59
        }
      }
    } else {
      textSetOffHeight = 347.75
      if (share.selltype === '1') {
        if (parseInt(share.neednum) < 10) {
          boxW = 31
        } else if (parseInt(share.neednum) < 100) {
          boxW = 36
        } else if (parseInt(share.neednum) < 1000) {
          boxW = 42
        }
      } else if (share.selltype === '7') {
        if (parseInt(share.nownum) < 10) {
          boxW = 49
        } else if (parseInt(share.nownum) < 100) {
          boxW = 54
        } else if (parseInt(share.nownum) < 1000) {
          boxW = 60
        }
      }
    }

    let canvas = document.createElement('canvas')
    if (share.selltype === '1' || share.selltype === '4' || share.selltype === '6') {
      qrcode.poster(canvas, 250 * px, 409 * px, [
        ['roundRect', 0, 0, 250 * px, 409 * px, 5 * px],
        ['clip'],
        ['fillStyle', '#ffffff'],//设置绘制颜色
        ['fillRect', 0, 0, 250 * px, 242 * px], // 绘制一个白色矩形
        ['drawImage', 'image', 0, 55 * px, 250 * px, 250 * px], // 绘制图片image
        ['roundRect', 0, 298 * px, 250 * px, 133 * px, 7 * px], //圈一个圆角矩形路径
        ['fill'], // 绘制填充前面的路径
        ['fillStyle', '#FF762E'],
        ['roundRect', 12 * px, 345 * px, boxW * px, 13 * px, 2 * px], //圈一个圆角矩形路径
        ['fill'], // 绘制填充前面的路径
        ['save'],
        ['beginPath'],
        ['arc', 26 * px, 28 * px, 13 * px, 0, 360],
        ['clip'],
        ['drawImage', 'avatar', 13 * px, 15 * px, 26 * px, 26 * px],
        ['restore'],
        ['font', 'bold 24px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', share.membername, 45 * px, 15 * px, 200 * px, 30, 0], // 绘制名字
        ['font', ' 22px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', '发现好货', 45 * px, 30 * px, 200 * px, 30, 0], // 绘制名字
        ['textAlign', 'left'],
        ['font', '500 18px 黑体 '],
        ['fillStyle', '#ffffff'],
        ['text', share.neednum + '人团', 16 * px, textSetOffHeight * px, 145 * px, 25, 1],
        ['textAlign', 'left'],
        ['font', ' 24px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', share.share_title, 12 * px, 307 * px, 224 * px, 25, 2], // 绘制换行文本
        ['font', 'bold 36px 黑体 '],
        ['fillStyle', '#FF762E'],
        ['text', share.price, 28 * px, ver ? 360.5 * px : 363.5 * px, 145 * px, 30, 3], // 绘制价格
        ['font', 'bold 26px 黑体 '],
        ['text', '¥', 12 * px, 365 * px, 145 * px, 30, 3],
        ['qrcode', this.link, 175 * px, 342 * px, 61 * px, 61 * px],//绘制链接二维码

      ], {
        image: share.share_image,//加载图片image
        // logo: share.platform_logo,//加载图片logo
        avatar: share.avatar
      }).then(() => {
        console.log('成功了')
        this.refs.image.src = canvas.toDataURL()
        this.refs.image.style.opacity = '1'
        this.refs.p.style.opacity = '1'
      }).catch(() => {
        console.log('失败了')
      })
    } else if (share.selltype === '7') {
      qrcode.poster(canvas, 250 * px, 409 * px, [
        ['roundRect', 0, 0, 250 * px, 409 * px, 5 * px],
        ['clip'],
        ['fillStyle', '#ffffff'],//设置绘制颜色
        ['fillRect', 0, 0, 250 * px, 242 * px], // 绘制一个白色矩形
        ['drawImage', 'image', 0, 55 * px, 250 * px, 250 * px], // 绘制图片image
        ['roundRect', 0, 298 * px, 250 * px, 133 * px, 7 * px], //圈一个圆角矩形路径
        ['fill'], // 绘制填充前面的路径
        ['fillStyle', '#FF762E'],
        ['roundRect', 12 * px, 345 * px, boxW * px, 13 * px, 2 * px], //圈一个圆角矩形路径
        ['fill'], // 绘制填充前面的路径
        ['save'],
        ['beginPath'],
        ['arc', 26 * px, 28 * px, 13 * px, 0, 360],
        ['clip'],
        ['drawImage', 'avatar', 13 * px, 15 * px, 26 * px, 26 * px],
        ['restore'],
        ['font', 'bold 24px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', share.membername, 45 * px, 15 * px, 200 * px, 30, 0], // 绘制名字
        ['font', ' 22px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', '发现好货', 45 * px, 30 * px, 200 * px, 30, 0], // 绘制名字
        ['textAlign', 'left'],
        ['font', '500 18px 黑体 '],
        ['fillStyle', '#ffffff'],
        ['text', share.nownum + '人已参团', 16 * px, textSetOffHeight * px, 145 * px, 25, 1],
        ['textAlign', 'left'],
        ['font', ' 24px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', share.share_title, 12 * px, 307 * px, 224 * px, 25, 2], // 绘制换行文本
        ['font', 'bold 36px 黑体 '],
        ['fillStyle', '#FF762E'],
        ['text', share.price, 28 * px, ver ? 360.5 * px : 363.5 * px, 145 * px, 30, 3], // 绘制价格
        ['font', 'bold 26px 黑体 '],
        ['text', '¥', 12 * px, 365 * px, 145 * px, 30, 3],
        ['qrcode', this.link, 175 * px, 342 * px, 61 * px, 61 * px],//绘制链接二维码
      ], {
        image: share.share_image,//加载图片image
        // logo: share.platform_logo,//加载图片logo
        avatar: share.avatar
      }).then(() => {
        this.refs.image.src = canvas.toDataURL()
        this.refs.image.style.opacity = '1'
        this.refs.p.style.opacity = '1'
      })
    }

  }


  componentDidMount = () => {
    const { data } = this.props
    if (data.group_style === '0') {
      this.QR()
    }
  }

  componentDidUpdate = () => {
    const { data } = this.props
    if (data.group_style === '0') {
      this.QR()
    }
  }

}

const GroupShareStyle = styled.div`

.me {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 6rem;
  height: 10rem;
}

.mark {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 990;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.5);
}

.jiantou {
  position: absolute;
  top: .2rem;
  right: .4rem;
}

.cha {
  position: absolute;
  left: 50%;
  bottom: 2rem;
  transform: translate(-50%, 0);
  width: .8rem;
  height: .8rem;
  background: #fff;
  border-radius: 50%;
}

`

export default withRouter(GroupShare)