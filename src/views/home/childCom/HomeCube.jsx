import React, { Component } from 'react'
import styled from 'styled-components'

class HomeCube extends Component {

  render() {
    const { data } = this.props
    return (
      <HomeCubeStyle>
        <div className='cube clearFix' ref='cube'>
          {data.map((item, index) => {
            return (
              <div className='item' key={item + index}>
                <img src={item.thumb} alt='' onClick={() => { this.go(item.link) }} />
              </div>
            )
          })}
        </div>
      </HomeCubeStyle>
    )
  }

  go = (link) => {
    console.log(link)
    window.location.href = link
  }

  componentDidMount = () => {
    const { data } = this.props
    const cube = this.refs.cube
    const item = cube.querySelectorAll('.item')
    switch (data.length) {
      case 1:
        item[0].style.width = `9.36rem`
        item[0].style.height = `4.68rem`
        break;
      case 2:
        item[0].style.width = `4.68rem`
        item[0].style.height = `4.68rem`
        item[1].style.width = `4.68rem`
        item[1].style.height = `4.68rem`
        break;
      case 3:
        item[0].style.width = `4.68rem`
        item[0].style.height = `4.68rem`
        item[1].style.width = `4.68rem`
        item[1].style.height = `2.34rem`
        item[2].style.width = `4.68rem`
        item[2].style.height = `2.34rem`
        break;
      case 4:
        item[0].style.width = `4.68rem`
        item[0].style.height = `4.68rem`
        item[1].style.width = `4.68rem`
        item[1].style.height = `2.34rem`
        item[2].style.width = `2.34rem`
        item[2].style.height = `2.34rem`
        item[3].style.width = `2.34rem`
        item[3].style.height = `2.34rem`
        break;
      case 5:
        item[0].style.width = `4.68rem`
        item[0].style.height = `4.68rem`
        item[1].style.width = `2.34rem`
        item[1].style.height = `2.4rem`
        item[2].style.width = `2.34rem`
        item[2].style.height = `2.4rem`
        item[3].style.width = `2.34rem`
        item[3].style.height = `2.4rem`
        item[4].style.width = `2.34rem`
        item[4].style.height = `2.4rem`
        break;
      case 6:
        item.forEach(item => {
          item.style.width = `4.68rem`
          item.style.height = `1.56rem`
        })
        break;
      default: break;
    }

    /* let promise = Array.prototype.map.call(cube.querySelectorAll('img'), function (img) {
      return new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
    })
    Promise.all(promise).then(() => {
      if (this.props.refresh) {
        this.props.refresh()
      }
    }) */
  }
}


const HomeCubeStyle = styled.div`

.cube {
  margin-left: .32rem;
  margin-top: .16rem;
  width: 9.36rem;
  height: 4.68rem;
  border-radius: .2rem;
  overflow: hidden;
}

.item {
  float: left;
  display: inline-block;
}

.item img {
  width: 100%;
  height: 100%;
  display: block;
}

`

export default HomeCube;