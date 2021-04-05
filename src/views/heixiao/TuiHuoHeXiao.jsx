import React, { Component } from 'react'
import styled from 'styled-components'
import { store } from 'store/index'
import { _orderAction } from 'network/order'
import { Toast } from "antd-mobile";

class TuiHuoHeXiao extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: true,
            hexiaoDetail: {},
            storeid: '',
            priceValue: '',
            refundType: ''
        }
        const { orderno } = this.props.match.params
        const { appConfig } = store.getState()
        const { uniacid } = appConfig
        const { openid } = appConfig.wxUserInfo
        this.networkConfig = {
            hexiaoDetail: {
                action: 'hexiaoDetail',
                data: {
                    uniacid,
                    openid,
                    orderno,

                }
            },
            confirmHeXiao: {
                action: 'hexiao',
                data: {
                    uniacid,
                    orderno,
                    openid,
                    storeid: '',
                    collect_id: '',
                    retreat: 1,
                    refundType: '', //退款类型 【0部分退款 1全额退款 2只退定金 3只退补款】 默认为0
                    price: '', // 退款金额
                }
            }
        }
    }
    render() {
        const { hexiaoDetail } = this.state
        return (
            <ZitiHexiaoStyle>
                {hexiaoDetail.stores && <div className="zongkuang">
                    <div className="zitihexiaotopframe">
                        <div className="zitihexiaotoptext"  >实际提货点</div>
                        <div className="zitihexiaokuang">
                            <div className="zitihexiaotoptext2">
                                <select id="selectNewStore" style={{ border: 'none', backgroundColor: 'white' }} onChange={this.selectNewStore}>
                                    <option value="">请选择实际自提点</option>
                                    {
                                        hexiaoDetail.stores.map((item, key) => {
                                            return (
                                                <option value={item.id} key={key + item.id}>{item.storename}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="zitihexiaotopframe">
                        <div className="zitihexiaotoptext"  >退款类型</div>
                        <div className="zitihexiaokuang">
                            <div className="zitihexiaotoptext2">
                                <select id="tuikuanleixing" style={{ border: 'none', backgroundColor: 'white' }} onChange={this.selectTuiType}>
                                    <option value="">请选择退款类型</option>
                                    <option value="0">部分退款</option>
                                    <option value="1">全额退款</option>

                                </select>
                            </div>
                        </div>
                    </div>


                    <div className="zitihexiaotopframe">
                        <div className="zitihexiaotoptext"  >退款金额</div>
                        <div className="zitihexiaokuang">
                            <div className="zitihexiaotoptext2" >
                                <input name="priceValue" onBlur={this.tipPrice} value={this.state.priceValue} onChange={this.handelChange} style={{ border: 'none' }} type="text" placeholder="点击输入退款金额" />
                            </div>
                        </div>
                    </div>


                    <div className="zitihexiaoframe">
                        <div className="zitihexiaotex1">到店退货核销凭证</div>
                        <div className="xiantiao"></div>
                        <div className="zitidingdanframe">
                            <div className="dingdanframe">
                                <div className="dingdantext1">订单号</div>
                                <div className="dingdantext2">{hexiaoDetail.orderno}</div>
                            </div>
                            <div className="dingdanframe">
                                <div className="dingdantext1">团长</div>
                                <div className="dingdantext2">{hexiaoDetail.tuan_first_name}</div>
                            </div>
                            <div className="dingdanframe">
                                <div className="dingdantext1">提货人</div>
                                <div className="dingdantext2">{hexiaoDetail.addname}</div>
                            </div>
                            <div className="dingdanframe">
                                <div className="dingdantext1">提货点</div>
                                <div className="dingdantext2">{hexiaoDetail.store.storename}</div>
                            </div>
                        </div>
                        <div className="xiantiao"></div>


                        <div style={{ padding: "0 0.4rem" }}>

                            {
                                hexiaoDetail.goods.map((item, key) => {
                                    return (
                                        <div className="wupinframe" key={key + item.id}>
                                            <img className="wupinimg" alt='' src={item.gimg} />
                                            <div className="wupintextframe">
                                                <div className="wupintext1">{item.gname}</div>
                                                <div className="wupintextframe2">
                                                    <div>规格:{item.item}</div>
                                                    <div>x{item.gnum}</div>
                                                </div>
                                                <div className="wupintext2">￥{item.oprice}</div>
                                            </div>
                                            {/*<img className="wupinimg2" alt=''/>*/}
                                        </div>
                                    )
                                }
                                )
                            }


                        </div>

                        <div className="zitijineframe">
                            <div className="zitijinetextk">
                                <div className="zitijinetext1">优惠金额</div>
                                <div className="zitijinetext2">{hexiaoDetail.discount_fee ? hexiaoDetail.discount_fee : '0'}元</div>
                            </div>
                            <div className="zitijinetextk">
                                <div className="zitijinetext1">运费金额</div>
                                <div className="zitijinetext2">{Number(hexiaoDetail.freight) < 0 ? '0' : hexiaoDetail.freight}元</div>
                            </div>
                            <div className="zitijinetextk">
                                <div className="zitijinetext1">支付金额</div>
                                <div className="zitijinetext2">{hexiaoDetail.pay_price}元</div>
                            </div>
                        </div>

                    </div>

                    <div className="btnframe">
                        <button className="btn1" onClick={() => { this.props.history.push('/home') }}>返回首页</button>
                        <button className="btn2" onClick={this.confirmHeXiao}>确认退款</button>
                    </div>

                </div>}
            </ZitiHexiaoStyle>
        )
    }

    async componentDidMount() {
        let hexiaoDetailRes = await _orderAction(this.networkConfig.hexiaoDetail)
        this.setState({
            hexiaoDetail: hexiaoDetailRes.data.data[0]
        })
    }

    tipPrice = () => {

        console.log('aa', typeof (this.state.priceValue), typeof (this.state.hexiaoDetail.pay_price))

        if (Number(this.state.priceValue) > Number(this.state.hexiaoDetail.pay_price)) {
            Toast.info('退款金额不能大于实际支付金额', 2)
        }
    }

    handelChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    selectTuiType = () => {
        let el = document.getElementById('tuikuanleixing')
        this.setState({
            refundType: el.value
        })
    }

    selectNewStore = () => {
        let el = document.getElementById('selectNewStore')
        this.setState({
            storeid: el.value
        })
    }

    confirmHeXiao = async () => {

        this.networkConfig.confirmHeXiao.data.storeid = this.state.storeid
        this.networkConfig.confirmHeXiao.data.refundType = this.state.refundType
        this.networkConfig.confirmHeXiao.data.price = this.state.priceValue
        if (this.state.storeid === '') {
            Toast.info('请先选择实际自提点', 2)
        } else if (this.state.priceValue === '') {
            Toast.info('请填写退款金额', 2)
        } else if (this.state.refundType === '') {
            Toast.info('请选择退款类型', 2)
        }
        else {
            let hexiaoRes = await _orderAction(this.networkConfig.confirmHeXiao)
            if (hexiaoRes.data.status === 200) {
                Toast.success(hexiaoRes.data.msg)
            } else {
                Toast.fail(hexiaoRes.data.msg)
            }
        }
    }
}

const ZitiHexiaoStyle = styled.div`

.selectNewStore{
    
    position: absolute;
   top: 30rem;
   background-color:white;
   width:100vw;
   height:50vh;
    
}

.zongkuang{
  padding:0 0.32rem;
}
.zitihexiaotopframe{  
  display:flex;
  justify-content:space-between;
  padding:0 0.32rem;
  width:100%;
  height:1.2rem;
  line-height:1.2rem;
  background:white;
  border-radius:0.1rem;
  margin:0.15rem 0;
}

.zitihexiaotoptext{
  display:flex;
  align-items:center;
  font-size:0.4rem;
  font-weight:600;
}
.zitihexiaokuang{
  display:flex;
  align-items: center;
}
.zitihexiaotoptext2{
  font-size:0.32rem;
  color:#CCC;
  margin-right:0.17rem;
}
.zitihexiaotopimg{
  width:0.27rem;
  height:0.27rem;
  background:black;
}
.zitihexiaoframe{
  widht:100%;
  height:11.87rem;
  background:white;
  border-radius:0.1rem;
}
.zitihexiaotex1{
  width:100%;
  height:2rem;
  line-height:2rem;
  font-size:0.5rem;
  font-weight:600;
  text-align:center;
}
.xiantiao{
  width:100%;
  height:0.01rem;
  background:#CCC;
}
.zitidingdanframe{
  padding:0.4rem 0.4rem 0 0.4rem;
  width:100%;
  height:3.13rem;
}
.dingdanframe{
  display:flex;
  justify-content:space-between;
  margin-bottom: 0.25rem;
}
.dingdantext1{
  font-size:0.32rem;
  font-weight:600;
}
.dingdantext2{
  font-size:0.32rem;
  color:#CCC;
}
.wupinframe{
  display:flex;
  align-items:center;
  width:100%;
  height:2.13rem;
  border-bottom:0.01rem solid #DA6D33;
  position:relative;
}
.wupinframexu{
  display:flex;
  align-items:center;
  width:100%;
  height:2.13rem;
  border-bottom:0.01rem dashed #CCC;
}
.wupinimg{
  width:1.33rem;
  height:1.33rem;
  background:red;
  margin-right:0.4rem;
}
.wupintextframe{
  width:calc(100vw - 3.17rem);
}
.wupintextframe2{
  display:flex;
  justify-content:space-between;
  color:#CCC;
  font-size:0.32rem;
}
.wupintext1{
  font-size:0.32rem;
  font-weight:600;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.wupintext2{
  font-size:0.32rem;
  color:red;
}
.wupinimg2{
  width:0.53rem;
  height:0.53rem;
  // background:red;
  position:absolute;
  bottom:0;
  right:0;
}
.zitijineframe{
  width:100%;
  height:2.4rem;
  padding:0 0.4rem;
}
.zitijinetextk{
  display: flex;
  justify-content: space-between;
  margin-top: 0.3rem;
}
.zitijinetext1{
  font-size:0.32rem;
  font-weight:600;
}
.zitijinetext2{
  font-size:0.32rem;
  color:#CCC;
}
.btnframe{
  display:flex;
  justify-content:space-between;
  margin-top:1.33rem;
}
.btn1{
  width:4.53rem;
  height:0.93rem;
  line-height:0.93rem;
  text-align:center;
  background:white;
  font-size:0.4rem;
  font-weight:600;
  border-radius:0.2rem;
}
.btn2{
  width:4.53rem;
  height:0.93rem;
  line-height:0.93rem;
  text-align:center;
  background:var(--theme-font-color);
  font-size:0.4rem;
  font-weight:600;
  border-radius:0.2rem;
  color:white;
}
`
export default TuiHuoHeXiao;