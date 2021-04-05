import React, { Component, Fragment, createRef } from 'react'
import styled from 'styled-components'
import { Toast } from 'antd-mobile'
import { withRouter } from 'react-router-dom'

import { _notesApi } from 'network/home'

import { store } from 'store/index'

class Notice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      titleList: [],
      defaultIndex: 0,
      name: '',
      logo: ''
    }
    this.box = createRef()
  }

  render() {
    let bgColor, textColor
    const { titleList, defaultIndex, name, logo } = this.state
    const { template_color } = store.getState().mallConfig

    if (['1', '2', '3'].find(item => item === template_color)) {
      bgColor = '#474747'
      textColor = '#fff'
    } else {
      bgColor = '#fff'
      textColor = '#474747'
    }

    return (
      <NoticeStyle>
        {titleList.length !== 0 && <div className='notice'>
          <div className='head'>
            <img className='img' src={logo}>

            </img>
            <p className='pp'>
              {name}
              <br />
              {titleList[defaultIndex].createtime}
            </p>
          </div>

          <div className='box' ref={this.box}>
            {titleList.map((item, index) => {
              return (
                <Fragment key={item.id + index}>
                  <p className='title' style={{ display: defaultIndex === index ? 'block' : 'none' }}>{item.title}</p>
                  <p className='content' style={{ display: defaultIndex === index ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: item.content }}>
                  </p>
                </Fragment>

              )
            })}
          </div>
          <div className='button'>
            <button className='left' onClick={this.decrement}
              style={{ backgroundColor: bgColor, color: textColor }} >上一条</button>
            <button className='right' onClick={this.increment}>下一条</button>
          </div>
        </div>}

      </NoticeStyle>
    );
  }
  componentDidMount = async () => {

    const result = await _notesApi()
    const index = result.data.data.list.findIndex(item => item.id === this.props.match.params.id)
    this.setState({
      titleList: result.data.data.list,
      defaultIndex: index,
      name: result.data.data.business.name,
      logo: result.data.data.business.platform_logo
    })
  }

  decrement = () => {
    if (this.state.defaultIndex !== 0) {
      this.setState({ defaultIndex: this.state.defaultIndex - 1 })
    } else {
      Toast.info('没有上一条公告', 1);
    }
  }

  increment = () => {
    if (this.state.defaultIndex !== this.state.titleList.length - 1) {
      this.setState({ defaultIndex: this.state.defaultIndex + 1 })
    } else {
      Toast.info('没有下一条公告', 1);
    }
  }
}



const NoticeStyle = styled.div`

.box {
  margin-top: .2rem;
}

.left {
  float: left;
  width: 4.53rem;
  height: 100%;
  background-color: var(--font-color);
  border-radius: .13rem;
  font-size: .4rem;
  color: var(--tab-color);
}

.right {
  float: right;
  width: 4.53rem;
  height: 100%;
  background: var(--theme-font-color);
  border-radius: .13rem;
  font-size: .4rem;
  color: #fff;
}

.button {
  position: absolute;
  bottom: .4rem;
  width: calc(100vw - .64rem);
  height: 1.07rem;
}

.notice {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 0 .32rem;
  background-color: var(--bg-color);
}

.head {
  display: flex;
  align-items: center;
  width: 100%;
  height: 1.68rem;
  padding: 0 .01rem;
  border-bottom: 1px solid var(--theme-font-color);
}

.img {
  display: inline-block;
  width: .93rem;
  height: .93rem;
  margin-right: .3rem;
}

.pp {
  display: flex;
  align-items: center;
  height: .93rem;
  color: var(--font-color);
}

.title {
  font-size: .48rem;
  margin-top: .59rem;
  margin-bottom: .3rem;
  color: var(--theme-font-color)
}

.content {
  word-wrap:break-word;
  width: 100%;
  height: calc(100vh - 5rem);
  overflow: auto;
  font-size: .5rem;
}

`

export default withRouter(Notice);