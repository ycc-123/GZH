import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { store } from 'store/index'

class GroupBottomBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }
  render() {
    const { text } = this.state
    const { tabBar } = store.getState().mallConfig
    return (
      <Style>
        <footer className='bar'>
          <div className='icon' onClick={() => { this.goHome() }}>
            <img src='https://res.lexiangpingou.cn/images/vip/home.png' alt='' />
            <span>首页</span>
          </div>
          <button className='xiaohuoban' onClick={this.goGroup}>
            {text}
          </button>
        </footer>
      </Style>
    );
  }

  componentDidMount() {
    let { lacknum, data, groupstatus } = this.props
    let text, id

    if (this.props.match) {
      id = this.props.match.params.id
    }

    // data = ''

    if (!data) {
      throw new Error(JSON.stringify(data) + `团页面data错误---------团id=${id ? id : '抱歉团id出错'}`)
    } else if (!data.goodsinfo) {
      throw new Error(JSON.stringify(data.goodsinfo) + `团页面goodsinfo错误---------团id=${id ? id : '抱歉团id出错'}`)
    } else if (!data.goodsinfo.selltype) {
      throw new Error(JSON.stringify(data.goodsinfo.selltype) + `团页面selltype错误---------团id=${id ? id : '抱歉团id出错'}`)
    } else if (!groupstatus) {
      throw new Error(JSON.stringify(groupstatus) + `团状态错误---------团id=${id ? id : '抱歉团id出错'}`)
    }

    if (groupstatus === '2') {
      text = '组团成功，再开一团'
    } else if (groupstatus === '3') {
      if (data.istuanfirst === 1 && data.isjoin === 1) {
        if (data.goodsinfo.selltype === '4') {
          text = `还差${lacknum}人拿到最低价，立即召唤小伙伴`
        } else if (data.goodsinfo.selltype === '1' || data.goodsinfo.selltype === '6') {
          text = `还差${lacknum}人组团成功，立即召唤小伙伴`
        } else if (data.goodsinfo.selltype === '7') {
          text = `已有${data.joinnum}人参团, 立即召唤小伙伴`
        }
      } else if (data.istuanfirst === 0 && data.isjoin === 1 && data.goodsinfo.selltype !== '7') {
        text = `还差${lacknum}人组团成功，立即召唤小伙伴`
      } else if (data.istuanfirst === 0 && data.isjoin === 1 && data.goodsinfo.selltype === '7') {
        text = `已有${data.joinnum}人参团, 立即召唤小伙伴`
      } else if (data.istuanfirst === 0 && data.isjoin === 0) {
        text = '我要参团'
      }
    } else if (groupstatus === '1') {
      text = '组团失败，点击再开一团'
    }

    this.setState({
      text
    })

  }

  goGroup = () => {
    const { data } = this.props
    console.log(data)
    // 不是团长 没有参加团
    if (data.istuanfirst === 0 && data.isjoin === 0) {
      this.props.showDrawer()
    } else if (data.lacknum === null) {
      // 最后一个人拼团时
      this.props.showDrawer()
    } else if (data.isjoin === 1) {
      if (data.goodsinfo.groupstatus === '1') {
        this.props.showDrawer()
      } else {
        this.props.changeShow()
      }
    }
  }

  goHome = () => {
    const { isApplet } = store.getState().appConfig
    if (isApplet) {
      window.navigateToWebWiew('#/home')
    } else {
      this.props.history.replace('/home')
    }
  }

  show = () => {
    this.props.changeShow()
  }
}

const Style = styled.div`

.bar {
  position: fixed;
  bottom: env(safe-area-inset-bottom);
  left: 0;
  width: 100%;
  height: 1.28rem;
  background: #212735;
}

.icon {
  position: relative;
  display: inline-block;
  overflow: hidden;
  margin-left: .72rem;
  width: .53rem;
  height: 100%;
}

.icon img {
  position: absolute;
  top: 20%;
  width: .53rem;
  height: auto;
}

.icon span {
  position: absolute;
  top: 60%;
  width: 100%;
  text-align: justify;
  font-size: .25rem;
  color: #fff;
}

.xiaohuoban {
  float: right;
  width: calc(100% - 1.8rem);
  height: 100%;
  text-align: center;
  background-color: var(--theme-font-color) !important;
  color: #fff;
  font-size: .4rem;
}

`

export default withRouter(GroupBottomBar);