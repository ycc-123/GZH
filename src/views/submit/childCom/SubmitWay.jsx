import React, { Component, Fragment } from 'react'


import Drawer from 'common/drawer/Drawer'
import BetterScroll from 'common/betterScroll/BetterScroll'
import { createGlobalStyle } from 'styled-components'

class SubmitWay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: this.props.active,
      placement: 'bottom'
    }
    this.way = [
      { id: 444, content: '申通' },
      { id: 445, content: '中通' },
      { id: 446, content: '顺丰' },
      { id: 444, content: '申通' },
      { id: 445, content: '中通' },
      { id: 446, content: '顺丰' },
      { id: 444, content: '申通' },
      { id: 445, content: '中通' },
      { id: 446, content: '顺丰' },
    ]
  }
  render() {
    const { placement, visible } = this.state
    console.log(placement, visible)
    const scrollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      top: '1.5rem'
    }
    return (
      <SubmitWayStyle>
        
        <ul className='way-box'>
          <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll'>
            {this.way.map((item, index) => {
              return (
                <li key={item + index} className='way-select'
                  onClick={(e) => { this.changeText(e) }}
                >{item.content}</li>
              )
            })}
          </BetterScroll>
        </ul>
      </SubmitWayStyle>
    );
  }
  componentWillReceiveProps = (props) => {
    this.setState({
      visible: props.active,
    })
  }
  onClose = () => {
    this.props.showDrawer()
  }
  changeText = (e) => {
    this.props.showDrawer()
    this.props.changeText(e.target.innerHTML)
    /* this.refs.scroll.BScroll.destroy() */
  }
}
const SubmitWayStyle = styled.div`


`


export default SubmitWay