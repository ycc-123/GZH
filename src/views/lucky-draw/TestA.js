import React, { useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components'

function TestA(props) {


  const a = useRef()
  const count = useRef()

  useEffect(() => {
    count.current = 1
  }, [])

  const handelBtn = useCallback(() => {

    a.current.style.transform = `rotate(${count.current * 360}deg) translate3d(0, 0, 0)`
    count.current += 1
  }, [a.current])

  return (
    <Style>
      <div className='box'>
        <div className='a' ref={a} >
          <p>asdasd</p>
          <p>zzzzzzz</p>
        </div>
      </div>

      <button className='b' onClick={handelBtn} >旋转</button>
    </Style>
  );
}

const Style = styled.div`

.box {
  margin:  20px auto;
  width: 300px;
  height: 300px;
  padding: 20px;
  border-radius: 50%;
  background-color: pink;
}

.a {
  width: 255px;
  height: 255px;
  border-radius: 50%;
  background-color: skyblue;
  transform: rotate(0deg) translate3d(0, 0, 0);
  transition: transform 3s;
  border: 1px solid red;
}

.b {
  width: 1rem;
  height: 1rem;
  color: #fff;
  background-color: green;
}

p {
  width: 100%;
  text-align: center;
}

`

export default TestA;