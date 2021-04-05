import React, { Component } from 'react'
import styled from 'styled-components'

import { withRouter } from 'react-router-dom'


import { store } from 'store/index'

class DetailNum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: store.getState().cartGoods.reduce((oldValue, item) => {
        return oldValue + parseInt(item.num)
      }, 0)
    }
    this.cancelSub = store.subscribe(() => {
      this.setState({
        num: store.getState().cartGoods.reduce((oldValue, item) => {
          return oldValue + parseInt(item.num)
        }, 0)
      })
    })
  }
  render() {
    const { num } = this.state
    return (
      <DetailNumStyle>
        {num !== 0 && <div className='num'>{num}</div>}
      </DetailNumStyle>
    )
  }
  componentWillUnmount = () => {
    // 取消订阅模式
    this.cancelSub()
  }
}

const DetailNumStyle = styled.div`

.num {
  position: absolute;
  z-index: 9999;
  bottom: calc((.75rem) + env(safe-area-inset-bottom));
  right: -.25rem;
  width: .4rem;
  height: .4rem;
  line-height: .4rem;
  text-align: center;
  background: #fa5151;
  border-radius: 510%;
  font-size: .32rem;
  color: #fff;
}
`

export default withRouter(DetailNum);