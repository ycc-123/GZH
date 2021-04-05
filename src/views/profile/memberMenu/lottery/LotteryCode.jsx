import React, { Component } from 'react';
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { store } from "store/index";
import { _forwardLottery } from 'network/profile'


const LotteryCodeStyle = styled.div`
.lotteryCode{
  color: var(--common-font-color);
  min-height: calc(100vh -1.17rem);
}
.codeTop{
  height: 6rem;
}

.codeTop>img{
  width: 100%;
  height: auto;
}
.lotteryCode>p{
  text-align:center;
  color:white;
  font-size:.4rem;
  margin: .4rem;
}
.lotteryMyCode{
  height:1.8666rem;
  background-color:white;
  border-radius: .13rem;
  margin: 0 .24rem;
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  align-items: center;
}

.myCodeLeft{
  margin-left: .4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.myCodeLeft>img{
  border-radius: 1rem;
  height: auto;
  width:1.1333rem ;
  margin-right: .4rem;
}

.lotteryMyCode>div:nth-child(2){
  margin-right: .4rem;
  font-weight: bold;
  font-size: .5rem;
}

.lotteryBottom{
    margin: .4rem .7rem;
    position: absolute;
    bottom: 0;
}

.lotteryBottom>button{
  background-color: var(--theme-font-color);
  color:white;
  width:8.8rem;
  height: 1.06666rem;
  border-radius: 1rem;
}

`

// 获取用户抽奖码页
class LotteryCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeData: {},
      img: 'https://res.lexiangpingou.cn/images/vip/fkm.png'
    }
  }

  async componentDidMount() {
    const { openid } = store.getState().appConfig.wxUserInfo

    const id = this.props.match.params.id
    const getlotteryCodeConfig = {
      // 查询某个用户的抽奖码
      action: 'getlotteryCode',
      data: {
        id,
        openid,
      }
    }

    let codeRes = await _forwardLottery(getlotteryCodeConfig)
    if (codeRes.data.status === 200) {
      this.setState({
        codeData: codeRes.data.data
      })
    }
  }

  render() {

    document.title = "转发抽奖";


    return (

      <LotteryCodeStyle>
        <div className="lotteryCode">


          <div className="codeTop">
            <img src='https://res.lexiangpingou.cn/images/vip/lottery.png'
              alt="" />
          </div>

          <p>我的抽奖码</p>

          <div className="lotteryMyCode">
            <div className="myCodeLeft">
              <img src={store.getState().appConfig.wxUserInfo.headimgurl} alt="" />
              <span>我的抽奖码</span>
            </div>
            <div>
              <p>{this.state.codeData.lottery_code}</p>
            </div>
          </div>

          <div className="lotteryBottom">
            <button onClick={() => { this.props.history.push('/profile') }}>继续逛逛</button>
          </div>
        </div>


      </LotteryCodeStyle>
    );
  }
}

export default withRouter(LotteryCode)