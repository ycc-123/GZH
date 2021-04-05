import React, { memo, useState, useCallback, useEffect, useRef, Fragment } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'

import AfterSaleDetailcomplaint from './AfterSaleDetailcomplaint'
import AfterSaleCourier from './AfterSaleCourier'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { timestampToTime } from 'commons/timeStamp'
import { setTitle } from 'commons/utils'

import { store } from 'store/index'

import { _apiS } from 'network/api'

/**
 * 
 * time: 2021-3-15
 * content: 售后功能
 * @param {servesState} Array 真实渲染的步骤
 * @param {lineList} Array 竖线的长度
 * @param {order} Object 订单详情
 * @param {server} Object 售后信息(没有任何)
 * 
 * */

const AfterSaleDetail = memo(() => {
  const [navBar] = useState(() => {
    return [
      { title: '售后进度', index: 0 },
      { title: '订单详情', index: 1 },
    ]
  })

  const [state, setState] = useState(() => {
    const state = {
      servesState: [],
      lineList: [],
      order: null,
      serves: null,
      salesBtn: 0
    }
    return state
  })

  const scollConfig = {
    probeType: 1
  }

  const scrollStyle = {
    height: state.salesBtn === 0 ? 'calc(100vh - 1.28rem)' : 'calc(100vh - 2.56rem)'
  }

  const [active, setActive] = useState(0)
  const [show, setShow] = useState(false)
  const [showCourier, setShowCourier] = useState(false)

  const params = useParams()
  const history = useHistory()

  const ulRef = useRef()
  const htmlSize = useRef()
  const scroll = useRef()
  const timer = useRef()
  const bar = useRef()

  htmlSize.current = document.querySelector('html').style.fontSize.replace('px', '')

  useEffect(() => {
    setTitle('售后详情')
    const { uniacid } = store.getState().appConfig
    const config = {
      action: 'afterServes',
      data: {
        uniacid,
        id: params.id
      }
    }
    _apiS(config).then(res => {
      if (res?.data?.status === 200) {
        const { serves: { feedtype, servicelastfeedtype, feedtime, servicelastremark, servicelastfeedtime, servicelastfeedback, overfeedtype, servicefeedback, servicetime, servicelasttime, overtime }, order, serves } = res.data.data
        let newState
        // 申请时，商家暂时没处理
        if (!feedtype) {
          newState = {
            servesState: [
              { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) }
            ],
            order,
            serves,
            salesBtn: 1
          }
        } else {
          switch (feedtype) {
            case '部分退款':
              // 存在第二次反馈
              if (overfeedtype && servicelastremark) {
                newState = {
                  servesState: [
                    { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                    { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                    { id: 1212, status: 0, title: '再次申述', feedback: servicelastremark, time: timestampToTime(servicelasttime) },
                    { id: 1213, status: 0, title: '再次反馈: ' + overfeedtype, feedback: '反馈意见: ' + servicelastfeedback, time: timestampToTime(overtime) },
                    { id: 1214, status: 0, title: '售后完成', time: timestampToTime(overtime) }
                  ],
                  order,
                  serves,
                }
              } else if (overfeedtype && servicelastremark === '') {
                newState = {
                  servesState: [
                    { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                    { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                    { id: 1214, status: 0, title: '售后完成', time: timestampToTime(overtime) }
                  ],
                  order,
                  serves,
                }
              } else if (servicelastremark) {
                // 第二次不处理
                if (!servicelastfeedtype) {
                  newState = {
                    servesState: [
                      { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                      { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                      { id: 1212, status: 0, title: '再次申述', feedback: servicelastremark, time: timestampToTime(servicelasttime) },
                    ],
                    order,
                    serves,
                    salesBtn: 1
                  }
                } else {
                  newState = {
                    servesState: [
                      { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                      { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                      { id: 1212, status: 0, title: '再次申述', feedback: servicelastremark, time: timestampToTime(servicelasttime) },
                    ],
                    order,
                    serves,
                    salesBtn: 1
                  }
                }

              } else if (feedtime) {
                newState = {
                  servesState: [
                    { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                    { id: 1211, status: 2, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) }
                  ],
                  order,
                  serves,
                  salesBtn: 1
                }
              }
              break;
            case '不处理':
              // 售后完成
              if (overfeedtype) {
                newState = {
                  servesState: [
                    { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                    { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                    { id: 1212, status: 0, title: '再次申述', feedback: servicelastremark, time: timestampToTime(servicelasttime) },
                    { id: 1213, status: 0, title: '再次反馈: ' + overfeedtype, feedback: '反馈意见: ' + servicelastfeedback, time: timestampToTime(overtime) },
                    { id: 1214, status: 0, title: '售后完成', time: timestampToTime(overtime) }
                  ],
                  order,
                  serves
                }
              } else if (servicelastremark) {
                if (!servicelastfeedtype) {
                  newState = {
                    servesState: [
                      { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                      { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                      { id: 1212, status: 0, title: '再次申述', feedback: servicelastremark, time: timestampToTime(servicelasttime) },
                    ],
                    order,
                    serves,
                  }
                } else {
                  newState = {
                    servesState: [
                      { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                      { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                      { id: 1212, status: 0, title: '再次申述', feedback: servicelastremark, time: timestampToTime(servicelasttime) },
                    ],
                    order,
                    serves,
                    salesBtn: 1
                  }
                }

              } else if (feedtime) {
                newState = {
                  servesState: [
                    { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                    { id: 1211, status: 1, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) }
                  ],
                  order,
                  serves,
                  salesBtn: 1
                }
              }
              break;
            case '全额退款':
              newState = {
                servesState: [
                  { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                  { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                  { id: 1212, status: 0, title: '售后完成', time: timestampToTime(overtime) },
                ],
                order,
                serves
              }
              break;
            case '退货':
              if (overfeedtype) {
                newState = {
                  servesState: [
                    { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                    { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                    { id: 1212, status: 0, title: '再次申述', feedback: servicelastremark, time: timestampToTime(servicelasttime) },
                    { id: 1212, status: 0, title: '再次反馈: ' + overfeedtype, feedback: servicelastfeedback, time: timestampToTime(overtime) },
                    { id: 1212, status: 0, title: '售后完成', time: timestampToTime(overtime) }
                  ],
                  order,
                  serves,
                }
              } else if (servicelastremark) {
                newState = {
                  servesState: [
                    { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                    { id: 1211, status: 0, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) },
                    { id: 1212, status: 0, title: '再次申述', feedback: servicelastremark, time: timestampToTime(servicelasttime) }
                  ],
                  order,
                  serves,
                  salesBtn: 1
                }
              } else {
                newState = {
                  servesState: [
                    { id: 1210, status: 0, title: '售后申请已提交', feedback: '等待客服反馈', time: timestampToTime(servicetime) },
                    { id: 1211, status: 2, title: feedtype, feedback: '反馈意见: ' + servicefeedback, time: timestampToTime(feedtime) }
                  ],
                  order,
                  serves,
                  salesBtn: 1
                }
              }
              break;
            default:
              break;
          }
        }



        // console.log(timestampToTime(feedtime))
        setState(prev => {
          return { ...prev, ...newState }
        })
      }

      return () => {
        if (timer.current) {
          clearTimeout(timer.current)
        }
      }

    })
  }, [])

  useEffect(() => {
    if (ulRef.current) {
      let imgDom = ulRef.current.getElementsByClassName('icon')
      let lineList = []
      for (let i = 0; i < imgDom.length; i++) {
        if (i === 0) {
          lineList[i] = [0, 0]
          continue
        }
        lineList[i] = [imgDom[i].offsetTop + imgDom[i - 1].offsetTop, imgDom[i - 1].offsetTop]
      }
      if (lineList.length !== 0) {
        setState(prev => {
          return { ...prev, lineList }
        })
      }
    }
  }, [state.servesState])

  useEffect(() => {
    if (scroll.current) {
      scroll.current.BScroll.refresh()
    }
  }, [state.servesState, active])

  const changeActive = useCallback(() => {
    setActive(prev => {
      if (prev) {
        return 0
      } else {
        return 1
      }
    })
  }, [])

  const changeShow = useCallback(() => {
    setShow(prev => {
      return !prev
    })
  }, [])

  const changeCourierShow = useCallback(() => {
    const { serves, order } = state
    if (serves.feedtype === '部分退款') {
      // 同意处理结果
      const api_config = {
        action: 'part_refund',
        data: {
          orderno: order.orderno
        }
      }
      _apiS(api_config).then(res => {
        if (res?.data?.status === 200) {
          Toast.info('成功', 2)
          timer.current = setTimeout(() => {
            window.location.reload()
          }, 2100)
        } else {
          Toast.info(res?.data?.msg ? res?.data?.msg : '服务器异常')
        }
      })
    } else {
      // 再次申述
      setShowCourier(prev => {
        return !prev
      })
    }
  }, [state.serves, state.order])

  const cancle = useCallback((e) => {
    const { id } = state.order
    const api_config = {
      action: 'cancleServes',
      data: {
        id
      }
    }
    _apiS(api_config).then(res => {
      if (res?.data?.status === 200) {
        Toast.success('取消成功', 2)
        timer.current = setTimeout(() => {
          history.goBack()
        }, 2100)
      } else {
        res?.data?.msg ? Toast.info(res.data.msg, 2) : Toast.info('服务器异常', 2)
      }
    })
  }, [state.order])

  const back = useCallback(() => {
    history.goBack()
  }, [])

  // document.getElementsByClassName('icon')

  // console.log('123')

  console.log(state)

  return (
    <Style>
      {
        !show && !showCourier &&
        <Fragment>
          <header className='bar'>
            <span>售后详情</span>
            <div className='bar-back' onClick={back}>
              <span className='arrow'></span>
              <span className='text'>返回</span>
            </div>
          </header>
          <BetterScroll config={scollConfig} ref={scroll} style={scrollStyle}>
            <Fragment>
              <nav className='nav'>
                <ul>
                  {
                    navBar.map((item, index) => {
                      return (
                        <li key={item.index}
                          style={{
                            borderBottom: active === index ? '.1rem solid var(--theme-font-color)' : '',
                            color: active === index ? 'var(--theme-font-color)' : '#474747'
                          }}
                          onClick={changeActive}
                        >
                          {item.title}
                        </li>
                      )
                    })
                  }
                </ul>
              </nav>
              <div className='container'>
                {
                  <ul ref={ulRef} style={{ display: !active ? 'block' : 'none' }}>
                    {
                      state.servesState.map((item, index) => {
                        return (
                          <li key={item.id}>
                            <div className='left'>
                              <div className='icon' >
                                {
                                  (index === 0 || index === 2) && <img className='img' src={require('assets/img/user.svg')} alt="" />
                                }
                                {
                                  (index === 1 || index === 3) && <img className='img' src={require('assets/img/merchants.svg')} alt="" />
                                }
                                {
                                  index === 4 && <img className='img' src={require('assets/img/ok.svg')} alt="" />
                                }

                              </div>
                              {
                                state.lineList.length > 0 &&
                                <span className='line' style={{ height: `${state.lineList[index][0]}px`, top: `${-state.lineList[index][1] - htmlSize.current * 0.3}px` }}></span>
                              }

                            </div>
                            <div className='right'>
                              <p className='right-header'>
                                <span className='title'>{item.title}</span>
                                <span className='time'>{item.time}</span>
                              </p>
                              {
                                item.feedback &&
                                <p>
                                  <span className='feedback'>{item.feedback}</span>
                                </p>
                              }

                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {
                                  (item.status === 1 || item.status === 2) &&
                                  <button className='btn' onClick={changeShow}>再次申述</button>
                                }
                                {
                                  (item.status === 2 || item.status === 3) &&
                                  <button className='btn' onClick={changeCourierShow} >同意处理结果</button>
                                }
                              </div>

                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                }

                {
                  <div className='order' style={{ display: !active ? 'none' : 'block' }}>
                    {
                      state.order &&
                      <Fragment>
                        <div className='order-one'>
                          {
                            state.order.merchant_name &&
                            <div className='mall-name'>{state.order.merchant_name}</div>
                          }
                          {
                            Array.isArray(state.order.goods) ?
                              <Fragment>
                                {
                                  state.order.goods.map(item => {
                                    return (
                                      <Fragment key={item.id}>
                                        <div className='style-one' >
                                          <span>{item.goodsname}</span>
                                          <span>{item.oprice}&nbsp;x&nbsp;{Number(item.num)}</span>
                                        </div>
                                        <div className='style-one'>
                                          <span>规格:</span>
                                          <span>{item.item ? item.item : '无'}</span>
                                        </div>
                                      </Fragment>
                                    )
                                  })
                                }
                              </Fragment> :
                              <Fragment>
                                <div className='style-one'>
                                  <span>{state.order.goodsname}</span>
                                  <span>{state.order.oprice}&nbsp;x&nbsp;{Number(state.order.gnum)}</span>
                                </div>
                                <div className='style-one'>
                                  <span>规格:</span>
                                  <span>{state.order.optionname ? state.order.optionname : '无'}</span>
                                </div>
                              </Fragment>
                          }
                        </div>
                        <div className='order-two'>
                          <div className='style-one'>
                            <span>运费</span>
                            <span>&yen;&nbsp;{state.order.freight}</span>
                          </div>
                          <div className='style-one'>
                            <span>优惠</span>
                            <span>&yen;&nbsp;{state.order.discount_fee}</span>
                          </div>
                          <div className='style-one'>
                            <span>合计</span>
                            <span>&yen;&nbsp;{state.order.realprice}</span>
                          </div>
                        </div>
                        <div className='order-three'>
                          <div className='distribution'>配送信息</div>
                          <div className='style-two'>
                            <p>收货人:&nbsp;{state.order.addname}&nbsp;{state.order.mobile}</p>
                          </div>
                          {
                            state?.order?.address &&
                            <div className='style-two'>
                              <p>收获地址:&nbsp;{state.order.address}</p>
                            </div>
                          }
                        </div>
                        <div className='order-four'>
                          <div className='order-detail'>订单详情</div>
                          <div className='style-two'>
                            <p>订单号码:&nbsp;{state.order.orderno}</p>
                          </div>
                          <div className='style-two'>
                            <p>下单时间:&nbsp;{state.order.createtime}</p>
                          </div>
                          <div className='style-two'>
                            <p>支付方式:&nbsp;{state.order.pay_type}</p>
                          </div>
                        </div>
                      </Fragment>
                    }
                  </div>
                }
              </div>
            </Fragment>
          </BetterScroll>
          {
            state.order && state.salesBtn === 1 &&
            <footer className='foo'>
              <button className='cancel-btn' onClick={cancle}>取消售后</button>
            </footer>
          }
        </Fragment>
      }



      {
        state.order && show &&
        <AfterSaleDetailcomplaint order={state.order} show={show} serves={state.serves} />
      }

      {
        state.order && showCourier &&
        <AfterSaleCourier order={state.order} show={showCourier} serves={state.serves} />
      }
    </Style>
  );
})

const Style = styled.div`

position: relative;

.bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 1.28rem;
  font-size: .48rem;
  color: #474747;
  .bar-back {
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    left: .32rem;
    transform: translate(0, -50%);
    height: 100%;
    .arrow {
      display: inline-block;
      margin-right: .1rem;
      width: .3rem;
      height: .3rem;
      border-top: 1px solid var(--theme-font-color);
      border-right: 1px solid var(--theme-font-color);
      transform: rotate(-135deg);
    }
    .text {
      font-size: .4rem;
      color: var(--theme-font-color);
    }
  }
}

.nav {
  width: 100vw;
  height: 1.28rem;
  ul {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #fff;
    li {
      flex: 1;
      text-align: center;
      line-height: 1.28rem;
      font-size: .4rem;
    }
  }
}

.container {
  /* width: 8rem; */
  /* height: .1rem; */
  padding: 0 .32rem;
  color: #474747;
  ul {
    li {
      display: flex;
      margin-top: .4rem;
      width: 100%;
      /* overflow: hidden; */
      .left {
        position: relative;
        width: 12%;

        .icon {
          position: absolute;
          top: 50%;
          z-index: 2;
          transform: translate(0, -50%);
          width: .6rem;
          height: .6rem;
          background-color: var(--theme-font-color);
          border-radius: 50%;
          .img {
            display: block;
            width: .5rem;
            height: .5rem;
            margin: .3rem auto 0;
            transform: translate(0, -50%);
          }
        }

        .line {
          position: absolute;
          left: .3rem;
          transform: translate(-50%, 0);
          width: 1px;
          background-color: var(--theme-font-color);
        }
      }
      .right {
        position: relative;
        width: 88%;
        padding: .32rem;
        background-color: #fff;
        border-radius: .13rem;
        ::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 1px;
          transform: translate(-100%, -50%);
          border-top: .2rem solid transparent;
          border-right: .2rem solid #fff;
          border-left: .2rem solid transparent;
          border-bottom: .2rem solid transparent;
        }
        .right-header {
          display: flex;
          justify-content: space-between;
          line-height: 1;

          .title {
            color: #474747;
            font-size: .4rem;
          }

          .time {
            font-size: .32rem;
            color: #ccc;
          }
        }

        p {
          .feedback {
            display: inline-block;
            line-height: 1;
            margin-top: .2rem;
            font-size: .32rem;
            color: #ccc;
          }
        }

        .btn {
          margin-top: .2rem;
          padding: 0 .2rem;
          height: .8rem;
          color: #fff;
          background-color: skyblue;
          border-radius: .13rem;
        }
      }
    }
  }
  .order {
    margin-top: .4rem;
    margin-left: -.32rem;
    width: 100vw;

    .style-one {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .2rem .32rem;
      font-size: .32rem;
    }

    .style-two {
      display: flex;
      align-items: center;
      padding: .2rem .32rem;
      font-size: .32rem;
    }

    .order-one {
      width: 100%;
      background-color: #fff;
      .mall-name {
        display: flex;
        align-items: center;
        padding-left: .64rem;
        font-size: .35rem;
        height: 1.2rem;
        border-bottom: 1px solid #c3c3c3;
      }
    }

    .order-two {
      margin-top: .4rem;
      background-color: #fff;
    }

    .order-three {
      margin-top: .4rem;
      background-color: #fff;
      .distribution {
        display: flex;
        align-items: center;
        padding-left: .64rem;
        font-size: .35rem;
        height: 1.2rem;
        border-bottom: 1px solid #c3c3c3;
      }
      .freight, 
      .combined {
        display: flex;
        align-items: center;
        padding: 0 .32rem;
        font-size: .32rem;
        height: 1rem;
      }
    }

    .order-four {
      margin-top: .4rem;
      background-color: #fff;
      .order-detail {
        display: flex;
        align-items: center;
        padding-left: .64rem;
        font-size: .35rem;
        height: 1.2rem;
        border-bottom: 1px solid #c3c3c3;
      }
      .order-number,
      .create,
      .pay_type {
        display: flex;
        align-items: center;
        padding: 0 .32rem;
        font-size: .32rem;
        height: 1rem;
      }
    }
  }
}

.foo {
  display: flex;
  align-items: center;
  width: 100vw;
  height: 1.28rem;
  background-color: #fff;
  .cancel-btn {
    margin-left: .32rem;
    padding: 0 .3rem;
    height: .69rem;
    font-size: .32rem;
    color: var(--theme-font-color);
    border-radius: .33rem;
    border: 1px solid var(--theme-font-color);
  }
}

`

export default AfterSaleDetail;