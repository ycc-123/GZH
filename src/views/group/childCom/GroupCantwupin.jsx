import React, { PureComponent, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Progress } from 'antd-mobile'

import GroupSwiper from './GroupSwiper'


class GroupCantwupin extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      active: true,
      depositInfo: [
        { id: 1211, content: '参团订金', src: 'https://res.lexiangpingou.cn/images/vip/20201127/moneyblack.png' },
        { id: 1212, content: '成团时间', src: 'https://res.lexiangpingou.cn/images/vip/20201127/timeblack.png' },
      ],
      style: {
        width: '6.8rem',
        height: '.16rem',
        borderRadius: '.1rem',
        overflow: 'hidden',
        marginTop: '.15rem'
      },
      barStyle: {
        height: '.16rem',
        border: '.08rem solid var(--theme-font-color)'
      },
      record: []
    }

    this.escape2Html = str => {
      var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
      return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
    }
  }
  render() {
    let text, content, color, ladderIndex
    let { goodsinfo, joinnum, starttime, depositgroup } = this.props.data
    let { groupstatus, LIVE, live, data } = this.props
    const { depositInfo, style, barStyle, h, m, s, d, record } = this.state
    console.log(record)
    if (groupstatus === '3') {
      text = '组团进行中'
      content = '赶快召唤小伙伴加入吧!'
      color = 'var(--theme-font-color)'
    } else if (groupstatus === '2') {
      text = '组团成功'
      content = '我们会尽快发货，请耐心等待'
      color = '#3EEB8F'
    } else if (groupstatus === '1') {
      text = '团购失败'
      content = '组团失败, 不要起馁重新再来!'
      color = '#FA5151'
    }
    const showLive = LIVE === 'on' ? 'block' : 'none'
    if (goodsinfo.selltype === '4' || goodsinfo.selltype === '7') {
      if (goodsinfo.group_level.length === 1) {
        if (parseInt(goodsinfo.group_level[0].groupnum) === parseInt(joinnum)) {
          ladderIndex = 0
        }
      } else {
        for (let i = 0; i < goodsinfo.group_level.length - 1; i++) {
          for (let j = 0; j < goodsinfo.group_level.length - 1 - i; j++) {
            if (parseInt(goodsinfo.group_level[j].groupnum) > parseInt(goodsinfo.group_level[j + 1].groupnum)) {
              let temp = goodsinfo.group_level[j];
              goodsinfo.group_level[j] = goodsinfo.group_level[j + 1];
              goodsinfo.group_level[j + 1] = temp;
            }
          }
        }
        for (let i = goodsinfo.group_level.length - 1; i >= 0; i--) {
          if (parseInt(joinnum) >= parseInt(goodsinfo.group_level[i].groupnum)) {
            ladderIndex = i
            break;
          }
        }
      }
    }

    return (
      <GroupCantwupinStyle>
        <div className='group-live' style={{ display: showLive, position: 'relative', overflow: 'hidden' }} onClick={() => this.props.history.push('/live/1013')}>
          <img style={{ position: 'absolute', top: '.45rem', left: '.27rem', width: '2.55rem', height: '.45rem', zIndex: '1' }} alt='' src='https://res.lexiangpingou.cn/images/vip/20201127/onlive.png'></img>
          <img src={live?.info?.liveimg} alt="" style={{ width: '100%' }} />
          <div style={{
            position: 'absolute', bottom: '0', width: '100%', height: '.81rem', lineHeight: '.81rem',
            backgroundColor: '#000', opacity: '.8', color: '#fff', fontSize: '.32rem', textAlign: 'center'
          }}>
            {live?.info?.live_title}
          </div>
        </div>
        <div className="ctwptopframe">
          <div className="ctwptopframek">
            {groupstatus === '3' && <img className="ctwptopimg" src='https://res.lexiangpingou.cn/images/vip/endtime.png' alt="" />}
            {groupstatus === '2' && <img className="ctwptopimg" src='https://res.lexiangpingou.cn/images/vip/successtime.png' alt="" />}
            {groupstatus === '1' && <img className="ctwptopimg" src='https://res.lexiangpingou.cn/images/vip/failtime.png' alt="" />}
            <div>
              <div className="ctwptopframektext1" style={{ color }}>{text}</div>
              <div className="ctwptopframektext2">{content}</div>
            </div>
          </div>
          <img className='bg' src='https://res.lexiangpingou.cn/images/vip/detailbg.png' alt="" />
        </div>

        <div className="ctwpcenter">
          <img className="ctwpcenter1img" src={goodsinfo.img} alt="" onClick={this.go} />

          <div className="ctwpcentertextframe">
            <div className="ctwpcentertext1">{goodsinfo.goodsname}</div>

            {groupstatus === '1' && <img className='img' alt='' src='https://res.lexiangpingou.cn/images/vip/detailfail.png' />}
            {groupstatus === '2' && <img className='img' alt='' src='https://res.lexiangpingou.cn/images/vip/detailsuccess.png' />}
            <div className="ctwpcentertf2">
              <span style={{ fontSize: '.24rem' }}>&yen;</span>
              <span style={{ display: 'flex', alignItems: 'flex-end', fontSize: '.48rem' }}>{goodsinfo.gprice}/{goodsinfo.unit}</span>

              {/* {goodsinfo.selltype === '7' && <div style={{ marginRight: '.32rem'}}>订金:</div>}
              <div style={{ fontSize: "0.32rem" }}>&yen;</div>
              {goodsinfo.selltype === '7' && <div style={{ fontSize: "0.48rem", textAlign: 'bottom' }}>{goodsinfo.preprice}</div>}
              {goodsinfo.selltype !== '7' && <div style={{ fontSize: "0.48rem", marginRight: '.32rem' }}>{goodsinfo.gprice}/{goodsinfo.unit}</div>} */}
              {goodsinfo.selltype !== '7' && <span style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(0, -50%)', color: "#fff", textAlign: "center", borderRadius: ".1rem", fontSize: "0.32rem", width: "1.3rem", height: ".5rem", lineHeight: '.5rem', background: "var(--theme-font-color)" }}>{goodsinfo.tuannum}人团</span>}
            </div>

            <div style={{ fontSize: "0.32rem" }}>团订单：{goodsinfo.tuan_id}</div>
          </div>
        </div>

        {/* <div className="xiantiao"></div> */}


        {data.tuansuccess.length > 0 && goodsinfo.isshowsend === '1' && <div className="ctwpcenter2">
          <div className="ctwpcenter2frame">
            <div style={{ fontSize: "0.4rem", marginRight: "0.27rem" }}>成团记录</div>
            <div style={{ fontSize: "0.32rem" }}>(只显示最新组团成功的团)</div>
          </div>
          {record.length > 0 && <GroupSwiper record={record} />}
        </div>}

        {/* <div className="xiantiao"></div> */}
        <div className="ctwpcenter3">
        </div>
        {/* {goodsinfo.selltype === '4' && <div className='ladder'>
          <div className='ladder-play'>
            <p style={{ textAlign: 'center', fontSize: '.32rem', color: 'var(--common-font-color)', lineHeight: '1.8' }}>支付开团并邀请好友参加达到人数拿最低价,差价组团成功或到期后自动退款,详情见下方阶梯团玩法</p>
            <button>拼团价</button>
            <div className='ladder-number'>
              <ul style={{ marginLeft: '2.03rem' }}>
                {goodsinfo.group_level.map((item, index) => {
                  return (
                    <li className='ladder-li' key={index} style={{ color: ladderIndex === index ? 'var(--theme-font-color)' : '', fontSize: '.32rem' }}>
                      <span style={{ marginLeft: '.4rem' }}>￥{item.groupprice}</span>
                      <span style={{ marginLeft: '.79rem' }}>{item.groupnum}人</span>
                      {ladderIndex === index && <img src={require('assets/img/hand.png')} style={{ marginLeft: '.84rem', width: '.45rem', height: '.35rem' }} alt="" />}
                      {ladderIndex === index && <span style={{ marginLeft: '.44rem' }}>当前价</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>} */}
        {/* 订金团、阶梯团*/}
        {
          (goodsinfo.selltype === '4' || goodsinfo.selltype === '7') && <div className='ladder'>
            <div className='ladder-play'>
              {goodsinfo.selltype === '4' && <p style={{ textAlign: 'center', fontSize: '.32rem', color: 'var(--common-font-color)', lineHeight: '1.8', marginBottom: '.4rem' }}>支付开团并邀请好友参加达到人数拿最低价,差价组团成功或到期后自动退款,详情见下方阶梯团玩法</p>}
              {goodsinfo.selltype === '7' && <Fragment>
                {depositInfo.map((item, index) => {
                  return (
                    <p style={{ display: 'flex', alignItems: 'center', marginBottom: '.2rem' }} key={item.id}>
                      <img style={{ width: '.37rem', height: '.37rem', marginRight: '.4rem' }} src={item.src} alt='' />
                      <span style={{ fontSize: '.29rem', lineHeight: '.37rem', height: '.37rem', color: 'var(--common-font-color)' }}>{`${item.content}：`}&nbsp;</span>
                      <span style={{ fontSize: '.29rem', lineHeight: '.37rem', height: '.37rem', color: '#FF4B4B' }}>&yen;{index === 0 ? goodsinfo.preprice : goodsinfo.tuanlimittime + '小时'}</span>
                    </p>
                  )
                })}
              </Fragment>}
              <button>拼团价</button>
              <div className='ladder-number'>
                <ul style={{ marginLeft: '2.03rem' }}>
                  {goodsinfo.group_level.map((item, index) => {
                    return (
                      <li className='ladder-li' key={index} style={{ color: ladderIndex === index ? 'var(--theme-font-color)' : '', fontSize: '.32rem' }}>
                        <span style={{ marginLeft: '.4rem' }}>￥{item.groupprice}</span>
                        <span style={{ marginLeft: '.79rem' }}>{item.groupnum}人</span>
                        {ladderIndex === index && <img src='https://res.lexiangpingou.cn/images/vip/20201127/hand.png' style={{ marginLeft: '.84rem', width: '.45rem', height: '.35rem' }} alt="" />}
                        {ladderIndex === index && <span style={{ marginLeft: '.44rem' }}>当前价</span>}
                      </li>
                    )
                  })}
                </ul>
              </div>
              {goodsinfo.selltype === '7' && <div className='group-account clearfix'>
                <div className='group-account-left'>
                  <img src={depositgroup.avatar} alt='' />
                </div>
                <div className='group-account-right'>
                  <p>{depositgroup.nickname}</p>
                  <p style={{ marginTop: '.15rem' }}>发起时间<span>{starttime}</span></p>
                  <div style={{ position: 'relative', width: 'calc(9.36rem - 1.26rem)' }}>
                    <Progress percent={(Math.round(parseInt(depositgroup.nownum) / parseInt(depositgroup.depositgroupnum) * 10000) / 100.00) >= 100 ? 100 : Math.round(parseInt(depositgroup.nownum) / parseInt(depositgroup.depositgroupnum) * 10000) / 100.00} position="normal" style={style} barStyle={barStyle} />
                    <span style={{ position: 'absolute', right: '0', bottom: '0', fontSize: '.27rem' }}>已有{depositgroup.nownum}人</span>
                  </div>
                </div>
              </div>}

              {goodsinfo.selltype === '7' && <div style={{ color: 'var(--common-font-color)', marginLeft: '1.26rem', marginTop: '.4rem', display: 'flex', alignItems: 'center' }}>
                剩余时间
              <span className="date">{d.toString().length === 1 ? `0${d}` : d}</span>天
              <span className="date">{h.toString().length === 1 ? `0${h}` : h}</span>时
              <span className="date">{m.toString().length === 1 ? `0${m}` : m}</span>分
              <span className="date">{s.toString().length === 1 ? `0${s}` : s}</span>秒
            </div>}
            </div>
          </div>
        }

        {/* <div className="xiantiao"></div> */}


      </GroupCantwupinStyle >
    )
  }

  UNSAFE_componentWillMount() {
    const { data } = this.props
    if (data.goodsinfo.selltype === '7') {
      if (data.goodsinfo.groupstatus === '2') {
        this.setState({
          d: 0,
          h: 0,
          m: 0,
          s: 0,
          countdown: 0,
        })
      } else {
        this.setState({
          d: parseInt(data.countdown / 86400),
          h: parseInt(data.countdown / 3600),
          m: parseInt(data.countdown / 60 % 60),
          s: parseInt(data.countdown % 60),
          countdown: parseInt(data.countdown),
        })
      }
    }
  }

  componentDidMount = () => {
    const { data } = this.props
    // const record = []

    // data.tuansuccess.forEach((item, index) => {
    //   const page = Math.floor(index / 3)
    //   if (!record[page]) {
    //     record[page] = []
    //   }
    //   record[page].push(item)
    // })

    if (data.goodsinfo.goodsdesc) {
      let ctwpcenter3 = document.querySelector('.ctwpcenter3')
      new Promise(res => {
        ctwpcenter3.innerHTML = this.escape2Html(data.goodsinfo.goodsdesc)
        res()
      }).then(res => {
        this.props.refresh()
      })
    }
    if (data.goodsinfo.selltype === '7') {
      this.timer = setInterval(() => {
        let { countdown } = this.state
        if (countdown > 0) {
          countdown -= 1
          this.setState({
            h: parseInt(countdown / 3600),
            m: parseInt(countdown / 60 % 60),
            s: parseInt(countdown % 60),
            countdown,
            record: data.tuansuccess
          })

        } else {
          clearInterval(this.timer)
        }
      }, 1000)
    } else {
      this.setState({ record: data.tuansuccess })
    }

  }

  go = () => {
    const { data } = this.props
    if (data.goodsinfo.one_group !== '1') {
      this.props.history.push(`/detail/${data.goodsinfo.gid}/1`)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

}

const GroupCantwupinStyle = styled.div`

.date {
  display: inline-block;
  margin: 0 .2rem;
  padding: .01rem;
  min-width: .5rem;
  min-height: .5rem;
  line-height: .5rem;
  text-align: center;
  background-color: #ff4b4b;
  color: #fff;
  font-size: .32rem;
  font-weight: bold;
}

.group-account-left {
  float: left;
  width: 1.06rem;
  height: 1.06rem;
  overflow: hidden;
  border-radius: 50%;
}

.group-account-left img{
  display: block;
  width: 1.06rem;
  height: 1.06rem;
}

.group-account-right {
  float: left;
  margin-left: .2rem;
  height: 1.06rem;
}

.group-account-right p:nth-child(1) {
  font-size: .32rem;
}

.group-account-right p:nth-child(2) {
  font-size: .27rem;
}


.group-account {
  display: flex;
  margin-top: .4rem;
  height: 1.06rem;
  color: var(--common-font-color);
}


.ladder {
  padding: .4rem .32rem;
  width: 9.36rem;
  border-top: 1px solid rgba(255, 255, 255, .2);
  border-bottom: 1px solid rgba(255, 255, 255, .2);
  margin-left: 0;
  color: var(--common-font-color)
}

.ladder-play {
  position: relative;
  margin-left: 0;
  width: 9.36rem;
  color: #fff;
  padding: 0;
}

.ladder-play button {
  float: left;
  width: 2.03rem;
  height: .77rem;
  line-height: .77rem;
  color: #fff;
  border-top-left-radius: .13rem;
  border-bottom-left-radius: .13rem;
  background: var(--theme-font-color);
}

.ladder-li {
  display: flex;
  align-items: center;
  width: 6rem;
  height: .76rem;
  border-top: 1px solid rgba(139, 139, 139, .5);
  border-left: 1px solid rgba(139, 139, 139, .5);
  border-right: 1px solid rgba(139, 139, 139, .5);
  color: var(--common-font-color);
}

.ladder-li:last-child {
  border-bottom: 1px solid rgba(139, 139, 139, .5);
}

.group-live {
  width: 100vw;
}

.img {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
}

.ctwptopframe{
  width:100%;
  height: 3.3466rem;
  background: #212735;
}

.bg {
  position: relative;
  background: none;
  z-index: 990;
  width: 100%;
  height: auto;
}
.ctwptopframek{
  padding-bottom: .4rem;
  width:100%;
  height:1.87rem;
  align-items:center;
  display:flex;
  justify-content:center;
  background: #212735;
}
.ctwptopimg{
  width:1.11rem;
  height:1.16rem;
  margin-right:0.4rem;
}
.ctwptopframektext1{
  font-size: .4rem;
  font-weight:600;
  color:var(--theme-font-color);
}
.ctwptopframektext2{
  font-size: .32rem;
  color:#CCC;
}
.xiantiao{
  width:100%;
  height:0.01rem;
  background:#CCC;
  margin:0.4rem 0;
}
.ctwpcenter{
  width:100vw;
  border-bottom: 1px solid #ccc;
  display:flex;
  padding: .32rem .4rem;
}
.ctwpcenterimgk{
  width:2.67rem;
  height:2.67rem;
}
.ctwpcenter1img{
  width:2.67rem;
  height:2.67rem;
  margin-right:0.4rem;
}
.ctwpcentertextframe{
  position: relative;
  width:calc(100vw - 3.8rem);
  height:2.67rem;
}
.ctwpcentertext1{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  font-size:0.32rem;
  // font-weight:600;
}
.ctwpcentertf2 {
  position: relative;
  display:flex;
  margin:0.32rem 0;
  align-items: baseline;
  color:var(--theme-font-color);
}
.ctwpcenter2{
  width:100%;
  padding: .32rem .4rem;
  border-bottom: 1px solid #ccc;
}
.ctwpcenter2frame{
  display: flex;
  align-items: baseline;
  font-weight: 600;
  margin-bottom: .32rem;
}
.ctwpcenter2text{
  font-size: .32rem;
  color: var(--common-font-color);
}
.ctwpcenter3{
  width:100%;
  padding: .32rem;
  border-bottom: 1px solid #ccc;
  line-height: 1.5;
}
.ctwpcenter3 p {
  margin-bottom: .1rem;
}


`
export default withRouter(GroupCantwupin)