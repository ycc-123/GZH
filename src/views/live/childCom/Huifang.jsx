import React, { Component } from "react";
import Bottom from "./Bottom";
import LiveAvatar from "./LiveAvatar";
import { store } from "store/index";
import Player from 'aliplayer-react';
import ChatRoom from "./ChatRoom";
import ShopingGoods from "./ShopingGoods";

class Huifang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instance: null,
        }
    }
    render() {
        document.title = "直播回放";
        const { userMember, nowSaleDetail, speaking, huifang, LIVE, uniacImg, allMsg, loginName } = this.props
        const { nickname } = store.getState().appConfig.wxUserInfo
        // 存在说明是IOS系统
        const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
        const config = {
            id: 'huifang',
            source: huifang,
            width: document.body.clientWidth + 'px',
            height: document.body.clientHeight + 'px',
            videoWidth: "100%",
            videoHeight: "100%",
            autoplay: true,
            isLive: false,
            rePlay: false,
            // 安卓为false ios为true
            playsinline: ver ? true : false,
            preload: true,
            controlBarVisibility: "always",
            useH5Prism: true,
            x5_type: 'h5',
            x5_fullscreen: false,
            showBuffer: true,
            skinLayout: [
                {
                    "name": "bigPlayButton",
                    "align": "blabs",
                    "x": 30,
                    "y": 80
                },
                {
                    "name": "prism-progress",
                    "width": "100%"

                },
                {
                    "name": "H5Loading",
                    "align": "cc"
                },
                {
                    'name': 'prism-speed-selector',
                    'x': 0,
                    'y': 0
                },
                {
                    "name": "errorDisplay",
                    "align": "tlabs",
                    "x": 0,
                    "y": 0
                },
                {
                    "name": "infoDisplay"
                },
                {
                    "name": "tooltip",
                    "align": "blabs",
                    "x": 0,
                    "y": 56
                },
                {
                    "name": "thumbnail"
                },
                {
                    "name": "controlBar",
                    "align": "blabs",
                    "x": -100,
                    "y": -100,
                    "children": [
                        /*{
                            "name": "progress",
                            "align": "blabs",
                            "x": 0,
                            "y": 44
                        },
                        {
                            "name": "playButton",
                            "align": "tl",
                            "x": 15,
                            "y": 12
                        },
                        {
                            "name": "timeDisplay",
                            "align": "tl",
                            "x": 10,
                            "y": 7
                        }*/
                    ]
                }
            ],
            x5_orientation: 'portraint',// 跟随手机自动旋转
            components: [
                {
                    name: "RateComponent",
                    type: Player.components.RateComponent,
                }
            ]
        }
        return (
            <div className="zhibo">
                <Player
                    config={config}
                    onGetInstance={instance => this.setState({ instance })}
                />
                <ShopingGoods nowSaleDetail={nowSaleDetail} />
                <LiveAvatar nickName={nickname} userMember={userMember} uniacImg={uniacImg} />
                {/* <ChatRoom loginName={loginName} saycontent={allMsg} /> */}
                {/* <Bottom speaking={speaking} liveStatus={LIVE}/> */}
            </div>
        )
    }

    resizeVideo = () => {
        const { instance } = this.state
        if (instance) {
            instance._el.style.height = document.body.clientHeight + 'px'
            instance._el.style.width = document.body.clientWidth + 'px'
        }
    }

    componentDidMount() {

        // this.resizeVideo()
        window.addEventListener('resize', this.resizeVideo)

    }

    componentWillUnmount() {

        window.removeEventListener('resize', this.resizeVideo)
        const { instance } = this.state
        if (instance) {
            instance.dispose()
        }

    }

}

export default Huifang