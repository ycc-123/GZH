import React, { Component, Fragment } from 'react'
// import { withRouter } from 'react-router-dom'
import { dropByCacheKey } from 'react-router-cache-route'
import { _getOrderDetail } from 'network/order'
import { store } from 'store/index'
import { Toast } from 'antd-mobile'

import DetailNum from './DetailNum'

import { rgbToRgba } from 'commons/utils'

import EventBus from 'commons/event'

import DetailDrawer from './DetailDrawer'

/* 
*
* goods.selltype
* 0 单买 1 拼图 4 阶梯团 6 新专团 7 定金团
*
*/

class DetailBottomBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDrawer: false,
      type: 0,
      selltype: '',
      showService: false,
      kefuImg: '',
      bottom: 'env(safe-area-inset-bottom)',
      text: '',
      bgColor: '',
      groupPrice: ''
    }

    this.count = 0

    this.networkConfig = {
      getKeFuImg: {
        action: "kefuImg",
        data: {
          uniacid: store.getState().appConfig.uniacid
        }
      },
    }
  }

  render() {
    const { num, goods, groupinfo, memberExpiration } = this.props
    const { selltype, type, bottom, text, bgColor, groupPrice } = this.state
    const isShowService = this.state.showService ? 'block' : 'none'
    const { tabBar, icons } = store.getState().mallConfig
    console.log(groupPrice, '团金额')
    return (
      <Fragment>
        <footer className='detail-bottom-bar' style={{ bottom }}>

          <div>
            <div className='detail-bottom-icon' onClick={() => { this.goHome() }}>
              <img src={tabBar[0].src} alt='' />
              <span>首页</span>
            </div>
            <div className="mask" style={{ display: isShowService }} onClick={this.cusService}></div>
            <div className="cusService" style={{ display: isShowService, zIndex: '1000', position: 'fixed', width: '5rem', height: '5rem', top: '25%', left: '25%' }}>
              <img style={{ width: '100%', height: '100%' }} src={this.state.kefuImg} alt="" />
              <p style={{ color: '#fff', fontSize: '.32rem', marginTop: '.4rem', textAlign: 'center' }}>长按二维码联系客服</p>
            </div>
            <div className='detail-bottom-icon' onClick={this.cusService}>
              <img src={icons.service} alt='' />
              <span>客服</span>
            </div>
            {
              goods && goods.selltype == '0' &&
              <div className='detail-bottom-icon gouwuche' onClick={this.goCart}>
                <img src={tabBar[2].src} alt='' />
                <span>购物车</span>
                {goods && goods.selltype === '0' && <DetailNum />}
              </div>
            }
          </div>
          <div style={{ display: 'flex' }}>

            {/* 单买加入购物车 */}
            {
              goods && goods.selltype == '0' && goods.isshow != '3' && goods.gnum != '0' && goods.spike != '1' && goods.is_experience !== '2' &&
              < button className='d-bottom-button-j' style={{ backgroundColor: rgbToRgba(store.getState().mallConfig.theme_background_color, 0.5) }} onClick={(e) => { this.showDrawer(e); this.setState({ type: 0, selltype: 0 }) }}>
                加入购物车
              </button>
            }

            {/* 单买立即购买 */}
            {
              goods && goods.selltype == '0' && goods.isshow != '3' && goods.gnum != '0' && goods.spike != '1' && goods.is_experience !== '2' &&
              < button className='d-bottom-button-d'
                onClick={(e) => { this.showDrawer(e); this.setState({ type: 1, selltype: 0 }) }}>
                立即购买
              </button>
            }

            {/* 拼团的直接购买 */}
            {
              goods && (goods.selltype == '4' || goods.selltype == '1' || goods.selltype == '6') && goods.isshow != '3' && goods.gnum != '0' && goods.show_tuandetail_buynow == 0 && goods.is_experience !== '2' &&
              <button className='d-bottom-button-t-z'
                style={{ backgroundColor: rgbToRgba(store.getState().mallConfig.theme_background_color, 0.5) }}
                onClick={(e) => this.ogAppearDrawer(e)}>
                <p>
                  <span>{memberExpiration ? '会员价' : ''}&yen;</span>
                  {memberExpiration ? goods.danmai_memberprice : goods.oprice}
                </p>
                <p>直接购买</p>
              </button>
            }

            {/* 拼团的购买方式 */}
            {
              goods && (goods.selltype == '4' || goods.selltype == '1' || goods.selltype == '6') && goods.isshow != '3' && goods.gnum != '0' && goods.is_experience !== '2' &&
              <button className='d-bottom-button-t' onClick={(e) => this.gAppearDrawer(e)} style={{ width: goods.show_tuandetail_buynow == 0 ? '2.97rem' : '5rem' }}>
                {/* 不是秒杀的拼团 */}
                {
                  (goods.spikeT == '1' && goods.selltype == '1') ?
                    <></> :
                    <p>
                      <span>{memberExpiration ? '会员价' : ''}&yen;</span>
                      {memberExpiration ? goods.pintuan_memberprice : groupPrice}
                    </p>
                }
                <p>
                  {(goods.spikeT == '1' && goods.selltype == '1') ? text : `${goods.groupnum}人拼团`}
                </p>
              </button>
            }


            {/* 订金团按钮 */}
            {
              goods && goods.selltype == '7' && goods.isshow != '3' && goods.gnum != '0' && goods.is_experience !== '2' &&
              <button className='d-bottom-deposit'
                onClick={(e) => { this.showDrawer(e); this.setState({ type: 1, selltype: 0 }) }}>
                <p>{groupinfo.tuan_id === 0 ? '立即开团' : '立即参团'} </p>
              </button>
            }

            {/* 单买秒杀按钮 */}
            {
              goods && goods.selltype == '0' && goods.isshow != '3' && goods.gnum != '0' && goods.spike == '1' && goods.is_experience !== '2' &&
              <button style={{ backgroundColor: bgColor }} onClick={(e) => this.oAppearDrawer(e)} className='dan-kill'>
                {text}
              </button>
            }

            {/* 售罄按钮 */}
            {
              goods && (goods.isshow == '3' || goods.gnum == '0') && goods.is_experience !== '2' &&
              <button className='maiwan' onClick={this.goHome}>
                已售罄&nbsp;&nbsp;查看别的商品
            </button>
            }

            {/* 
            *
            * time: 2020-12-25
            * content: 提货卡按钮, 提交方法
            * author: lkd
            * 
            */}
            {/* 提货卡 */}
            {
              goods && goods.is_experience === '2' &&
              <button className='d-bottom-exchange' onClick={this.props.exchangeCard}>立即兑换</button>
            }

          </div>



        </footer >
        {
          goods && <DetailDrawer style={this.props.style}
            hideDrawer={this.hideDrawer}
            goods={goods}
            num={num}
            type={type}
            selltype={selltype}
            decrementNum={this.bottomDecrement}
            incrementNum={this.bottomIncrement}
            memberExpiration={memberExpiration}
          />
        }
      </Fragment >
    )
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)
  }

  goCart = () => {
    this.props.goCart()
  }

  cusService = async () => {
    let Res = await _getOrderDetail(this.networkConfig.getKeFuImg)
    this.setState({
      showService: !this.state.showService,
      kefuImg: Res.data.data
    })
  }

  goHome = () => {
    dropByCacheKey('DetailComponent')
    this.props.goHome()
  }

  showDrawer = (e) => {
    this.props.showDrawer()
  }

  hideDrawer = (e) => {
    this.props.hideDrawer()
  }


  bottomIncrement = () => {
    this.props.incrementNum()
  }

  bottomDecrement = () => {
    this.props.decrementNum()
  }

  ogAppearDrawer(e) {
    const { goods } = this.props
    if (goods.spikeT === '1') {
      if (goods.gnum <= 0) {
        Toast.info('已售罄')
      } else if (this.countdown <= 0) {

        Toast.info('活动已结束')
      } else {
        this.showDrawer(e)
        this.setState({ type: 1, selltype: 0 })
      }
    } else {
      this.showDrawer(e)
      this.setState({ type: 1, selltype: 0 })
    }
  }

  gAppearDrawer(e) {
    const { goods } = this.props
    if (this.distanceCountdown > 0) {
      Toast.info('活动未开始')
    } else if (goods.gnum <= 0) {
      Toast.info('已售罄')
    } else if (this.countdown <= 0) {
      Toast.info('活动已结束')
    } else {
      this.showDrawer(e)
      this.setState({ type: 1, selltype: 1 })
    }
  }

  oAppearDrawer(e) {
    const { goods } = this.props
    if (this.distanceCountdown > 0) {
      Toast.info('活动未开始')
    } else if (goods.gnum <= 0) {
      Toast.info('已售罄')
    }
    else if (this.countdown <= 0) {
      Toast.info('活动已结束')
    } else {
      this.showDrawer(e)
      this.setState({ type: 1, selltype: 0 })
    }
  }

  componentDidMount() {
    EventBus.addListener('countdown', this.changeButton)
    let id
    let { goods } = this.props

    if (goods && goods.id) {
      id = goods.id
    }

    if (!goods) {
      throw new Error(JSON.stringify(goods) + `详情页goodsinfo错误--------商品id=${id ? id : '抱歉id出错'}`)
    } else if (!goods.selltype) {
      throw new Error(JSON.stringify(goods.selltype) + `详情页selltype错误--------商品id=${id ? id : '抱歉id出错'}`)
    } else if (!goods.isshow) {
      throw new Error(JSON.stringify(goods.isshow) + `详情页isshow错误--------商品id=${id ? id : '抱歉id出错'}`)
    } else if (!goods.gnum) {
      throw new Error(JSON.stringify(goods.gnum) + `详情页gnum错误--------商品id=${id ? id : '抱歉id出错'}`)
    } else if (!goods.spike) {
      throw new Error(JSON.stringify(goods.spike) + `详情页spike错误--------商品id=${id ? id : '抱歉id出错'}`)
    } else if (!goods.spikeT) {
      throw new Error(JSON.stringify(goods.spikeT) + `详情页spikeT错误--------商品id=${id ? id : '抱歉id出错'}`)
    }

    let text, bgColor, groupPrice
    if ((goods.spikeT == '1' && goods.selltype == '1') || (goods.spike == '1' && goods.selltype == '0')) {
      this.countdown = parseInt(this.props.goods.spike_end) - (Date.parse(new Date()) / 1000)
      // this.countdown = -2
      this.distanceCountdown = parseInt(this.props.goods.spike_start) - (Date.parse(new Date()) / 1000)
      // this.distanceCountdown = -2
      if (this.distanceCountdown > 0) {
        text = '活动未开始'
        bgColor = '#2b2e33'
      } else if (this.countdown > 0) {
        if (goods.gnum <= 0) {
          text = '已售罄'
          bgColor = '#2b2e33'
        } else {
          if (goods.selltype == '0') {
            text = '立即秒杀'
            bgColor = 'var(--theme-font-color)'
          } else {
            text = '立即拼团'
          }
        }
      } else {
        text = '活动已结束'
        bgColor = '#2b2e33'
      }
    }

    if (goods.selltype == '1' || goods.selltype == '4' || goods.selltype == '6') {
      groupPrice = goods.gprice
    }

    this.setState({ text, bgColor, groupPrice })
  }

  componentWillUnmount() {
    EventBus.removeListener('countdown', this.changeButton)
  }

  changeButton = (selltype, type) => {
    // selltype: 0 单买 1 拼团
    // type: 1 未开始 2 开始 3 结束
    if (selltype == '0') {
      if (type == 2) {
        this.distanceCountdown = 0
        this.setState({
          text: '立即秒杀',
          bgColor: 'var(--theme-font-color)'
        })
      } else if (type == 3) {
        this.countdown = 0
        this.setState({
          text: '活动已结束',
          bgColor: '#2b2e33'
        })
      }
    } else {
      if (type == 2) {
        this.distanceCountdown = 0
        this.setState({
          text: '立即拼团'
        })
      } else if (type == 3) {
        this.countdown = 0
        this.setState({
          text: '活动已结束'
        })
      }
    }
  }
}

export default DetailBottomBar;