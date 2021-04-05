import { guide } from './guide'

import { store } from 'store/index'
import { saveUserInfo } from 'store/actionCreators'

import axios from "axios"



let { openid } = store.getState().appConfig.wxUserInfo

async function getOpenidAsync(uniacid, code, mid, baseUrl, nocode) {

  if (code === null) {
    console.log('code 已经删除')
  } else {
    let Storage = window.localStorage
    openid = openid ? openid : ''
    let result = await axios.post(baseUrl + 'wechat_users_apis.php?action=getWXInfo', { uniacid, code, openid, mid })
    if (result.data.data.openid) {
      let userinfo = result.data.data
      mid = mid ? mid : ''
      let openid = userinfo.openid
      let member = await axios.post(baseUrl + 'wechat_users_apis.php?action=getMember', { openid })
      let enable = member.data.data.enable
      const { subscribe, ispayorder } = member.data.data
      guide(subscribe, ispayorder)
      userinfo.id = member.data.data.id
      userinfo.enable = enable
      window.sendMessageToApplet({ mid: userinfo.id, enable: enable })
      userinfo.member_status = member.data.data.member_status
      Storage.setItem('WXuserInfo', JSON.stringify(userinfo))
      const action = saveUserInfo(userinfo)
      store.dispatch(action)
    }
  }
}


async function getCodeUrlAsync(url, uniacid, baseUrl) {
  axios.post(baseUrl + 'wechat_users_apis.php?action=getWXCode', { uniacid, url }).then(res => {
    if (res.data.data) {
      window.location.href = res.data.data
    }
  })
}




const getQueryString = (name) => {
  // 获取URL中的code
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    // console.log('code===', unescape(r[2]))
    return unescape(r[2]);
  }
  return null;
}

const getQueryEntry = (entry) => {
  // 获取URL中的code
  var reg = new RegExp('(^|&)' + entry + '==([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    console.log('code===', unescape(r[2]))
    return unescape(r[2]);
  }
  return null;
}


export {
  getQueryString,
  getQueryEntry,
  getOpenidAsync,
  getCodeUrlAsync,
}