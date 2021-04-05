import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom"

class GroupItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { value } = this.props
        console.log(value)
        return (
            <div>
                <div className='MygroupContainer'>
                    <div className='MygroupContainer_order'>
                        <div>
                            <span >组单号:</span>
                            <span>{value.tuan_id}</span>
                        </div>
                        <div><span className='MygroupContainer_time'>{value.ptime}</span></div>
                    </div>
                    <div className='MygroupContainer_c'>
                        <div className='MygroupContainer_c_l'>
                            <img src={value.gimg} alt="" />
                        </div>

                        <div className='MygroupContainer_c_t'>
                            <p className='title'>{value.gname}</p>
                            <p className='guige'><span><span>规格:{value.optionname ? value.optionname : '无'}</span></span><span><span className='count'>x{value.gnum}</span></span></p>
                            <p className='jiage'><span>成团价:￥{value.price}/{value.unit}</span></p>
                        </div>
                        <div className='shifu'><span className='kuan'>实付款￥{value.group_price}</span></div>
                        {value.groupstatus === '1' && <img className='c-img' alt='' src='https://res.lexiangpingou.cn/images/vip/detailfail.png' />}
                        {value.groupstatus === '2' && <img className='c-img' alt='' src='https://res.lexiangpingou.cn/images/vip/detailsuccess.png' />}
                        {value.groupstatus === '3' && <img className='c-img' alt='' src='https://res.lexiangpingou.cn/images/vip/20201127/isgrouptime.png' />}
                    </div>
                    <div className='MygroupContainer_f'>
                        <button className='btn' onClick={this.goGroup}>团详情</button>
                    </div>
                </div>
            </div>
        )


    }

    goGroup = () => {
        this.props.history.push(`/group/${this.props.value.tuan_id}`)
    }
}

export default withRouter(GroupItem)