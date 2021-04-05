import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import BetterScroll from 'common/betterScroll/BetterScroll'
import { _MemberInfo } from 'network/profile'
import { store } from 'store'
import jsBarCode from "jsbarcode";
import MemberInfoItem from "./MemberInfoItem";

const scrollConfig = {
    probeType: 1
}
const scrollStyle = {
    height: 'calc(100vh - 0px)',
    padding: '0 .32rem',
}

// 会员信息页面

class MemberInfo extends Component {
    constructor() {
        super()
        this.state = {
            memberInfo: {},
            page: 1,
            pagesize: 5,
            orderList: [],
            birthday: ''
        }
        this.isLoadMore = true
    }

    componentDidMount = async () => {
        //会员信息
        const getMemberInfoConfig = {
            action: 'getMember',
            data: {
                memberid: store.getState().memberUserInfo.id
            }
        }
        let res = await _MemberInfo(getMemberInfoConfig)
        console.log(res)
        let memberInfo = res.data.data
        if (res.data.status === 200) {
            let aa = memberInfo.birthday
            let birthday = aa.substring(0, 10)
            this.setState({
                memberInfo,
                birthday
            })


            //消费记录
            const memberOrderConfig = {
                action: 'memberOrder',
                data: {
                    memberid: store.getState().memberUserInfo.id,
                    page: this.state.page,
                    pagesize: this.state.pagesize
                }
            }

            let order = await _MemberInfo(memberOrderConfig)
            console.log(order)

            if (order.data.status === 200) {
                this.setState({
                    orderList: order.data.data.list
                })
                let code = memberInfo.member_mobile
                let membercode = this.refs.membercode
                jsBarCode(membercode, code, {
                    format: "CODE128",//选择要使用的条形码类型
                    width: 2.7,//设置条之间的宽度
                    height: 100,//高度
                    displayValue: false,//是否在条形码下方显示文字
                    text: code,//覆盖显示的文本
                    fontOptions: "bold italic",//使文字加粗体或变斜体
                    font: "fantasy",//设置文本的字体
                    textAlign: "center",//设置文本的水平对齐方式
                    textPosition: "bottom",//设置文本的垂直位置
                    textMargin: 6,//设置条形码和文本之间的间距
                    fontSize: 20,//设置文本的大小
                    background: "white",//设置条形码的背景
                    lineColor: "#000",//设置条和文本的颜色。
                    margin: 10//设置条形码周围的空白边距
                })


            }
        }

        this.refs.scroll.BScroll.refresh()

    }

    render() {

        document.title = "会员信息";
        const { memberInfo } = this.state

        return (
            <MemberStyle>
                <BetterScroll config={scrollConfig} style={scrollStyle} ref='scroll' loadMore={this.loadMore}
                    isLoadMore={this.isLoadMore}>
                    <div className='member'>
                        <div className='hearder'>
                            <div className='pay' >
                                <img alt="" ref="membercode" />
                            </div>
                            <ul className='message'>
                                <li className='message1'><span>会员编号</span><p>{memberInfo.member_mobile}</p></li>
                                {memberInfo.storename && <li className='message1'><span>所属门店</span><p>{memberInfo.storename}</p></li>}
                                <li className='message2'><span>真实姓名</span><p>{memberInfo.name}</p></li>
                                <li className='message3' style={{ border: "none" }}><span>生日</span><p>{this.state.birthday}</p></li>
                            </ul>
                        </div>

                        <div className='footer'>
                            <div className='footer_title'>消费记录</div>
                            {
                                this.state.orderList.map((item, key) => {
                                    return (
                                        <MemberInfoItem seeConsumptionDetail={this.seeConsumptionDetail} item={item} key={item.id + key} />
                                    )
                                })
                            }
                        </div>

                    </div>
                </BetterScroll>
            </MemberStyle>
        )
    }

    seeConsumptionDetail = (item) => {
        this.props.history.push(`/ConsumptionDetail/${item.orderno}/${item.type_value}`)
    }

    loadMore = () => {
        // 加载数据时转圈
        let loading = true
        setTimeout(() => {
            if (loading) {
                this.setState({
                    loadingMore: true
                })
            }
        }, 1000)
        if (this.isLoadMore) {
            const memberOrderConfig = {
                action: 'memberOrder',
                data: {
                    memberid: store.getState().memberUserInfo.id,
                    page: this.state.page,
                    pagesize: this.state.pagesize
                }
            }
            _MemberInfo(memberOrderConfig).then(res => {


                // 如果长度不等于得时候加载 那么是到底了
                if (res.data.data.list.length < this.state.pagesize) {
                    this.isLoadMore = false
                    /* let bottomTip = document.querySelector('.bottom-tip')
                    bottomTip.style.visibility = 'visible'
                    bottomTip.innerHTML = '商品已经全部加载完成' */
                }
                this.setState({
                    orderList: [...this.state.orderList, ...res.data.data.list],
                    loadingMore: false
                }, () => {
                    this.setState({
                        page: this.state.page += 1
                    })

                    loading = false
                    this.refs.scroll.BScroll.finishPullUp()
                    this.refs.scroll.BScroll.refresh()
                })
            })
        } else {
            /* let bottomTip = document.querySelector('.bottom-tip')
            bottomTip.style.visibility = 'visible'
            bottomTip.innerHTML = '商品已经全部加载完成' */
        }
    }
}
const MemberStyle = styled.div`

background-color: var(--bg-color);
height: calc(100vh - 0px);

.hearder{
    width:100%;
    background-color: #fff;
    border-radius: .2rem;
    margin-top:.3rem;
}
.footer_title{
    margin-top:.25rem;
    font-size:.4rem;
    color: var(--font-color);
}
.order{
    margin-top:.25rem;
    width:100%;
    background-color: #fff;
    border-radius: .2rem;
}
.order2{
    margin-top:.16rem;
    height:2rem;
    width:100%;
    background-color: #fff;
    border-radius: .2rem;
}
.order3{
    margin-top:.16rem;
    height:2rem;
    width:100%;
    background-color: #fff;
    border-radius: .2rem;
}
.hearder_title{
    display:flex;
    align-items:center;
    justify-content: center;
    padding-top:.3rem;
}
.hearder_title p{
    font-size:.6rem;
    color:#fff;
}
.hearder_title span img{
    margin-top:.1rem;
    height: .6rem;
    margin-left: .2rem;
    object-fit: cover;
}
.xian{
    height:1px;
    background-color: #e5e5e5;
    width:100%;
    margin-top:.5rem;
}
.xian1{
    height:1px;
    background-color: #e5e5e5;
    width:100%;
    margin-top:.1rem;
}
.call{
    margin-top:.3rem;
    font-size:.5rem;
    text-align:center;
}
.pay{
    display:flex;
    align-items:center;
    justify-content: center;
}
.payment{
    margin-top:.3rem;
    height: 3.5rem;
    margin-left: .2rem;
    object-fit: cover;
}
.message li{
    
    font-size:.4rem;
    display:flex;
    justify-content: space-between;
    margin: 0 .3rem;
    padding-top:.25rem;
    padding-bottom:.2rem;
    height:1.2rem;
    line-height:.8rem;
    border-bottom:1px solid #e5e5e5;
}
.message li span{
    color:#474747;
}
.message li p{
    color:#848484;
}


.order_title{
    font-size:.4rem;
    padding-top:.1rem;
    display:flex;
    justify-content: space-between;
    align-items:center;
}
.order_title span{
    color:#474747;
    font-size:.3rem;
}
.odd{
    margin-left:.2rem;
}
.yard{
    color:#474747;
}
.store{
    text-align:center;
    font-size:.3rem;
    border-radius: .1rem;
    width:1.6rem;
    height:.6rem;
    line-height:.5rem;
    color:#fff;
    background-color: var(--theme-font-color);
    margin-right:.1rem;
}
.stores{
    margin-top:.1rem;
    font-size:.1rem;
    border-radius: .1rem;
    width:1.3rem;
    height:.5rem;
    line-height:.5rem;
    color:#fff;
    background-color: #ff9e14;
    margin-right:.1rem;
}
.retreat{
    margin-right:.1rem;
    // margin-left:.1rem;
    margin-top:.1rem;
    font-size:.3rem;
    border-radius: .1rem;
    width:1.3rem;
    height:.5rem;
    line-height:.5rem;
    color:#fff;
    background-color: #eb0000;
}
.guo1{
margin-top:.25rem;
height: 1.1rem;
margin-left: .35rem;
object-fit: cover;
}
.order_footer{
    display:flex;
}
.order_footer_wen{
    margin-top:.2rem;
    margin-left:.1rem;
}
.order_footer_wen_title{
    font-weight:900;
    color:#474747;
    font-size:.35rem;
}
.order_footer_wen_time{
    color:#a1a1a1;
    margin-top:.3rem;
}
.money{
    font-size:.3rem;
    margin-top:.55rem;
    text-align:right;
}
.money div{
    padding-right:.4rem;
}
.qqq{
    display:flex;
    justify-content: space-between;
    color:#474747;
}

`

export default withRouter(MemberInfo) 