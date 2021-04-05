import {requestLive,requestPostS} from './request'

// 新接口
export function _lives(config) {
    return requestPostS({
        params:{
            action:config.action
        },
        data:config.data,

    })
}

// 旧
export function _live(config) {
    return requestLive({
        params: config,

    })
}

// 聊天室
export function _chatRoom(config) {
    return requestLive({
        params: config
    })
}

// 直播回放
export function _liveHui(config) {
    return requestPostS({
        params:{
            action:config.action
        },
        data:config.data

    })
}