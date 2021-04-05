import React, { memo, useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import styled from 'styled-components'

import { store } from 'store/index'

import { _api } from 'network/api'
import { Toast } from 'antd-mobile'

const level = memo((props) => {

  const [state, setState] = useState({ level: [], rules: null })
  const textContent = useRef()

  useLayoutEffect(() => {
    const api_config = {
      action: 'memberDescription',
      data: {
        uniacid: store.getState().appConfig.uniacid
      }
    }
    _api(api_config).then(res => {
      if (res.data.status === 200) {
        const { list, member_leave } = res.data.data
        setState(prev => {
          return {
            level: [...prev.level, ...list],
            rules: member_leave
          }
        })
      } else {
        Toast.info('未知错误')
      }
      // console.log(res.data.status)
    })
  }, [])

  const escape2Html = useCallback(str => {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  }, [])

  if (textContent.current) {
    textContent.current.innerHTML = escape2Html(state.rules)
  }

  return (
    <Style>
      <p className='level'>
        <img className='level-img' src={require('assets/img/hy-level.png')} />
        <span>会员等级介绍</span>
      </p>
      <ul>
        {
          state.level.map(item => {
            return (
              <li className='level-li' key={item.id}>
                <div className='level-one'>
                  <span className='level-name'>{item.name}</span>
                  <img src={item.img} />
                </div>
                <div className='level-two'>
                  满
                  <span>{item.money}</span>
                  元
                </div>
                <div className='level-three'>
                  <span>{item.rights}</span>
                  折
                </div>
              </li>
            )
          })
        }

      </ul>
      <p className='info'>
        <img className='info-img' src={require('assets/img/hy-info.png')} />
        <span>会员规则说明</span>
      </p>
      <p className='rules' ref={textContent}></p>
    </Style>
  )
})

const Style = styled.div`

width: 100vw;
height: 100vh;
background-color: var(--bg-color);
padding-top: .2rem;

.level, .info {
  padding-left: .5rem; 
}

.info {
  margin-top: .5rem;
}

.level span,
.info span {
  margin-left: .1rem;
  font-size: .35rem;
  color: var(--theme-font-color);
}

.rules {
  margin: .5rem auto 0;
  width: 80vw;
}

.level-li {
  display: flex;
  margin: .5rem auto 0;
  width: 80vw;
}

.level-li div {
  display: flex;
  align-items: center;
  text-align: left;
  font-size: .35rem;
  color: var(--font-color);
}

.level-one {
  width: 42%;
}

.level-one img {
  margin-left: .32rem;
  width: .48rem;
  height: .48rem;
}

.level-two {
  width: 38%;
}

.level-two span {
  margin: 0 .1rem;
}

.level-three {
  width: 20%;
}

.level-three span {
  margin-right: .1rem;
}

.level-img {
  width: .35rem;
  height: auto;
}

.info-img {
  width: .3rem;
  height: auto;
}

.level-name {
  display: block;
  /* width: 1.4rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap; */
}

`

export default level;