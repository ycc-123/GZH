import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { dropByCacheKey } from 'react-router-cache-route'

class DetailRecommend extends Component {
  render() {
    const { dataList } = this.props
    return (
      <Style>
        <div className='g-recommend'>
          <div className='g-recommend-text'>
            <span className='g-recommend-raidus-left'></span>
          猜你喜欢
          <span className='g-recommend-raidus-right'></span>
          </div>
          <div className='g-recommend-goods'>
            {
              dataList.map((item, index) => {
                return (
                  <div className='g-recommend-goods-item' key={item.id + index} onClick={() => { this.goDetail(item.id) }}>
                    <div className='recommend-img'>
                      <img src={item.gimg} alt="" />
                    </div>
                    <p>{item.gname}</p>
                    <p><span>￥</span>{item.oprice}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </Style>
    )
  }

  goDetail = (id) => {
    dropByCacheKey('DetailComponent')
    this.props.history.replace({ pathname: `/detail/${id}/1` })
    // this.props.changeData(id, 1)
  }
}

const Style = styled.div`



.g-recommend {
  overflow: hidden;
  border-radius: .13rem;
  padding-bottom: .4rem;
}

.g-recommend-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2rem;
  font-size: .45rem;
  font-weight: bold;
  letter-spacing: .1rem;
  color: var(--theme-font-color);
  background-color: #fff;
}

.g-recommend-raidus-left, .g-recommend-raidus-right {
  position: relative;
  display: inline-block;
  width: .2rem;
  height: .2rem;
  border-radius: .1rem;
  background: var(--theme-font-color);
}

.g-recommend-raidus-left {
  margin-right: .4rem;
}

.g-recommend-raidus-left::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -1.17rem;
  width: 1.17rem;
  height: .02rem;
  transform: translate(0, -50%);
  background: #c86030;
}

.g-recommend-raidus-right {
  margin-left: .4rem;
}

.g-recommend-raidus-right::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -1.17rem;
  width: 1.17rem;
  height: .02rem;
  transform: translate(0, -50%);
  background: #c86030;
}

.g-recommend-goods {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 .4rem;
  background-color: #fff;
}

.g-recommend-goods-item {
  margin-bottom: .4rem;
  padding: .32rem;
  width: 4.13rem;
  height: 5.48rem;
  border-radius: .13rem;
  box-shadow: 0px 0px 5px #CDCDCD;
}


.recommend-img img {
  width: 3.47rem;
  height: 3.52rem;
}

.g-recommend-goods div p:first-of-type {
  margin-top: .16rem;
  font-size: .32rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.g-recommend-goods div p:nth-of-type(2) {
  margin-top: .1rem;
  font-size: .4rem;
  color: var(--theme-font-color);
}


`

export default withRouter(DetailRecommend);