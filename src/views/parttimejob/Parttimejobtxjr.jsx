import React, { Component } from 'react'
import styled from 'styled-components'
import { _iwantWithdraw, _WithdrawRecord } from 'network/profile'
import { store } from 'store'

function Daidakuan(value) {
  // console.log(value)
    let item=value.value
  return (
    <div className='audit'>
      <div className='audit_left'>
        <p className='audit_left_wen'>待打款</p>
        <p className='audit_left_wen_time'>{item.addtime}</p>
      </div>
      <div className='audit_right'>￥{item.price}元</div>
    </div>
  )
}

function Yidakuan(value) {
  // console.log(value)
  let item=value.value
  return (
    <div className='audit1'>
      <div className='audit_left'>
        <p className='audit_left_wen'>已打款</p>
        <p className='audit_left_wen_time'>{item.addtime}</p>
      </div>
      <div className='audit_right'>￥{item.price}元</div>
    </div>
  )
}

export default class Parttimejobtxjr extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true,
      daidakuan:[],
      yidakuan:[]
    }
  }


  componentDidMount() {
    const WithdrawRecordConfig = {
      action: 'WithdrawRecord',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
      }
    }

    _WithdrawRecord(WithdrawRecordConfig).then(res => {
      console.log(res)
      this.setState({
        daidakuan: res.data.data.sp,
        yidakuan: res.data.data.ff
      })
    })
  }


  render() {
    console.log(this)
    const { active } = this.state
    const showInfo = active ? 'block' : 'none'
    const showImg = active ? 'none' : 'block'
    const sStyle = {
      padding: '.4rem .32rem',
    }
    return (
      <ParttimejobtxjrStyle>
        <div className='detail-photo' style={sStyle}>
          <div className='detail-photo-button'>
            <button className='detail-photo-left detail-photo-active' onClick={(e) => { this.changeActive(e) }}>审核中</button>
            <button className='detail-photo-right' onClick={(e) => { this.changeActive(e) }}>已提现</button>
          </div>
          <div className='detail-goods-img' style={{ display: showInfo }}>

            <div>
                {
                  this.state.daidakuan.map((value,key)=>{
                    return(
                      <Daidakuan value={value} key={key}></Daidakuan>
                    )
                      
                  })
                }

              {/* <div className='audit1'>
                  <div className='audit_left'>
                    <p className='audit_left_wen'>待打款</p>
                    <p className='audit_left_wen_time'>2020-20-03 13:22:11</p>
                  </div>
                  <div className='audit_right'>￥18.88元</div>
                </div>

                <div className='audit1'>
                  <div className='audit_left'>
                    <p className='audit_left_wen'>待打款</p>
                    <p className='audit_left_wen_time'>2020-20-03 13:22:11</p>
                  </div>
                  <div className='audit_right'>￥18.88元</div>
                </div>*/}
            </div>
          </div>

          <div className='detail-discounts-info' style={{ display: showImg }}>
            <div>
                {
                  this.state.yidakuan.map((value,key)=>{
                    return(
                      <Yidakuan value={value} key={key}></Yidakuan>
                    )
                      
                  })
                }
            </div>
          </div>
        </div>
      </ParttimejobtxjrStyle>
    );
  }
  changeActive = (e) => {
    if (!e.target.classList[1]) {
      let button = document.querySelectorAll('.detail-photo-button button')
      this.setState({
        active: !this.state.active
      })
      button.forEach(item => {
        item.classList.remove('detail-photo-active')
      })
      e.target.classList.add('detail-photo-active')
    }
  }
}
const ParttimejobtxjrStyle = styled.div`

.audit1{
  margin-top:.2rem;
  border-radius: .2rem;
  width:100%;
  height:1.5rem;
  background-color: #fff;
  display:flex;
  justify-content:space-between;
}
.audit{
  margin-top:.2rem;
  border-radius: .2rem;
  width:100%;
  height:1.5rem;
  background-color: #fff;
  display:flex;
  justify-content:space-between;
}
.audit_left{
  margin-top:.35rem;
  margin-left:.3rem;
}
.audit_left_wen{
  font-size:.3rem;
  color:#474747;
}
.audit_left_wen_time{
  font-size:.3rem;
  color:#a3a3a3;
}
.audit_right{
  margin-top:.45rem;
  font-size:.4rem;
  margin-right:.3rem;
}

`