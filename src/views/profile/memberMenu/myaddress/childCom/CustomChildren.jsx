import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'


export default class CustomChildren extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.extra
        }
    }

    render() {
        console.log(this)
        this.props.parent.aaa(this.props.extra)
        // console.log(this.props.extra)
        let props = this.props
        return (

            <div
                onClick={props.onClick}
                style={{ backgroundColor: 'transparent', fontSize: '.32rem', width: '7.22rem' }}
            >
                <div className="test" style={{ display: 'flex', height: '1.16rem', lineHeight: '1.16rem', position: 'relative', borderBottom: 0 }}>
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.children}</div>
                    <div style={{ textAlign: 'right', color: '#a9abae', }}>{props.extra.replace(RegExp(",", "g"), "-")}</div>
                </div>
            </div>
        )
    }
}
