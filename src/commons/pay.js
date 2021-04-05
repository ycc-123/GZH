
/* 
export function WXPay() {
  const that = this;
  function onBridgeReady() {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId":"wx866e0a731d303c29",
        "timeStamp":"1594192443",
        "nonceStr":"lvrzlifp9087l2u34nhw3mqu6pz6t934",
        "package":"prepay_id=wx0815140316455342ed1f49031723908500",
        "signType":"MD5",
        "paySign":"FAA77E04923378AE17FCAB31682165BE"
        },
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          alert("支付成功");
          that.props.history.push(RouterList.private);
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        } else {
          alert("支付失败,请重试");
        }
      }
    );
  }
} */