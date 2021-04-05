import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { _applyMemberShip, _uniacidDetail } from 'network/profile'
import { store } from 'store'
import md5 from 'js-md5'
import { Toast, DatePicker, List } from "antd-mobile"

import { vaPhone } from 'commons/phone_utils'

import { inputResolve, setTitle } from 'commons/utils'

class ApplyMemberShip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      storename: '',
      headPhoto: '',
      storeAll: [],
      name: '',
      phone: '',
      birthDay: '',
      code: '',
      md5code: '',
      storeid: '',
      isMember_smscode: store.getState().controlSwitch.member_smscode,// 会员注册开关
      isMember_bindstore: store.getState().controlSwitch.member_bindstore, // 绑定门店开关
      type: this.props.location.state ? this.props.location.state : ''

    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getValueCode = this.getValueCode.bind(this)
    this.btn = createRef()
  }


  handleChange(e) {
    let name = e.target.name
    let value = e.target.value
    this.setState({
      [name]: value
    })
  }

  // 获取手机号验证码
  getValueCode(e) {
    const button = document.getElementById('getValueCode')
    if (this.state.phone === '') {
      Toast.info('手机号不能为空', 1)
      return
    } else if (this.state.phone.length < 11) {
      Toast.info('请检查手机号长度', 1)
      return
    } else {
      button.disabled = true;
      button.style.backgroundColor = 'rgba(255,118,46,0.5)'
      let times = 60
      let time = setInterval(() => {
        if (times > 0) {
          times--;
          button.innerHTML = `${times}秒后重新发送`
        } else if (times === 0) {
          button.innerHTML = '获取验证码'
          button.disabled = false
          button.style.backgroundColor = 'var(--theme-font-color)'
          clearInterval(time);
        }
      }, 1000)
      let valueCodeConfig = {
        action: 'juhecurl',
        data: {
          uniacid: store.getState().appConfig.uniacid,
          phone: this.state.phone
        }
      }
      _applyMemberShip(valueCodeConfig).then(res => {
        if (res.data.status === 200) {
          let code = res.data.data
          this.setState({
            md5code: code
          })
        } else {
          Toast.info(res.data.msg, 1)
        }
      })
    }
    e.preventDefault();
  }

  handleSubmit(event) {
    event.preventDefault();
    let regPhone = vaPhone(this.state.phone)
    let { isMember_smscode, isMember_bindStore } = this.state
    let { name, phone, storeid, code, md5code } = this.state
    let mdcode = md5(code)
    const { appConfig } = store.getState()
    if (name === '') {
      Toast.fail('名字不能为空', 1)
      return event.preventDefault();
    } else if (!regPhone) {
      Toast.fail('手机号码格式不正确', 1)
    } else if (isMember_bindStore === 1 ? store === '' : false) {
      Toast.fail('请选择注册门店')
      return event.preventDefault();
    } else if (isMember_smscode === 1 ? mdcode !== md5code : false) {
      Toast.fail('请输入正确的验证码')
    } else {
      this.btn.current.disabled = 'disabled'
      const regMemberConfig = {
        action: 'regMember',
        data: {
          uniacid: store.getState().appConfig.uniacid,
          openid: store.getState().appConfig.wxUserInfo.openid,
          mobile: phone,
          name: name,
          birthday: this.state.birthday,
          storeid,
        }
      }
      _applyMemberShip(regMemberConfig).then(res => {
        if (res.data.status === 200) {
          Toast.info(res.data.msg, 1)
          this.timer = setTimeout(() => {
            if (appConfig.isApplet) {
              window.navigateToWebWiew('#/profile')
            } else {
              if (this.props.history.length === 1) {
                this.props.history.replace('/profile')
              } else {
                this.props.history.go(-1)
              }
            }
          }, 1000)
        } else {
          this.btn.current.disabled = false
        }

      })
    }
  }

  componentDidMount() {
    setTitle('申请会员')
    const { appConfig } = store.getState()
    if (appConfig.wxUserInfo.member_status === '1') {
      Toast.fail('您已是会员，将返回个人中心', 2)
      this.timer = setTimeout(() => {
        if (appConfig.isApplet) {
          window.navigateToWebWiew('#/profile')
        } else {
          if (this.props.history.length === 1) {
            this.props.history.replace('/profile')
          } else {
            this.props.history.go(-1)
          }
        }
      }, 2000)
    }

    const getAllStore = {
      action: 'getstoreAll',
      data: {
        uniacid: store.getState().appConfig.uniacid
      }
    }
    _applyMemberShip(getAllStore).then((res) => {
      if (res.data.status === 200 && this.state.isMember_bindstore === 1) {

        this.setState({
          storeAll: res.data.data,
          storeid: res.data.data[0].id
        })
      }
    })
    const uniacidDetailStore = {
      action: 'uniacidDetail',
      data: {
        uniacid: store.getState().appConfig.uniacid
      }
    }
    _uniacidDetail(uniacidDetailStore).then((res) => {
      let touxian = res.data.data.headimgsrc
      let name = res.data.data.name
      this.setState({
        headPhoto: touxian,
        storename: name
      })
    })




  }
  // 店铺ID
  selectedStore(e) {
    let options = document.getElementById('store')
    let storeid = options.value
    this.setState({
      storeid,
    })
  }

  onInputBlur = () => {
    let flag = inputResolve()
    if (flag) {
      window.scroll(0, 0)
    }
  }



  render() {

    // 1 开启 2 禁用
    const isMember_bandstore = this.state.isMember_bindstore === 1 ? 'flex' : 'none'
    const isMember_smscode = this.state.isMember_smscode === 1 ? 'flex' : 'none'
    return (
      <RegisterStyle>
        <div className='ApplyMemberShip' style={{ display: 'flex', flexDirection: 'column' }}>
          {<div className="shipHeader" style={{ width: '100vw' }}>
            <img src='https://res.lexiangpingou.cn/images/vip/memberz.png' alt="" />
            <div className='touxiang'><img id='img' src={this.state.headPhoto ? this.state.headPhoto : require('assets/img/member-t.png')} alt="" /></div>
            <div className='store'>{this.state.storename}</div>
          </div>}
          <div className="applyFrom" style={{ width: '100vw' }}>
            <form onSubmit={this.handleSubmit} action="ApplyMemberShip.jsx">
              <ul>
                <li>
                  <div className='img-box'>
                    <img src={require('assets/img/user.png')} alt="" />
                  </div>

                  <input name="name" placeholder='请输入您的名字' className='c1' value={this.state.name}
                    type="text" onChange={this.handleChange} onBlur={this.onInputBlur} />

                </li>
                <li>
                  <div className='img-box'>
                    <img src={require('assets/img/moblie.png')} alt="" />
                  </div>
                  <input name="phone" placeholder='请输入您的手机号' className='c2' value={this.state.phone}
                    maxLength="11" type="tel" onChange={this.handleChange} onBlur={this.onInputBlur} />
                </li>
                <li style={{ display: isMember_smscode }}>
                  <div>
                    <img src='https://res.lexiangpingou.cn/images/vip/key.png' alt="" />
                  </div>
                  <input placeholder='如60S后未收到，请重新获取' className='c3' name="code"
                    value={this.state.code} onChange={this.handleChange} type="text" onBlur={this.onInputBlur} />
                  <button className='btn' id='getValueCode' onClick={this.getValueCode}>获取验证码</button>
                </li>
                <li className='exren'>
                  <div className='img-box'>
                    <img src='https://res.lexiangpingou.cn/images/vip/birthday.png' alt="" />
                  </div>


                  <DatePicker

                    className='aaa'
                    mode="date"
                    extra="请填写您的生日 (选填)"
                    onOk={console.log()}
                    value={this.state.date}
                    minDate={new Date(1949, 0, 1, 0, 0, 0)}
                    maxDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)}
                    onChange={date => this.setState({
                      date,
                      birthday: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                    })}
                  >
                    <List.Item onClick={this.time} className='time' name="birthDay" arrow="horizontal" ></List.Item>
                  </DatePicker>

                </li>

                <li style={{ display: isMember_bandstore }}>
                  <div className='img-box'>
                    <img src='https://res.lexiangpingou.cn/images/vip/ship.png' alt="" />
                  </div>
                  <select onBlur={this.onInputBlur} name='storeId' id="store" className="selectStore"
                    onChange={this.selectedStore.bind(this)}>
                    {
                      this.state.storeAll.map((item, key) => {
                        return (
                          <option key={key + item.id} value={item.id}>{item.storename}</option>
                        )
                      })
                    }
                  </select>
                </li>
              </ul>
              <div className='aaaa'></div>
              <div className='qq'>
                <button className='btn1' onClick={this.handleSubmit.bind(this)} ref={this.btn}>注册</button>
              </div>
            </form>
          </div>
        </div>
      </RegisterStyle>
    );
  }
}

const RegisterStyle = styled.div`

height: 100vh;
background-color: var(--bg-color);

.ApplyMemberShip{
    /* width:100vw; */
    /* height:100vh; */
}

#store{
    margin-left: .4rem;
    font-size:.4rem;
    color: var(--font-color);
}

.am-list-item {
    padding-left: 0;
}

.am-list-item .am-list-line .am-list-extra{
    flex-basis: 100%;
    color: var(--font-color);
    text-align: left;
    font-size:.4rem;
}
.am-list-item .am-list-line .am-list-arrow{
    background-image: none;
    opacity:0;
}
.time{
    color: #fff;
    background-color: transparent;
}
.am-list-arrow am-list-arrow-horizontal{
    background-image: none;
    opacity:0;
}
#img{
    height:100%;
    width:100%;
    // height:1.9rem;
    // object-fit: cover;
    border-radius: .2rem;
}
.shipHeader .touxiang{
    // background-color:red;
    position:absolute;
    top:.41rem;
    left:3.95rem;
    width: 2.05rem;
    height: 2.1rem;
    // height:2rem;
    // width:2rem;
    border-radius: .2rem;
}

option{
    color:#ccc;
}
select{
    color:#ccc;
    border: none;
    background-color: transparent;
    width:88%;
    
}
.selectStore{

-webkit-appearance: none;
color:#fff;
    // background: url('')  no-repeat right;
    // /*注：上一步清除样式后，select中的三角符号也会被清除，所以需要自己添加下三角，我在此出用一个下三角背景图片填充*/
    // background-size: 0.3rem;
    // background-position-x: 96%;
 
}

.store{
    position:absolute;
    top:2.7rem;
    color:#fff;
    left:4rem;
}
.shipHeader{
    position:relative;
}

.shipHeader img{
  width: 100vw;
  height: 3.6rem;
  /* object-fit: cover; */
}

.applyFrom li {
  display: flex;
  align-items: center;
  width: calc(100vw - .64rem);
  height: 1.17rem;
  padding: 0 .32rem;
  margin-left: .32rem;
  border-bottom:1px solid #4d525d;
  overflow: hidden;
}

.exren div:nth-child(2) {
    margin-left: .4rem;
}

.img-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem !important;
    height: 1rem !important;
}

.applyFrom li img{
  height:.8rem;
}

.applyFrom li input{
  margin-left: .4rem;
  font-size:.4rem;
  width:8.3rem;
  background-color: transparent;
  color: var(--font-color);
  height: 100%;
  border:none;
}
input::-webkit-input-placeholder{
    color: var(--font-color);
}
.applyFrom li .c3{
  width:5rem;

}
.btn{
  font-size:.3rem;
  height:1rem;
  background-color: var(--theme-font-color);
  color:#fff;
  border-radius: .2rem;
  margin-right:.3rem;
  width:3rem;
}

.aaaa{
//     position:absolute;
//  bottom:0px;       
//  padding:0px;
//  margin:0px;
}
.qq{
//     margin-left:.5rem;

//   position: fixed;
//   bottom:.5rem;
  display:flex;
    align-items:center;
    justify-content: center;
}

.btn1{
    margin-top:3.5rem;
  height: 1.2rem;
  width:9rem;
  text-align:center;
  font-size:.4rem;
  background-color: var(--theme-font-color);
  border-radius: .2rem;
  color:#fff;
  bottom:.5rem;
}

`

export default withRouter(ApplyMemberShip)