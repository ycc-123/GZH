import React, { Fragment, PureComponent } from 'react'
import styled from 'styled-components'
import BetterScroll from 'common/betterScroll/BetterScroll'
// import { getQueryString } from 'commons/AuthFunction'
import { store } from 'store'
import { _mycashorder } from 'network/profile'
import { DatePicker, List } from "antd-mobile"

function Group(item, time) {
    let value = item.item
    let times = item.time
    // console.log(times)
    return (
        <div className='CommissionContainer'>
            <div className='CommissionContainer_order'>
                <div>
                    <span >订单号:</span>
                    <span>{value.orderno}</span>
                </div>
                <div>
                    <span className='CommissionContainer_time'>{times}</span>
                </div>
            </div>
            {Array.isArray(value.goods) && <div className='commission-container'>
                {value.goods.map((item, index) => {
                    return (
                        <Fragment key={item.id}>
                            <div style={{ width: '100%', height: '2.09rem', marginBottom: '.2rem' }}>
                                <div style={{ width: '2.09rem', height: '2.09rem', float: 'left' }}>
                                    <img src={item.gimg} alt="" />
                                </div>

                                <div style={{ width: '6.36rem', float: 'left', height: '2.09rem', position: 'relative', marginLeft: '.1rem' }}>
                                    <p className='title'>{item.goodsname}</p>
                                    <p className='guige'><span>商品金额</span><span className='count'>￥{item.oprice}</span></p>
                                    <p className='danj'><span>单件提成</span><span className='count'>￥{Number(item.commission).toFixed(2)}</span></p>
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
                <p className='shifu'>可提现金额￥{value.goods.reduce((oldValue, item) => {
                    return Number(item.num) * Number(item.commission) + oldValue
                }, 0).toFixed(2)}</p>

            </div>}
            {!Array.isArray(value.goods) && <div className='commission-container'>
                <div style={{ width: '100%', height: '2.09rem', marginBottom: '.2rem' }}>
                    <div style={{ width: '2.09rem', height: '2.09rem', float: 'left' }}>
                        <img src={value.gimg} alt="" />
                    </div>

                    <div style={{ width: '6.36rem', float: 'left', height: '2.09rem', position: 'relative', marginLeft: '.1rem' }}>
                        <p className='title'>{value.goodsname}</p>
                        <p className='guige'><span>商品金额</span><span className='count'>￥{value.oprice}</span></p>
                        <p className='danj'><span>单件提成</span><span className='count'>￥{Number(value.commission).toFixed(2)}</span></p>
                    </div>
                </div>
                <p className='shifu'>可提现金额￥{(Number(value.commission) * Number(value.gnum)).toFixed(2)}</p>
            </div>}

            <div className='CommissionContainer_f'>
                <img src={value.avatar} alt="" style={{ width: '.53rem', height: '.53rem', borderRadius: '50%', marginLeft: '.4rem' }} />
                <span style={{ marginLeft: '.2rem' }}>{value.nickname}</span>
            </div>
        </div>

    )
}

function WeiGroup(item, time) {
    let value = item.item
    let times = item.time
    // console.log(times)
    return (
        <div className='CommissionContainer'>
            <div className='CommissionContainer_order'>
                <div>
                    <span >订单号:</span>
                    <span>{value.orderno}</span>
                </div>
                <div>
                    <span className='CommissionContainer_time'>{times}</span>
                </div>
            </div>
            {Array.isArray(value.goods) && <div className='commission-container'>
                {value.goods.map((item, index) => {
                    return (
                        <Fragment key={item.id}>
                            <div style={{ width: '100%', height: '2.09rem', marginBottom: '.2rem' }}>
                                <div style={{ width: '2.09rem', height: '2.09rem', float: 'left' }}>
                                    <img src={item.gimg} alt="" />
                                </div>

                                <div style={{ width: '6.36rem', float: 'left', height: '2.09rem', position: 'relative', marginLeft: '.1rem' }}>
                                    <p className='title'>{item.goodsname}</p>
                                    <p className='guige'><span>商品金额</span><span className='count'>￥{item.oprice}</span></p>
                                    <p className='danj'><span>单件提成</span><span className='count'>￥{Number(item.commission).toFixed(2)}</span></p>
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
                <p className='shifu'>可提现金额￥{value.goods.reduce((oldValue, item) => {
                    return Number(item.num) * Number(item.commission) + oldValue
                }, 0).toFixed(2)}</p>

            </div>}
            {!Array.isArray(value.goods) && <div className='commission-container'>
                <div style={{ width: '100%', height: '2.09rem', marginBottom: '.2rem' }}>
                    <div style={{ width: '2.09rem', height: '2.09rem', float: 'left' }}>
                        <img src={value.gimg} alt="" />
                    </div>

                    <div style={{ width: '6.36rem', float: 'left', height: '2.09rem', position: 'relative', marginLeft: '.1rem' }}>
                        <p className='title'>{value.goodsname}</p>
                        <p className='guige'><span>商品金额</span><span className='count'>￥{value.oprice}</span></p>
                        <p className='danj'><span>单件提成</span><span className='count'>￥{Number(value.commission).toFixed(2)}</span></p>
                    </div>
                </div>
                <p className='shifu'>可提现金额￥{(Number(value.commission) * Number(value.gnum)).toFixed(2)}</p>

            </div>}

            <div className='CommissionContainer_f'>
                <img src={value.avatar} alt="" style={{ width: '.53rem', height: '.53rem', borderRadius: '50%', marginLeft: '.4rem' }} />
                <span style={{ marginLeft: '.2rem' }}>{value.nickname}</span>
            </div>
        </div>

    )
}

function YiGroup(item, time) {
    let value = item.item
    let times = item.time
    // console.log(times)
    return (
        <div className='CommissionContainer'>
            <div className='CommissionContainer_order'>
                <div>
                    <span >订单号:</span>
                    <span>{value.orderno}</span>
                </div>
                <div>
                    <span className='CommissionContainer_time'>{times}</span>
                </div>
            </div>
            {Array.isArray(value.goods) && <div className='commission-container'>
                {value.goods.map((item, index) => {
                    return (
                        <Fragment key={item.id}>
                            <div style={{ width: '100%', height: '2.09rem', marginBottom: '.2rem' }}>
                                <div style={{ width: '2.09rem', height: '2.09rem', float: 'left' }}>
                                    <img src={item.gimg} alt="" />
                                </div>

                                <div style={{ width: '6.36rem', float: 'left', height: '2.09rem', position: 'relative', marginLeft: '.1rem' }}>
                                    <p className='title'>{item.goodsname}</p>
                                    <p className='guige'><span>商品金额</span><span className='count'>￥{item.oprice}</span></p>
                                    <p className='danj'><span>单件提成</span><span className='count'>￥{Number(item.commission).toFixed(2)}</span></p>
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
                <p className='shifu'>可提现金额￥{value.goods.reduce((oldValue, item) => {
                    return Number(item.num) * Number(item.commission) + oldValue
                }, 0).toFixed(2)}</p>

            </div>}
            {!Array.isArray(value.goods) && <div className='commission-container'>
                <div style={{ width: '100%', height: '2.09rem', marginBottom: '.2rem' }}>
                    <div style={{ width: '2.09rem', height: '2.09rem', float: 'left' }}>
                        <img src={value.gimg} alt="" />
                    </div>

                    <div style={{ width: '6.36rem', float: 'left', height: '2.09rem', position: 'relative', marginLeft: '.1rem' }}>
                        <p className='title'>{value.goodsname}</p>
                        <p className='guige'><span>商品金额</span><span className='count'>￥{value.oprice}</span></p>
                        <p className='danj'><span>单件提成</span><span className='count'>￥{Number(value.commission).toFixed(2)}</span></p>
                    </div>
                </div>
                <p className='shifu'>可提现金额￥{(Number(value.commission) * Number(value.gnum)).toFixed(2)}</p>

            </div>}

            <div className='CommissionContainer_f'>
                <img src={value.avatar} alt="" style={{ width: '.53rem', height: '.53rem', borderRadius: '50%', marginLeft: '.4rem' }} />
                <span style={{ marginLeft: '.2rem' }}>{value.nickname}</span>
            </div>
        </div>

    )
}

const scrollConfig = {
    probeType: 1
}
const scrollStyle = {
    padding: '0 .32rem',
    height: 'calc(100vh - 1.29rem)'
}


export default class Commission extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            end_time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
            start_time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
            yigroups: [],
            weigroups: [],
            couponStatus: [
                { id: 'c101', content: '全部订单' },
                { id: 'c102', content: '未结算' },
                { id: 'c103', content: '已结算' }
            ],
            tabsIsShow: 'wsy',
            date: new Date(),
            dates: new Date(),
            navIndex: 0
        }
    }

    changeActive(e, index) {
        const { appConfig } = store.getState()
        const mycashorderConfig = {
            action: 'mycashorder',
            data: {
                uniacid: appConfig.uniacid,
                openid: appConfig.wxUserInfo.openid,
                type: index,
                starttime: this.state.start_time,
                endtime: this.state.end_time
            }
        }

        _mycashorder(mycashorderConfig).then(res => {
            if (res.data.status === 200) {
                if (index === 0) {
                    this.setState({
                        navIndex: index
                    }, () => {
                        this.refs.scroll.BScroll.refresh()
                    })
                } else if (index === 1) {
                    this.setState({
                        weigroups: (res && res.data && res.data.data[1]) || [],
                        navIndex: index
                    }, () => {
                        this.refs.scroll.BScroll.refresh()
                    })
                } else if (index === 2) {
                    this.setState({
                        yigroups: (res && res.data && res.data.data[1]) || [],
                        navIndex: index
                    }, () => {
                        this.refs.scroll.BScroll.refresh()
                    })
                }
            }
        })
    }

    componentDidMount() {
        // const li = document.querySelector('.navbar>li')
        // li.classList.add('active')

        const { appConfig } = store.getState()
        const mycashorderConfig = {
            action: 'mycashorder',
            data: {
                uniacid: appConfig.uniacid,
                openid: appConfig.wxUserInfo.openid,
                type: 0,
                starttime: this.state.start_time,
                endtime: this.state.end_time
            }
        }

        _mycashorder(mycashorderConfig).then(res => {
            if (res.data.data[1] !== null) {
                let aa = res.data.data[1]
                this.setState({
                    groups: aa
                }, () => {
                    this.refs.scroll.BScroll.refresh()
                })
            }
        })


    }

    formData(data) {

        return new Date(parseInt(data) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    }

    queding = () => {
        const { appConfig } = store.getState()
        const mycashorderConfig = {
            action: 'mycashorder',
            data: {
                uniacid: appConfig.uniacid,
                openid: appConfig.wxUserInfo.openid,
                type: 0,
                starttime: this.state.start_time,
                endtime: this.state.end_time
                // starttime: '2000-02-02 20:20:33',
                // endtime: '2020-07-25 20:20:33'
            }
        }



        _mycashorder(mycashorderConfig).then(res => {
            if (res.data.status === 200) {
                this.setState({
                    groups: (res && res.data && res.data.data[1]) || []
                }, () => {
                    this.refs.scroll.BScroll.refresh()
                })
            }
        })
    }

    render() {
        const { navIndex } = this.state
        return (
            <MygroupStyle>
                <nav className="commission-header">
                    <ul className="commission-nav">
                        {
                            this.state.couponStatus.map((item, index) => {
                                return (
                                    <li className='commission-nav-bar' key={index + item.id} onClick={(e) => { this.changeActive(e, index) }}>
                                        <a className='commission-nav-bar-title' style={{ borderBottom: navIndex === index ? '1px solid var(--theme-font-color)' : '' }}>{item.content}</a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
                <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll'>
                    <div style={{ display: navIndex === 0 ? 'block' : 'none' }}>
                        <div className='time'>
                            <li className='ship_name'>
                                <div className='stor_name'>开始时间</div>
                                <div>
                                    <DatePicker

                                        mode="date"
                                        extra="请选择"
                                        onOk={console.log()}
                                        value={this.state.date}
                                        onChange={date => this.setState({
                                            date,
                                            start_time: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                                        }, () => { this.queding() })}
                                    >
                                        <List.Item className='onetimes' arrow="horizontal" ></List.Item>
                                    </DatePicker>
                                </div>
                            </li>
                            <li className='ship_name'>
                                <div className='stor_name'>结束时间</div>
                                <div>
                                    <DatePicker

                                        mode="date"
                                        extra="请选择"
                                        value={this.state.dates}
                                        onChange={v => this.setState({
                                            dates: v,
                                            end_time: v.getFullYear() + '-' + (v.getMonth() + 1) + '-' + v.getDate()
                                        }, () => { this.queding() })}
                                    >
                                        <List.Item className='times' arrow="horizontal" ></List.Item>
                                    </DatePicker>

                                </div>
                            </li>
                        </div>

                        <div className='card_group'>
                            {
                                this.state.groups.map((value, key) => {
                                    let datatime = value.createtime
                                    Number(datatime)
                                    const goodstime = this.formData(Number(datatime))
                                    // console.log(value.createtime)
                                    return (

                                        <Group item={value} key={key} time={goodstime}></Group>
                                    )
                                })

                            }
                        </div>
                    </div>

                    <div style={{ display: navIndex === 1 ? 'block' : 'none' }}>
                        {
                            this.state.weigroups.map((value, key) => {
                                let datatime = value.createtime
                                Number(datatime)
                                const goodstime = this.formData(Number(datatime))
                                // console.log(value.createtime)
                                return (

                                    <WeiGroup item={value} key={key} time={goodstime} />
                                )
                            })

                        }
                    </div>

                    <div style={{ display: navIndex === 2 ? 'block' : 'none' }}>
                        {
                            this.state.yigroups.map((value, key) => {
                                let datatime = value.createtime
                                Number(datatime)
                                const goodstime = this.formData(Number(datatime))
                                // console.log(value.createtime)
                                return (

                                    <YiGroup item={value} key={key} time={goodstime} />
                                )
                            })

                        }
                    </div>
                </BetterScroll>
            </MygroupStyle>
        )
    }
}
const MygroupStyle = styled.div`

background-color: var(--bg-color);

.commission-nav {
    display: flex;
    margin: 0 .32rem .2rem;
    background-color: #fff;
    border-radius: .13rem;
    overflow: hidden;
}

.commission-nav-bar {
    height: 1.09rem;
    line-height: 1.09rem;
    text-align: center;
    flex: 1;
}

.commission-nav-bar-title {
    display: inline-block;
    height: 100%;
}

.stor_name{
    font-size:0.32rem;
    height:1.17rem;
    line-height:1.17rem;
}

.am-list-item .am-list-line .am-list-extra{
    padding-top:.5rem;
    color:#a9a9a9;
    text-align: left;
    font-size:.32rem;
    padding-left:.1rem;
}
.am-list-item .am-list-line .am-list-arrow{

    background-image: none;
    opacity:0;
}
.onetimes{
    position:absolute;
    left:1.8rem;
    top:-.2rem;
    // padding-top:.3rem;
    color: red;
    width:12rem;
    background-color: transparent;
}
.times{
    position:absolute;
    left:1.8rem;
    top:1rem;
    // padding-top:.3rem;
    color: #a9a9a9;
    width:12rem;
    background-color: transparent;
}
.am-list-arrow am-list-arrow-horizontal{
    background-image: none;
    opacity:0;
}



.ship_name input{
    border:none;
    height:.8rem;
    width:6.5rem;
}
.ship_name{
    display:flex;
    justify-content: space-between;
}
.ship_name{
    margin-left:.2rem;
    margin-right:.2rem;
    color:#474747;
    font-size:.4rem;
    height:1.18rem;
    line-height:1rem;
    border-bottom: 1px solid #dadada;
}
.time{
    width:100%;
    height:2.35rem;
    background-color: #fff;
    position:relative;
    border-radius: .2rem;
    margin-bottom: .2rem;
}

.CommissionContainer {
    border-radius: .13rem;
    background-color: #fff;
    margin-bottom: .2rem;
}

.commission-container {
    border-bottom: 1px solid #a9a9a9;
    padding: .4rem;
}

.commission-container img {
    width: 2.09rem;
    height: 2.09rem;
}

.CommissionContainer_order {
    height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .4rem;
    border-bottom: 1px solid #a9a9a9;
}

.CommissionContainer_c{
    height:3.1rem;
    display:flex;
}
.CommissionContainer_c img{
    padding-top:.3rem;
    padding-left:.3rem;
    object-fit: cover;
    height: 2.2rem;
}

.CommissionContainer_c_t{
    position:relative;
    font-size:.2rem;
    padding-left:.16rem;
}

.title{
    font-size:.32rem;
    color:#474747;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.guige{
    width: 100%;
    font-size:.3rem;
    padding-top:.3rem;
    color:#c3c3c3;
}
.danj {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: .3rem;
    color:#c3c3c3;
}
.count {
    float: right;
    font-size:.3rem;
}

.shifu {
    text-align: right;
    font-size: .32rem;
    color:#474747;
}

.CommissionContainer_f{
    display: flex;
    align-items: center;
    height: 1.31rem;
}
.btn{
    color:#474747;
    border:1px solid #474747;
    background-color: #fff;
    border-radius: .5rem;
    height:.5rem;
    width:1.5rem;
}

    
`