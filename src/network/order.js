import {requestPostS} from './request'

export function _orderAction(config){
    return requestPostS({
        params:{
            action:config.action
        },
        data:config.data
    })
}

// 获取全部订单
export function _getOrderList(config){
    return requestPostS({
        params:{
            action:config.action
        },
        data:config.data
    })
}

// 订单详情
export function _getOrderDetail(config){
    return requestPostS({
        params:{
            action:config.action
        },
        data:config.data
    })
}

// 获取评价页面
export function _evaluationPage(config){
    return requestPostS({
        params:{
            action:config.action
        },
        data:config.data
    })
}

// 评论提交
export function _evaluationSub(config){
    return requestPostS({
        params:{
            action:config.action
        },
        data:config.data
    })
}

// 评论提交
export function _getorderList(config){
    return requestPostS({
        params:{
            action:config.action
        },
        data:config.data
    })
}