import { requestPostS ,requestPost} from './request'
import {store} from 'store/index'



export function _wxConfig(config) {
  return requestPost({
    params: {
      action: config.action
    },
    data: config.data
  })
}

// 获取个人中心会员信息
export function _getMemberDetails(config) {
  return requestPostS({
    params: {
      action: config.action
    },
    data: config.data
  })
}


//-----注册会员
//  获取注册会员验证码
//  获取全部门店
export function _applyMemberShip(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

//-----会员信息
export function _MemberInfo(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

//-----付款码
export function _paymentCode(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

//----我的优惠券
export function _getCoupon(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

//----会员余额充值页面
export  function _memberCharge(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}
// 会员积分
export function _getMember(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 积分商城
export function _scoreMall(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 积分商品核销
export function _jfcheck(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 已兑换
export function _exchanged(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 功能开关控制（后台开关）

export function _controlSwitch(config){
  return requestPostS({
    params:{
      action:'kaiguan'
    },
    data:{
      uniacid:store.getState().appConfig.uniacid
    }
  })
}

// 我的地址
export function _address(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 查看我的地址
export function _showAddress(config){
  return requestPost({
    params:{
      action:config.action
    },
    data:config.data
  })
}


// 核销
export function _hexiaoDetail(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}


// 核销
export function _orderDetail(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}
// 我的团
export function _mygroup(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 转发抽奖
export function _forwardLottery(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}
// 积分兑换
export function _scoreExchange(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 兼职我的客户
export function _myteam(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 兼职我的推广
export function _mycashorder(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 线下收款
export function _offlinePayment(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}




// 会员注册门店头像以及名称
export function _uniacidDetail(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}




// 申请提现
export function _applywithdraw(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}
// 申请兼职
export function _plurApply(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}
// 我要提现页面数据获取

export function _iwantWithdraw(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}

// 提现记入
export function _WithdrawRecord(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}
// 提现记入
export function _parsenBg(config){
  return requestPostS({
    params:{
      action:config.action
    },
    data:config.data
  })
}