import React, { memo, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Modal from 'common/modal/Modal'

const LuckyPrizeInfo = memo(props => {


  const history = useHistory()

  const coupon = useCallback(() => {
    history.push('/coupon')
  }, [])


  return (
    <Style style={{ display: !props.prizeInfo ? 'none' : 'block' }}>
      <div className='mask' onClick={() => { props.close() }}></div>
      <Modal>
        <div style={{ display: !props.prizeInfo ? 'none' : 'block' }}>
          <img className='lucky-box-img' alt='' src={require('assets/img/lucky-box.png')} />
          <div className='lucky-box1'>
            <div className='lucky-box2'>
              <div className='lucky-box3'>
                <p className='lucky-p1'>{props.prizeInfo ? props.prizeInfo.type === '4' ? '谢谢惠顾' : '恭喜抽中' : ''}</p>
                <p className='lucky-p2'>{props?.prizeInfo?.msg}</p>
                {/* 优惠券 */}
                {
                  <div className='lucky-div-box' style={{ display: props?.prizeInfo?.type === '2' ? 'block' : 'none' }}>
                    <div className='lucky-div1'></div>
                    <div className='lucky-div2'>
                      <div className='lucky-div3'>
                        <div className='lucky-div3-div1'>
                          <button className='lucky-div3-div2'>券</button>
                        </div>
                        <span style={{ fontSize: '.48rem', fontWeight: 'bold', position: 'relative', color: '#EA2F23' }}>
                          &yen;
                        </span>
                        <span style={{ position: 'relative', color: '#EA2F23', fontSize: '.65rem', fontWeight: 'bold', lineHeight: '1', marginBottom: '-.1rem' }}>
                          {props?.prizeInfo?.coupon_price}
                        </span>
                      </div>
                    </div>
                    <img className='lucky-div-img' src={require('assets/img/lucky-div-img.png')} />
                    <p style={{ position: 'absolute', zIndex: '10', top: '50%', transform: 'translate(0, -50%)', fontSize: '.48rem', right: '1.39rem', textAlign: 'center', width: '2rem', color: '#fff' }}>优惠券</p>
                  </div>
                }
                {/* 谢谢惠顾 */}
                <img className='lucky-thank' style={{ display: props?.prizeInfo?.type === '4' ? 'block' : 'none' }} src={require('assets/img/thank.png')} />
                {/* 积分 */}
                <img className='prize-integral' style={{ display: props?.prizeInfo?.type === '1' ? 'block' : 'none' }} src={require('assets/img/integral-big.png')} />
                {/* 实物奖励 */}
                {
                  props?.prizeInfo?.type === '3' &&
                  <img className='lucky-thank' src={props.prizeInfo.img} />
                }

                <div className='lucky-btn claerfix'>
                  {
                    props?.prizeInfo?.type === '2' &&
                    <button className='lucky-btn-left' onClick={coupon}>去看看</button>
                  }
                  <button className='lucky-btn-right' onClick={() => { props.close() }} >继续抽奖</button>
                </div>
              </div>
            </div>
          </div>
          <img className='prize-cha' src={require('assets/img/sign-cha.png')} onClick={() => { props.close() }} />
        </div>
      </Modal>
    </Style>
  );
})

const Style = styled.div`


`

export default LuckyPrizeInfo;