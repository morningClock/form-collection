const express = require('express')
const upload = require('../../middleware/upload')
// controller
const { getUserList, getInfo, getCaptcha, checkCaptcha, doLogin, doRegister, resetPassword } = require('../../controllers/user')
const { downloadExcel, updateBatchCustomerStatus, deleteBatchCustomer, addCustomer, getCustomerList, updateCustomer, deleteCustomer, uploadFile } = require('../../controllers/form')
const { getSystemTitle, setSystemTitle } = require('../../controllers/system')

const authMiddleware = require('../../middleware/auth')

const router = express.Router({
  // 合并接口到一个整合的接口文件中
  mergeParams: true
})

module.exports = app => {
  router.get('/system/title', getSystemTitle);
  router.post('/system/set', authMiddleware(), setSystemTitle);

  router.get('/captcha/get', getCaptcha);
  router.get('/captcha/check', checkCaptcha);
  router.post('/user/login', doLogin);
  router.post('/user/register', authMiddleware(), doRegister);
  router.get('/user/info', authMiddleware(), getInfo);
  router.post('/user/reset', authMiddleware(), resetPassword);
  router.get('/user/list', authMiddleware(), getUserList);

  router.get('/customer/list', authMiddleware(), getCustomerList);
  router.post('/customer/add', authMiddleware(), addCustomer);
  router.post('/customer/update', authMiddleware(), updateCustomer);
  router.delete('/customer/delete', authMiddleware(), deleteCustomer);
  router.delete('/customer/deletebatch', authMiddleware(), deleteBatchCustomer);
  router.put('/customer/status', authMiddleware(), updateBatchCustomerStatus);
  router.get('/customer/excel', authMiddleware(), downloadExcel);


  router.post('/upload', upload.single('file'), uploadFile)

  // 挂载路由
  app.use('/admin', router);
}