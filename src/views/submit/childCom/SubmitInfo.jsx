import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { DatePicker, List } from "antd-mobile"

import { store } from 'store/index'

import { _api } from 'network/api'

import TeamPlay from 'common/teamPlay/TeamPlay'
import { saveAppConfig } from "store/actionCreators"

import { inputResolve } from 'commons/utils'

const wx = window.wx

class SubmitInfo extends PureComponent {
  constructor() {
    super()
    this.state = {
      self_time_start: '',
      xuan_time: '',
      storeList: [],
    }
  }
  render() {
    let storename, timer
    const { way, wayIndex, kuaidiIndex, buytype, text, self_time, rightIndex, leftIndex, delivery_time, goods } = this.props
    const { deliverytype, dispatch_remark } = this.props.goods
    const { defaultAddress, defaultcoupon, submitDan, submitTuan } = store.getState()
    const { storeList } = this.state
    let coupon = defaultcoupon === '' ? '请选择' : -store.getState().defaultcoupon.cash
    if (storeList.length !== 0) {
      if (buytype === '1' || (buytype === '3' && goods.goodsinfo.selltype === '0')) {
        // 单买
        let __cc__ = storeList.find(item => submitDan.id === item.id)
        if (submitDan.id && __cc__) {
          storename = submitDan.storename
        } else {
          storename = '选择门店'
        }
      } else if (buytype === '2' || (buytype === '3' && goods.goodsinfo.selltype !== '0')) {
        let __cc__ = storeList.find(item => submitTuan.id === item.id)
        // 拼团
        if (submitTuan.id && __cc__) {
          storename = submitTuan.storename
        } else {
          storename = '选择门店'
        }
      }
    }

    if (document.querySelector('.right-ul')) {
      // 左侧索引leftIndex
      if (rightIndex[leftIndex] !== -1) {
        timer = delivery_time[leftIndex].name + ' ' + delivery_time[leftIndex].time[rightIndex[leftIndex]].name.replace("-", " ~ ")
      }

      console.log(timer)

    }
    return (
      <SubmitInfoStyle>

        <div className='submit-info'>
          <ul className='submit-nav claerfix'>
            {deliverytype.map((item, index) => {
              return (
                <li key={index + item} className={wayIndex === index ? 'nav-active' : ''} onClick={(e) => { this.changeActive(e, index, item.type) }}>{item.type}</li>
              )
            })}
          </ul>
        </div>

        {
          deliverytype.find(item => item.type === '快递') && <div className='submit-container' style={{ display: way === '快递' ? 'block' : 'none' }}>
            <div className='address' onClick={this.goAddress}>
              <img className="addressimg1" src='https://res.lexiangpingou.cn/images/vip/address.png' alt="" />
              <div className="addressframe">
                <div className="addressframek1">
                  <div className="addressframek1text1">{defaultAddress.cname ? defaultAddress.cname : '请先选择或添加地址'}</div>
                  <div className="addressframek1text2">{defaultAddress.tel}</div>
                </div>
                <div className="addressframek2">
                  <div className="addressframek2text">{defaultAddress.province}</div>
                  <div className="addressframek2text">{defaultAddress.city}</div>
                  <div className="addressframek2text">{defaultAddress.county}</div>
                </div>
                <div className="addressframek3">
                  {defaultAddress.detailed_address}
                </div>
                {defaultAddress.type && <div className='gongs'>{defaultAddress.type === '1' ? '公司' : '家庭'}</div>}
              </div>
            </div>
            {this.props.goods.dispatch_list && <div className='way' /* onClick={() => { this.changeWay() }} */>
              配送方式
            <ul className='way-box'>
                {this.props.goods.dispatch_list.map((item, index) => {
                  return (
                    <li key={item + index} className='way-select'
                      style={{ color: kuaidiIndex === index ? '#fff' : ' ', background: kuaidiIndex === index ? 'var(--theme-font-color)' : '#fff' }}
                      onClick={() => { this.changeKuaidi(index) }}
                    >{item.name}</li>
                  )
                })}
              </ul>
            </div>}
            {
              goods.goodsinfo.is_experience !== '2' &&
              <div className='volum' onClick={this.goCoupon}>
                优惠券
            <span>{coupon}</span>
              </div>
            }
            <div className='message ' >
              商家备注:
            <input className='submitzongkf subzkfipt kuaidi-beizhu' placeholder="请给商家留言（选填）" type="text" />
            </div>
            {buytype === '2' && <TeamPlay type={1} />}
            <div style={{ width: '100%' ,height: '.13rem'}}></div>
          </div>
        }






        {
          deliverytype.find(item => item.type === '自提') && <div className='submit-container' style={{ display: way === '自提' ? 'block' : 'none' }}>
            <div className='submitzongkuang'>
              <div className='volum' onClick={this.goStore}>{storename}</div>
              <div className='subxiantiao'></div>
              <div className='submitzongkf subzkfdis'>
                <div>收货人</div>
                <input className='subzkfipt submit-username' onBlur={this.onInputBlur} style={{ textAlign: 'right' }} type="text" placeholder={goods.zitiinfo.addname ? goods.zitiinfo.addname : '请填写收获人姓名'} name={goods.zitiinfo.addname ? goods.zitiinfo.addname : ''} onClick={(e) => { this.active(e) }} />
              </div>
              <div className='subxiantiao'></div>
              <div className='submitzongkf subzkfdis'>
                <div>联系电话</div>
                <input className='subzkfipt submit-usertel' onBlur={this.onInputBlur} style={{ textAlign: 'right' }} type="tel" placeholder={goods.zitiinfo.addmobile ? goods.zitiinfo.addmobile : '请填写联系电话'} name={goods.zitiinfo.addmobile ? goods.zitiinfo.addmobile : ''}  /* value={goods.zitiinfo.addmobile ? goods.zitiinfo.addmobile : ''} */ maxLength='11' minLength='11' onClick={(e) => { this.active(e) }} />
              </div>
              <div className='subxiantiao'></div>


              {
                this.state.is_self_time &&
                <div>
                  <div className='submitzongkf subzkfdis'>
                    <div className='zitishijian'
                    // onClick={ this.Parent.bind(this) }
                    >
                      <div className='ziti_time'>自提时间</div>
                      <DatePicker

                        mode="date"
                        extra="请选择"
                        onOk={this.Parent.bind(this, this.state.date)}
                        value={this.state.date}
                        onChange={date => this.setState({
                          date,
                          xuan_time: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                        })}
                      >
                        <List.Item className='onetimes' arrow="horizontal" ></List.Item>
                      </DatePicker>
                    </div>
                    <input className='subzkfipt submit-usertel' style={{ textAlign: 'right' }} type="text" />
                  </div>
                  <div className='subxiantiao'></div>

                  <div className='submitzongkf subzkfdis'>
                    <div className='zitishijian'>
                      <div className='ziti_time'>可选择时间区段</div>
                      <div className='ziti_shuoming'>{self_time.self_time_start + "~" + self_time.self_time_end}</div>
                    </div>
                    {/* <input className='subzkfipt submit-usertel' style={{ textAlign: 'right' }} type="text" /> */}
                  </div>
                  <div className='subxiantiao'></div>
                </div>
              }




              <div className='ddd' type="text" onClick={(e) => { this.active(e) }} >{text}</div>
            </div>
            {
              goods.goodsinfo.is_experience !== '2' &&
              <div className='volum' onClick={this.goCoupon}>
                优惠券
                <span>{coupon}</span>
              </div>
            }
            <div className='message ' >
              商家备注:
            <input className='submitzongkf subzkfipt ziti-beizhu' placeholder="请给商家留言（选填）" type="text" />
            </div>
            {
              buytype === '2' && <TeamPlay type={1} />
            }
          </div>
        }





        {deliverytype.find(item => item.type === '送货上门') && <div className='submit-container' style={{ display: way === '送货上门' ? 'block' : 'none' }}>
          <div className='address' onClick={this.goAddress}>
            <img className="addressimg1" src='https://res.lexiangpingou.cn/images/vip/address.png' alt="" />
            <div className="addressframe">
              <div className="addressframek1">
                <div className="addressframek1text1">{defaultAddress.cname ? defaultAddress.cname : '请先选择或添加地址'}</div>
                <div className="addressframek1text2">{defaultAddress.tel}</div>
              </div>
              <div className="addressframek2">
                <div className="addressframek2text">{defaultAddress.province}</div>
                <div className="addressframek2text">{defaultAddress.city}</div>
                <div className="addressframek2text">{defaultAddress.county}</div>
              </div>
              <div className="addressframek3">
                {defaultAddress.detailed_address}
              </div>
              {defaultAddress.type && <div className='gongs'>{defaultAddress.type === '1' ? '公司' : '家庭'}</div>}
            </div>
          </div>
          {delivery_time.length !== 0 && <div className='volum shsmshsj' onClick={() => { this.props.hideDarwer() }}>
            <div>送达时间</div>
            <div className="shsmshsjipt" >{timer ? timer : '请选择时间'}</div>
          </div>}
          {dispatch_remark && <div className="shsmshsm">{dispatch_remark}</div>}
          {
            goods.goodsinfo.is_experience !== '2' &&
            <div className='volum' onClick={this.goCoupon}>
              优惠券
            <span>{coupon}</span>
            </div>
          }
          <div className='message' >
            商家备注:
            <input className='submitzongkf subzkfipt shsm-beizhu' placeholder="请给商家留言（选填）" type="text" />
          </div>
          {buytype === '2' && <TeamPlay type={1} />}
        </div>}

      </SubmitInfoStyle>

    );
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   return JSON.stringify(nextState) !== JSON.stringify(this.state) || JSON.stringify(nextProps) !== JSON.stringify(this.props)
  // }

  onInputBlur = () => {
    let flag = inputResolve()
    if (flag) {
      window.scroll(0, 0)
    }
  }


  componentDidMount = () => {

    let { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    let storeConfig

    const { goods, buytype, type, self_time } = this.props

    if (buytype === '1' && (type === '0' || type === '1')) {
      storeConfig = {
        action: 'storeList',
        data: {
          uniacid: appConfig.uniacid,
          gid: 0,
          lat: wxUserInfo.lat,
          lng: wxUserInfo.lng,
          type: '1'
        }
      }
    } else if (buytype === '2' || (type === '2' && buytype === '1')) {
      storeConfig = {
        action: 'storeList',
        data: {
          uniacid: appConfig.uniacid,
          gid: goods.goodsinfo.id,
          lat: wxUserInfo.lat,
          lng: wxUserInfo.lng,
          type: '2'
        }
      }
    } else if (buytype === '3') {
      storeConfig = {
        action: 'storeList',
        data: {
          uniacid: appConfig.uniacid,
          gid: goods.goodsinfo.id,
          lat: wxUserInfo.lat,
          lng: wxUserInfo.lng,
          type: '2'
        }
      }
    }

    _api(storeConfig).then(res => {
      this.setState({
        storeList: res.data.data,
        self_time_start: self_time.self_time_start,
        is_self_time: self_time.is_self_time === "1" ? true : false
      })
    })

    wx.ready(
      () => {
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            appConfig.wxUserInfo.lng = res.longitude
            appConfig.wxUserInfo.lat = res.latitude
            const action = saveAppConfig(appConfig)
            store.dispatch(action)
          }
        })
      }
    )
  }

  Parent(aa, ww) {
    let date = ww
    const xuan_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    this.props.time(xuan_time)
  }


  goCoupon = () => {
    const { goods } = this.props
    this.props.history.push(`/coupon/${goods.nocouponprice}`)
  }

  goStore = async () => {
    const { goods, buytype, type } = this.props

    /**
     * time: 2020-12-23
     * author: lkd
     * @param {buytype} 购物方式 1: 单买, 2: 拼团, 3: 购物卡
     * @param {type} 区分购物方式类行 0: 单买, 1: 直接购买, 2: 拼团购买方式, 3: 提货卡
     * 
    */

    // 单买或者购物车购买
    if (buytype === '1' && (type === '0' || type === '1')) {
      this.props.history.push(`/submitstore/0/1`)
    } else if (buytype === '2' || (type === '2' && buytype === '1')) {
      // 拼团购买 或者拼团的直接购买
      this.props.history.push(`/submitstore/${goods.goodsinfo.id}/2`)
    } else if (buytype === '3' && goods.goodsinfo.selltype === '0') {
      // 提货卡方式 单买
      this.props.history.push(`/submitstore/0/1`)
    } else if (buytype === '3' && goods.goodsinfo.selltype !== '0') {
      // 提货卡方式 除了单买以外
      this.props.history.push(`/submitstore/${goods.goodsinfo.id}/2`)
    }
  }

  goAddress = () => {
    localStorage.setItem('goBackSubmitUrl', JSON.stringify(window.location.href))
    this.props.history.push('/myaddress/submit')
  }

  active = e => {
    e.target.focus()
  }

  changeActive = (e, index, type) => {
    e.stopPropagation()
    this.props.changeWayActive(index, type)
  }

  changeKuaidi = index => {
    this.props.changeKuaiDiIndex(index)
  }

  showDrawer = (e) => {
    e.stopPropagation()
    this.setState({
      hide: true
    })
  }
  hideDarwer = (e) => {
    e.stopPropagation()
    this.setState({
      hide: false
    })
  }


  /* shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps)
  } */

}

const SubmitInfoStyle = styled.div`

.ddd {
  border-radius: .2rem;
  font-size: .32rem;
  padding: .4rem;
  word-wrap: break-word;
  word-break: normal;
}

.wrapper .CommissionHeader{
  height:1.09rem;
}
.wrapper .CommissionHeader .navbar li{
  // height:1.09rem;
  padding-top:.15rem;
}
.wrapper .CommissionHeader .navbar .active{
  padding-bottom: .28rem;
}
.stor_name{
  font-size:0.32rem;
  height:1.17rem;
  line-height:1.17rem;
}

.am-list-item .am-list-line .am-list-extra{
  position: absolute;
  right: .4rem;
  color:#a9a9a9;
  font-size:0.32rem;
  text-align: right;
  width: 7rem !important;
}
.am-list-item .am-list-line .am-list-arrow{

  background-image: none;
  opacity:0;
}
.onetimes{
  display: flex;
  align-items: center;
  position:absolute;
  right: 0;
  top: 3.4rem;
  // padding-top:.3rem;
  color: red;
  width: 7rem;
  background-color: transparent;
}
.times{
  position:absolute;
  left:1.8rem;
  top:1rem;
  // padding-top:.3rem;
  color: #a9a9a9;
  width:12rem;
  background-color: transparent;
}
.am-list-arrow am-list-arrow-horizontal{
  background-image: none;
  opacity:0;
}


.ziti_time{
  width: 3rem;
  height: .5rem;
}
.ziti_shuoming{
  color:var(--theme-font-color);
  width: 5.5rem;
  text-align:right;
  height: .5rem;
}
.zitishijian{
  display:flex;
  justify-content: space-between;
}
.gongs{
  position: absolute;
  right: .5rem;
  top: .5rem;
  color: var(--theme-font-color);
  width: 1rem;
  text-align:center;
  height: .5rem;
  line-height: .5rem;
  border-radius: .5rem;
  border:1px solid var(--theme-font-color);
}
.way-select {
  border: 1px solid var(--theme-font-color);
}
.submit-container {
  margin-top: .16rem;
}

.address {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: .4rem;
  height: 2rem;
  background: #fff;
  border-radius: .13rem;
}

.address::after, .volum::after {
  content: '';
  position: absolute;
  display: inline-block;
  right: 5%;
  width: .16rem;
  height: .16rem;
  border-top: .03rem solid #a3a3a3;
  border-right: .03rem solid #a3a3a3;
  transform: rotate(45deg);
}

.way, .volum, .message {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: .16rem;
  padding-left: .4rem;
  background: #fff;
  border-radius: .13rem;
}

.volum, .message {
  height: 1.19rem;
}
.message {
  margin-bottom: .16rem;
}

.volum span {
  position: absolute;
  right: 10%;
}

.address{
  display:flex;
  align-items:center;
}
.addressimg1{
  width:.8rem;
  height:.8rem;
}
.addressframe{
 margin-left:.4rem;
 width:7rem;
 position:relative;
}
.addressframek1{
  display: flex;
  align-items: baseline;
}
.addressframek1text1{
  font-size:.4rem;
  font-weight:600;
}
.addressframek1text2{
  margin-left:.4rem;
  font-size:.27rem;
  font-weight:600;
}
.addressframek2{
  display: flex;
  font-size:.32rem;
  font-weight:600;
}
.addressframek2text{
  margin-right:.14rem;
}
.addressframek3 {
  width: 5.4rem;
  font-size:.32rem;
}
.submitzongkuang{
  position:relative;
  background:white;
  border-radius: .2rem;
}
.submitzongkf{
  border-radius: .2rem;
  font-size:.32rem;
  height:1.12rem;
  line-height:1.12rem;
  padding: 0 0.4rem;
}
.subzkfdis{
  display:flex;
  justify-content:space-between;
}
.subzkfipt{
  width: 7rem;
  border:none;
  cursor:pointer;
}
.subxiantiao{
  background: #e6e6e6;
  height:1px;
  width:100%;
}
.shsmshsj{
  height:1.2rem;
  line-height:1.2rem;
  display: flex;
  justify-content: space-between;
}
.shsmshsjipt{
  border: none;
  text-align: right;
  margin-right: 0.8rem;
}
.shsmshsm{
  border:none;
  margin-top:0.2rem;
  width: 100%;
  padding-left: .4rem;
  line-height: 1.19rem;
  height: 1.19rem;
  background: #fff;
  font-size: .32rem;
  border-radius: .13rem;
}



`

export default withRouter(SubmitInfo);

