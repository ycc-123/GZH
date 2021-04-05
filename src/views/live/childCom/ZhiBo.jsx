import React, { Component } from "react";
import ALiYun from './ALiYun';
import Bottom from "./Bottom";
import LiveAvatar from "./LiveAvatar";
import ChatRoom from "./ChatRoom";
import ShopingGoods from "./ShopingGoods";

class ZhiBo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bigImg: {}
        }
    }
    render() {

        document.title = "直播";
        const { userMember, loginName, nowSaleDetail, allMsg, LIVE, speaking, huifang, uniacImg, playerUrl } = this.props
        return (
            <div className="zhibo">
                {playerUrl && <ALiYun liveStatus={LIVE} playerUrl={playerUrl} huifangUri={huifang} />}
                <ShopingGoods nowSaleDetail={nowSaleDetail} />
                <LiveAvatar bigImg={uniacImg} userMember={userMember} uniacImg={uniacImg} />
                <ChatRoom loginName={loginName} saycontent={allMsg} />
                <Bottom nowSaleDetail={nowSaleDetail} speaking={speaking} liveStatus={LIVE} />
            </div>
        )
    }
}

export default ZhiBo