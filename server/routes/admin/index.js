const express = require('express')
const upload = require('../../middleware/upload')
// controller
const { getInfo, getCaptcha, checkCaptcha, doLogin, doRegister, resetPassword } = require('../../controllers/user')
const { deleteBatchCustomer, addCustomer, getCustomerList, findCustomerList, updateCustomer, deleteCustomer, uploadFile } = require('../../controllers/form')

const authMiddleware = require('../../middleware/auth')

const router = express.Router({
  // 合并接口到一个整合的接口文件中
  mergeParams: true
})

module.exports = app => {

  router.get('/captcha/get', getCaptcha);
  router.get('/captcha/check', checkCaptcha);
  router.post('/user/login', doLogin);
  router.post('/user/register', doRegister);
  router.get('/user/info', authMiddleware(), getInfo);
  router.post('/user/reset', resetPassword);

  router.get('/customer/list', getCustomerList);
  router.get('/customer/find', findCustomerList);
  router.post('/customer/add', addCustomer);
  router.post('/customer/update', updateCustomer);
  router.delete('/customer/delete', deleteCustomer);
  router.delete('/customer/deletebatch', deleteBatchCustomer);


  router.post('/upload', upload.single('file'), uploadFile)

  // 挂载路由
  app.use('/admin', router);
}