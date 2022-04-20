const express = require('express')
const mysql = require('../../plugins/db')

const router = express.Router({
  // 合并接口到一个整合的接口文件中
  mergeParams: true
})

module.exports = app => {

  router.get('/', async (req, res) => {
    let data = await mysql.queryAsync('select * from fc_user')
    res.send(data);
  })

  // 挂载路由
  app.use('/admin/api', router);
}