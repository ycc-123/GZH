import React, { Component, Fragment } from 'react';
import styled from 'styled-components'
import MenuItem from './MenuItem'

const MemberMenuStyle = styled.div`
  background-color: white;
  margin-top: .15rem;
  border-radius: .3rem;

table {
    border-collapse: collapse;
    border-spacing: 0;
    overflow: hidden;
}

tr {
    width: 100%;
    overflow: hidden;
}

.icon-td {
    text-align: center;
    height: 3.15rem;
    width: 3.15re;
    border-right: rgba(0, 0, 0, .1) solid .027rem;
    border-bottom: rgba(0, 0, 0, .1) solid .027rem;
}

.version::after{
    content: " ";
    border: 2px solid red;
    border-radius: .5rem;
    position: absolute;
    z-index: 1000;
    right: 0%;
    margin-right: .3rem;
    margin-top: -.08rem;
}

`


class ProfileMember extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidUpdate() {
    let td = document.querySelectorAll('.icon-td')
    Array.prototype.slice.call(td).forEach((item => {
      if (!item.querySelector('img')) {
        item.style.border = 'none'
      }
    }))

  }


  render() {
    let itemRow = 0, icon = []
    const { memberMenu } = this.props
    memberMenu.forEach((item, index) => {
      if (!icon[parseInt(index / 3)]) {
        icon[parseInt(index / 3)] = []
      }
      icon[parseInt(index / 3)].push(item)
    })
    if (icon.length !== 0) {
      for (let i = 0; i < 2; i++) {
        if (icon[icon.length - 1].length < 3) {
          icon[icon.length - 1].push({})
        }
      }
    }



    return (
      <MemberMenuStyle itemNum={itemRow}>
        <table cellSpacing='0' cellPadding='0' style={{ width: '100%', tableLayout: 'fixed' }}>
          <tbody>
            {icon.map((item, index) => {
              return (
                <tr key={index + 1}>
                  {item.map((item, index1) => {
                    return (
                      <Fragment key={index1 + 1}>
                        <MenuItem item={item} />
                      </Fragment>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </MemberMenuStyle>
    )
  }

}

export default ProfileMember;