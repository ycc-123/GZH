import React, { Component } from 'react';
import { Modal } from "antd-mobile";
import styled from 'styled-components'

class BottomLogo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: 3024
    }
  }

  goHD = () => {
    window.location.href = 'https://www.lexiangpingou.cn/'
  }

  clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  render() {
    return (
      <BottomLogoStyled>
        <div>
          <div className="logo" style={{ textAlign: 'center', margin: '0 1rem', marginTop: '.4rem', marginBottom: '.2rem' }} onClick={this.goHD}>
            <div><img src='https://res.lexiangpingou.cn/images/vip/LOGO.svg' alt="火蝶云" /></div>
            <div className="logotext" style={{ position: 'relative'}}>
              <span style={{ fontSize: '.21rem', color: '#A9ABAE', width: '4rem', letterSpacing: '.031rem', position: 'absolute', top: '-.07rem'}}>火蝶云提供技术支持</span>
              <span style={{ fontSize: '.21rem', color: '#A9ABAE', letterSpacing: '.007rem', marginTop: '.18rem'}}>www.huodieyun.com</span>
            </div>
          </div>
          <div style={{ height: '.2rem' }}>
          </div>
        </div>
      </BottomLogoStyled>
    )
  }

  componentDidMount() {
    localStorage.setItem('appVersion', JSON.stringify(this.state.version))
  }

}

const BottomLogoStyled = styled.div`

.logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.logo>div>img{
  width: .5rem;
  margin-right:.16rem;
}
.logo-logo{
  margin-top: .8rem;
}
.logotext{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: .25rem;
}

`

export default BottomLogo