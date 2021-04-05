import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { _api } from 'network/api'

import { store } from 'store/index'
import { saveStore } from 'store/actionCreators'
import { _setPVUV } from 'network/api'

class Store extends Component {
  constructor(props) {
    super(props)
    props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
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
                      <p> <span className='store-name' style={{ fontWeight: defaultIndex === index ? 'bold' : '400' }}>{item.storename}</span>  <br /><span>{item.address}</span></p>
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

    _setPVUV()

    const storeConfig = {
      action: 'getAllStore',
      data: {
        uniacid: appConfig.uniacid,
        openid: appConfig.wxUserInfo.openid,
        lat: appConfig.wxUserInfo.lat,
        lng: appConfig.wxUserInfo.lng,
      }
    }

    const result1 = await _api(storeConfig)

    // const result = await _storeApi()
    const index = result1.data.data.storelist.findIndex(item => {
      return item.id === store.getState().store.id
    })


    this.setState({
      store: result1.data.data.storelist,
      defaultIndex: index
    }, () => {
      this.refs.scroll.BScroll.refresh()
    })
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
      if (parseInt(res.data.status) === 200) {
        this.setState({
          defaultIndex: index
        }, () => {
          const action = saveStore(this.state.store[index])
          store.dispatch(action)
          this.timer = setTimeout(() => {
            this.props.history.replace('/home')
          }, 200)
        })
      }
    })
  }

  componentDidCache = () => {
    this.saveY = this.refs.scroll.BScroll.y
  }

  componentDidRecover = () => {
    _setPVUV()
    this.refs.scroll.BScroll.refresh()
    this.refs.scroll.BScroll.scrollTo(0, this.saveY)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

}

const StoreStyle = styled.div`

height: 100vh;
background-color: var(--bg-color);

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