import React, { Component } from 'react'
import styled from 'styled-components'
import { _address } from 'network/profile'
import { _showAddress } from 'network/profile'
import { Toast, Switch } from "antd-mobile"


import { store } from 'store'
import { saveLocationInfo } from 'store/actionCreators'

import { _setPVUV } from 'network/api'


import 'antd-mobile/dist/antd-mobile.css'
import CustomChildren from './childCom/CustomChildren'

import { Picker } from 'antd-mobile'

var clearTime

class Address extends Component {
    constructor(props) {
        super(props)
        props.cacheLifecycles.didRecover(this.componentDidRecover)
        this.state = {
            countycide: '',
            cityType: '2',
            areaType: '3',
            notType: '4',
            name: '',
            phone: '',
            defaultStatus: '',
            detailAddress: '',
            provinceName: '',
            cityName: '',
            areaName: '',
            province: [],
            city: [],
            area: [],
            familyType: '2',
            companyType: '1',
            addresType: '',
            moss: '',
            citybj: '',
            provincebj: '',
            countybj: '',
            statusbj: '',
            profilename: '',
            profile: '',
            pickerValue: [],
            locationInfo: '',
            checked: false
        }
        this.inputChange = this.inputChange.bind(this)
        this.getCity = this.getCity.bind(this)
        this.updateAddress = this.updateAddress.bind(this)
        this.getCitys = this.getCitys.bind(this)
        this.getProvince = this.getProvince.bind(this)
        this.getCounty = this.getCounty.bind(this)
    }

    async componentDidMount() {
        let editId = this.props.match.params.id
        if (editId && editId !== '008') {
            this.setState({
                updateID: editId
            }, () => { console.log(this.state.updateID) })
            const editConfig = {
                action: 'addressList',
                data: {
                    uniacid: store.getState().appConfig.uniacid,
                    openid: store.getState().appConfig.wxUserInfo.openid,
                    id: editId
                }
            }
            let editInfo = await _showAddress(editConfig)
            console.log(editInfo)

            let info = editInfo.data.data
            if (editInfo.data.status === 200) {
                let provincebj = editInfo.data.data.province
                let countybj = editInfo.data.data.county
                let citybj = editInfo.data.data.city
                let statusbj = editInfo.data.data.status

                if (editInfo.data.data.latitude) {
                    const location = {
                        location: {
                            lat: editInfo.data.data.latitude,
                            lng: editInfo.data.data.longitude,
                        }
                    }
                    store.dispatch(saveLocationInfo(location))
                }
                this.setState({
                    statusbj,
                    provincebj,
                    countybj,
                    citybj,
                    name: info.cname,
                    addresType: info.ctype,
                    detailAddress: info.detailed_address,
                    phone: info.tel,
                    moss: info.status,
                    defaultStatus: info.status,
                    provinceName: info.province,
                    cityName: info.city,
                    areaName: info.county,
                    checked: info.status === '1' ? true : false
                })
            }
        }
        const addressConfig = {
            action: 'area',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                areaTypes: '1'
            }
        }
        let addRes = await _address(addressConfig)
        let profile = addRes.data.data
        let arr = []
        let aa = []
        profile.map((item) => {
            // console.log(item)
            arr.push(item.id);
            aa.push(item.areaname);
        })
        // console.log(aa)
        this.setState({
            profile: arr,
            profilename: aa
        })

        _setPVUV()


    }

    onInputBlur = (e) => {
        window.scroll(0, 0)
    }

    inputChange(e) {
        let name = e.target.name
        let value = e.target.value
        this.setState({
            [name]: value
        })

    }

    componentWillUnmount() {
        clearTimeout(clearTime)
    }

    async updateAddress() {
        const { updateID, name, phone, detailAddress, addresType, moss, provinceName, cityName, county, checked } = this.state
        const { locationInfo } = store.getState()
        const { appConfig } = store.getState()
        // console.log(area[0], area[1], area[2])
        let countyCide = window.localStorage.getItem('1')
        // console.log(String(countyCide))
        // let area = countyCide.split(',')
        // console.log(pp)
        // console.log(pp[0])
        const updateAddressConfig = {
            action: 'addressFix',
            data: {
                uniacid: appConfig.uniacid,
                openid: appConfig.wxUserInfo.openid,
                id: updateID ? updateID : '',
                myname: name,
                myphone: phone,
                // province: provinceName,
                // city: cityName,
                // county: areaName,
                detailed: detailAddress,
                type: addresType,
                status: checked ? '1' : '0',
                province: provinceName,
                city: cityName,
                county,
                latitude: locationInfo.location ? locationInfo.location.lat : '',
                longitude: locationInfo.location ? locationInfo.location.lng : ''
            }
        }
        let updateRes = await _address(updateAddressConfig)
        console.log(updateRes)
        if (updateRes.data.status === 200) {
            clearTime = setTimeout(() => {
                this.props.history.push('/myaddress/editAddress')
            }, 2000)
            Toast.success(updateRes.data.msg, 2)
        } else {
            Toast.fail(updateRes.data.msg, 1)
        }
    }

    addresType(e) {
        let selected = document.getElementById('addresType')
        let addresType = selected.options[selected.selectedIndex].value;
        this.setState({
            addresType
        })

    }

    moss(e) {
        let selected = document.getElementById('moss')
        let moss = selected.options[selected.selectedIndex].value;
        this.setState({
            moss
        })
    }

    aaa = (result) => {
        console.log(result)
        if (result === ",,") {
            let result = "请选择"
            localStorage.setItem("3", result);
        } else {
            localStorage.setItem("1", result);
        }
    }

    render() {

        document.title = "编辑地址";
        const { provinceName, checked } = this.state
        return (
            <AddressStyle>
                <div className='xinz'>
                    <div className='xinz-header' onClick={() => this.goLocation()}>
                        <span>{provinceName ? '修改地址' : '请选择地址'}</span>
                    </div>
                    <div className='dsa'>
                        <span className='ming'>姓&emsp;&emsp;名</span>
                        <span><input type="text" onChange={this.inputChange} name="name" value={this.state.name}
                            placeholder="请输入真实姓名" /></span>
                    </div>

                    <div className='dsa'>
                        <span className='ming'>手机号码</span>
                        <span><input type="text" maxLength="11" minLength="11" onChange={this.inputChange} name="phone"
                            value={this.state.phone} placeholder="请输入手机号码" /></span>
                    </div>
                    <div className='dsa'>
                        <span className='ming'>地&emsp;&emsp;区</span>
                        <div style={{ fontSize: '.32rem', color: '#a9abae' }}>{this.state.provinceName !== '' ?
                            `${this.state.provinceName}-${this.state.cityName}${this.state.county ? '-' + this.state.county : ""}` : '请先选择地址'}</div>
                    </div>
                    <div className='dsa'>
                        <span className='ming'>详细地址</span>
                        <span><input type="text" onChange={this.inputChange} name="detailAddress"
                            value={this.state.detailAddress} placeholder="请输入详细地址" /></span>
                    </div>
                    <div className='dsa'>
                        <span className='ming'>选择类型</span>
                        <span>
                            <select onBlur={this.onInputBlur} className='xuan' id="addresType" onChange={this.addresType.bind(this)}>
                                <option value="0">请选择</option>
                                <option value="2">家庭</option>
                                <option value="1">公司</option>
                            </select>

                        </span>
                    </div>
                    <div className='dsa' style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.1rem', borderBottom: 'none', }}>
                        <span className='ming'>设为默认地址</span>
                        <span className="toggle-button-wrapper">
                            <Switch
                                checked={checked}
                                onChange={() => this.setState({ checked: !checked })}
                                color='var(--theme-font-color)'
                            >

                            </Switch>
                        </span>
                    </div>


                    <p className='qq'>
                        <button className='btn1' onClick={this.updateAddress}>保存</button>
                    </p>
                </div>
            </AddressStyle>
        )
    }

    goLocation() {
        this.props.history.push('/location')
    }

    async getProvince(e) {
        let selected = document.getElementById('selectedProvince')
        let id = selected.options[selected.selectedIndex].value;
        let areaname = selected.options[selected.selectedIndex].innerHTML;

        const addressConfig = {
            action: 'area',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                areaTypes: 2,
                id,
            }
        }
        let addRes = await _address(addressConfig)

        this.setState({
            city: addRes.data.data,
            provinceName: areaname,
        })

    }

    async getCitys(e) {
        let selected = document.getElementById('selectedCity')
        let id = selected.options[selected.selectedIndex].value;
        let areaname = selected.options[selected.selectedIndex].innerHTML;
        const addressConfig = {
            action: 'area',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                areaTypes: 3,
                id,
            }
        }
        let addRes = await _address(addressConfig)

        this.setState({
            area: addRes.data.data,
            cityName: areaname,
        })

    }

    getCounty(e) {
        let selected = document.getElementById('selectedCounty')
        // let id = selected.options[selected.selectedIndex].value;
        let areaname = selected.options[selected.selectedIndex].innerHTML;
        this.setState({
            areaName: areaname,
        })
    }


    async getCity(id, types, event) {
        if (types === '4') {
            this.setState({ areaName: id.areaname })
            return
        }
        // bind 传参相反
        const addressConfig = {
            action: 'area',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                areaTypes: types,
                id: id.id,
            }
        }
        let addRes = await _address(addressConfig)
        if (types === '2') {
            this.setState({
                city: addRes.data.data,
                provinceName: id.areaname,
            })
        } else if (types === '3') {
            this.setState({
                area: addRes.data.data,
                cityName: id.areaname
            })
        }
    }

    componentDidRecover = () => {
        _setPVUV()
        const { locationInfo } = store.getState()
        if (locationInfo.province) {
            console.log(123)
            this.setState({
                provinceName: locationInfo.province,
                cityName: locationInfo.city,
                county: locationInfo.district,
                detailAddress: locationInfo.address + locationInfo.name,
                locationInfo
            }, () => {
                console.log(this.state)
            })
        }

    }

    componentWillUnmount() {
        store.dispatch(saveLocationInfo({}))
    }



}
const AddressStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);

.xinz-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  top: .2rem;
  left: .32rem;
  width: 9.36rem;
  height: 2rem;
  font-size: .5rem;
  color: var(--theme-font-color);
  margin-bottom: .4rem;
  border: 1px solid var(--theme-font-color);
  border-radius: .13rem;
}

.xinz-header span:first-child::after {
    content: '';
    position: absolute;
    margin-left: .1rem;
    top: 50%;
    transform: translate(0, -50%) rotate(45deg);
    display: inline-block;
    width: .2rem;
    height: .2rem;
    border-top: 1px solid var(--theme-font-color);
    border-right: 1px solid var(--theme-font-color);
    
}


.local{
    color:#fff;
    font-size: .4rem;
}
.dsa {
    display: flex;
    align-items: center;
    height: 1.16rem;
    border-bottom: 1px solid #4d525d;
    margin: 0 .32rem;
}

select{
    -webkit-appearance: none;  
    /*清除select默认样式*/
    background: url("img/order_img/drop-down.png")no-repeat right;
    /*注：上一步清除样式后，select中的三角符号也会被清除，所以需要自己添加下三角，我在此出用一个下三角背景图片填充*/
    background-size: 0.3rem;
    background-position-x: 96%;
}
// 开关
         #toggle-button{ display: none; }
        .button-label{
            position: relative;
            display: inline-block;
            width: 80px;
            height: 30px;
            background-color: #ccc;
            box-shadow: #ccc 0px 0px 0px 2px;
            border-radius: 30px;
            overflow: hidden;
        }
        .circle{
            position: absolute;
            top: 0;
            left: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #fff;
        }
        /* .button-label .text {
            line-height: 30px;
            font-size: 18px;
            text-shadow: 0 0 2px #ddd;
        } */

        .on { color: #fff; display: none; text-indent: 10px;}
        .off { color: #fff; display: inline-block; text-indent: 34px;}
        .button-label .circle{
            left: 0;
            transition: all 0.3s;
        }
        #toggle-button:checked + label.button-label .circle{
            left: 50px;
        }
        #toggle-button:checked + label.button-label .on{ display: inline-block; }
        #toggle-button:checked + label.button-label .off{ display: none; }
        #toggle-button:checked + label.button-label{
            background-color: #51ccee;
        }


.xinz span>input {
    float: right;
    font-size: .32rem;
    width: 7.22rem;
    height: 1.11rem;
    background-color: var(--bg-color);
    border: none;
    color:#a9abae;
}

.ming {
    font-size: .4rem;
    height: 1.18rem;
    line-height: 1.18rem;
    background-color: var(--bg-color);
    color: var(--font-color);
    padding-right: .4rem;
}
.xua{
    float: right;
    font-size:.32rem;
    width: 6.5rem;
    border: none;
    color:#a9abae;
    height: 1.17rem;
}
.xuan{
    float: right; 
    font-size: .32rem;
    width: 7.22rem;
    border: none;
    color:#a9abae;
    height: 1.17rem;
}
.select select{
    width:2.6rem;
    background-color: #212735;
    border-top:none;
    border-left:none;
    border-right:none;
    border-bottom:1px solid #4d525d;
    color:#a9abae;
}




.qq{
    display:flex;
    align-items:center;
    justify-content: center;
  }
  
  .btn1{
    position: fixed;
    bottom: 1rem; 
    height: 1rem;
    width:9rem;
    background-color: var(--theme-font-color);
    border-radius: .2rem;
    color:#fff;
  }

`

export default Address