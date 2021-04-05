
// export const getBaseUrl = () => {
//   let BASE_URL = '';
//   if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") { // 开发 测试
//   } else if (process.env.NODE_ENV === "production") { // 生产
//   }
//   return BASE_URL;
// }

export const Product = process.env.NODE_ENV === "production" ? true : false
