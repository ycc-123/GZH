import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
// import FastClick from 'fastclick'
import axios from 'axios'
import Closed from "content/closed/Closed";
import BlackList from 'views/blacklist/BlackList'

import { store, persistor } from 'store/index'
import { saveAppConfig, saveBaseurl, setupMallConfig } from 'store/actionCreators'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import vConsole from 'vconsole'

import { _api } from 'network/api'

import { getQueryString, getCodeUrlAsync } from 'commons/AuthFunction'

// 新手引导方法
import { guide } from 'commons/guide'

// 路由懒加载
// import { AppRouter } from './router/AppRouter'
// 正常加载
import AppRouter from './router/AppRouter1'
import { _wxConfig } from "network/profile"

import { Product } from './config'

import 'lib-flexible'
import 'assets/css/border.css'
import 'assets/css/basic.css'

// FastClick.attach(document.body)

const wx = window.wx

let storage = window.localStorage

// const vconsole = new vConsole()

// let xcx = window.__wxjs_environment === 'miniprogram'
// window.xcx = xcx === true ? true : false


// let fontSize = document.querySelector('html').style.fontSize.replace('px', '')

// storage.setItem('remTurnPx', fontSize)

let url = window.location.href // 当前URL 作为授权跳转URL
// 正式站  第一次进入
let uniacid = getQueryString('entry')
let entry = getQueryString('entry') // 用于 url 拼接
let code = getQueryString('code')
let mode = getQueryString('mode')
let mid = getQueryString('mid') // 兼职上级id
let nocode = getQueryString('nocode') // 去除code 标志
let baseUrl = ''
let myReg = new RegExp("^((http://)|(https://))?([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}(/)", "g")
let regRes = myReg.exec(url)

let { origin, pathname, search, hash } = window.location

let newUrl, wxUserInfo = {}, vip_end

const isApplets = window.__wxjs_environment === 'miniprogram'

// 订单量是否为零



if (regRes !== null) {
  baseUrl = regRes[0]
  storage.setItem('baseUrl', JSON.stringify(baseUrl))
  const action = saveBaseurl(baseUrl)
  store.dispatch(action)
} else {
  baseUrl = 'https://dev.lexiangpingou.cn/'
  storage.setItem('baseUrl', JSON.stringify(baseUrl))
  const action = saveBaseurl(baseUrl)
  store.dispatch(action)
}

// 配置微信config

/**
 * 
 * @param {type} 1: 正常 2: 黑名单
 * 
 * */

function wxInitConfig(uniacid, type) {
  const wxConfig = {
    action: 'getjsapiticket',
    data: {
      uniacid,
      url: window.location.href.split('#')[0]
    }
  }
  switch (type) {
    case 1:
      // 获取配置微信参数
      _wxConfig(wxConfig).then(res => {
        const { appId, timestamp, nonceStr, signature } = res.data.data
        wx.config({
          debug: false,
          appId,
          timestamp,
          nonceStr,
          signature,
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'updateAppMessageShareData',
            'updateTimelineShareData',
            'getLocation',
            'openLocation',
            'chooseWXPay',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'scanQRCode',
            'closeWindow',
          ],
          openTagList: [
            'wx-open-subscribe'
          ]
        })
      })
      break
    case 2:
      _wxConfig(wxConfig).then(res => {
        const { appId, timestamp, nonceStr, signature } = res.data.data
        wx.config({
          debug: false,
          appId,
          timestamp,
          nonceStr,
          signature,
          jsApiList: [
            'closeWindow'
          ]
        })
      })
      break
    default: return
  }
}

function setMallConfig(uniacid) {
  const mall_config = {
    action: 'custom_template',
    data: {
      uniacid
    }
  }
  _api(mall_config).then(res => {
    if (res?.data?.status === 200) {
      let result = res.data.data
      const { custom_template_status } = result
      if (custom_template_status === '1') {
        const { template_color } = result
        const { home, category, cart, live, profile } = result.menu_icon
        switch (template_color) {
          case '0':
            document.body.style.setProperty('--bg-color', '#212735')
            document.body.style.setProperty('--theme-font-color', '#ff762e')
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#fff')
            document.body.style.setProperty('--tab-color', '#10131a')
            document.body.style.setProperty('--loading-color', '#212735')
            document.body.style.setProperty('--goods-bg-color', '#fff')
            result.theme_background_color = 'rgb(255, 118, 46)'
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/cart2.png',
              service: 'https://res.lexiangpingou.cn/images/vip/service.png',
              select: 'https://res.lexiangpingou.cn/images/vip/select1.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/home.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/home1.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/category.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/category1.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/cart.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/cart1.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/live.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/live1.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/profile.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/profile1.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          case '1':
            document.body.style.setProperty('--bg-color', '#ededed')
            document.body.style.setProperty('--theme-font-color', '#ff762e')
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#474747')
            document.body.style.setProperty('--tab-color', '#fff')
            document.body.style.setProperty('--loading-color', '#fff')
            document.body.style.setProperty('--goods-bg-color', '#fff')
            result.theme_background_color = 'rgb(255, 118, 46)'
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/cart2.png',
              service: 'https://res.lexiangpingou.cn/images/vip/99957service-black.png',
              select: 'https://res.lexiangpingou.cn/images/vip/select1.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/99975home-black.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/home1.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/99976category-black.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/category1.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/99977cart-black.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/cart1.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/99978live-black.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/live1.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/99979profile-black.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/profile1.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          case '2':
            document.body.style.setProperty('--bg-color', '#ededed')
            document.body.style.setProperty('--theme-font-color', '#EE0207')
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#474747')
            document.body.style.setProperty('--tab-color', '#fff')
            document.body.style.setProperty('--loading-color', '#fff')
            document.body.style.setProperty('--goods-bg-color', '#fff')
            result.theme_background_color = 'rgb(238, 2, 7)'
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/99981goods-cart-red.png',
              service: 'https://res.lexiangpingou.cn/images/vip/99957service-black.png',
              select: 'https://res.lexiangpingou.cn/images/vip/99958select-red.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/99975home-black.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/99960home-red.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/99976category-black.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/99961category-red.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/99977cart-black.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/99962cart-red.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/99978live-black.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/99963live-red.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/99979profile-black.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/99964profile-red.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          case '3':
            document.body.style.setProperty('--bg-color', '#ededed')
            document.body.style.setProperty('--theme-font-color', '#6FBFD8')
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#474747')
            document.body.style.setProperty('--tab-color', '#fff')
            document.body.style.setProperty('--loading-color', '#fff')
            document.body.style.setProperty('--goods-bg-color', '#fff')
            result.theme_background_color = 'rgb(111, 191, 216)'
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/99980goods-cart-blue.png',
              service: 'https://res.lexiangpingou.cn/images/vip/99957service-black.png',
              select: 'https://res.lexiangpingou.cn/images/vip/99959select-blue.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/99975home-black.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/99965home-blue.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/99976category-black.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/99966category-blue.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/99977cart-black.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/99967cart-blue.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/99978live-black.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/99968live-blue.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/99979profile-black.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/99969profile-blue.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          case '4':
            document.body.style.setProperty('--bg-color', result.background_color)
            document.body.style.setProperty('--theme-font-color', result.theme_background_color_16)
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#474747')
            document.body.style.setProperty('--tab-color', result.menu_background_color)
            document.body.style.setProperty('--loading-color', result.background_color)
            document.body.style.setProperty('--goods-bg-color', result.goods_background_color)
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/cart2.png',
              service: 'https://res.lexiangpingou.cn/images/vip/service.png',
              select: 'https://res.lexiangpingou.cn/images/vip/select1.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/99975home-black.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/99965home-blue.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/99976category-black.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/99966category-blue.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/99977cart-black.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/99967cart-blue.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/99978live-black.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/99968live-blue.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/99979profile-black.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/99969profile-blue.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          default: return
        }
      } else {
        document.body.style.setProperty('--bg-color', '#212735')
        document.body.style.setProperty('--theme-font-color', '#ff762e')
        document.body.style.setProperty('--common-font-color', '#474747')
        document.body.style.setProperty('--font-color', '#fff')
        document.body.style.setProperty('--tab-color', '#10131a')
        document.body.style.setProperty('--loading-color', '#212735')
        document.body.style.setProperty('--goods-bg-color', '#fff')
        result.theme_background_color = 'rgb(255, 118, 46)'
        result.icons = {
          goods_cart: 'https://res.lexiangpingou.cn/images/vip/cart2.png',
          service: 'https://res.lexiangpingou.cn/images/vip/service.png',
          select: 'https://res.lexiangpingou.cn/images/vip/select1.png'
        }
        result.tabBar = [
          {
            src: 'https://res.lexiangpingou.cn/images/vip/home.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/home1.png'
          },
          {
            src: 'https://res.lexiangpingou.cn/images/vip/category.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/category1.png'
          },
          {
            src: 'https://res.lexiangpingou.cn/images/vip/cart.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/cart1.png'
          },
          {
            src: 'https://res.lexiangpingou.cn/images/vip/live.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/live1.png'
          },
          {
            src: 'https://res.lexiangpingou.cn/images/vip/profile.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/profile1.png'
          },
        ]
        store.dispatch(setupMallConfig(result))
      }
    }
  })
}


async function getOpenidAsync(uniacid, code, mid, baseUrl, nocode) {
  if (code === null) {
  } else {
    let result = await axios.post(baseUrl + 'wechat_users_apis.php?action=getWXInfo', { uniacid, code, openid: '', mid })
    if (result.data.data.openid) {
      let wxInfo = result.data.data
      mid = mid ? mid : ''
      // 最后存在缓存里的数据
      wxUserInfo.openid = wxInfo.openid
      let memberInfo = await axios.post(baseUrl + 'wechat_users_apis.php?action=getMember', { openid: wxUserInfo.openid })
      if (memberInfo.data.status === 401) {
        wxInitConfig(uniacid, 2)
        ReactDOM.render(<BlackList />, document.getElementById('root'))
        return
      }
      // 订单为零时
      vip_end = memberInfo.data.data.vipend
      storage.setItem('vipEnd', JSON.stringify({ vipEnd: vip_end }))
      const { enable, id, headimgurl, member_status, nickname, subscribe, ispayorder, avatar } = memberInfo.data.data
      guide(subscribe, ispayorder)
      // 尊贵的vip用户id
      wxUserInfo.id = id
      wxUserInfo.enable = enable
      wxUserInfo.member_status = member_status
      wxUserInfo.nickname = nickname
      wxUserInfo.headimgurl = headimgurl || avatar
      window.sendMessageToApplet({ mid: wxUserInfo.id, enable })
    }
  }
}

async function deCodeUinacid(txt) {
  let uniRes = await axios.post(baseUrl + 'wechat_users_api.php?action=passport_decrypt', { txt })
  // 解析后的uniacid
  uniacid = uniRes.data.data
  setMallConfig(uniacid)
  // 商户是否过期
  let vipEnd = await axios.post(baseUrl + 'wechat_users_apis.php?action=vipEnd', { uniacid })
  if (vipEnd.data.status === 200) {
    // 商户没有过期
    let have = JSON.parse(window.localStorage.getItem('appConfig')), existUniacid = false
    if (Array.isArray(have)) {
      storage.clear()
      getCodeUrlAsync(url, uniacid, baseUrl)
      return
    }
    if (have && have.uniacid !== uniacid) {
      // appConfig存在moreEntryConfig配置时
      // 判断解析的uniacid是否于moreEntryConfig中某个uniacid相等
      if (Array.isArray(have.moreEntryConfig)) {
        have.moreEntryConfig.find(item => item.uniacid === uniacid) ? existUniacid = false : existUniacid = true
      } else {
        existUniacid = true
      }
    }
    // 第一次进入公众号需要授权的用户或者缓存中不存在与解析的uniacid相等的uniacid
    if (!have || existUniacid) {
      if (code) {
        let appConfig = {}
        if (existUniacid) {
          appConfig = have
        }
        // 保存uniacid
        appConfig.uniacid = uniacid
        appConfig.isIOS = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
        if (Array.isArray(appConfig.moreEntryConfig)) {
          appConfig.moreEntryConfig.push({ uniacid })
        } else {
          appConfig.moreEntryConfig = []
          appConfig.moreEntryConfig.push({ uniacid })
        }
        // 用code 和 当前的uniacid 得到 用户的信息
        getOpenidAsync(uniacid, code, mid, baseUrl, nocode).then(async () => {
          if (isApplets === true) {
            appConfig.isApplet = true
            if (mid) {
              pathname = window.location.pathname
              search = window.location.search.replace(`&mid=${mid}`, `&mid=${wxUserInfo.id}`)
              newUrl = origin + pathname + search + hash
              window.history.pushState(null, null, newUrl)
            } else {
              pathname = window.location.pathname
              let oldSearch = window.location.search
              search = window.location.search.replace(oldSearch, oldSearch + `&mid=${wxUserInfo.id}`)
              newUrl = origin + pathname + search + hash
              window.history.pushState(null, null, newUrl)
            }
          } else {
            appConfig.isApplet = false
          }
          appConfig.wxUserInfo = wxUserInfo
          appConfig.moreEntryConfig.forEach(item => {
            if (item.uniacid === uniacid) {
              item.openid = wxUserInfo.openid
            }
          })
          const action = saveAppConfig(appConfig)
          store.dispatch(action)
          storage.setItem('appConfig', JSON.stringify(appConfig))

          // 订单量为0并且不是进入个人中心页面 全部走到profile页
          if (vip_end === 1 && hash !== '#/profile') {
            window.location.replace(origin + pathname + search + '#/profile')
          }

          let reg = new RegExp('(^|&)code=([^&]*)(&state=|$)', 'i')
          let redirectUrl
          // if (!mid) {
          //   redirectUrl = window.location.href.replace(reg, `&mid=${wxUserInfo.id}&`)
          // } else {
          //   redirectUrl = window.location.href.replace(reg, '')
          // }
          redirectUrl = window.location.href.replace(reg, '')
          window.history.pushState(null, null, redirectUrl)
          wxInitConfig(uniacid, 1)
          ReactDOM.render(
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                <AppRouter />
              </PersistGate>
            </Provider>, document.getElementById('root'))
        })
      } else {
        // 将当前的url 传到到后台 ，跳转获取code
        getCodeUrlAsync(url, uniacid, baseUrl)
      }
    } else {
      // 缓存里存在配置信息
      let appConfig = have
      // 兼容同一协议、域名、端口号相同entry不同
      // uniacid: url解析后的
      // appConfig.uniacid: 缓存里的uniacid
      if (Array.isArray(appConfig.moreEntryConfig)) {
        // existUO需要更新的uniacid openid
        let existUO = appConfig.moreEntryConfig.find(item => item.uniacid === uniacid)
        appConfig.uniacid = existUO.uniacid
        appConfig.wxUserInfo.openid = existUO.openid
      } else {
        if (uniacid !== appConfig.uniacid) {
          appConfig.moreEntryConfig = []
          appConfig.moreEntryConfig.push({ uniacid: appConfig.uniacid, openid: appConfig.wxUserInfo.openid })
          storage.setItem('appConfig', JSON.stringify(appConfig))
          getCodeUrlAsync(url, uniacid, baseUrl)
          return
        }
      }
      // const openid = appConfig.wxUserInfo.openid
      const result = await axios.post(baseUrl + 'wechat_users_apis.php?action=getMember', { openid: appConfig.wxUserInfo.openid }) // 获取会员兼职状态
      if (result.data.status === 400) {
        localStorage.clear()
        getCodeUrlAsync(url, uniacid, baseUrl)
        return
      } else if (result.data.status === 401) {
        wxInitConfig(uniacid, 2)
        ReactDOM.render(<BlackList />, document.getElementById('root'))
        return
      }
      const memberInfo = result.data.data
      if (isApplets === true) {
        appConfig.isApplet = true
        if (mid) {
          pathname = window.location.pathname
          search = window.location.search.replace(`&mid=${mid}`, `&mid=${memberInfo.id}`)
          newUrl = origin + pathname + search + hash
          window.history.pushState(null, null, newUrl)
        } else {
          pathname = window.location.pathname
          let oldSearch = window.location.search
          search = window.location.search.replace(oldSearch, oldSearch + `&mid=${memberInfo.id}`)
          newUrl = origin + pathname + search + hash
          window.history.pushState(null, null, newUrl)
        }
      } else {
        appConfig.isApplet = false
      }
      vip_end = memberInfo.vipend
      storage.setItem('vipEnd', JSON.stringify({ vipEnd: vip_end }))
      if (vip_end === 1 && hash !== '#/profile') {
        window.location.replace(origin + pathname + search + '#/profile')
      }
      // 不需要授权需要更新一下appConfig的数据
      const { subscribe, ispayorder, enable, id, nickname, member_status, headimgurl, avatar } = memberInfo
      guide(subscribe, ispayorder)
      appConfig.wxUserInfo.id = id
      appConfig.wxUserInfo.enable = enable
      appConfig.wxUserInfo.member_status = member_status
      appConfig.wxUserInfo.nickname = nickname
      appConfig.wxUserInfo.headimgurl = headimgurl || avatar
      appConfig.isIOS = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
      storage.setItem('appConfig', JSON.stringify(appConfig))
      // 替换redux 中的当前商家
      const action = saveAppConfig(appConfig)
      store.dispatch(action)
      wxInitConfig(uniacid, 1)
      ReactDOM.render(
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <AppRouter />
          </PersistGate>
        </Provider>, document.getElementById('root'))
    }
  } else if (vipEnd.data.status === 400) {
    // 店铺过期
    ReactDOM.render(<Closed />, document.getElementById('root'))
  }
}



if (Product) {
  if (origin !== 'https://dev.lexiangpingou.cn' || origin !== 'https://dev.huodiesoft.com') {
    // 正式站 不为测试站
    Sentry.init({
      dsn: "https://28c1fe2eef324a759deb658a15442ff0@o512263.ingest.sentry.io/5611770"
    })
  }

  deCodeUinacid(uniacid)
} else {

  const mall_config = {
    action: 'custom_template',
    data: {
      uniacid: 53
    }
  }

  _api(mall_config).then(res => {
    if (res?.data?.status === 200) {
      let result = res.data.data
      const { custom_template_status } = result
      if (custom_template_status === '1') {
        const { home, category, cart, live, profile } = result.menu_icon
        const { template_color } = result
        switch (template_color) {
          case '0':
            document.body.style.setProperty('--bg-color', '#212735')
            document.body.style.setProperty('--theme-font-color', '#ff762e')
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#fff')
            document.body.style.setProperty('--tab-color', '#10131a')
            document.body.style.setProperty('--loading-color', '#212735')
            document.body.style.setProperty('--goods-bg-color', '#fff')
            result.theme_background_color = 'rgb(255, 118, 46)'
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/cart2.png',
              service: 'https://res.lexiangpingou.cn/images/vip/service.png',
              select: 'https://res.lexiangpingou.cn/images/vip/select1.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/home.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/home1.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/category.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/category1.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/cart.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/cart1.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/live.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/live1.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/profile.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/profile1.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          case '1':
            document.body.style.setProperty('--bg-color', '#ededed')
            document.body.style.setProperty('--theme-font-color', '#ff762e')
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#474747')
            document.body.style.setProperty('--tab-color', '#fff')
            document.body.style.setProperty('--loading-color', '#fff')
            document.body.style.setProperty('--goods-bg-color', '#fff')
            result.theme_background_color = 'rgb(255, 118, 46)'
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/cart2.png',
              service: 'https://res.lexiangpingou.cn/images/vip/99957service-black.png',
              select: 'https://res.lexiangpingou.cn/images/vip/select1.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/99975home-black.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/home1.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/99976category-black.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/category1.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/99977cart-black.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/cart1.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/99978live-black.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/live1.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/99979profile-black.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/profile1.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          case '2':
            document.body.style.setProperty('--bg-color', '#ededed')
            document.body.style.setProperty('--theme-font-color', '#EE0207')
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#474747')
            document.body.style.setProperty('--tab-color', '#fff')
            document.body.style.setProperty('--loading-color', '#fff')
            document.body.style.setProperty('--goods-bg-color', '#fff')
            result.theme_background_color = 'rgb(238, 2, 7)'
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/99981goods-cart-red.png',
              service: 'https://res.lexiangpingou.cn/images/vip/99957service-black.png',
              select: 'https://res.lexiangpingou.cn/images/vip/99958select-red.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/99975home-black.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/99960home-red.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/99976category-black.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/99961category-red.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/99977cart-black.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/99962cart-red.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/99978live-black.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/99963live-red.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/99979profile-black.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/99964profile-red.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          case '3':
            document.body.style.setProperty('--bg-color', '#ededed')
            document.body.style.setProperty('--theme-font-color', '#6FBFD8')
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#474747')
            document.body.style.setProperty('--tab-color', '#fff')
            document.body.style.setProperty('--loading-color', '#fff')
            document.body.style.setProperty('--goods-bg-color', '#fff')
            result.theme_background_color = 'rgb(111, 191, 216)'
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/99980goods-cart-blue.png',
              service: 'https://res.lexiangpingou.cn/images/vip/99957service-black.png',
              select: 'https://res.lexiangpingou.cn/images/vip/99959select-blue.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/99975home-black.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/99965home-blue.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/99976category-black.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/99966category-blue.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/99977cart-black.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/99967cart-blue.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/99978live-black.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/99968live-blue.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/99979profile-black.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/99969profile-blue.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          case '4':
            document.body.style.setProperty('--bg-color', result.background_color)
            document.body.style.setProperty('--theme-font-color', result.theme_background_color_16)
            document.body.style.setProperty('--common-font-color', '#474747')
            document.body.style.setProperty('--font-color', '#474747')
            document.body.style.setProperty('--tab-color', result.menu_background_color)
            document.body.style.setProperty('--loading-color', result.background_color)
            document.body.style.setProperty('--goods-bg-color', result.goods_background_color)
            result.icons = {
              goods_cart: 'https://res.lexiangpingou.cn/images/vip/cart2.png',
              service: 'https://res.lexiangpingou.cn/images/vip/service.png',
              select: 'https://res.lexiangpingou.cn/images/vip/select1.png'
            }
            result.tabBar = [
              {
                src: home.noactive ? home.noactive : 'https://res.lexiangpingou.cn/images/vip/99975home-black.png',
                activeSrc: home.active ? home.active : 'https://res.lexiangpingou.cn/images/vip/99965home-blue.png'
              },
              {
                src: category.noactive && category.status === 1 ? category.noactive : 'https://res.lexiangpingou.cn/images/vip/99976category-black.png',
                activeSrc: category.active && category.status === 1 ? category.active : 'https://res.lexiangpingou.cn/images/vip/99966category-blue.png'
              },
              {
                src: cart.noactive ? cart.noactive : 'https://res.lexiangpingou.cn/images/vip/99977cart-black.png',
                activeSrc: cart.active ? cart.active : 'https://res.lexiangpingou.cn/images/vip/99967cart-blue.png'
              },
              {
                src: live.noactive && live.status === 1 ? live.noactive : 'https://res.lexiangpingou.cn/images/vip/99978live-black.png',
                activeSrc: live.active && live.status === 1 ? live.active : 'https://res.lexiangpingou.cn/images/vip/99968live-blue.png'
              },
              {
                src: profile.noactive ? profile.noactive : 'https://res.lexiangpingou.cn/images/vip/99979profile-black.png',
                activeSrc: profile.active ? profile.active : 'https://res.lexiangpingou.cn/images/vip/99969profile-blue.png'
              },
            ]
            store.dispatch(setupMallConfig(result))
            break
          default: return
        }
      } else {
        document.body.style.setProperty('--bg-color', '#212735')
        document.body.style.setProperty('--theme-font-color', '#ff762e')
        document.body.style.setProperty('--common-font-color', '#474747')
        document.body.style.setProperty('--font-color', '#fff')
        document.body.style.setProperty('--tab-color', '#10131a')
        document.body.style.setProperty('--loading-color', '#212735')
        document.body.style.setProperty('--goods-bg-color', '#fff')
        result.theme_background_color = 'rgb(255, 118, 46)'
        result.icons = {
          goods_cart: 'https://res.lexiangpingou.cn/images/vip/cart2.png',
          service: 'https://res.lexiangpingou.cn/images/vip/service.png',
          select: 'https://res.lexiangpingou.cn/images/vip/select1.png'
        }
        result.tabBar = [
          {
            src: 'https://res.lexiangpingou.cn/images/vip/home.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/home1.png'
          },
          {
            src: 'https://res.lexiangpingou.cn/images/vip/category.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/category1.png'
          },
          {
            src: 'https://res.lexiangpingou.cn/images/vip/cart.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/cart1.png'
          },
          {
            src: 'https://res.lexiangpingou.cn/images/vip/live.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/live1.png'
          },
          {
            src: 'https://res.lexiangpingou.cn/images/vip/profile.png',
            activeSrc: 'https://res.lexiangpingou.cn/images/vip/profile1.png'
          },
        ]
        store.dispatch(setupMallConfig(result))
      }
    }




    const pageGuide = {
      home: 1,
      cart: 1,
      submit: 1,
      category: 1
    }

    localStorage.setItem('page', JSON.stringify(pageGuide))
    localStorage.setItem('vipEnd', JSON.stringify({ vipEnd: undefined }))
    ReactDOM.render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </Provider>, document.getElementById('root'))
  })

  // 开发
  // Sentry.init({
  //   dsn: "https://28c1fe2eef324a759deb658a15442ff0@o512263.ingest.sentry.io/5611770"
  // })

}


