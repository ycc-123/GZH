import React, { Component } from 'react'
import { _scoreExchange } from 'network/profile'
import { store } from 'store'
import { Modal, Toast } from "antd-mobile";

class ScroeGoodsItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodId: '',
            num: this.props.value.need_score_num,
            stock: this.props.value.need_score_num,
            stockNum: this.props.value.stockNum,
        }
        this.exchangeGoods = this.exchangeGoods.bind(this)
    }
    componentDidMount() {

        this.setState({
            goodId: this.props.msg,
            need_score_num: this.props.num,
            stock: this.props.stock
        })
    }

    exchangeGoods() {

        // 积分兑换
        const paymentScoreGoodsConfig = {
            action: 'scoreExchange',
            data: {
                uniacid: store.getState().appConfig.uniacid,
                openid: store.getState().appConfig.wxUserInfo.openid,
                exchangeType: 1,
                use_score: this.state.num,
                id: this.state.goodId
            }
        }
        _scoreExchange(paymentScoreGoodsConfig).then(res => {
            console.log(res)
            let member = res.data.msg
            Toast.info(member)
            if (res.data.status === 200) {
                window.location.reload();
            }
        })
    }

    render() {
        const { value } = this.props
        const alert = Modal.alert
        return (
            <div className='goodsa'>
                <div className='Goods'>
                    <div className='bai'>
                        <div className='aaaabbbb'><img className='crechang-goods' src={value.albumpath ? value.albumpath : 'https://res.lexiangpingou.cn/images/erp/erppos_no_goods_pic.png' } alt="" /></div>

                        <p className='goods_t'>{value.name}</p>
                        <p className='goods_k'>库存：{value.stock <= 0 ? "无限制" : value.stock}</p>
                        <div className='qqqq'>
                            <div className='goods_c'>{value.need_score_num}</div>
                            <div className='goods_jifeng'>&nbsp;积分</div>
                            <button className='goods_f'
                                onClick={() =>
                                    alert('兑换该商品', '', [
                                        { text: '取消', onPress: () => console.log('cancel') },
                                        { text: '确认', onPress: () => { this.exchangeGoods() } },
                                    ])
                                }
                            >兑换</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ScroeGoodsItem;