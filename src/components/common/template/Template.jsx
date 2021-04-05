import React, { Component } from 'react'
import styled from 'styled-components'


class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return (  
      <TemplateStyle>
        <div className='mark'>

        </div>
      </TemplateStyle>
    );
  }
}

const TemplateStyle = styled.div`

.mark {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.5);
}

`
 
export default Template;