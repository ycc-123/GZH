import { store } from 'store/index'
import { _wxConfig } from "network/profile"

export function totalPrice() {
  if (store.getState().cartGoods.length !== 0) {
    // 算出总价 
    store.getState().totalPrice = store.getState().cartGoods.filter(item => item.checked
    ).reduce((oldValue, item) => {
      return oldValue + item.oprice * parseInt(item.num)
    }, 0).toFixed(2)
    // 算出总数
    store.getState().totalNumber = store.getState().cartGoods.filter(item => item.checked
    ).reduce((oldValue, item) => {
      return oldValue + parseInt(item.num)
    }, 0)
  }

}

export function cartTotal() {
  store.getState().cartGoods = store.getState().cartGoods.reduce((oldValue, item) => {
    return oldValue + item.num
  }, 0)
}

// 判断是否选择了全部商品
export function isSelectAllGoods() {
  if (!store.getState().cartGoods.find(item => !item.checked)) {
    store.getState().selectAll = true
  } else {
    store.getState().selectAll = false
  }
}


// 防抖函数
export function debounce(func, delay) {
  // func 传入方法名，delay毫秒
  let timer = null;
  return function (...args) {
    // ...args 可以传入多个参数
    if (timer) clearTimeout(timer)
    // 如果计时器为true 清空计时器
    timer = setTimeout(() => {
      //如果在delay时间内不会执行func函数
      //在delay时间外就会执行func函数
      func.apply(this, args)
    }, delay)
  }
}

export function setTitle(title) {
  // let baseUrl = window.location.origin
  document.title = title;
  var i = document.createElement('iframe');
  // i.src = `${baseUrl}/bbb.1ba1183e.png`;
  i.style.display = 'none';
  i.onload = function () {
    setTimeout(function () {
      i.remove();
    }, 9)
  }
  document.body.appendChild(i)
}
/**
 * @desc 函数防抖
 * @param {需要防抖的函数} func
 * @param {延迟时间} wait
 */
export function debounces(func, wait = 500) {
  // 缓存一个定时器id
  let timer = 0;
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * @desc 是否滚到到容器底部
 * @param {滚动容器} ele
 * @param {容器高度} wrapHeight
 */
export function isScrollBottom(ele, wrapHeight, threshold = 30) {
  const h1 = ele.scrollHeight - ele.scrollTop;
  const h2 = wrapHeight + threshold;
  const isBottom = h1 <= h2;
  return isBottom;
}






/**
 * [过滤对象]
 * @param  obj [过滤前数据]
 * @param  arr [过滤条件，要求为数组]
*/
export function filterObj(obj, arr) {
  if (typeof (obj) !== "object" || !Array.isArray(arr)) {
    throw new Error("参数格式不正确")
  }
  const result = {}
  Object.keys(obj).filter((key) => arr.includes(key)).forEach((key) => {
    result[key] = obj[key]
  })
  return result
}


export function getSearchString(key) {
  const search = window.location.search.substring(1)
  const searchParams = new URLSearchParams(search)
  const value = searchParams.get(key)
  return value
}

export function inputResolve() {
  const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
  const isIosVerLgThan13 = (ver && ver.length > 3 && ver[1] <= 13)
  return isIosVerLgThan13
}



/**
 * 
 * time: 2020-12-29
 * author: lkd
 * content: 匹配url的键值对 
 * @param {url} 需要匹配的地址
 * @param {key} 需要匹配的key
 * 
 * */

export function getUrlValue(url, key) {
  let reg = new RegExp("[?&]" + key + "\=([^&]+)", "g")
  console.log(key)
  console.log(reg)
  let result = reg.exec(url)
  console.log(result)
  if (result) {
    return result[1]
  }
  return null
}

/**
 *
 * @param key 键值
 * @param value 值
 * @param expiresTime 过期时间
 * @param {setCookie} fun 设置cookie的值
 *
 * */


// export function setCookie(key, value, expiresTime = null) {
//   let expiresTimeUTC, path = "/lkd"
//   if (expiresTime) {
//     // 转换为UTC格式
//     expiresTimeUTC = expiresTime.toUTCString()
//   }
//   document.cookie = `${key}=${value}; expires=${expiresTimeUTC}; path=${path}`
//   console.log(document.cookie, '当前cookie设置成功')
// }

// export function getCookie(key) {
//   let prefix = key + "="
//   let start = document.cookie.indexOf(prefix)

//   if (start == -1) {
//     return null
//   }

//   let end = document.cookie.indexOf(";", start + prefix.length)
//   if (end == -1) {
//     end = document.cookie.length
//   }

//   let value = document.cookie.substring(start + prefix.length, end)
//   return unescape(value)
// }



/**
 * 
 * @param {dom} 需要观察的dom
 * @param {scroll} 刷新高度
 * 
 * */

export function documentObserver(dom, scroll) {
  // 观察dom的改变
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
  const domObserver = new MutationObserver(mutations => {
    scroll.refresh()
  })
  domObserver.observe(dom, {
    childList: true,
    subtree: true
  })
  return domObserver
}


/**
 * 
 * rgb转换rbga格式
 * 
 * */

export function rgbToRgba(color, alp) {
  let r, g, b;
  let rgbaAttr = color.match(/[\d.]+/g);
  if (rgbaAttr.length >= 3) {
    let r, g, b;
    r = rgbaAttr[0];
    g = rgbaAttr[1];
    b = rgbaAttr[2];
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alp + ')';
  }
}


/**
 * 
 * 富文本转dom
 * 
 * 
 * */

export function escape2Html(content) {
  let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  return content.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}