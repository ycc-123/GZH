import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'
// import { getUrlParams, getQueryString, } from 'commons/AuthFunction'
import { _mygroup } from 'network/profile'
import { store } from 'store'
import GroupItem from "./GroupItem";
import axios from 'axios'

import { _setPVUV } from 'network/api'

export default class MyGroup extends Component {
  constructor(props) {
    super(props);
    props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.state = {
      groupInfo: [],
      couponStatus: [
        { id: 'c101', content: '正在组团', y: 0 },
        { id: 'c102', content: '组团成功', y: 0 },
        { id: 'c103', content: '组团失败', y: 0 }
      ],
      activeIndex: 0
    }

    this.scroll = createRef()
  }

  changeActive(index) {
    const { couponStatus, activeIndex } = this.state
    couponStatus[activeIndex].y = this.scroll.current.BScroll.y
    this.setState({
      activeIndex: index,
      couponStatus
    }, () => {
      this.scroll.current.BScroll.refresh()
      this.scroll.current.BScroll.scrollTo(0, this.state.couponStatus[index].y, 0)

    })
  }

  componentDidMount() {
    const { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo
    // 组团失败
    const couponConfig = {
      action: 'mygroup',
      data: {
        uniacid: appConfig.uniacid,
        openid: wxUserInfo.openid,
        op: 1,
        page: 1,
        pagesize: 10
      }
    }

    const cgConfig = {
      action: 'mygroup',
      data: {
        uniacid: appConfig.uniacid,
        openid: wxUserInfo.openid,
        op: 2,
        page: 1,
        pagesize: 10
      }
    }

    const sbConfig = {
      action: 'mygroup',
      data: {
        uniacid: appConfig.uniacid,
        openid: wxUserInfo.openid,
        op: 3,
        page: 1,
        pagesize: 10
      }
    }


    axios.all([
      _mygroup(couponConfig),
      _mygroup(cgConfig),
      _mygroup(sbConfig),
      _setPVUV()
    ]).then(res => {
      const groupInfo = [(res[2] && res[2].data && res[2].data.data[0]) || [], (res[1] && res[1].data && res[1].data.data[0]) || [], (res[0] && res[0].data && res[0].data.data[0]) || []]
      this.setState({
        groupInfo
      }, () => {
        console.log(this.state.groupInfo)
        this.scroll.current.BScroll.refresh()
      })
    })

  }

  componentDidRecover() {
    _setPVUV()
  }

  render() {

    document.title = "我的团";

    const scrollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      top: '.4rem',
      height: 'calc(100vh - 1.4rem)'
    }

    const { couponStatus, activeIndex, groupInfo } = this.state

    return (
      <MygroupStyle>
        <div className="couponPage">

          <ul className="MygroupHeader">
            {
              couponStatus.map((item, index) => {
                return (
                  <li key={index + item.id}
                    style={{ color: index === activeIndex ? 'var(--theme-font-color)' : '#474747' }}
                    onClick={() => { this.changeActive(index) }}>
                    <a style={{ display: 'inline-block', borderBottom: index === activeIndex ? '.027rem solid var(--theme-font-color)' : 'none', height: '1rem' }}>{item.content}</a>
                  </li>
                )
              })
            }
          </ul>
          <BetterScroll config={scrollConfig} style={scrollStyle} ref={this.scroll}>
            <div className="couponContainer">
              {
                couponStatus.map((item, index) => {
                  return (
                    <div className="couponArea" key={item.id} style={{ display: activeIndex === index ? 'block' : 'none' }}>
                      {
                        Array.isArray(groupInfo[index]) && groupInfo[index].map((value, key) => {
                          return (
                            <GroupItem value={value} key={key + value.id} />
                          )
                        })
                      }
                      {
                        !Array.isArray(groupInfo[index]) && groupInfo.length !== 0 && <p style={{ fontSize: '.32rem', color: '#fff', textAlign: 'center' }}>暂无数据</p>
                      }
                    </div>
                  )
                })
              }
            </div>
          </BetterScroll>
        </div>
      </MygroupStyle>
    )
  }
}
const MygroupStyle = styled.div`

.ysyconten {
    height:.01rem;
    width:100%;
}

.couponPage {
    height: calc(100vh - 0px);
    padding: 0 .32rem;
    background-color: var(--bg-color);
}

.couponContainer{
    /* padding: 0 .32rem; */
    // margin-top: .5rem;
  
}

.MygroupContainer_c_l{
    width: 2.09rem;
    height: 2.04rem;
    float: left;
}

.MygroupContainer_c_l img{
    height: 100%;
    width: 100%;
}

.MygroupHeader {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .2rem;
    height: .8rem;
    background-color: #fff;
}
  .MygroupHeader li{
    flex: 1;
    height: 100%;
    text-align: center;
    line-height: 1rem;
  }
  
  .active{
    color:var(--theme-font-color);
    border-bottom: .027rem var(--theme-font-color) solid;
    padding-bottom: .26rem;
  }

.MygroupContainer {
    margin-bottom: .2rem;
    background-color: #fff;
    width:100%;
    border-radius: .2rem;
}
.MygroupContainer_order {
    display:flex;
    justify-content: space-between;
    padding: .4rem;
    color:#a9a9a9;
    font-size:.3rem;
    border-bottom: 1px solid #ccc;
}

.MygroupContainer_time {
    margin-left:3.2rem;
}

.MygroupContainer_c {
    position: relative;
    padding: .4rem;
    border-bottom: 1px solid #ccc;
}

.MygroupContainer_f {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 .4rem;
    height: 1.3rem;
    
}
.btn {
    color:#474747;
    border:1px solid #474747;
    background-color: #fff;
    border-radius: .33rem;
    width: 2.07rem;
    height: .67rem;
    line-height: .67rem;
    text-align: center;
}

.MygroupContainer_c_t {
    position: relative;
    margin-left: 2.25rem;
    height: 2.04rem;
    font-size: .2rem;
    
}

.title {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: .32rem;
    color:#474747;
    line-height: 1.15;
}
.guige {
    font-size: .3rem;
    color:#c3c3c3;
    position:relative;
    margin-top: .3rem;
}

.count {
    position: absolute;
    right: 0;
    font-size:.3rem;
}

.jiage span {
    border-radius: .1rem;
}

.MygroupHeader {
    height:1rem;
}

.jiage {
    position: absolute;
    bottom: 0;
    display: inline-block;
    padding: 0 .5rem;
    border-radius: .1rem;
    background-color: #ffe4d5;
    height:.45rem;
    font-size:.3rem;
    margin-top:.2rem;
    color:var(--theme-font-color);
    text-align:center;
}
.jiage span{
    font-size:.3rem;
    // padding:0 auto;
    text-align:center;

}
.shifu{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: .6rem;
}

.kuan{
    font-size: .32rem;
}

.c-img {
    position: absolute;
    bottom: .24rem;
    right: .97rem;
    width: 2.65rem;
    height: 2.65rem;
}
`