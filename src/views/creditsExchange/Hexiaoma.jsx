import React, { Component } from 'react'
import styled from 'styled-components'
import jsBarCode from 'jsbarcode'
import QRCode from 'qrcodejs2'

const scrollStyle = {
    height: 'calc(100vh -.5rem)',
    padding: '.4rem .32rem',
}
const MemberStyle = styled.div`
.hearder{
    width: 100%;
    height: 15rem;
    background-color: #fff;
    border-radius: .2rem;
}

.huiyuanfu{
    display:flex;
    align-items:center;
    justify-content: center;
    height:2.5rem;
    line-height:2.5rem;
    font-size:.9rem;
    // font-weight:600;
}
.xian{
    height:1px;
    width:100%;
    background-color: #ddd;
}


.footer{
    height:3rem;
    line-height:3rem;
    align:center;
    display:flex;
    align-items:center;
    justify-content: center;
}
.btn{
    width: 4rem;
    height: 1rem;
    background-color: #fa5151;
    color:#fff;
    border-radius: .2rem;
}

.imgma div{
    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
}
.imgma>div>p{
    letter-spacing: .18rem;
}
.ss{


    margin-left: .2rem;
}
.ma1{
    margin-top:1rem;
    height: 3rem;
    margin-left: .2rem;
    object-fit: cover;
    
}
.ma2{
    margin-top:1rem;
    height: 4rem;
    margin-left: .2rem;
    object-fit: cover;
}
.fukuanma{
    margin-top:1rem;
    display:flex;
    font-size:.5rem;
    color:var(--theme-font-color);
    display:flex;
    align-items:center;
    justify-content: center;

}
.fukuanma img{
    height:.5rem;
    margin-top: .2rem;
    margin-right: .1rem;
    object-fit: cover;
}

.shuaxin{
    color:#a3a3a3;
    font-size:.35rem;
    display:flex;
    align-items:center;
    justify-content: center;
    margin-top:.3rem;
}
`

// 付款码页面

export default class Hexiaoma extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: this.props.match.params.id
        }
        this.updateCode = this.updateCode.bind(this)
    }

    componentDidMount() {
        this.updateCode()
    }

    updateCode() {
        let Case = this.refs.qcrcode
        Case.innerHTML = ''
        let code = this.state.code
        let refBarCode = this.refs.barcode
        jsBarCode(refBarCode, code, {
            format: "CODE128",//选择要使用的条形码类型 
            width: 1.9,//设置条之间的宽度
            height: 100,//高度
            displayValue: false,//是否在条形码下方显示文字
            font: "fantasy",//设置文本的字体
            textAlign: "center",//设置文本的水平对齐方式
            textPosition: "black",//设置文本的垂直位置
            textMargin: 6,//设置条形码和文本之间的间距
            fontSize: 20,//设置文本的大小
            background: "white",//设置条形码的背景
            lineColor: "#474747",//设置条和文本的颜色。
            margin: 10//设置条形码周围的空白边距
        })

        let baseurl = window.location.href
        let qwe = baseurl.replace(/(#\/\w\w\w\w\w\w\w\w)/i, '#/Hexiaoyuan')

        let QRCcode = new QRCode('qcrcode', {
            width: 150,
            height: 150,
            text: qwe,
        })
    }

    render() {


        return (
            <MemberStyle>
                <div style={scrollStyle}>
                    <div className='hearder' >
                        <div className='huiyuanfu'>积分商品兑换</div>

                        <div className='xian'></div>
                        <div className='imgma'>
                            <div >
                                <img ref='barcode' className='ma1' alt="条形码" />
                                <p>{this.state.code}</p>
                            </div>
                            <div ><div ref='qcrcode' id='qcrcode' className='ma2'></div></div>
                        </div>

                        <div className='fukuanma'>
                        </div>
                    </div>
                </div>
            </MemberStyle>
        )
    }
}

