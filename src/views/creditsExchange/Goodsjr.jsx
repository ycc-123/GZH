import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class Goodsjr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jian: Boolean(this.props.value.couponid),
      goodsShow: '',
      couponShow: ''
    }
    this.hexiao = this.hexiao.bind(this)
  }

  hexiao() {
    this.props.history.push('/Hexiao/' + (this.props.value.orderno).substr(1, 50))
  }

  componentDidMount() {
    if (this.props.value.couponid === "0") {
      this.setState({
        goodsShow: 'none',
      })
    } else {
      this.setState({
        couponShow: 'none'
      })
    }
  }

  formData(data) {

    return new Date(parseInt(data) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
  }


  render() {
    // console.log(this.props)
    const { value, msg } = this.props
    // console.log(value.end_time)
    let datatime = value.end_time
    Number(datatime)
    const endstime = this.formData(Number(datatime))
    return (
      <div className="duihuanframe">
        <div className="duihuanfram2">
          <div className="duihuanfram2k1">
            <div>兑换时间:</div>
            <div>{msg}</div>
          </div>
          <div onClick={this.hexiao}>
            <div className="duihuanfram2k2" style={{ display: this.state.couponShow }}>
              <div className="duihuanfram2k2text">查看兑换码</div>
              <img className="duihuanfram2k2img" src='https://res.lexiangpingou.cn/images/vip/jiantou.png' alt=""/>
            </div>
          </div>
        </div>
        <div className="xiantiao"></div>
        <div className="duihuanfram3">
          <div className="duihuanframkuang">
            <img style={{ display: this.state.couponShow }} className="duihuanfram3img" src="https://res.lexiangpingou.cn/images/vip/dhjf2.png" alt=""/>
            <img style={{ display: this.state.goodsShow }} className="duihuanfram3img" src='https://res.lexiangpingou.cn/images/vip/duihuan.png' alt=""/>
            <div style={{ display: this.state.goodsShow }} className='jian_name'>{value.name}</div>
            <div style={{ display: this.state.couponShow }}>{value.name}</div>
            <p style={{ display: this.state.goodsShow }} className="duihuanframkuangtext"><span>有效期至:</span><span>{endstime}</span></p>
          </div>
          <div className="duihuanfram3text">-{value.score}</div>
        </div>
      </div>
    )
  }
}


export default withRouter(Goodsjr)
