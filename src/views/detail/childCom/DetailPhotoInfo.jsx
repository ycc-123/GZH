import React, { PureComponent } from 'react'

class DetailPhotoInfo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      active: true
    }
    this.escape2Html = str => {
      var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
      return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
    }
  }
  render() {
    const { active } = this.state
    const { goods } = this.props
    const showInfo = active ? 'block' : 'none'
    const showImg = active ? 'none' : 'block'
    return (goods.params.length > 0 || goods.gdesc) && <div className='detail-photo'>
      <div className='detail-photo-button'>
        <button className='detail-photo-left detail-photo-active' onClick={(e) => { this.changeActive(e) }}>图文详情</button>
        <button className='detail-photo-right' onClick={(e) => { this.changeActive(e) }}>商品属性</button>
      </div>
      <div className='img' style={{ display: showInfo }}>
        <p className='content'></p>
      </div>
      <div className="info" style={{ display: showImg }}>
        <ul>
          {goods.params.map((item, index) => {
            return (
              <li className='info-li' key={item.id + index}>
                <span className='params-left'>{item.title}</span>
                <span className='params-right'>{item.value}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  }
  componentDidMount = () => {
    const { goods } = this.props
    if (goods.gdesc) {
      let content = document.querySelector('.img .content')
      let div = document.createElement('p')
      div.className = 'content'
      div.innerHTML = this.escape2Html(goods.gdesc)
      let promise = Array.prototype.map.call(div.querySelectorAll('img'), function (img) {
        return new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
      })
      Promise.all(promise).then(() => {
        content.replaceWith(div)
        this.props.refresh()
      })
    }

    this.props.refresh()
  }

  changeActive = (e) => {
    if (!e.target.classList[1]) {
      let button = document.querySelectorAll('.detail-photo-button button')
      this.setState({
        active: !this.state.active
      }, () => {
        this.props.refresh()
      })
      button.forEach(item => {
        item.classList.remove('detail-photo-active')
      })
      e.target.classList.add('detail-photo-active')
    }
  }
}

export default DetailPhotoInfo;