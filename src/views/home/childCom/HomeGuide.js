import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components'

function HomeGuide(props) {
  const [count, setCount] = useState(0)
  const [pageGuide, setPageGuide] = useState(JSON.parse(localStorage.getItem('page')).home)

  useEffect(() => {
    const home = JSON.parse(localStorage.getItem('page')).home
    if (home === 0) {
      setCount(0)
    }
  }, [JSON.parse(localStorage.getItem('page')).home])

  const btnClick = useCallback(() => {
    setCount(count + 1)
    if (count === 3) {
      let guide = JSON.parse(localStorage.getItem('page'))
      guide.home = 1
      localStorage.setItem('page', JSON.stringify(guide))
      setPageGuide(pageGuide + 1)
    }
  }, [count, pageGuide])

  return (
    <Style>
      <div className='mask'
        onClick={btnClick}
        style={{ backgroundColor: 'rgba(0, 0, 0, .9)', display: (count <= 3 && (JSON.parse(localStorage.getItem('page')).home === 0)) ? 'block' : 'none' }}>
        <img src={require('assets/img/guide-d.png')} className='img-one' style={{ display: count === 0 ? 'block' : 'none' }} />
        <img src={require('assets/img/guide-d1.png')} className='img-two' style={{ display: count === 1 ? 'block' : 'none' }} />
        <img src={require('assets/img/guide-t.png')} className='img-three' style={{ display: count === 2 ? 'block' : 'none' }} />
        <img src={require('assets/img/guide-t1.png')} className='img-four' style={{ display: count === 3 ? 'block' : 'none' }} />
      </div>
    </Style>

  );
}

const Style = styled.div`

.img-one, 
.img-three, 
.img-four {
  position: fixed; 
  top: 1.2rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 995; 
  width: 9.36rem; 
  height: auto;
}

.img-two {
  position: fixed; 
  bottom: env(safe-area-inset-bottom);
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 995; 
  width: 9.36rem; 
  height: auto;
}

`

export default HomeGuide;