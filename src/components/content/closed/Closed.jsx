import React, { Component } from "react";
import styled from "styled-components";


const ClosedStyle = styled.div`

.container{
    display:flex;
    flex-direction:column;
    align-items: center;
    just-content:center;
    background-color: #212735;
}

.images{
        margin-top:3rem;
        width:5.15rem;
        height:3.79rem;
}
.images>img{
    width:100%;
    height:100%;
}

.content{
    margin-top:.6rem;
    text-align:center;
}

.content>p{
    font-size:0.48rem;
font-weight:bold;
color:rgba(255,255,255,1);
}

.content-bottom{
    font-size:0.4rem;
font-weight:500;
color:rgba(255,255,255,1);
opacity:0.5;
}

p{
    margin-top:.39rem;
}


.bottominfo{
    position:absolute;
    bottom:0;
    width:100vw;
}
.bottom>a>img{
    margin-left:-1rem;
    transform:scale(.6,.6);
}

`

class Closed extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {

        document.title = '店铺打烊了'

        return (
            <div>
                <ClosedStyle>
                    <div className="container">
                        <div className="images">
                            <img alt="" src='https://res.lexiangpingou.cn/images/vip/store_expiration.png' />
                        </div>

                        <div className="content">
                            <p>店铺服务已到期</p>
                            <div className="content-bottom">
                                <p>如需开通请联系火蝶云官方工作人员</p>
                                <p>开通咨询：400-626-1079</p>
                            </div>
                        </div>

                        <div className="bottominfo">
                            <div className="bottom" >
                                <a href="https://www.lexiangpingou.cn/web/index.php?">
                                    <img src='https://res.lexiangpingou.cn/images/vip/closedbottom.png' alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </ClosedStyle>
            </div>
        )
    }
}

export default Closed