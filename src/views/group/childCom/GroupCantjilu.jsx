import React, { Component, Fragment } from 'react'
import styled from 'styled-components'


import TeamPlay from 'common/teamPlay/TeamPlay'

class GroupCantjilu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: [],
      h: '',
      m: '',
      s: '',
      countdown: '',
      shafa: '',
      gengdou: 'none',
      length: parseInt(this.props.data.goodsinfo.neednum),
      defaultLength: 50
    }
  }
  gengdou() {
    if (this.state.gengdou === "none") {
      this.setState({
        gengdou: "block"
      }, () => {
        this.props.refresh()
      })
    } else {
      this.setState({
        gengdou: "none"
      }, () => {
        this.props.refresh()
      })
    }
  }
  render() {
    let type
    const { data, groupstatus } = this.props
    const { pages, h, m, s, shafa, defaultLength, length } = this.state
    if (groupstatus === '3') {
      type = 2
    } else if (groupstatus === '2') {
      type = 3
    }
    return (
      <GroupCantjiluStyle>
        <div className="cantuanrenshu">
          <div className="cantuanhang">
            {pages.length !== 0 &&
              pages.slice(0, defaultLength).map((item, index) => {
                return (
                  <Fragment key={index}>
                    {item.id ? <div className='img-box' >
                      <img className="rentouimg" src={item.avatar} alt='' />
                      {index === 0 && <span className='tuanzhang'>团长</span>}
                    </div> :
                      <div className='img-box'><img className="rentouimg" src={shafa === index ? 'https://res.lexiangpingou.cn/images/vip/shafa.png' : 'https://res.lexiangpingou.cn/images/vip/defaultimg.png'} alt='' />
                        {shafa === index && <span className='shafa'>沙发</span>}
                      </div>}

                  </Fragment>
                )
              })
            }
          </div>
          {parseInt(data.goodsinfo.neednum) > 50 && data.goodsinfo.selltype === '1' && <div onClick={() => this.changeLength()} className="cantuanrenshutext">{defaultLength >= length ? '没有更多了~' : '查看更多~'}</div>}
          {groupstatus === '3' && data.goodsinfo.selltype !== '7' && <div className="cantuanrenshutext2">
            已有<span className="cantuanrentx22">{data.joinnum}</span>人参团
            {data.goodsinfo.selltype === '1' && <span className="cantuanrentx22">，还差{data.lacknum}人</span>}
          </div>}
          {groupstatus === '2' && <div className="cantuanrenshutext2">
            感谢各位大侠的帮助，团长感激涕零
          </div>}
        </div>
        {groupstatus === '2' && <div className="cantuanjieshusj">
          <div className="xiantiao2"></div>
          <div className="cantuanjieshutextgd">
            团购成功
            </div>
          <div className="xiantiao2">
          </div>
        </div>}
        {groupstatus === '3' && data.goodsinfo.selltype !== '7' && <div className="cantuanjieshusj">
          <div className="xiantiao"></div>
          <div className="cantuanjieshutextframe">
            剩余
          <div className="cantuanjsshu">{h.toString().length === 1 ? `0${h}` : h}</div> :
          <div className="cantuanjsshu">{m.toString().length === 1 ? `0${m}` : m}</div> :
          <div className="cantuanjsshu">{s.toString().length === 1 ? `0${s}` : s}</div>
           结束
          </div>
          <div className="xiantiao"></div>
        </div>}


        {data.tuaninfo.slice(0, 2).map((item, index) => {
          return (
            <div className="cantuantz" key={index}>
              <div className="cantuantzframe">
                <div className="cantuantzframe2">
                  <img className="cantuantzimg" src={item.avatar} alt='' />
                  <div className="cantuantzframetext1">{index === 0 ? '团长' : ''} {item.nickname} {index === 0 ? '发话' : '赶到'}</div>
                </div>
                <div className="cantuantzframetext1">{item.starttime.substring(0, item.starttime.lastIndexOf(':'))}开团</div>
              </div>
              <div className="cantuantzframetext2">“好货不容留，快来跟我一起抢。</div>
            </div>
          )
        })}


        <div className="cantuanjieshusj">
          <div className="xiantiao2"></div>
          <div className="cantuanjieshutextgd" onClick={this.gengdou.bind(this)}>
            查看更多
          </div>
          <div className="xiantiao2"></div>
        </div>


        <div className="cantuanjiluframe" style={{ display: this.state.gengdou }}>
          <div className="cantuanjilutext"><span>参团记录</span> (自<span>{data.tuaninfo[0].starttime}</span>开团)</div>
          {/* <div className='shu'></div> */}
          {data.tuaninfo.map((item, index) => {
            return (
              <div className="cantuanjiluframe2" key={index}>
                <img className="cantuanjiluimg" src={item.avatar} alt='' />
                <div className="cantuanjilutext2frame">
                  <div>{item.nickname}</div>
                  <div>参团时间: <span>{new Date().getFullYear() + '-' + item.starttime}</span>  </div>
                </div>
              </div>
            )
          })}
        </div>


        <div className='team-box'>
          <TeamPlay type={type} />
        </div>

      </GroupCantjiluStyle >
    )
  }

  changeLength() {
    this.setState({
      defaultLength: this.state.defaultLength + 50
    }, () => { this.props.refresh() })
  }

  componentWillMount = () => {
    const { data } = this.props
    let arr = []
    /* for (let i = 0; i < data.goodsinfo.neednum; i++) {
      const page = Math.floor(i / 8)
      if (!arr[page]) {
        arr[page] = []
      }
      arr[page].push({})
    } */

    if (data.goodsinfo.selltype === '1') {
      for (let i = 0; i < data.goodsinfo.neednum; i++) {
        arr.push({})
      }

      for (let i = 0; i < data.tuaninfo.length; i++) {
        arr[i] = data.tuaninfo[i]
      }
    }

    if (data.goodsinfo.selltype !== '7') {
      if (data.goodsinfo.groupstatus === '2') {
        this.setState({
          h: 0,
          m: 0,
          s: 0,
          countdown: 0,
          pages: arr
        })
      } else {
        this.setState({
          h: parseInt(data.countdown / 3600),
          m: parseInt(data.countdown / 60 % 60),
          s: parseInt(data.countdown % 60),
          countdown: parseInt(data.countdown),
          pages: arr,
          shafa: 1
        })
      }
    }
  }
  componentDidMount = () => {
    // let cantuanjiluframe2 = document.querySelectorAll('.cantuanjiluframe2')[0]
    // let shu = document.querySelector('.shu')
    // shu.style.height = cantuanjiluframe2.offsetHeight + 15 + 'px'
    const { data } = this.props
    if (data.goodsinfo.selltype !== '7') {
      this.timer = setInterval(() => {
        let { countdown } = this.state
        if (countdown > 0) {
          countdown -= 1
          this.setState({
            h: parseInt(countdown / 3600),
            m: parseInt(countdown / 60 % 60),
            s: parseInt(countdown % 60),
            countdown
          })
        } else {
          clearInterval(this.timer)
        }

      }, 1000)
    }

  }

  componentWillUnmount = () => {
    clearInterval(this.timer)
  }

}

const GroupCantjiluStyle = styled.div`

.team-box {
  width: 100%;
  margin-top: .4rem;
  padding: 0 .32rem;
}

.shu {
  position: absolute;
  z-index: 1;
  left: .8rem;
  width: 1px;
  height: .2rem;
  background: var(--theme-font-color);
}

.tuanzhang, .shafa {
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: center;
  width: .52rem;
  height: .21rem;
  line-height: .21rem;
  color: #fff;
  font-size: .19rem;
  border-radius: .1rem;
  background: var(--theme-font-color);
}

.shafa {
  background: #FA5151;
}

.img-box {
  position: relative;
  width:0.8rem;
  height:0.8rem;
  margin: 0 .185rem .4rem;
}

.cantuanrenshu{
  width:100%;
  padding: .32rem .32rem 0;
}
.cantuanhang{
  display:flex;
  justify-content: center;
  flex-wrap: wrap;
}
.rentouimg{
  width:0.8rem;
  height:0.8rem;
  border-radius: 50%;
}
.cantuanrenshutext{
  font-size:0.32rem;
  font-weight:600;
  margin-bottom:0.8rem;
  text-align:center;
}
.cantuanrenshutext2{
  font-size:0.32rem;
  text-align:center;
  align-items:end;
}
.cantuanrentx22{
  color:red;
  font-size:0.4rem;
  margin:0 0.1rem;
}
.cantuanjieshusj{
  display:flex;
  justify-content:space-between;
  margin:0.4rem 0;
  align-items:center;
}
.xiantiao{
  width:22%;
  height:0.01rem;
  background:#CCC;
}
.xiantiao2{
  width:40%;
  height:0.01rem;
  background:#CCC;
}

.cantuanjieshutextframe{
  font-size:0.32rem;
  font-weight:600;
  display:flex;
  align-items: center;
}
.cantuanjsshu{
  display: inline-block;
  min-width: .5rem;
  min-height: .5rem;
  padding: .05rem;
  margin:0 0.1rem;
  font-size: .26rem;
  background:black;
  color:white;
  text-align:center;
}
.cantuanjieshutextgd{
  font-size:0.32rem;
}
.cantuantz{
  width: 9.46rem;
  height:2.13rem;
  margin: 0 auto;
  margin-bottom: .4rem;
  background:rgb(255,118,46);
  border-radius: .13rem;
  color:white;
  font-size:0.32rem;

}
.cantuantzframe{
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.cantuantzframe2{
  display:flex;
  align-items:center;
}
.cantuantzimg{
  width:0.8rem;
  height:0.8rem;
  background:white;
  border-radius:50%;
  margin:0.3rem;
}
.cantuantzframetext1{
  margin-right: .3rem;
}
.cantuantzframetext2{
  margin-left:0.8rem;
}
.cantuanjiluframe{
  position: relative;
  width:100%;
  padding:0 0.32rem;
}

.cantuanjilutext{
  font-size:0.32rem;
  color:#474747;
}
.cantuanjilutext span:first-child{
  font-weight:900;
}
.cantuanjiluframe2{
  position: relative;
  z-index: 20;
  display:flex;
  margin: .4rem 0 0;
  align-items:center;
}
.cantuanjiluimg{
  width:0.8rem;
  height:0.8rem;
  border-radius:50%;
  margin:0 0.1rem;
}
.cantuanjilutext2frame{
  font-size:0.32rem;
  color:#474747;
}
.cantuanjilutext2frame div:first-child{
  font-size:0.32rem;
  font-weight:600;
  color:#595959;
}
`
export default GroupCantjilu;