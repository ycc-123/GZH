export function vaPhone(phone) {
  let reg = /^[1]([3-9])[0-9]{9}$/
  return reg.test(phone)
}