import React, { memo, useCallback, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'

import { store } from 'store/index'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { _apiS } from 'network/api'

const scrollConfig = {
  probeType: 1
}
const scrollStyle = {
  height: '100vh',
  padding: '0 .32rem',
}

const AfterSaleDetailcomplaint = memo(({ order, show, serves }) => {
  const [state, setState] = useState(() => {
    return {
      value: serves.servicereson
    }
  })

  const [inputValue, setInputValue] = useState(() => {
    return {
      value: ''
    }
  })

  const timer = useRef()
  const dom = useRef()

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])

  useEffect(() => {
    dom.current.style.top = '0'
  }, [])

  const changeValue = useCallback((e) => {
    console.log(e.target.value)
    setInputValue({ value: e.target.value })
  }, [inputValue])

  const applyfor = useCallback(() => {
    const { uniacid, wxUserInfo: { openid } } = store.getState().appConfig
    const api_config = {
      action: 'applyServes',
      data: {
        uniacid,
        openid,
        orderno: order.orderno,
        servicelastremark: inputValue.value,
        feedbackexpress: order.feedbackexpress,
        feedbackexpresssn: order.feedbackexpresssn
      }
    }


    _apiS(api_config).then(res => {
      if (res?.data?.status === 200) {
        Toast.info('提交成功', 2)
        timer.current = setTimeout(() => {
          window.location.reload()
        }, 2100)
      }
    })

  }, [inputValue])

  return (
    <Style>
      <div className='soft' ref={dom}>
        <BetterScroll config={scrollConfig} style={scrollStyle}>
          <div className='soft-bai'>
            <div className='soft-title'>
              <div>申请售后</div>
            </div>
            <ul>
              {
                Array.isArray(order.goods) ?
                  order.goods.map(item => {
                    return (
                      <li key={item.id}>
                        <div className='e-1'>
                          <div style={{ display: 'flex', alignItems: 'center' }}>商品名称&nbsp;:</div>
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '6rem', wordBreak: 'break-all' }}>{item.goodsname}</span>
                        </div>
                        <div className='count'>
                          <span className='count-l'>数 量&nbsp;:</span>
                          <span className='count-r'>x{item.num}</span>
                        </div>
                      </li>
                    )
                  }) : <li>
                    <div className='e-1'>
                      <div style={{ display: 'flex', alignItems: 'center' }}>商品名称&nbsp;:</div>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '6rem', wordBreak: 'break-all' }}>{order.goodsname}</span>
                    </div>
                    <div className='count'>
                      <span className='count-l'>数 量&nbsp;:</span>
                      <span className='count-r'>x{order.gnum}</span>
                    </div>
                  </li>
              }
              <div className='count'>
                <span>优惠金额&nbsp;:</span>
                <span className='count-r'>-{order.discount_fee}</span>
              </div>
              <div className='count'>
                <span>实付金额&nbsp;:</span>
                <span className='actual'>{order.realprice}</span>
              </div>
              <div className='count'>
                <span>退款原因&nbsp;:</span>
                <span>
                  {state.value}
                </span>
              </div>
            </ul>
            <div className='refund-t' style={{ borderBottom: '1px solid #ddd' }}>
              <p className='refund-b'>
                <span>退款理由&nbsp;:</span>
                <span style={{ display: 'block', width: '6rem', textAlign: 'right', wordBreak: 'break-all' }}>{serves.serviceremark}</span>
              </p>
            </div>
            <div className='refund-t'>
              <p className='refund-b'>再次申述理由&nbsp;:</p>
              <div className='shuc'>
                <textarea type="text" onChange={changeValue} value={inputValue.value} className='area' placeholder='请简单描述问题' />
              </div>
            </div>
            <div className='footer'>
              <button className='button' onClick={applyfor}>提交</button>
            </div>
          </div>
        </BetterScroll>
      </div>
    </Style >
  );
})

const Style = styled.div`

.e-1 {
  display: flex;
  justify-content: space-between;
  padding: 0 .4rem;
  min-height: 1.21rem;
  font-size: .4rem;
  border-bottom: 1px solid #ddd;
}

.soft {
  position: relative;
  top: 100vh;
  z-index: 100;
  width: 100%;
  background-color: #ededed;
  height: 100vh;
  transition: all 1s;
}

option {
  text-align:right;
}
.soft-bai{
  width: 100%;
  background-color: #fff;
  border-radius: .2rem;
}
.soft-title{
  width:100%;
  font-size:.77rem;
  color:#474747;
  text-align: center;
}
.soft-title div{
  margin-bottom:1.1rem;
  padding-top:.97rem;
  font-size: .77rem;
  font-weight:400;
  color:#474747;
}
.goods-name{
  text-indent:.4rem;
  height:1.21rem;
  line-height:1.21rem;
  color:#474747;
  font-size:.4rem;
  border-bottom:1px solid #ddd;
  display:flex;
  justify-content:space-between;
}
.goods-name div{
  color:#474747;
  font-size:.4rem;

}
.name {
  color:#474747;
}

.count {
  display: flex;
  justify-content: space-between;
  padding: 0 .4rem;
  color:#474747;
    /* text-indent:.4rem; */
  height:1.21rem;
  line-height:1.21rem;
  font-size:.4rem;
  border-bottom:1px solid #ddd;
}
.count-r {
  color:#c7c7c7;
}

.actual {
  color: var(--theme-font-color);
}
.refund {
    /* margin-left:3.6rem; */
    /* line-height:1.21rem; */
  background-color: #fff;
  color:#c7c7c7;
  direction: rtl;
  border:none;
    /* border-bottom:1px solid #ddd; */
}
.refund-b {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 1.21rem;
  padding: .2rem .4rem;
  font-size:.4rem;
  color:#474747;
}
.shuc{
  display:flex;
  align-items:center;
  justify-content: center;
  margin-left:.4rem;
  margin-right:.4rem;
}

.area{
  border-radius: .2rem;
  border:1px solid #ccc;
  width: 100%;
  height:2.05rem;
  font-size:.4rem;
  padding-top:.35rem;
  padding-left:.35rem;
  outline:none;
}
.footer{
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding-top:.8rem;
  padding-bottom: .2rem;
}
.button{
  background-color: var(--theme-font-color);
  color:#fff;
  width:4.05rem;
  height:0.95rem;
  text-align: center;
  border-radius: 5rem;
  font-size:.4rem;
}

`

export default AfterSaleDetailcomplaint;