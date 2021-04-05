import React, { Component } from 'react';
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { Toast } from "antd-mobile";
import { store } from 'store/index'

const ProfileHeaderStyled = styled.div`
  
.profile-header{
  height: 4.17rem;
  border-radius: .13rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.p-h-top{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.p-h-top-left{
  width: 100%;
  height: 100%;
  // width: 100%;
  // flex: calc(2/3);
  // margin-top: .5rem;
}
.p-h-top-left img{
  width: 10rem;
  height: 2rem;
}

.p-h-top-left-membername{
  position: absolute;
  left: .8rem;
  top: .7rem;
  color: var(--theme-font-color);
  font-size: .5rem;
  font-weight: 800;
 
}
.p-h-top-left-memberlevel{
  position: absolute;
  left: .8rem;
  top: 1.8rem;
  color: var(--font-color);
  font-size:.3rem;
  font-weight: 500;
}
.p-h-top-left-memberdiscount{
  padding-left: .3rem;
}

.p-h-top-img{
  position: absolute;
  right: .7rem;
  top: .55rem;
  width: 1.8rem;
  height: 1.8rem;
  border: .027rem solid white;
  border-radius: 50%;
}

.p-h-bottom>ul{
  margin-top:1rem;
  display: flex;
  flex-direction: row;
}

.p-h-bottom>ul>li{
  flex: 1;
  text-align: center;
  color: var(--font-color);
  line-height: .7rem;
  font-size: .4rem;
  font-weight: 500;
}
.p-h-bottom>ul>li>div{
  font-size:.35rem;
  // padding-top:.1rem;
}

.p-h-bottom>ul>div{
  margin-top: .4rem;
  border-right: solid white .027rem;
  width: 0.027rem;
  height:.6rem;
  background-color: white;
  color: white;
  opacity: 0.3;
  border-radius: 30%;
  border-top-left-radius: 0%;
}

`



class ProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  btnClick = index => {
    const { memberInfo } = this.props
    const { isApplet } = store.getState().appConfig
    if (index === 2) {
      isApplet ? window.navigateToWebWiew('#/coupon') : this.props.history.push('/coupon')
    } else if (memberInfo.member_status === '1') {
      if (index === 0) {
        isApplet ? window.navigateToWebWiew('#/balance') : this.props.history.push('/balance')
      } else if (index === 1) {
        isApplet ? window.navigateToWebWiew('#/crechang') : this.props.history.push('/crechang')
      }
    } else {
      Toast.info('请先注册会员', 1)
      this.timer = setTimeout(() => {
        this.props.history.push({ pathname: '/applymembership' })
      }, 1000)
    }
  }

  hyLevel() {
    this.props.history.push('/members/level')
  }

  applymembershipClick() {
    const { isApplet } = store.getState().appConfig
    isApplet ? window.navigateToWebWiew('#/applymembership') : this.props.history.push('/applymembership')
  }

  render() {
    const { memberInfo, defaultAvatar } = this.props
    const { isApplet } = store.getState().appConfig
    return (
      <ProfileHeaderStyled>
        <div className="profile-header">
          <div className="p-h-top">
            <div className="p-h-top-left">
              <img src='https://res.lexiangpingou.cn/images/vip/wwww.png' alt="" />
              <p className="p-h-top-left-membername">{memberInfo.nickname}</p>
              {
                memberInfo.member_status === '1' && memberInfo.membership_rights === 1 && <p className="p-h-top-left-memberlevel" onClick={() => this.hyLevel()} >会员等级：<span>{memberInfo.levelName ? memberInfo.levelName : '无等级'}&nbsp;</span>
                  {
                    <span className="p-h-top-left-memberdiscount">{memberInfo.discount ? '享受' + memberInfo.discount + '折优惠' : '不享受优惠'}</span>
                  }
                </p>
              }

              {
                memberInfo.member_status === '0' && memberInfo.membership_rights === 1 && <p className="p-h-top-left-memberlevel" onClick={() => this.applymembershipClick()}> 即刻开通会员，享受会员权益 </p >
              }
              {
                memberInfo.membership_rights === 0 &&
                <p className="p-h-top-left-memberlevel">商家已关闭会员权益</p>
              }
            </div>
            <img className="p-h-top-img" src={memberInfo.avatar ? memberInfo.avatar : defaultAvatar} alt="会员头像" />
          </div>
          <div className="p-h-bottom">
            <ul>
              <li onClick={() => { this.btnClick(0) }}>
                <p style={{ fontWeight: '800' }}>{memberInfo.member_balance}</p>
                <div>余额</div>
              </li>
              <div>
              </div>
              <li onClick={() => { this.btnClick(1) }}>
                <p style={{ fontWeight: '800' }} >{memberInfo.score_balance}</p>
                <div>积分</div>
              </li>
              <div>
              </div>
              <li onClick={() => { this.btnClick(2) }}>
                <p style={{ fontWeight: '800' }}>{memberInfo.couponNum}</p>
                <div>优惠券</div>
              </li>
            </ul>
          </div>
        </div>
      </ProfileHeaderStyled>
    );
  }
}

export default withRouter(ProfileHeader);