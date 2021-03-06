import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { dropByCacheKey } from 'react-router-cache-route'
// import QRCode from 'qrcode-react'
// import vConsole from 'vconsole'

import HomeGoodsList from './childCom/HomeGoodsList'
import HomeHead from './childCom/HomeHead'
import HomeIcon from './childCom/HomeIcon'
import HomeCube from './childCom/HomeCube'
import HomeNotice from './childCom/HomeNotice'
import HomeSingle from './childCom/HomeSingle'
import HomeButton from './childCom/HomeButton'
import HomeLive from './childCom/HomeLive'
import HomeGuide from './childCom/HomeGuide'

import { saveAppConfig } from "store/actionCreators"
// import LazyLoad from 'react-lazyload'


// import { getHomeData } from '../../network/home'
import PageLoading from 'common/pageLoading/PageLoading'
import Loading from 'common/loading/Loading'
import SwiperComponent from 'common/swiper/SwiperComponent'
import BetterScroll from 'common/betterScroll/BetterScroll'
import TabBar from 'common/tabBar/TabBar'
import Logo from 'content/logo/Logo'
import Drawer from 'common/drawer/Drawer'
import Share from 'content/share/Share'
import { getQueryString } from 'commons/AuthFunction'
import { setTitle } from 'commons/utils'
import Subscribe from 'content/subscribe/Subscribe'
import HandleError from 'commons/handleError'
import Modal from 'common/modal/Modal'

import { store } from 'store/index'
import { getCartData, saveStore, setupMallConfig } from 'store/actionCreators'

import axios from 'axios'
import { _homeApi, _bannerApi, _advsApi, _cubeApi, _notesApi, _singleApi } from 'network/home'
import { _showCart } from 'network/cart'
import { _chatRoom } from "network/live"
import { _categoryLeft, _categoryRight } from 'network/category'
import { _setPVUV } from 'network/api'

// import { setHomeConfig } from 'commons/wxShare'

import './style/home.css'
import { _live } from "../../network/live";


const wx = window.wx

// const vconsole = new vConsole()

class Home extends Component {
  constructor(props) {
    super(props)
    // ???????????????????????????
    props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
    this.state = {
      issell: '',
      showPubStock: '',
      liveState: {},
      dataList: [],
      goodsList: [],
      advertising: [],
      category: [],
      cube: [],
      edit: [],
      notes: [],
      single: [],
      live: '',
      // topTip: '????????????',
      bottomTip: '',
      page: 1,
      loading: true,
      smallLoading: false,
      loadingMore: false,
      isShow: false,
      goods: '', // ??????????????????
      showDrawer: false,
      num: '',
      type: 0,
      share: false,
      complete: false,
      copyright_removal: 0, // ??????logo????????????
      show_partjob_commission: '',
      signState: false,
      template: 'w7jDtKLHICTQijDNNeP9RPox94iXpL6f82r9NXo37eU'
    }
    this.isLoadMore = true
    this.saveY = 0
    this.goodsY = 0
  }
  render() {
    const { loading, smallLoading, liveState, live, category, advertising, copyright_removal,
      notes, single, dataList, goods, showDrawer, show_partjob_commission,
      num, cube, type, loadingMore, share, complete, guide, signState, template, memberExpiration = false
    } = this.state
    // const showLoding = loadingMore ? 'visible' : 'hidden'
    const showLive = live.LIVE === 'on' ? 'block' : 'none'
    const scollConfig = {
      probeType: 1
    }
    const scrollStyle = {
      height: 'calc((100vh - 2.48rem) - env(safe-area-inset-bottom))'
    }

    const { isApplet } = store.getState().appConfig

    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--tab-color)' }}>



        {/* <wx-open-subscribe template={template}>
          <script type="text/wxtags-template">
            <div>??????????????????</div>
          </script>
        </wx-open-subscribe> */}


        <HomeGuide />
        <div className='home'>
          <PageLoading loading={loading} />
          <HomeHead search={this.search} />
          {single.length !== 0 && <HomeSingle data={single} />}
          <BetterScroll loadMore={this.loadMore}
            isLoadMore={this.isLoadMore}
            ref='scroll'
            config={scollConfig}
            style={scrollStyle}>
            {dataList.length !== 0 && <SwiperComponent dataList={this.state.dataList} refresh={this.refresh} />}
            {category.length !== 0 && <HomeIcon data={category} changeCategory={this.changeCategory} />}
            {notes.length !== 0 && <HomeNotice data={notes} />}
            {advertising.length !== 0 && <SwiperComponent dataList={advertising} refresh={this.refresh} number={1} />}
            {cube.length !== 0 && <HomeCube data={cube} />}
            {live && <HomeLive style={showLive} live={live} />}
            <HomeGoodsList issell={this.state.issell}
              showPubStock={this.state.showPubStock}
              goodsList={this.state.goodsList}
              show_partjob_commission={show_partjob_commission}
              cart={this.state.cart}
              optionsGoods={this.optionsGoods}
              memberExpiration={memberExpiration}
            />
            {complete && <div style={{ color: 'var(--font-color)', margin: '.5rem 0', textAlign: 'center', opacity: '.7' }}>???????????????????????????</div>}
            {copyright_removal === 0 && <Logo />}
          </BetterScroll>
          <HomeButton show={this.showButton} isShow={this.state.isShow} top={this.top} share={this.changeShare} />
          <Drawer style={showDrawer}
            hideDrawer={this.hideDrawer}
            goods={goods}
            num={num}
            decrementNum={this.decrementNum}
            incrementNum={this.incrementNum}
            memberExpiration={memberExpiration}
          />
          <Loading smallLoading={smallLoading} />
          <Share type={0} active={share} show={this.showButton} changeActive={this.changeShare} />
          <TabBar goHome={this.goHome} />
        </div>
        {
          !isApplet && <Subscribe />
        }
        <div className='mask' style={{ background: 'rgba(0, 0, 0, .75)', display: signState ? 'block' : 'none' }} />
        <Modal>
          <img className='home-sign' onClick={() => { this.goSign() }} style={{ display: signState ? 'block' : 'none' }} src={require('assets/img/home-sign.png')} />
          <img className='home-cha' style={{ display: signState ? 'block' : 'none' }} onClick={() => this.closeSign()} src={require('assets/img/sign-cha.png')} />
        </Modal>
      </div>
    )
  }

  closeSign() {
    this.setState({
      signState: false
    })
  }

  goSign() {
    this.setState({
      signState: false
    }, () => {
      this.props.history.push('/sign')
    })
  }


  componentDidCatch(error, errorInfo) {
    console.log(error)
    console.log(errorInfo)
  }

  /* ???????????? */
  componentDidMount = async () => {
    let { appConfig } = store.getState()
    const wxUserInfo = appConfig.wxUserInfo

    // if (!document.cookie) {
    //   signState = true
    // let time = new Date()
    // let Y = time.getFullYear()
    // let M = time.getMonth() + 1
    // let D = time.getDate()
    //   // ?????? 0???0???0???????????? 
    //   // let newTime = new Date(Y, M, D).getTime() + 24 * 60 * 60 * 1000
    //   // ???????????????
    //   let newTime = new Date().getTime() + 60000
    //   let cancel = new Date(newTime)
    //   setCookie('homeState', '????????????', cancel)
    // } else {
    //   signState = false
    // }

    // setupMallConfig({ openid: 'oCKOnuEaxr176_rHxqxjP_bzUlt0', uniacid: '53' })

    let cid = getQueryString('cid')
    if (cid) {
      this.config = {
        action: 'getGoodsByCategory',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          cid,
          page: 1,
          pagesize: 10,
        }
      }
    } else {
      this.config = {
        action: 'shopajax_pub',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          page: 1,
          pagesize: 10,
        }
      }
    }
    const lianjie_config = {
      action: 'indexShare',
      data: {
        uniacid: appConfig.uniacid
      }
    }
    const store_config = {
      action: 'getDefaultStore',
      data: {
        uniacid: appConfig.uniacid,
        openid: appConfig.wxUserInfo.openid
      }
    }

    const live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }

    axios.all([_bannerApi().catch(err => ''),
    _homeApi(this.config).catch(err => ''),
    _cubeApi().catch(err => ''),
    _advsApi().catch(err => ''),
    _showCart().catch(err => ''),
    _categoryLeft().catch(err => ''),
    _notesApi().catch(err => ''),
    _singleApi().catch(err => ''),
    _homeApi(lianjie_config).catch(err => ''),
    _homeApi(store_config).catch(err => ''),
    _chatRoom(live_config).catch(err => ''),
    _setPVUV().catch(err => '')
    ]).then(res => {
      if (res[9].data.status === 200) {
        const action = saveStore(res[9].data.data)
        store.dispatch(action)
      }
      let complete = false
      if (res[8]?.data?.data) {
        const { share_title, share_image, share_desc } = res[8].data.data
        this.title = share_title
        this.imgUrl = share_image
        this.desc = share_desc
      }

      // ?????????????????? 
      let signState = false

      let storage = window.localStorage
      let time = new Date()
      let Y = time.getFullYear()
      let M = time.getMonth() + 1
      let D = time.getDate()
      let signDate = Y + '-' + M + '-' + D
      let homeState = JSON.parse(storage.getItem('homeSign'))
      console.log(res[1])
      if ((!homeState || homeState.date !== signDate) && res[1].data.data.signin_apply === 1) {
        signState = true
        storage.setItem('homeSign', JSON.stringify({ date: signDate }))
      }

      // let aaaddd = res[8].data.data.data.add
      try {
        if (!this.config.data.cid) {
          // ??????????????????????????????????????????
          if (parseInt(res[0].ddddata.data.total) === this.config.data.pagesize) {
            this.isLoadMore = false
            complete = true
          } else {
            // ????????????`
            this.config.data.page += 1
            complete = false
          }
        } else {
          if (res[1].data.data.list.length === 0) {
            complete = false
            this.isLoadMore = false
          } else if (res[1].data.data.list.length < 10) {
            complete = true
            this.isLoadMore = false
          } else {
            this.isLoadMore = true
            this.config.data.page += 1
          }
        }
      } catch (err) {
        this.config.data.page += 1
      }

      this.setState({
        issell: res[1]?.data?.data?.issell,
        showPubStock: res[1]?.data?.data?.showPubStock,
        dataList: res[0]?.data?.data || [],
        goodsList: this.config.data.cid ? res[1]?.data?.data?.list || [] : res[1]?.data?.data?.list || [],
        copyright_removal: res[1]?.data?.data?.copyright_removal || 0,
        loading: false,
        cube: res[2]?.data?.data || [],
        advertising: res[3]?.data?.data || [],
        category: res[5]?.data?.data || [],
        notes: res[6]?.data?.data?.list || [],
        single: res[7]?.data?.data || [],
        // live:res[9].data.LIVE || '',
        // liveState:res[9].data.info || {},
        sname: res[1]?.data?.data?.sname || '??????',
        complete,
        live: res[10]?.data || '',
        show_partjob_commission: this.config.data.cid ? res[1]?.data?.data?.show_partjob_commission || [] : res[1]?.data?.data?.show_partjob_commission || [],
        signState,
        memberExpiration: res[1]?.data?.data?.memberExpiration || false
      }, async () => {
        // ???????????????redux
        setTitle(this.state.sname)
        const action = getCartData(res[4]?.data?.data)
        store.dispatch(action)
        // ????????????????????????
        // loading = false
        // ????????????
        this.refs.scroll.BScroll.finishPullUp()
        this.refs.scroll.BScroll.refresh()
        this.refs.scroll.BScroll.enable()
        let mid = getQueryString('mid')
        let url, search
        if (mid) {
          // ???????????????????????????
          if (wxUserInfo.enable === '1') {
            url = window.location.href.replace(`&mid=${mid}`, `&mid=${wxUserInfo.id}`)
            this.link = url
          } else if (wxUserInfo.enable === null || wxUserInfo.enable === '0') {
            // ??????????????????
            url = window.location.href.replace(`&mid=${mid}`, '')
            this.link = url
          }
        } else {
          // ??????mid
          if (wxUserInfo.enable === '1') {
            search = window.location.search
            url = window.location.href.replace(search, search + `&mid=${wxUserInfo.id}`)
            this.link = url
          } else {
            this.link = window.location.href
          }
        }
        let that = this
        wx.ready(() => {
          wx.getLocation({
            type: 'wgs84', //  
            success: function (res) {
              appConfig.wxUserInfo.lng = res.longitude
              appConfig.wxUserInfo.lat = res.latitude
              const action = saveAppConfig(appConfig)
              store.dispatch(action)
            }
          })
          // ??????
          wx.updateAppMessageShareData({
            title: that.title,
            link: that.link,
            imgUrl: that.imgUrl,
            desc: that.desc,
            success: function () {
            },
            fail: function (err) {
              Toast.info(err)
            }
          })
          wx.updateTimelineShareData({
            title: that.title,
            link: that.link,
            imgUrl: that.imgUrl,
            success: function () {
            },
            fail: function (err) {
              Toast.info(err)
            }
          })
          // ??????
          wx.onMenuShareTimeline({
            title: that.title,
            link: that.link,
            imgUrl: that.imgUrl,
            success: function () {
              // ?????????????????????????????????????????????
            },
            fail: function (err) {
              Toast.info(err)
            }
          })
          wx.onMenuShareAppMessage({
            title: that.title, // ????????????
            desc: that.desc, // ????????????
            link: that.link, // ??????????????????????????????????????????????????????????????????????????????JS??????????????????
            imgUrl: that.imgUrl, // ????????????
            type: '', // ????????????,music???video???link??????????????????link
            dataUrl: '', // ??????type???music???video??????????????????????????????????????????
            success: function () {
              // ?????????????????????????????????????????????
            },
            fail: function (err) {
              Toast.info(err)
            }
          })
        })
      })
    })
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(this.state) !== JSON.stringify(nextState)
  }

  componentDidCache = async () => {
    // ???????????????????????????scroll???y???
    this.saveY = this.refs.scroll.BScroll.y
    console.log(this.saveY, '?????????')
    let cid = getQueryString('cid')
    if (cid) {
      let newUrl = window.location.href.replace(`&cid=${cid}`, '')
      window.history.pushState(null, null, newUrl)
    }
  }

  componentDidRecover = async () => {
    setTitle(this.state.sname)
    this.refresh()
    const { appConfig } = store.getState()
    dropByCacheKey('DetailComponent')

    const live_config = {
      op: 'GetLiveStatusInfo',
      uniacid: appConfig.uniacid,
    }
    let cid = getQueryString('cid')

    if (this.config.data.cid) {
      let search = window.location.search
      let newUrl = window.location.href.replace(search, search + `&cid=${this.config.data.cid}`)
      window.history.pushState(null, null, newUrl)
    }

    if (this.isLoadMore) {
      // ???????????????
      let oldPage = this.config.data.page - 1
      this.config.data.pagesize = (this.config.data.page - 1) * this.config.data.pagesize
      this.config.data.page = 1
      axios.all([
        _chatRoom(live_config).catch(err => ''),
        _showCart(),
        _homeApi(this.config),
        _setPVUV()
      ]).then(async res => {
        const action = getCartData(res[1].data.data)
        store.dispatch(action)
        this.isLoadMore = true
        this.config.data.page = oldPage + 1
        this.config.data.pagesize = 10
        this.setState({
          goodsList: res[2].data.data.list,
          complete: false,
          live: (res[0] && res[0].data) || ''
        }, () => {
          this.refs.scroll.BScroll.finishPullUp()
          this.refresh()
          // this.refs.scroll.BScroll.scrollTo(0, this.saveY, 0)
        })
      })
    } else {
      // ??????????????????
      let oldPage = this.config.data.page
      this.config.data.pagesize = this.config.data.page * this.config.data.pagesize
      this.config.data.page = 1
      axios.all([
        _chatRoom(live_config),
        _showCart(),
        _homeApi(this.config),
        _setPVUV()
      ]).then(res => {
        const action = getCartData(res[1].data.data)
        store.dispatch(action)
        if (res[2].data.data.list.length === parseInt(res[2].data.data.total)) {
          this.config.data.page = oldPage
          this.config.data.pagesize = 10
          this.isLoadMore = false
        }
        this.setState({
          goodsList: res[2].data.data.list,
          complete: true,
          live: (res[0] && res[0].data) || ''
        }, () => {
          this.refs.scroll.BScroll.finishPullUp()
          this.refresh()
          // this.refs.scroll.BScroll.scrollTo(0, this.saveY, 0)
        })
      })
    }
    // ??????????????????????????? 

  }

  /* componentWillUnmount() {
    this.cancelSub()
  } */

  changeShare = () => {
    this.setState({
      share: !this.state.share
    })
  }

  goHome = async () => {
    let cid = getQueryString('cid')
    if (cid) {
      let newUrl = window.location.href.replace(`&cid=${cid}`, '')
      window.history.pushState(null, null, newUrl)
    }

    this.isLoadMore = true
    let complete
    this.config = {
      action: 'shopajax_pub',
      data: {
        uniacid: store.getState().appConfig.uniacid,
        openid: store.getState().appConfig.wxUserInfo.openid,
        page: 1,
        pagesize: 10
      }
    }
    const result = await _homeApi(this.config)
    if (parseInt(result.data.data.total) === this.config.data.pagesize) {
      this.isLoadMore = false
      complete = true
      /* let bottomTip = document.querySelector('.bottom-tip')
      bottomTip.style.visibility = 'visible'
      bottomTip.innerHTML = '??????????????????????????????' */
    } else {
      // ????????????
      this.config.data.page += 1
      complete = false
    }


    _showCart().then(res => {
      const action = getCartData(res.data.data)
      store.dispatch(action)
    })
    this.setState({
      goodsList: result.data.data.list,
      complete
    }, () => {
      this.refs.scroll.BScroll.finishPullUp()
      this.refs.scroll.BScroll.refresh()
      this.refs.scroll.BScroll.scrollTo(0, 0, 1000)
    })
  }

  refresh = () => {
    this.refs.scroll.BScroll.refresh()
  }

  showDrawer = (e) => {
    e.stopPropagation()
    if (this.state.goods) {
      this.setState({
        showDrawer: true
      })
    }
  }

  hideDrawer = () => {
    this.setState({
      showDrawer: false,
    })
  }

  optionsGoods = newgoods => {
    // const { goods } = this.state
    this.setState({
      goods: newgoods,
      showDrawer: true,
      num: 1
    })
  }

  decrementNum = () => {
    let { num } = this.state
    if (parseInt(num) > 1) {
      num = parseInt(num) - 1
    }
    this.setState({
      num: parseInt(num)
    })
  }


  incrementNum = () => {
    let { num, goods } = this.state
    if (goods.one_limit) {
      if (parseInt(num) === parseInt(goods.one_limit)) {
        Toast.info(`????????????????????????${goods.one_limit}`, 1)
      } else {
        num = parseInt(num) + 1
        this.setState({
          num
        })
      }
    } else if (num === parseInt(goods.gnum)) {
      Toast.info(`??????????????????????????????${goods.gnum}`, 1)
    }
  }


  // ????????????
  showButton = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }


  // ????????????
  top = () => {
    this.refs.scroll.BScroll.scrollTo(0, 0, 1000)
  }

  changeSmallLoading = () => {
    this.setState({
      smallLoading: !this.state.smallLoading
    })
  }

  // ??????????????????
  changeCategory = (id) => {
    this.isLoadMore = true
    const { appConfig } = store.getState()
    this.setState({
      smallLoading: true
    }, () => {
      this.config = {
        action: 'getGoodsByCategory',
        data: {
          uniacid: appConfig.uniacid,
          openid: appConfig.wxUserInfo.openid,
          cid: id,
          page: 1
        }
      }
      // ???????????????
      _homeApi(this.config).then(res => {
        let cid = getQueryString('cid')
        if (cid) {
          let newUrl = window.location.href.replace(`&cid=${cid}`, `&cid=${this.config.data.cid}`)
          window.history.pushState(null, null, newUrl)
        } else {
          let search = window.location.search
          let newUrl = window.location.href.replace(search, search + `&cid=${this.config.data.cid}`)
          window.history.pushState(null, null, newUrl)
        }
        if (res.data.data.list.length === 0) {
          this.isLoadMore = false
          this.setState({
            goodsList: [],
            complete: false,
            smallLoading: false
          }, () => {
            this.refs.scroll.BScroll.finishPullUp()
            this.refresh()
            this.scrollTo()
          })
        } else if (res.data.data.list.length < 10) {
          this.isLoadMore = false
          this.setState({
            goodsList: (res && res.data && res.data.data && res.data.data.list) || [],
            complete: true,
            smallLoading: false
          }, () => {
            this.refs.scroll.BScroll.finishPullUp()
            this.refresh()
            this.scrollTo()
          })
        } else if (res.data.data.list.length === 10) {
          this.config.data.page += 1
          this.isLoadMore = true
          this.setState({
            goodsList: (res && res.data && res.data.data && res.data.data.list) || [],
            smallLoading: false,
            complete: false
          }, () => {
            this.refs.scroll.BScroll.finishPullUp()
            this.refresh()
            this.scrollTo()
          })
        }
      })
    })
    console.log(this.isLoadMore, '????????????')

  }

  scrollTo = () => {
    let top = -document.querySelector('.goods-offsetTop').offsetTop
    let elHeight = document.querySelector('.goods-offsetTop').offsetHeight
    // console.log('??????????????????', elHeight)
    let scrollHeight = this.refs.scroll.refs.wrapper.offsetHeight
    // console.log('?????????????????????', scrollHeight)
    // console.log(this.refs.scroll.refs.wrapper)
    // this.refs.scroll.BScroll.scrollTo(0, top, 1000)
    if (elHeight >= scrollHeight) {
      this.refs.scroll.BScroll.scrollTo(0, top, 1000)
    } else {
      this.refs.scroll.BScroll.scrollTo(0, this.refs.scroll.BScroll.maxScrollY, 1000)
    }
  }


  // ??????
  search = async content => {
    this.isLoadMore = true
    this.config.data.page = 1
    this.config.data.keyword = content
    const result = await _homeApi(this.config)
    if (this.config.data.cid) {
      if (result.data.data.list.length === 0) {
        Toast.fail('???????????????')
      } else {
        this.isLoadMore = false
        this.setState({
          goodsList: result.data.data.list[0].data,
          loadingMore: false
        }, () => {
          this.refs.scroll.BScroll.refresh()
          let top = -document.querySelector('.goods-offsetTop').offsetTop
          let elHeight = document.querySelector('.goods-offsetTop').offsetHeight
          let scrollHeight = this.refs.scroll.refs.wrapper.offsetHeight
          // ???????????????????????????
          if (elHeight >= scrollHeight) {
            this.refs.scroll.BScroll.scrollTo(0, top, 0)
          } else {
            this.refs.scroll.BScroll.scrollTo(0, this.refs.scroll.BScroll.maxScrollY, 0)
          }
        })
      }
    } else {
      if (result.data.data.list.length === 0) {
        Toast.fail('???????????????')
      } else {
        this.isLoadMore = false
        this.setState({
          goodsList: result.data.data.list,
          loadingMore: false
        }, () => {
          this.refs.scroll.BScroll.refresh()
          let top = -document.querySelector('.goods-offsetTop').offsetTop
          let elHeight = document.querySelector('.goods-offsetTop').offsetHeight
          let scrollHeight = this.refs.scroll.refs.wrapper.offsetHeight
          if (elHeight >= scrollHeight) {
            this.refs.scroll.BScroll.scrollTo(0, top, 0)
          } else {
            this.refs.scroll.BScroll.scrollTo(0, this.refs.scroll.BScroll.maxScrollY, 0)
          }
        })
      }
    }
  }

  // ????????????
  loadMore = () => {
    // ?????????????????????
    let loading = true
    setTimeout(() => {
      if (loading) {
        this.setState({
          loadingMore: true
        })
      }
    }, 1000)
    console.log('????????????')
    const { goodsList } = this.state
    let cid = getQueryString('cid')
    /*  */
    if (this.isLoadMore) {
      if (cid) {

        _homeApi(this.config).then(res => {
          if (res.data.data.list.length < 10) {
            this.isLoadMore = false
            this.setState({
              goodsList: [...this.state.goodsList, ...res.data.data.list],
              complete: true,
              smallLoading: false
            }, () => {
              this.refs.scroll.BScroll.finishPullUp()
              this.refresh()
            })
          } else if (res.data.data.list.length === 10) {
            this.isLoadMore = true
            this.setState({
              goodsList: [...this.state.goodsList, ...res.data.data.list],
              smallLoading: false,
              complete: false
            }, () => {
              this.config.data.page += 1
              this.refs.scroll.BScroll.finishPullUp()
              this.refresh()
            })
          }
        })
      } else {
        _homeApi(this.config).then(res => {
          // ???????????????????????????????????? ??????????????????
          if (goodsList.length + res.data.data.list.length === parseInt(res.data.data.total)) {
            this.isLoadMore = false
            let complete = true
            this.setState({
              goodsList: [...this.state.goodsList, ...res.data.data.list],
              loadingMore: false,
              complete
            }, () => {
              loading = false
              this.refs.scroll.BScroll.finishPullUp()
              this.refs.scroll.BScroll.refresh()
            })
          } else {
            this.isLoadMore = true
            let complete = false
            this.setState({
              goodsList: [...this.state.goodsList, ...res.data.data.list],
              loadingMore: false,
              complete
            }, () => {
              loading = false
              this.config.data.page += 1
              this.refs.scroll.BScroll.finishPullUp()
              this.refs.scroll.BScroll.refresh()
            })
          }
        })
      }
    }
  }
}

export default withRouter(Home)