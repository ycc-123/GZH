import React, { PureComponent, createRef } from 'react'
import { withRouter } from 'react-router-dom'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { setTitle } from 'commons/utils'

import { store } from 'store/index'
import { saveLocationInfo } from 'store/actionCreators'

import './location.css'

const scollConfig = {
  probeType: 1
}

const scrollStyle = {
  height: '6.71rem'
}

class Location extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props,
      activeIndex: ''
    }
    this.scroll = createRef()

  }
  render() {
    const { pois, regeocode, activeIndex } = this.state
    console.log(this.state)
    return (
      <div id='map-wrapper' style={{ height: 'calc(100vh - 0px)', width: '100vw' }}>
        <div className='location-box'>
          <div className='location-header'>
            <p style={{ width: '.72rem', height: '.08rem', background: '#c1c1c1' }}></p>
          </div>
          <ul className='location-address'>
            <BetterScroll
              config={scollConfig}
              style={scrollStyle}
              ref={this.scroll}>
              {pois.map((item, index) => {
                return (
                  <li className='address-li' key={item.id} style={{
                    paddingLeft: activeIndex === index ? '.27rem' : '.4rem',
                    borderLeft: activeIndex === index ? '.13rem solid #EB7C33' : 'none'
                  }} onClick={() => this.changeIndex(index, item)}>
                    <p>
                      <span style={{ fontSize: '.4rem', color: '#474747', fontWeight: '800' }}>{item.name}</span>
                      <br />
                      <span className='location_-___--___---__'
                        style={{
                          fontSize: '.32rem',
                          color: "var(--common-font-color)",
                          opacity: '.5',
                        }}>{regeocode.addressComponent.province + regeocode.addressComponent.city + regeocode.addressComponent.district + item.address}
                      </span>
                    </p>
                  </li>
                )
              })}
              <li style={{ height: '5px', width: '100%' }}></li>
            </BetterScroll>
          </ul>
        </div>
      </div>
    )
  }
  componentDidMount = () => {

    setTitle('新增地址')

    let AMap = window.AMap
    let AMapUI = window.AMapUI
    let that = this

    AMap.plugin(["AMap.PlaceSearch", 'AMap.Geocoder'], () => {
      this.placeSearch = new AMap.PlaceSearch({
        pageSize: 10,
        pageiNDEX: 1
      })
      this.geocoder = new AMap.Geocoder()
    })

    let map = new AMap.Map('map-wrapper', {
      zoom: 17,
      scrollWheel: false,
      center: [that.props.lng, that.props.lat],
    })

    AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
      this.positionPicker = new PositionPicker({
        mode: 'dragMap',
        map
      })

      map.on('dragend', this.showInfoDragend)
      this.positionPicker.start()
      map.panBy(0, 1)
      map.addControl(new AMap.ToolBar({
        liteStyle: true
      }))
    })
    this.scroll.current.BScroll.refresh()
  }

  showInfoDragend = (e) => {
    console.log(e)
    let lnglat = [e.lnglat.lng, e.lnglat.lat]
    this.geocoder.getAddress(lnglat, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        this.placeSearch.searchNearBy('', lnglat, 200, (status, res) => {
          console.log(res)
          this.setState({
            regeocode: result.regeocode,
            pois: res.poiList.pois
          }, () => {
            this.scroll.current.BScroll.scrollTo(0, 0, 1000)
            this.scroll.current.BScroll.refresh()
          })
        })
      }
    })
  }

  changeIndex(index, item) {
    const { addressComponent } = this.state.regeocode
    const newRegeocode = {
      regeocode: addressComponent.province + addressComponent.city + addressComponent.district,
      province: addressComponent.province,
      district: addressComponent.district,
      city: addressComponent.city
    }
    const setStoreData = Object.assign({}, item, newRegeocode)
    store.dispatch(saveLocationInfo(setStoreData))
    this.setState({ activeIndex: index }, () => {
      this.props.history.go(-1)
    })
  }
}

function withLocation(WappendComponent) {
  return class extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        lat: '',
        lng: ''
      }
    }
    onComplete = data => {
      let AMap = window.AMap
      let lnglat = [data.position.getLng(), data.position.getLat()]
      AMap.plugin(["AMap.PlaceSearch", 'AMap.Geocoder'], () => {
        this.placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageiNDEX: 1
        })
        this.geocoder = new AMap.Geocoder()
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.placeSearch.searchNearBy('', lnglat, 200, (status, res) => {
              this.setState({
                lat: store.getState().locationInfo.location ? store.getState().locationInfo.location.lat : data.position.getLat(),
                lng: store.getState().locationInfo.location ? store.getState().locationInfo.location.lng : data.position.getLng(),
                pois: res.poiList.pois,
                regeocode: result.regeocode
              })
            })
          }
        })
      })
    }

    onError(data) {
      console.log(data)
    }

    UNSAFE_componentWillMount() {
      let that = this
      let AMap = window.AMap
      AMap.plugin('AMap.Geolocation', function () {
        that.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 2000,          //超过10秒后停止定位，默认：5s
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        })
        that.geolocation.getCurrentPosition(function (status, result) {
          console.log(result)
          if (status === 'complete') {
            that.onComplete(result)
          } else {
            that.onError(result)
          }
        })
      })
    }
    render() {
      const { lat, lng } = this.state
      return lat !== '' && <WappendComponent {...this.state} />
    }
  }
}

const enhanceLocation = withLocation(withRouter(Location))



export default enhanceLocation;