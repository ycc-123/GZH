import React, { Component } from "react";
import styled from "styled-components";

const LiveHeaderStyle = styled.div`   
.liveHeader{
  color: white;
  width: 90vw;
  height: 1.8rem;
  position: fixed;
  left: .33rem;
  top: .52rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // background-color: #ECECEE;
}
.avatar>img{
  width: 1.04rem;
  height: 1.04rem;
  border-radius: 1rem;
}
.avatar{
  border-radius: 1rem;
    width:3.97rem; // + .3
    height:1.03rem;
    background:rgba(7,0,2,.3);
    border-radius:1rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
}
.avatarLeft{
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-around;
    padding-right: .4rem;
    // padding: 0 .4rem;
}
.uniacName{
    font-size:.29rem;
    font-weight: bold;
}
.onlineNumber{
    font-size:.29rem;
}

`

class LiveAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <LiveHeaderStyle>
                <div className="liveHeader">
                    <div className="avatar">
                        <img
                            src={this.props.uniacImg.headimgsrc ? this.props.uniacImg.headimgsrc : require('assets/img/default-t.png')} 
                            alt="" />
                        <div className="avatarLeft">
                            <p className="uniacName">{this.props.uniacImg.name}</p>
                            <p className="onlineNumber">{this.props.userMember}人在线</p>
                        </div>
                    </div>
                </div>
            </LiveHeaderStyle>
        )
    }




}

export default LiveAvatar