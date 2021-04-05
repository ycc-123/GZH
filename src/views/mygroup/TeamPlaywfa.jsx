import React, { Component, Fragment } from 'react'
import Button from './Button'

export default class TeamPlaywfa extends Component {
    render() {
        return (
            <Fragment>
                <Button />
                <div style={{ marginTop: '2rem' }}>
                    <img
                        style={{ objectFit: "cover", height: "14.8rem", paddingTop: ".2rem" }}
                        src="https://res.lexiangpingou.cn/images/vip/wfa.png" alt="" />
                </div>
            </Fragment>

        )
    }
}
