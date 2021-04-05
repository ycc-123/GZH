import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'

import { store } from 'store/index'

class HomeHead extends Component {
  render() {
    let activeStore = store.getState().store, imgSrc
    const { template_color } = store.getState().mallConfig
    if (template_color === '0') {
      imgSrc = 'https://res.lexiangpingou.cn/images/vip/99953position-white.png'
    } else {
      imgSrc = 'https://res.lexiangpingou.cn/images/vip/99952position-black.png'
    }
    return (
      <header className='home-header'>
        <img className='img1' src={imgSrc} alt="" onClick={() => this.goStore()} />
        <div className='div' style={{ fontSize: activeStore.storename.length <= 6 ? '.38rem' : '.33rem', color: 'var(--font-color)' }} onClick={() => this.goStore()}>{activeStore.storename}</div>
        <form action="" target="frameFile" /* style={{ position: 'relative' }} */ onSubmit={(e) => { this.search(e) }}>
          <input className='search' ref='input' type="search" placeholder="请输入搜索关键词" />
          <iframe name="frameFile" style={{ display: 'none' }} title=''></iframe>
          <div style={{ position: 'absolute', top: '.2rem', right: '.32rem', height: '.8rem', width: '6rem', background: 'rgba(0, 0, 0, 0)' }} onClick={() => { this.focus() }}></div>
        </form>
        <img src='https://res.lexiangpingou.cn/images/vip/search.png' alt="" className='img2' onClick={(e) => { this.search(e) }} />

      </header>
    );
  }

  goStore() {
    this.props.history.push('/store')
  }

  focus = () => {
    this.refs.input.focus()
    // let tab = document.querySelector('.tab-bar')
    // tab.style.display = 'none'
  }

  search = (e) => {
    if (this.refs.input.value !== '') {
      this.props.search(this.refs.input.value)
      this.refs.input.blur()
    } else {
      Toast.info('搜索内容不能为空')
    }
    return false
  }


}

export default withRouter(HomeHead);