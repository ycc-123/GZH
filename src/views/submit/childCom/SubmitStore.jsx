import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { _api } from 'network/api'

import { store } from 'store/index'
import { saveSubmitStoreDan, saveSubmitStoreTuan, saveStore } from "store/actionCreators";

class Store extends Component {
  constructor(props) {
    super(props)
    // props.cacheLifecycles.didCache(this.componentDidCache)
    // props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.state = {
      store: [],
      defaultIndex: 0
    }
  }
  render() {
    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc(100vh - 1.17rem)'
    }
    const { store, defaultIndex } = this.state
    return (
      <StoreStyle>
        <div className='store'>
          <div className='ddddddddddddddddddd'>
            请选择门店
          </div>
          <ul>
            <BetterScroll config={scollConfig}
              style={scrollStyle}
              ref='scroll'>
              {store.length !== 0 && store.map((item, index) => {
                return (
                  <li key={item.id + index}
                    className='--_____--'
                    style={{
                      borderLeft: defaultIndex === index ? '.13rem solid var(--theme-font-color)' : ' ',
                      paddingLeft: defaultIndex === index ? '.3rem' : '.43rem',
                      opacity: defaultIndex === index ? '1' : '.5'
                    }}
                    onClick={() => { this.change(index) }}>
                    <div className='left'>
                      <p> <span className='store-name' style={{ fontWeight: defaultIndex === index ? 'bold' : '400' }}>{item.storename}</span>  <br /><span className='huanhang'>{item.address}</span></p>
                    </div>
                    <div className='right'>
                      {item.distance}
                    </div>
                  </li>
                )
              })}
              <li className='__--__--__'>
                没有更多了
              </li>
            </BetterScroll>
          </ul>
        </div>
      </StoreStyle>
    );
  }

  componentDidMount = async () => {
    const { appConfig } = store.getState()
    const { wxUserInfo } = store.getState().appConfig

    if (this.props.match.params.type === '1') {
      const storeConfig = {
        action: 'storeList',
        data: {
          uniacid: appConfig.uniacid,
          gid: 0,
          lat: wxUserInfo.lat,
          lng: wxUserInfo.lng,
          type: '1'
        }
      }
      _api(storeConfig).then(res => {
        const index = res.data.data.findIndex(item => {
          return item.id === store.getState().submitDan.id
        })
        this.setState({
          store: res.data.data,
          defaultIndex: index
        }, () => {
          this.refs.scroll.BScroll.refresh()
        })
      })
    } else if (this.props.match.params.type === '2') {
      const storeConfig = {
        action: 'storeList',
        data: {
          uniacid: appConfig.uniacid,
          gid: this.props.match.params.id,
          lat: wxUserInfo.lat,
          lng: wxUserInfo.lng,
          type: '2'
        }
      }
      _api(storeConfig).then(res => {
        const index = res.data.data.findIndex(item => {
          return item.id === store.getState().submitTuan.id
        })
        this.setState({
          store: res.data.data,
          defaultIndex: index
        }, () => {
          this.refs.scroll.BScroll.refresh()
        })
      })
    } else if (this.props.match.params.type === '3') {
      const storeConfig = {
        action: 'storeList',
        data: {
          uniacid: appConfig.uniacid,
          gid: 0,
          lat: wxUserInfo.lat,
          lng: wxUserInfo.lng,
          type: '1'
        }
      }
      _api(storeConfig).then(res => {
        const index = res.data.data.findIndex(item => {
          return item.id === store.getState().submitDan.id
        })
        this.setState({
          store: res.data.data,
          defaultIndex: index
        }, () => {
          this.refs.scroll.BScroll.refresh()
        })
      })

    }
  }



  change = (index) => {
    const { appConfig } = store.getState()
    const config = {
      action: 'updateOrderReceiverInfo',
      data: {
        uniacid: appConfig.uniacid,
        openid: appConfig.wxUserInfo.openid,
        store_id: this.state.store[index].id
      }
    }

    _api(config).then(res => {
      this.setState({
        defaultIndex: index
      }, () => {
        if (this.props.match.params.type === '1') {
          const action = saveSubmitStoreDan(this.state.store[index])
          store.dispatch(action)
          const action1 = saveStore(this.state.store[index])
          store.dispatch(action1)
          setTimeout(() => {
            this.props.history.goBack()
          }, 200)
        } else if (this.props.match.params.type === '2') {
          const action = saveSubmitStoreTuan(this.state.store[index])
          store.dispatch(action)
          const action1 = saveStore(this.state.store[index])
          store.dispatch(action1)
          setTimeout(() => {
            this.props.history.goBack()
          }, 200)
        }
      })
    })
  }

  // componentDidCache = () => {
  //   this.saveY = this.refs.scroll.BScroll.y
  // }

  // componentDidRecover = () => {
  //   this.refs.scroll.BScroll.refresh()
  //   this.refs.scroll.BScroll.scrollTo(0, this.saveY)
  // }
}

const StoreStyle = styled.div`

height: 100vh;
background-color: var(--bg-color);

.huanhang {
  display: flex;
  width: 7rem;
}

.store-name {
  margin-bottom: .16rem;
}

.store {
  position: absolute;
  top: 0;
  left: .32rem;
  z-index: 999999 !important;
  width: calc(100vw - .64rem);
  height: 100vh;
  background: #fff;
  border-top-left-radius: .13rem;
  border-top-right-radius: .13rem;
}
.ddddddddddddddddddd {
  padding-left: .43rem;
  height: 1.17rem;
  line-height: 1.17rem;
  border-bottom: 1px solid #ccc;
}

.--_____-- {
  padding: .3rem .43rem;
  border-bottom: 1px solid #ccc;
  color: var(--common-font-color);
  opacity: 0.5;
  display: flex;
  flex-direction: row;
  pointer-events: auto;
  justify-content: space-between;
  align-items: center;
}

.__--__--__ {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
}

.left, .right {
  display: flex;
  align-items: center;
  
  height: 100%;
}
.left {
  font-size: .32rem;
}
.right {
}


`

export default withRouter(Store);