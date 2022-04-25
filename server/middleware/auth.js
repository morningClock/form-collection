const jwt = require('jsonwebtoken')
const keys = require('../configs/keys')

module.exports = (options) => {
  return async (req, res, next) => {
    // 校验token
    try {
      const token = (req.headers.authorization).split(' ').pop()
      req.user = jwt.verify(token, keys.secret);
      // 找到用户相关信息，并返回
      // 继续执行接口
      next()
    }
    catch (err) {
      res.status(402).send({ message: 'token 无效' })
    }
  }
}