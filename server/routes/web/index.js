const express = require('express')
const { addCustomer, uploadFile } = require('../../controllers/form')
const { getSystemWebTitle } = require('../../controllers/system')
const upload = require('../../middleware/upload')


const router = express.Router({
  // 合并接口到一个整合的接口文件中
  mergeParams: true
})

module.exports = app => {
  router.get('/system/title', getSystemWebTitle);
  router.post('/customer/add', addCustomer);
  router.post('/customer/upload', upload.single('file'), uploadFile)

  // 挂载路由
  app.use('/web', router);
}