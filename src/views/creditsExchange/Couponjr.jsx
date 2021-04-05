import React, { Component } from 'react'

export default class Couponjr extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let item = this.props
    return (
      <div className="duihuanframe">
        <div className="duihuanfram2two">
          <div>兑换时间:</div>
          <div>{item.creattime}</div>
        </div>
        <div className="xiantiao"></div>
        <div className="duihuanfram3">
          <div className="duihuanframkuang">
            <img className="duihuanfram3img" src='https://res.lexiangpingou.cn/images/vip/duihuan.png' />
            <div>
              <div className='jian_name'>{item.value.name}</div>
              <div className="duihuanframkuangtext">{item.endtime}</div>
            </div>
          </div>
          <div className="duihuanfram3text">-{item.value.score}</div>
        </div>
      </div>
    )
  }
}
