import React, { Component } from 'react'
import styled from 'styled-components'
import { _plurApply, _applyMemberShip, _address, _MemberInfo } from 'network/profile'
import { store } from 'store'
import { Picker } from 'antd-mobile'
import { Toast } from "antd-mobile";

import { vaPhone } from 'commons/phone_utils'
import { inputResolve } from 'commons/utils'

function CustomChildren(props) {
    // this.props.parent.aaa(props.extra)
    // const CustomChildren = props => 
    // console.log(props.extra)
    console.log(props)
    return (
        // console.log()

        <div
            // onClick={props => console.log(props)}     props.extra
            // onChange={console.log(props.extra)}
            onClick={props.onClick}
            style={{ backgroundColor: 'transparent', width: '5.8rem' }}
        >
            <div className="test" style={{ fontSize: '.32rem', display: 'flex', height: '1.17rem', lineHeight: '1.17rem', position: 'relative', borderBottom: 0 }}>
                <div style={{ position: 'absolute', right: '0', fontSize: '.32rem', textAlign: 'right', color: '#a9abae', }}>{props.extra}</div>
            </div>
        </div>
    );
}

export default class Applyjob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeid: '',
            pickerValue: [],
            cid: [],
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
            addressType: '',
            storeAll: [],
            shengId: '',
            shiId: '',
            xianId: '',
            call: '',
            storename: '',
            type: '',
            local: []

        }

        this.inputChangename = this.inputChangename.bind(this)
        this.inputChangecall = this.inputChangecall.bind(this)
        this.applyjob = this.applyjob.bind(this);
    }
    inputChangename(e) {
        let name = e.target.name
        let value = e.target.value
        this.setState({
            [name]: value
        })
    }

    inputChangecall(e) {
        let name = e.target.name
        let value = e.target.value
        this.setState({
            [name]: value
        })
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

    applyjob() {
        const { storeAll, storename, call, local, name } = this.state
        // let shopname = storeAll.find(item => item.value === storename[0])
        let shopname = document.querySelector('.input123').value
        let phone = vaPhone(call)
        if (!shopname) {
            Toast.fail('请输入店铺名', 1)
        } else if (local.length !== 3) {
            console.log(local)
            Toast.fail('请选择正确所在地区', 1)
        } else if (!name) {
            Toast.fail('请输入姓名', 1)
        } else if (!phone) {
            Toast.fail('手机号码格式不正确', 1)
        } else {
            const plurApplyConfig = {
                action: 'plurApply',
                data: {
                    id: store.getState().memberUserInfo.id,
                    name,
                    shopname: shopname,
                    mobile: call,
                    sid: local[0],
                    cid: local[1],
                    did: local[2],
                }
            }

            _plurApply(plurApplyConfig).then(res => {

                if (res.data.status === 200) {
                    Toast.info('申请成功请等待后台审核', 1)
                    this.timer = setTimeout(() => {
                        this.props.history.replace('/profile')
                    }, 1100)

                } else if (res.data.status === 400) {
                    Toast.info(res.data.msg)
                }
            })
        }



    }

    componentWillUnmount = () => {
        clearTimeout(this.timer)
    }


    componentDidMount() {
        const AllStore = {
            action: 'getstoreAll',
            data: {
                uniacid: store.getState().appConfig.uniacid
            }
        }
        _applyMemberShip(AllStore).then((res) => {
            let storeAll = res.data.data.map(item => {
                return {
                    label: item.storename,
                    value: item.id,
                    address: item.address
                }
            })
            this.setState({
                storeAll
            })
        })




        // 获取店铺名
        // const getAllStore = {
        //     action: 'getstoreAll',
        //     data: {
        //         uniacid: store.getState().appConfig.uniacid
        //     }
        // }
        // _applyMemberShip(getAllStore).then((res) => {
        //     this.setState({
        //         storeAll: res.data.data
        //     })
        // })
    }

    // 店铺ID
    selectedStore() {

    }

    select = value => {
        /* console.log(value)
        const { storeAll } = this.state
        let item = storeAll.find(item => item.value === value[0])
        console.log(item)
        if (item) {
            this.setState({ storename: value })
        } */
        this.setState({
            storename: value
        })

    }

    xuang(e) {
        console.log(e)
        this.setState({
            local: e
        })
    }

    onInputBlur = () => {
        let flag = inputResolve()
        if (flag) {
            window.scroll(0, 0)
        }
    }

    render() {
        const scrollStyle = {
            height: 'calc(100vh -.5rem)',
            padding: '.4rem .32rem',
        }
        let antdDistrict = [];
        let districtData = require('./location');
        Object.keys(districtData).forEach((index) => {
            let itemLevel1 = {};
            let itemLevel2 = {};
            itemLevel1.value = districtData[index].code;
            itemLevel1.label = districtData[index].name;
            itemLevel1.children = [];
            let data = districtData[index].cities;
            Object.keys(data).forEach((index) => {
                itemLevel2.value = data[index].code;
                itemLevel2.label = data[index].name;
                itemLevel2.children = [];
                let data2 = data[index].districts;
                let itemLevel3 = {};
                itemLevel3.children = [];
                Object.keys(data2).forEach((index) => {
                    itemLevel3.value = index;
                    itemLevel3.label = data2[index];
                    itemLevel2.children.push(itemLevel3);
                    itemLevel3 = {};
                });
                itemLevel1.children.push(itemLevel2);
                itemLevel2 = {};
            });
            antdDistrict.push(itemLevel1)
        });
        return (
            <ApplyjobStyle>
                <div style={scrollStyle}>

                    <div className='header'>
                        <ul className='header-1'>
                            <li className='ship_name'>
                                <div>店铺名称</div>
                                <div><input type="text" name="name" onBlur={this.onInputBlur} className='input123' placeholder='请设置店铺名称' /></div>
                            </li>

                            <li className='ship_local'>
                                <div>所在地区</div>
                                <div>
                                    <Picker
                                        title="请选择"
                                        extra={"请选择"
                                        }
                                        data={antdDistrict}
                                        value={this.state.pickerValue}
                                        onChange={v => { this.setState({ pickerValue: v }) }}
                                        onOk={(e) => (this.xuang(e))}
                                    >
                                        <CustomChildren
                                            parent={this}
                                            style={{ color: 'red' }}
                                        ></CustomChildren>
                                    </Picker>
                                </div>
                            </li>
                        </ul>
                        <ul className='header-2'>
                            <li className='ship_name'>
                                <div>姓名</div>
                                <div><input type="text" name="name" onBlur={this.onInputBlur} onChange={this.inputChangename} placeholder='请输入兼职人姓名' /></div>
                            </li>
                            <li className='ship_local'>
                                <div>手机号</div>
                                <div><input className='call' onBlur={this.onInputBlur} type="tel" name="call" maxLength='11' minLength='11' onChange={this.inputChangecall} placeholder='请输入兼职人手机号' /></div>
                            </li>
                        </ul>
                    </div>
                    <div className='btn' onClick={this.applyjob}>
                        <button >申请兼职</button>
                    </div>
                </div>
            </ApplyjobStyle>
        )
    }
}
const ApplyjobStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);

.header-1 {
    height: 2.37rem;
    background-color: #fff;
    border-radius: .13rem;
}

.header-2 {
    margin-top: .16rem;
    height: 2.37rem;
    background-color: #fff;
    border-radius: .13rem;
}

.xian{
    width: 100%;
    background-color:#dadada;
    position:absolute;
    top:3.2rem;
    height:1px;
}
input::-webkit-input-placeholder{
    color:#b2b2b2;
    font-size:.33rem;
}
.sheng{
    border:none;
    font-size:0.32rem;
    color:#b2b2b2;
}

.am-list-line {
    height: calc(1.6rem - 1px);
    padding-right: 0;
    justify-content: flex-end;
}
.am-list-item {
    padding-left: 0;
}


/* .am-list-item .am-list-line .am-list-extra{
  position: absolute;
  right: .4rem;
  color:#a9a9a9;
  font-size:0.32rem;
  text-align: right;
  width: 7rem !important;
} */

.am-list-item .am-list-line .am-list-arrow-horizontal {
    visibility: hidden;
}

.am-list-item .am-list-line .am-list-extra {
    position: relative;
    left: 8px;
    font-size: .32rem;
    flex-basis: 100%;
}

.am-list-item .am-list-line .am-list-arrow {
    width: 0;
    height: 0;
} 

.option{
    width: 2rem;
    border:none;
    font-size:0.32rem;
    color:#b2b2b2;
}


.ship_name input{
    width: 6rem;
    color:#b2b2b2;
    font-size:.33rem;
    text-align: right;
}
.ship_local input{
    width:7.8rem;
    color:#b2b2b2;
    font-size:.33rem;
    text-align: right;
}

input::-webkit-input-placeholder {
    text-align:right;
    font-size:.3rem;
}
.ship_local input{
    border:none;
    height:.8rem;
}
.ship_name input{
    border:none;
    height:.8rem;
}
.ship_local{
    padding-left:.2rem;
    padding-right: .2rem;
    color:#474747;
    font-size:.33rem;
    height:1.17rem;
    line-height:1.17rem;
}
.ship_name{
    padding-left:.2rem;
    padding-right:.2rem;
    color:#474747;
    font-size:.32rem;
    height:1.17rem;
    line-height:1.17rem;
    border-bottom: 1px solid #dadada;
}
.conter li{
    display:flex;
    justify-content: space-between;
}
.header ul li{
    display:flex;
    justify-content: space-between;
}

.btn button{
    color:#fff;
    background-color: var(--theme-font-color);
    width:9.3rem;
    margin-right:2rem;
    height:1rem;
    position:absolute;
    border-radius: .2rem;
    bottom: calc((.5rem) + env(safe-area-inset-bottom));
}

`