import React, { Component } from "react"
import { withRouter } from 'react-router-dom'

class MemberInfoItem extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    seeDetail = () => {
        this.props.seeConsumptionDetail(this.props.item)
    }

    render() {
        const { item } = this.props
        return (
            <div className='order' onClick={this.seeDetail}>
                <div className='order_title'>
                    <div>
                        <span className='odd'>订单号：</span>
                        <span className='yard'>{item.orderno}</span>
                    </div>

                    <div>
                        <button className='store'>{item.type}</button>
                        {item.statusname && <button className='retreat'>{item.statusname}</button>}
                    </div>
                </div>
                <div className='xian1'></div>

                {item.goods.map((item, index) => {
                    return (
                        <div className='qqq' key={item.id + index}>
                            <div className='order_footer'>
                                <img className='guo1' src={item.gimg} alt="" />
                                <div className='order_footer_wen'>
                                    <p className='order_footer_wen_title'>{item.gname}</p>
                                    <p className='order_footer_wen_time'>{item.createtime}</p>
                                </div>
                            </div>

                        </div>
                    )
                })}

                <span className='money'>
                    <div>- ￥{item.price}</div>
                    <div>+ ￥{item.refund}</div>
                </span>

            </div>
        )
    }

}
export default withRouter(MemberInfoItem)