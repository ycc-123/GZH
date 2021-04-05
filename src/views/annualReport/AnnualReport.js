import React, { useState, useEffect, memo } from 'react';
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { _apiUO } from 'network/api'

const AnnualReport = memo((props) => {

  const [data, setData] = useState(null)

  useEffect(() => {
    const action = 'yearReport'
    _apiUO(action).then(res => {
      if (res.data.status === 200) {
        let time
        const { report } = res.data.data
        if (report.consumption_time === 'am') {
          time = '上午'
        } else if (report.consumption_time === 'pm') {
          time = '下午'
        } else if (report.consumption_time === 'nm') {
          time = '晚上'
        } else if (report.consumption_time === 'aam') {
          time = '凌晨'
        } else {
          time = '什么时间'
        }
        setData(Object.assign({}, res.data.data, { time }))
      }
    })

  }, [])

  return data ?
    <Style>
      <div className='box' style={{ backgroundImage: `url(${data.businesinfo.fans_data_image})` }}>
        <header>
          <p className='annual-user'>亲爱的“
            <span>{data.report.nickname ? data.report.nickname : '用户'}</span>
            ”，这是您和“
            <span>{data.businesinfo.name}</span>
            ”一起度过的{data.report.year}
          </p>
          <table className='tb'>
            <tbody>
              <tr className='tr'>
                <td>
                  <p>总消费</p>
                  <p>
                    {data.report.total_pay ? data.report.total_pay : '0'}
                    <span className='text'>元</span>
                  </p>
                </td>
                <td>
                  <p>支付了</p>
                  <p>
                    {data.report.total_order ? data.report.total_order : '0'}
                    <span className='text'>单</span>
                  </p>
                </td>
              </tr>
              <tr className='tr'>
                <td>
                  <p>会员余额消费</p>
                  <p>
                    {data.report.member_pay ? data.report.member_pay : '0'}
                    <span className='text'>元</span>
                  </p>
                </td>
                <td>
                  <p>热衷消费时间</p>
                  <p>{data.time}</p>
                </td>
              </tr>
              <tr className='tr'>
                <td>
                  <p>参团</p>
                  <p>{data.report.tuan ? data.report.tuan : 0}</p>
                </td>
                <td>
                  <p>组团成功</p>
                  <p>{data.report.success_tuan ? data.report.success_tuan : 0}</p>
                </td>
              </tr>
              <tr className='tr'>
                <td>
                  <p>消费排行</p>
                  <p>
                    <span className='text'>第</span>
                    {data.report.pay_rank}
                    <span className='text'>名</span>
                  </p>
                </td>
                <td>
                  <p>超过了</p>
                  <p>{data.rank}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ margin: '0 .8rem', textAlign: 'left' }}>{new Date().getFullYear()}，“{data.businesinfo.name}”继续为您服务</p>
        </header>
        <footer>
          <img className='img' src={data.businesinfo.qrcodeImg} alt=''/>
        </footer>
      </div>

    </Style> :
    <></>
})

const Style = styled.div`

.box {
  width: 100vw;
  height: 100vh;
  background-size: 100vw 100vh;
  overflow: hidden;
  color: #fff;
  font-size: .48rem;
}

.annual-user {
  margin: .5rem;
}

.tb {
  margin: 0 .8rem;
  width: 8.4rem;
}

.tr {
  display: flex;
  margin-bottom: .25rem;
}

td {
  flex: 1;
}

.text {
  font-size: .32rem;
}

.img {
  position: fixed;
  left: 50%;
  bottom: .2rem;
  transform: translate(-50%, 0);
  width: 3rem;
  height: 3rem;
}


`

export default withRouter(AnnualReport);