import React, { Component } from 'react';
import styled from 'styled-components'


const SearchBoxStyle = styled.div`

  
.searchBox{
  margin: .4rem .32rem;
  height: .8rem;
  // margin: .4rem 1px;
  display:flex;
  flex-direction:row;
  justify-content: space-between;
}
.searchimg input{
  font-size:.35rem;
  width:5rem;
  height:.7rem;
  // background-color:red;
  position:absolute;
  top:-.1rem;
  left:.6rem;
  border: none;
  // text-align: center;
  color: #474747;
}
.searchimg img{
  padding-top:.05rem;
  width:100%;
  height:100%;
}
.searchimg{
  width:.35rem;
  position:absolute;
  top:1.68rem;
  left:.9rem;
}
.searchInput{
  position:relative;
  background-color: #fff;
  width: 6.773rem;
  border-radius: 1rem;
  border: none;
  text-align: center;
  color: #474747;
}
.searchBtn{
  color: white;
  width: 2.26666rem;
  background: var(--theme-font-color);
  text-align: center;
  font-size: .313rem;
  letter-spacing: .05rem;
  padding: .1333rem .42666rem;
  border-radius: 1rem ;
}

`


class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderno:''
    }
  }




  render() {
    return (
        <SearchBoxStyle>
          <div className="searchBox">
            <div className="searchInput"></div>
            <div className='searchimg'>
              <img src="https://res.lexiangpingou.cn/images/vip/search.png" alt=''/>
              <input type="search" name="orderno" onChange={this.handelInputChang} value={this.state.orderno} placeholder={'请输入搜索全部订单'} />
            </div>
            <button className="searchBtn" onClick={this.searchItemOrder} >搜索</button>
          </div>
        </SearchBoxStyle>
    );
  }


  handelInputChang = (e) =>{
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  searchItemOrder = () => {
      this.props.searchOrder(this.state.orderno)
  }
}

export default SearchBox;