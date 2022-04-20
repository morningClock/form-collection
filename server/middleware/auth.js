const jwt = require('jsonwebtoken') 
const keys = require('../config/keys')

module.exports = (options) => {
  return async (req, res, next) => {
    const token = (req.headers.authorization).split(' ').pop()
    // 校验token
    try {
      req.user = jwt.verify(token, keys.secret);
      // 找到用户相关信息，并返回
      // 继续执行接口
      next()
    }
    catch(err) {
      res.status(402).send({message:'token 无效'})
    }
  }
}