import React, { Component } from 'react';
import styled from "styled-components";
import {_offlinePayment} from 'network/profile'
import {store} from 'store/index'
import {Toast} from "antd-mobile";

const ResultStyle = styled.div`

#stores{
    border: none;
    background-color:white;
    margin:.2rem 0;
    margin-left: .2rem;
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
.content{
    margin:.2rem 0;
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

class OfflinePaymentResult extends Component {

  constructor(props) {
    super(props);
    this.state = {
        prepayData:{},
        stores:[],
        storeid:''
    }
    this.confirmSeccess = this.confirmSeccess.bind(this)
  }
  async  confirmSeccess(){
      const {amount,openid,memberid} = this.props.match.params
      const {uniacid,wxUserInfo} = store.getState.appConfig
      const confirmConfig = {
          action:'member_check',
          data:{
              uniacid,
              openid:openid,
              check_openid: wxUserInfo.openid,
              id:memberid,
              price:amount,
              orderno:this.state.prepayData.orderno,
              storeid:this.state.storeid,
              isDisabled:false
          }
      }
      let checkRes = await _offlinePayment(confirmConfig)

          if(checkRes.data.status === 200){
              Toast.info(checkRes.data.msg,2)
              this.setState({
                  isDisabled:true
              })

          }

    }

    async componentDidMount() {
        const {amount,openid,memberid} = this.props.match.params
        const offlinePaymentConfig = {
            action:'prepay',
            data:{
                uniacid:store.getState().appConfig.uniacid,
                openid:openid,// 付钱用户openid
                check_openid: store.getState().appConfig.wxUserInfo.openid,
                id:memberid,
                price:amount
            }
        }

        let prepayRes = await _offlinePayment(offlinePaymentConfig)
        if(prepayRes.data.status === 200){
            this.setState({
                prepayData:prepayRes.data.data,
                stores:prepayRes.data.data.stores
            })
        }else if(prepayRes.data.status === 400){
            Toast.info(prepayRes.data.msg,2)
          this.goHome =  setTimeout(() => {
           // this.props.history.replace('/home')
        },3000)
        }

    }

    selectedStore(e){
        let selected = document.getElementById('stores')
        let item = selected.options[selected.selectedIndex].value;
        this.setState({
            storeid:item
        })
    }

    componentWillUnmount() {
      clearTimeout(this.goHome)
    }

    render() {
        document.title = "线下收款核销";

        return (
        <ResultStyle>
            <div className="main">
                <div className="container">
                    <div className="top">
                        <div className="title">
                            <h3>线下收银凭证</h3>
                        </div>
                        <hr/>
                        <div className="content">
                            <p>订单号：{this.state.prepayData.orderno}</p>
                            <p>实付款：{this.state.prepayData.price}</p>
                            <p>收银员：{this.state.prepayData.hexiao_member}</p>
                            <select name="stores" id="stores" onChange={this.selectedStore.bind(this)}>
                                {
                                    this.state.stores.map((item,key) => {
                                        return(
                                            <option key={key+item.id} value={item.id}>{item.storename}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bottom">

                    <button disabled={this.state.isDisabled} onClick={this.confirmSeccess}>确认收款</button>
                    <button onClick={() => {this.props.history.push('/home')}}>返回首页</button>

                </div>

            </div>
        </ResultStyle>

     );
  }
}
 
export default OfflinePaymentResult;