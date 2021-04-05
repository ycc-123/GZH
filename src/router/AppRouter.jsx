import React, { lazy, Suspense } from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import HandleError from 'commons/handleError'

import { withPVUV } from 'commons/pvuv'

import TabBar from 'common/tabBar/TabBar'
// import PageLoading from 'common/pageLoading/PageLoading'

// 页面带有缓存
const Home = React.lazy(_ => import('views/home/Home'))
const Profile = React.lazy(_ => import('views/profile/Profile'))
const Store = React.lazy(_ => import('content/store/Store'))
const Detail = React.lazy(_ => import('views/detail/Detail'))
const Submit = React.lazy(_ => import('views/submit/Submit'))
const MyGroup = React.lazy(_ => import('views/mygroup/MyGroup'))
const Order = React.lazy(_ => import('views/order/Order'))
const Address = React.lazy(_ => import('views/profile/memberMenu/myaddress/Address'))
const MyAddress = React.lazy(_ => import('views/profile/memberMenu/myaddress/MyAddress'))
const Cart = React.lazy(_ => import('views/cart/Cart'))
const Category = React.lazy(_ => import('views/category/Category'))

// 不带缓存
// 直播
const Live = withPVUV(React.lazy(_ => import('views/live/Live')))
// 付款
const Payment = withPVUV(React.lazy(_ => import('views/payment/Payment')))
// 定位
const Location = withPVUV(React.lazy(_ => import('content/location/Location')))
// 团页面
const Group = withPVUV(React.lazy(_ => import('views/group/Group')))
// 订单详情
const OrderDetail = withPVUV(React.lazy(_ => import('views/order/detail/OrderDetail')))

// 直播结束
const LiveOver = withPVUV(React.lazy(_ => import('views/live/childCom/LiveOver')))



const AnnualReport = withPVUV(React.lazy(_ => import('views/annualReport/AnnualReport')))

const SubmitStore = withPVUV(React.lazy(_ => import('views/submit/childCom/SubmitStore')))
const Pay = withPVUV(React.lazy(_ => import('views/pay/Pay')))
const HomeShare = withPVUV(React.lazy(_ => import('views/home/childCom/HomeShare')))
const DetailShare = withPVUV(React.lazy(_ => import('views/detail/childCom/DetailShare')))
const PaySuccess = withPVUV(React.lazy(_ => import('views/pay/childCom/PaySuccess')))



const OrderEvaluate = withPVUV(React.lazy(_ => import('views/order/detail/OrderEvaluate')))

const Notice = withPVUV(React.lazy(_ => import('views/notice/Notice')))
const DetailStore = withPVUV(React.lazy(_ => import('views/detail/childCom/DetailStore')))
const ReceiveCoupon = withPVUV(React.lazy(_ => import('views/coupon/ReceiveCoupon')))

const CreditsExchange = withPVUV(React.lazy(_ => import('views/creditsExchange/CreditsExchange')))
const HasChange = withPVUV(React.lazy(_ => import('views/creditsExchange/HasChange')))
const Hexiaoma = withPVUV(React.lazy(_ => import('views/creditsExchange/Hexiaoma')))
const Hexiaoyuan = withPVUV(React.lazy(_ => import('views/creditsExchange/Hexiaoyuan')))
const Hexiaopingzheng = withPVUV(React.lazy(_ => import('views/creditsExchange/Hexiaopingzheng')))
const Hexiaojf = withPVUV(React.lazy(_ => import('views/creditsExchange/Hexiaojf')))
const ApplyMemberShip = withPVUV(React.lazy(_ => import('views/profile/memberMenu/ApplyMemberShip')))
const Memberma = withPVUV(React.lazy(_ => import('views/profile/memberMenu/Memberma')))
const OfflinePayment = withPVUV(React.lazy(_ => import('views/profile/memberMenu/OfflinePayment')))
const OfflinePaymentResult = withPVUV(React.lazy(_ => import('views/profile/memberMenu/OfflinePaymentResult')))


const MemberInfo = withPVUV(React.lazy(_ => import('views/profile/memberMenu/MemberInfo')))
const AfterSale = withPVUV(React.lazy(_ => import('views/profile/memberMenu/AfterSale')))
const ApplySale = withPVUV(React.lazy(_ => import('views/profile/memberMenu/ApplySale')))
const ProductReview = withPVUV(React.lazy(_ => import('views/profile/memberMenu/ProductReview')))
const ForwardLottery = withPVUV(React.lazy(_ => import('views/profile/memberMenu/lottery/ForwardLottery')))
const ConsumptionDetail = withPVUV(React.lazy(_ => import('views/profile/memberMenu/ConsumptionDetail')))
const Coupon = withPVUV(React.lazy(_ => import('views/profile/memberMenu/Coupon1')))
const CouponTake = withPVUV(React.lazy(_ => import('views/profile/memberMenu/CouponTake')))


const TeamPlaywfa = withPVUV(React.lazy(_ => import('views/mygroup/TeamPlaywfa')))
const Balance = withPVUV(React.lazy(_ => import('views/price/Balance')))
const Hexiao = withPVUV(React.lazy(_ => import('views/heixiao/Hexiao')))
const ZitiHexiao = withPVUV(React.lazy(_ => import('views/heixiao/ZitiHexiao')))
const ZitiHexiaoList = withPVUV(React.lazy(_ => import('views/heixiao/ZitiHexiaoList')))
const Shouyinpingzheng = withPVUV(React.lazy(_ => import('views/heixiao/Shouyinpingzheng')))
const Parttimejobtxjr = withPVUV(React.lazy(_ => import('views/parttimejob/Parttimejobtxjr')))
const Parttimejob = withPVUV(React.lazy(_ => import('views/parttimejob/Parttimejob')))
const Myclient = withPVUV(React.lazy(_ => import('views/parttimejob/Myclient')))
const Commission = withPVUV(React.lazy(_ => import('views/parttimejob/Commission')))
const Applyjob = withPVUV(React.lazy(_ => import('views/parttimejob/Applyjob')))
const GroupCommission = withPVUV(React.lazy(_ => import('views/mygroup/GroupCommission')))
const Carrymoney = withPVUV(React.lazy(_ => import('views/parttimejob/Carrymoney')))
const Jobma = withPVUV(React.lazy(_ => import('views/parttimejob/Jobma')))
const LotterySeccess = withPVUV(React.lazy(_ => import('views/profile/memberMenu/lottery/LotterySeccess')))
const LotteryCode = withPVUV(React.lazy(_ => import('views/profile/memberMenu/lottery/LotteryCode')))
const Closed = withPVUV(React.lazy(_ => import('content/closed/Closed')))
const Test = withPVUV(React.lazy(_ => import('views/onlyTest/Test')))
const TuiHuoHeXiao = withPVUV(React.lazy(_ => import('views/heixiao/TuiHuoHeXiao')))
const Sign = withPVUV(React.lazy(_ => import('views/sign/Sign')))
const SignRules = withPVUV(React.lazy(_ => import('views/sign/childCom/SignRules')))
const SignGroup = withPVUV(React.lazy(_ => import('views/sign/childCom/SignGroup')))
const MembersLevel = withPVUV(React.lazy(_ => import('views/membersLevel/level')))
const LuckyDraw = withPVUV(React.lazy(_ => import('views/lucky-draw/LuckyDraw')))
const LuckyRules = withPVUV(React.lazy(_ => import('views/lucky-draw/childCom/LuckyRules')))
const LuckyDrawIntegral = withPVUV(React.lazy(_ => import('views/lucky-draw/childCom/luckyDrawIntegral')))
const BlackList = withPVUV(React.lazy(_ => import('views/blacklist/BlackList')))
const AfterSaleDetail = withPVUV(React.lazy(_ => import('views/profile/memberMenu/AfterSaleDetail')))
const Vip = React.lazy(_ => import('views/honorable-vip-monthly/index'))

// const Payment = withPVUV(React.lazy(_ => import('views/payment/Payment')))

const pageNoCacheRoute = [
  { id: 'page01', path: '/payment/:orderno', component: <Payment /> },
  { id: 'page02', path: '/location', component: <Location /> },
  { id: 'page03', path: '/group/:id', component: <Group /> },
  { id: 'page04', path: '/order/detail/:orderno/:id', component: <OrderDetail /> },
  { id: 'page05', path: '/order/evaluate/:orderno/:id', component: <OrderEvaluate /> },
  { id: 'page06', path: '/homeshare', component: <HomeShare /> },
  { id: 'page07', path: '/detailshare/:id', component: <DetailShare /> },
  { id: 'page08', path: '/notice/:id', component: <Notice /> },
  { id: 'page09', path: '/pay/:buytype/:orderno/:id', component: <Pay /> },
  { id: 'page10', path: '/submitstore/:id/:type', component: <SubmitStore /> },
  { id: 'page11', path: '/paysuccess/:orderno', component: <PaySuccess /> },
  { id: 'page12', path: '/detailStore/:merchantid', component: <DetailStore /> },
  { id: 'page13', path: '/ConsumptionDetail/:orderno/:type', component: <ConsumptionDetail /> },
  { id: 'page14', path: '/coupon', component: <Coupon /> },
  { id: 'page15', path: '/coupon/take', component: <CouponTake /> },
  { id: 'page16', path: '/coupon/:price', component: <Coupon /> },
  { id: 'page17', path: '/coupon/receive/:id', component: <ReceiveCoupon /> },
  { id: 'page18', path: '/Memberma', component: <Memberma /> },
  { id: 'page19', path: '/offresult/:amount/:openid/:memberid', component: <OfflinePaymentResult /> },
  { id: 'page20', path: '/off', component: <OfflinePayment /> },
  { id: 'page21', path: '/crechang', component: <CreditsExchange /> },
  { id: 'page22', path: '/integral/record', component: <HasChange /> },
  { id: 'page23', path: '/Hexiaoma/:id', component: <Hexiaoma /> },
  { id: 'page24', path: '/Hexiaoyuan', component: <Hexiaoyuan /> },
  { id: 'page25', path: '/Hexiaoyuan/:order', component: <Hexiaopingzheng /> },
  { id: 'page26', path: '/Hexiao/:id', component: <Hexiaojf /> },
  { id: 'page27', path: '/balance', component: <Balance /> },
  { id: 'page28', path: '/hexiao', component: <Hexiao /> },
  { id: 'page29', path: '/zitihexiao/:orderno', component: <ZitiHexiao /> },
  { id: 'page30', path: '/Shouyinpingzheng', component: <Shouyinpingzheng /> },
  { id: 'page31', path: '/tuihuohexiao/:orderno', component: <TuiHuoHeXiao /> },
  { id: 'page32', path: '/memberinfo', component: <MemberInfo /> },
  { id: 'page33', path: '/ApplyMemberShip', component: <ApplyMemberShip /> },
  { id: 'page34', path: '/sale/:orderno', component: <AfterSale /> },
  { id: 'page35', path: '/applysale', component: <ApplySale /> },
  { id: 'page36', path: '/productreview', component: <ProductReview /> },
  { id: 'page37', path: '/TeamPlaywfa', component: <TeamPlaywfa /> },
  { id: 'page38', path: '/GroupCommission', component: <GroupCommission /> },
  { id: 'page39', path: '/timejob', component: <Parttimejob /> },
  { id: 'page40', path: '/myclient', component: <Myclient /> },
  { id: 'page41', path: '/Applyjob', component: <Applyjob /> },
  { id: 'page42', path: '/Commission', component: <Commission /> },
  { id: 'page43', path: '/jobtxjr', component: <Parttimejobtxjr /> },
  { id: 'page44', path: '/Carrymoney', component: <Carrymoney /> },
  { id: 'page45', path: '/lottery/:id', component: <ForwardLottery /> },
  { id: 'page46', path: '/lotteryseccess', component: <LotterySeccess /> },
  { id: 'page47', path: '/lotterycode/:id', component: <LotteryCode /> },
  { id: 'page48', path: '/test', component: <Test /> },
  { id: 'page49', path: '/liveover', component: <LiveOver /> },
  { id: 'page50', path: '/closed', component: <Closed /> },
  { id: 'page51', path: '/annual', component: <AnnualReport /> },
  { id: 'page52', path: '/Jobma', component: <Jobma /> },
  { id: 'page53', path: '/sign', component: <Sign /> },
  { id: 'page54', path: '/sign/rules', component: <SignRules /> },
  { id: 'page55', path: '/members/level', component: <MembersLevel /> },
  { id: 'page56', path: '/luckydraw', component: <LuckyDraw /> },
  { id: 'page57', path: '/luckydraw/rules', component: <LuckyRules /> },
  { id: 'page58', path: '/luckydraw/integral', component: <LuckyDrawIntegral /> },
  { id: 'page59', path: '/blacklist', component: <BlackList /> },
  { id: 'page60', path: '/sign/group', component: <SignGroup /> },
  { id: 'page61', path: '/oneselfhexiao/:openid/:storeid', component: <ZitiHexiaoList /> },
  { id: 'page62', path: '/payment/:orderno/:price', component: <Payment /> },
  { id: 'page63', path: '/sale/detail/:id', component: <AfterSaleDetail /> },
  { id: 'page64', path: '/honorable/vip', component: <Vip /> },
]




export const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--bg-color)' }}></div>}>
        <CacheSwitch>
          <CacheRoute path='/home' exact when='always' render={props => <HandleError><Home {...props} /></HandleError>} ></CacheRoute>
          <CacheRoute path='/profile' when='always' render={props => <HandleError><Profile {...props} /></HandleError>} ></CacheRoute>
          <CacheRoute path='/store' exact when='always' render={props => <HandleError><Store {...props} /></HandleError>}></CacheRoute>
          <CacheRoute path='/detail/:id/:num' when='forward' exact render={props => <HandleError><Detail {...props} /></HandleError>} cacheKey='DetailComponent' ></CacheRoute>
          <CacheRoute path='/submit/:type/:id/:buytype/:num/:options/:tuan_id' when='forward' exact render={props => <HandleError><Submit {...props} /></HandleError>} cacheKey='SubmitComponent'></CacheRoute>
          <CacheRoute path='/mygroup' exact when='forward' render={props => <HandleError><MyGroup {...props} /></HandleError>} ></CacheRoute>
          <CacheRoute path='/order/:name/:id' exact render={props => <HandleError><Order {...props} /></HandleError>} ></CacheRoute>
          <CacheRoute path='/address/:id' exact when='forward' render={props => <HandleError><Address {...props} /></HandleError>} cacheKey='AddressComponent'></CacheRoute>
          <CacheRoute path='/myaddress/:type' exact when='forward' render={props => <HandleError><MyAddress {...props} /></HandleError>} ></CacheRoute>
          <CacheRoute path='/sign' exact when='forward' render={props => <HandleError><Sign {...props} /></HandleError>} ></CacheRoute>
          <Redirect from='/' exact to='/home'></Redirect>
        </CacheSwitch>
        <Suspense fallback={<div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
          <TabBar />
        </div>}>
          <CacheSwitch>
            <CacheRoute path="/cart" exact when='always' render={props => <HandleError><Cart {...props} /></HandleError>} ></CacheRoute>
            <CacheRoute path='/category' when='always' render={props => <HandleError><Category {...props} /></HandleError>} ></CacheRoute>
          </CacheSwitch>
          <Switch>
            <Route path='/live/:uri' exact render={() => <HandleError><Live /></HandleError>}></Route>
          </Switch>
        </Suspense>
        <Switch>
          {
            pageNoCacheRoute.map(item => {
              return <Route key={item.id} path={item.path} exact render={() => <HandleError>{item.component}</HandleError>} ></Route>
            })
          }
        </Switch>
      </Suspense>
    </Router>
  )
}

