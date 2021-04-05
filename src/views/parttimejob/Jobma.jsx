
import React, { Component } from 'react'
import { _mycashorder, _parsenBg } from 'network/profile'
import { store } from 'store'

import qrcode from 'commons/qrcode/index.js'

import { getQueryString } from 'commons/AuthFunction'


export default class QRcode extends Component {
    constructor() {
        super()
        this.state = {
            ma: '',
            bjurl: ''
        }
    }

    componentWillMount = () => {
        const { appConfig } = store.getState()
        const wxUserInfo = appConfig.wxUserInfo

        const eamConfig = {
            action: 'parsenBg',
            data: {
                uniacid: appConfig.uniacid,
            }
        }

        _parsenBg(eamConfig).then(res => {
            let windowH = document.documentElement.clientHeight
            let windowW = document.documentElement.clientWidth
            let mid = getQueryString('mid')
            let origin, pathname, search, hash
            origin = window.location.origin
            pathname = window.location.pathname
            if (mid) {
                // 当前用户是兼职人员
                if (wxUserInfo.enable === '1') {
                    search = window.location.search.replace(`&mid=${mid}`, `&mid=${wxUserInfo.id}`)
                    hash = `#/home`
                    this.link = origin + pathname + search + hash
                } else if (wxUserInfo.enable === null || wxUserInfo.enable === '0') {
                    // 不是兼职人员
                    origin = window.location.origin
                    pathname = window.location.pathname
                    search = window.location.search.replace(`&mid=${mid}`, '')
                    hash = `#/home`
                    this.link = origin + pathname + search + hash
                }

            } else {
                // 没有mid
                if (wxUserInfo.enable === '1') {
                    let oldSearch = window.location.search
                    search = window.location.search.replace(oldSearch, oldSearch + `&mid=${wxUserInfo.id}`)
                    hash = `#/home`
                    this.link = origin + pathname + search + hash
                } else {
                    search = window.location.search
                    hash = `#/home`
                    this.link = origin + pathname + search + hash
                }
            }


            let px = window.devicePixelRatio || 2
            let canvas = document.createElement('canvas')
            qrcode.poster(canvas, windowW * px, windowH * px, [
                ['fillRect', 0, 0, windowW * px, windowH * px], // 绘制一个白色矩形
                ['drawImage', 'image', 0, 0, windowW * px, windowH * px], // 绘制图片image
                // ['fillStyle', 'rgb(255,255,255)'],// 设置绘制颜色
                ['fill'], // 绘制填充前面的路径
                ['qrcode', this.link, (windowW - 130) * px, (windowH - 130) * px, 120 * px, 120 * px],//绘制链接二维码
                // ['drawImage', 'logo', 195 * px, 320 * px, 20 * px, 20 * px],//绘制logo到二维码中间
                // ['fillReact', 0, 0, 750, 1334],//绘制一个白色矩形
            ], {
                image: res.data.data,//加载图片image
            }).then(() => {
                this.refs.image.src = canvas.toDataURL()
                this.refs.image.style.opacity = '1'
            }).catch(e => console.log(e))

        })




    }



    render() {
        return (
            <img alt="" ref='image' style={{ width: '100vw', height: '100vh', position: 'absolute', transform: 'translate(-50%, -50%)', left: '50%', top: '50%', border: 'none', opacity: '0' }} />
        )
    }

}
