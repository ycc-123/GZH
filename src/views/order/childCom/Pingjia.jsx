import React, { Component } from 'react'
import styled from 'styled-components'

class Pingjia extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: true
    }
  }
  render() {
    return (
      <PingjiaStyle>
        <div className="pingjia">
          <div className="pingjiaframe">
            <div className="pingjiabtnkuang">
              <div className="pingjiabtnframe">
                <div className="pingjiabtn1">好用(1)</div>
                <div className="pingjiabtn2">正品(10)</div>
                <div className="pingjiabtn1">便宜(999)</div>
              </div>
              <div className="pingjiabtnframe">
                <div className="pingjiabtn1">好用(1)</div>
                <div className="pingjiabtn2">正品(10)</div>
                <div className="pingjiabtn1">便宜(999)</div>
              </div>
            </div>

            <div className="xiantiao"></div>
            <div className="pingjialeikuang">
              <div className="pingjialeikf">
                <img className="pingjiaimg" />
                <div className="pingjiahaohuai">好评<span>(99)</span></div>
              </div>
              <div className="pingjialeikf">
                <img className="pingjiaimg" />
                <div className="pingjiahaohuai">好评<span>(99)</span></div>
              </div>
              <div className="pingjialeikf">
                <img className="pingjiaimg" />
                <div className="pingjiahaohuai">好评<span>(99)</span></div>
              </div>
            </div>
            <div className="xiantiao"></div>

            <div className="pingjiaren">
              <div className="pingjiarenkuang">
                <img className="pingjiarentximg" />
                <div>
                  <div className="pingjiarenkuangtext1">用户名字加粗0.32</div>
                  <div className="pingjiarenkuangtext2">时间20px</div>
                </div>
              </div>
              <div className="pingjiarenkuangtext3">商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开</div>
            </div>
            <div className="xiantiao"></div>

            <div className="pingjiaren">
              <div className="pingjiarenkuang">
                <img className="pingjiarentximg" />
                <div>
                  <div className="pingjiarenkuangtext1">用户名字加粗0.32</div>
                  <div className="pingjiarenkuangtext2">时间20px</div>
                </div>
              </div>
              <div className="pingjiarenkuangtext3">商品质量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开</div>
            </div>
            <div className="xiantiao"></div>


            <div className="pingjiaren">
              <div className="pingjiarenkuang">
                <img className="pingjiarentximg" />
                <div>
                  <div className="pingjiarenkuangtext1">用户名字加粗0.32</div>
                  <div className="pingjiarenkuangtext2">时间20px</div>
                </div>
              </div>
              <div className="pingjiarenkuangtext3">商量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开</div>
            </div>
            <div className="xiantiao"></div>

            <div className="pingjiaren">
              <div className="pingjiarenkuang">
                <img className="pingjiarentximg" />
                <div>
                  <div className="pingjiarenkuangtext1">用户名字加粗0.32</div>
                  <div className="pingjiarenkuangtext2">时间20px</div>
                </div>
              </div>
              <div className="pingjiarenkuangtext3">商量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开商量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开</div>
            </div>
            <div className="xiantiao"></div>

            <div className="pingjiaren">
              <div className="pingjiarenkuang">
                <img className="pingjiarentximg" />
                <div>
                  <div className="pingjiarenkuangtext1">用户名字加粗0.32</div>
                  <div className="pingjiarenkuangtext2">时间20px</div>
                </div>
              </div>
              <div className="pingjiarenkuangtext3">商量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开商量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开</div>
            </div>
            <div className="xiantiao"></div>

            <div className="pingjiaren">
              <div className="pingjiarenkuang">
                <img className="pingjiarentximg" />
                <div>
                  <div className="pingjiarenkuangtext1">用户名字加粗0.32</div>
                  <div className="pingjiarenkuangtext2">时间20px</div>
                </div>
              </div>
              <div className="pingjiarenkuangtext3">商量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开商量非常好物流也很快，商品质量非常好物流也很快，商品质量非常好物流也很快，适合长期适用价格了卡歌功颂德离开</div>
            </div>
            <div className="xiantiao"></div>



            
            <div className="pingjiadibu">查看更多</div>






          </div>
        </div>

      </PingjiaStyle>
    )
  }
}

const PingjiaStyle = styled.div`
.pingjia{
  width:100%;
  padding:0 0.32rem;
}
.xiantiao{
  width:100%;
  height:0.01rem;
  background:#CCC;
}
.pingjiaframe{
  background:white;
  height:calc(100vh - 1.72rem);
}
.pingjiabtnkuang{
  padding:0.4rem;
}
.pingjiabtnframe{
  display:flex;
  justify-content:space-between;
  margin-bottom:0.4rem;
}
.pingjiabtn1{
  width:2.4rem;
  height:0.67rem;
  line-height:0.67rem;
  border:0.01rem solid #CCC;
  text-align:center;
  border-radius: 0.2rem;
}
.pingjiabtn2{
  width:2.67rem;
  height:0.67rem;
  line-height:0.67rem;
  border:0.01rem solid var(--theme-font-color);
  text-align:center;  
  color:var(--theme-font-color);
  border-radius: 0.2rem;
}
.pingjialeikuang{
  display:flex;
  padding:0 0.32rem;
  height:1.2rem;
  align-items:center;
  justify-content: space-between;
}
.pingjialeikf{
  display:flex;
  align-items:center;
  
}
.pingjiaimg{
  width:0.67rem;
  height:0.67rem;
  background:skyblue;
  margin-right:0.4rem;
  border-radius:50%;
}
.pingjiahaohuai{
  font-size:0.32rem;
}
.pingjiaren{
  padding:0 0.32rem;
}
.pingjiarenkuang{
  display:flex;
  align-items:center;
  height:1.6rem;
}
.pingjiarentximg{
  width:0.8rem;
  height:0.8rem;
  border-radius:50%;
  background:skyblue;
  margin-right:0.2rem;
}
.pingjiarenkuangtext1{
  font-size:0.32rem;
  font-weight:600;
}
.pingjiarenkuangtext2{
  font-size:0.27rem;
}
.pingjiarenkuangtext3{
  font-size:0.27rem;
  margin-bottom:0.4rem;
}

.pingjiadibu{
  position:absolute;
  font-size:0.32rem;
  font-weight:600;
  text-align:center;
  bottom: 3%;
  left: 44%;
  color: red;
}
`
export default Pingjia;