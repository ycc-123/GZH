import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { store } from 'store/index'

import TabBarItem from './TabBarItem'

import { _apiU } from 'network/api'

import './tab.css'


const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)

class TabBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bottom: 'env(safe-area-inset-bottom)',
      tabArr: [],
    }
  }
  render() {
    const { bottom, tabArr } = this.state
    return (
      <footer className="tab-bar" style={{ bottom, height: '1.28rem' }}>
        {
          tabArr.map((item, index) => {
            return (
              <TabBarItem active={this.props.history.location.pathname === item.path ? true : false}
                onChangeActive={() => this.onChangeActive(item.path)}
                content={item}
                key={index}
                index={index}
                goHome={this.goHome}>
              </TabBarItem>
            )
          })
        }
      </footer>
    )
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.state) !== JSON.stringify(nextState)
  }

  onChangeActive = path => {
    this.props.history.push(path)
    // const { isApplet } = store.getState().appConfig
    if (this.props.goHome && this.props.history.location.pathname === '/home') {
      this.props.goHome()
    }
    // isApplet ? window.navigateToWebWiew('#' + path) : this.props.history.push(path)
  }

  componentDidMount = () => {
    const { tabBar } = store.getState().mallConfig
    // let tabArr = [
    //   { id: 1010, content: '首页', src: 'https://res.lexiangpingou.cn/images/vip/home.png', activeSrc: 'https://res.lexiangpingou.cn/images/vip/home1.png', path: '/home' },
    //   { id: 1011, content: '分类', src: 'https://res.lexiangpingou.cn/images/vip/category.png', activeSrc: 'https://res.lexiangpingou.cn/images/vip/category1.png', path: '/category' },
    //   { id: 1012, content: '购物车', src: 'https://res.lexiangpingou.cn/images/vip/cart.png', activeSrc: 'https://res.lexiangpingou.cn/images/vip/cart1.png', path: '/cart' },
    //   { id: 1013, content: '直播', src: 'https://res.lexiangpingou.cn/images/vip/live.png', activeSrc: 'https://res.lexiangpingou.cn/images/vip/live1.png', path: '/live/1013' },
    //   { id: 1014, content: '我的', src: 'https://res.lexiangpingou.cn/images/vip/profile.png', activeSrc: 'https://res.lexiangpingou.cn/images/vip/profile1.png', path: '/profile' }
    // ]

    let tabArr = [
      { id: 1010, content: '首页', src: tabBar[0].src, activeSrc: tabBar[0].activeSrc, path: '/home' },
      { id: 1011, content: '分类', src: tabBar[1].src, activeSrc: tabBar[1].activeSrc, path: '/category' },
      { id: 1012, content: '购物车', src: tabBar[2].src, activeSrc: tabBar[2].activeSrc, path: '/cart' },
      { id: 1013, content: '直播', src: tabBar[3].src, activeSrc: tabBar[3].activeSrc, path: '/live/1013' },
      { id: 1014, content: '我的', src: tabBar[4].src, activeSrc: tabBar[4].activeSrc, path: '/profile' }
    ]

    const action = 'menuDisplay'
    _apiU(action).then(res => {
      if (res?.data?.status === 200) {
        switch (res.data.data) {
          case 1:
            this.setState({
              tabArr
            })
            break
          case 2:
            this.setState({
              tabArr: tabArr.filter(item => item.content !== '分类')
            })
            break
          case 3:
            this.setState({
              tabArr: tabArr.filter(item => item.content !== '直播')
            })
            break
          case 4:
            this.setState({
              tabArr: tabArr.filter(item => item.content !== '直播' && item.content !== '分类')
            })
            break
          default:
            this.setState({
              tabArr
            })

        }
      } else {
        this.setState({
          tabArr
        })
      }
    })


  }
  goHome = () => {
    this.props.goHome()
  }
}

export default withRouter(TabBar)