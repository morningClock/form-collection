// 获取随机验证码
module.exports = bit => {
  bit = bit ? bit : 4
  let arr = []
  for (let i = 0; i < bit; i++) {
    arr.push(Math.floor(Math.random() * 10))
  }
  return arr.join('')
}