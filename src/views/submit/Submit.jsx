import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { dropByCacheKey } from 'react-router-cache-route'
import EventBus from 'commons/event'


import SubmitGoods from './childCom/SubmitGoods'
import SubmitInfo from './childCom/SubmitInfo'
import SubmitBottomBar from './childCom/SubmitBottomBar'
import SubmitDrawer from './childCom/SubmitDrawer'
import SubmitGuide from './childCom/SubmitGuide'
import SubmitExchange from './childCom/SubmitExchange'

import BetterScroll from 'common/betterScroll/BetterScroll'
import Subscribe from 'content/subscribe/Subscribe'
// import AMap from 'react-amap'

import { store } from 'store/index'
import { Coupon, saveDefaultAddress } from 'store/actionCreators'
import { saveSubmitStoreDan, saveSubmitStoreTuan } from "store/actionCreators";

import axios from 'axios'
import { _submitApi } from 'network/submit'
import { _showAddress } from 'network/profile'
import { _setPVUV } from 'network/api'

import './style/submit.css'

class Submit extends Component {
  constructor(props) {
    super(props)
    props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.state = {
      text: '',//自提说明
      self_time: '',//自提时间
      data: '',
      cartids: '', // 购物车id
      pay_price: '',  // 总价格
      freight: '',   // 运费
      type: this.props.match.params.type,   // type：0 立即购买
      hide: false,     // 送货上门送达时间
      way: '',        // 配送方式 快递 自提 送货上门
      wayIndex: 0,    // 管理默认配送选中
      time: '',      // 默认时间
      kuaidiIndex: 0,  // 快递默认选中第一个  
      buytype: this.props.match.params.buytype, // buytype: 1 单买 2 拼团
      optionId: this.props.match.params.options, // 规格id
      addressId: store.getState().defaultAddress.id, // 地址id
      couponId: store.getState().defaultcoupon.id, // 地址id
      buttomActive: true,  // 按钮激活
      userName: '', // 用户名字
      tel: '',  // 电话号码
      tuan_id: this.props.match.params.tuan_id, // 团id
      shsmArr: [],
      leftIndex: 0, // 送达时间左侧
      rightIndex: '', // 送达时间右侧
      delivery_time: [],
      canBuy: false,   // 自提时间是否正确
      submitDanId: store.getState().submitDan.id ? store.getState().submitDan.id : undefined,
      submitTuanId: store.getState().submitTuan.id ? store.getState().submitTuan.id : undefined,
      height: 'calc((100vh) - env(safe-area-inset-bottom))'
    }
    this.count = 0
    // 确保高德计算完毕
    this.shsmState = false

    // 切换调用高德
    this.gaodeMap = () => {
      console.log('调用高德地图了')
      console.log(window.AMap)
      return new Promise(resolve => {
        const { defaultAddress } = store.getState()
        const { data } = this.state
        let address = defaultAddress.province + defaultAddress.city + defaultAddress.county + defaultAddress.detailed_address
        let that = this, deliveryPosition
        window.AMap.plugin(['AMap.Geocoder', 'AMap.Polygon', 'AMap.LngLat', 'AMap.Circle'], function () {
          // console.log(new window.AMap.ToolBar())
          // console.log(new window.AMap.Autocomplete())
          console.log(window.AMap)
          //异步同时加载多个插件
          let geocoder = new window.AMap.Geocoder({})
          geocoder.getLocation(address, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              // result中对应详细地理坐标信息
              // lng 精度 lat 纬度 
              if (defaultAddress.latitude) {
                deliveryPosition = [
                  defaultAddress.longitude,
                  defaultAddress.latitude
                ]
              } else {
                deliveryPosition = [
                  result.geocodes[0].location.lng,
                  result.geocodes[0].location.lat
                ]
              }
              const config = {
                action: 'area_delivery',
                data: {
                  uniacid: store.getState().appConfig.uniacid,
                }
              }
              _submitApi(config).then(res => {
                let check_address
                for (let i = 0; i < res.data.data.length; i++) {
                  // let polygon = new window.AMap.Polygon({
                  //   path: res.data.data[i].range
                  // })
                  let path = res.data.data[i].range
                  // 返回false 不在区域配送范围内 
                  check_address = window.AMap.GeometryUtil.isPointInRing(deliveryPosition, path)
                  if (check_address) {
                    that.count += 1
                    let deliveryLngLat = new window.AMap.LngLat(deliveryPosition[0], deliveryPosition[1])
                    let distance = deliveryLngLat.distance(res.data.data[i].store_position)
                    for (let k = 0, leng = res.data.data[i].distance.length; k < leng; k++) {
                      let pricestage = res.data.data[i].distance[k]
                      // pricestage
                      let deliver_charge = 0
                      // 开始
                      let start = Number(pricestage.start) * 1000               //公里转换成米
                      // 结束
                      let end = Number(pricestage.end) * 1000
                      // distance 用户距离商家的米数
                      if (Number(distance) >= start && Number(distance) <= end) {
                        if (data.price < Number(res.data.data[i].distance[k].start_price)) {
                          const action = Coupon('')
                          store.dispatch(action)
                          that.count += 1
                          that.shsmState = true
                          that.setState({
                            buttomActive: false,
                            freight: 0.00,
                            pay_price: data.price,
                            couponId: undefined
                          }, () => {
                            Toast.info('商品总价需要' + res.data.data[i].distance[k].start_price + '元, 支持配送', 2)
                            resolve()
                          })
                          break
                        } else {
                          for (let m = 0, leng = pricestage.order.length; m < leng; m++) {
                            if (data.price <= Number(pricestage.order[m])) {
                              deliver_charge = pricestage.order_price[m]
                              that.shsm_config.data.freight = deliver_charge
                              // 判断是否有优惠券
                              if (store.getState().defaultcoupon.id) {
                                // 当优惠券金额大于支付金额时
                                if ((Number(store.getState().defaultcoupon.cash) * 100 - (Number(data.price) + Number(deliver_charge)) * 100) >= 0) {
                                  const action = Coupon('')
                                  store.dispatch(action)
                                  that.shsmState = true
                                  that.setState({
                                    freight: Number(deliver_charge).toFixed(2),
                                    pay_price: Number(Number(deliver_charge).toFixed(2)) + Number(data.price),
                                    buttomActive: true,
                                    couponId: undefined,
                                  }, () => {
                                    resolve()
                                  })
                                } else {
                                  that.shsmState = true
                                  that.setState({
                                    freight: Number(deliver_charge).toFixed(2),
                                    pay_price: ((Number(data.price) + Number(deliver_charge)) * 100 - Number(store.getState().defaultcoupon.cash) * 100) / 100,
                                    buttomActive: true,
                                  }, () => {
                                    resolve()
                                  })
                                }
                              } else {
                                that.shsmState = true
                                that.setState({
                                  freight: Number(deliver_charge).toFixed(2),
                                  pay_price: Number(Number(deliver_charge).toFixed(2)) + Number(data.price),
                                  buttomActive: true,
                                }, () => {
                                  resolve()
                                })
                              }
                              break
                            } else {
                              if (data.price > Number(pricestage.order[pricestage.order.length - 1])) {
                                deliver_charge = pricestage.order_price[pricestage.order.length - 1]
                                that.shsm_config.data.freight = deliver_charge
                                if (store.getState().defaultcoupon.id) {
                                  if ((Number(store.getState().defaultcoupon.cash) * 100 - (Number(data.price) + Number(deliver_charge)) * 100) >= 0) {
                                    that.shsm_config.data.couponid = ''
                                    const action = Coupon('')
                                    store.dispatch(action)
                                    that.shsmState = true
                                    that.setState({
                                      freight: Number(deliver_charge).toFixed(2),
                                      pay_price: Number(Number(deliver_charge).toFixed(2)) + Number(data.price),
                                      buttomActive: true,
                                      couponId: undefined,
                                    }, () => {
                                      resolve()
                                    })
                                  } else {
                                    that.shsmState = true
                                    that.setState({
                                      freight: Number(deliver_charge).toFixed(2),
                                      pay_price: (Number(Number(deliver_charge).toFixed(2)) + Number(data.price) * 100 - Number(store.getState().defaultcoupon.cash) * 100) / 100,
                                      buttomActive: true,
                                    }, () => {
                                      resolve()
                                    })
                                  }
                                } else {
                                  that.shsmState = true
                                  that.setState({
                                    freight: Number(deliver_charge).toFixed(2),
                                    pay_price: Number(Number(deliver_charge).toFixed(2)) + Number(data.price),
                                    buttomActive: true
                                  }, () => {
                                    resolve()
                                  })
                                }
                                break
                              }
                            }
                          }
                        }
                      }
                    }
                    resolve()
                    break
                  }
                }
                if (that.count < 1) {
                  // that.shsmState = true
                  that.setState({
                    buttomActive: false,
                  }, () => {
                    Toast.info('不在区域配送范围', 2)
                  })
                }
              })
            }
          })
        })
      })
    }
  }

  hildren(xuan) {
    // 当前时间
    let date1 = new Date(xuan.replace(/-/g, '/')).getTime() / 1000
    // 开始时间
    let date2 = new Date(this.state.self_time.self_time_start.replace(/-/g, '/')).getTime() / 1000
    // 结束时间
    let date3 = new Date(this.state.self_time.self_time_end.replace(/-/g, '/')).getTime() / 1000

    if (date2 <= date1 && date1 <= date3) {
      this.setState({
        yhtime: xuan,
        canBuy: true
      })
    } else {
      Toast.info('自提时间不正确', 1)
      this.setState({
        yhtime: xuan,
        canBuy: false
      })
    }
  }





  hideDarwer = () => {
    this.setState({
      hide: !this.state.hide
    })
  }

  // 切换左侧的索引
  changeLeft = (index) => {
    const { leftIndex } = this.state
    this.setState({
      leftIndex: index
    })
  }

  // 切换右侧的索引


  // index左侧  value右侧值
  changeRight = (index, value) => {
    let { leftIndex, rightIndex, delivery_time } = this.state
    if (delivery_time[leftIndex].time[value].isshow === 1) {
      rightIndex[index] = value
      this.setState({
        rightIndex
      })
    }
  }


  // 切换配送方式修改价格
  changeWayActive = async (wayIndex, wayType) => {
    const { is_experience } = this.state.data.goodsinfo
    console.log(this.props)
    if (is_experience !== '2') {
      this.setState({
        wayIndex: wayIndex,
        way: wayType
      }, async () => {
        const { data } = this.state
        // 切换到快递 
        if (data.deliverytype[this.state.wayIndex].type === '快递') {
          // if (type !== '1') {
          this.kuaidi_config.data.address_id = store.getState().defaultAddress.id ? store.getState().defaultAddress.id : ''
          this.kuaidi_config.data.couponid = store.getState().defaultcoupon ? store.getState().defaultcoupon.id : ''
          this.kuaidi_config.data.tid = data.dispatch_list[this.state.kuaidiIndex].id
          this.isHasOptoon(data, this.kuaidi_config)
        } else if (data.deliverytype[this.state.wayIndex].type === '自提') {
          this.ziti_config.data.couponid = store.getState().defaultcoupon ? store.getState().defaultcoupon.id : '' // 优惠券id
          if (this.props.match.params.type === '0' || this.props.match.params.type === '1') {
            this.ziti_config.data.store_id = store.getState().submitDan.id
            this.isHasOptoon(data, this.ziti_config)
          } else if (this.props.match.params.type === '2') {
            this.ziti_config.data.store_id = store.getState().submitTuan.id
            this.isHasOptoon(data, this.ziti_config)
          }
        } else if (data.deliverytype[this.state.wayIndex].type === '送货上门') {
          this.shsmState = false
          this.shsm_config.data.address_id = store.getState().defaultAddress.id ? store.getState().defaultAddress.id : ''
          this.shsm_config.data.couponid = store.getState().defaultcoupon ? store.getState().defaultcoupon.id : ''
          if (data.is_areadelivery === '1') {
            const { addressId } = this.state
            // 调用高德api修改价格
            if (addressId) {
              this.gaodeMap().then(res => {
                this.shsm_config.data.freight_area_fee = this.state.freight
              })
            } else {
              this.shsmState = true
              const action = Coupon('')
              store.dispatch(action)
              this.setState({
                pay_price: this.price,
                freight: 0.00,
                couponId: undefined
              })
            }
          } else {
            this.isHasOptoon(data, this.shsm_config)
          }
        }
      })
    } else {
      this.setState({
        wayIndex: wayIndex,
        way: wayType
      }, () => {
        const { data } = this.state
        if (data.deliverytype[this.state.wayIndex].type === '送货上门') {
          this.shsmState = false
          if (data.is_areadelivery === '1') {
            const { addressId } = this.state
            // 调用高德api修改价格
            if (addressId) {
              this.gaodeMap().then(res => {
                this.shsm_config.data.freight_area_fee = this.state.freight
              })
            } else {
              this.shsmState = true
              const action = Coupon('')
              store.dispatch(action)
              this.setState({
                pay_price: this.price,
                freight: 0.00,
                couponId: undefined
              })
            }
          } else {
            this.isHasOptoon(data, this.shsm_config)
          }
        }
        this.refresh()
      })
    }


  }


  // getaddress = (device, _this) => {

  // }

  // 判断商品是否有无规格
  isHasOptoon = async (data, changePrice_config) => {
    const { optionId, cartids } = this.state
    if (data.goodsinfo.hasoption === '1') { // 有规格
      changePrice_config.data.optionid = optionId
      const result = await _submitApi(changePrice_config)
      if (parseInt(result.data.status) === 200) {
        data.nocouponprice = result.data.data.nocouponprice
        this.setState({
          pay_price: result.data.data.pay_price,
          freight: result.data.data.freight,
          buttomActive: true,
          data
        }, () => {
          this.refresh()
        })
      } else if (parseInt(result.data.status) === 400) {
        this.setState({
          buttomActive: false,
          pay_price: result.data.data,
          freight: '0.00'
        })
        Toast.info(result.data.msg, 2)
      } else if (parseInt(result.data.status) === 10001) {
        const action = Coupon('')
        store.dispatch(action)
        data.nocouponprice = result.data.data.nocouponprice
        Toast.fail(result.data.msg, 1)
        this.setState({
          pay_price: result.data.data.nocouponprice,
          freight: result.data.data.freight,
          couponId: '',
          data
        })
      }
    } else if (data.goodsinfo.hasoption === '0') { // 无规格
      const result = await _submitApi(changePrice_config)
      if (parseInt(result.data.status) === 200) {
        data.nocouponprice = result.data.data.nocouponprice
        this.setState({
          pay_price: result.data.data.pay_price,
          freight: result.data.data.freight,
          buttomActive: true,
          data
        }, () => {
          this.refresh()
        })
      } else if (parseInt(result.data.status) === 400) {
        this.setState({
          buttomActive: false,
          pay_price: result.data.data,
          freight: '0.00'
        })
        Toast.info(result.data.msg, 2)
      } else if (parseInt(result.data.status) === 10001) {
        const action = Coupon('')
        store.dispatch(action)
        data.nocouponprice = result.data.data.nocouponprice
        Toast.fail(result.data.msg, 1)
        this.setState({
          pay_price: result.data.data.nocouponprice,
          freight: result.data.data.freight,
          couponId: '',
          data
        })
      }
    } else if (cartids.length !== 0) {
      // 购物车购买
      const result = await _submitApi(changePrice_config)
      if (parseInt(result.data.status) === 200) {
        data.nocouponprice = result.data.data.nocouponprice
        this.setState({
          pay_price: result.data.data.pay_price,
          freight: result.data.data.freight,
          buttomActive: true,
          data
        }, () => {
          this.refresh()
        })
      } else if (parseInt(result.data.status) === 400) {
        this.setState({
          buttomActive: false,
          pay_price: result.data.data,
          freight: '0.00'
        })
        Toast.info(result.data.msg, 2)
      } else if (parseInt(result.data.status) === 10001) {
        const action = Coupon('')
        store.dispatch(action)
        data.nocouponprice = result.data.data.nocouponprice
        Toast.fail(result.data.msg, 1)
        this.setState({
          pay_price: result.data.data.nocouponprice,
          freight: result.data.data.freight,
          couponId: '',
          data
        })
      }
    }
  }

  // 切换快递方式修改价格
  changeKuaiDiIndex = index => {
    const { goodsinfo } = this.state.data
    // is_experience 2 提货卡
    if (goodsinfo.is_experience !== '2') {
      this.setState({
        kuaidiIndex: index
      }, () => {
        const { data, type } = this.state
        const { defaultAddress, defaultcoupon } = store.getState()
        if (type !== '1') {
          // 单买 拼团方式
          this.kuaidi_config.data.address_id = defaultAddress.id ? defaultAddress.id : ''
          this.kuaidi_config.data.couponid = defaultcoupon.id ? defaultcoupon.id : ''
          this.kuaidi_config.data.tid = data.dispatch_list[this.state.kuaidiIndex].id
          this.isHasOptoon(data, this.kuaidi_config)
        } else if (type === '1') {
          // 购物车修改
          this.kuaidi_config.data.address_id = defaultAddress.id ? defaultAddress.id : ''
          this.kuaidi_config.data.couponid = defaultcoupon.id ? defaultcoupon.id : ''
          this.kuaidi_config.data.tid = data.dispatch_list[this.state.kuaidiIndex].id
          this.isHasOptoon(data, this.kuaidi_config)
        }
      })
    } else {
      this.setState({ kuaidiIndex: index })
    }

  }

  refresh = () => {
    if (this?.refs?.scroll) {
      this.refs.scroll.BScroll.refresh()
    }
  }


  render() {

    document.title = "提交订单";

    const { data, type, hide, way, wayIndex, kuaidiIndex, buytype, text,
      self_time, leftIndex, rightIndex, delivery_time, freight, height } = this.state

    const scollConfig = {
      probeType: 1
    }

    const scrollStyle = {
      padding: '0 .32rem',
      height: 'calc((100vh - 1.28rem) - env(safe-area-inset-bottom))'
    }

    const { isApplet } = store.getState().appConfig

    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--tab-color)' }}>
        <SubmitGuide />
        <div className='submit' style={{ height }}>
          <BetterScroll config={scollConfig}
            style={scrollStyle} ref='scroll'>
            {data && < SubmitGoods
              goods={data.goodsinfo}
              buytype={buytype}
              type={type} />}
            {
              data && <SubmitInfo
                goods={data}
                hideDarwer={this.hideDarwer}
                changeWayActive={this.changeWayActive}
                way={way}
                wayIndex={wayIndex}
                kuaidiIndex={kuaidiIndex}
                changeKuaiDiIndex={this.changeKuaiDiIndex}
                buytype={buytype}
                text={text}
                self_time={self_time}
                type={type}
                leftIndex={leftIndex}
                freight={freight}
                rightIndex={rightIndex}
                delivery_time={delivery_time}
                time={this.hildren.bind(this)}
                hide={hide}
              >
              </SubmitInfo>
            }
            {data && data.goodsinfo.is_experience === '2' && <SubmitExchange description={data.description} refresh={this.refresh} />}
          </BetterScroll>
          {data && < SubmitBottomBar goods={data} {...this.state} shsmState={this.shsmState} />}
          {delivery_time.length !== 0 && <SubmitDrawer hide={hide}
            hideDarwer={this.hideDarwer}
            delivery_time={data.delivery_time}
            leftIndex={leftIndex}
            rightIndex={rightIndex}
            changeLeft={this.changeLeft}
            changeRight={this.changeRight} />}
        </div>
        {
          !isApplet && <Subscribe />
        }
      </div>
    );
  }

  // 组件从别的页面恢复
  componentDidRecover = () => {
    _setPVUV()
    const { addressId, couponId, data, wayIndex, submitDanId, submitTuanId } = this.state
    this.shsmState = false
    this.count = 0
    if (data.goodsinfo.is_experience !== '2') {
      if (store.getState().defaultAddress.id !== addressId) {
        if (data.deliverytype[wayIndex].type === '快递') {
          this.setState({
            addressId: store.getState().defaultAddress.id
          }, () => {
            this.kuaidi_config.data.address_id = this.state.addressId
            this.isHasOptoon(data, this.kuaidi_config)
          })
        } else if (data.deliverytype[wayIndex].type === '送货上门') {
          console.log('送货上门地址不同了')
          this.setState({
            addressId: store.getState().defaultAddress.id
          }, async () => {
            const { addressId } = this.state
            this.shsm_config.data.address_id = this.state.addressId
            if (data.is_areadelivery === '1') {
              // 调用高德api修改价格
              if (addressId) {
                this.gaodeMap().then(res => {
                  this.shsm_config.data.freight_area_fee = this.state.freight
                })
              } else {
                this.shsmState = true
                const action = Coupon('')
                store.dispatch(action)
                this.setState({
                  pay_price: this.price,
                  freight: 0.00,
                  couponId: undefined
                })
              }
            } else {
              this.isHasOptoon(data, this.shsm_config)
            }
          })

        }

      } else if (store.getState().defaultcoupon.id !== couponId) {
        console.log('优惠券不同')
        if (data.deliverytype[wayIndex].type === '快递') {
          this.setState({
            couponId: store.getState().defaultcoupon.id ? store.getState().defaultcoupon.id : 0
          }, () => {
            this.kuaidi_config.data.address_id = store.getState().defaultAddress.id
            this.kuaidi_config.data.couponid = this.state.couponId
            this.kuaidi_config.data.tid = data.dispatch_list[this.state.kuaidiIndex].id
            this.isHasOptoon(data, this.kuaidi_config)
          })
        } else if (data.deliverytype[wayIndex].type === '自提') {
          this.setState({
            couponId: store.getState().defaultcoupon.id ? store.getState().defaultcoupon.id : 0
          }, () => {
            this.ziti_config.data.couponid = this.state.couponId
            if (this.props.match.params.type === '0' || this.props.match.params.type === '1') {
              this.ziti_config.data.store_id = store.getState().submitDan.id
              this.isHasOptoon(data, this.ziti_config)
            } else if (this.props.match.params.type === '2') {
              this.ziti_config.data.store_id = store.getState().submitTuan.id
              this.isHasOptoon(data, this.ziti_config)
            }
          })
        } else if (data.deliverytype[wayIndex].type === '送货上门') {
          this.setState({
            couponId: store.getState().defaultcoupon.id ? store.getState().defaultcoupon.id : undefined
          }, async () => {
            const { addressId, couponId } = this.state
            this.shsm_config.data.couponid = couponId
            this.shsm_config.data.address_id = addressId
            if (data.is_areadelivery === '1') {
              // 调用高德api修改价格
              if (addressId) {
                this.gaodeMap().then(res => {
                  this.shsm_config.data.freight_area_fee = this.state.freight
                })
              } else {
                this.shsmState = true
                const action = Coupon('')
                store.dispatch(action)
                this.setState({
                  pay_price: this.price,
                  freight: 0.00,
                  couponId: undefined
                })
              }
            } else {
              this.isHasOptoon(data, this.shsm_config)
            }
          })
        }
      } else if (data.deliverytype[this.state.wayIndex].type === '自提') {
        if (store.getState().submitDan.id !== submitDanId || store.getState().submitTuan.id !== submitTuanId) {
          // 切换门店地址修改价格
          if (store.getState().submitDan.id != submitDanId) {
            this.setState({
              submitDanId: store.getState().submitDan.id
            }, () => {
              this.ziti_config.data.store_id = this.state.submitDanId
              this.isHasOptoon(data, this.ziti_config)
            })
          } else if (store.getState().submitTuan.id != submitTuanId) {
            this.setState({
              submitTuanId: store.getState().submitTuan.id
            }, () => {
              this.ziti_config.data.store_id = this.state.submitTuan
              this.isHasOptoon(data, this.ziti_config)
            })
          }
        }
      }
    } else {
      if (store.getState().defaultAddress.id !== addressId) {
        console.log(store.getState().defaultAddress.id)
        if (data.deliverytype[this.state.wayIndex].type === '快递') {
          this.setState({
            addressId: store.getState().defaultAddress.id
          })
        } else if (data.deliverytype[this.state.wayIndex].type === '送货上门') {
          this.setState({
            addressId: store.getState().defaultAddress.id
          }, () => {
            if (data.is_areadelivery === '1') {
              // 调用高德api修改价格
              const { addressId } = this.state
              if (addressId) {
                this.gaodeMap().then(res => {
                  this.shsm_config.data.freight_area_fee = this.state.freight
                })
              } else {
                this.shsmState = true
                const action = Coupon('')
                store.dispatch(action)
                this.setState({
                  pay_price: this.price,
                  freight: 0.00,
                  couponId: undefined
                })
              }
            } else {
              this.isHasOptoon(data, this.shsm_config)
            }
          })
        }
      } else {
        console.log('地址相同')
      }
    }
  }

  componentWillUnmount = () => {
    const action = Coupon('')
    store.dispatch(action)
    clearTimeout(this.timer)
    clearTimeout(this.timerToast)
    EventBus.removeListener('changeHeight', this.changeBetterScrollHeight)
  }

  componentDidUpdate() {
    this.refresh()
  }

  changeBetterScrollHeight = () => {
    this.timer = setTimeout(() => {
      this.refresh()
      if (this.refs.scroll) {
        this.refs.scroll.BScroll.scrollTo(0, this.refs.scroll.BScroll.maxScrollY, 400)
      }
    }, 400)
  }

  componentDidMount = async () => {

    EventBus.addListener('changeHeight', this.changeBetterScrollHeight)

    // this.gaodeMap()


    const action = Coupon('')
    store.dispatch(action)

    const actions = saveDefaultAddress({})
    store.dispatch(actions)

    const { history } = this.props
    const { wxUserInfo, uniacid } = store.getState().appConfig
    const openid = wxUserInfo.openid

    // 默认地址
    const showAddressConfig = {
      action: 'addressList',
      data: {
        uniacid,
        openid
      }
    }
    let addresRes = await _showAddress(showAddressConfig)
    if (addresRes.data.data[0]) {
      // console.log(addresRes.data.data.find(item => item.status === '1').id)
      const address = addresRes.data.data.find(item => item.status === '1')
      // 存在默认地址
      if (address) {
        const actions = saveDefaultAddress(addresRes.data.data.find(item => item.status === '1'))
        store.dispatch(actions)
        this.setState({
          addressId: addresRes.data.data.find(item => item.status === '1').id
        })
      } else {
        // 不存在默认地址
        console.log('存在地址不存在默认的')
        this.setState({
          addressId: ''
        })
      }
    } else {
      // 不存在地址
      console.log('不存在地址')
      this.setState({
        addressId: ''
      })
    }
    dropByCacheKey('DetailComponent')


    _setPVUV()

    /* setTimeout(() => {
      if (loading) {
        this.setState({
          loading: true
        })
      }
    }, 1000) */

    /*
    *
    * buytype: 1 单买 2 拼团
    * id: 商品id
    * num: 商品数量
    * type：0 立即购买
    * options: 规格
    * 
    */
    // 立即购买
    this.goods_config = {
      action: 'buynow',
      data: {
        gid: this.props.match.params.id,
        num: this.props.match.params.num,
        openid,
        buytype: this.props.match.params.buytype
      }
    }

    // 立即购买(单买) 拼团支付
    if (this.props.match.params.type === '0' || this.props.match.params.type === '2') {
      // 是否有规格
      if (this.props.match.params.options !== '0') {
        this.goods_config.data.optionid = this.props.match.params.options
      }
      _submitApi(this.goods_config).then(res => {
        // 创建订单时会有多种情况 比如 下架、售罄、购买限制等 返回上一页
        if (res.data.status === 400) {
          Toast.info(res.data.msg, 1)
          setTimeout(() => {
            history.goBack()
          }, 1000)
          return
        } else if (res.data.status === 200) {
          let arr = [], btn = false, newFreight, newCouponId, newPayPrice
          const { delivery_time, coupon, price, zitiinfo, deliverytype, goodsinfo, dispatch_list, pay_price, freight, btn_status, is_areadelivery } = res?.data?.data
          // 运费
          newFreight = freight
          // 金额
          newPayPrice = pay_price
          this.price = price.toFixed(2)
          // 优惠券id
          if (coupon) {
            newCouponId = coupon.id
          }

          // 送货上门的配送时间
          if (delivery_time) {
            delivery_time.forEach(item => {
              arr.push(item.time.findIndex(item1 => item1.isshow === 1))
            })
          }
          // 默认使用最优优惠券
          if (coupon) {
            const action = Coupon(coupon)
            store.dispatch(action)
          }
          // 自提信息
          if (zitiinfo) {
            const action = saveSubmitStoreTuan(zitiinfo)
            store.dispatch(action)
          }
          // 设置changePrice参数
          deliverytype.forEach(item => {
            if (item.type === '快递') {
              this.kuaidi_config = {
                action: "changePrice",
                data: {
                  uniacid,
                  openid,
                  num: goodsinfo?.num,  // 商品数量
                  gid: goodsinfo?.id,  // 商品id
                  tid: dispatch_list.length !== 0 ? dispatch_list[this.state.kuaidiIndex].id : 0, // 快递方式id
                  buytype: this.props.match.params.buytype,  // 1 单买 2 拼团
                  type: '快递', // 配送类型
                  couponid: store.getState().defaultcoupon ? store.getState().defaultcoupon.id : undefined
                }
              }
            } else if (item.type === '自提') {
              // 自提方式配置
              this.ziti_config = {
                action: "changePrice",
                data: {
                  uniacid,
                  openid,
                  num: goodsinfo?.num,  // 商品数量
                  gid: goodsinfo?.id,  // 商品id
                  buytype: this.props.match.params.buytype,  // 1 单买 2 拼团
                  type: '自提', // 配送类型
                  couponid: store.getState().defaultcoupon ? store.getState().defaultcoupon.id : undefined
                }
              }
            } else if (item.type === '送货上门') {
              // 送货上门
              this.shsm_config = {
                action: "changePrice",
                data: {
                  uniacid,
                  openid,
                  num: goodsinfo?.num,  // 商品数量
                  gid: goodsinfo?.id,  // 商品id
                  buytype: this.props.match.params.buytype,  // 1 单买 2 拼团
                  type: '送货上门', // 配送类型
                  couponid: store.getState().defaultcoupon ? store.getState().defaultcoupon.id : undefined
                }
              }
            }
          })


          // 送货上门开启高德计算
          if (deliverytype[0].type === '送货上门' && is_areadelivery === '1') {
            // 调用高德api修改价格
            var p = new Promise((resolve, reject) => {
              const { defaultAddress } = store.getState()
              // 不存在默认地址
              if (defaultAddress?.id) {
                const data = res.data.data
                let address = defaultAddress.province + defaultAddress.city + defaultAddress.county + defaultAddress.detailed_address
                let that = this, deliveryPosition
                window.AMap.plugin(['AMap.Geocoder', 'AMap.Polygon', 'AMap.LngLat', 'AMap.Circle'], function () {
                  //异步同时加载多个插件
                  let geocoder = new window.AMap.Geocoder({})
                  geocoder.getLocation(address, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                      // result中对应详细地理坐标信息
                      // lng 精度 lat 纬度 
                      if (defaultAddress.latitude) {
                        deliveryPosition = [
                          defaultAddress.longitude,
                          defaultAddress.latitude
                        ]
                      } else {
                        deliveryPosition = [
                          result.geocodes[0].location.lng,
                          result.geocodes[0].location.lat
                        ]
                      }
                      const config = {
                        action: 'area_delivery',
                        data: {
                          uniacid,
                        }
                      }
                      _submitApi(config).then(res => {
                        let check_address
                        for (let i = 0; i < res.data.data.length; i++) {
                          // let polygon = new window.AMap.Polygon({
                          //   path: res.data.data[i].range
                          // })
                          let path = res.data.data[i].range
                          // 返回false 不在区域配送范围内 
                          check_address = window.AMap.GeometryUtil.isPointInRing(deliveryPosition, path)
                          console.log(check_address, '区域范围')
                          if (check_address) {
                            // 配送范围内
                            that.count += 1
                            let deliveryLngLat = new window.AMap.LngLat(deliveryPosition[0], deliveryPosition[1])
                            let distance = deliveryLngLat.distance(res.data.data[i].store_position)
                            for (let k = 0, leng = res.data.data[i].distance.length; k < leng; k++) {
                              let pricestage = res.data.data[i].distance[k]
                              // pricestage
                              let deliver_charge = 0
                              // 开始
                              let start = Number(pricestage.start) * 1000               //公里转换成米
                              // 结束
                              let end = Number(pricestage.end) * 1000
                              // distance 用户距离商家的米数
                              if (Number(distance) >= start && Number(distance) <= end) {
                                if (data.price < Number(res.data.data[i].distance[k].start_price)) {
                                  // 清空优惠券
                                  const action = Coupon('')
                                  store.dispatch(action)
                                  that.count += 1
                                  newFreight = 0.00
                                  newCouponId = undefined
                                  newPayPrice = data.price
                                  btn = false
                                  console.log(Toast)
                                  Toast.info('商品总价需要' + res.data.data[i].distance[k].start_price + '元, 支持配送', 2)
                                  // that.timerToast = setTimeout(() => {
                                  //   resolve()
                                  // }, 40000)
                                  resolve()
                                  break
                                } else {
                                  for (let m = 0, leng = pricestage.order.length; m < leng; m++) {
                                    if (data.price <= Number(pricestage.order[m])) {
                                      console.log(Number(pricestage.order[m]))
                                      deliver_charge = pricestage.order_price[m]
                                      that.shsm_config.data.freight = deliver_charge
                                      // 判断是否有优惠券
                                      if (store.getState().defaultcoupon.id) {
                                        // 当优惠券金额大于支付金额时
                                        if ((Number(store.getState().defaultcoupon.cash) * 100 - (Number(data.price) + Number(deliver_charge)) * 100) >= 0) {
                                          const action = Coupon('')
                                          store.dispatch(action)
                                          newFreight = Number(deliver_charge).toFixed(2)
                                          newCouponId = undefined
                                          btn = true
                                          resolve()
                                        } else {
                                          newFreight = Number(deliver_charge).toFixed(2)
                                          btn = true
                                          resolve()
                                        }
                                      } else {
                                        newFreight = Number(deliver_charge).toFixed(2)
                                        btn = true
                                        resolve()
                                      }
                                      break
                                    } else {
                                      if (data.price > Number(pricestage.order[pricestage.order.length - 1])) {
                                        deliver_charge = pricestage.order_price[pricestage.order.length - 1]
                                        if (store.getState().defaultcoupon.id) {
                                          console.log('进来了')
                                          if ((Number(store.getState().defaultcoupon.cash) * 100 - (Number(data.price) + Number(deliver_charge)) * 100) >= 0) {
                                            that.shsm_config.data.couponid = ''
                                            const action = Coupon('')
                                            store.dispatch(action)
                                            console.log(Number(deliver_charge).toFixed(2))
                                            newFreight = Number(deliver_charge).toFixed(2)
                                            newCouponId = undefined
                                            btn = true
                                            resolve()
                                          } else {
                                            newFreight = Number(deliver_charge).toFixed(2)
                                            console.log(Number(deliver_charge).toFixed(2))
                                            btn = true
                                            resolve()
                                          }
                                        } else {
                                          newFreight = Number(deliver_charge).toFixed(2)
                                          btn = true
                                          resolve()
                                        }
                                        break
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            resolve()
                            break
                          }
                        }
                        if (that.count < 1) {
                          // 不在配送范围
                          that.handelScope = true
                          btn = false
                          resolve()
                        }
                      })
                    }
                  })
                })
              } else {
                btn = true
                resolve()
              }


            }).then(() => {
              this.shsm_config.data.freight_area_fee = newFreight
              this.shsmState = true
              this.setState({
                data: res.data.data,
                pay_price: (Number(newPayPrice) * 100 + Number(newFreight) * 100) / 100,
                freight: newFreight,
                way: deliverytype[0].type,
                self_time: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.self_time) || '',
                text: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.text) || '',
                rightIndex: arr.length === 0 ? [] : arr,
                delivery_time: (res.data && res.data.data && res.data.data.delivery_time) || [],
                couponId: newCouponId ? newCouponId : '',
                buttomActive: btn
              }, () => {
                this.refresh()
                const { buttomActive, way, data } = this.state
                if (!buttomActive && way === '送货上门') {
                  if (this.handelScope) {
                    this.timerToast = setTimeout(() => {
                      Toast.info('不在区域配送范围内 ', 2)
                    }, 500)
                  } else {
                    this.timerToast = setTimeout(() => {
                      Toast.info('商品总价需要' + data.start_price + '元, 支持配送', 2)
                    }, 500)
                  }
                }
              })
            })
          } else {
            // 按钮是否能点击
            if (btn_status === undefined || btn_status === 1) {
              btn = true
            }
            this.setState({
              data: res.data.data,
              pay_price: newPayPrice,
              freight: newFreight,
              way: deliverytype[0].type,
              self_time: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.self_time) || '',
              text: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.text) || '',
              rightIndex: arr.length === 0 ? [] : arr,
              delivery_time: (res.data && res.data.data && res.data.data.delivery_time) || [],
              couponId: newCouponId ? newCouponId : '',
              buttomActive: btn
            }, () => {
              this.refresh()
              const { buttomActive, way, data } = this.state
              if (!buttomActive && way === '送货上门') {
                if (this.handelScope) {
                  this.timerToast = setTimeout(() => {
                    Toast.info('不在区域配送范围内 ', 2)
                  }, 500)
                } else {
                  this.timerToast = setTimeout(() => {
                    Toast.info('商品总价需要' + data.start_price + '元, 支持配送', 2)
                  }, 500)
                }
              }
            })
          }
        }
      })
    } else if (this.props.match.params.type === '1') {
      // 购物车去购买
      let cartArrId = []
      store.getState().cartGoods.forEach(item => {
        if (item.checked) {
          cartArrId.push(item.id)
        }
      })
      const cartConfig = {
        action: 'cartToAccount',
        data: {
          uniacid,
          cartids: cartArrId,
          openid
        }
      }
      _submitApi(cartConfig).then(res => {
        if (res.data.status === 400) {
          Toast.info(res.data.msg, 1)
          setTimeout(() => {
            history.goBack()
          }, 1000)
          return
        } else if (res.data.status === 200) {
          let arr = [], btn = false, newFreight, newCouponId, newPayPrice
          const { delivery_time, coupon, price, zitiinfo, deliverytype, goodsinfo, dispatch_list, pay_price, freight, btn_status, is_areadelivery } = res?.data?.data
          // 运费
          newFreight = freight
          // 金额
          newPayPrice = pay_price
          this.price = price.toFixed(2)
          // 优惠券id
          if (coupon) {
            newCouponId = coupon.id
          }
          deliverytype.forEach(item => {
            if (item.type === '快递') {
              this.kuaidi_config = {
                action: "changePrice",
                data: {
                  uniacid,
                  openid,
                  cartids: cartArrId,
                  type: '快递',
                  buytype: '1',
                  couponid: store.getState().defaultcoupon ? store.getState().defaultcoupon.id : undefined
                }

              }
            } else if (item.type === '自提') {
              // 自提方式配置
              this.ziti_config = {
                action: "changePrice",
                data: {
                  uniacid,
                  openid,
                  cartids: cartArrId,
                  type: '自提', // 配送类型
                  buytype: '1',
                  couponid: store.getState().defaultcoupon ? store.getState().defaultcoupon.id : undefined
                }
              }
            } else if (item.type === '送货上门') {
              this.shsm_config = {
                action: "changePrice",
                data: {
                  uniacid,
                  openid,
                  cartids: cartArrId,
                  type: '送货上门', // 配送类型
                  buytype: '1',
                  couponid: store.getState().defaultcoupon ? store.getState().defaultcoupon.id : undefined
                }
              }
            }
          })

          if (res.data.data.delivery_time) {
            res.data.data.delivery_time.forEach(item => {
              arr.push(item.time.findIndex(item1 => item1.isshow === 1))
            })
          }
          // 默认优惠券
          if (res.data.data.coupon) {
            const action = Coupon(res.data.data.coupon)
            store.dispatch(action)
          }

          if (res.data.data.zitiinfo) {
            const action = saveSubmitStoreDan(res.data.data.zitiinfo)
            store.dispatch(action)
          }


          if (deliverytype[0].type === '送货上门' && is_areadelivery === '1') {
            // 调用高德api修改价格
            var p = new Promise((resolve, reject) => {
              const { defaultAddress } = store.getState()
              // 不存在默认地址
              if (defaultAddress?.id) {
                const data = res.data.data
                let address = defaultAddress.province + defaultAddress.city + defaultAddress.county + defaultAddress.detailed_address
                let that = this, deliveryPosition
                window.AMap.plugin(['AMap.Geocoder', 'AMap.Polygon', 'AMap.LngLat', 'AMap.Circle'], function () {
                  //异步同时加载多个插件
                  let geocoder = new window.AMap.Geocoder({})
                  geocoder.getLocation(address, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                      // result中对应详细地理坐标信息
                      // lng 精度 lat 纬度 
                      if (defaultAddress.latitude) {
                        deliveryPosition = [
                          defaultAddress.longitude,
                          defaultAddress.latitude
                        ]
                      } else {
                        deliveryPosition = [
                          result.geocodes[0].location.lng,
                          result.geocodes[0].location.lat
                        ]
                      }
                      const config = {
                        action: 'area_delivery',
                        data: {
                          uniacid,
                        }
                      }
                      _submitApi(config).then(res => {
                        let check_address
                        for (let i = 0; i < res.data.data.length; i++) {
                          // let polygon = new window.AMap.Polygon({
                          //   path: res.data.data[i].range
                          // })
                          let path = res.data.data[i].range
                          // 返回false 不在区域配送范围内 
                          check_address = window.AMap.GeometryUtil.isPointInRing(deliveryPosition, path)
                          console.log(check_address, '区域范围')
                          if (check_address) {
                            // 配送范围内
                            that.count += 1
                            let deliveryLngLat = new window.AMap.LngLat(deliveryPosition[0], deliveryPosition[1])
                            let distance = deliveryLngLat.distance(res.data.data[i].store_position)
                            for (let k = 0, leng = res.data.data[i].distance.length; k < leng; k++) {
                              let pricestage = res.data.data[i].distance[k]
                              // pricestage
                              let deliver_charge = 0
                              // 开始
                              let start = Number(pricestage.start) * 1000               //公里转换成米
                              // 结束
                              let end = Number(pricestage.end) * 1000
                              // distance 用户距离商家的米数
                              if (Number(distance) >= start && Number(distance) <= end) {
                                if (data.price < Number(res.data.data[i].distance[k].start_price)) {
                                  // 清空优惠券
                                  const action = Coupon('')
                                  store.dispatch(action)
                                  that.count += 1
                                  newFreight = 0.00
                                  newCouponId = undefined
                                  newPayPrice = data.price
                                  btn = false
                                  resolve()
                                  break
                                } else {
                                  for (let m = 0, leng = pricestage.order.length; m < leng; m++) {
                                    if (data.price <= Number(pricestage.order[m])) {
                                      console.log(Number(pricestage.order[m]))
                                      deliver_charge = pricestage.order_price[m]
                                      that.shsm_config.data.freight = deliver_charge
                                      // 判断是否有优惠券
                                      if (store.getState().defaultcoupon.id) {
                                        // 当优惠券金额大于支付金额时
                                        if ((Number(store.getState().defaultcoupon.cash) * 100 - (Number(data.price) + Number(deliver_charge)) * 100) >= 0) {
                                          const action = Coupon('')
                                          store.dispatch(action)
                                          newFreight = Number(deliver_charge).toFixed(2)
                                          newCouponId = undefined
                                          btn = true
                                          resolve()
                                        } else {
                                          newFreight = Number(deliver_charge).toFixed(2)
                                          btn = true
                                          resolve()
                                        }
                                      } else {
                                        newFreight = Number(deliver_charge).toFixed(2)
                                        btn = true
                                        resolve()
                                      }
                                      break
                                    } else {
                                      if (data.price > Number(pricestage.order[pricestage.order.length - 1])) {
                                        deliver_charge = pricestage.order_price[pricestage.order.length - 1]
                                        if (store.getState().defaultcoupon.id) {
                                          console.log('进来了')
                                          if ((Number(store.getState().defaultcoupon.cash) * 100 - (Number(data.price) + Number(deliver_charge)) * 100) >= 0) {
                                            that.shsm_config.data.couponid = ''
                                            const action = Coupon('')
                                            store.dispatch(action)
                                            console.log(Number(deliver_charge).toFixed(2))
                                            newFreight = Number(deliver_charge).toFixed(2)
                                            newCouponId = undefined
                                            btn = true
                                            resolve()
                                          } else {
                                            newFreight = Number(deliver_charge).toFixed(2)
                                            console.log(Number(deliver_charge).toFixed(2))
                                            btn = true
                                            resolve()
                                          }
                                        } else {
                                          newFreight = Number(deliver_charge).toFixed(2)
                                          btn = true
                                          resolve()
                                        }
                                        break
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            resolve()
                            break
                          }
                        }
                        if (that.count < 1) {
                          // 不在配送范围
                          that.handelScope = true
                          btn = false
                          resolve()
                        }
                      })
                    }
                  })
                })
              } else {
                btn = true
                resolve()
              }
            }).then(() => {
              this.shsm_config.data.freight_area_fee = newFreight
              // 使用高德地图计算 价格等于 计算后的 newPayPrice + newFreight
              this.setState({
                data: res.data.data,
                pay_price: (Number(newPayPrice) * 100 + Number(newFreight) * 100) / 100,
                freight: newFreight,
                way: deliverytype[0].type,
                self_time: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.self_time) || '',
                text: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.text) || '',
                rightIndex: arr.length === 0 ? [] : arr,
                delivery_time: (res.data && res.data.data && res.data.data.delivery_time) || [],
                couponId: newCouponId ? newCouponId : '',
                buttomActive: btn,
                cartids: cartArrId,
              }, () => {
                this.refresh()
                const { buttomActive, way, data } = this.state
                if (!buttomActive && way === '送货上门') {
                  if (this.handelScope) {
                    this.timerToast = setTimeout(() => {
                      Toast.info('不在区域配送范围内 ', 2)
                    }, 500)
                  } else {
                    this.timerToast = setTimeout(() => {
                      Toast.info('商品总价需要' + data.start_price + '元, 支持配送', 2)
                    }, 500)
                  }
                }
              })
            })
          } else {
            if (btn_status === undefined || btn_status === 1) {
              btn = true
            }
            this.shsmState = true
            this.setState({
              data: res.data.data,
              pay_price: res.data.data.pay_price,
              freight: res.data.data.freight,
              way: res.data.data.deliverytype[0].type,
              cartids: cartArrId,
              self_time: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.self_time) || '',
              text: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.text) || '',
              rightIndex: arr.length === 0 ? [] : arr,
              delivery_time: (res.data && res.data.data && res.data.data.delivery_time) || [],
              couponId: (res.data && res.data.data && res.data.data.coupon && res.data.data.coupon.id) || '',
              buttomActive: btn
            }, () => {
              this.refresh()
              const { buttomActive, way, data } = this.state
              if (!buttomActive && way === '送货上门') {
                if (this.handelScope) {
                  this.timerToast = setTimeout(() => {
                    Toast.info('不在区域配送范围内 ', 2)
                  }, 500)
                } else {
                  this.timerToast = setTimeout(() => {
                    Toast.info('商品总价需要' + data.start_price + '元, 支持配送', 2)
                  }, 500)
                }
              }
            })
          }
        }
      })
    } else if (this.props.match.params.type === '3') {

      /**
       * 
       * time: 2020-12-23
       * content: 礼品卡接口
       * author: lkd
       * 
       * */

      const goods_config = {
        // 立即购买
        action: 'exchange',
        data: {
          gid: this.props.match.params.id,
          openid: wxUserInfo.openid
        }
      }

      _submitApi(goods_config).then(res => {
        let arr = []

        if (res.data.status === 400) {
          Toast.info(res.data.msg, 1)
          setTimeout(() => {
            history.goBack()
          }, 1000)
          return
        }

        if (res.data.data.delivery_time) {
          res.data.data.delivery_time.forEach(item => {
            arr.push(item.time.findIndex(item1 => item1.isshow === 1))
          })
        }

        if (res.data.data.zitiinfo) {
          const action = saveSubmitStoreTuan(res.data.data.zitiinfo)
          store.dispatch(action)
        }

        this.setState({
          data: res.data.data,
          way: res.data.data.deliverytype[0].type,
          self_time: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.self_time) || '',
          text: (res.data && res.data.data && res.data.data.zitiinfo && res.data.data.zitiinfo.text) || '',
          rightIndex: arr.length === 0 ? [] : arr,
          delivery_time: (res.data && res.data.data && res.data.data.delivery_time) || [],
        }, () => { this.refresh() })
      })
    }
  }

}

export default withRouter(Submit);