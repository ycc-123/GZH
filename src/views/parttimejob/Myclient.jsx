import React, { PureComponent } from 'react'
import styled from 'styled-components'

import BetterScroll from 'common/betterScroll/BetterScroll'

import axios from 'axios'
import { _myteam, _getMemberDetails } from 'network/profile'

import { store } from 'store'


function Client(value) {
    let { item } = value
    let aa = item.orderprice
    // console.log(Math.floor(aa * 100) / 100)
    return (
        <div className='card'>
            <img src='https://res.lexiangpingou.cn/images/vip/www.png' alt="" />
            <div>
                <div className='quan'><img src={item.avatar} alt="" /></div>
                <div className='conter_name'>{item.nickname}</div>
                <div className='conter_sales'>{new Date(parseInt(item.intertime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')}</div>
                <div className='conter_money'><span>累计消费：</span><span>￥{Math.floor(aa * 100) / 100}</span></div>
            </div>
        </div>
    )
}

export default class Myclient extends PureComponent {
    constructor() {
        super()
        this.state = {
            client: [],
            myclient: '',
            topname: '',
            youxiang: '',
            yhuname: '',
            leijixiaos: '',
        }
        this.isLoadMore = true
        this.myteamConfig = {
            action: 'myteam',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,
                page: 1,
                pagesize: 10
            }
        }
    }

    componentDidMount() {

        const getMemberDetailsConfig = {
            action: 'getMemberDetails',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,
            }
        }

        axios.all([
            _getMemberDetails(getMemberDetailsConfig),
            _myteam(this.myteamConfig)
        ]).then(res => {
            
            if (res[1].data.data[1] !== "0") {
                let leijixiaos = res[1].data.data[2]
                let aa = res[1].data.data[0]
                let zren = res[1].data.data[1]
                let name = res[1].data.data[0][0].realname
                this.setState({
                    yhuname: res[0].data.data.nickname,
                    youxiang: res[0].data.data.avatar,
                    leijixiaos: Math.floor(leijixiaos * 100) / 100,
                    client: aa,
                    myclient: zren,
                    topname: name
                }, () => {
                    this.refresh()
                    if (res[1].data.data[0].length < 10) {
                        this.isLoadMore = false
                    } else {
                        this.isLoadMore = true
                        this.myteamConfig.data.page += 1
                    }
                })
            } else {
                this.setState({
                    youxiang: res[0].data.data.avatar
                })
            }
        })
    }

    refresh = () => {
        this.refs.scroll.BScroll.refresh()
    }

    loadMore = () => {
        const { client } = this.state
        if (this.isLoadMore) {
            _myteam(this.myteamConfig).then(res => {
                // 如果长度不等于得时候加载 那么是到底了
                if (res.data.status === 200) {
                    // 不能加载更多了
                    if (res.data.data[0].length < 10) {
                        this.isLoadMore = false
                        this.setState({
                            client: [...client, ...res.data.data[0]]
                        }, () => {
                            this.refs.scroll.BScroll.finishPullUp()
                            this.refresh()
                        })
                    } else {
                        this.isLoadMore = true
                        this.setState({
                            client: [...client, ...res.data.data[0]]
                        }, () => {
                            this.myteamConfig.data.page += 1
                            this.refs.scroll.BScroll.finishPullUp()
                            this.refresh()
                        })
                    }
                }
            })
        }
    }


    render() {
        const scrollConfig = {
            probeType: 1
        }
        const scrollStyle = {
            height: 'calc(100vh - .5rem)',
            padding: '.2rem .32rem 0',
        }
        return (
            <MyclientStyle>
                <BetterScroll
                    config={scrollConfig}
                    style={scrollStyle}
                    loadMore={this.loadMore}
                    isLoadMore={this.isLoadMore}
                    ref='scroll'>
                    <div>
                        <div className='header'>
                            <img src='https://res.lexiangpingou.cn/images/vip/bbb.png' alt="" />
                            <div className='touxiang'><img src={this.state.youxiang} alt="" /></div>
                            <div className='header_name'>{this.state.yhuname}</div>
                            <div>
                                <span className='header_sales'>累计销售:</span>
                                <span className='header_money'>￥
                                {this.state.leijixiaos ? this.state.leijixiaos : "0.00"}
                                </span>
                            </div>
                            <div className='header_count'>{this.state.myclient ? this.state.myclient : 0}人</div>
                        </div>

                        <div className='conter'>
                            {
                                this.state.client.map((value, key) => {
                                    console.log(value.intertime)

                                    return (
                                        <Client item={value} key={key}></Client>
                                    )

                                })
                            }
                        </div>

                        {/* <div className='footer'>
                            <button>查看更多~</button>
                        </div> */}
                    </div>
                </BetterScroll>
            </MyclientStyle>
        )
    }
}
const MyclientStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);

.conter_money{
    top:3.5rem;
    left:.7rem;
    position:absolute;
}
.conter_sales{
    top:3rem;
    left:.7rem;
    position:absolute;
}
.conter_name{
    top:2.2rem;
    left:-.1rem;
    height:1rem;
    text-align:center;
    width:.3rem;
    // background-color: pink;
    position:absolute;
}
.card{
    color:#fff;
    position:relative;
}
.conter div .quan img{
    height:100%;
    width:100%;
    border-radius: 50%;
}
.conter div .quan{
    top:.5rem;
    left:1.45rem;
    position:absolute;
    height:1.5rem;
    width:1.5rem;
    border-radius: 50%;
    // background-color: pink;
}
.header{
    color:#fff;
    position:relative;
}
.header_count{
    top:.6rem;
    left:7.5rem;
    position:absolute;
    font-size:.6rem;
}
.header_money{
    top:1.1rem;
    left:4rem;
    position:absolute;
    font-size:.4rem;
}
.header_sales{
    top:1.1rem;
    left:2.2rem;
    position:absolute;
    font-size:.4rem;
}
.header_name{
    top:.4rem;
    left:2.2rem;
    position:absolute;
    font-size:.4rem;
}
.header img{
    object-fit: cover;
    height: 2.1rem;
}
.touxiang img{
    height:100%;
    width:100%;
    border-radius: 50%;
}
.touxiang{
    top:.3rem;
    left:.3rem;
    position:absolute;
    height:1.5rem;
    width:1.5rem;
    border-radius: 50%;
    background-color: pink;
}
.conter{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height:100%;
    width: 9.36rem;
}
.conter div{
    margin-top:.2rem;
    height:4.5rem;
    width: 4.3rem;
}
.conter div img{
    border-radius:.2rem;
    object-fit: cover;
    height: 4.5rem;
}

.footer button{
    top:17rem;
    left:4rem;
    position:absolute;
    background-color: transparent;
    color:#fff;
}

`