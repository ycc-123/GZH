import React, { Component } from 'react'
import styled from "styled-components"
import { dropByCacheKey } from 'react-router-cache-route'

import BetterScroll from 'common/betterScroll/BetterScroll'

import { store } from "store/index"
import { _showAddress, _address } from 'network/profile'
import { saveDefaultAddress } from 'store/actionCreators'
import { _setPVUV } from 'network/api'

import { Toast, Modal } from "antd-mobile"

class MyAddresss extends Component {
  constructor(props) {
    super(props)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.state = {
      addressList: [],
      isDefaultKey: 0,
      item: '',
      height: 'calc((100vh - 0px))',
      bottom: 'calc((.5rem) + env(safe-area-inset-bottom))'
    }

    this.networkConfig = {
      deleteAddress: {
        action: 'delAddress',
        data: {
          id: []
        }
      }
    }

    this.addAddress = this.addAddress.bind(this)
  }

  addressEdit(id, e) {
    this.props.history.push('/address/' + id)
  }

  addAddress() {
    this.props.history.push('/address/008')
  }

  async deleteAddress(id, key, e) {

    const deleteConfig = {
      action: 'delAddress',
      data: {
        id: [id]
      }
    }
    let deleteRes = await _address(deleteConfig)
    if (deleteRes.data.status === 200) {
      let newList = this.state.addressList
      newList.splice(key, 1)
      this.setState({
        addressList: newList
      }, () => {
        const { addressList } = this.state
        if (addressList.length === 0) {
          const action = saveDefaultAddress({})
          store.dispatch(action)
        }
      })

    }
  }

  async componentDidMount() {
    _setPVUV()
    const showAddressConfig = {
      action: 'addressList',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        // type:0
      }
    }

    let showAddress = await _showAddress(showAddressConfig)
    let key = ''

    let storeAddress = store.getState().defaultAddress
    for (let i = 0; i < showAddress.data.data.length; i++) {
      if (showAddress.data.data[i].id === storeAddress.id) {
        key = i
      }
    }

    if (showAddress.data.status === 200) {
      this.setState({
        addressList: showAddress.data.data,
        isDefaultKey: key
      }, () => {
        this.refs.scroll.BScroll.refresh()
      })
    }

    dropByCacheKey('AddressComponent')
  }

  componentDidRecover = async () => {
    _setPVUV()
    dropByCacheKey('AddressComponent')
    const showAddressConfig = {
      action: 'addressList',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        // type:0
      }
    }

    let showAddress = await _showAddress(showAddressConfig)
    let key = ''

    let storeAddress = store.getState().defaultAddress
    for (let i = 0; i < showAddress.data.data.length; i++) {
      if (showAddress.data.data[i].id === storeAddress.id) {
        key = i
      }
    }

    if (showAddress.data.status === 200) {
      this.setState({
        addressList: showAddress.data.data,
        isDefaultKey: key
      }, () => {
        this.refs.scroll.BScroll.refresh()
      })
    }
  }

  async moren(key, id) {

    let setAddress = this.state.addressList.find((item, key) => {
      return item.id === id
    })

    if (setAddress.id === id) {

      const updateAddressConfig = {
        action: 'addressFix',
        data: {
          uniacid: store.getState().appConfig.uniacid,
          openid: store.getState().appConfig.wxUserInfo.openid,
          id: setAddress.id,
          myname: setAddress.cname,
          myphone: setAddress.tel,
          province: setAddress.province,
          city: setAddress.city,
          county: setAddress.county,
          detailed: setAddress.detailed_address,
          type: setAddress.type,
          status: 1,
        }
      }
      let Res = await _address(updateAddressConfig).catch(res => '')
      if (Res.data.status === 200) {

        Toast.success('设置成功', 1)

        const showAddressConfig = {
          action: 'addressList',
          data: {
            uniacid: store.getState().appConfig.uniacid,
            openid: store.getState().appConfig.wxUserInfo.openid,
            // type:0
          }
        }

        let showAddress = await _showAddress(showAddressConfig)
        if (showAddress.data.status === 200) {
          this.setState({
            addressList: showAddress.data.data
          }, () => {
            this.refs.scroll.BScroll.refresh()
          })
        }
      }

    } else {

    }
  }

  render() {
    const alert = Modal.alert
    const { icons } = store.getState().mallConfig
    const { height, bottom } = this.state

    const scrollStyle = {
      height: 'calc((100vh - 3.5rem) - env(safe-area-inset-bottom))'
    }

    const scrollConfig = {
      probeType: 1
    }

    

    return (
      <div className='receivingadd' style={{ height }}>
        <ReceivingaddItemStyle>
          <ul className='header'>
            <li
              style={{ paddingLeft: '.65rem' }}>
              <span onClick={() => { this.props.history.goBack() }} style={{ display: 'inline-block', width: '.2rem', height: '.2rem', borderTop: '1px solid var(--font-color)', borderRight: '1px solid var(--font-color)', transform: 'rotate(-135deg)' }}></span>
              <span onClick={() => { this.props.history.goBack() }} style={{ marginLeft: '.1rem', fontSize: '.32rem' }}>返回</span>
            </li>
            <li style={{ textAlign: 'center' }}>地址列表</li>
            <li
              style={{ paddingRight: '.65rem', textAlign: 'right', fontSize: '.32rem' }}
              onClick={() =>
                alert('删除', '确认全部删除', [
                  { text: '取消', onPress: () => console.log('cancel') },
                  { text: '确认', onPress: () => { this.allDelete() } },
                ])
              }>全部删除</li>
          </ul>
          <div className='qwe'></div>

          <BetterScroll style={scrollStyle} config={scrollConfig} ref="scroll">

            {
              this.state.addressList.map((item, key) => {
                return (
                  <div className="yemianbeijing" key={item.id + key}
                  // onClick={this.selectedDefault.bind(this,key)}
                  >
                    <div className="shdzframe" onClick={this.selectedDefault.bind(this, key)}>
                      <div className="shdzshangk">
                        <div className="shdzskframe">
                          <div className="shdzwzk1 shdzwzkz">
                            <div className="shdzwzk1text1">{item.cname}</div>
                            <div className="shdzwzk1text2">{item.tel}</div>
                          </div>
                          <div className="shdzwzk2 shdzwzkz">
                            <div className="shdzwzk2text">{item.province}</div>
                            <div className="shdzwzk2text">{item.city}</div>
                            <div className="shdzwzk2text">{item.county}</div>
                          </div>
                          <div className="shdzwzk3">{item.detailed_address}</div>
                        </div>
                        <div className='shdzskimg_right'>
                          <div className='gongs'>{item.type === '1' ? '公司' : '家庭'}</div>
                          {this.state.isDefaultKey === key && <img className="shdzskimg" src='https://res.lexiangpingou.cn/images/vip/addressgou.png'
                            alt="" />}

                        </div>
                      </div>

                    </div>
                    <div className="shdzxiantiao"></div>
                    <div className="shdzframe2">
                      <div className="shdzframe2k1">
                        <img className="shdzframe2k1img" onClick={this.moren.bind(this, item, item.id)} src={item.status === "1" ? icons.select : 'https://res.lexiangpingou.cn/images/vip/address1.png'}
                          alt="" />
                        <div className="shdzframe2k1">设为默认地址</div>
                      </div>
                      <div className="shdzframe2k2">
                        <button className="shdzframe2k2btn"
                          onClick={this.addressEdit.bind(this, item.id)}>编辑
                                            </button>
                        <button className="shdzframe2k2btn"
                          onClick={this.deleteAddress.bind(this, item.id, key)}>删除
                                            </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </BetterScroll>

          <div className="shdzbtn" style={{ bottom }} onClick={this.addAddress}>
            <img className="shdzbtnimg" src='https://res.lexiangpingou.cn/images/vip/addressbtn.png' alt="" />
            <div className="shdzbtntext">添加收货地址</div>
          </div>
        </ReceivingaddItemStyle>

      </div>
    )
  }


  allDelete = async () => {


    let temp = this.state.addressList.length;
    let data = this.state.addressList
    console.log(this.state.addressList)
    let deleteArray = []

    for (let i = 0; i < temp; i++) {
      console.log(data[i].id)
      deleteArray.push(data[i].id)
    }

    this.networkConfig.deleteAddress.data.id = deleteArray
    let Res = await _address(this.networkConfig.deleteAddress)
    if (Res.data.status === 200) {
      Toast.success(Res.data.msg, 2)
      this.setState({
        addressList: []
      })
    } else {
      Toast.fail(Res.data.msg, 2)
    }
  }

  selectedDefault(key, e) {
    console.log(key)
    this.setState({
      isDefaultKey: key
    }, () => {
      let defaultAddress = this.state.addressList[key]
      const action = saveDefaultAddress(defaultAddress)
      store.dispatch(action)

      if (this.props.match.params.type === 'editAddress') {
        let url = JSON.parse(localStorage.getItem('goBackSubmitUrl'))
        window.location.href = url
      }

      if (this.props.match.params.type === 'submit') {
        this.props.history.goBack()
      }
    })
  }

}

// 我的地址页面
const ReceivingaddItemStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);


.header div{
  margin-right:.5rem;
  font-size: .32rem;
  color: var(--font-color);
}
.header img{
  margin-top:.15rem;
  margin-left:.5rem;
  object-fit: cover;
  height: .35rem;
}
.header{
  display:flex;
  align-items: center;
  justify-content: space-between;
  height: 1.09rem;
  color: var(--font-color);
  font-size:.4rem;
  border-bottom: 1px solid #fff;
}

.header li {
  flex: 1;
}

.xian{
  height:1px;
  width:100%;
  background: white;
  margin-top:.3rem;
}

.yemianbeijing{
  width: 95%;
  background: white;
  height: 3.4rem;
  margin: 0 auto;
  margin-bottom: 0.4rem;
  border-radius: 0.15rem;
}
.shdzframe{
  padding: 0 .32rem;
}
.shdzxiantiao{
  margin-top:.1rem;
  border-top:0.01rem solid #CCC;
  width:100%;
  background:#e6e6e6;
}
.gongs{
  border: 1px solid var(--theme-font-color);
  width:1.3rem;
  text-align:center;
  border-radius: 0.5rem;
  color: var(--theme-font-color);
  margin-right:.4rem;
}
.shdzskimg{
  width:0.4rem;
  height:0.4rem;
  // background:black;
}
.shdzshangk{
  display: flex;
  justify-content: space-between;
  align-items:center;
  height:2rem;
}
.shdzwzkz{
  display:flex;
}
.shdzwzk1{
  align-items: baseline;
}
.shdzwzk1text1{
  color:#474747;
  font-size:.4rem;
  font-weight:600;
}
.shdzwzk2 shdzwzkz{
  margin-top:.05rem;
}
.shdzwzk3{
  margin-top:.08rem;
  color:#595959;
  font-size:0.29rem;
}
.shdzwzk1text2{
  margin-left:.4rem;
  font-size:.32rem;
  font-weight:600;
  color:#797979;
  text-align:center;
}
.shdzwzk2{
  font-size:.32rem;
  font-weight:600;
}
.shdzwzk2text{
  margin-top:.08rem;
  color:#474747;
  margin-right:.14rem;
}

.shdzframe2{
  display:flex;
  justify-content: space-between;
  height:1.2rem;
  align-items:center;
  padding: 0 .32rem;
}
.shdzframe2k1{
  font-size:.32rem;
  display:flex;
}
.shdzframe2k1img{
  width:0.4rem;
  height:0.4rem;
  margin-right: 0.27rem;
}
.shdzframe2k1{
  color:#CCC;
}
.shdzframe2k2{
  display:flex;
}
.shdzframe2k2btn{
  width:1.53rem;
  height:0.56rem;
  line-height:0.53rem;
  font-size:.32rem;
  text-align:center;
  color:white;
  border-radius:0.3rem;
  background: var(--theme-font-color);
  margin-left:0.4rem;
}
.shdzbtn{
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: .32rem;
  width: calc(100vw - .64rem);
  height:1.2rem;
  border-radius:0.15rem;
  background-color: var(--theme-font-color);
}
.shdzbtnimg{
  width:0.4rem;
  height:0.4rem;
  background:white;
  margin-right:0.4rem;
}
.shdzbtntext{
  color:white;
  font-size:0.4rem;
}
.shdzskimg_right{
  display:flex;
  justify-content: space-between;
}
.qwe{
  width:.1rem;
  height:.2rem;
}
`



export default MyAddresss