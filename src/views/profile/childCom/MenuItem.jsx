
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { store } from 'store'
import { _forwardLottery } from 'network/profile'
import { Toast, Modal } from 'antd-mobile'

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: ''
    }
  }



  clearClass = () => {
    let el = document.getElementById('version')
    el.classList.remove('version')
  }


  clearStorage = () => {
    let el = document.getElementById('version')
    el.classList.remove('version')
    localStorage.clear()
    window.location.reload()
  }


  async changeMenuItem(key) {
    const { isApplet } = store.getState().appConfig
    const alert = Modal.alert
    switch (key) {
      case 'member':
        if (store.getState().memberUserInfo.member_status === '1') {
          if (isApplet) {
            window.navigateToWebWiew('#/memberinfo')
          } else {
            this.props.history.push('/memberinfo')
          }

        } else {
          if (isApplet) {
            window.navigateToWebWiew('#/applymembership')
          } else {
            this.props.history.push({ pathname: '/applymembership' })
          }
        }
        break;
      case 'online':
        if (store.getState().memberUserInfo.member_status === '1') {
          if (isApplet) {
            window.navigateToWebWiew('#/balance')
          } else {
            this.props.history.push('/balance')
          }
        } else {
          // alert("请先注册会员")
          Toast.info('请先注册会员', 1)
          this.timer = setTimeout(() => {
            this.props.history.push({ pathname: '/applymembership' })
          }, 1000)
        }
        break;
      case 'payment':
        if (store.getState().memberUserInfo.member_status === '1') {

          if (isApplet) {
            window.navigateToWebWiew('#/Memberma')
          } else {
            this.props.history.push('/Memberma')
          }


        } else {
          Toast.info('请先注册会员', 1)
          this.timer = setTimeout(() => {
            this.props.history.push({ pathname: '/applymembership' })
          }, 1000)
        }

        break;
      case 'offline':
        if (store.getState().memberUserInfo.member_status === '1') {

          if (isApplet) {
            window.navigateToWebWiew('#/off')
          } else {
            this.props.history.push('/off')
          }
        } else {
          Toast.info('请先注册会员', 1)
          this.timer = setTimeout(() => {
            this.props.history.push({ pathname: '/applymembership' })
          }, 1000)
        }

        break;
      case 'integral':
        if (store.getState().memberUserInfo.member_status === '1') {

          if (isApplet) {
            window.navigateToWebWiew('#/crechang')
          } else {
            this.props.history.push('/crechang')
          }


        } else {
          Toast.info('请先注册会员', 1)
          this.timer = setTimeout(() => {
            this.props.history.push({ pathname: '/applymembership' })
          }, 1000)
        }

        break;

      case 'lottery':
        const { wxUserInfo, uniacid } = store.getState().appConfig
        const forwardLotConfig = {
          action: 'forwardLot',
          data: {
            uniacid: uniacid
          }
        }
        let lotList = await _forwardLottery(forwardLotConfig)
        // 先当前判断有没有活动
        if (parseInt(lotList.data.status) === 400) {
          Toast.info(lotList.data.msg, 1)
        } else {
          console.log(lotList.data.data[0].id, '参加活动列表')
          let id = lotList.data.data[0].id
          // 有活动 判断是否已参加活动
          const lotteryConfig = {
            action: 'activityDetail',
            data: {
              uniacid: uniacid,
              openid: wxUserInfo.openid,
              id,
            }
          }
          let activeDetail = await _forwardLottery(lotteryConfig)
          if (activeDetail.data.status === 400 && activeDetail.data.msg === "你已参与过该活动") {
            //跳转到抽奖码

            if (isApplet) {
              window.navigateToWebWiew('#/lotterycode/' + id)
            } else {
              this.props.history.push('/lotterycode/' + id)
            }

          } else {

            if (isApplet) {
              window.navigateToWebWiew('#/Lottery/' + id)
            } else {
              this.props.history.push('/Lottery/' + id)
            }

          }
        }


        break;
      case 'corpsOrder':

        if (isApplet) {
          window.navigateToWebWiew('#/corpsOrder')
        } else {
          this.props.history.push('/corpsOrder')
        }

        break;
      case 'myCorps':
        if (isApplet) {
          window.navigateToWebWiew('#/mygroup')
        } else {
          this.props.history.push('/mygroup')
        }
        break;
      case 'address':

        localStorage.setItem('goBackSubmitUrl', JSON.stringify(window.location.href))

        if (isApplet) {
          window.navigateToWebWiew('#/myaddress/aa')
        } else {
          this.props.history.push('/myaddress/aa')
        }

        break;
      case 'allPluralism':
        // this.props.history.push('/Applyjob')
        // 判断是否注册兼职
        const { type, enable } = store.getState().memberUserInfo

        if ((type === null || type === '0') && (enable === '0' || enable === null)) {
          if (isApplet) {
            window.navigateToWebWiew('#/Applyjob')
          } else {
            this.props.history.push('/Applyjob')
          }
        } else if (type === '1' && (enable === null || enable === '0')) {
          Toast.info('您已申请兼职，请等待商家审核', 2)
        } else if (type === '1' && enable === '1') {

          if (isApplet) {
            window.navigateToWebWiew('#/timejob')
          } else {
            this.props.history.push('/timejob')
          }
        }
        break;
      case 'version':
        alert('是否更新商城配置', '', [
          { text: '确认', onPress: () => { this.clearStorage() } },
          { text: '取消', onPress: () => { this.clearClass() } },
        ])
        break;
      case 'report':
        if (isApplet) {
          window.navigateToWebWiew('#/annual')
        } else {
          this.props.history.push('/annual')
        }
        break;
      case 'signin':
        if (isApplet) {
          window.navigateToWebWiew('#/sign')
        } else {
          this.props.history.push('/sign')
        }
        break;
      case 'xsyd':
        const pageGuide = {
          home: 0,
          cart: 0,
          submit: 0,
          category: 0
        }
        localStorage.setItem('page', JSON.stringify(pageGuide))

        if (isApplet) {
          window.navigateToWebWiew('#/home')
        } else {
          this.props.history.replace('/home')
        }
        break;
      case 'luckydraw':
        if (isApplet) {
          window.navigateToWebWiew('#/luckydraw')
        } else {
          this.props.history.push('/luckydraw')
        }
        break;
      case 'monthlyMember':
        if (isApplet) {
          window.navigateToWebWiew('#/honorable/vip')
        } else {
          this.props.history.push('/honorable/vip')
        }
        break;
      default:
        break;
    }
  }

  render() {
    // console.log(this.props)
    const { item } = this.props

    return (
      <td className='icon-td' onClick={this.changeMenuItem.bind(this, item.route)} style={{ position: 'relative' }}>
        {item.icon && <img src={item.icon} style={{ width: '.6rem', height: '.6rem' }} />}
        <p style={{ marginTop: '.2rem', fontSize: '.32rem' }}>{item.name}</p>
        {item.route === 'version' && <p id='version' className='version' style={{ fontSize: '.2rem', color: 'rgba(0, 0, 0, .3)' }}>最新版v3.0.6.0.5</p>}
      </td>
    );
  }
}

export default withRouter(MenuItem);