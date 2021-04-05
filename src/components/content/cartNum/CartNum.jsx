import React, { Component } from 'react'
import styled from 'styled-components'

import { withRouter } from 'react-router-dom'


import { store } from 'store/index'

class CartNum extends Component {
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
      <CartNumStyle>
        {num !== 0 && <div className='num'>{num}</div>}
      </CartNumStyle>
    )
  }
  componentWillUnmount = () => {
    // 取消订阅模式
    this.cancelSub()
  }
}

const CartNumStyle = styled.div`

.num {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  bottom: .7rem;
  left: 65%;
  width: .5rem;
  height: .5rem;
  text-align: center;
  background: #fa5151;
  border-radius: 50%;
  font-size: .32rem;
  color: #fff;
}
`

export default withRouter(CartNum);