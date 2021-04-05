import React, { Component } from 'react';
import styled from 'styled-components'

const OrderHeader = styled.div`
  .header{
    background-color:white;
    height:1.133rem;
    border-radius: .133rem;    
  }
  .container{
    display:flex;
    flex-direction:row;
  }

  ul{
    font-weight:bold;
  }

  li{
    margin-top: .33rem;
    text-align:center;
    flex:1;
  }

  span{
    display:flex;
    width: 80%;
    border-bottom: 1px solid var(--theme-font-color);
    height:.5rem;
  }

  .onActive{
    color:var(--theme-font-color);
    // border-bottom:var(--theme-font-color) .027rem solid;
    // justify-content: space-between;

  }

`

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus:
        [
          { 'id': '01', 'content': '全部' },
          { 'id': '02', 'content': '待发货' },
          { 'id': '03', 'content': '待收货' },
          { 'id': '04', 'content': '已收货' },
          { 'id': '05', 'content': '售后' },
        ]
      ,
    }
  }


  allOrders() {
    const li = document.querySelector('.container>li')
    li.classList.remove('onActive')
  }

  delivered() {
    const li = document.querySelector('.container>li')
    li.classList.add('onActive')
    console.log('待发货')
  }

  received() {
    console.log('待收货')

  }

  peceipt() {
    console.log('已收货')

  }

  sale() {
    console.log('售后')

  }


  render() {


    return (
      <OrderHeader>
        <div className="header">
          <ul className="container">
            {/* {
                      this.orderStatus.map( (item,key) => {
                        return(
                        <li className="item" >{item.content}</li>
                        )
                      })
                  } */}
            <li className="item onActive" onClick={this.allOrders.bind(this)}>全部</li>
            <li className="item" onClick={this.delivered.bind(this)}>待发货</li>
            <li className="item" onClick={this.received.bind(this)} >待收货</li>
            <li className="item" onClick={this.peceipt.bind(this)}  >已收货</li>
            <li className="item" onClick={this.sale.bind(this)}  >售后</li>
          </ul>
        </div>

        <div style={{ display: this.state.orderStatus.id }}>
          {this.state.orderStatus.content}
        </div>

      </OrderHeader>
    );
  }
}

export default Header;