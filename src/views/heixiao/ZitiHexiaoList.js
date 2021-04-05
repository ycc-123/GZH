import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { setTitle } from 'commons/utils'

import ListItem from './ListItem'

import { _apiS } from 'network/api'

import { store } from 'store/index'


const scollConfig = {
  probeType: 1
}
const scrollStyle = {
  height: '100vh'
}

const ZitiHexiaoList = memo(props => {

  const [orderList, setOrderList] = useState([])

  const scroll = useRef()

  const api_config = useRef()
  const isLoad = useRef()

  useEffect(() => {
    setTitle('核销列表')
    const { uniacid, wxUserInfo: { openid } } = store.getState().appConfig
    isLoad.current = true
    api_config.current = {
      action: 'getOrder',
      data: {
        openid,
        uniacid,
        page: 1,
        pagesize: 10,
        iszzhx: 1
      }
    }
    _apiS(api_config.current).then(res => {
      if (res?.data?.status === 200) {
        console.log(scroll)
        const { list } = res.data.data
        setOrderList(list)
      }
    })
  }, [])

  useEffect(() => {
    if (scroll.current) {
      scroll.current.BScroll.refresh()
      scroll.current.BScroll.finishPullUp()
    }
  }, [orderList])

  const loadMore = useCallback(() => {
    if (isLoad.current) {
      api_config.current.data.page += 1
      _apiS(api_config.current).then(res => {
        if (res?.data?.status === 200) {
          const { list } = res.data.data
          if (list.length === 0) {
            isLoad.current = false
          }
          setOrderList(prev => {
            return [...prev, ...list]
          })
        }
      })
    }

  }, [])



  return (
    <div>
      <BetterScroll
        loadMore={loadMore}
        isLoadMore={isLoad.current}
        ref={scroll}
        config={scollConfig}
        style={scrollStyle}>
        {
          orderList.length > 0 &&
          <ul>
            {
              orderList.map(item => {
                return (
                  <ListItem key={item.id} order={item} />
                )
              })
            }
          </ul>
        }
      </BetterScroll>
    </div >
  )
})

export default ZitiHexiaoList;