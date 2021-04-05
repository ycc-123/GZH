import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components'

function HomeGuide(props) {
  const [count, setCount] = useState(0)
  const [pageGuide, setPageGuide] = useState(JSON.parse(localStorage.getItem('page')).cart)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('page')).cart
    if (cart === 0) {
      setCount(0)
    }
  }, [JSON.parse(localStorage.getItem('page')).cart])

  const btnClick = useCallback(() => {
    setCount(count + 1)
    if (count === 1) {
      let guide = JSON.parse(localStorage.getItem('page'))
      guide.cart = 1
      localStorage.setItem('page', JSON.stringify(guide))
      setPageGuide(pageGuide + 1)
    }
  }, [count, pageGuide])

  return (
    <Style>
      <div className='mask'
        onClick={btnClick}
        style={{ backgroundColor: 'rgba(0, 0, 0, .9)', display: ((count === 0 || count === 1) && (JSON.parse(localStorage.getItem('page')).cart === 0)) ? 'block' : 'none' }}>
        {count === 0 && <img src={require('assets/img/guide-g.png')} className='img-one' />}
        {/* {count === 0 && <button className='btn-one' onClick={btnClick}></button>} */}
        {count === 1 && <img src={require('assets/img/guide-g1.png')} className='img-two' />}
        {/* {count === 1 && <button className='btn-two' onClick={btnClick}></button>} */}
      </div>
    </Style>

  );
}

const Style = styled.div`

.img-one {
  position: fixed; 
  top: .2rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 995; 
  width: 9.36rem; 
  height: auto;
}

.img-two {
  position: fixed; 
  bottom: calc((1.28rem) + env(safe-area-inset-bottom));
  right: 0;
  /* transform: translate(-50%, 0); */
  z-index: 995; 
  width: 6.5rem; 
  height: auto;
}

`

export default HomeGuide;