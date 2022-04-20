const express = require('express')

const router = express.Router({
  // 合并接口到一个整合的接口文件中
  mergeParams: true
})

module.exports = app => {

  router.get('/', async (req, res) => {
  })

  // 挂载路由
  app.use('web/api', router);
}