import React, { memo, useState, useEffect, useRef, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'

import { store } from 'store'

import { _apiS } from 'network/api'
import { Fragment } from 'react'

/**
 * 
 * 尊贵的包月vip
 * @param {userInfo} Object 用户信息
 * @param {list} Array 充值选项
 * 
*/

const wx = window.wx

const index = memo(_ => {

  const [state, setState] = useState(() => {
    return {
      userInfo: null,
      list: null
    }
  })

  const [activeIndex, setActiveIndex] = useState(null)

  const { headimgurl, nickname } = store.getState().appConfig.wxUserInfo

  const timer = useRef()

  const history = useHistory()

  useEffect(() => {
    const { memberUserInfo: { member_status }, appConfig: { isApplet } } = store.getState()
    if (!member_status === '1') {
      Toast.info('请先注册会员', 2)
      timer.current = setTimeout(() => {
        isApplet ? window.navigateToWebWiew('#/applymembership') : history.push('/applymembership')
      }, 2000)
      return
    }
    getData()
  }, [])

  useEffect(() => {
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  })

  const getData = useCallback(async () => {
    const { uniacid, wxUserInfo: { id } } = store.getState().appConfig
    const api_config = {
      action: 'monthlyMembership',
      data: {
        uniacid,
        member_id: id
      }
    }

    try {
      const result = await _apiS(api_config)
      result?.data?.status === 200 ? setState(prev => {
        const { list_cart, top } = result.data.data
        const newState = {
          list: list_cart,
          userInfo: top
        }
        return { ...prev, ...newState }
      }) : setState([])
    } catch {
      setState([])
    }
  }, [])

  const changeIndex = useCallback(index => {
    setActiveIndex(index)
  }, [])

  const pay = useCallback(async () => {
    if (activeIndex === null) {
      Toast.info('请至少选择一种方式付款', 1)
      return
    }

    const { uniacid, wxUserInfo: { openid }, isApplet } = store.getState().appConfig
    const api_config = {
      action: 'mothlyRecharge',
      data: {
        uniacid,
        openid,
        type: 0,
        id: state.list[activeIndex].id,
      }
    }

    if (isApplet) {
      // 支付参数
      const payParam = {
        type: 'payVipPackage',
        uniacid,
        openid,
        isAppletType: 1,
        id: state.list[activeIndex].id
      }
      window.navigateToMiniProgram(payParam)
    } else {
      const result = await _apiS(api_config)
      if (result?.data?.status === 200) {
        const { appId, nonceStr, paySign, signType, timeStamp } = result.data.data
        const wxPackage = result.data.data.package
        wx.ready(() => {
          wx.chooseWXPay({
            appId,
            nonceStr,
            package: wxPackage,
            signType,
            paySign,
            timestamp: timeStamp,
            success: () => {
              Toast.info('支付成功', 1)
              timer.current = setTimeout(() => {
                window.location.reload()
              }, 1000)

            },
            fail: err => {
              Toast.info(err, 2)
            },
            cancel: () => {
              Toast.info('取消支付', 1)
            }
          })
        })
      } else {
        result?.data?.msg ? Toast.info(result.data.msg, 2) : Toast.info('服务器异常', 2)
      }
    }
  }, [activeIndex])

  return (
    <Style>
      <div style={{ width: '100%', height: 'calc(100vh - 1.6rem - 1px)', overflowY: 'auto', padding: '.2rem .4rem' }}>
        <header className='header'>
          <img src={require('assets/img/vip-h.png')} alt='' />
          <div className='box'>
            {
              state?.userInfo &&
              <Fragment>
                <img className='left-img' src={headimgurl} />
                <div className='right-content'>
                  <p>{nickname}</p>
                  <p>{state.userInfo.is_vip ? `有效期至:${state.userInfo.endtime}` : '您还不是会员，请开通'}</p>
                  <p>{state.userInfo.is_vip ? '享受会员价福利' : '开通会员享受会员价福利'}</p>
                </div>
              </Fragment>
            }

          </div>
        </header>
        <div className='content'>
          <p>选择会员</p>
          <ul>
            {
              state.list && state.list.map((item, index) => {
                return (
                  <li style={{
                    backgroundColor: activeIndex === index ? '#FFF1E4' : '',
                    border: activeIndex === index ? '1px solid #FF9C39' : ' 1px solid #ccc'
                  }}
                    key={item.id}
                    onClick={() => changeIndex(index)}
                  >
                    <img className='star' src={require('assets/img/star.png')} alt='' />
                    <span>{item.card_name}{item.member_term}天</span>
                    <span>&yen;</span>
                    <span>{item.price}</span>
                    <div className='round' style={{
                      background: activeIndex === index ? 'linear-gradient(180deg, #FF9C39 0%, #FFC78E 100%)' : '',
                      border: activeIndex === index ? '' : ' 1px solid #ccc'
                    }}></div>
                    <div className='round-white' style={{
                      background: activeIndex === index ? '#fff' : ''
                    }}></div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      {
        state.userInfo &&
        <footer className='footer'>
          <p>
            <span>总价</span>
            <span>&yen;</span>
            <span>{activeIndex !== null ? state.list[activeIndex].price : '0'}</span>
          </p>
          <button className='btn' onClick={pay}>{state.userInfo.is_vip ? '立即续费' : '立即购买'}</button>
        </footer>
      }

    </Style >
  );
})

const Style = styled.div`

width: 100vw;
height: 100vh;
background-color: #fff;

.header {
  position: relative;
  img {
    width: 100%;
    height: auto;
  }
  .box {
    display: flex;
    position: absolute;
    top: .4rem;
    left: .4rem;
    .left-img {
      display: block;
      width: 1.33rem;
      height: 1.33rem;
      border-radius: 50%;
    }
    .right-content {
      margin-left: .13rem;
      line-height: 1;
      p {
        :first-child {
          font-size: .43rem;
          font-weight: bold;
          color: #fff;
        }
        :nth-child(2) {
          margin-top: .17rem;
          font-size: .32rem;
          color: #fff;
          opacity: .85;
        }
        :nth-child(3) {
          margin-top: .17rem;
          padding: .15rem;
          text-align: center;
          border-radius: .13rem;
          background: linear-gradient(90deg, #271A0E 0%, #442D17 100%);
          font-size: .24rem;
          color: #fff;
        }
      }
    }
  }
}

.content {
  margin-top: .67rem;
  p {
    line-height: 1;
    font-size: .43rem;
    color: #000;
  }
  ul {
    li {
      display: flex;
      align-items: center;
      position: relative;
      margin-top: .4rem;
      width: 100%;
      min-height: 1.33rem;
      border-radius: .13rem;
      .star {
        margin-left: .4rem;
        width: 1rem;
        height: auto;
      }
      span {
        :nth-child(2) {
          margin-left: .17rem;
          font-size: .43rem;
          font-weight: bold;
          opacity: .85;
          color: #000;
        }
        :nth-child(3) {
          margin-left: .3rem;
          font-size: .37rem;
          font-weight: bold;
          color: #F06429;
        }
        :nth-child(4) {
          display: block;
          margin-left: .05rem;
          line-height: 1;
          font-size: .64rem;
          font-weight: bold;
          color: #F06429;
        }
      }
      .round {
        position: absolute;
        top: 50%;
        right: .4rem;
        transform: translate(0, -50%);
        width: .68rem;
        height: .68rem;
        border-radius: 50%;
      }
      .round-white {
        position: absolute;
        top: 50%;
        right: .6rem;
        transform: translate(0, -50%);
        width: .28rem;
        height: .28rem;
        border-radius: 50%;
      }
    }
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1111;
  width: 100vw;
  height: calc(1.6rem + 1px);
  background-color: #fff;
  border-top: 1px solid #f5f5f5;
  p {
    display: flex;
    align-items: center;
    span {
    :first-child {
      margin-left: .4rem;
      font-size: .32rem;
      color: #999;
    }
    :nth-child(2) {
      margin-left: .16rem;
      font-size: .37rem;
      font-weight: bold;
      color: #F06429;
    }
    :nth-child(3) {
      margin-left: .05rem;
      line-height: 1;
      font-size: .64rem;
      font-weight: bold;
      color: #F06429;
    }
    }
  }
  .btn {
    margin-right: .4rem;
    width: 3rem;
    height: 1.07rem;
    background-color: #F06429;
    border-radius: 1rem;
    font-size: .43rem;
    color: #fff;
  }
}

`

export default index;