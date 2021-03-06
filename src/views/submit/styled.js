import styled from "styled-components";


const RedButton = styled.div`

.button{
background-color:white;
height:9rem;
}

.praise_bubble{
  width:100px;
  height:200px;
  position:relative;
  background-color:#f4f4f4;
}

.b1{
  background-image: url("https://dev.huodiesoft.com/addons/lexiangpingou/app/resource/images/icon/liveaixing.png")
}

.bubble{
    position: absolute;
    left:50%;
    bottom:0;
}
.bl1{
    animation:bubble_y 4s linear 1 forwards ; 
 }
 .bl2{
    animation:bubble_2 $bubble_time linear .4s 1 forwards,bubble_big_2 $bubble_scale linear .4s 1 forwards,bubble_y $bubble_time linear .4s 1 forwards;   
}

@keyframes bubble_y {
    0% {
        margin-bottom:0;
        transform: scale(.5);
    }
    25%{
        margin-left:-8px;
    }
    50%{
        margin-left:8px;
    }
    75%{
        opacity:1;
        margin-left:-15px;
    }
    100% {
        margin-left:15px;
        margin-bottom:200px;
        opacity:0;
        transform: scale(1);
    }
}







`


const YellowButton = styled.div`

.button{
background-color:#ccc;
height:9rem;
 --bubble_time: 3s;
  --bubble_scale: 0.8s;
}
.praise_bubble {
  width: 100px;
  height: 200px;
  position: relative;
  background-color: #f4f4f4;
}
.bubble {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 30px;
  bottom: 0px;
  background-repeat: no-repeat;
  background-size: 100%;
  transform-origin: bottom;
}
.b1 {
   background-image: url("https://dev.huodiesoft.com/addons/lexiangpingou/app/resource/images/icon/liveaixing.png");
  // 可以使用雪碧图
  // background-position: -42px -107px;
  // background-size: 188.5px 147px;
}
.b2 {
  background-image: url("https://dev.huodiesoft.com/addons/lexiangpingou/app/resource/images/icon/liveaixing.png");
  // background-position: -84px -107px;
  // background-size: 188.5px 147px;
}
.b3 {
   background-image: url("https://dev.huodiesoft.com/addons/lexiangpingou/app/resource/images/icon/liveaixing.png");
  // background-position: 0 -107px;
  // background-size: 188.5px 147px;
}
.b4 {
   background-image: url("https://dev.huodiesoft.com/addons/lexiangpingou/app/resource/images/icon/liveaixing.png");
  // background-position: -45px -62px;
  // background-size: 188.5px 147px;
}
.b5 {
  background-image: url("https://dev.huodiesoft.com/addons/lexiangpingou/app/resource/images/icon/liveaixing.png");
  // background-position: -107px -42px;
  // background-size: 188.5px 147px;
}
.b6 {
   background-image: url("https://dev.huodiesoft.com/addons/lexiangpingou/app/resource/images/icon/liveaixing.png");
  // background-position: -107px 0;
  // background-size: 188.5px 147px;
}
.bl1 {
  animation: bubble_1 var(--bubble_time) linear 1 forwards,
    bubble_big_1 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl2 {
  animation: bubble_2 var(--bubble_time) linear 1 forwards,
    bubble_big_2 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl3 {
  animation: bubble_3 var(--bubble_time) linear 1 forwards,
    bubble_big_1 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl4 {
  animation: bubble_4 var(--bubble_time) linear 1 forwards,
    bubble_big_2 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl5 {
  animation: bubble_5 var(--bubble_time) linear 1 forwards,
    bubble_big_1 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl6 {
  animation: bubble_6 var(--bubble_time) linear 1 forwards,
    bubble_big_3 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl7 {
  animation: bubble_7 var(--bubble_time) linear 1 forwards,
    bubble_big_1 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl8 {
  animation: bubble_8 var(--bubble_time) linear 1 forwards,
    bubble_big_3 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl9 {
  animation: bubble_9 var(--bubble_time) linear 1 forwards,
    bubble_big_2 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl10 {
  animation: bubble_10 var(--bubble_time) linear 1 forwards,
    bubble_big_1 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
.bl11 {
  animation: bubble_11 var(--bubble_time) linear 1 forwards,
    bubble_big_2 var(--bubble_scale) linear 1 forwards,
    bubble_y var(--bubble_time) linear 1 forwards;
}
@keyframes bubble_11 {
  0% {
  }
  25% {
    margin-left: -10px;
  }
  50% {
    margin-left: -10px;
  }
  100% {
    margin-left: -18px;
  }
}
@keyframes bubble_10 {
  0% {
  }
  25% {
    margin-left: -20px;
  }
  50% {
    margin-left: -20px;
  }
  100% {
    margin-left: -20px;
  }
}
@keyframes bubble_9 {
  0% {
  }
  25% {
    margin-left: 10px;
  }
  50% {
    margin-left: 10px;
  }
  100% {
    margin-left: 10px;
  }
}
@keyframes bubble_8 {
  0% {
  }
  25% {
    margin-left: 20px;
  }
  50% {
    margin-left: 20px;
  }
  100% {
    margin-left: 20px;
  }
}
@keyframes bubble_7 {
  0% {
  }
  25% {
    margin-left: 3px;
  }
  50% {
    margin-left: 1px;
  }
  75% {
    margin-left: 2px;
  }
  100% {
    margin-left: 3px;
  }
}
@keyframes bubble_6 {
  0% {
  }
  25% {
    margin-left: -3px;
  }
  50% {
    margin-left: -1px;
  }
  75% {
    margin-left: -2px;
  }
  100% {
    margin-left: -3px;
  }
}
@keyframes bubble_5 {
  0% {
  }
  25% {
    margin-left: 5px;
  }
  50% {
    margin-left: -5px;
  }
  75% {
    margin-left: -10px;
  }
  100% {
    margin-left: -20px;
  }
}
@keyframes bubble_4 {
  0% {
  }
  25% {
    margin-left: -5px;
  }
  50% {
    margin-left: -5px;
  }
  75% {
    margin-left: 20px;
  }
  100% {
    margin-left: 10px;
  }
}
@keyframes bubble_3 {
  0% {
  }
  25% {
    margin-left: -20px;
  }
  50% {
    margin-left: 10px;
  }
  75% {
    margin-left: 20px;
  }
  100% {
    margin-left: -10px;
  }
}
@keyframes bubble_2 {
  0% {
  }
  25% {
    margin-left: 20px;
  }
  50% {
    margin-left: 25px;
  }
  75% {
    margin-left: 10px;
  }
  100% {
    margin-left: 5px;
  }
}
@keyframes bubble_1 {
  0% {
  }
  25% {
    margin-left: -8px;
  }
  50% {
    margin-left: 8px;
  }
  75% {
    margin-left: -15px;
  }
  100% {
    margin-left: 15px;
  }
}
@keyframes bubble_big_1 {
  0% {
    transform: scale(0.3);
  }
  100% {
    transform: scale(1.2);
  }
}
@keyframes bubble_big_2 {
  0% {
    transform: scale(0.3);
  }
  100% {
    transform: scale(0.9);
  }
}
@keyframes bubble_big_3 {
  0% {
    transform: scale(0.3);
  }
  100% {
    transform: scale(0.6);
  }
}
@keyframes bubble_y {
  0% {
    margin-bottom: 0;
  }
  10% {
    margin-bottom: 0;
  }
  75% {
    opacity: 1;
  }
  100% {
    margin-bottom: 200px;
    opacity: 0;
  }
}



`

export {
    RedButton,
    YellowButton
}