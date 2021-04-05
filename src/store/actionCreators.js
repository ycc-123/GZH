import {
  SAVE_GOODS, SAVE_UNIACID, SAVE_MODE, SAVE_APP_CONFIG, SAVE_DEFAULT_ADDRESS,
  SHOW_LOADING, HIDE_LOADING, INCREMENT_GOODS, DECREMENT_GOODS, GET_DATA,
  IS_SELECT, SELECT_ALL, DELETE_CART_GOODS, SAVE_MEMBER_USERINFO,
  CATEGORY_TITLE, CATEGORY_GOODS, CATEGORY_INDEX, SAVE_USER_INFO, SAVE_CONTROL_SWITCH, SAVE_STORE, SAVE_DEFAULT_COUPON,
  SAVE_BASEURL, SAVE_SUBMITDAN, SAVE_SUBMITTUAN, SAVE_SUBMITCART,
  LOCATION_INFO, Customer_Mall_Config
} from './actionTypes'

import { _api } from 'network/api'


/* 
 *
 *返回一个对象
 * 
 * 
*/

// 保存baseurl

export const saveBaseurl = data => ({
  type: SAVE_BASEURL,
  data
})

// 保存默认地址
export const saveDefaultAddressAction = data => ({
  type: SAVE_DEFAULT_ADDRESS,
  data
})

// 保存单买页地址
export const saveSubmitDanAction = data => ({
  type: SAVE_SUBMITDAN,
  data
})
// 保存拼团
export const saveSubmitTuanAction = data => ({
  type: SAVE_SUBMITTUAN,
  data
})
// 保存购物车
export const saveSubmitCartAction = data => ({
  type: SAVE_SUBMITCART,
  data
})

// 保存门店地址方法

export const saveStoreAction = data => ({
  type: SAVE_STORE,
  data
})
// 保存uniacid

export const saveUniacidAction = (data) => ({
  type: SAVE_UNIACID,
  data
})

export const saveModeAction = (data) => ({
  type: SAVE_MODE,
  data
})

// 保存mode

// 保存商品数据方法

export const saveGoodsAction = (data) => ({
  type: SAVE_GOODS,
  data
})

// 显示加载动画方法
export const showLoadingAction = () => ({
  type: SHOW_LOADING
})
// 隐藏加载动画方法
export const hideLoadingAction = () => ({
  type: HIDE_LOADING
})
// 增加商品数量方法
export const incrementAction = (index) => ({
  type: INCREMENT_GOODS,
  index
})
// 减少商品数量方法
export const decremnetAction = (index) => ({
  type: DECREMENT_GOODS,
  index
})
// 获取购物车数据方法
export const getCartDataAction = (data) => ({
  type: GET_DATA,
  data
})
// 保存优惠券ID
export const CouponAction = (data) => ({
  type: SAVE_DEFAULT_COUPON,
  data
})

// 改变购物车商品是否选中方法
export const changeCheckedAction = (index) => ({
  type: IS_SELECT,
  index
})
// 购物车是否全选方法
export const isSelectAllAction = () => ({
  type: SELECT_ALL
})
// 删除购物车商品方法
export const deleteCartGoodsAction = (index) => ({
  type: DELETE_CART_GOODS,
  index
})
// 保存分类左侧方法
export const saveCategoryTitleAction = (data) => ({
  type: CATEGORY_TITLE,
  data
})
// 保存分类右侧方法
export const saveCategoryGoodsAction = (index, data) => ({
  type: CATEGORY_GOODS,
  index,
  data
})
// 改变分类索引方法
export const changeCategoryIndexAction = (index) => ({
  type: CATEGORY_INDEX,
  index
})

export const saveUserInfoAction = (data) => ({
  type: SAVE_USER_INFO,
  data
})

// profile 保存全局功能开关判断条件
export const saveControlSwitchAction = (data) => ({
  type: SAVE_CONTROL_SWITCH,
  data
});

// 保存会员信息
export const saveMemberUserInfoAction = (data) => ({
  type: SAVE_MEMBER_USERINFO,
  data
});

export const saveAppConfigAction = (data) => ({
  type: SAVE_APP_CONFIG,
  data
})





/*
*
*
*
*/
export const Coupon = (data) => {
  return dispatch => {
    const action = CouponAction(data)
    dispatch(action)
  }
}

export const saveDefaultAddress = (data) => {
  return dispatch => {
    const action = saveDefaultAddressAction(data)
    dispatch(action)
  }
}

export const saveAppConfig = (data) => {
  return dispatch => {
    const action = saveAppConfigAction(data)
    dispatch(action)
  }
}

// 保存首页门店地址

export const saveStore = data => {
  return dispatch => {
    const action = saveStoreAction(data)
    dispatch(action)
  }
}

// 保存提交页的门店地址

export const saveSubmitStoreDan = data => {
  return dispatch => {
    const action = saveSubmitDanAction(data)
    dispatch(action)
  }
}

export const saveSubmitStoreTuan = data => {
  return dispatch => {
    const action = saveSubmitTuanAction(data)
    dispatch(action)
  }
}

export const saveSubmitStoreCart = data => {
  return dispatch => {
    const action = saveSubmitCartAction(data)
    dispatch(action)
  }
}


export const saveUniacid = (data) => {
  return dispatch => {
    const action = saveUniacidAction(data)
    dispatch(action)
  }
}

export const saveControlSwitch = (data) => {
  console.log('action ', data)
  return dispatch => {
    const action = saveControlSwitchAction(data)
    dispatch(action)
  }
}

export const saveMemberUserInfo = (data) => {
  return dispatch => {
    const action = saveMemberUserInfoAction(data)
    dispatch(action)
  }
}


// 购物车保存商品数量

export const getCartData = (data) => {
  console.log(data)
  data.map(item => {
    item.checked = true
    return item
  })
  return dispatch => {
    const action = getCartDataAction(data)
    dispatch(action)
  }
}

export const saveGoods = (data) => {
  return (dispatch) => {
    console.log(data)
    const action = saveGoodsAction(data)
    dispatch(action)
  }
}


// 商品选中时修改selected 并且判断全部商品是否选中
export const isSelectStore = (index) => {
  return (dispatch) => {
    const action = changeCheckedAction(index)
    dispatch(action)
  }
}
// 删除商品时
export const isDeleteGoods = (index) => {
  return (dispatch) => {
    const action = deleteCartGoodsAction(index)
    dispatch(action)
  }
}
// 减少商品数量
export const isDecrementGoods = (index) => {
  return (dispatch) => {
    const action = decremnetAction(index)
    dispatch(action)
  }
}
// 增加商品数量
export const isIncrementGoods = (index) => {
  return (dispatch) => {
    const action = incrementAction(index)
    dispatch(action)
  }
}

export const saveUserInfo = (data) => {
  return (dispatch) => {
    const action = saveUserInfoAction(data)
    dispatch(action)
  }
}

// export const setupMallConfig = config => {
//   return dispatch => {
//     const action = setupMallConfigAction(config)
//     dispatch(action)
//   }
// }

// 设置商城自定义颜色
export const setupMallConfig = config => ({
  type: Customer_Mall_Config,
  config
})

/*
  *
  *
  * 分类
  * 
  * 
*/
// 保存左侧标题
export const saveCategoryTitle = (data) => {
  return (dispatch) => {
    const action = saveCategoryTitleAction(data)
    dispatch(action)
  }
}
// 改变分类左侧的索引
export const changeCategoryIndex = (index) => {
  return (dispatch) => {
    const action = changeCategoryIndexAction(index)
    dispatch(action)
  }
}
// 存放分类右侧数据
export const saveCategoryGoods = (index, data) => {
  return (dispatch) => {
    const action = saveCategoryGoodsAction(index, data)
    dispatch(action)
  }
}


export const saveLocationInfoAction = location => ({
  type: LOCATION_INFO,
  location
})

export const saveLocationInfo = location => ({
  type: LOCATION_INFO,
  location
})


