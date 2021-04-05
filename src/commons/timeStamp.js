export function timestampToTime(date) {
  let time = new Date(parseInt(date) * 1000)
  var Y = time.getFullYear() + '-'
  var M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-'
  var D = (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' '
  var h = (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ': '
  var m = (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ': '
  var s = (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
  var strDate = Y + M + D + h + m + s;
  return strDate
}