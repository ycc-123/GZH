import React, { Component } from 'react';
import styled from 'styled-components'
const wx = window.wx

const LotterySeccessStyle = styled.div`

  .lotterySeccess>img{
    width:100vw;
    height:100vh;
  }
`

// 转发朋友圈
class LotterySeccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: 'https://res.lexiangpingou.cn/images/vip/lotterySeccess.png'
    }
  }

  async componentDidMount() {

  }

  testWx() {
    wx.ready(
      () => {
        wx.onMenuShareAppMessage({
          title: "火蝶新版公众号",//分享标题
          // link:"http://192.168.58.150:1000/#/lotterycode/101", //分享链接
          link: "http://localhost:1000/#/Lottery/101", //分享链接
          imgUrl: 'https://res.lexiangpingou.cn/images/vip/lotterySeccess.png',
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) {
            // 用户确认分享后执行的回调函数
            console.log('确认分享')
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            console.log('取消分享')
          }
        })
      }
    )
  }

  render() {

    document.title = "转发抽奖";


    return (
      <LotterySeccessStyle>

        <div className="lotterySeccess" onClick={this.testWx.bind(this)}>
          <img src={this.state.img} alt="" />
        </div>


      </LotterySeccessStyle>
    );
  }
}

export default LotterySeccess;