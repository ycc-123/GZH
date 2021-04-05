

/**
 * 
 * @param {图片的链接} src 
 * @param {img元素} img 
 */

export function imgLazyload(src, img) {
  var io = new IntersectionObserver(function (entries) {
    // 回调函数默认会执行一次，不管是否在可视区域内
    // isIntersecting 为true时进入可视区域
    if (entries[0].isIntersecting) {
      img.src = src
      io.unobserve(img)
      io.disconnect()
    }
  })
  io.observe(img)
}