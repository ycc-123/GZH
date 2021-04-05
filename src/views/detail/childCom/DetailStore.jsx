import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode-react'

import { setTitle } from 'commons/utils'

import BetterScroll from 'common/betterScroll/BetterScroll'
import Modal from 'common/modal/Modal'

import axios from 'axios'
import { _lives } from "network/live";
import { _apiUO, _api } from 'network/api'

import { store } from 'store/index'

import './qr.css'


const wx = window.wx

class DetailStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true,
      data: [],
      img: '',
      searchValue: '',
      uniacData: {},
      isShowQRCode: false,
      check: false,
      showQRCode: false,
      qrImg: null
    }

    const { appConfig } = store.getState()
    const { uniacid } = appConfig

    this.scroll = createRef()

    this.networkConfig = {
      uniacidDetail: {
        action: 'uniacidDetail',
        data: {
          uniacid,
        }
      },
      getjsapiticket: {
        action: 'getjsapiticket',
        data: {
          uniacid,
          url: window.location.href.split('#')[0]
        }
      },
    }

  }
  render() {
    const { data, img, check, showQRCode, uniacData, qrImg } = this.state
    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc(100vh - 5.5rem)',
    }

    console.log(this.state.uniacData.qrcodeImg)

    return (
      <DetailStoreStyle>
        <div className="zong">
          <div className="xinxitop">
            {check && <img className="xinxitopimg" src={img ? img : require('assets/img/default-t.png')} alt='' />}
            <div className="xinxitopbtn" onClick={this.showQRCode}>+关注微信</div>
          </div>

          <div className="center1122">
            <div className="centerframe1">
              <input className="centerframe1ipt" type="search" name="searchValue" onChange={this.handleChang}
                value={this.state.searchValue} placeholder="请输入搜索关键词"
                onBlur={this.resetState}
                enterkeyhint='search' onKeyDown={this.onInputKeyCode}
              />
              <img className="centerframe1img" src='https://res.lexiangpingou.cn/images/vip/search.png' alt='' />
            </div>


            {data.length !== 0 && <BetterScroll config={scollConfig}
              style={scrollStyle}
              ref={this.scroll}>
              <div style={{ height: '.1rem' }}></div>
              {data.map((item, index) => {
                return (
                  <div className="centerframe2" key={item.id + index}>
                    <div className="centerframe2f1">
                      <div className="centerframe2f1textf1">
                        <div className="centerframe2f1text1">{item.storename}</div>
                        <div className="centerframe2f1text2">{item.address}</div>
                      </div>
                      <div className="centerframe2f1textf2">
                        <img className="centerframe2f1img" src='https://res.lexiangpingou.cn/images/vip/storedaohan.png' alt='' />
                        <div className="centerframe2f1text3" onClick={(e) => { this.goDaoHan(e, item) }}>导航去这里</div>
                      </div>
                    </div>
                    <div className="xiantiao"></div>
                    <div className="centerframe2f2">
                      <img className="centerframe2f2img" src={item.image ? item.image : 'https://res.lexiangpingou.cn/images/vip/20201127/defaultstore.png'} alt='' />
                      <div className="centerframe2f2textf" >
                        <div className="centerframe2f2text1" >{item.address}</div>
                        <div className="centerframe2f2text2" >营业时间:&ensp;{item.business}</div>
                        <div className="centerframe2f2f">
                          <div className="centerframe2f2text3">联系电话:&ensp;{item.tel}</div>
                          <div className="centerframe2f2text4"><img className="centerframe2f2img2" src='https://res.lexiangpingou.cn/images/vip/storetell.png' alt='' /><a style={{ color: '#474747' }} href={'tel:' + item.tel}>拨打电话</a></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div style={{ height: '.1rem' }}></div>
            </BetterScroll>}
          </div>
        </div>
        <div className='mask' style={{ display: showQRCode ? 'block' : 'none' }} onClick={this.showQRCode} ></div>
        <Modal>
          <div style={{ display: showQRCode ? 'block' : 'none' }} >
            <img className='d-store-qrimg-bg' src={require('assets/img/qrcode-b.png')} />
            <img className='d-store-qrimg' src={qrImg} alt='' />
            <p className='d-store-p'>二维码</p>
            <img className='d-store-cha' onClick={this.showQRCode} src={require('assets/img/chawhite.png')}/>
          </div>
        </Modal>

      </DetailStoreStyle>
    )
  }

  /**
   * 使用indexof方法实现模糊查询
   * @param  {Array}  list     进行查询的数组
   * @param  {String} keyWord  查询的关键词
   * @return {Array}           查询的结果
   */
  fuzzyQuery = (list, keyWord) => {
    var arr = [];
    console.log(list.length)
    for (let i = 0; i < list.length; i++) {
      if (list[i].storename.split(keyWord).length > 1) {
        arr.push(list[i])
      }
      if (list[i].address.split(keyWord).length > 1) {
        arr.push(list[i])
      }

    }
    return arr;
  }

  resetState = async () => {
    window.scroll(0, 0)
    if (this.state.searchValue === "") {
      const storeConfig = {
        action: 'getAllStore',
        data: {
          uniacid: store.getState().appConfig.uniacid,
          openid: store.getState().appConfig.wxUserInfo.openid,
          lat: store.getState().appConfig.wxUserInfo.lat,
          lng: store.getState().appConfig.wxUserInfo.lng,
        }
      }
      const result = await _api(storeConfig)
      this.setState({
        data: result.data.data.storelist,
        img: result.data.data.slogo,
      })
    }
  }

  showQRCode = () => {
    this.setState({
      showQRCode: !this.state.showQRCode
    })
  }

  goDaoHan = (e, item) => {
    wx.ready(() => {
      wx.openLocation({
        latitude: parseFloat(item.lat), // 纬度，浮点数，范围为90 ~ -90
        longitude: parseFloat(item.lng), // 经度，浮点数，范围为180 ~ -180。
        name: item.storename, // 位置名
        address: item.address, // 地址详情说明
        scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
        infoUrl: window.location.href.split('#')[0] // 在查看位置界面底部显示的超链接,可点击跳转
      })
    })

  }


  onInputKeyCode = (e) => {
    switch (e.keyCode) {
      case 13:
        let searchRes = this.fuzzyQuery(this.state.storelist, this.state.searchValue)
        this.setState({
          data: searchRes
        }, () => { this.scroll.current.BScroll.refresh() })
        break;
      default:
        break;

    }
  }

  handleChang = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  componentDidMount = () => {
    setTitle('门店信息')
    // 商家头像
    const storeConfig = {
      action: 'getAllStore',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        lat: store.getState().appConfig.wxUserInfo.lat,
        lng: store.getState().appConfig.wxUserInfo.lng,
      }
    }
    const action = 'isFocus'

    axios.all([
      _lives(this.networkConfig.uniacidDetail),
      _api(storeConfig),
      _apiUO(action)
    ]).then(res => {
      this.setState({
        uniacData: res[0].data.data,
        storelist: res[1].data.data.storelist,
        data: res[1].data.data.storelist,
        img: res[1].data.data.slogo,
        qrImg: res[2].data.data.qrcodeImg,
        check: true
      }, () => {
        this.scroll.current.BScroll.refresh()
      })
    })
  }

}

const DetailStoreStyle = styled.div`
.qrcode{
  position:absolute;
  top:4rem;
  left:2rem;
  display:none;
  // background-color:rgba(0,0,0,.5);
  //  height:100vh;
  // width:100vw;
}
.mask{
  z-index:888;
  height:100vh;
  width:100vw;
  color:rgba(0,0,0,.5)
}

.zong{
  width:100vw;
  height:100vh;
  background:white
}
.xinxitop{
  position: relative;
  width:100%;
  height:3.56rem !important;
  text-align:center;
  background:#222637;
}
.xinxitopimg{
  width:1.6rem;
  height:1.6rem;
  border-radius:50%;
  margin:0.4rem 0;
}
.xinxitopbtn{
  width: 1.84rem;
  height: 0.76rem;
  line-height: 0.76rem;
  background: var(--theme-font-color);
  margin: 0 auto;
  margin-bottom:0.4rem;
  border-radius: 0.4rem;

}
.center1122{
  position: relative;
  padding: 0 0.32rem;
  margin: 0 auto;
  text-align: center;
}
.centerframe1{
  position: relative;
  margin: 0.4rem 0;
}
.centerframe1ipt{
  width:9.48rem;
  height:0.8rem;
  // box-shadow: #ccc 0 0 3px;
  padding: 0 .4rem;
  border-radius: .5rem;
  border: 1px solid rgba(0,0,0,.1);
}
.centerframe1img{
  width: 0.48rem;
  height: 0.48rem;
  position: absolute;
  right: 0.2rem;
  bottom: 0.15rem;
}
.centerframe2 {
  width:100%;
  border-radius: 0.1rem;
  border: 1px solid #CCC;
  box-shadow: 1px 3px 10px #CCC;
  margin-top: 3px;
  margin-bottom: 0.4rem;
}
.centerframe2f1 {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .4rem;
}

.centerframe2f1textf1{
  text-align:left;
}
.centerframe2f1textf2{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.centerframe2f1text1{
  color:#474747;
  font-size:0.4rem;
  font-weight:Bold;
}
.centerframe2f1text2{
  width: 5.8rem;
  color:#474747;
  font-size:0.29rem;
  font-weight:lighter;
}
.centerframe2f1text3{
  color:var(--theme-font-color);
  font-size:0.32rem;
  font-weight:Medium;
}
.centerframe2f1img{
  width:0.53rem;
  height:0.53rem;
  border-radius:50%;
  margin-right:0.25rem;
}
.xiantiao{
  width:100%;
  height:0.01rem;
  background:#CCC;
}

.centerframe2f2{
  display: flex;
  align-items: center;
  height: 3.2rem;
  padding: 0.4rem;
}
.centerframe2f2img{
  width:1.6rem;
  height:1.6rem;
  border-radius:50%;
  margin-right:0.4rem;
}
.centerframe2f2textf{
  width:6.84rem;
  text-align:left;
}
.centerframe2f2text1{
  font-size: .4rem;
  font-weight: 500;
  color:#474747;
  margin-bottom: .4rem;
}
.centerframe2f2text2{
  font-size:0.32rem;
  font-weight:500;
  opacity: 0.5;
  margin-bottom: .4rem;
}
.centerframe2f2f{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.centerframe2f2text3{
  font-size:0.32rem;
  font-weight:500;
  opacity: 0.5;
}
.centerframe2f2text4{
  font-size:0.29rem;
  font-weight:500;
  display: flex;
  align-items: center;
}
.centerframe2f2img2{
  width:0.41rem;
  height:0.41rem;
  border-radius:50%;
  margin-right:0.15rem;
}
`
export default DetailStore;