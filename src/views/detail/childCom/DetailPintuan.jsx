import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { dropByCacheKey } from 'react-router-cache-route'

import { store } from 'store/index'

class DetailPintuan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true,
      length: this.props.tuanorder_progress.length,
      defaultLength: 5
    }
  }
  render() {
    const { tuanorder_progress } = this.props
    const { defaultLength, length } = this.state
    let text = length > defaultLength ? '查看更多' : '没有更多了'
    return (
      <DetailPintuanStyle>
        <div className="pintuanframe">
          <div className="pintuantext1">附近的小伙伴正在发起团购，您可以直接参团</div>
          <div>
            {tuanorder_progress.slice(0, defaultLength).map((item, index) => {
              return (
                <div key={item.id + index}>
                  <div className="pintuanframekuang" onClick={() => { this.goGroup(item.id) }}>
                    <img className="pintuanimg" src={item.avatar} alt="" />
                    <div className="pintuanframekuang2" onClick={this.show}>
                      <div className="pintuantextframe" style={{ color: 'var(--common-font-color)' }}>
                        <div>{item.nickname ? item.nickname : ''}</div>
                        <div style={{ fontSize: "0.27rem" }}>发起时间 {item.starttime}</div>
                      </div>
                      <div className="pintuantextframe" style={{ height: '.61rem' }}>
                        <div className="pintuantextkuang1">￥{item.group_price}/份</div>
                        <div className="pintuantextkuang2">差{item.lacknum}人成团 火速参团</div>
                      </div>
                    </div>
                  </div>
                  <div className="xiantiao"></div>
                </div>
              )
            })}
          </div>
          <div className="pintuanno" onClick={() => this.changeLength()}>
            {text}
          </div>
        </div>
      </DetailPintuanStyle>
    )
  }

  goGroup = (id) => {
    dropByCacheKey('DetailComponent')
    const { isApplet } = store.getState().appConfig

    isApplet ? window.navigateToWebWiew(`#/group/${id}`) : this.props.history.push(`/group/${id}`)
  }

  changeLength() {
    this.setState({
      defaultLength: this.state.defaultLength + 5
    }, () => {
      this.props.refresh()
    })
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.state) !== JSON.stringify(nextState) || JSON.stringify(this.props.tuanorder_progress) !== JSON.stringify(nextProps.tuanorder_progress)
  }


}

const DetailPintuanStyle = styled.div`
.pintuanframe{
  margin-bottom: .32rem;
  background-color: #fff;
  border-radius: .13rem;
  overflow: hidden;
}
.pintuantext1{
  height: 1.07rem;
  line-height: 1.07rem;
  padding-left: .4rem;
  font-size: .4rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(71, 71, 71, .2);
  color: var(--common-font-color);
}
.pintuanframekuang{
  display:flex;
  align-items:center;
  height: 1.06rem;
  margin-top:0.4rem;
  padding: 0 .4rem;
}
.pintuanimg {
  display: block;
  width: 1.06rem;
  height: 1.06rem;
  background: white;
  border-radius: 50%;
}
.pintuanframekuang2{
  width: calc(100% - 1.23rem);
  font-size: .32rem;
  font-weight: 600;
  margin-left: .16rem;
}
.pintuantextframe{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:0.13rem;
}
.pintuantextkuang1{
  width:50%;
  height:0.61rem;
  line-height:0.61rem;
  text-align:center;
  align-items:center;
  border: 1px solid var(--theme-font-color);
  border-bottom-left-radius: 0.1rem;
  border-top-left-radius: 0.1rem;
}
.pintuantextkuang2{
  width:50%;
  height:0.61rem;
  line-height:0.61rem;
  color: #fff;
  text-align:center;
  align-items:center;
  border: 1px solid var(--theme-font-color);
  background:var(--theme-font-color);
  border-bottom-right-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
}
.xiantiao{
  width:100%;
  height:0.4rem;
  border-bottom: 1px solid #CCC;
}
.pintuanno{
  text-align: center;
  font-size: .32rem;
  font-weight: 500;
  height: 1rem;
  line-height: 1rem;
  color: var(--common-font-color);
}
`
export default withRouter(DetailPintuan)