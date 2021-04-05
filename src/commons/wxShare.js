import { store } from 'store/index'

import { _wxConfig } from "network/profile"
import { Toast } from 'antd-mobile'

import { saveUserInfo } from "store/actionCreators"


/*
*
* @暂时用不到
*
*/

export async function setWXConfig(title, imgUrl, desc, link) {
  const wx = window.wx
  const { appConfig } = store.getState()
  let wxConfig = {
    action: 'getjsapiticket',
    data: {
      uniacid: appConfig.uniacid,
      url: window.location.href.split('#')[0]
    }
  }
  // 获取结果
  let wxConfigRes = await _wxConfig(wxConfig)
  const { appId, timestamp, nonceStr, signature } = wxConfigRes.data.data

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
      'openLocation'
    ]
  })

  wx.ready(function () {
    // 新版
    wx.updateAppMessageShareData({
      title,
      link,
      imgUrl,
      desc,
      success: function () {
      }
    })
    wx.updateTimelineShareData({
      title,
      link,
      imgUrl,
      success: function () {
      }
    })

    // 旧版
    wx.onMenuShareAppMessage({
      title,
      desc,
      link,
      imgUrl,
      type: '',
      dataUrl: '',
      success: function () {
      },
      fail: function () {
      }
    })
    wx.onMenuShareTimeline({
      title,
      link,
      imgUrl,
      success: function () {
      },
      fail: function () {
      }
    })
  })
}
