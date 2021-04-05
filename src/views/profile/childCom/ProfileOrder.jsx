import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import {store} from 'store/index'
const ProfileOrderStyled = styled.div`
.profile-order{
  display: flex;
  flex-direction: column;
  width: 100%;
  
  background-color: white;
  border-radius: .3rem;
  margin-top: 0.6rem;
  /* 220 94 130 */
}

.profile-order-top{

  border-bottom: rgba(0, 0, 0, 0.1) solid .027rem;
  height: 1.22rem;
}

.profile-order-top-watch-order{
  position: absolute;
  right: 1.2rem;
  opacity: 0.5;
  font-size: 0.35rem;
  color:#767676;
  margin-top:.05rem;
}
.profile-order-top-watch-order img{
  
  position: absolute;
  right: -.4rem;
  top:.44rem;
  height: .25rem;
  object-fit: cover;

}
.profile-order-top div{
  padding-top:.32rem;
  padding-bottom:.25rem;
}
.profile-order-top-text{
  font-size: .4rem;
  font-weight: bold;
  position: absolute;
  left: .7rem;   
  color:#474747; 
}

.profile-order-bottom{
  justify-content: center;
  position: relative;
  flex:calc(146/220);
  color:#474747;
}
.profile-order-bottom>ul{
  width: 100%;
  height: 1.55rem;
  display: flex;
  flex-direction: row;
  margin-top: 0.32rem;
  
}

.profile-order-bottom>ul>li{
  flex:1;
  text-align: center;
  font-size: .35rem;
}
.profile-order-bottom>ul>li>img{
  width: .6rem;
  height: .6rem;
  margin-bottom: .05rem;
}

.profile-order-bottom>ul>li>p{
  width: 100%;
  padding-top:.05rem;
  // height: .5rem;
  color: #474747;
  // line-height: .5rem;
}

`

class ProfileOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderItem: []
    }
  }

  seeAllOrder() {
    // 路由全部订单
    const {isApplet} = store.getState().appConfig
    isApplet?window.navigateToWebWiew('#/order/all/1'):this.props.history.push('/order/all/1')

  }

  render() {

    const {isApplet} = store.getState().appConfig
    return (
      <ProfileOrderStyled>
        <div className="profile-order">
          <div className="profile-order-top" onClick={this.seeAllOrder.bind(this)}>
            <div className="profile-order-top-text">我的订单</div>
            <div className="profile-order-top-watch-order" >
              查看全部订单
              <img src='https://res.lexiangpingou.cn/images/vip/me.png' alt="" />
            </div>
          </div>
          <div className="profile-order-bottom">
            <ul>
              <li onClick={() => {
                isApplet?window.navigateToWebWiew('#/order/dfh/2'):this.props.history.push('/order/dfh/2')
              }}>
                <img src='https://res.lexiangpingou.cn/images/vip/dfh.png' alt="" />
                <p>待发货</p>
              </li>
              <li onClick={() => {
                isApplet?window.navigateToWebWiew('#/order/dsh/3'):this.props.history.push('/order/dsh/3')
              }}>
                <img src='https://res.lexiangpingou.cn/images/vip/dsh.png' alt="" />
                <p>待收货</p>
              </li>
              <li onClick={() => {
                isApplet?window.navigateToWebWiew('#/order/ysh/4'):this.props.history.push('/order/ysh/4')
              }}>
                <img src='https://res.lexiangpingou.cn/images/vip/ysh.png' alt="" />
                <p>已收货</p>
              </li>
              <li onClick={() => {
                isApplet?window.navigateToWebWiew('#/order/sh/5'):this.props.history.push('/order/sh/5')
              }}>
                <img src='https://res.lexiangpingou.cn/images/vip/sh.png' alt="" />
                <p>售后</p>
              </li>
            </ul>
          </div>
        </div>
      </ProfileOrderStyled>
    );
  }
}

export default withRouter(ProfileOrder);