import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { store } from 'store/index'

import { _submitApi } from 'network/submit'


const scollConfig = {
  probeType: 1
}
const scrollStyle = {
  height: '5.08rem'
}

class TuanDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: []
    }
    this.option = ''
  }
  render() {
    let str = ''
    const { style, goods, num } = this.props
    const show = style ? 'block' : 'none'
    const { activeIndex } = this.state

    if (goods) {
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
        return item.title === str.substr(0, str.length - 1)
      })
    }
    // 往每个选项添加默认index 0 
    return (
      <DrawerStyle>
        <div className='mask' style={{ display: show }}
          onClick={(e) => { this.props.hideDrawer(e); setTimeout(() => { this.setState({ activeIndex: activeIndex.map(item => item = '') }) }, 1000) }}>
        </div>
        <div className='drawer' onClick={(e) => { e.stopPropagation() }} ref='drawer'>
          <div className='head'>
            <div className='head-img'>
              {goods ? <img src={goods.gimg} alt="" ref='img' /> : <img alt="" ref='img' />}
            </div>
            <div className='info'>
              {goods && <p>{goods.gname}</p>}
              {this.option ? <p>￥{this.option.marketprice}</p> : <p>￥{goods.gprice}</p>}
              <p>
                <span style={{ marginRight: '1rem' }}>已售：{goods.salenum}</span>
                <span>剩余：{goods.gnum}</span></p>
              <img src='https://res.lexiangpingou.cn/images/vip/chacha.png' alt=""
                onClick={(e) => { this.props.hideDrawer(e); setTimeout(() => { this.setState({ activeIndex: activeIndex.map(item => item = '') }) }, 1000) }} />
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
          <div className='ok'>
            <button onClick={(e) => { this.goSubmit(e) }}>去结算</button>
          </div>
        </div>

      </DrawerStyle >
    )
  }


  componentDidMount = () => {
    const { goods } = this.props
    /* if (goods) { */
    let ht = document.querySelector('html').style.fontSize.replace('px', '')
    let drawer = this.refs.drawer
    /* drawer.style.opacity = 0 */
    let img = this.refs.img
    let container = this.refs.container
    let h = drawer.offsetHeight + img.offsetHeight - ht * 1.87 + 100 + 10
    drawer.style.bottom = `-${h}px`
    // drawer.style.bottom = `0px`
    if (goods) {
      let result = goods.options_items.map(item => item.optionIndex)
      if (container && result.length < 3) {
        container.style.height = 'auto'
        this.setState({
          activeIndex: result
        })
      }
    }
  }

  componentDidUpdate = () => {
    const { goods, style } = this.props
    if (goods) {
      if (style) {
        let drawer = this.refs.drawer
        drawer.style.bottom = `0px`
        // drawer.style.opacity = 1
        let container = this.refs.container
        let result = goods.options_items.map(item => item.optionIndex)
        if (container && result.length < 3) {
          container.style.height = 'auto'
        }
      } else {
        let ht = document.querySelector('html').style.fontSize.replace('px', '')
        let drawer = this.refs.drawer
        // drawer.style.opacity = 1
        let img = this.refs.img
        let h = drawer.offsetHeight + img.offsetHeight - ht * 1.87
        drawer.style.bottom = `-${h}px`
      }
    }

  }

  change = (index, index1) => {
    let { activeIndex } = this.state
    activeIndex[index] = index1
    this.setState({
      activeIndex
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

  goSubmit = e => {
    e.stopPropagation()
    // 拼团存在规格 没有选择规格
    const { goods, num } = this.props
    const { appConfig } = store.getState()

    const option = this.option
    if (goods.hasoption === '1') {
      if (option === undefined) {
        Toast.info('请选择规格')
      } else {
        if (num === 0) {
          Toast.info('数量不能为0')
        } else {
          const goods_config = {
            action: 'buynow',
            data: {
              gid: goods.id,
              num,
              openid: appConfig.wxUserInfo.openid,
              buytype: 2,
              optionid: option.id
            }
          }
          _submitApi(goods_config).then(res => {
            if (parseInt(res.data.status) === 200) {
              this.props.hideDrawer(e)
              setTimeout(() => {
                this.props.history.push({ pathname: `/submit/2/${goods.id}/2/${num}/${this.option.id}/0` })
              }, 300)
            } else if (parseInt(res.data.status) === 400) {
              Toast.info(res.data.msg, 1)
            }
          })
        }
      }
    } else {
      if (num === 0) {
        Toast.info('数量不能为0')
      } else {
        const goods_config = {
          action: 'buynow',
          data: {
            gid: goods.id,
            num,
            openid: appConfig.wxUserInfo.openid,
            buytype: 2
          }
        }
        _submitApi(goods_config).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.props.hideDrawer(e)
            setTimeout(() => {
              this.props.history.push({ pathname: `/submit/2/${goods.id}/2/${num}/0/0` })
            }, 300)
          } else if (parseInt(res.data.status) === 400) {
            Toast.info(res.data.msg, 1)
          }
        })
      }
    }
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
  z-index: 1001;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .5);
}

.drawer  {
  position: fixed;
  left: .32rem;
  z-index: 9999 !important;
  transition: all .3s;
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
  text-align: center;
  float: right;
  width: 3.2rem;
  line-height: .64rem;
  border-radius: .4rem;
  border: 1px solid #ccc;
}

.jian {
  position: relative;
  float: left;
  width: 1rem;
  height: .6rem;
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
  float: right;
  width: 1rem;
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
  width: 8.72rem;
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
  opacity: .8;
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

export default withRouter(TuanDrawer);