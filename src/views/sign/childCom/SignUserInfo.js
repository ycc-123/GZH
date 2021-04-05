import React, { memo, useEffect, useRef, useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { SignContext } from '../Sign'

const SignGroup = memo(props => {

  const content = useContext(SignContext)

  const [imgState, setImgState] = useState(1)
  const [spanColor] = useState(() => {
    return ['white', 'red', 'yellow']
  })
  const [userInfoState, setUserInfoState] = useState(() => {
    return {
      teamNumber: [], // 开团需要人数
      avatarImg: [] // 当前开团人数
    }
  })
  // const [user] = useState(() => {
  //   let arr = []
  //   const { teamNumber } = content.signState
  //   for (let i = 0; i < teamNumber; i++) {
  //     arr.push({})
  //   }
  //   return arr
  // })

  // const [userImg, setUserImg] = useState([])

  const [roundTopBottom] = useState(() => {
    let arr = []
    for (let i = 0; i < 24; i++) {
      arr.push({})
    }
    return arr
  })

  const [roundLeftRight] = useState(() => {
    let arr = []
    let length = Math.ceil(content.signState.teamNumber / 6) * 4 + 8
    for (let i = 0; i < length; i++) {
      arr.push({})
    }
    return arr
  })
  // const [imgState, setImgState] = useState(1)

  const timer = useRef()

  const history = useHistory()



  useEffect(() => {
    timer.current = setInterval(() => {
      setImgState(prev => {
        return prev !== 3 ? prev + 1 : 1
      })
    }, 500);
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  useEffect(() => {
    setUserInfoState(prev => {
      const { avatarImg, teamNumber } = content.signState
      let arr = []
      for (let i = 0; i < teamNumber; i++) {
        arr.push({})
      }
      const newState = {
        avatarImg,
        teamNumber: arr
      }
      return Object.assign({}, prev, newState)
    })
    // setUserImg(content.signState.avatarimg)
  }, [content.signState.avatarImg, content.signState.teamNumber])

  const signGroup = useCallback(() => {
    history.push({ pathname: '/sign/group', search: `group_id=${content.signState.invitationId}` })
  }, [content.signState.invitationId])

  return (
    <Style>
      <article className='iphone12promax256g'>
        <aside className='left'>
          {
            roundLeftRight.map((item, index) => {
              return (
                <span className='round' style={{ backgroundColor: spanColor[imgState] }} key={index}></span>
              )
            })
          }
        </aside>
        <section className='sign-container'>

          <header className='sign-header'>
            {
              roundTopBottom.map((item, index) => {
                return (
                  <span className='round' style={{ backgroundColor: spanColor[imgState] }} key={index}></span>
                )
              })
            }
          </header>
          <div className='main'>
            <button className='iphone12pro64g'>快来一起组队赚积分</button>
            <div className='iphone12pro256g'>
              <ul>
                {
                  userInfoState.teamNumber.map((item, index) => {
                    return (
                      <li className='user-headimgurl' key={index} onClick={signGroup}>
                        {
                          userInfoState.avatarImg[index] ?
                            <img className='user-img' src={userInfoState.avatarImg[index]} /> :
                            <>
                              <span className='user-l'></span>
                              <span className='user-c'></span>
                            </>
                        }
                        {/* <span className='user-l'></span>
                        <span className='user-c'></span> */}
                      </li>
                    )
                  })
                }
              </ul>

            </div>
            <button className='iphone12pro128g'>
              <span>限时组队</span> &ensp;
              <span>积分翻倍</span>
              <p className='time'>({content.signState.teamTime})</p>
            </button>
          </div>
          <footer className='sign-footer'>
            {
              roundTopBottom.map((item, index) => {
                return (
                  <span className='round' style={{ backgroundColor: spanColor[imgState] }} key={index}></span>
                )
              })
            }
          </footer>
        </section>
        <aside className='right'>
          {
            roundLeftRight.map((item, index) => {
              return (
                <span className='round' style={{ backgroundColor: spanColor[imgState] }} key={index}></span>
              )
            })
          }
        </aside>

      </article>

    </Style>
  )
})

const Style = styled.div`

position: relative;
margin: .2rem auto;
width: 9.33rem;
overflow: hidden;

.iphone12promax256g {
  display: flex;
  border-radius: .13rem;
  overflow: hidden;
}

.iphone12promax {
  width: 100%;
  height: auto;
}

.iphone12pro64g {
  margin: 0 auto;
  width: 4rem;
  height: .83rem;
  font-size: .4rem;
  color: #fff;
  background: linear-gradient(45deg, #F9642A 0%, #F9642A 100%);
  border-bottom-left-radius: .65rem;
  border-bottom-right-radius: .65rem;
}

.iphone12pro128g {
  margin: 0 auto .1rem;
  width: 4.41rem;
  height: .87rem;
  border-radius: .43rem;
  color: #fff;
  font-size: .36rem;
  background: linear-gradient(45deg, #F9642A 0%, #F9642A 100%);
}

.iphone12pro256g {
  margin-top: .3rem;
}

.iphone12pro256g ul {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: .3rem;
}

.user-headimgurl {
  position: relative;
  margin: .2rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 1px .06rem #FFCDA1;
  overflow: hidden;
}

.user-img {
  display: block;
  width: 1rem;
  height: auto;
  border-radius: 50%;
}

.user-l,
.user-c {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #F9732A;
}

.user-l {
  width: .3rem;
  height: .06rem;
}

.user-c {
  width: .06rem;
  height: .3rem;
}

.round {
  /* flex: 1; */
  width: .16rem;
  height: .16rem;
  border-radius: 50%;
  background-color: #fff;
}

.time {
  margin-top: .05rem;
  font-size: .17rem;
}

.sign-header, 
.sign-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 8.93rem;
  height: .2rem;
}

.sign-header, 
.sign-footer,
.left,
.right {
  background: linear-gradient(45deg, #F9642A 0%, #F9642A 100%);
}

.sign-container {
  display: flex;
  flex-flow: column;
  width: 8.93rem;
}

.left,
.right {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-evenly;
}

.left, 
.right {
  width: .2rem;
  background-color: skyblue;
}

.main {
  display: flex;
  flex-flow: column;
  width: 8.93rem;
  background: linear-gradient(45deg, #FFE8B6 0%, #FFCDA1 100%);
}



/* .sign-footer {

} */


`

export default SignGroup;