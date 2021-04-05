import React, { Component } from 'react'
import styled from "styled-components";
import { _jfcheck } from 'network/profile'
import { store } from 'store'


export default class Hexiaoyuan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: this.props.match.params.order,
            ordertype: '',
            addname: '',
            mobile: '',
            orderno: '',
            goodsname: '',
            count: '',
            credit: ''
        }
        this.confirmSeccess = this.confirmSeccess.bind(this)
    }

    async confirmSeccess() {
        const confirmConfig = {
            action: 'jfcheck',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,
                orderno: 'D' + this.state.order,
                type: 1
            }
        }
        let checkRes = await _jfcheck(confirmConfig)
    }

    componentDidMount() {
        const confirmConfig = {
            action: 'jfcheck',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,
                orderno: 'D' + this.state.order,
                type: 0
            }
        }
        _jfcheck(confirmConfig).then(res => {
            if (res.data.status == 200) {
                let ordertype = res.data.data[0].ordertype
                let addname = res.data.data[0].addname
                let mobile = res.data.data[0].mobile
                let orderno = res.data.data[0].orderno
                let goodsname = res.data.data[0].goods[0].gname
                let count = res.data.data[0].goods[0].gnum
                let credit = res.data.data[0].goods[0].oprice
                console.log(credit)
                this.setState({
                    ordertype,
                    addname,
                    mobile,
                    orderno,
                    goodsname,
                    count,
                    credit
                })
            }
        })
    }


    render() {
        return (
            <ResultStyle>
                <div className="main">
                    <div className="container">
                        <div className="top">
                            <div className="title">
                                <h3>积分商品核销凭证</h3>
                            </div>
                            <hr />
                            <div className="content">
                                <div>
                                    <p>订单类型：</p>
                                    <article>{this.state.ordertype}</article>
                                </div>

                                <div>
                                    <p>订单号：</p>
                                    <article>{this.state.orderno}</article>
                                </div>

                                <div>
                                    <p>提款人：</p>
                                    <article>{this.state.addname}</article>
                                </div>

                                <div>
                                    <p>商品名称：</p>
                                    <article>{this.state.goodsname}</article>
                                </div>

                                <div>
                                    <p>数量：</p>
                                    <article>{this.state.count}</article>
                                </div>

                                <div>
                                    <p>积分：</p>
                                    <article>{this.state.credit}</article>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <button 
                            onClick={this.confirmSeccess}
                        >确认收款</button>
                        <button
                            onClick={() => { this.props.history.push('/home') }}
                        >返回首页</button>
                    </div>
                </div>
            </ResultStyle>
        )
    }
}

const ResultStyle = styled.div`
.content article{
    font-size:.3rem;
    // color:red;
}
.main{

    color: var(--common-font-color);
    padding: var(--main-padding);

}
.container{
    display: flex;
    flex-direction: column;
    background-color: var(--box-bg-color);
    border-radius: var(--box-border-radius);
    margin-top: var(--box-margin-top);
}
.title{
    text-align: left;
    padding: .2rem .2rem;
}
hr{
    opacity: .5;
}
.content div article{
    margin-right:.2rem;

}
.content div{
    display:flex;
    justify-content: space-between;
    margin-top:.3rem;
    margin-bottom:.3rem;
}
.content{

    padding-left: .4rem;
    line-height: .4rem;
}
.content>p{
    padding: .2rem;
}
.bottom{
    margin-top: var(--box-margin-top);
    display: flex;
    flex-direction: column;
}
.bottom>button{
    margin: .2rem 0;
    height: 1rem;
    background-color: var(--theme-font-color);
    color: #ffffff;
    border-radius: .2rem;
}

`
