import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { store } from 'store/index'
import { _cartApi } from 'network/cart'
import { _submitApi } from 'network/submit'
import { getCartData } from 'store/actionCreators'

// import HomeGoodsList from '../../home/childCom/HomeGoodsList'

const scollConfig = {
  probeType: 1
}
const scrollStyle = {
  height: '5.08rem',
}

const wx = window.wx

class DetailDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: []
    }
    this.option = ''
  }
  render() {
    let str = ''
    let price, newPrice
    // type 1 拼团 selltype 0 直接购买
    // type 1 拼团 selltype 1 拼团购买
    const { style, goods, num, type, selltype, memberExpiration } = this.props
    console.log(memberExpiration)
    const show = style ? 'block' : 'none'
    const { activeIndex } = this.state
    // 往每个选项添加默认index 0 
    goods.options_items.forEach((item, index) => {
      item.optionIndex = ''
    })
    // 拼接默认规格
    goods.options_items.map((item, index) => {
      return item.option.map((optinItem, optionIndex) => {
        if (activeIndex[index] === optionIndex) {
          console.log(optinItem)
          str += optinItem + '+'
          return str
        }
        return str
      })
    })
    // 查找匹配的规格
    this.option = goods.options.find(item => {
      console.log(item.title)
      console.log(str.substr(0, str.length - 1))
      return item.title === str.substr(0, str.length - 1)
    })
    if (memberExpiration) {
      if (type === 1 && selltype === 0) {
        price = goods.danmai_memberprice
      } else if (type === 1 && selltype === 1) {
        price = goods.pintuan_memberprice
      } else if (type === 0) {
        price = goods.danmai_memberprice
      }
    } else if (goods.hasoption === '1' && goods.selltype === '0') {
      // 有规格 单买
      price = goods.option_price
    } else if (goods.selltype === '0') {
      // 没有规格单买
      price = goods.oprice
    } else if ((goods.selltype === '1' || goods.selltype === '6' || goods.selltype === '4') && selltype === 0) {
      // 拼团
      price = goods.oprice
    } else if ((goods.selltype === '1' || goods.selltype === '6' || goods.selltype === '4') && selltype === 1) {
      price = goods.gprice
    } else if (goods.selltype === '7') {
      price = goods.preprice
    }



    if (this.option && selltype === 0) {
      newPrice = this.option.productprice
    } else if (this.option && selltype === 1) {
      newPrice = this.option.marketprice
    } else if (this.option) {
      newPrice = this.option.marketprice
    }
    
    return (
      <DrawerStyle>
        <div className='mask' style={{ display: show }}
          onClick={(e) => { this.props.hideDrawer(e) }}>
        </div>
        <div className='drawer' onClick={(e) => { e.stopPropagation() }} ref='drawer'>
          <div className='head'>
            <div className='head-img'>
              <img src={goods.gimg} alt="" ref='img' />
            </div>
            <div className='info'>
              <p>{goods.gname}</p>
              {
                this.option ?
                  <p> {memberExpiration ? `vip: ￥${newPrice}` : `￥${newPrice}`}</p> :
                  <p>{goods.selltype === '7' ? `订金￥${price}` : (memberExpiration ? `vip: ￥${price}` : `￥${price}`)}</p>
              }
              {this.option && <p>请选择规格</p>}
              <img src='https://res.lexiangpingou.cn/images/vip/chacha.png' alt=""
                onClick={(e) => { this.props.hideDrawer(e) }} />
            </div>
          </div>
          { /*三个规格以上*/}
          {goods.hasoption === '1' && goods.options_items.length > 2 && <div className='container'>
            <BetterScroll config={scollConfig}
              style={scrollStyle}
              ref='scroll'>
              {goods.options_items.map((item, index) => {
                return (
                  <div key={item + index}>
                    <p className='optionName'>{item.name}</p>
                    <div className='box'>
                      {item.option.map((optionsItem, index1) => {
                        return (
                          <button key={optionsItem + index1}
                            style={{ background: activeIndex[index] === index1 ? 'var(--theme-font-color)' : '' }}
                            onClick={() => { this.change(index, index1) }}>
                            {optionsItem}</button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </BetterScroll>
          </div>}
          {/*两个规格以下*/}
          {goods.hasoption === '1' && goods.options_items.length <= 2 && <div className='container' ref='container'>
            {goods.options_items.map((item, index) => {
              return (
                <div key={item + index}>
                  <p className='optionName'>{item.name}</p>
                  <div className='box'>
                    {item.option.map((optionsItem, index1) => {
                      return (
                        <button key={optionsItem + index1}
                          style={{ background: activeIndex[index] === index1 ? 'var(--theme-font-color)' : '' }}
                          onClick={() => { this.change(index, index1) }}>
                          {optionsItem}</button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>}

          {/*没有规格*/}
          <div className='num'>
            <p className='calculate1'>
              <span className='num-str'>数量</span>
              <button className='jian' onClick={(e) => { this.decrement(e) }}></button>
              {num}
              <button className='jia' onClick={(e) => { this.increment(e) }}></button>
            </p>
          </div>
          {type === 0 && <div className='ok'>
            <button onClick={(e) => { this.addCart(e) }}>确定</button>
          </div>}
          {type === 1 && <div className='ok'>
            <button onClick={(e) => { this.goSubmit(e) }}>确定</button>
          </div>}
        </div>

      </DrawerStyle>
    )
  }

  componentDidMount = () => {
    let ht = document.querySelector('html').style.fontSize.replace('px', '')
    let drawer = this.refs.drawer
    let img = this.refs.img
    let container = this.refs.container
    let h = drawer.offsetHeight + img.offsetHeight - ht * 1.87 + 50
    console.log(h)
    drawer.style.bottom = `-${h}px`
    const { goods } = this.props
    let result = goods.options_items.map(item => item.optionIndex)
    if (container && result.length < 3) {
      container.style.height = 'auto'
      this.setState({
        activeIndex: result
      })
    }

  }

  componentDidUpdate = () => {
    if (this.props.style) {
      let drawer = this.refs.drawer
      drawer.style.bottom = `0`
    } else {
      let ht = document.querySelector('html').style.fontSize.replace('px', '')
      let drawer = this.refs.drawer
      let img = this.refs.img
      let h = drawer.offsetHeight + img.offsetHeight - ht * 1.87 + 2
      drawer.style.bottom = `-${h}px`
    }
  }

  change = (index, index1) => {
    let { activeIndex } = this.state
    activeIndex[index] = index1
    this.setState({
      activeIndex
    }, () => {
      console.log(this.state.activeIndex)
    })
  }

  decrement = (e) => {
    e.stopPropagation()
    this.props.decrementNum()
  }

  increment = (e) => {
    e.stopPropagation()
    this.props.incrementNum()
  }


  addCart = (e) => {
    e.stopPropagation()
    const { activeIndex } = this.state
    const { appConfig } = store.getState()
    activeIndex.filter(item => {
      return item === ''
    })
    // 判断是否全部选中
    if (activeIndex.filter(item => item === '').length !== 0) {
      Toast.info('请选择规格')
    } else {
      // 商品数量为0时
      const { goods, num } = this.props
      if (num === 0) {
        Toast.info('数量不能为0');
      } else if (goods.hasoption === '1') {
        const add_config = {
          action: 'cartAdd',
          data: {
            uniacid: appConfig.uniacid,
            openid: appConfig.wxUserInfo.openid,
            gid: goods.id,
            num,
            optionid: this.option.id
          }
        }
        _cartApi(add_config).then(res => {
          const action = getCartData(res.data.data)
          store.dispatch(action)
          this.props.hideDrawer(e)
          setTimeout(() => {
            Toast.success('添加成功', 1)
          }, 1000)
        })
      } else if (goods.hasoption === '0') {
        const add_config = {
          action: 'cartAdd',
          data: {
            uniacid: appConfig.uniacid,
            openid: appConfig.wxUserInfo.openid,
            gid: goods.id,
            num
          }
        }
        _cartApi(add_config).then(res => {
          const action = getCartData(res.data.data)
          store.dispatch(action)
          this.props.hideDrawer(e)
          setTimeout(() => {
            Toast.success('添加成功', 1)
          }, 1000)
        })
      }
    }
  }

  goSubmit = (e) => {
    e.stopPropagation()
    const { goods, num, selltype } = this.props
    const { wxUserInfo, isApplet } = store.getState().appConfig
    // 阶梯 订金没有规格
    if (goods.selltype === '4' || goods.selltype === '7') {
      const goods_config = {
        action: 'buynow',
        data: {
          gid: this.props.match.params.id,
          num,
          openid: wxUserInfo.openid,
          buytype: 2,
        }
      }
      _submitApi(goods_config).then(res => {
        if (parseInt(res.data.status) === 200) {
          this.props.hideDrawer(e)
          this.timer = setTimeout(() => {
            isApplet ? window.navigateToWebWiew(`#/submit/2/${goods.id}/2/${num}/0/0`) : this.props.history.push({ pathname: `/submit/2/${goods.id}/2/${num}/0/0` })
          }, 300)
        } else if (parseInt(res.data.status) === 400) {
          Toast.info(res.data.msg, 1)
        }
      })
    }
    // 团购存在规格 没有选择规格
    // 判断限购
    if (goods.hasoption === '1' && (goods.selltype === '1' || goods.selltype === '6')) {
      if (this.option === undefined) {
        Toast.info('请选择规格')
      } else {
        // 商品数量为0时
        if (num === 0) {
          Toast.info('数量不能为0');
        } else if (selltype === 1 && (goods.selltype === '1' || goods.selltype === '6')) {   // 拼团购买
          const goods_config = {
            action: 'buynow',
            data: {
              gid: this.props.match.params.id,
              num,
              openid: wxUserInfo.openid,
              buytype: 2,
              optionid: this.option.id
            }
          }
          _submitApi(goods_config).then(res => {
            if (parseInt(res.data.status) === 200) {
              this.props.hideDrawer(e)
              this.timer = setTimeout(() => {
                isApplet ? window.navigateToWebWiew(`#/submit/2/${goods.id}/2/${num}/${this.option.id}/0`) : this.props.history.push({ pathname: `/submit/2/${goods.id}/2/${num}/${this.option.id}/0` })
              }, 300)
            } else if (parseInt(res.data.status) === 400) {
              Toast.info(res.data.msg, 1)
            }
          })
        } else if (selltype === 0 && (goods.selltype === '1' || goods.selltype === '6')) {  // 拼团直接购买
          const goods_config = {
            action: 'buynow',
            data: {
              gid: this.props.match.params.id,
              num,
              openid: wxUserInfo.openid,
              buytype: this.props.match.params.buytype,
              optionid: this.option.id
            }
          }

          _submitApi(goods_config).then(res => {
            if (parseInt(res.data.status) === 200) {
              this.props.hideDrawer(e)
              this.timer = setTimeout(() => {
                isApplet ? window.navigateToWebWiew(`#/submit/2/${goods.id}/1/${num}/${this.option.id}/0`) : this.props.history.push({ pathname: `/submit/2/${goods.id}/1/${num}/${this.option.id}/0` })
              }, 300)
            } else if (parseInt(res.data.status) === 400) {
              Toast.info(res.data.msg, 1)
            }
          })
        }

      }
    } else if (goods.hasoption === '0' && (goods.selltype === '1' || goods.selltype === '6')) {  // 拼团不存在规格
      // // 拼团单买 
      if (selltype === 0) {
        const goods_config = {
          action: 'buynow',
          data: {
            gid: this.props.match.params.id,
            num,
            openid: wxUserInfo.openid,
            buytype: 2
          }
        }

        _submitApi(goods_config).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.props.hideDrawer(e)
            this.timer = setTimeout(() => {
              isApplet ? window.navigateToWebWiew(`#/submit/2/${goods.id}/1/${num}/0/0`) : this.props.history.push({ pathname: `/submit/2/${goods.id}/1/${num}/0/0` })
            }, 300)
          } else if (parseInt(res.data.status) === 400) {
            Toast.info(res.data.msg, 1)
          }
        })

      } else if (selltype === 1) {
        // 拼团不存在规格
        const goods_config = {
          action: 'buynow',
          data: {
            gid: this.props.match.params.id,
            num,
            openid: wxUserInfo.openid,
            buytype: 2
          }
        }

        _submitApi(goods_config).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.props.hideDrawer(e)
            this.timer = setTimeout(() => {
              isApplet ? window.navigateToWebWiew(`#/submit/2/${goods.id}/2/${num}/0/0`) : this.props.history.push({ pathname: `/submit/2/${goods.id}/2/${num}/0/0` })
            }, 300)
          } else if (parseInt(res.data.status) === 400) {
            Toast.info(res.data.msg, 1)
          }
        })
      }

    } else if (goods.hasoption === '1' && goods.selltype === '0') {
      // 存在规格的单买商品
      if (this.option === undefined) {
        Toast.info('请选择规格')
      } else {
        if (num === 0) {
          Toast.info('商品数量不能为0')
        } else {
          const goods_config = {
            action: 'buynow',
            data: {
              gid: this.props.match.params.id,
              num,
              openid: wxUserInfo.openid,
              buytype: 1,
              optionid: this.option.id
            }
          }

          _submitApi(goods_config).then(res => {
            if (parseInt(res.data.status) === 200) {
              this.props.hideDrawer(e)
              this.timer = setTimeout(() => {
                isApplet ? window.navigateToWebWiew(`#/submit/0/${goods.id}/1/${num}/${this.option.id}/0`) : this.props.history.push({ pathname: `/submit/0/${goods.id}/1/${num}/${this.option.id}/0` })
              }, 300)
            } else if (parseInt(res.data.status) === 400) {
              Toast.info(res.data.msg, 1)
            }
          })
        }
      }
    } else if (goods.hasoption === '0' && goods.selltype === '0') {  // 不存在规格的单买商品
      if (num === 0) {
        Toast.info('商品数量不能为0')
      } else {
        const goods_config = {
          action: 'buynow',
          data: {
            gid: this.props.match.params.id,
            num,
            openid: wxUserInfo.openid,
            buytype: 1,
          }
        }
        _submitApi(goods_config).then(res => {
          console.log(res)
          if (parseInt(res.data.status) === 200) {
            this.props.hideDrawer(e)
            this.timer = setTimeout(() => {
              isApplet ? window.navigateToWebWiew(`#/submit/0/${goods.id}/1/${num}/0/0`) : this.props.history.push({ pathname: `/submit/0/${goods.id}/1/${num}/0/0` })
            }, 300)
          } else if (parseInt(res.data.status) === 400) {
            Toast.info(res.data.msg, 1)
          }
        })
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

}

const DrawerStyle = styled.div`

.num-str {
  position: absolute;
  left: 0;
}

.mask {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .5);
}

.drawer  {
  position: fixed;
  left: .32rem;
  z-index: 9999 !important;
  transition: bottom .3s;
  padding: 0 .32rem;
  width: 9.36rem;
  background: #fff;
  border-top-left-radius: .13rem;
  border-top-right-radius: .13rem;
}

.head {
  position: relative;
  height: 1.87rem;
}

.head-img {
  position: absolute;
  bottom: 0;
  border-radius: .13rem;
  width: 2.67rem;
  height: 2.67rem;
  overflow: hidden;
}

.head-img img {
  width: 100%;
  height: 100%;
}


.head button {
  position: absolute;
  right: 0;
  width: 2rem;
  height: 1.5rem;
  border: none;
  font-size: .5rem;
  background: transparent;
}

.container {
  position: relative;
  margin-top: .32rem;
  height: 5.08rem;
  font-size: .4rem;
  border-bottom: 1px solid #ccc;
}

.box {
  display: flex;
  flex-wrap: wrap;
  padding-top: .32rem;
}

.container button{
  height: .72rem;
  padding: 0 .26rem; 
  margin-right: .4rem;
  margin-bottom: .32rem;
  background: #ccc;
  border: none;
  color: #fff;
  border-radius: .45rem;
  background: #dadada;
}


.num {
  position: relative;
  padding-top: .32rem;
  height: 1rem;
}
.num p {
  font-size: .4rem;
}

.calculate1 {
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
  width: 3.2rem;
  height: .64rem;
  line-height: .64rem;
  border-radius: .4rem;
  border: 1px solid #ccc;
}

.jian {
  position: relative;
  width: 1rem;
  height: .6rem;
  left: -.5rem;
  background: none;
}

.jian::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: .3rem;
  height: .05rem;
  background: #ccc;
}

.jia {
  position: relative;
  width: 1rem;
  right: -.5rem;
  height: .6rem;
  background: none;
}

.jia::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: .05rem;
  height: .3rem;
  background: #ccc;
}

.jia::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: .3rem;
  height: .05rem;
  background: #ccc;
}

.ok {
  display: flex;
  align-items: center;
  height: 2.13rem;
}

.ok button{
  width: 100%;
  height: .93rem;
  background: var(--theme-font-color);
  border-radius: .4rem;
  color: #fff;
}

.info {
  position: relative;
  display: inline-block;
  width: calc(100% - 3.5rem);
  height: 100%;
  margin-left: 2.9rem;
}
.info p {
  width: calc(100% - .3rem);
  line-height: 1;
  margin-top: .25rem;
}
.info p:first-child {
  font-size: .32rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info p:nth-child(2) {
  font-size: .4rem;
}

.info p:nth-child(3) {
  color: #ccc;
  font-size: .32rem;
}

.info img {
  position: absolute;
  top: 10%;
  left: 100%;
  width: .53rem;
  height: .53rem;
}

`

export default withRouter(DetailDrawer);