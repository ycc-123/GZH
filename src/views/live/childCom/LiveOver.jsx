import React, { Component } from "react";
import { _chatRoom, _lives } from "network/live";
import styled from "styled-components";

import { store } from 'store/index'


const LiveOrderStyle = styled.div`
.liveover{
    color: rgba(255, 255, 255, .6);
}
 .header-right{
    position: absolute;
    right: .36rem;
    top: .61rem;
    display: flex;
    flex-direction: row;
    color: white;
    opacity: .8;
}

.saledGoods{
    background-color: rgba(7,0,2,.5);
    text-align: center;
    width: 1.93rem;
}

.close{
    width: .86rem;
    height: .86rem;
}
.close>img{
    width: 100%;
    height: 100%;
}

.avatar>img{
    width: 100%;
    height: 100%;
    border-radius:  50%;
}
.avatar{
    position: absolute;
    top:2.2rem;
    left: 3.7rem;
    width:2.67rem;
    display: flex;
    flex-direction: column;
    align-items: center;

}
h2{
    opacity: .8;
    color: white;
    padding-top: .62rem;
}


.livelist{
    margin-top: 6.89rem;
    text-align: center;
}

.listItem{
    display: flex;
    flex-direction: row;
    /*justify-content: space-between;*/
    /*align-items: center;*/
}
.listItem>div{
    flex: calc(1/3);
}
.listItem>div>p{
    padding-top: .32rem;
}

.listItem>div:nth-child(1){
    border-right: rgba(255,255,255,.5) solid .02rem;
}
.listItem>div:nth-child(2){
    border-right: rgba(255,255,255,.5) solid .02rem;
}
.tuijian{
    font-size:.35rem;
    color:#fff;
    margin-top:.5rem;
    margin-left:.5rem;
    
}
.shanping{
    margin-top:.3rem;
    display:flex;
    
    margin-left:.3rem;
}
.shanping li div{
    position:absolute;
    top:0;
    left:0;
    color:#fff;
    text-align:center;
    width:.5rem;
    height:.5rem;
    opacity: .5;
    background-color:black;
}
.shanping li p{
    position:absolute;
    left:.4rem;
    bottom:.2rem;
    color:#fff;
}
.shanping li{
    position:relative;
    margin-left:.2rem;
    width:1.8rem;
    height:1.8rem;
    background-color:red;
    flex-direction: column;
}
.shanping img{
    margin-left:.3rem;
    height: 1.85rem;
    object-fit: cover;
}
.livebuttom{
    color:#fff;
}
.livebuttom{
    margin-top:1rem;
}
.livebuttom>p{
    margin:0 auto;
    
}
.livebuttom>p:nth-child(1){
    width:4rem;
    height:1rem;
    border-radius:.5rem;
    background-color:#585858;
    border:1px solid #fff;
    text-align:center;
    line-height: 1rem;
}
.livebuttom>p:nth-child(2){
    width:4rem;
    margin-top:.5rem;
    height:1rem;
    border-radius:.5rem;
    background-color:#eb544d;
    text-align:center;
    line-height: 1rem;
}

`

class LiveOver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsRandList: '',
            overLiveData: '',
            bigImg: {}
        }
    }

    render() {

        const { time, membercount, zan } = this.state.overLiveData
        const { list } = this.state.goodsRandList

        return (
            <LiveOrderStyle>
                <div className="liveover">
                    <div className="header-right">
                        <div className="saledGoods">
                            <p>已售商品</p>
                            <p>0件</p>
                        </div>
                        <div className="close">
                            <img
                                src='https://res.lexiangpingou.cn/images/53/2020/01/H3low1AAqKWq30w6wQ00W1Hq31Qqq6.png'
                                alt="" />
                        </div>
                    </div>

                    <div className="avatar">
                        <img
                            src={this.state.bigImg.headimgsrc}
                            alt={this.state.bigImg.name} />

                        <h2>直播已结束</h2>
                    </div>

                    <div className="livelist">
                        <div className="listItem">
                            <div>
                                <span>直播时长</span>
                                {/*<p>{(time / 60).toFixed(2)}分钟</p>*/}
                                <p>{this.formatSeconds(time)}</p>
                            </div>

                            <div>
                                <span>观看人数</span>
                                <p>{membercount}</p>
                            </div>
                            <div>
                                <span>点赞次数</span>
                                <p>{zan || 896}</p>
                            </div>
                        </div>
                    </div>

                    <div className="randgoods">
                        <p className='tuijian'>推荐商品</p>
                        <ul className='shanping'>

                            {list && list.slice(1, 6).map((item, key) => {
                                return (
                                    <li onClick={() => { this.props.history.push(`/detail/${item.id}/0`) }} key={key + item.id} style={{ backgroundImage: `url(${item.gimg})`, backgroundSize: "100%" }}>
                                        <div>{key}</div>
                                        <p>￥{item.oprice}</p>
                                    </li>
                                )
                            })}



                            <img src="" alt="" />
                        </ul>
                    </div>

                    <div className="livebuttom">
                        <p onClick={() => { this.props.history.push('/live/1013') }}>直播回放</p>
                        <p onClick={() => { this.props.history.push('/home') }}>返回首页</p>
                    </div>


                </div>
            </LiveOrderStyle>
        )
    }


    formatSeconds = (value) => {
        let secondTime = parseInt(value);// 秒
        let minuteTime = 0;// 分
        let hourTime = 0;// 小时
        if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        var result = "" + parseInt(secondTime) + "秒";

        if (minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "分" + result;
        }
        if (hourTime > 0) {
            result = "" + parseInt(hourTime) + "小时" + result;
        }
        return result;
    }

    async componentDidMount() {
        const { appConfig } = store.getState()

        const overLiveInfoConfig = {
            op: 'OverLiveInfo',
            uniacid: appConfig.uniacid
        }
        let overLiveRes = await _chatRoom(overLiveInfoConfig)



        const goodsRandConfig = {
            op: 'goods_rand',
            uniacid: appConfig.uniacid
        }
        let goodsRandRes = await _chatRoom(goodsRandConfig)

        const uniacHeader = {
            action: 'uniacidDetail',
            data: {
                uniacid: appConfig.uniacid
            }
        }

        let Res = await _lives(uniacHeader)

        this.setState({
            overLiveData: overLiveRes.data,
            goodsRandList: goodsRandRes.data,
            bigImg: Res.data.data
        })
    }
}

export default LiveOver