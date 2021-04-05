import React, { PureComponent } from 'react';
import styled from 'styled-components'
import { store } from 'store/index'
import { _getOrderList } from 'network/order'
import './style/order.css'
import { Toast } from "antd-mobile";

import { setTitle } from 'commons/utils'

import { _setPVUV } from 'network/api'

// 公共组件
import BetterScroll from 'common/betterScroll/BetterScroll'
//子组件
import SearchBox from './childCom/SearchBox'
import OrderItem from './childCom/OrderItem'

const OrderStyle = styled.div`

height: calc(100vh - 0px);
background-color: var(--bg-color);

.orderHeader{
  margin: 0 .32rem;
  background-color:white;
  height: 1.09rem;
  border-radius: .13rem;
}



.hederContainer{
  display: flex;
  font-weight:bold;
}

.hederContainer>li{
  margin-top: .33rem;
  text-align:center;
  flex:1;
}

.onActive{
  color: var(--theme-font-color);
  padding-bottom: .313rem;
}


// -------


.diffStatusOrder{
  color:white;
}
.inputRadio{
  width:3rem;
  height:3rem;
}

/* 订单操作 */

.orderOption{
  height: 1.333rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.orderOpBtn {
  height: .69rem;
  padding: 0 .3rem;
  margin-right: .41rem;
  text-align: center;
  border: 1px solid #474747;
  border-radius: .33rem;
  color: #474747;
  background-color: var(--box-bg-color);

} 

`

class Order extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            way: 'all',

        }
        this.isLoadMore = true
        this.way = [
            { id: 'w101', content: '全部' },
            { id: 'w102', content: '待发货' },
            { id: 'w103', content: '待收货' },
            { id: 'w104', content: '已收货' },
            { id: 'w105', content: '售后' },
        ]


        this.searchOrder = this.searchOrder.bind(this)

        const { appConfig } = store.getState()
        const { openid } = appConfig.wxUserInfo
        this.networkConfig = {
            getOrderListConfig: {
                action: 'getOrder',
                data: {
                    uniacid: appConfig.uniacid,
                    openid,
                    page: 1,
                    pagesize: 10,
                    status: ''
                }
            },
            searchOrder: {
                action: 'getOrder',
                data: {
                    uniacid: appConfig.uniacid,
                    orderno: '',
                    apply: 1
                }
            }
        }
    }



    render() {
        const { isApplet } = store.getState().appConfig

        const scrollConfig = {
            probeType: 1
        }

        const scrollStyle = {
            padding: '0 .32rem',
            height: 'calc((100vh - 2.69rem) - env(safe-area-inset-bottom))'
        }


        return (
            <OrderStyle>
                <div className='orderHeader'>
                    <ul className='hederContainer'>
                        {this.way.map((item, index) => {
                            return (
                                <li key={index + item.id}
                                    style={{ color: this.props.match.params.id === index ? 'red' : '' }}
                                    onClick={(e) => {
                                        this.changeActive(e, index)
                                    }}>{item.content}</li>
                            )
                        })}
                    </ul>
                </div>
                <SearchBox searchOrder={this.searchOrder} />

                <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll'
                    loadMore={this.loadMore}
                    isLoadMore={this.isLoadMore}
                >

                    <div className='diffStatusOrder' id="diffStatusOrder" >
                        {
                            this.state.orderList.length !== 0 && this.state.orderList.map((item, key) => {
                                return (
                                    <OrderItem cancelOrderList={this.cancelOrderList} isApplet={isApplet} index={key} item={item} key={key + item.id} />
                                )
                            })
                        }
                    </div>

                    {/* <div className='diffStatusOrder' id="diffStatusOrder" style={{ display: sh }}>
                        {
                            this.state.orderList.map((item, key) => {
                                return (
                                    item.servestype === '1'&&<OrderItem item={item} index={key} key={key + item.id} />
                                )
                            })
                        }
                    </div>*/}

                </BetterScroll>

            </OrderStyle>
        );
    }



    async componentDidMount() {

        _setPVUV()

        setTitle('我的订单')

        let id = this.props.match.params.id
        const li = document.querySelector(`.hederContainer>li:nth-child(${id})`)
        li.classList.add('onActive')

        switch (id) {
            case '1':
                this.getOrderList()
                this.setState({
                    way: 'all'
                })
                break;
            case '2':
                this.getOrderList(8)
                this.setState({
                    way: 'dfh'
                })
                break;
            case '3':
                this.getOrderList(2)
                this.setState({
                    way: 'dsh'
                })
                break;
            case '4':
                this.getOrderList(3)
                this.setState({
                    way: 'ysh'
                })
                break;
            case '5':
                this.getOrderList(11)
                this.setState({
                    way: 'sh'
                })
                break;

        }


        // this.getOrderList()

    }

    cancelOrderList = (index) => {
        let nowList = this.state.orderList
        nowList.splice(index, 1)
        this.setState({
            orderList: nowList
        })
    }


    getOrderList = async (status) => {
        // this.refs.scroll.BScroll.scrollTo(0, 0, 1000) // 回到高度
        if (status) {
            if (this.networkConfig.getOrderListConfig.data.status !== status) {
                this.networkConfig.getOrderListConfig.data.status = status
                this.networkConfig.getOrderListConfig.data.page = 1
            }
        } else {
            this.networkConfig.getOrderListConfig.data.status = ''
        }
        // 请求全部订单
        console.log(this.networkConfig.getOrderListConfig)
        let result = await _getOrderList(this.networkConfig.getOrderListConfig)
        this.setState({
            orderList: (result && result.data && result.data.data && result.data.data.list) || []
        }, () => {
            this.refs.scroll.BScroll.refresh()
            this.refs.scroll.BScroll.finishPullUp()
            this.refs.scroll.BScroll.scrollTo(0, 0)
            if (this.state.orderList.length < this.networkConfig.getOrderListConfig.data.pagesize) {
                this.isLoadMore = false
            } else {
                this.isLoadMore = true
                this.networkConfig.getOrderListConfig.data.page += 1
            }
            console.log(this.isLoadMore)
        })
    }

    componentWillMount() {
        this.setState({
            way: this.props.match.params.name
        })
    }

    async searchOrder(orderno) {
        if (orderno === "") {
            Toast.info('请先输入订单号')
        } else {
            this.networkConfig.searchOrder.data.orderno = orderno
            let result = await _getOrderList(this.networkConfig.searchOrder)
            console.log(result)
            if (result.data.status === 400) {
                Toast.fail(result.data.msg, 2)
            } else if (result.data.status === 200) {
                console.log(result.data.data.list)
                this.setState({
                    orderList: result.data.data.list
                }, () => {
                    this.isLoadMore = false
                    this.refs.scroll.BScroll.refresh()
                    this.refs.scroll.BScroll.scrollTo(0, 0, 0)
                })
            }
        }
    }

    changeActive = (e, index) => {
        if (e.target.className !== 'onActive') {
            this.isLoadMore = true
            const li = document.querySelectorAll('.hederContainer li')
            li.forEach((item, itemIndex) => {
                item.classList.remove('onActive')
                if (index === itemIndex) {
                    item.classList.add('onActive')
                    switch (item.innerHTML) {
                        case '全部':
                            this.getOrderList()
                            this.setState({
                                way: 'all'
                            })
                            break;
                        case '待发货':
                            this.getOrderList(8)
                            this.setState({
                                way: 'dfh'
                            })
                            break;
                        case '待收货':
                            this.getOrderList(2)
                            this.setState({
                                way: 'dsh'
                            })
                            break;
                        case '已收货':
                            this.getOrderList(3)
                            this.setState({
                                way: 'ysh'
                            })
                            break;
                        case '售后':

                            this.getOrderList(11)
                            this.setState({
                                way: 'sh'
                            })
                            break;
                        default:
                            break;
                    }
                }
            })
        }
    }

    // 加载更多
    loadMore = async () => {
        if (this.isLoadMore) {
            let orderListRes = await _getOrderList(this.networkConfig.getOrderListConfig)
            let length = orderListRes.data.data.list.length
            // 如果长度不等于得时候加载 那么是到底了
            if (length < this.networkConfig.getOrderListConfig.data.pagesize) {
                this.isLoadMore = false
            } else {
                this.networkConfig.getOrderListConfig.data.page += 1
                this.isLoadMore = true
            }
            this.setState({
                orderList: [...this.state.orderList, ...orderListRes.data.data.list]
            }, () => {
                // loading = false
                this.refs.scroll.BScroll.finishPullUp()
                this.refs.scroll.BScroll.refresh()
            })
        }
    }

}

export default Order;