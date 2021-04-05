import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import styled from 'styled-components'
import { _mycashorder } from 'network/profile'
import { store } from 'store'

class Chongz extends Component {
  constructor() {
    super()
    this.state = {
      tuiguan: [],
      showService: false,
      memberId: store.getState().memberUserInfo.id,
      regs: ''
    }
  }

  componentDidMount() {



    const myteamConfig = {
      action: 'mycashorder',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        // type: 1,
      }
    }

    console.log(myteamConfig)

    _mycashorder(myteamConfig).then(res => {
      console.log(res)
      if (res.data.status === 200) {
        let aa = res.data.data[0]
        this.setState({
          tuiguan: aa
        })
      }
    })
  }

  ljtxian() {
    // 立即提现
    this.props.history.push('/Carrymoney')
  }

  kehu() {
    // 客户
    this.props.history.push('/Myclient')
  }

  yongjin() {
    // 佣金
    this.props.history.push('/Commission')
  }

  eweima() {
    // 二维码
    this.props.history.push('/Jobma')
  }



  render() {

    let imgSrc
    const { template_color } = store.getState().mallConfig

    if (new Array('0', '1', '2', '4').find(item => item === template_color)) {
      imgSrc = 'https://res.lexiangpingou.cn/images/vip/99956promote-red.png'
    } else {
      imgSrc = 'https://res.lexiangpingou.cn/images/vip/99955promote-blue.png'
    }

    return (
      <ChongzStyle>
        <div>
          <div className='header'>
            <img className='header_b' src={imgSrc} alt="" />
            <div className='box'>
              <p style={{ position: 'absolute', top: '.36rem', left: '1.05rem', fontSize: '.43rem', color: '#fff' }}>我的余额</p>
              <p style={{ position: 'absolute', top: '1.16rem', left: '1.05rem', fontSize: '.8rem', color: '#fff' }}>
                {(this.state.tuiguan.nobillnum + this.state.tuiguan.billnum) ? Number(this.state.tuiguan.nobillnum + this.state.tuiguan.billnum).toFixed(2) : 0.00}
              </p>
              <button onClick={this.ljtxian.bind(this)} className='withdrawal'>立即提现</button>
              <div className='header_wen'>
                <div className='header_wen_one'>
                  <p style={{ marginTop: '.25rem' }}>
                    <span style={{ fontSize: '.32rem', marginRight: '.1rem' }}>&yen;</span>
                    <span style={{ fontSize: '.48rem', fontWeight: 'bold' }}>{this.state.tuiguan.nobillnum ? Number(this.state.tuiguan.nobillnum).toFixed(2) : 0.00}</span>
                    <span className='line'></span>
                  </p>

                  <p style={{ fontSize: '.32rem', color: '#474747' }}>未结算</p>
                </div>
                <div className='header_wen_two'>
                  <p style={{ marginTop: '.25rem' }}>
                    <span style={{ fontSize: '.32rem', marginRight: '.1rem' }}>&yen;</span>
                    <span style={{ fontSize: '.48rem', fontWeight: 'bold' }}>{this.state.tuiguan.billnum ? Number(this.state.tuiguan.billnum).toFixed(2) : 0.00}</span>
                    <span className='line'></span>
                  </p>

                  <p style={{ fontSize: '.32rem', color: '#474747' }}>未结算</p>
                </div>
                <div className='header_wen_three'>
                  <p style={{ marginTop: '.25rem' }}>
                    <span style={{ fontSize: '.32rem', marginRight: '.1rem' }}>&yen;</span>
                    <span style={{ fontSize: '.48rem', fontWeight: 'bold' }}>{this.state.tuiguan.wallet ? Number(this.state.tuiguan.wallet).toFixed(2) : 0.00}</span>
                    <span className='line'></span>
                  </p>
                  <p style={{ fontSize: '.32rem', color: '#474747' }}>未提现</p>
                </div>
                <div className='header_wen_four'>
                  <p style={{ marginTop: '.25rem' }}>
                    <span style={{ fontSize: '.32rem', marginRight: '.1rem' }}>&yen;</span>
                    <span style={{ fontSize: '.48rem', fontWeight: 'bold' }}>{this.state.tuiguan.cash ? Number(this.state.tuiguan.cash).toFixed(2) : 0.00}</span>
                    <span className='line'></span>
                  </p>
                  <p style={{ fontSize: '.32rem', color: '#474747' }}>已提现</p>
                </div>
              </div>
            </div>

          </div>

          <div className='conter'>
            <div><img src={require('assets/img/promote-bar.png')} alt="" /></div>
            <div className='onebtn' onClick={this.kehu.bind(this)}><button ></button></div>
            <div className='twobtn' onClick={this.yongjin.bind(this)}><button ></button></div>
            <div className='threebtn' onClick={this.eweima.bind(this)}><button ></button></div>
          </div>
        </div>


      </ChongzStyle>
    )
  }
}
const ChongzStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);
overflow: hidden;

.withdrawal {
  position: absolute;
  top: .69rem;
  right: .8rem;
  width: 1.84rem;
  height: .76rem;
  font-size: .32rem;
  color: #fff;
  border: 1px solid #fff;
  border-radius: .38rem;
}

.erweima{
    padding-top:.5rem;
}
.cusContainer{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.cusService{
    height: 5.5rem;
    background-color: rgba(255,255,255,.6);
    z-index: 99;
    position: absolute;
    width: 100%;
    top: 10rem;
}

.header_wen {
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1.8rem;
}

.header_wen div {
  flex: 1;
}


.header{
    position: relative; 
}

.box {
  margin-top: .53rem;
  width: 100vw;
  height: 4.52rem;
  background-color: #fff;
}

.header_b {
    display: block;
    position: absolute;
    top: -.53rem;
    left: 50%;
    transform: translate(-50%, 0);
    width: 9.2rem;
    height: 3.2rem;
}

.line {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  width: 1px;
  height: 1.15rem;
  opacity: .2;
  background-color: #474747;
}

.header_money{
    top:2.7rem;
    left:1rem;
    position:absolute;
    color:#fff;
    font-size:.6rem;
}
.btn button{
    height:.8rem;
    width:2rem;
    font-size:.35rem;
    border:1px solid #fff;
    color:#fff;
    border-radius: .5rem;
    position:absolute;
    top:2.2rem;
    right:1rem;
    background-color: transparent;
}
.header_wen_one,
.header_wen_two,
.header_wen_three,
.header_wen_four {
  position: relative;
  text-align: center;
}

.conter{
    position:relative;
    margin-left:.4rem;
    border-radius: .2rem;
}
.conter img{
    margin-top:.2rem;
    height: 3.07rem;
    object-fit: cover;
}
.onebtn{
    top:.3rem;
    left:.2rem;
    position:absolute;
    height:2.8rem;
    width:2.7rem;
    background-color: transparent;
    // background-color: red;
}
.twobtn{
    top:.3rem;
    left:3.2rem;
    position:absolute;
    height:2.8rem;
    width:2.7rem;
    background-color: transparent;
    // background-color: red;
}
.threebtn{
    top:.3rem;
    left:6.2rem;
    position:absolute;
    height:2.8rem;
    width:2.7rem;
    background-color: transparent;
    // background-color: red;
}
`

export default withRouter(Chongz)