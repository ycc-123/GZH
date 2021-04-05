import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import EventBus from 'commons/event'

import { dropByCacheKey } from 'react-router-cache-route'

import { store } from 'store/index'

import { _submitApi } from 'network/submit'

/* import { createOrder } from 'network/submit' */

class SubmitBottomBar extends Component {
  render() {
    const { pay_price, freight, buttomActive, goods } = this.props
    return (
      <SubmitBottomBarStyle>
        {
          goods.goodsinfo.is_experience !== '2' ?
            <footer className='submit-footer'>
              <button className='submit-freight'>
                运费： <span>￥{freight ? freight : '0.00'}</span>
              </button>
              <button className='submit-button' onClick={this.goPay} style={{ backgroundColor: buttomActive ? 'var(--theme-font-color)' : '#ccc' }} >
                提交订单
              </button>
              <button className='submit-total-price'>
                总价：<span>￥{pay_price}</span>
              </button>
            </footer>
            :
            <footer className='submit-footer'>
              <button className='s-exchange' onClick={this.exchange} style={{ backgroundColor: buttomActive ? 'var(--theme-font-color)' : '#ccc' }} >
                立即兑换
              </button>
            </footer>
        }
      </SubmitBottomBarStyle>
    )
  }

  /**
   * 
   * time: 2020-12-23
   * content: 立即兑换按钮对接
   * author: lkd
   * 
   * */

  componentDidMount() {
    // 获取验证是否相等
    EventBus.addListener('through', this.verificationCode)
  }

  componentWillUnmount() {
    EventBus.removeListener('through', this.verificationCode)
  }

  verificationCode = (cartNumber, cartPassword) => {
    const { way, shsmState, data, yhtime, self_time, canBuy, leftIndex, rightIndex } = this.props
    const { appConfig } = store.getState()
    console.log(this.props.addressId)
    let reg = /^[1]([3-9])[0-9]{9}$/
    if (way === '快递') {
      if (!this.props.addressId) {
        Toast.fail('请选择地址', 1)
      } else {
        let kuaidi_beizhu = document.querySelector('.kuaidi-beizhu').value
        const api_config = {
          action: 'createCardOrder',
          data: {
            uniacid: appConfig.uniacid,
            openid: appConfig.wxUserInfo.openid,
            type: '快递',
            tid: this.props.goods.dispatch_list[this.props.kuaidiIndex].id,
            address_id: this.props.addressId,
            gid: this.props.goods.goodsinfo.id,
            gnum: 1,
            remark: kuaidi_beizhu,
            template_no: cartNumber,
            template_code: cartPassword
          }
        }
        _submitApi(api_config).then(res => {
          if (res.data.status === 200) {
            dropByCacheKey('SubmitComponent')
            this.props.history.replace(`/paysuccess/${res.data.data.orderno}`)
          } else if (res.data.status === 400) {
            Toast.info(res.data.msg, 1)
          } else {
            Toast.info('未知错误', 1)
          }
        })
      }
    } else if (way === '自提') {
      let username = document.querySelector('.submit-username').name
      let tel = document.querySelector('.submit-usertel').name
      let userValue = document.querySelector('.submit-username').value
      let telValue = document.querySelector('.submit-usertel').value
      if (userValue === '' && username === '') {
        Toast.fail('请输入收货人名字', 1)
      } else if (!(reg.test(telValue)) && !(reg.test(tel))) {
        Toast.fail('手机号码错误', 1)
      } else {
        let ziti_beizhu = document.querySelector('.ziti-beizhu').value
        const { submitTuan } = store.getState()
        if (!submitTuan) {
          Toast.fail('请选择门店', 1)
          return
        }
        // 自提开启自提时间
        if (self_time.is_self_time === '1') {
          if (canBuy) {
            const api_config = {
              action: 'createCardOrder',
              data: {
                uniacid: appConfig.uniacid,
                openid: appConfig.wxUserInfo.openid,
                type: '自提',
                gid: this.props.goods.goodsinfo.id,
                store_id: submitTuan.id,
                zitiname: userValue ? userValue : username,
                tel: telValue ? telValue : tel,
                remark: ziti_beizhu,
                self_time: self_time.is_self_time === '1' ? yhtime : 0,
                self_time_limit: self_time.is_self_time === '1' ? self_time.self_time_start + "~" + self_time.self_time_end : 0,
                template_no: cartNumber,
                template_code: cartPassword
              }
            }
            _submitApi(api_config).then(res => {
              if (res.data.status === 200) {
                dropByCacheKey('SubmitComponent')
                this.props.history.replace(`/paysuccess/${res.data.data.orderno}`)
              } else if (res.data.status === 400) {
                Toast.info(res.data.msg, 1)
              } else {
                Toast.info('未知错误', 1)
              }
            })
          } else {
            Toast.fail('自提时间不正确', 1)
          }
        } else {
          // 自提没有开启自提时间
          const api_config = {
            action: 'createCardOrder',
            data: {
              uniacid: appConfig.uniacid,
              openid: appConfig.wxUserInfo.openid,
              type: '自提',
              store_id: submitTuan.id,
              gid: this.props.goods.goodsinfo.id,
              zitiname: userValue ? userValue : username,
              tel: telValue ? telValue : tel,
              remark: ziti_beizhu,
              template_no: cartNumber,
              template_code: cartPassword
            }
          }
          _submitApi(api_config).then(res => {
            if (res.data.status === 200) {
              dropByCacheKey('SubmitComponent')
              this.props.history.replace(`/paysuccess/${res.data.data.orderno}`)
            } else if (res.data.status === 400) {
              Toast.info(res.data.msg, 1)
            } else {
              Toast.info('未知错误', 1)
            }
          })
        }
      }
    } else if (way === '送货上门') {
      let shsm_beizhu = document.querySelector('.shsm-beizhu').value
      if (!this.props.addressId) {
        Toast.fail('请选择地址', 1)
        return
      }
      // if()
      const api_config = {
        action: 'createCardOrder',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          type: '送货上门',
          gid: this.props.goods.goodsinfo.id,
          address_id: this.props.addressId,
          remark: shsm_beizhu,
          template_no: cartNumber,
          template_code: cartPassword
        }
      }
      if (data.delivery_time) {
        if (data.delivery_time[leftIndex].time[rightIndex[leftIndex]]) {
          api_config.data.deliverdate = data.delivery_time[leftIndex].name
          api_config.data.deliverytime = data.delivery_time[leftIndex].time[rightIndex[leftIndex]].name
          _submitApi(api_config).then(res => {
            if (res.data.status === 200) {
              dropByCacheKey('SubmitComponent')
              this.props.history.replace(`/paysuccess/${res.data.data.orderno}`)
            } else if (res.data.status === 400) {
              Toast.info(res.data.msg, 1)
            } else {
              Toast.info('未知错误', 1)
            }
          })
        } else {
          Toast.fail('送达时间不正确', 1)
        }
      } else {
        _submitApi(api_config).then(res => {
          if (res.data.status === 200) {
            dropByCacheKey('SubmitComponent')
            this.props.history.replace(`/paysuccess/${res.data.data.orderno}`)
          } else if (res.data.status === 400) {
            Toast.info(res.data.msg, 1)
          } else {
            Toast.info('未知错误', 1)
          }
        })
      }

    }
  }




  exchange = () => {
    const { buttomActive } = this.props
    if (buttomActive) {
      EventBus.emit('obtain')
    }

  }

  goPay = () => {
    const { type, way, cartids, buttomActive, data, yhtime, self_time, canBuy, leftIndex, rightIndex, shsmState } = this.props
    const { uniacid, wxUserInfo } = store.getState().appConfig
    const openid = wxUserInfo.openid
    let reg = /^[1]([3-9])[0-9]{9}$/
    if (way === '快递') {
      // 没有选择地址
      if (!this.props.addressId) {
        Toast.fail('请选择地址', 1)
      } else {
        let kuaidi_beizhu = document.querySelector('.kuaidi-beizhu').value
        if (type !== '1') { // 不是购物车结算
          const config = {
            action: 'order_confirm',
            data: {
              uniacid,
              openid,
              type: '快递',
              tid: this.props.goods.dispatch_list[this.props.kuaidiIndex].id,
              address_id: this.props.addressId,
              gid: this.props.goods.goodsinfo.id,
              gnum: this.props.goods.goodsinfo.num,
              optionid: this.props.optionId,
              couponid: this.props.couponId,
              buytype: this.props.buytype,
              tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
              remark: kuaidi_beizhu,
              // self_time: yhtime ,
              // self_time_limit: self_time.self_time_start + "~" + self_time.self_time_end
            }
          }
          _submitApi(config).then(res => {
            if (parseInt(res.data.status) === 200) {
              dropByCacheKey('SubmitComponent')
              this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
            } else if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 2)
            }
          })
        } else if (type === '1') { // 购物车结算
          const config = {
            // 创建订单
            action: 'order_confirm',
            data: {
              uniacid,
              openid,
              type: '快递',
              tid: this.props.goods.dispatch_list[this.props.kuaidiIndex].id,
              cartids,
              couponid: this.props.couponId,
              address_id: this.props.addressId,
              buytype: this.props.buytype,
              tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
              remark: kuaidi_beizhu,
              // self_time: yhtime,
              // self_time_limit: self_time.self_time_start + "~" + self_time.self_time_end
            }
          }
          _submitApi(config).then(res => {
            if (parseInt(res.data.status) === 200) {
              dropByCacheKey('SubmitComponent')
              this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
            } else if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 2)
            }
          })
        }
      }
    } else if (way === '自提') {
      let username = document.querySelector('.submit-username').name
      let tel = document.querySelector('.submit-usertel').name

      let userValue = document.querySelector('.submit-username').value
      let telValue = document.querySelector('.submit-usertel').value

      if (userValue === '' && username === '') {
        Toast.fail('请输入收货人名字', 1)
      } else if (!(reg.test(telValue)) && !(reg.test(tel))) {
        Toast.fail('手机号码错误', 1)
      } else {
        let ziti_beizhu = document.querySelector('.ziti-beizhu').value
        // 0 单买 1 拼团
        if (data.goodsinfo.selltype === '0' || data.goodsinfo.selltype === '1' || data.goodsinfo.selltype === '4' || data.goodsinfo.selltype === '6' || data.goodsinfo.selltype === '7') {
          if (data.goodsinfo.selltype === '1' || data.goodsinfo.selltype === '4' || data.goodsinfo.selltype === '6' || data.goodsinfo.selltype === '7') {
            const { submitTuan } = store.getState()
            if (!submitTuan.id) {
              Toast.fail('请选择门店', 1)
            } else {
              // 拼团 有自提时间
              if (self_time.is_self_time === '1') {
                if (canBuy) {
                  const config = {
                    action: 'order_confirm',
                    data: {
                      uniacid,
                      openid,
                      type: '自提',
                      gid: this.props.goods.goodsinfo.id,
                      gnum: this.props.goods.goodsinfo.num,
                      optionid: this.props.optionId,
                      couponid: this.props.couponId,
                      buytype: this.props.buytype,
                      store_id: submitTuan.id,
                      zitiname: userValue ? userValue : username,
                      tel: telValue ? telValue : tel,
                      tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
                      remark: ziti_beizhu,
                      self_time: self_time.is_self_time === '1' ? yhtime : 0,
                      self_time_limit: self_time.is_self_time === '1' ? self_time.self_time_start + "~" + self_time.self_time_end : 0
                    }
                  }
                  _submitApi(config).then(res => {
                    // if(res.data.status === '')
                    if (parseInt(res.data.status) === 400) {
                      Toast.fail(res.data.msg, 1)
                    } else if (parseInt(res.data.status) === 200) {
                      dropByCacheKey('SubmitComponent')
                      this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
                    }
                  })
                } else {
                  Toast.fail('自提时间不正确', 1)
                }
              } else {
                // 拼团没有开启自提时间
                const config = {
                  action: 'order_confirm',
                  data: {
                    uniacid,
                    openid,
                    type: '自提',
                    gid: this.props.goods.goodsinfo.id,
                    gnum: this.props.goods.goodsinfo.num,
                    optionid: this.props.optionId,
                    couponid: this.props.couponId,
                    buytype: this.props.buytype,
                    store_id: submitTuan.id,
                    zitiname: userValue ? userValue : username,
                    tel: telValue ? telValue : tel,
                    tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
                    remark: ziti_beizhu,
                  }
                }
                _submitApi(config).then(res => {
                  if (parseInt(res.data.status) === 400) {
                    Toast.fail(res.data.msg, 2)
                  } else if (parseInt(res.data.status) === 200) {
                    console.log(res)
                    dropByCacheKey('SubmitComponent')
                    this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
                  }
                })
              }

            }
          } else if (data.goodsinfo.selltype === '0') {
            const { submitDan } = store.getState()
            if (!submitDan.id) {
              Toast.fail('请选择门店', 1)
            } else {
              if (self_time.is_self_time === '1') {
                if (canBuy) {
                  const config = {
                    action: 'order_confirm',
                    data: {
                      uniacid,
                      openid,
                      type: '自提',
                      gid: this.props.goods.goodsinfo.id,
                      gnum: this.props.goods.goodsinfo.num,
                      optionid: this.props.optionId,
                      couponid: this.props.couponId,
                      store_id: submitDan.id,
                      buytype: this.props.buytype,
                      zitiname: userValue ? userValue : username,
                      tel: telValue ? telValue : tel,
                      tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
                      remark: ziti_beizhu,
                      self_time: self_time.is_self_time === '1' ? yhtime : 0,
                      self_time_limit: self_time.is_self_time === '1' ? self_time.self_time_start + "~" + self_time.self_time_end : 0
                    }
                  }
                  _submitApi(config).then(res => {
                    if (parseInt(res.data.status) === 400) {
                      Toast.fail(res.data.msg, 2)
                    } else if (parseInt(res.data.status) === 200)
                      dropByCacheKey('SubmitComponent')
                    this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
                  })
                } else {
                  Toast.fail('自提时间不正确', 1)
                }
              } else {
                // 单买没有自提时间
                const config = {
                  action: 'order_confirm',
                  data: {
                    uniacid,
                    openid,
                    type: '自提',
                    gid: this.props.goods.goodsinfo.id,
                    gnum: this.props.goods.goodsinfo.num,
                    optionid: this.props.optionId,
                    couponid: this.props.couponId,
                    store_id: submitDan.id,
                    buytype: this.props.buytype,
                    zitiname: userValue ? userValue : username,
                    tel: telValue ? telValue : tel,
                    tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
                    remark: ziti_beizhu
                  }
                }
                _submitApi(config).then(res => {
                  if (parseInt(res.data.status) === 400) {
                    Toast.fail(res.data.msg, 2)
                  } else if (parseInt(res.data.status) === 200)
                    dropByCacheKey('SubmitComponent')
                  this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
                })
              }

            }
          }
        } else if (type === '1') {
          // 购物车购买
          const { submitDan } = store.getState()
          if (!submitDan.id) {
            Toast.fail('请选择门店', 1)
          } else {
            if (self_time.is_self_time === '1') {
              // 购物车购买
              if (canBuy) {
                const config = {
                  action: 'order_confirm',
                  data: {
                    uniacid,
                    openid,
                    type: '自提',
                    cartids,
                    couponid: this.props.couponId,
                    buytype: this.props.buytype,
                    zitiname: userValue ? userValue : username,
                    tel: telValue ? telValue : tel,
                    store_id: submitDan.id,
                    tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
                    remark: ziti_beizhu,
                    self_time: self_time.is_self_time === '1' ? yhtime : 0,
                    self_time_limit: self_time.is_self_time === '1' ? self_time.self_time_start + "~" + self_time.self_time_end : 0
                  }
                }
                _submitApi(config).then(res => {
                  if (parseInt(res.data.status) === 400) {
                    Toast.fail(res.data.msg, 2)
                  } else if (parseInt(res.data.status) === 200) {
                    dropByCacheKey('SubmitComponent')
                    this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
                  }
                })
              } else {
                Toast.fail('自提时间不正确', 1)
              }
            } else {
              const config = {
                action: 'order_confirm',
                data: {
                  uniacid,
                  openid,
                  type: '自提',
                  cartids,
                  couponid: this.props.couponId,
                  buytype: this.props.buytype,
                  zitiname: userValue ? userValue : username,
                  tel: telValue ? telValue : tel,
                  store_id: submitDan.id,
                  tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
                  remark: ziti_beizhu,
                }
              }
              _submitApi(config).then(res => {
                if (parseInt(res.data.status) === 400) {
                  Toast.fail(res.data.msg, 2)
                } else if (parseInt(res.data.status) === 200) {
                  dropByCacheKey('SubmitComponent')
                  this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
                }
              })
            }
          }
        }
      }
    } else if (way === '送货上门') {
      let shsm_beizhu = document.querySelector('.shsm-beizhu').value
      if (!this.props.addressId) {
        Toast.fail('请选择地址', 1)
        return
      }

      if (!shsmState && data.is_areadelivery === '1') {
        return
      }
      // 拼团的送货上门
      if ((data.goodsinfo.selltype === '1' || data.goodsinfo.selltype === '4' || data.goodsinfo.selltype === '6' || data.goodsinfo.selltype === '7') && buttomActive) {
        const config = {
          action: 'order_confirm',
          data: {
            uniacid,
            openid,
            type: '送货上门',
            gid: this.props.goods.goodsinfo.id,
            couponid: this.props.couponId,
            address_id: this.props.addressId,
            gnum: this.props.goods.goodsinfo.num,
            buytype: this.props.buytype,
            optionid: this.props.optionId,
            tuan_id: this.props.tuan_id === '0' ? '0' : this.props.tuan_id,
            freight_area_fee: this.props.freight,
            remark: shsm_beizhu,
            // self_time: yhtime,
            // self_time_limit: self_time.self_time_start + "~" + self_time.self_time_end
          }
        }
        if (data.delivery_time) {
          if (data.delivery_time[leftIndex].time[rightIndex[leftIndex]]) {
            config.data.deliverdate = data.delivery_time[leftIndex].name
            config.data.deliverytime = data.delivery_time[leftIndex].time[rightIndex[leftIndex]].name
            _submitApi(config).then(res => {
              if (parseInt(res.data.status) === 400) {
                Toast.fail(res.data.msg, 1)
              } else if (parseInt(res.data.status) === 200)
                dropByCacheKey('SubmitComponent')
              this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
            })
          } else {
            Toast.fail('送达时间不正确', 1)
          }
        } else {
          _submitApi(config).then(res => {
            if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 1)
            } else if (parseInt(res.data.status) === 200)
              dropByCacheKey('SubmitComponent')
            this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
          })
        }

      } else if (data.goodsinfo.selltype === '0' && buttomActive) {
        // 单买的送货上门
        const config = {
          action: 'order_confirm',
          data: {
            uniacid,
            openid,
            type: '送货上门',
            gid: this.props.goods.goodsinfo.id,
            couponid: this.props.couponId,
            address_id: this.props.addressId,
            gnum: this.props.goods.goodsinfo.num,
            buytype: this.props.buytype,
            optionid: this.props.optionId,
            freight_area_fee: this.props.freight,
            remark: shsm_beizhu,
            // self_time: yhtime,
            // self_time_limit: self_time.self_time_start + "~" + self_time.self_time_end
          }
        }
        if (data.delivery_time) {
          if (data.delivery_time[leftIndex].time[rightIndex[leftIndex]]) {
            config.data.deliverdate = data.delivery_time[leftIndex].name
            config.data.deliverytime = data.delivery_time[leftIndex].time[rightIndex[leftIndex]].name
            _submitApi(config).then(res => {
              if (parseInt(res.data.status) === 400) {
                Toast.fail(res.data.msg, 2)
              } else if (parseInt(res.data.status) === 200)
                dropByCacheKey('SubmitComponent')
              this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
            })
          } else {
            Toast.fail('送达时间不正确', 1)
          }
        } else {
          _submitApi(config).then(res => {
            if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 2)
            } else if (parseInt(res.data.status) === 200)
              dropByCacheKey('SubmitComponent')
            this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
          })
        }

      } else if (type === '1' && buttomActive) {
        // 购物车送货上门
        const config = {
          action: 'order_confirm',
          data: {
            uniacid,
            openid,
            type: '送货上门',
            cartids,
            address_id: this.props.addressId,
            couponid: this.props.couponId,
            buytype: this.props.buytype,
            freight_area_fee: this.props.freight,
            remark: shsm_beizhu,
          }
        }
        if (data.delivery_time) {
          if (data.delivery_time[leftIndex].time[rightIndex[leftIndex]]) {
            config.data.deliverdate = data.delivery_time[leftIndex].name
            config.data.deliverytime = data.delivery_time[leftIndex].time[rightIndex[leftIndex]].name
            _submitApi(config).then(res => {
              if (parseInt(res.data.status) === 400) {
                Toast.fail(res.data.msg, 2)
              } else if (parseInt(res.data.status) === 200) {
                dropByCacheKey('SubmitComponent')
                this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
              }
            })
          } else {
            Toast.fail('送达时间不正确', 1)
          }
        } else {
          _submitApi(config).then(res => {
            if (parseInt(res.data.status) === 400) {
              Toast.fail(res.data.msg, 2)
            } else if (parseInt(res.data.status) === 200) {
              dropByCacheKey('SubmitComponent')
              this.props.history.replace(`/pay/${this.props.buytype}/${res.data.data.orderno}/${res.data.data.orderid}`)
            }
          })
        }
      }

    }
  }

}

const SubmitBottomBarStyle = styled.div`

.submit-footer {
  position: absolute;
  bottom: env(safe-area-inset-bottom);
  left: 0;
  padding-left: .32rem;
  width: 100%;
  height: 1.28rem;
  background: var(--tab-color);
}

.submit-freight {
  display: flex;
  float: left;
  align-items: center;
  height: 100%;
  font-size: .3rem;
  letter-spacing: .02rem;
  color: var(--font-color);
  border: none;
  background: transparent;
}

.submit-freight span {
  font-size: .4rem;
}

.submit-button,
.s-exchange {
  float: right;
  width: 2.97rem;
  height: 100%;
  font-size: .4rem;
  letter-spacing: .02rem;
  color: #fff;
  border: none;
  background-color: var(--theme-font-color);
}

.submit-total-price {
  float: right;
  padding-right: .4rem;
  height: 100%;
  border: none;
  letter-spacing: .02rem;
  color: var(--font-color);
  font-size: .3rem;
  background: var(--tab-color) !important;
}

.submit-total-price span {
  font-size: .4rem;
}

`

export default withRouter(SubmitBottomBar);