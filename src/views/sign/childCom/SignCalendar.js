import React, { useState, useCallback, useEffect, memo, useRef, useContext } from 'react'
import styled from 'styled-components'
import laydate from 'layui-laydate'
import { Modal, Toast } from 'antd-mobile'


import { store } from 'store/index'

import { _api } from 'network/api'

import { SignContext } from '../Sign'

import 'layui-laydate/src/theme/default/laydate.css'

// import { }


/**
 * 
 * time: 2020-1-9
 * author: lkd
 * content: 签到基础功能开发
 * @param {laydate} 生成日历 相关api: https://www.layui.com/doc/modules/laydate.html#use
 * @param {elem} 需要挂载到哪个dom上
 * @param {position} 定位
 * @param {range}  开启左右面板范围选择
 * @param {showBottom} 是否显示底部按钮
 * @param {ready} 渲染后回调
 * @param {change} 日期时间被切换后的回调
 * @param {td} 日历每天的dom
 * @param {showTd} 日历需要显示的dom  默认会显示上个月下个月的时间，可通过css控制
 * @param {getTdDom} fun 判断用户本月签到时间，并修改dom
 * @param {monthSign} arr 本月签到
 * @param {仮面ライダー} 卡面莱打---->假面骑士
 * 
 * */

const SignCalendar = memo((props) => {

  // const [state, setState] = useState(false)

  // console.log(state)

  const context = useContext(SignContext)

  const tdRef = useRef()
  const contextRef = useRef()

  contextRef.current = context.signState.monthSign
  const alert = Modal.alert

  const getTdDom = (date) => {
    console.log(context.signState.monthSign)
    let td = Array.prototype.slice.call(document.querySelector('.layui-laydate-content').getElementsByTagName('td'))
    let prev = 0, next = 0, showTd
    for (let i = 0; i < td.length; i++) {
      if (td[i].className.indexOf('laydate-day-prev') === 0) {
        prev += 1
      } else {
        break;
      }
    }
    for (let i = td.length - 1; i >= 0; i--) {
      if (td[i].className.indexOf('laydate-day-next') === 0) {
        next += 1
      } else {
        break;
      }
    }
    showTd = td.splice(prev, td.length - prev - next)
    console.log(showTd)
    tdRef.current = showTd
    for (let i = 0; i < showTd.length - 1; i++) {
      showTd[i].addEventListener('click', tdClick, false)
    }
    contextRef.current.forEach(item => {
      for (let i = 0; i <= showTd.length - 1; i++) {
        if (showTd[i].innerText === item) {
          let span = document.createElement('span')
          span.className = 'td-y'
          span.innerText = showTd[i].innerText
          showTd[i].appendChild(span)
          // break;
        }
      }
    })
  }

  useEffect(() => {
    console.log(laydate, '日历时间')
    laydate.render({
      elem: '#lay',
      position: 'static',
      range: false,
      showBottom: false,
      ready: (date) => {
        getTdDom(date)
      },
      change: (value, date, endDate) => {
        const { appConfig } = store.getState()
        const api_config = {
          action: 'signinInfo',
          data: {
            uniacid: appConfig.uniacid,
            openid: appConfig.wxUserInfo.openid,
            date: date.year + '-' + date.month + '-' + date.date,
          }
        }
        _api(api_config).then(res => {
          if (res.data.status === 200) {
            context.supplementarySign(res.data.data)
          }
        })
      }
    })
  }, [])

  useEffect(() => {
    laydate.ready((date) => {
      getTdDom(date)
    })
    return () => {
      let showTd = tdRef.current
      console.log(tdRef.current, '需要移除的dom')
      for (let i = 0; i <= showTd.length - 1; i++) {
        showTd[i].removeEventListener('click', tdClick)
      }
    }
  }, [context.signState.monthSign])


  const tdClick = useCallback((e) => {
    // 开关
    if (context.signState.supplementary === 0) {
      return
    }
    const td = e.target.tagName
    const span = e.target.querySelector('span')
    // 当点到td上时 span元素不存在时
    if (td === 'TD' && span) {
      return
    }
    const dateText = e.target.innerText
    const prove = context.signState.monthSign.find(item => item === dateText)
    // 已经签到的天数不能补签
    if (prove) {
      return
    }
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()

    const dateDay = e.target.getAttribute('lay-ymd')

    const dateArr = dateDay.split('-')
    const signY = parseInt(dateArr[0])
    const signM = parseInt(dateArr[1])
    const signD = parseInt(dateArr[2])
    // 不能在未来做事情
    // 年份大于2020 比当前年份小
    if (signY > 2020 && signY <= y) {
      // 补签的月份是本月时
      if (signM === m) {
        // 不能补签今天和未来
        if (signD >= d) {
          return
        }
      } else if (signM > m) {
        // 补签月份大于本月
        return
      }
    } else {
      return
    }

    alert(`是否消耗${context.signState.supplementary_cost}积分补签`, '', [
      {
        text: '取消', onPress: () => {
          e.stopPropagation()
        }
      },
      {
        text: '确认', onPress: () => {
          e.stopPropagation()
          const { appConfig } = store.getState()
          const api_config = {
            action: 'signin',
            data: {
              uniacid: appConfig.uniacid,
              openid: appConfig.wxUserInfo.openid,
              date: dateDay,
              is_supplementary: 1
            }
          }
          _api(api_config).then(res => {
            if (res?.data?.status === 200) {
              context.supplementarySign(res.data.data)
              Toast.info('补签成功', 1)
            }
          })
        }
      },
    ])
  }, [context.signState.monthSign])

  return (
    <Style>
      <div id='lay'></div>
    </Style>
  );
})


const Style = styled.div`

position: relative;
width: 100%;
padding-top: .2rem;

.layui-laydate-static {
  left: 50%;
  transform: translate(-50%, 0);
}

.layui-laydate-main {
  margin: 0 auto;
  width: 9.32rem;
}

.laydate-next-y,
.laydate-prev-y {
  display: none;
}

.layui-laydate-content th, 
.layui-laydate-content td {
  position: relative;
  padding: 0;
  width: 1.33rem;
  height: .8rem;
  font-size: .4rem;
}

.laydate-day-prev,
 .laydate-day-next {
  visibility: hidden;
  transition-duration: 0s !important;
}

.layui-laydate .layui-this {
  background-color: transparent !important;
  color: #666 !important;
}

.td-y {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.2rem;
  height: 1.2rem ;
  line-height: 1.2rem;
  font-size: .8rem;
  border-radius: 50%;
  color: #F62A2A;
  background-color: #FFF3F3;
  transform: translate(-50%, -50%) scale(0.5);
}



`

export default SignCalendar;