import React from 'react'
import { HashRouter as Router, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

import { withPVUV } from 'commons/pvuv'


import Home from 'views/home/Home'
import Cart from 'views/cart/Cart'
import Category from 'views/category/Category'
import Live from 'views/live/Live'
import LiveOver from 'views/live/childCom/LiveOver'
import Profile from 'views/profile/Profile'
import Detail from 'views/detail/Detail'
import Submit from 'views/submit/Submit'
import SubmitStore from 'views/submit/childCom/SubmitStore'
import Pay from 'views/pay/Pay'
//import Share from 'content/share/Share'
import HomeShare from 'views/home/childCom/HomeShare'
import DetailShare from 'views/detail/childCom/DetailShare'
import PaySuccess from 'views/pay/childCom/PaySuccess'
import Store from 'content/store/Store'
import Order from 'views/order/Order'
import OrderDetail from 'views/order/detail/OrderDetail'
import OrderEvaluate from 'views/order/detail/OrderEvaluate'
import Group from 'views/group/Group'
import Notice from 'views/notice/Notice'
import DetailStore from 'views/detail/childCom/DetailStore'
import ReceiveCoupon from 'views/coupon/ReceiveCoupon'
import AnnualReport from 'views/annualReport/AnnualReport'

// 积分兑换页面
import CreditsExchange from 'views/creditsExchange/CreditsExchange'
import HasChange from 'views/creditsExchange/HasChange'
import Hexiaoma from 'views/creditsExchange/Hexiaoma'
import Hexiaoyuan from 'views/creditsExchange/Hexiaoyuan'
import Hexiaopingzheng from 'views/creditsExchange/Hexiaopingzheng'
import Hexiaojf from 'views/creditsExchange/Hexiaojf'
// 会员注册
import ApplyMemberShip from 'views/profile/memberMenu/ApplyMemberShip'
// 会员码
import Memberma from 'views/profile/memberMenu/Memberma'
// 线下收款
import OfflinePayment from 'views/profile/memberMenu/OfflinePayment'
import OfflinePaymentResult from 'views/profile/memberMenu/OfflinePaymentResult'

// 我的地址页面
import MyAddress from 'views/profile/memberMenu/myaddress/MyAddress'
// 新增地址页面
import Address from 'views/profile/memberMenu/myaddress/Address'
// 会员信息
import MemberInfo from 'views/profile/memberMenu/MemberInfo'
// 申请售后
import AfterSale from 'views/profile/memberMenu/AfterSale'
// 售后详情 
import AfterSaleDetail from 'views/profile/memberMenu/AfterSaleDetail'
// 售后处理流程页
import ApplySale from 'views/profile/memberMenu/ApplySale'
// 商品评价
import ProductReview from 'views/profile/memberMenu/ProductReview'
import ForwardLottery from 'views/profile/memberMenu/lottery/ForwardLottery'
// 会员消费明细
import ConsumptionDetail from 'views/profile/memberMenu/ConsumptionDetail'
// 优惠券页面
import Coupon from 'views/profile/memberMenu/Coupon1'
// 领取优惠券
import CouponTake from 'views/profile/memberMenu/CouponTake'
// 我的团
import MyGroup from 'views/mygroup/MyGroup'
// 查看玩法
import TeamPlaywfa from 'views/mygroup/TeamPlaywfa'
// 充值页面
import Balance from 'views/price/Balance'
// 用户核销页面
import Hexiao from 'views/heixiao/Hexiao'
// 门店核销员页面
import ZitiHexiao from 'views/heixiao/ZitiHexiao'
// 核销列表
import ZitiHexiaoList from 'views/heixiao/ZitiHexiaoList'
// 核销成功
import HeXiaoSuccess from 'views/heixiao/HeXiaoSuccess'
// import Hexiaopingzheng from 'views/heixiao/Hexiaopingzheng'
import Shouyinpingzheng from 'views/heixiao/Shouyinpingzheng'
// 兼职提现记录
import Parttimejobtxjr from 'views/parttimejob/Parttimejobtxjr'
// 兼职首页
import Parttimejob from 'views/parttimejob/Parttimejob'
// 兼职我的客人
import Myclient from 'views/parttimejob/Myclient'
// 全民兼职佣金明细
import Commission from 'views/parttimejob/Commission'
// 兼职申请
import Applyjob from 'views/parttimejob/Applyjob'
// 团长佣金
import GroupCommission from 'views/mygroup/GroupCommission'
// 兼职提现
import Carrymoney from 'views/parttimejob/Carrymoney'
// 兼职二维吗
import Jobma from 'views/parttimejob/Jobma'
// 转发抽奖页面
// import ForwardLottery from 'views/profile/memberMenu/lottery/ForwardLottery'
import LotterySeccess from 'views/profile/memberMenu/lottery/LotterySeccess'
import LotteryCode from 'views/profile/memberMenu/lottery/LotteryCode'

// 直播页面
// import LiveOver from "views/live/childCom/LiveOver";
// 打烊
import Closed from 'content/closed/Closed'

import Test from 'views/onlyTest/Test'

import TuiHuoHeXiao from "views/heixiao/TuiHuoHeXiao";

import Location from 'content/location/Location'
import Payment from 'views/payment/Payment'

import Sign from 'views/sign/Sign'
import SignGroup from 'views/sign/childCom/SignGroup'
import SignRules from 'views/sign/childCom/SignRules'
import MembersLevel from 'views/membersLevel/level'
import LuckyDraw from 'views/lucky-draw/LuckyDraw'
import Vip from 'views/honorable-vip-monthly/index'
import LuckyRules from 'views/lucky-draw/childCom/LuckyRules'
import luckyDrawIntegral from 'views/lucky-draw/childCom/luckyDrawIntegral'
import TestA from 'views/lucky-draw/TestA'

const AppRouter = () => {
  return (
    <Router>
      <CacheSwitch>
        {/* <Route path='/cart' exact component={Cart}></Route> */}
        {/* 精确匹配  总是 */}
        <CacheRoute path='/home' exact when='always' component={Home} ></CacheRoute>
        <CacheRoute path="/cart" exact when='always' component={Cart}></CacheRoute>
        <CacheRoute path='/category' when='always' component={Category} ></CacheRoute>
        <CacheRoute path='/store' exact when='always' component={Store}></CacheRoute>
        <CacheRoute path='/detail/:id/:num' when='forward' exact component={Detail} cacheKey='DetailComponent' ></CacheRoute>
        <CacheRoute path='/submit/:type/:id/:buytype/:num/:options/:tuan_id' when='forward' exact component={Submit} cacheKey='SubmitComponent'></CacheRoute>
        <CacheRoute path='/profile' when='always' component={Profile}></CacheRoute>
        <CacheRoute path='/mygroup' exact when='forward' component={MyGroup}></CacheRoute>
        <CacheRoute path='/address/:id' exact when='forward' component={Address} cacheKey='AddressComponent'></CacheRoute>
        <CacheRoute path='/myaddress/:type' exact when='forward' component={MyAddress} ></CacheRoute>
        <Redirect from='/' exact to='/home'></Redirect>
      </CacheSwitch>
      <Switch>
        <Route path='/order/:name/:id' exact component={Order}></Route>
        <Route path='/sign' exact component={withPVUV(Sign)}></Route>
        <Route path='/sign/group' exact component={withPVUV(SignGroup)}></Route>
        <Route path='/sign/rules' exact component={withPVUV(SignRules)}></Route>
        <Route path='/luckydraw' exact component={withPVUV(LuckyDraw)}></Route>
        <Route path='/luckydraw/rules' exact component={withPVUV(LuckyRules)}></Route>
        <Route path='/luckydraw/integral' exact component={withPVUV(luckyDrawIntegral)}></Route>
        <Route path='/testa' exact component={withPVUV(TestA)}></Route>
        <Route path='/payment/:orderno/:price' component={withPVUV(Payment)} ></Route>
        <Route path='/group/:id' component={withPVUV(Group)} ></Route>
        <Route path='/order/detail/:orderno/:id' exact component={withPVUV(OrderDetail)}></Route>
        <Route path='/order/evaluate/:orderno/:id' exact component={withPVUV(OrderEvaluate)}></Route>

        <Route path='/homeshare' exact component={withPVUV(HomeShare)} ></Route>
        <Route path='/detailshare/:id' exact component={withPVUV(DetailShare)}></Route>
        {/* <Route path='/detail/:id/:num' component={Detail}></Route> */}
        <Route path='/live/:uri' exact component={withPVUV(Live)}></Route>
        <Route path='/notice/:id' exact component={withPVUV(Notice)}></Route>
        {/*  <Route path='/submit/:type/:id/:buytype/:num/:options' exact component={Submit}></Route> */}
        {/* <Route path='/:id/pay' exact component={Pay}></Route> */}
        <Route path='/pay/:buytype/:orderno/:id' exact component={withPVUV(Pay)}></Route>
        <Route path='/submitstore/:id/:type' exact component={withPVUV(SubmitStore)}></Route>
        {/* <Route path='/share' exact component={Share}></Route> */}
        <Route path='/paysuccess/:orderno' exact component={withPVUV(PaySuccess)}></Route>
        <Route path='/detailStore/:merchantid' exact component={withPVUV(DetailStore)}></Route>
        <Route path='/honorable/vip' exact component={Vip}></Route>
        {/*  <Route path='/oline' exact component={Oline}></Route> */}

        <Route path='/location' component={withPVUV(Location)} ></Route>
        <Route path='/annual' component={withPVUV(AnnualReport)} ></Route>
        <Route path='/hexiao/success/:id/:orderno' component={withPVUV(HeXiaoSuccess)} ></Route>



        {/* 会员消费明细 */}
        <Route path='/ConsumptionDetail/:orderno/:type' exact component={withPVUV(ConsumptionDetail)}></Route>
        {/* 优惠券页面 */}
        <Route path='/coupon' exact component={withPVUV(Coupon)}></Route>
        <Route path='/members/level' exact component={withPVUV(MembersLevel)}></Route>
        <Route path='/coupon/take' exact component={withPVUV(CouponTake)}></Route>
        <Route path='/coupon/:price' exact component={withPVUV(Coupon)}></Route>
        <Route path='/coupon/receive/:id' exact component={withPVUV(ReceiveCoupon)}></Route>
        {/* 会员码 */}
        <Route path='/Memberma' exact component={withPVUV(Memberma)}></Route>
        {/* 线下收款 */}
        <Route path='/offresult/:amount/:openid/:memberid' exact component={withPVUV(OfflinePaymentResult)}></Route>
        <Route path='/off' exact component={withPVUV(OfflinePayment)}></Route>
        {/* 积分兑换页面 */}
        <Route path='/crechang' exact component={withPVUV(CreditsExchange)}></Route>
        <Route path='/integral/record' exact component={withPVUV(HasChange)}></Route>
        <Route path='/Hexiaoma/:id' exact component={withPVUV(Hexiaoma)}></Route>
        <Route path='/Hexiaoyuan' exact component={withPVUV(Hexiaoyuan)}></Route>
        <Route path='/Hexiaoyuan/:order' exact component={Hexiaopingzheng}></Route>
        <Route path='/Hexiao/:id' exact component={withPVUV(Hexiaojf)}></Route>
        {/* 充值页面 */}
        <Route path='/balance' exact component={withPVUV(Balance)}></Route>
        {/* 核销页面 */}
        <Route path='/hexiao' exact component={withPVUV(Hexiao)}></Route>
        <Route path='/zitihexiao/:orderno' exact component={withPVUV(ZitiHexiao)}></Route>
        <Route path='/oneselfhexiao/:openid/:storeid' exact component={withPVUV(ZitiHexiaoList)}></Route>
        <Route path='/Shouyinpingzheng' exact component={withPVUV(Shouyinpingzheng)}></Route>
        <Route path='/tuihuohexiao/:orderno' exact component={withPVUV(TuiHuoHeXiao)}></Route>
        {/* 会员信息 */}
        <Route path='/memberinfo' exact component={withPVUV(MemberInfo)}></Route>
        {/* 会员注册 */}
        <Route path='/ApplyMemberShip' exact component={withPVUV(ApplyMemberShip)}></Route>
        {/* 申请售后 */}
        <Route path='/sale/:orderno' exact component={withPVUV(AfterSale)}></Route>
        {/* 售后详情 */}
        <Route path='/sale/detail/:id' exact component={withPVUV(AfterSaleDetail)}></Route>
        {/* 售后处理流程页 */}
        <Route path='/applysale' exact component={withPVUV(ApplySale)}></Route>
        {/* 商品评价 */}
        <Route path='/productreview' exact component={withPVUV(ProductReview)}></Route>
        {/* 我的团 */}

        <Route path='/TeamPlaywfa' exact component={withPVUV(TeamPlaywfa)}></Route>
        {/* 团长佣金 */}
        <Route path='/GroupCommission' exact component={withPVUV(GroupCommission)}></Route>
        {/* 兼职 */}
        <Route path='/timejob' exact component={withPVUV(Parttimejob)}></Route>
        {/* 兼职我的客人 */}
        <Route path='/myclient' exact component={withPVUV(Myclient)}></Route>
        {/* 兼职申请 */}
        <Route path='/Applyjob' exact component={withPVUV(Applyjob)}></Route>
        {/* 全民兼职佣金明细 */}
        <Route path='/Commission' exact component={withPVUV(Commission)}></Route>
        {/* 兼职提现记录 */}
        <Route path='/jobtxjr' exact component={withPVUV(Parttimejobtxjr)}></Route>
        {/* 兼职提现 */}
        <Route path='/Carrymoney' exact component={withPVUV(Carrymoney)}></Route>
        {/* 兼职二维吗 */}
        <Route path='/Jobma' exact component={withPVUV(Jobma)}></Route>
        {/* 转发抽奖 */}
        <Route path='/lottery/:id' exact component={withPVUV(ForwardLottery)}></Route>
        {/* 抽奖信息提交成功 */}
        <Route path='/lotteryseccess' exact component={withPVUV(LotterySeccess)}></Route>
        {/* 抽奖号 */}
        <Route path='/lotterycode/:id' exact component={withPVUV(LotteryCode)}></Route>
        {/* 测试 */}
        <Route path='/test' exact component={withPVUV(Test)}></Route>
        {/*  直播结束*/}
        <Route path="/liveover" exact component={withPVUV(LiveOver)} />
        {/* 店铺打烊 */}
        <Route path="/closed" exact component={withPVUV(Closed)} />
      </Switch>
    </Router>
  )
}

export default AppRouter
