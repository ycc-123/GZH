import {
    SAVE_GOODS, SAVE_UNIACID, SAVE_APP_CONFIG, SAVE_DEFAULT_ADDRESS, SAVE_DEFAULT_COUPON,
    SHOW_LOADING, HIDE_LOADING, INCREMENT_GOODS, DECREMENT_GOODS, GET_DATA, IS_SELECT, SELECT_ALL, DELETE_CART_GOODS,
    CATEGORY_TITLE, CATEGORY_GOODS, CATEGORY_INDEX, SAVE_USER_INFO, SAVE_CONTROL_SWITCH, SAVE_MEMBER_USERINFO, SAVE_STORE,
    SAVE_BASEURL, SAVE_SUBMITDAN, SAVE_SUBMITTUAN, SAVE_SUBMITCART, LOCATION_INFO, Customer_Mall_Config
} from './actionTypes'


const defaultState = {
    controlSwitch: {},
    loading: false,
    goodsList: [],
    cartGoods: [],
    selectAll: true,
    totalPrice: 0,
    totalNumber: 0,
    categoryIndex: 0,
    categoryGoods: [],
    cartNumber: 0,
    defaultcoupon: '',
    baseurl: '',
    store: {
        storename: '未选择门店'
    },
    submitDan: {
        storename: '未选择门店'
    },
    submitTuan: {
        storename: '未选择门店'
    },
    submitCart: {
        storename: '未选择门店'
    },
    memberUserInfo: {
        // id: '514224'
        id: ''
    },
    defaultAddress: {},
    locationInfo: {},
    // 商城配置: 单双排 颜色主题等
    mallConfig: {},

    // 开发
    appConfig: {
        uniacid: 53,
        wxUserInfo: {
            openid: 'oCKOnuEaxr176_rHxqxjP_bzUlt0',
            lat: '27.770004',
            lng: '120.586943',
            enable: '1',
            member_status: '1',
            nickname: '面向百度啊带',
            id: "514496",
            headimgurl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/zReOqVLNMZRs8NuDIbvlKuA5udVnAeWB33x7iaic0F8PR5wZE4ZTmbPZ4Anxl8NTZvLXT681bEV6zSDW8ZV3qaicA/132'
        },
        isIOS: navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
        isApplet: false
    },
    userInfoWX: {
        openid: "oCKOnuEaxr176_rHxqxjP_bzUlt0",
        lat: '27.770004',
        lng: '120.586943',
        enable: '1',
        member_status: '1',
        id: "514459"
    },
    // 线上
    // appConfig: {
    //     uniacid: '',
    //     wxUserInfo: {
    //         openid: ''
    //     }
    // }
}


export default (state = defaultState, action) => {
    let newState = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        // 根据提交的方法type 进行不同的函数
        // 保存baseurl
        case SAVE_BASEURL:
            newState.baseurl = action.data
            return newState
        // 保存提交页门店
        case SAVE_SUBMITDAN:
            newState.submitDan = action.data
            return newState
        case SAVE_SUBMITTUAN:
            newState.submitTuan = action.data
            return newState
        case SAVE_SUBMITCART:
            newState.submitCart = action.data
            return newState
        // 保存首页门店
        case SAVE_STORE:
            newState.store = action.data
            return newState
        // 保存商品
        case SAVE_GOODS:
            newState.goodsList.push(action.data)
            return newState
        // 显示加载动画
        case SHOW_LOADING:
            newState.loading = true
            return newState
        // 隐藏加载动画
        case HIDE_LOADING:
            newState.loading = false
            return newState
        // 增加商品数量
        case INCREMENT_GOODS:
            newState.cartGoods[action.index].num += 1
            return newState
        // 减少商品数量
        case DECREMENT_GOODS:
            newState.cartGoods[action.index].num -= 1
            return newState
        // 获取数据
        case GET_DATA:
            newState.cartGoods = action.data.sort()
            return newState
        // 是否选择
        case IS_SELECT:
            newState.cartGoods[action.index].checked = !newState.cartGoods[action.index].checked
            return newState
        // 是否全选
        case SELECT_ALL:
            newState.selectAll = !newState.selectAll
            return newState
        // 删除购物车商品
        case DELETE_CART_GOODS:
            newState.cartGoods.splice(action.index, 1)
            return newState
        // 保存分类左侧数据
        case CATEGORY_TITLE:
            newState.categoryGoods = action.data
            return newState
        // 改变分类左侧索引
        case CATEGORY_INDEX:
            newState.categoryIndex = action.index
            return newState
        // 保存分类右侧数据
        case CATEGORY_GOODS:
            newState.categoryGoods[action.index]['data'] = action.data
            return newState
        // 保存用户wx 相关信息openid....
        case SAVE_USER_INFO:
            newState.userInfoWX = action.data
            return newState
        // 保存uniacid
        case SAVE_UNIACID:
            newState.appConfig = action.data
            return newState
        // 保存全局功能点开关
        case SAVE_CONTROL_SWITCH:
            newState.controlSwitch = action.data;
            return newState;
        // 保存会员信息
        case SAVE_MEMBER_USERINFO:
            newState.memberUserInfo = action.data;
            return newState;

        case SAVE_APP_CONFIG:
            newState.appConfig = action.data;
            return newState;

        case SAVE_DEFAULT_ADDRESS:
            newState.defaultAddress = action.data;
            return newState;

        case SAVE_DEFAULT_COUPON:
            newState.defaultcoupon = action.data;
            return newState;
        case LOCATION_INFO:
            return { ...state, locationInfo: action.location }
        case Customer_Mall_Config:
            return { ...state, mallConfig: action.config }
        default:
            break
    }
    return state
}