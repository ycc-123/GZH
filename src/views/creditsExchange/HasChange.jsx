import React, { Component } from 'react'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'
import { _exchanged } from 'network/profile'
import { store } from 'store'
import Goodsjr from './Goodsjr'



class Jifenduihuan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true,
      GoogsAll: [],
      Coupon: [],

    }
  }

  componentDidMount() {
    // 已兑换
    const exchangedConfig = {
      action: 'exchanged',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,

      }
    }

    _exchanged(exchangedConfig).then(res => {

      let aa = res.data.data
      this.setState({
        GoogsAll: aa
      }, () => {
        this.refs.scroll.BScroll.refresh()
      })
    })
  }

  formData(data) {

    return new Date(parseInt(data) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
  }

  render() {

    document.title = "积分兑换记录";


    const scrollConfig = {
      probeType: 1
    }

    const scrollStyle = {
      height: 'calc(100vh - .18rem)',
      marginTop: '.18rem'
    }

    return (
      <JifenduihuanStyle>
        <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll'>

          <div style={{ padding: "0 0.32rem" }}>
            {
              this.state.GoogsAll.length === 0 &&
              <div style={{ margin: '.2rem auto 0', color: '#474747', fontSize: '.4rem', textAlign: 'center'}}>暂无兑换记录</div>
            }

            {
              this.state.GoogsAll.map((value, key) => {
                // console.log(value)
                let datatime = value.created_at
                Number(datatime)
                const goodstime = this.formData(Number(datatime))
                return (
                  <Goodsjr value={value} key={key} msg={goodstime} history={this.props.history}></Goodsjr>
                )
              })
            }
          </div>

        </BetterScroll>
      </JifenduihuanStyle>
    )
  }
}

const JifenduihuanStyle = styled.div`
.xiantiao{
  width:100%;
  height:1px;
  background:#b9b9b9;
}
.duihuanframe{
  width: 100%;
  height: 3.27rem;
  background: white;
  margin-top: .18rem;
  border-radius: .2rem;
}
.duihuanfram2{
  width:100%;
  height:1.13rem;
  display:flex;
  justify-content: space-between;
  align-items:center;
  padding:0 0.4rem;
}
.duihuanfram2two{
  width:100%;
  height:1.13rem;
  display:flex;
  align-items:center;
  padding:0 0.4rem;
}
.duihuanfram2k1{
  display:flex;
  justify-content:space-between;
  font-size:0.32rem;
}
.duihuanfram2k2{
  display:flex;
  justify-content:space-between;
  font-size:0.32rem;
  color:#CCC;
  align-items:center;
}
.duihuanfram2k2text{
  margin-right:0.16rem;
}
.duihuanfram2k2img{
  width:0.16rem;
  height:0.32rem;
  background:red;
}
.duihuanfram3{
  width:100%;
  height:2.14rem;
  padding:0 0.4rem;
  display:flex;
  justify-content:space-between;
  align-items: center;
}
.jian_name{
  padding-bottom:.5rem;
}
.duihuanfram3img{
  width:1.33rem;
  height:1.33rem;
  border-radius:50%;
  margin-right:0.4rem;
}
.duihuanfram3text{
  font-size:0.48rem;
  font-weight: 600;
  color: var(--theme-font-color);

}
.duihuanframkuangtext{

  position:absolute;
  top:.7rem;
  left:1.7rem;
  font-size:0.32rem;
  color:#CCC;
  font-weight: 500;
  width:50rem;
  
}
.duihuanframkuang{
  position:relative;
  display:flex;
  align-items:center;
  font-size:0.4rem;
  font-weight:600;
}
`
export default Jifenduihuan;