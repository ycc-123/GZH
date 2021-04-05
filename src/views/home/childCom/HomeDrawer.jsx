import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'


import BetterScroll from 'common/betterScroll/BetterScroll'


import { store } from 'store/index'
import { getCartData } from 'store/actionCreators'
import { _showCart, _cartApi } from 'network/cart'

const scollConfig = {
  probeType: 1
}
const scrollStyle = {
  height: '5.08rem',
}

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
    const { style, goods, num, memberExpiration } = this.props
    const show = style ? 'block' : 'none'
    const { activeIndex } = this.state
    // 往每个选项添加默认index 0 
    goods.options_items.forEach((item, index) => {
      item.optionIndex = 0
    })
    // 拼接默认规格
    goods.options_items.map((item, index) => {
      item.option.map((optinItem, optionIndex) => {
        if (activeIndex[index] === optionIndex) {
          str += optinItem + '+'
        }
      })
    })
    console.log(memberExpiration)
    // 查找匹配的规格
    this.option = goods.options.find(item => {
      return item.title === str.substr(0, str.length - 1)
    })
    return (
      <DrawerStyle>
        <div className='mask' style={{ display: show }}
          onClick={(e) => { this.props.hideDrawer(e); this.setState({ activeIndex: activeIndex.map(item => item = 0) }) }}>
        </div>
        <div className='drawer' style={{ display: show }} onClick={(e) => { e.stopPropagation() }} ref='drawer'>
          <div className='head'>
            <div className='head-img'>
              <img src={goods.gimg} alt="" ref='img' />
            </div>
            <div className='info'>
              <p>{goods.gname}</p>
              {this.option && <p>￥{this.option.productprice}</p>}
              {/* {productprice !== '' && <p>￥{goods.options[defaultIndex].productprice}</p>} */}
              <p>请选择规格</p>
              <img src='https://res.lexiangpingou.cn/images/vip/chacha.png' alt=''
                onClick={(e) => { this.props.hideDrawer(e); this.setState({ activeIndex: activeIndex.map(item => item = 0) }) }} />
            </div>
          </div>

          {goods.hasoption === '1' && <div className='container'>
            <BetterScroll config={scollConfig}
              style={scrollStyle}>
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



          <div className='num'>
            <p>数量</p>
            <p className='calculate1'>
              <button className='jian' onClick={(e) => { this.decrement(e) }}></button>
              {num}
              <button className='jia' onClick={(e) => { this.increment(e) }}></button>
            </p>
          </div>
          <div className='ok'>
            <button onClick={(e) => { this.addCart(e) }}>确定</button>
          </div>
        </div>

      </DrawerStyle>
    )
  }

  /* shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)
  } */

  componentDidMount = () => {

    let ht = document.querySelector('html').style.fontSize.replace('px', '')
    let drawer = this.refs.drawer
    let img = this.refs.img
    let h = drawer.offsetHeight + img.offsetHeight - ht * 1.87
    drawer.style.bottom = `-${h}px`
    console.log(drawer.style.bottom)
    drawer.style.bottom = `0px`
    console.log(drawer.style.bottom)
    const { goods } = this.props
    let result = goods.options_items.map(item => item.optionIndex)
    this.setState({
      activeIndex: result
    }, () => { console.log(this.state) })
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
  addCart = async () => {
    const { goods, num } = this.props
    let { activeIndex } = this.state
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    if (num === 0) {
      Toast.info('数量不能为0');
    } else {
      const add_config = {
        action: 'cartAdd',
        data: {
          uniacid: appConfig.uniacid,
          openid: wxUserInfo.openid,
          gid: goods.id,
          num,
          optionid: this.option.id
        }
      }
      const res = await _cartApi(add_config)
      const result = await _showCart()
      const action = getCartData(result.data.data)
      store.dispatch(action)
      this.props.hideDrawer()
      this.setState({ activeIndex: activeIndex.map(item => item = 0) })
      Toast.success('添加成功到购物车', 1)
    }
  }

}

const DrawerStyle = styled.div`
.mask {
  position: fixed;
  top: 0;
  z-index: 999 !important;
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
  padding-top: .32rem;
  height: 1.98rem;
}
.num p {
  font-size: .4rem;
}

.calculate1 {
  text-align: center;
  float: right;
  width: 3.2rem;
  height: .64rem;
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
}

.ok button{
  width: 100%;
  height: .93rem;
  color: #fff;
  background: var(--theme-font-color);
  border-radius: .4rem;
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