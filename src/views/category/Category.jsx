import React, { PureComponent, Fragment } from 'react'

import BetterScroll from 'common/betterScroll/BetterScroll'
import TabBar from 'common/tabBar/TabBar'
import LiveButton from 'content/live/LiveButton'

import CategoryLeftItem from './childCom/CategoryLeftItem'
import CategoryRight from './childCom/CategoryRight'
import CategoryTabBar from './childCom/CategoryTabBar'
import CategoryGuide from './childCom/CategoryGuide'

import { setTitle } from 'commons/utils'

import { store } from 'store/index'

import axios from 'axios'
import { _categoryLeft, _categoryRight } from 'network/category'
import { _chatRoom } from "network/live"
import { _setPVUV } from 'network/api'

import './style/category.css'

class Category extends PureComponent {
  constructor(props) {
    super(props)
    props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.state = {
      ys: '',
      kc: '',
      title: [],
      defaultIndex: 0,
      type: 'goods',
      live: ''
    }
  }
  render() {
    const { title, defaultIndex, goods, ys, kc, type, live, memberExpiration = false } = this.state
    const { cartGoods } = store.getState()

    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      width: '2.46rem',
      height: 'calc((100vh - 1.48rem) - env(safe-area-inset-bottom))',
    }

    if (title.length !== 0 && title[defaultIndex].goods.length !== 0) {
      title[defaultIndex].goods.forEach(item => {
        // 查找购物车商品是否和state的某个goods相等
        let newGoods = cartGoods.find(cartItem => {
          return cartItem.sid === item.id
        })
        // console.log(newGoods)
        if (newGoods) {
          item.num = newGoods.num
        } else {
          item.num = 0
        }
      })
    }

    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--tab-color)' }}>
        <CategoryGuide />
        <div className='category'>
          {live !== '' && <LiveButton live={live} />}
          <div className='category-head-button'>
            {type === 'goods' ? <img src='https://res.lexiangpingou.cn/images/vip/left.png' alt="" onClick={this.changeImage} />
              : <img src='https://res.lexiangpingou.cn/images/vip/right.png' alt="" onClick={this.changeImage} />}
          </div>
          <div className='category-main'>
            {type === 'goods' ? <Fragment><div className='categoryLeft'>
              <ul>
                {title.length !== 0 && <BetterScroll config={scollConfig} style={scrollStyle} ref='scroll'>
                  <li className='category-left-head'></li>
                  {title.map((item, index) => {
                    return (
                      <CategoryLeftItem key={item.id + index}
                        item={item}
                        index={index}
                        active={this.state.defaultIndex === index ? true : false}
                        onChangeActive={() => { this.onChangeActive(index) }} />
                    )
                  })}
                </BetterScroll>}
              </ul>
            </div>
              {title.length !== 0 && title[defaultIndex].goods.length !== 0 && <CategoryRight memberExpiration={memberExpiration} goodsList={title[defaultIndex].goods} ys={ys} kc={kc} />}
            </Fragment> : <Fragment>
              {title.length !== 0 && <CategoryTabBar title={title} index={defaultIndex} changeActive={this.onChangeActive} goodsList={title[defaultIndex].goods} ys={ys} kc={kc} />}
            </Fragment>}
            {
              ((title.length !== 0 && title[defaultIndex].goods.length === 0) || title.length === 0) && <div className='wutu' style={{ color: 'var(--font-color)', width: type === 'goods' ? '7.26rem' : '100vw' }}>
                <img style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '2rem', height: '' }} src='https://res.lexiangpingou.cn/images/vip/fengleiwu.png' alt="" />
                <p style={{ position: 'absolute', fontSize: '.32rem', top: '60%', left: '50%', transform: 'translate(-50%, 0)', }}>商家正在努力上新中</p>
              </div>
            }
          </div>
          <TabBar />
        </div>
      </div>

    )
  }
  changeImage = () => {
    if (this.state.type === 'swiper') {
      this.setState({
        type: 'goods'
      })
    } else {
      this.setState({
        type: 'swiper'
      })
    }
  }


  componentDidRecover = () => {
    const { defaultIndex, title } = this.state
    const { appConfig } = store.getState()
    _setPVUV()

    if (title.length !== 0) {
      const live_config = {
        op: 'GetLiveStatusInfo',
        uniacid: appConfig.uniacid,
      }

      const right_config = {
        action: 'getGoodsByCategory',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          cid: title[defaultIndex].id,
          pagesize: 100
        }
      }

      axios.all([
        _categoryRight(right_config),
        _chatRoom(live_config),
      ]).then(res => {
        title[defaultIndex].goods = (res[0] && res[0].data && res[0].data.data && res[0].data.data.list) || []
        this.setState({
          ys: res[0].data.data.issell,
          kc: res[0].data.data.showPubStock,
          title,
          live: (res[1] && res[1].data) || ''
        })
      })
    } else {
      _categoryLeft().then(res => {
        if (res.data.data.length !== 0) {
          const right_config = {
            action: 'getGoodsByCategory',
            data: {
              uniacid: appConfig.uniacid,
              openid: appConfig.wxUserInfo.openid,
              cid: res.data.data[0].id,
              pagesize: 100
            }
          }
          _categoryRight(right_config).then(res1 => {
            let title = (res.data && res.data.data) || []
            title[0].goods = (res1.data && res1.data.data && res1.data.data.list) || []
            this.setState({
              title
            }, () => {
              this.refs.scroll.BScroll.refresh()
            })
          })
        }
      })
    }
  }

  componentDidMount = () => {
    setTitle('分类')

    const { appConfig } = store.getState()

    const live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }

    _chatRoom(live_config).then(res => {
      this.setState({
        live: (res && res.data) || ''
      })
    })
    _setPVUV()

    _categoryLeft().then(res => {
      console.log(res)
      if (res.data.data.length !== 0) {
        const right_config = {
          action: 'getGoodsByCategory',
          data: {
            uniacid: appConfig.uniacid,
            openid: appConfig.wxUserInfo.openid,
            cid: res.data.data[0].id,
            pagesize: 100
          }
        }
        _categoryRight(right_config).then(res1 => {
          let title = (res.data && res.data.data) || []
          title[0].goods = (res1.data && res1.data.data && res1.data.data.list) || []
          this.setState({
            title,
            memberExpiration: res1?.data?.data?.memberExpiration
          }, () => {
            this.refs.scroll.BScroll.refresh()
          })
        })
      }
    })
  }

  onChangeActive = index => {
    const { appConfig } = store.getState()
    let { title } = this.state
    if (!title[index].goods) {
      const right_config = {
        action: 'getGoodsByCategory',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          cid: this.state.title[index].id,
          pagesize: 100
        }
      }
      _categoryRight(right_config).then(res => {
        title[index].goods = (res.data && res.data.data && res.data.data.list) || []
        this.setState({
          ys: res.data.data.issell,
          kc: res.data.data.showPubStock,
          title,
          defaultIndex: index
        })
      })
    } else {
      this.setState({
        defaultIndex: index
      })
    }
  }


}

export default Category