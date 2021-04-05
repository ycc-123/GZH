import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'


class TeamPlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      way: [
        { id: 1, num: 1, content: '选择', text: '心仪商品' },
        { id: 2, num: 2, content: '支付开团', text: '或者参团' },
        { id: 3, num: 3, content: '邀请好友', text: '参团支付' },
        { id: 4, num: 4, content: '达到人数', text: '团购成功' },
      ]
    }
  }
  wfa() {
    this.props.history.push('/TeamPlaywfa')
  }
  render() {
    const { type } = this.props
    const { way } = this.state
    return (
      <TeamPlayStyle>
        <div className='play'>
          <div className='team'>
            拼团玩法
            <span onClick={this.wfa.bind(this)}>查看玩法</span>
          </div>
          <ul className='type'>
            {way.map((item, index) => {
              return (
                <li key={item.id + index}>
                  <div className='box'>
                    <div className='yuan' style={{ background: type === index ? 'var(--theme-font-color)' : '#ccc' }}>
                      {item.num}
                    </div>
                  </div>
                  <div className='text' style={{ color: type === index ? 'var(--theme-font-color)' : '#ccc' }}>
                    {item.content}
                    <br />
                    {item.text}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </TeamPlayStyle >
    );
  }
}

const TeamPlayStyle = styled.div`

.play {
  width: 100%;
  height: 2.4rem;
  background: #fff;
  border-radius: .2rem;
  overflow: hidden;
  border: 1px solid #ccc;
  margin-bottom: .32rem;
}

.team {
  position: relative;
  display: flex;
  align-items: center;
  height: 1.2rem;
  border-bottom: 1px solid #ccc;
  padding-left: .4rem
}

.team span {
  position: absolute;
  right: .95rem;
  font-size: .35rem;
  opacity: .6;
}

.team::after {
  content: '';
  position: absolute;
  width: .16rem;
  height: .16rem;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  transform: rotate(45deg);
  right: .4rem;
}

.type {
  display: flex;
  height: 1.2rem;
  padding: 0 .4rem;
}
.type>li {
  position: relative;
  flex: 1;
  height: 100%;
}

.box {
  display: flex;
  align-items: center;
  width: .4rem;
  height: 100%;
}

.yuan {
  width: 100%;
  height: .4rem;
  text-align: center;
  line-height: .4rem;
  background: #ccc;
  border-radius: 50%;
  font-size: .3rem;
  color: #fff;
}

.text {
  position: absolute;
  top: 50%;
  left: .6rem;
  transform: translate(0, -50%);
  font-size: .29rem;
  color: #ccc;
}


`

export default withRouter(TeamPlay);