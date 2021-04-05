import React, { Component } from 'react'
class DetailCourier extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className='detail-courier'>
        <div className='detail-courier-box'>
          <img src='https://res.lexiangpingou.cn/images/vip/selectgreen.png' alt="" />
          <span>包邮</span>
        </div>
      </div>
    );
  }
}

export default DetailCourier;