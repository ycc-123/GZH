import React, { memo, useEffect, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { _apiU } from 'network/api'

const SignRules = memo(props => {

  const [state, setState] = useState(null)

  const textContent = useRef()

  useEffect(() => {
    const action = 'signinRules'
    _apiU(action).then(res => {
      setState(res.data.data)
    })
  }, [])

  const escape2Html = useCallback(str => {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  }, [])

  if (textContent.current && state) {
    textContent.current.innerHTML = escape2Html(state)
  }

  return (
    <Style ref={textContent}>

    </Style>
  );
})

const Style = styled.div`

width: 100vw;
height: 100vh;
background-color: #fff;

`

export default SignRules;