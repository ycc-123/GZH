export function guide(subscribe, ispayorder) {
  console.log(subscribe, ispayorder, '关注下单')
  if (subscribe === 0) {
    // 存在下单记录
    if (ispayorder === 1) {
      const pageGuide = {
        home: 1,
        cart: 1,
        submit: 1,
        category: 1
      }
      localStorage.setItem('page', JSON.stringify(pageGuide))
    } else {
      // 不存在下单记录
      const pageGuide = {
        home: 0,
        cart: 0,
        submit: 0,
        category: 0
      }
      localStorage.setItem('page', JSON.stringify(pageGuide))
    }
  } else {
    // 已关注
    if (ispayorder === 1) {
      const pageGuide = {
        home: 1,
        cart: 1,
        submit: 1,
        category: 1
      }
      localStorage.setItem('page', JSON.stringify(pageGuide))
    } else {
      const page = JSON.parse(localStorage.getItem('page'))
      if (!page) {
        const pageGuide = {
          home: 0,
          cart: 0,
          submit: 0,
          category: 0
        }
        localStorage.setItem('page', JSON.stringify(pageGuide))
      }
    }
  }
}