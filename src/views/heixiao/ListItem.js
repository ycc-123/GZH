import React, { memo, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { store } from 'store/index'


const ListItem = memo(props => {

  const { orderno, goods, status, realprice, selltype, refund, discount_fee, price, id, gimg, goodsname, oprice, gnum, optionname, statusname } = props.order

  const history = useHistory()
  const params = useParams()
  const { openid: staffOpenid, storeid } = params

  const jump = useCallback(() => {
    history.push({ pathname: `/zitihexiao/${orderno}`, search: `oid=${staffOpenid}&sid=${storeid}` })
  }, [])

  const seeOrderDetail = useCallback(() => {
    const { isApplet } = store.getState().appConfig
    isApplet ? window.navigateToWebWiew(`#/order/detail/${orderno}/${id}`) : history.push(`/order/detail/${orderno}/${id}`)
  }, [])

  return (
    <Style>
      <header className='head'>
        <p>订单号: {orderno}</p>
        <p style={{ fontSize: '.35rem', color: 'var(--theme-font-color)', fontWeight: '600' }}>{statusname}</p>
      </header>
      <div className='main' onClick={seeOrderDetail}>
        {
          Array.isArray(goods) &&
          goods.map(item => {
            return (
              <div style={{ display: 'flex', marginBottom: '.4rem' }} key={item.id}>
                <img className='img' src={item.gimg} />
                <div className='main-box'>
                  <p className='one'>{item.goodsname}</p>
                  <p className='two'>
                    <span className='price'>&yen;{item.oprice}</span>
                    <span className='num'>x{item.num}</span>
                  </p>
                  <p className='three'>规格：{item.item ? item.item : '无'}</p>
                </div>
              </div>
            )
          })
        }
        {
          !Array.isArray(goods) &&
          <div style={{ display: 'flex', marginBottom: '.4rem' }}>
            <img className='img' src={gimg} />
            <div className='main-box'>
              <p className='one'>{goodsname}</p>
              <p className='two'>
                <span className='price'>&yen;{oprice}</span>
                <span className='num'>x{gnum}</span>
              </p>
              <p className='three'>规格：{optionname ? optionname : '无'}</p>
            </div>
          </div>
        }
        <div className='total-info'>
          <span style={{ marginRight: '.25rem' }}>总价{price}</span>
          <span style={{ marginRight: '.25rem' }}>优惠￥{discount_fee ? discount_fee : '0.00'}</span>
          {
            selltype === '4' && (status === '2' || status === '3' || status === '8' || status === '10') && <span className="totalFee">退款{refund}</span>
          }
          {
            status !== '0' && <span style={{ fontSize: '.35rem', color: '#474747' }}>
              实付款￥{realprice}
            </span>
          }
        </div>
      </div>
      <footer className='footer'>
        <button style={{ lineHeight: store.getState().appConfig.isIOS ? '.69rem' : '' }} onClick={jump}>去核销</button>
      </footer>
    </Style>
  );
})

const Style = styled.li`

margin: 0 auto .32rem;
width: 9.36rem;
background-color: #fff;
border-radius: .13rem;
overflow: hidden;

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 .5rem;
  height: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.main {
  padding: .4rem;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  div {
    .img {
    width: 2rem;
    height: 2rem;
    }
    .main-box {
      position: relative;
      margin-left: .2rem;
      width: calc(100% - 2.5rem);
      height: 2rem;
      .one {
        font-size: .32rem;
      }
      .two {
        margin-top: .2rem;
        display: flex;
        justify-content: space-between;
        color: #c3c3c3;
        font-size: .32rem;
      }
      .three {
        position: absolute;
        bottom: 0;
      }
    }
    
  }
  
}

.total-info {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  font-size: .32rem;
  color: #c3c3c3;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 1.33rem;
  button {
    margin-right: .4rem;
    padding: 0 .3rem;
    height: .69rem;
    border-radius: .33rem;
    border: 1px solid #474747;
    color: #474747;
  }
}


`

export default ListItem;