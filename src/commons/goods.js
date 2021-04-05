export default class Goods {
  constructor(itemInfo) {
    this.id = itemInfo.id  // 商品id
    this.oprice = itemInfo.oprice // 单买价格
    this.gprice = itemInfo.gprice // 团购价
    this.mprice = itemInfo.mprice // 市场价
    this.selltype = itemInfo.selltype // 单买||团购
    this.gname = itemInfo.gname // 描述
    this.gnum = itemInfo.gnum // 商品库存
    this.salenum = itemInfo.salenum // 已售
    this.num = parseInt(itemInfo.num)   // 默认数量
    this.totalPrice = (this.num * this.oprice).toFixed(2) // 总价
    this.gimg = itemInfo.gimg // 图片
  }
} 