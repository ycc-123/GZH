import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components'

function HomeGuide(props) {
  const [count, setCount] = useState(0)
  const [pageGuide, setPageGuide] = useState(JSON.parse(localStorage.getItem('page'))?.submit)

  useEffect(() => {
    const submit = JSON.parse(localStorage.getItem('page')).submit
    if (submit === 0) {
      setCount(0)
    }
  }, [JSON.parse(localStorage.getItem('page')).submit])

  const btnClick = useCallback(() => {
    setCount(count + 1)
    if (count === 1) {
      let guide = JSON.parse(localStorage.getItem('page'))
      guide.submit = 1
      localStorage.setItem('page', JSON.stringify(guide))
      setPageGuide(pageGuide + 1)
    }
  }, [count, pageGuide])

  return (
    <Style>
      <div className='mask'
        onClick={btnClick}
        style={{ backgroundColor: 'rgba(0, 0, 0, .9)', display: ((count === 0 || count === 1) && (JSON.parse(localStorage.getItem('page'))?.submit === 0)) ? 'block' : 'none' }}>
        {count === 0 && <img src={require('assets/img/guide-s.png')} className='img-one' />}
        {/* {count === 0 && <button className='btn-one' onClick={btnClick}></button>} */}
        {count === 1 && <img src={require('assets/img/guide-s1.png')} className='img-two' />}
        {/* {count === 1 && <button className='btn-two' onClick={btnClick}></button>} */}
      </div>
    </Style>

  );
}

const Style = styled.div`

.img-one {
  position: fixed; 
  top: 2.53rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 995; 
  width: 9.36rem; 
  height: auto;
}

.img-two {
  position: fixed; 
  bottom: env(safe-area-inset-bottom);
  right: 0;
  /* transform: translate(-50%, 0); */
  z-index: 995; 
  width: 6.5rem; 
  height: auto;
}

`

export default HomeGuide;