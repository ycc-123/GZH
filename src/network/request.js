import axios from 'axios'
import { Toast } from 'antd-mobile'

import { store } from 'store/index'


import { Product } from '../config'

import MD5 from 'js-md5'
import { saveBaseurl } from 'store/actionCreators'


// 重新请求的次数,请求的间隙
export function request(config) {
  // let loading
  // 1.创建axios的实例
  const instance = axios.create({
    // 测试站
    baseURL: 'http://dev.huodiesoft.com/wechat_api.php',
    // 正式站
    // baseURL: 'https://www.lexiangpingou.cn/wechat_api.php',
    timeout: 1000
  })
  // 2.axios的拦截器
  // 2.1请求拦截器的作用
  instance.interceptors.response.use(config => {
    return config
  }, err => {
    return Promise.reject(err)
  })

  // 2.2响应拦截器
  instance.interceptors.response.use(res => {
    /* if (loading === 1) {
      const action = hideLoadingAction()
      store.dispatch(action)
    } */
    return res.data
  }, async err => {
    let config = err.config;
    // 设置一个变量用来跟踪重试次数 判断变量是否存在,不存在为0
    config.retryCount = config.retryCount || 0;
    /* if (config.retryCount === 0 && (config.params.op === 'shopajax' || config.params.op === 'goods_detail')) {
      const action = showLoadingAction()
      store.dispatch(action)
      loading = 1
    } */
    // 判断重试的次数是否大于最大值,大于最大值发送错误消息
    if (config.retryCount >= 5) {
      return Promise.reject(err);
    }
    // 自增重试次数
    config.retryCount += 1;
    // 创建一个新的promis对象 在定时过后发送一个解决函数 收到解决函数才能then
    console.log(config.retryCount)
    var backoff = new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    // backoff能进入then,在一秒之后发送一个一样新的网络请求
    return await backoff.then(() => {
      return instance(config)
    })
  })

  // 3.发送真正的网络请求,返回Promise
  return instance(config)
}

let requresNum = 0, show = false, timer

// 直播旧接口
export function requestLive(config) {
  let url = window.location.href
  let baseUrl = store.getState().baseurl !== '' ? store.getState().baseurl : ''
  // let baseUrl = 'https://dev.huodiesoft.com'

  if (baseUrl === '') {
    let myReg = new RegExp("^((http://)|(https://))?([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}(/)", "g")
    let regRes = myReg.exec(url)
    baseUrl = regRes[0]
    const action = saveBaseurl(baseUrl)
    store.dispatch(action)
  }
  if (baseUrl !== null) {
    const instance = axios.create({
      // 测试站
      baseURL: baseUrl !== 'https://dev.lexiangpingou.cn/' ? 'https://lexiangpingou.cn/applet/live.php' : 'https://dev.huodiesoft.com/applet/live.php',
      // baseURL: 'https://dev.huodiesoft.com/applet/live.php',
      timeout: baseUrl !== 'https://dev.lexiangpingou.cn/' ? 20000 : 1000
    })

    return instance(config)
  }

}

// post带s的 瑞怀接口
export function requestPostS(config) {
  //  console.log(JSON.parse(window.localStorage.getItem('baseUrl')))
  // let baseUrl = JSON.parse(window.localStorage.getItem('baseUrl')) || 'https://dev.huodiesoft.com/'
  // 重新获取baseUrl
  let origin = window.location.origin
  const instance = axios.create({
    timeout: 20000,
    // 测试站
    baseURL: Product ? origin + '/wechat_users_apis.php' : 'https://dev.lexiangpingou.cn/' + 'wechat_users_apis.php',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  })
  instance.interceptors.request.use(config => {
    if (requresNum === 0) {
      timer = setTimeout(() => {
        show = true
        if (show) {
          Toast.loading('加载中...')
        }
      }, 500)
    }
    requresNum++
    return config
  }, err => {
    return Promise.reject(err)
  })

  instance.interceptors.response.use(config => {
    requresNum--
    if (requresNum === 0) {
      Toast.hide()
      show = false
      clearTimeout(timer)
    }
    return config
  }, err => {
    requresNum--
    if (requresNum === 0) {
      Toast.hide()
      show = false
      clearTimeout(timer)
    }
    return Promise.reject(err)
  })

  return instance(config)
}

// 不带s  新曼接口
export function requestPost(config) {
  let origin = window.location.origin
  let cancel // 用于保存取消请求的函数
  // Toast.loading('加载中')

  config.data.timestamp = new Date().getTime()
  config.data.sign = MD5('huodie2020' + config.data.timestamp)
  const instance = axios.create({
    timeout: 20000,
    // 测试站
    baseURL: Product ? origin + '/wechat_users_api.php' : 'https://dev.lexiangpingou.cn/' + 'wechat_users_api.php',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: config.data,
    cancelToken: new axios.CancelToken((c) => {
      // c用于取消当前请求的函数
      // 保存取消请求的函数，用于之后可能需要取消当前请求
      cancel = c
    })
  })

  instance.interceptors.request.use(config => {
    if (requresNum === 0) {
      timer = setTimeout(() => {
        show = true
        if (show) {
          Toast.loading('加载中...')
        }
      }, 500)
    }
    requresNum++
    return config
  }, err => {
    return Promise.reject(err)
  })

  instance.interceptors.response.use(config => {
    requresNum--
    if (requresNum === 0) {
      Toast.hide()
      show = false
      clearTimeout(timer)
    }
    // cancel = null
    return config
  }, err => {
    requresNum--
    if (requresNum === 0) {
      Toast.hide()
      show = false
      clearTimeout(timer)
    }
    // cancel = null
    return Promise.reject(err)
  })
  return instance(config)
}
