let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0, 0, 0, 0, 0]

const result = a.sort((a, b) => {
  // return a - b
  // 把 0 當成 infinity 做遞增排序
  function value(x) {
    return x === 0 ? Infinity : x
  }
  return value(a) - value(b)
})

console.log('result:', result)
