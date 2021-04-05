import React, { Component } from "react";
import BetterScroll from "common/betterScroll/BetterScroll";
import styled from "styled-components";

const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)



const ChatRoomStyle = styled.div`
.chatContainer{
    // z-index:400;
    height:6.08rem;
    width:6.72rem;
    position:absolute;
    // bottom:4.07rem;
    bottom:2.5rem;
    left:.33rem;
    // border:solid red .027rem;
}
.chatroom{
  // position: relative;
  // top: 8.07rem;
  // left: .33rem;
  display: flex;
  flex-direction: column;
}
.chatroom>p{
    color:rgba(255,255,255,.7) ;
    padding: .125rem .22rem ;
    border-radius: .4rem;
    background:rgba(7,0,2,.3);
    margin-bottom: .13rem;
}


.whoInRoom{
  // width: 3.5rem;
  color:rgba(255,255,255,.7) ;
  padding: .125rem .22rem ;
  border-radius: .4rem;
  // background:rgba(7,0,2,.5);
  margin-bottom: .13rem;
}
`


class ChatRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            normal: true
        }
    }


    render() {
        const { normal } = this.state

        const height = normal ? '6.08rem' : '5.38rem'
        const bottom = normal ? '2.5rem' : '1.3rem'

        const scollConfig = {
            probeType: 1
        }
        const chatScrollStyle = {
            top: '.8rem',
            height: '4.5rem'
        }
        return (
            <ChatRoomStyle>
                <div className="chatContainer" style={{ height, bottom }}>

                    {/*聊天室*/}
                    <div className="chartroom">
                        <div className="whoInRoom">
                            {this.props.loginName}
                        </div>

                        <BetterScroll style={chatScrollStyle} config={scollConfig} ref="chatScroll">
                            <div className="chatroom" id="chatroom" ref="chatRoom">
                                {this.props.saycontent.map((item, key) => {
                                    return (
                                        <p key={key + '9'}>{item}</p>
                                    )
                                })}
                            </div>
                        </BetterScroll>
                    </div>

                </div>
            </ChatRoomStyle>
        )
    }


    componentDidMount = () => {
        window.addEventListener('resize', this.resizeVideo)
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.resizeVideo)
    }

    resizeVideo = () => {
        if (!ver) {
            const { normal } = this.state
            this.setState({
                normal: !normal
            })
        }
    }


    scrollTo = () => {
        let elHeight = document.getElementById('chatroom').offsetHeight
        let scrollHeight = this.refs.chatScroll.refs.wrapper.offsetHeight
        let cha = scrollHeight - elHeight
        if (elHeight >= scrollHeight) {
            this.refs.chatScroll.BScroll.scrollTo(0, cha, 1000)
        }
    }

    componentDidUpdate() {
        this.scrollTo()
        this.refs.chatScroll.BScroll.refresh()
    }

    // getSnapshotBeforeUpdate(prevProps, prevState) {
    //     this.scrollTo()
    //     this.refs.chatScroll.BScroll.refresh()
    // }

}

export default ChatRoom