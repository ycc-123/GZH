import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { setTitle } from 'commons/utils'
import { getQueryString } from 'commons/AuthFunction'

import DetailShareButton from './DetailShareButton'


import { store } from 'store/index'

import { _api } from 'network/api'
import qrcode from 'commons/qrcode/index.js'

class HomeShare extends PureComponent {
  render() {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', height: 'calc(100vh - 0px)' }}>
        <DetailShareButton />
        <img alt="" ref='image' style={{ width: '250px', height: '409px', position: 'absolute', transform: 'translate(-50%, -50%)', left: '50%', top: '50%', border: 'none', opacity: '0' }} />
        <p ref='p' style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translate(-50%, 0)', fontSize: '.32rem', color: '#fff', opacity: '0' }}>长按图片保存</p>
      </div>
    )
  }

  QR = async () => {
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    const lianjie_config = {
      action: 'goodsDetailShare',
      data: {
        uniacid: appConfig.uniacid,
        gid: this.props.match.params.id,
        openid: wxUserInfo.openid
      }
    }
    /* const base64Img_config = {
      action: 'imgtobase64',
      data: {
        uniacid: appConfig.uniacid
      }
    } */
    const result = await _api(lianjie_config)
    // const result1 = await _api(base64Img_config)
    let px = 2
    let { avatar, gimg, platform_logo, membername, share_title, share_image, goodsprice, selltype, mprice, groupnum } = result.data.data
    let mid = getQueryString('mid')
    let origin, pathname, search, hash
    if (mid) {
      // 当前用户是兼职人员
      if (wxUserInfo.enable === '1') {
        origin = window.location.origin
        pathname = window.location.pathname
        search = window.location.search.replace(`&mid=${mid}`, `&mid=${wxUserInfo.id}`)
        hash = `#/detail/${this.props.match.params.id}/1`
        this.link = origin + pathname + search + hash
      } else if (wxUserInfo.enable === null || wxUserInfo.enable === '0') {
        // 不是兼职人员
        origin = window.location.origin
        pathname = window.location.pathname
        search = window.location.search.replace(`&mid=${mid}`, '')
        hash = `#/detail/${this.props.match.params.id}/1`
        this.link = origin + pathname + search + hash
      }

    } else {
      // 没有mid
      if (wxUserInfo.enable === '1') {
        origin = window.location.origin
        pathname = window.location.pathname
        let oldSearch = window.location.search
        search = window.location.search.replace(oldSearch, oldSearch + `&mid=${wxUserInfo.id}`)
        hash = `#/detail/${this.props.match.params.id}/1`
        this.link = origin + pathname + search + hash
      } else {
        origin = window.location.origin
        pathname = window.location.pathname
        search = window.location.search
        hash = `#/detail/${this.props.match.params.id}/1`
        this.link = origin + pathname + search + hash
      }
    }

    const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)

    let boxW, textSetOffHeight

    if (ver) {
      if (selltype !== '0') {
        textSetOffHeight = 344.5
        if (Number(groupnum) < 10) {
          boxW = 31
        } else if (Number(groupnum) < 100) {
          boxW = 37
        } else if (Number(groupnum) < 1000) {
          boxW = 41
        }
      }
    } else {
      if (selltype !== '0') {
        textSetOffHeight = 347.75
        if (Number(groupnum) < 10) {
          boxW = 31
        } else if (Number(groupnum) < 100) {
          boxW = 36
        } else if (Number(groupnum) < 1000) {
          boxW = 42
        }
      }
    }





    let canvas = document.createElement('canvas')
    if (selltype === '0') {
      qrcode.poster(canvas, 250 * px, 409 * px, [
        ['roundRect', 0, 0, 250 * px, 409 * px, 5 * px],
        ['clip'],
        ['fillStyle', '#ffffff'],//设置绘制颜色
        ['fillRect', 0, 0, 250 * px, 242 * px], // 绘制一个白色矩形
        ['drawImage', 'image', 0, 55 * px, 250 * px, 250 * px], // 绘制图片image
        ['roundRect', 0, 298 * px, 250 * px, 133 * px, 7 * px], //圈一个圆角矩形路径
        // ['fillStyle', 'rgba(71, 71, 71, 0.5)'],
        // ['fillStyle', 'rgb(255,255,255)'],// 设置绘制颜色
        ['fill'], // 绘制填充前面的路径
        ['save'],
        ['beginPath'],
        ['arc', 26 * px, 28 * px, 13 * px, 0, 360],
        ['clip'],
        ['drawImage', 'avatar', 13 * px, 15 * px, 26 * px, 26 * px],
        ['restore'],
        ['font', 'bold 24px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', membername, 45 * px, 15 * px, 200 * px, 30, 0], // 绘制名字
        ['font', ' 22px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', '发现好货', 45 * px, 30 * px, 200 * px, 30, 0], // 绘制名字
        ['textAlign', 'left'],
        ['font', '500 18px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', '市场价:   ' + '¥ ' + mprice, 12 * px, 345 * px, 145 * px, 25, 1],
        ['textAlign', 'left'],
        ['font', ' 24px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', share_title, 12 * px, 307 * px, 224 * px, 25, 2], // 绘制换行文本
        ['font', 'bold 36px 黑体 '],
        ['fillStyle', '#FF762E'],
        ['text', goodsprice, 28 * px, ver ? 360.5 * px : 363.5 * px, 145 * px, 30, 3], // 绘制价格
        ['font', 'bold 26px 黑体 '],
        ['text', '¥', 12 * px, 365 * px, 145 * px, 30, 3],
        ['qrcode', this.link, 175 * px, 342 * px, 61 * px, 61 * px],//绘制链接二维码
      ], {
        image: share_image,//加载图片image
        avatar: avatar ? avatar : require('assets/img/default-t.png'),
        // bigLogo: platform_logo,//加载图片logo
      }).then(() => {
        this.refs.image.src = canvas.toDataURL()
        this.refs.image.style.opacity = '1'
        this.refs.p.style.opacity = '1'
      }).catch(e => console.log(e))
    } else {
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
        ['text', membername, 45 * px, 15 * px, 200 * px, 30, 0], // 绘制名字
        ['font', ' 22px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', '发现好货', 45 * px, 30 * px, 200 * px, 30, 0], // 绘制名字
        ['textAlign', 'left'],
        ['font', '500 18px 黑体 '],
        ['fillStyle', '#ffffff'],
        ['text', groupnum + '人团', 16 * px, textSetOffHeight * px, 145 * px, 25, 1],
        ['textAlign', 'left'],
        ['font', ' 24px 黑体 '],
        ['fillStyle', '#474747'],
        ['text', share_title, 12 * px, 307 * px, 224 * px, 25, 2], // 绘制换行文本
        ['font', 'bold 36px 黑体 '],
        ['fillStyle', '#FF762E'],
        ['text', goodsprice, 28 * px, ver ? 360.5 * px : 363.5 * px, 145 * px, 30, 3], // 绘制价格
        ['font', 'bold 26px 黑体 '],
        ['text', '¥', 12 * px, 365 * px, 145 * px, 30, 3],
        ['qrcode', this.link, 175 * px, 342 * px, 61 * px, 61 * px],//绘制链接二维码
      ], {
        image: share_image,//加载图片image
        avatar: avatar ? avatar : require('assets/img/defaultimg.png'),
        // bigLogo: platform_logo,//加载图片logo
      }).then(() => {
        this.refs.image.src = canvas.toDataURL()
        this.refs.image.style.opacity = '1'
        this.refs.p.style.opacity = '1'
      }).catch(e => console.log(e))
    }

  }

  componentDidMount = () => {
    setTitle('分享图')
    this.QR()
  }

  componentDidUpdate = () => {
    this.QR()
  }

  /*
  ** len -- 图片的宽高,因为我的图片宽高都一样,所以直接一个参数即可
  ** url -- 图片路径 
  */
  /* getUrlBase64(url, callback) {
    console.log(url)
    var canvas = document.createElement("canvas");   //创建canvas DOM元素
    var ctx = canvas.getContext("2d");
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = function () {
      canvas.height = 60; //指定画板的高度,自定义
      canvas.width = 85; //指定画板的宽度，自定义
      ctx.drawImage(img, 0, 0, 60, 85); //参数可自定义
      var dataURL = canvas.toDataURL("image/png");
      callback.call(this, dataURL); //回掉函数获取Base64编码
      canvas = null;
    }
  } */



  componentDidUpdate = () => {
    // image.onload = function () {
    //   let base64 = this.image2Base64(image)
    //   console.log(base64)
    // }
    /* this.getUrlBase64(this.state.data.platform_logo, function (base64) {
      console.log(base64)
    })
    let promise = Array.prototype.map.call(this.refs.box.querySelectorAll('img'), function (img) {
      return new Promise((resolve, reject) => {
        console.log('图片加载完成')
        img.onload = resolve
        img.onerror = reject
      })
    }) */

    // console.log(this)
    // qrcode.poster(this.refs.canvas, 750, 1334, [
    //   ['fillStyle', '#fffff'],
    //   ['fillRect', 0, 0, 750, 1334],
    // ], {})

  }

}


export default withRouter(HomeShare)
