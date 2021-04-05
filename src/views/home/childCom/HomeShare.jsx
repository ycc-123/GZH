import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
// import styled from 'styled-components'


import { getQueryString } from 'commons/AuthFunction'
import { setTitle } from 'commons/utils'

import HomeShareButton from './HomeShareButton'


import { store } from 'store/index'

import { _api } from 'network/api'
import qrcode from 'commons/qrcode/index.js'



class HomeShare extends Component {
  render() {
    return (
      <Fragment>
        <HomeShareButton />
        {/* <img src={require('assets/img/sharecha.png')} alt="" style={{ position: 'absolute', left: '7.12rem', top: '3rem',  width: '.8rem', height: '.8rem' }} />
        <div style={{ position: 'absolute', left: '7.51rem', top: '3.8rem', width: '1px', height: '.4rem', backgroundColor: 'white'}}></div> */}
        <img alt="" ref='image' style={{ width: '250px', height: '366px', display: 'block', position: 'absolute', transform: 'translate(-50%, -50%)', left: '50%', top: '50%', border: 'none', opacity: '0' }} />
        <p ref='p' style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translate(-50%, 0)', fontSize: '.32rem', color: '#fff', opacity: '0' }}>长按图片保存</p>
      </Fragment>
    )
  }

  QR = async () => {
    const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    const lianjie_config = {
      action: 'indexShare',
      data: {
        uniacid: appConfig.uniacid
      }
    }
    const result = await _api(lianjie_config)
    // 分辨率
    let px = 2
    let { platform_logo, business_name, share_title, share_desc, share_image } = result.data.data
    let mid = getQueryString('mid')
    let origin, pathname, search, hash, url
    if (mid) {
      // 当前用户是兼职人员
      if (wxUserInfo.enable === '1') {
        origin = window.location.origin
        pathname = window.location.pathname
        search = window.location.search.replace(`&mid=${mid}`, `&mid=${wxUserInfo.id}`)
        hash = `#/home`
        url = origin + pathname + search + hash
        this.link = url
      } else if (wxUserInfo.enable === null || wxUserInfo.enable === '0') {
        // 不是兼职人员
        origin = window.location.origin
        pathname = window.location.pathname
        search = window.location.search.replace(`&mid=${mid}`, '')
        hash = `#/home`
        url = origin + pathname + search + hash
        this.link = url
      }

    } else {
      // 没有mid
      if (wxUserInfo.enable === '1') {
        origin = window.location.origin
        pathname = window.location.pathname
        let oldSearch = window.location.search
        search = window.location.search.replace(oldSearch, oldSearch + `&mid=${wxUserInfo.id}`)
        hash = `#/home`
        url = origin + pathname + search + hash
        this.link = url
      } else {
        origin = window.location.origin
        pathname = window.location.pathname
        search = window.location.search
        hash = `#/home`
        url = origin + pathname + search + hash
        this.link = origin + pathname + search + hash
      }
    }

    console.log(platform_logo ? require('assets/img/default-t.png') : platform_logo)


    let canvas = document.createElement('canvas')
    qrcode.poster(canvas, 250 * px, 366 * px, [
      ['roundRect', 0, 0, 250 * px, 366 * px, 5 * px],
      ['clip'],
      ['fillStyle', '#ffffff'],//设置绘制颜色
      ['fillRect', 0, 0, 250 * px, 366 * px], // 绘制一个白色矩形
      ['drawImage', 'image', 0, 0, 250 * px, 250 * px], // 绘制图片image
      ['roundRect', 93 * px, 58 * px, 64 * px, 64 * px, 32 * px], //圈一个圆角矩形路径
      ['fillStyle', 'rgba(71, 71, 71, 0.5)'],
      ['roundRect', 81 * px, 132 * px, 87 * px, 25 * px, 13 * px],
      // ['fillStyle', 'rgb(255,255,255)'],// 设置绘制颜色
      ['fill'], // 绘制填充前面的路径
      ['save'],
      ['beginPath'],
      ['arc', 125 * px, 90 * px, 30 * px, 0, 360],
      ['clip'],
      ['drawImage', 'bigLogo', 95 * px, 60 * px, 60 * px, 60 * px],
      ['restore'],
      ['fillStyle', '#ffffff'],
      ['textAlign', 'center'],
      ['font', '24px 微软雅黑 '],
      ['fillText', business_name, 125 * px, ver ? 136 * px : 140 * px],
      ['textAlign', 'left'],
      ['font', ' bold 24px 微软雅黑 '],
      ['fillStyle', '#474747'],
      ['text', share_title, 12 * px, 264 * px, 224 * px, 30, 2], // 绘制换行文本
      ['fillStyle', '#474747'],
      ['fillStyle', 'rgba(71, 71, 71, 0.5)'],
      ['text', share_desc, 12 * px, 302 * px, 145 * px, 30, 3],
      ['qrcode', this.link, 175 * px, 299 * px, 61 * px, 61 * px],//绘制链接二维码default-t
      // ['drawImage', 'logo', 195 * px, 320 * px, 20 * px, 20 * px],//绘制logo到二维码中间
      // ['fillReact', 0, 0, 750, 1334],//绘制一个白色矩形
    ], {
      image: share_image ? share_image : require('assets/img/default-b.png'), //加载图片image
      bigLogo: platform_logo ? platform_logo : require('assets/img/default-t.png'), //加载图片logo
    }).then(() => {
      this.refs.image.src = canvas.toDataURL()
      this.refs.image.style.opacity = '1'
      this.refs.p.style.opacity = '1'
    }).catch(e => console.log(e))

  }


  componentDidMount = () => {
    setTitle('分享图')
    this.QR()
  }

  componentDidUpdate = () => {
    this.QR()
  }

  // if (platform_logo) {
  //   let canvas = document.createElement('canvas')
  //   qrcode.poster(canvas, 250 * px, 366 * px, [
  //     ['roundRect', 0, 0, 250 * px, 366 * px, 4 * px],
  //     ['clip'],
  //     ['fillStyle', '#ffffff'],//设置绘制颜色
  //     ['fillRect', 0, 0, 250 * px, 366 * px], // 绘制一个白色矩形
  //     ['drawImage', 'image', 0, 0, 250 * px, 250 * px], // 绘制图片image
  //     ['roundRect', 93 * px, 58 * px, 64 * px, 64 * px, 32 * px], //圈一个圆角矩形路径
  //     ['fillStyle', 'rgba(71, 71, 71, 0.5)'],
  //     ['roundRect', 81 * px, 132 * px, 87 * px, 25 * px, 13 * px],
  //     // ['fillStyle', 'rgb(255,255,255)'],// 设置绘制颜色
  //     ['fill'], // 绘制填充前面的路径
  //     ['save'],
  //     ['beginPath'],
  //     ['arc', 125 * px, 90 * px, 30 * px, 0, 360],
  //     ['clip'],
  //     ['drawImage', 'bigLogo', 95 * px, 60 * px, 60 * px, 60 * px],
  //     ['restore'],
  //     ['fillStyle', '#ffffff'],
  //     ['textAlign', 'center'],
  //     ['font', '24px 微软雅黑 '],
  //     ['fillText', business_name, 125 * px, 136 * px],
  //     ['textAlign', 'left'],
  //     ['font', ' bold 24px 微软雅黑 '],
  //     ['fillStyle', '#474747'],
  //     ['text', share_title, 12 * px, 264 * px, 145 * px, 30, 2], // 绘制换行文本
  //     ['fillStyle', '#474747'],
  //     ['fillStyle', 'rgba(71, 71, 71, 0.5)'],
  //     ['text', share_desc + '132213', 12 * px, 302 * px, 145 * px, 30, 3],
  //     ['qrcode', window.location.href, 175 * px, 299 * px, 61 * px, 61 * px],//绘制链接二维码
  //     // ['drawImage', 'logo', 195 * px, 320 * px, 20 * px, 20 * px],//绘制logo到二维码中间
  //     // ['fillReact', 0, 0, 750, 1334],//绘制一个白色矩形
  //   ], {
  //     image: share_image,//加载图片image
  //     logo: platform_logo,//加载图片logo
  //     bigLogo: platform_logo,//加载图片logo
  //   }).then(() => {
  //     this.refs.image.src = canvas.toDataURL()
  //     // let image = this.refs.img
  //     // image.src = canvas.toDataURL("image/png")
  //   })
  // } else if (!platform_logo) {
  //   // logo图片不存在删除logo背景和文字
  //   let canvas = document.createElement('canvas')
  //   qrcode.poster(canvas, 250 * px, 366 * px, [
  //     ['roundRect', 0, 0, 250 * px, 366 * px, 4 * px],
  //     ['clip'],
  //     ['fillStyle', '#ffffff'],//设置绘制颜色
  //     ['fillRect', 0, 0, 250 * px, 366 * px], // 绘制一个白色矩形
  //     ['drawImage', 'image', 0, 0, 250 * px, 250 * px], // 绘制图片image
  //     ['fillStyle', 'rgba(71, 71, 71, 0.5)'],
  //     ['roundRect', 81 * px, 132 * px, 87 * px, 25 * px, 13 * px],
  //     // ['fillStyle', 'rgb(255,255,255)'],// 设置绘制颜色
  //     ['fill'], // 绘制填充前面的路径
  //     ['fillStyle', '#474747'],
  //     ['text', share_title, 12 * px, 264 * px, 224 * px, 30, 2], // 绘制换行文本
  //     ['fillStyle', '#474747'],
  //     ['fillStyle', 'rgba(71, 71, 71, 0.5)'],
  //     ['text', share_desc + '132213', 12 * px, 302 * px, 145 * px, 30, 3],
  //     ['qrcode', window.location.href, 175 * px, 299 * px, 61 * px, 61 * px],//绘制链接二维码
  //     // ['drawImage', 'logo', 195 * px, 320 * px, 20 * px, 20 * px],//绘制logo到二维码中间
  //     // ['fillReact', 0, 0, 750, 1334],//绘制一个白色矩形
  //   ], {
  //     image: share_image,//加载图片image
  //   }).then(() => {
  //     this.refs.image.src = canvas.toDataURL()
  //     // let image = this.refs.img
  //     // image.src = canvas.toDataURL("image/png")
  //   })
  // }





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

  shouldComponentUpdate = (nextProps) => {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps)
  }




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

/* const HomeShareStyle = styled.div`

.code {
  float: right;
  width: 1.63rem;
  height: 1.63rem;
  border: none;
}

.box1 {
  width: 5.97rem;
  margin: 0 auto;
  height: 1.63rem;
}

.box {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.home-share-img {
  position: absolute;
  overflow: hidden;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
  height: 9.76rem;
  width: 6.63rem;
  background: #fff;
  border-radius: .13rem;
}

.name {
  position: absolute;
  height: .67rem;
  top: 3.63rem;
  left: 50%;
  color: #fff;
  background: rgba(0, 0, 0, .5);
  line-height: .67rem;
  transform: translate(-50%, 0);
  padding: 0 .36rem;
  border-radius: .3rem;
}


.img {
  width: 6.63rem;
  height: 6.63rem;
  margin-bottom: .4rem;
}

.touxiang {
  position: absolute;
  width: 1.49rem;
  height: 1.49rem;
  top: 1.68rem;
  left: 50%;
  background: red;
  border-radius: 50%;
  transform: translate(-50%, 0)
}

.title {
  width: 5.97rem;
  margin: 0 auto;
  font-size: .32rem;
  text-align: justify;
  line-height: 1;
  margin-bottom: .4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.desc {
  float: left;
  display: inline-block;
  font-size: .24rem;
  width: 3.87rem;
  text-align: justify;
  color: #ccc;
}

` */

export default withRouter(HomeShare)
