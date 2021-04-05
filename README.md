# 公众号商城

### appConfig 授权用户信息 商户号存放结构
```
 appConfig:{
      uniacid:'8888',
      wxUserInfo:{
        openid:'dasfdas5646',
        nickname:'udouo'
        ..............
      }
    }

    ex: openid: store.getState().appConfig.wxUserInfo.openid
```

### memberUserInfo  会员信息
```
memberUserInfo:{
  id:'789456',
  member_balance:'8797',
  ···················

}

ex: memberID:store.getState().memberUserInfo.id

```
