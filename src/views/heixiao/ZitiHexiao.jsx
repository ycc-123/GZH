import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import QRCode from 'qrcode-react'
import { Toast } from "antd-mobile"

import BetterScroll from 'common/betterScroll/BetterScroll'

import { getUrlValue } from 'commons/utils'

import { _api } from 'network/api'
import { _orderAction } from 'network/order'

import { store } from 'store/index'


class ZitiHexiao extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true,
      hexiaoDetail: {},
      storeid: '',
      money: '',
      showQRCode: false,
      url: '',
      staffOpenid: null,
      goods: []
    }
    const { orderno } = this.props.match.params
    const { appConfig } = store.getState()
    const { uniacid } = appConfig
    const { openid } = appConfig.wxUserInfo
    this.networkConfig = {
      hexiaoDetail: {
        action: 'hexiaoDetail',
        data: {
          uniacid,
          openid,
          orderno,
        }
      },
      confirmHeXiao: {
        action: 'hexiao',
        data: {
          uniacid,
          orderno,
          openid,
          storeid: '248',
          collect_id: '',
          retreat: false,
          refundType: '',
          price: '',
        }
      }
    }
  }
  render() {
    const { hexiaoDetail, showQRCode, url, storeid, goods } = this.state
    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc((100vh - 1.58rem) - env(safe-area-inset-bottom))'
    }
    console.log(goods)
    return (
      <ZitiHexiaoStyle>
        {hexiaoDetail.stores && <div className="zongkuang">
          <div className="zitihexiaotopframe">
            <div className="zitihexiaotoptext">实际提货点</div>
            <div className="zitihexiaokuang">
              <div className="zitihexiaotoptext2">
                <select id="selectNewStore" value={storeid ? storeid : ''} style={{ border: 'none', backgroundColor: 'white' }} onChange={this.selectNewStore} dir='rtl'>
                  <option value="">请选择实际自提点</option>
                  {
                    hexiaoDetail.stores.map((item, key) => {
                      return (
                        <option value={item.id} key={key + item.id}>{item.storename}</option>
                      )
                    })
                  }
                </select>
              </div>
            </div>
          </div>


          <BetterScroll config={scollConfig} style={scrollStyle}>
            <div className="zitihexiaoframe">
              <div className="zitihexiaotex1">到店自提核销凭证</div>
              <div className="zitidingdanframe">
                <div className="dingdanframe">
                  <div className="dingdantext1">订单号</div>
                  <div className="dingdantext2">{hexiaoDetail.orderno}</div>
                </div>
                <div className="dingdanframe">
                  <div className="dingdantext1">团长</div>
                  <div className="dingdantext2">{hexiaoDetail.tuan_first_name}</div>
                </div>
                <div className="dingdanframe">
                  <div className="dingdantext1">提货人</div>
                  <div className="dingdantext2">{hexiaoDetail.addname}</div>
                </div>
                <div className="dingdanframe">
                  <div className="dingdantext1">提货点</div>
                  <div className="dingdantext2">{hexiaoDetail.store.storename}</div>
                </div>
              </div>
              <div style={{ padding: "0 0.4rem" }}>

                {
                  goods.map((item, key) => {
                    return (
                      <div className="wupinframe" key={key + item.id} style={{ display: item.status === '0' ? 'flex' : 'none' }}>
                        <img className="wupinimg" alt='' src={item.gimg} />
                        <div className="wupintextframe">
                          <div className="wupintext1">{item.gname}</div>
                          <div className="wupintextframe2">
                            <div>规格:{item.item}</div>
                            <div>x{item.gnum}</div>
                          </div>
                          <div className="wupintext2">￥{item.oprice}</div>
                        </div>
                        <img className="wupinimg2"
                          onClick={() => { this.changeCheck(key) }}
                          style={{ backgroundColor: item.check ? 'var(--theme-font-color)' : '#ccc' }}
                          alt=''
                          src='https://res.lexiangpingou.cn/images/vip/20201127/gouwhite.png' />

                      </div>
                    )
                  })
                }


              </div>

              <div className="zitijineframe">
                <div className="zitijinetextk">
                  <div className="zitijinetext1">优惠金额</div>
                  <div className="zitijinetext2">{Number(hexiaoDetail.discount_fee).toFixed(2)}元</div>
                </div>
                <div className="zitijinetextk">
                  <div className="zitijinetext1">运费金额</div>
                  <div className="zitijinetext2">{Number(hexiaoDetail.freight) < 0 ? '0' : hexiaoDetail.freight}元</div>
                </div>
                <div className="zitijinetextk">
                  <div className="zitijinetext1">支付金额</div>
                  <div className="zitijinetext2">{hexiaoDetail.pay_price}元</div>
                </div>
                {hexiaoDetail.selltype === '7' && <div className="zitijinetextk">
                  <div className="zitijinetext1">补款金额</div>
                  <div className="zitijinetext2">{hexiaoDetail.bukuanmoney}元</div>
                </div>}
                {hexiaoDetail.selltype === '7' && <div className='zitijinetextk'>
                  <span className="zitijinetext1">修改金额</span>
                  <input className='zitijinetext1-money' onChange={e => this.changeMoney(e)} value={this.state.money} placeholder='请点击输入修改金额'></input>
                </div>}
                {hexiaoDetail.selltype === '7' && <button className='zitijinetext1-money-change' onClick={() => this.confirmChange()}>确认修改
                </button>}

              </div>

            </div>

            <div className="btnframe">
              <button className="btn1" onClick={() => { this.props.history.push('/home') }}>返回首页</button>
              <button className="btn2" onClick={this.confirmHeXiao}>确认核销</button>
            </div>
            <div style={{ height: '.2rem' }}>

            </div>

          </BetterScroll>
        </div>}
        {showQRCode && <div className='qr'>
          <QRCode value={url} size={200} fgColor="#000000" />
        </div>}
        {showQRCode && <div className='mask' onClick={() => this.hiddenMask()}></div>}
      </ZitiHexiaoStyle>
    )
  }

  changeMoney(e) {
    this.setState({
      money: e.target.value
    })
  }

  changeCheck(index) {
    const { goods } = this.state
    goods[index].check = !goods[index].check
    this.setState({
      goods
    })
  }

  confirmChange() {
    const { hexiaoDetail, money } = this.state
    if (Number(money * 100) > Number(hexiaoDetail.bukuanmoney * 100)) {
      Toast.info('修改金额不能大于补款金额')
    } else if (money === '') {
      Toast.info('请输入金额')
    } else {
      let origin, pathname, search, hash, url
      origin = window.location.origin
      pathname = window.location.pathname
      search = window.location.search
      hash = `#/payment/${hexiaoDetail.orderno}/${money}`
      url = origin + pathname + search + hash
      this.setState({
        showQRCode: !this.state.showQRCode,
        url
      })
    }
  }

  hiddenMask() {
    this.setState({
      showQRCode: !this.state.showQRCode,
    })
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer)
    clearTimeout(this.timer1)
  }

  async componentDidMount() {

    const { uniacid, wxUserInfo: { openid } } = store.getState().appConfig
    const { orderno } = this.props.match.params

    let api_config = {
      action: 'hexiaoDetail',
      data: {
        uniacid,
        orderno
      }
    }
    const search = this.props.history.location.search

    let staffOpenid, storeid
    if (search) {
      staffOpenid = getUrlValue(search, 'oid')
      storeid = getUrlValue(search, 'sid')
    }

    /**
     * 
     * @param {urlOpenid} 核销员的openid
     * @param {storeid} 默认门店id
     * 
     * */
    if (staffOpenid && storeid) {
      api_config.data.openid = staffOpenid
      api_config.data.storeid = storeid
    } else {
      api_config.data.openid = openid
    }



    let hexiaoDetailRes = await _orderAction(api_config)
    if (hexiaoDetailRes.data.status === 200) {
      let goods = hexiaoDetailRes.data.data[0].goods
      goods.forEach(item => item.check = true)
      this.setState({
        hexiaoDetail: hexiaoDetailRes.data.data[0],
        staffOpenid: staffOpenid ? staffOpenid : 0,
        storeid,
        goods
      })
    } else if (hexiaoDetailRes.data.status === 400) {
      Toast.fail(hexiaoDetailRes.data.msg, 2)
      this.timer1 = setTimeout(() => {
        this.props.history.replace('/home')
      }, 2100)
    }

  }

  selectNewStore = () => {
    let el = document.getElementById('selectNewStore')
    this.setState({
      storeid: el.value
    })
  }

  confirmHeXiao = async () => {
    const { hexiaoDetail, staffOpenid, storeid, goods } = this.state
    const { uniacid, wxUserInfo: { openid } } = store.getState().appConfig
    this.networkConfig.confirmHeXiao.data.storeid = storeid
    if (!storeid) {
      Toast.info('请先选择实际自提点', 2)
      return
    }
    let collect_id = []
    goods.forEach(item => {
      if (item.check) collect_id.push(item.id)
    })
    if (collect_id.length === 0) {
      Toast.info('请最少选择一件商品核销')
      return
    }
    const api_config = {
      action: 'hexiao',
      data: {
        uniacid,
        openid: staffOpenid ? staffOpenid : openid,
        orderno: hexiaoDetail.orderno,
        storeid,
      }
    }
    if (hexiaoDetail.selltype === '0') {
      // 单买或者购物车
      api_config.data.collect_id = collect_id
      _orderAction(api_config).then(res => {
        if (res?.data?.status === 200) {
          Toast.success(res.data.msg, 2)
          this.timer = setTimeout(() => {
            if (staffOpenid) {
              this.props.history.replace(`/hexiao/success/${hexiaoDetail.id}/${hexiaoDetail.orderno}`)
            } else {
              this.props.history.replace('/home')
            }
          }, 2100)
        } else {
          Toast.fail(res?.data?.msg)
        }
      })
    } else if (hexiaoDetail.selltype === '7') {
      // 订金团
      const config = {
        action: "orderSupplement",
        data: {
          master_orderno: this.props.match.params.orderno,
          uniacid,
          openid,
          modifyprice: hexiaoDetail.bukuanmoney
        }
      }
      _api(config).then(res => {
        if (res.data.status === 200) {
          Toast.success(res.data.msg, 2)
          this.timer = setTimeout(() => {
            this.props.history.replace('/home')
          }, 2100)
        } else {
          Toast.fail(res.data.msg)
        }
      })
    } else {
      // 其他团
      // 核销员的openid
      if (staffOpenid) {
        this.networkConfig.confirmHeXiao.data.openid = staffOpenid
      }
      let hexiaoRes = await _orderAction(this.networkConfig.confirmHeXiao)
      if (hexiaoRes.data.status === 200) {
        Toast.success(hexiaoRes.data.msg, 2)
        this.timer = setTimeout(() => {
          if (staffOpenid) {
            this.props.history.replace(`/hexiao/success/${hexiaoDetail.id}/${hexiaoDetail.orderno}`)
          } else {
            this.props.history.replace('/home')
          }
        }, 2100)
      } else {
        Toast.fail(hexiaoRes.data.msg)
      }
    }
  }
}

const ZitiHexiaoStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);


.qr {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10000;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
}

.zitijinetext1-money-change {
  margin-top: .4rem;
  width: 100%;
  height: 1rem;
  background-color: red;
  border-radius: 13rem;
  color: #fff;
}

.zitijinetext1-money {
  font-size: .32rem;
  text-align: right;
  border: none;
  color: #CCC;
}

option {
  text-align: right;
}


.selectNewStore{
    
  position: absolute;
  top: 30rem;
  background-color:white;
  width:100vw;
  height:50vh;
    
}

.zongkuang{
  padding:0 0.32rem;
}
.zitihexiaotopframe{  
  display:flex;
  justify-content:space-between;
  padding: 0 0.32rem;
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
  background: white;
  border-radius: 0.1rem;
  margin: 0.15rem 0;
}

.zitihexiaotoptext{
  display:flex;
  align-items:center;
  font-size:0.4rem;
  font-weight:600;
}
.zitihexiaokuang{
  display:flex;
  align-items: center;
}
.zitihexiaotoptext2{
  font-size:0.32rem;
  color:#CCC;
  margin-right:0.17rem;
}
.zitihexiaotopimg{
  width:0.27rem;
  height:0.27rem;
  background:black;
}
.zitihexiaoframe{
  background: white;
  border-radius: 0.1rem;
}
.zitihexiaotex1{
  width:100%;
  height:2rem;
  line-height:2rem;
  font-size:0.5rem;
  font-weight:600;
  text-align:center;
  border-bottom: 1px solid #c3c3c3;
}
.zitidingdanframe{
  padding: 0.4rem 0.4rem 0 0.4rem;
  width: 100%;
  height: 3.13rem;
  border-bottom: 1px solid #c3c3c3;
}
.dingdanframe{
  display:flex;
  justify-content:space-between;
  margin-bottom: 0.25rem;
}
.dingdantext1{
  font-size:0.32rem;
  font-weight:600;
}
.dingdantext2{
  font-size:0.32rem;
  color:#CCC;
}
.wupinframe{
  display:flex;
  align-items:center;
  width:100%;
  height:2.13rem;
  border-bottom:0.01rem solid #DA6D33;
  position:relative;
}
.wupinframexu{
  display:flex;
  align-items:center;
  width:100%;
  height:2.13rem;
  border-bottom:0.01rem dashed #CCC;
}
.wupinimg{
  width:1.33rem;
  height:1.33rem;
  background:red;
  margin-right:0.4rem;
}
.wupintextframe{
  width:calc(100vw - 3.17rem);
}
.wupintextframe2{
  display:flex;
  justify-content:space-between;
  color:#CCC;
  font-size:0.32rem;
}
.wupintext1{
  font-size:0.32rem;
  font-weight:600;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.wupintext2{
  font-size:0.32rem;
  color:red;
}
.wupinimg2{
  width:0.53rem;
  height:0.53rem;
  position:absolute;
  bottom:0;
  right:0;
}
.zitijineframe {
  width:100%;
  padding:0 0.4rem .5rem;
}
.zitijinetextk{
  display: flex;
  justify-content: space-between;
  margin-top: 0.3rem;
}
.zitijinetext1{
  font-size:0.32rem;
  font-weight:600;
}
.zitijinetext2{
  font-size:0.32rem;
  color:#CCC;
}
.btnframe{
  width: calc(100vw - .64rem);
  display:flex;
  justify-content:space-between;
  margin-top: .4rem;
}
.btn1{
  width:4.53rem;
  height:0.93rem;
  line-height:0.93rem;
  text-align:center;
  background:white;
  font-size:0.4rem;
  font-weight:600;
  border-radius:0.2rem;
}
.btn2{
  width:4.53rem;
  height:0.93rem;
  line-height:0.93rem;
  text-align:center;
  background:var(--theme-font-color);
  font-size:0.4rem;
  font-weight:600;
  border-radius:0.2rem;
  color:white;
}
`
export default withRouter(ZitiHexiao);