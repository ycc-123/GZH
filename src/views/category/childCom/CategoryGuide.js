import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components'

function CategoryGuide(props) {
  const [count, setCount] = useState(0)
  const [pageGuide, setPageGuide] = useState(JSON.parse(localStorage.getItem('page')).category)

  useEffect(() => {
    const category = JSON.parse(localStorage.getItem('page')).category
    if (category === 0) {
      setCount(0)
    }
  }, [JSON.parse(localStorage.getItem('page')).category])

  const btnClick = useCallback(() => {
    setCount(count + 1)
    if (count === 0) {
      let guide = JSON.parse(localStorage.getItem('page'))
      guide.category = 1
      localStorage.setItem('page', JSON.stringify(guide))
      setPageGuide(pageGuide + 1)
    }
  }, [count, pageGuide])

  return (
    <Style>
      <div className='mask'
        onClick={btnClick}
        style={{ backgroundColor: 'rgba(0, 0, 0, .9)', display: (count === 0 && (JSON.parse(localStorage.getItem('page')).category === 0)) ? 'block' : 'none' }}>
        {count === 0 && <img src={require('assets/img/guide-c.png')} className='img-one' />}
        {/* {count === 0 && <button className='btn-one' onClick={btnClick}></button>} */}
      </div>
    </Style>

  );
}

const Style = styled.div`

.img-one {
  position: fixed; 
  top: .2rem;
  left: .32rem;
  z-index: 995; 
  width: 7rem; 
  height: auto;
}

`

export default CategoryGuide;