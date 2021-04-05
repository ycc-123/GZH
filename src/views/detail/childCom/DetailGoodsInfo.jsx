import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'

import DetailSecondsKill from './DetailSecondsKill'
import DetailOrdernoSwiper from './DetailOrdernoSwiper'

import TeamPlay from 'common/teamPlay/TeamPlay'
import DetailPintuan from './DetailPintuan'

import { store } from 'store/index'

class DetailGoodsInfo extends Component {
  constructor(props) {
    super(props)
    this.escape2Html = str => {
      var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
      return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
    }
    this.state = {
      depositInfo: [
        { id: 1211, content: '参团订金', src: 'https://res.lexiangpingou.cn/images/vip/20201127/moneyblack.png' },
        { id: 1212, content: '成团时间', src: 'https://res.lexiangpingou.cn/images/vip/20201127/timeblack.png' },
      ],
      style: {
        width: '6.8rem',
        height: '.16rem',
        borderRadius: '.1rem',
        overflow: 'hidden'
      },
      barStyle: {
        height: '.16rem',
        border: '.08rem solid var(--theme-font-color)'
      },
      price: null,
      group_level: [],
      orderno: []
    }
  }

  render() {
    const { goods, tuanorder_progress, groupinfo, ys, kc, memberExpiration } = this.props
    const { depositInfo, price, group_level, orderno } = this.state
    const { appConfig } = store.getState()
    const kca = parseInt(kc) === 1 ? 'none' : 'block'
    const ysa = parseInt(ys) === 1 ? 'none' : 'inline-block'
    console.log(goods)
    return (
      <Fragment>
        <DetailSecondsKill goods={goods} />
        <div className='detail-goods-info'>
          <div className='detail-goods-info-p'>
            <p className='detail-goods-p'>{goods.gname}</p>
            <p className='detail-goods-p'>
              {goods.selltype === '7' && <span style={{ color: 'var(--common-font-color)', fontWeight: '400', fontSize: '.4rem', marginRight: '.1rem' }}>原价</span>}
              <span style={{ fontSize: '.32rem' }}>&yen;&nbsp;</span>
              <span>{price}</span>
              {
                goods.selltype !== '4' && goods.com_type === '1' && Number(goods.commissiontype) > 0 && appConfig.wxUserInfo.enable === '1' && goods.show_partjob_commission === '1' &&
                <span className='commission'>
                  <img src='https://res.lexiangpingou.cn/images/vip/20201127/commission.png' alt='' />
                  佣金&yen;{(Number(goods.commission)).toFixed(2)}
                </span>
              }
              {
                memberExpiration &&
                <>
                  <span className='detail-left'>会员价</span>
                  <span className='detail-right'>&yen;{goods.selltype === '0' ? goods.danmai_memberprice : goods.pintuan_memberprice}</span>
                </>
              }

            </p >
            <p className='detail-goods-p' ref='aaaa'>
              市场价:&nbsp;
              <span>￥</span>{goods.mprice}
              <span className='sales' style={{ display: "flex" }}>
                <span style={{ display: ysa, color: 'var(--theme-font-color)', fontSize: '.4rem', fontWeight: '600' }} className='sales-left'>已售{goods.salenum}</span>
                <span style={{ display: kca, color: 'var(--theme-font-color)', fontSize: '.4rem', fontWeight: '600' }}>剩余{goods.isshow === '3' ? 0 : goods.gnum}</span>
              </span>
            </p>
            <p className='detail-goods-p' style={{ marginTop: goods.goodsdesc ? '.4rem' : '0' }}></p>
          </div>
          {goods.isshowsend === '1' && <DetailOrdernoSwiper orderno={orderno} />}
          {/* 订金团、阶梯团*/}
          {(goods.selltype === '4' || goods.selltype === '7') && <div className='ladder'>
            <div className='ladder-play'>
              {goods.selltype === '4' && <p style={{ textAlign: 'center', fontSize: '.32rem', color: 'var(--common-font-color)', lineHeight: '1.8' }}>支付开团并邀请好友参加达到人数拿最低价,差价组团成功或到期后自动退款,详情见下方阶梯团玩法</p>}
              {goods.selltype === '7' && <Fragment>
                {depositInfo.map((item, index) => {
                  return (
                    <p style={{ display: 'flex', alignItems: 'center', marginBottom: index === 0 ? '.2rem' : '.4rem' }} key={item.id}>
                      <img style={{ width: '.37rem', height: '.37rem', marginRight: '.4rem' }} src={item.src} alt='' />
                      <span style={{ fontSize: '.29rem', lineHeight: '.37rem', height: '.37rem' }}>{`${item.content}：`}&nbsp;</span>
                      <span style={{ fontSize: '.29rem', lineHeight: '.37rem', height: '.37rem', color: '#FF4B4B' }}>&yen;{index === 0 ? goods.preprice : goods.endtime + '小时'}</span>
                    </p>
                  )
                })}
              </Fragment>}
              <button>拼团价</button>
              <div className='ladder-number'>
                <ul style={{ marginLeft: '2.03rem' }}>
                  {group_level.map((item, index) => {
                    return (
                      <li className='ladder-li' key={index} style={{ color: 'var(--common-font-color)', fontSize: '.32rem' }}>
                        <span style={{ marginLeft: '.4rem' }}>￥{item.groupprice}</span>
                        <span style={{ marginLeft: '.79rem' }}>{item.groupnum}人</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>}
          {/* <p style={{ display: 'none' }} className='detail-goods-p'>会员卡</p> */}
          {goods.selltype !== '0' && goods.is_experience !== '2' && <TeamPlay type={0} />}
          {goods.selltype !== '7' && groupinfo.one_group === 0 && tuanorder_progress.length !== 0 && goods.is_experience !== '2' && <DetailPintuan
            tuanorder_progress={tuanorder_progress}
            goods={goods}
            refresh={() => this.props.refresh()} />}
        </div>
        <div className="mendianxinxi" onClick={this.goDetailStore}>
          <span>门店信息</span>
          <span style={{ marginRight: '.55rem', fontSize: '.32rem' }}>进入店铺</span>
        </div>
      </Fragment>
    )
  }

  goDetailStore = () => {
    this.props.history.push(`/detailstore/${this.props.goods.merchantid}`)
  }

  decrement = () => {
    this.props.decrementNum()
  }

  increment = () => {
    this.props.incrementNum()
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { goods, tuanorder_progress, groupinfo, ys, kc } = this.props
    const arr = [goods, tuanorder_progress, groupinfo, ys, kc]
    const nGoods = nextProps.goods
    const ntuanorder_progress = nextProps.tuanorder_progress
    const ngroupinfo = nextProps.groupinfo
    const nys = nextProps.ys
    const nkc = nextProps.kc
    const arr1 = [nGoods, ntuanorder_progress, ngroupinfo, nys, nkc]

    return JSON.stringify(this.state) !== JSON.stringify(nextState) || JSON.stringify(arr) !== JSON.stringify(arr1)
  }

  componentDidMount = () => {
    let price
    const { goods, groupinfo, deliverrecord } = this.props
    let p = document.querySelectorAll('.detail-goods-info p')[3]
    new Promise(res => {
      p.innerHTML = this.escape2Html(goods.goodsdesc)
      res()
    }).then(res => {
      this.props.refresh()
    })

    // 判断价格
    if (goods.hasoption === '1' && goods.selltype === '0') {
      price = goods.option_price
    } else if (goods.selltype === '0') {
      price = goods.oprice
    } else if (goods.selltype === '1') {
      price = goods.gprice
    } else if (goods.selltype === '4') {
      price = goods.level_price
    } else if (goods.selltype === '6') {
      price = goods.gprice
    } else if (goods.selltype === '7') {
      price = goods.oprice
    }

    // 阶梯团和订金团排序
    if (goods.selltype === '4' || goods.selltype === '7') {
      for (let i = 0; i < groupinfo.group_level.length - 1; i++) {
        for (let j = 0; j < groupinfo.group_level.length - 1 - i; j++) {
          if (parseInt(groupinfo.group_level[j].groupnum) > parseInt(groupinfo.group_level[j + 1].groupnum)) {
            let temp = groupinfo.group_level[j];
            groupinfo.group_level[j] = groupinfo.group_level[j + 1];
            groupinfo.group_level[j + 1] = temp;
          }
        }
      }
    }

    this.setState({
      price,
      group_level: groupinfo.group_level,
      orderno: deliverrecord ? deliverrecord : []
    })





  }
}

export default withRouter(DetailGoodsInfo)