import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'


class DetailRecommend extends Component {
  render() {
    const { dataList } = this.props
    return (
      <Fragment>
        <div className='detail-recommend'>
          {dataList.length !== 0 && <div className='detail-recommend-text'>
            <span className='detail-recommend-raidus-left'></span>
          猜你喜欢
          <span className='detail-recommend-raidus-right'></span>
          </div>}

          <div className='detail-recommend-goods'>
            {
              dataList.map((item, index) => {
                return (
                  <div className='detail-recommend-goods-item' key={item.id + index} onClick={() => { this.goDetail(item.id) }}>
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
          {dataList.length !== 0 && <div style={{ textAlign: 'center', fontSize: 'var(--common-font-color)', fontSize: '.32rem', paddingBottom: '.4rem', backgroundColor: '#fff', borderBottomLeftRadius: '.13rem', borderBottomRightRadius: '.13rem' }}>没有更多了</div>}
        </div>
        {dataList.length !== 0 && <div></div>}
      </Fragment>
    )
  }

  goDetail = (id) => {
    this.props.history.replace({ pathname: `/detail/${id}/1` })
    window.location.reload()
    // this.props.changeData(id, 1)
  }
}

export default withRouter(DetailRecommend)