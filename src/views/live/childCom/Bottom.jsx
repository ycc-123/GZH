import React, { Component } from "react";
import styled from "styled-components";
import { store } from "store/index";
import { Toast } from "antd-mobile";
import { DianZangStyle } from '../style/livestyle'
import { _chatRoom } from "../../../network/live";


const BottomStyle = styled.div`
.bottomBox{
  // z-index:300;
  position: fixed;
  bottom: 1.3rem;
  // width: 100vw;
  // height: 8.89rem;
}

.bottom{
  position: fixed;
  bottom: 1.3rem;
  left: .33rem;
}

.bottomContent{
   width:95vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-top:.5rem;
}

.inputSomeThing>input{
  
  width: 4.87rem;
  height: 1rem;
  background:rgba(7,0,2,.3);
}

.report>img{
    margin-left:.71rem;
    // border-radius: .4rem;
    // display: block;
    // background:rgba(7,0,2,.3);
    width: .77rem;
    height: .77rem;
}
.forward{
  margin-left:.72rem;
  border-radius: .4rem;
  background:rgba(7,0,2,.3);
  width: .77rem;
  height: .77rem;
  text-align: center;
}
.forward>img{
    width:100%;
    height:100%;
}

.dianzang>div>p{
  // width: .83rem;
  // height: .41rem;
  position: absolute;
  bottom: .88rem;
  font-weight: 500;
  color:rgba(254,254,254,1);
  font-size: .27rem;
  background-color: red;
  border-radius: .2rem;
}

.dianzang>div{
  // padding-top:.31rem ;
  margin-left:.72rem;
  border-radius: .4rem;
  background:rgba(7,0,2,.3);
  width: .77rem;
  height: .77rem;
  // text-align: center;
}
.dianzang>div>img{
    width:100%;
    height:100%;
}

.dianzannum{
    border: red solid .027rem;
    background: red;
    border-radius: .2rem;
    width: .8rem;
    position: absolute;
    top: 0rem;
    color: white;
    text-align: center;
    right: 0rem;
}


input::-webkit-input-placeholder{ 
 /* WebKit browsers */ 
color: rgba(255,255,255,.7);
 
}

.reportReal{
   width:2.4rem;
   height:.69rem;
   position:absolute;
   top: -.2rem;
   left: 6.222rem;
   display:none;
}
.reportReal>span{
    position:absolute;
    color:white;
    left:1rem;
}

`

const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)


class Bottom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sendMsg: '',
            userList: {},
            allMsg: [],
            dianzangnum: 0,
            showReport: false,
            normal: true,
            windowHeight: window.innerHeight
        }

        this.STIdianzang = null

        this.count = 0

        this.flag = 1 // 一场举报一次
        this.sayHello = this.sayHello.bind(this)
        const { appConfig } = store.getState()
        const { memberUserInfo } = store.getState()
        let memberid = memberUserInfo.id
        const { uniacid } = appConfig
        const { openid } = appConfig.wxUserInfo
        this.newUniacid = uniacid
        this.newMemberid = memberid

        this.networkConfig = {
            dianZang: {
                op: "LiveAddMemberZan",
                uniacid,
                memberid,
                zannum: 1,
            },
            liveGoodsList: {
                action: 'shopajax_pub',
                data: {
                    uniacid,
                    openid,
                    page: 1,
                    pagesize: 90
                }
            }

        }

    }

    render() {

        const { normal, handelHeight } = this.state
        const bottom = '1.28rem'
        console.log(bottom, '按钮距离底部距离')
        return (
            <BottomStyle>
                <div className='bottomBox'>
                    <div className="bottom" style={{ bottom }}>
                        <div className="bottomContent">
                            <div className="inputSomeThing">
                                <input id="sendMsg" onChange={this.changeMsg.bind(this)} name="sendMsg"
                                    onBlur={this.onInputOut}
                                    value={this.state.sendMsg} enterkeyhint="send" style={{
                                        color: "white",
                                        borderRadius: ".4rem",
                                        border: "none",
                                        textAlign: "center"
                                    }}
                                    placeholder="说点什么..." />

                            </div>


                            <div className="forward" onClick={this.sayHello}>
                                <img
                                    src='https://res.lexiangpingou.cn/images/vip/chatsend.png'
                                    alt="发送" />
                            </div>

                            <div className="reportReal" id="reportReal" >
                                <img src='https://res.lexiangpingou.cn/images/vip/jubaobac.png' width="100%" height="100%" alt="" />
                                <span onClick={this.liveForward.bind(this)}>举报</span>
                            </div>

                            <div className="report" onClick={this.isReportShow}>
                                <img
                                    src='https://res.lexiangpingou.cn/images/53/2020/01/lO42ocddU626ooDCDMS26nOXLdm2DC.png'
                                    alt="" />
                            </div>

                            <DianZangStyle>
                                <div ref="praise_bubbles" className="praise_bubble">
                                </div>
                            </DianZangStyle>
                            <div className="dianzannum">
                                {this.state.dianzangnum}
                            </div>
                            <div className="dianzang" onClick={this.addPraise.bind(this)}>
                                <div>
                                    <img
                                        src='https://res.lexiangpingou.cn/images/vip/livedianzang.png'
                                        alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BottomStyle>
        )
    }

    isReportShow = () => {
        let cssStyle = this.state.showReport ? 'block' : 'none'
        let el = document.getElementById('reportReal')
        el.style.display = cssStyle
        this.setState({
            showReport: !this.state.showReport
        })
    }

    onInputOut = () => {
        // 兼容ios 软键盘升起，可视高度不回落
        window.scroll(0, 0)
    }

    async addPraise(praiseBubble) {
        // await _chatRoom(this.networkConfig.dianZang)
        this.setState({
            dianzangnum: this.state.dianzangnum + 1
        }, () => {
            this.count += 1
            const b = Math.floor(Math.random() * 6) + 1;
            const bl = Math.floor(Math.random() * 11) + 1; // bl1~bl11
            let d = document.createElement("div");
            d.className = `bubble b${b} bl${bl}`;
            d.dataset.t = String(Date.now());
            this.refs.praise_bubbles.appendChild(d);
        })
        // praiseBubble.appendChild(d)
    }

    liveForward() {
        if (this.flag === 1) {
            Toast.info('举报成功', 2)
            this.flag++
            this.isReportShow()
        } else {
            Toast.info('请不要重复举报', 2)
            this.isReportShow()
        }
    }

    sayHello() {
        let content = this.state.sendMsg
        if (content !== "") {
            this.props.speaking(content)
            this.setState(
                { sendMsg: '' },
                () => {
                }
            )
        } else {
            Toast.info("请输入聊天信息", 2)
        }
    }

    changeMsg(e) {
        let name = e.target.name
        let value = e.target.value
        this.setState({
            [name]: value
        })
    }

    componentDidMount() {

        document.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('resize', this.resizeVideo)

        if (this.props.liveStatus === 'on') {
            const zan_config = {
                op: "LiveAddMemberZan",
                uniacid: this.newUniacid,
                memberid: this.newMemberid,
                zannum: 0,
            }
            _chatRoom(zan_config).then(res => {
                if (parseInt(res.data.status === 200)) {
                    this.setState({
                        dianzangnum: Number(res.data.zan)
                    })
                }
            })
            this.STIdianzang = setInterval(() => {
                const dianzangConfig = {
                    op: "LiveAddMemberZan",
                    uniacid: this.newUniacid,
                    memberid: this.newMemberid,
                    zannum: this.count,
                }
                _chatRoom(dianzangConfig).then((res) => {
                    if (parseInt(res.data.status) === 200) {
                        this.count = 0
                        this.setState({
                            dianzangnum: Number(res.data.zan)
                        })
                    }
                })
            }, 10000)
        }
    }

    onKeyDown = (e) => {
        switch (e.keyCode) {
            case 13:
                this.sayHello()
                break;

            default:
                break;

        }
    }

    resizeVideo = () => {
        if (!ver) {
            const { normal, windowHeight } = this.state
            // console.log(window.innerHeight, '改变后的高度')
            this.setState({
                normal: !normal,
                handelHeight: windowHeight - window.innerHeight
            }, () => { console.log(this.state.handelHeight, '改变的高度') })
        }
    }


    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('resize', this.resizeVideo)

        clearInterval(this.STIdianzang)
    }
}

export default Bottom

