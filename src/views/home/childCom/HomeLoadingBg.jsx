import React, { Component } from 'react'
import {store} from 'store/index'

class HomeLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: store.getState().loading
    }
    // 订阅者模式
    this.cancelSub = store.subscribe(() => {
      this.setState({
        loading: store.getState().loading
      })
    })
    this.count = 1
  }
  render() {
    const showLoding = this.state.loading && this.count <= 2? 'block' : 'none'
    this.count += 1
    return (
      <div className='home-loadingBg' style={{ display: showLoding }}>
        <div className='home-loading-img'>
          <img src={require('assets/img/加载.png')} alt="" />
        </div>
      </div>
    )
  }
  componentWillUnmount() {
    // 取消订阅模式
    this.cancelSub()
  }
}

export default HomeLoading;