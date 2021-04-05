import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import { store } from 'store/index'



class LiveHuifang extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true,
      liveHistory: [],
    }

  }
  render() {
    const { liveHistory } = this.props
    return (
      <LiveHuifangStyle>
        <Fragment>
          {
            liveHistory.map((item, key) => {
              return (
                <div key={key + item.id}>
                  <div className="zhibomiaoshu">
                    <span className="zhibomiaoshutitle">{item.live_title}</span>
                    <span className="huifangtime">{item.start_timech}</span>
                  </div>
                  <div className="zhibohuifang">
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '56%', overflow: 'hidden' }}>
                      <img className="zhibohuifangimg" alt="" onClick={(e) => { this.showHistoryPlay(item) }} src={item.liveimg} />
                    </div>

                    <div className="zhibohuifangtext1" >
                      <img alt="" className="zhibohuifangimg2" />
                      <div>回放</div>
                    </div>

                    <div className="zhibohuifangwpkuang">
                      <div className="zbhfshangpintext">本场直播回放商品</div>
                      <div className="zbhfshangpinkuang">
                        {item.goodslist.length > 0 && item.goodslist.map((value, keys) => {
                          return (
                            <div className="zbhfshangpinframe" onClick={() => { this.props.history.push(`/detail/${value.id}/1`) }} key={keys + value.id}>
                              <img alt="" className="zbhfshangpinimg" src={value.gimg} />
                              <div className="zbhfshangpintext2">￥{value.oprice}</div>-
                            </div>
                          )
                        })}
                        {item.goodslist.length === 0 && <div className='no-box'>
                          <img src='https://res.lexiangpingou.cn/images/vip/20201127/liveno.png' className='img-no' alt='' />
                          <br />
                          <span style={{ fontSize: '.3rem' }}>暂无数据~</span>
                        </div>}
                      </div>
                    </div>


                  </div>
                </div>
              )
            })
          }
        </Fragment>
      </LiveHuifangStyle>
    )
  }

  showHistoryPlay(item) {

    const { isApplet } = store.getState().appConfig

    if (isApplet) {
      window.navigateToWebWiew('#/live/' + item.id)
    } else {
      this.props.history.push('/live/' + item.id)
    }
  }
}

const LiveHuifangStyle = styled.div`

.no-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #ccc;
}

.img-no {
  width: 1rem;
  height: .9rem;
}

.huifangtime{
  color:rgba(255,255,255,.3);
  font-size:.29rem;
}

.zhibomiaoshutitle{
  font-size:0.32rem;
  font-weight:600;
  color: var(--font-color);
}

.zhibomiaoshu{
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  padding:0 0.32rem;
  margin-bottom:0.4rem;
}
.zhibohuifang{
  width:100%;
  color:white;
  position: relative;
  margin-bottom:0.4rem;
}
.zhibohuifangimg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.zhibohuifangimg2{
  width:0.13rem;
  height:0.13rem;
  background: rgb(255,118,46);
  border-radius:50%;
  border:none;
  margin-right:0.1rem;
}
.zhibohuifangtext1{
  align-items: center;
  width: 1.33rem;
  height: 0.5rem;
  line-height: 0.8rem;
  border-radius: 0.1rem;
  background-color: rgba(0,0,0,0.7);
  justify-content: center;
  position: absolute;
  display: flex;
  top: 5%;
  left: 5%;
}
.zhibohuifangwpkuang{
  position: relative;
  width: 100vw;
  height: 2.51rem;
  background-color: white;
  padding:0 0.27rem;
  color:black;
}
.zbhfshangpintext{
  color:#474747;
  font-size:0.29rem;
  height:0.63rem;
  line-height:0.63rem;
}
.zbhfshangpinkuang{
  width:100vw;
  display:flex;
}
.zbhfshangpinframe{
  width:1.68rem;
  height:1.68rem;
  position:relative;
  margin-right:0.27rem;
}
.zbhfshangpinimg{
  width:1.68rem;
  height:1.68rem;
}
.zbhfshangpintext2{
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  width:1.68rem;
  height:0.4rem;
  line-height:0.4rem;
  text-align:center;
  font-size:0.3rem;
  background:rgba(0,0,0,0.7);
  color:white;
}
`
export default withRouter(LiveHuifang);