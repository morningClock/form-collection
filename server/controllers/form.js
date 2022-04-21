const URL_PATH = "http://localhost:3000"

const { nanoid } = require('nanoid');
const db = require('../plugins/db');
const moment = require('moment')
const fs = require('fs-extra')
const path = require('path')


/**
 * 查询列表，status过滤
 * @returns 
 */
async function getCustomerList(req, res, next) {
  const status = req.query.status || 0;
  let data = await db.find("select * from fc_customer where 'status' = ?", [status]);
  if (!data) data = []
  return res.send(data)
}

/**
 * 模糊查询列表
 * @returns 
 */
async function findCustomerList(req, res, next) {
  const status = req.query.status || 0;
  const name = '%' + (req.query.name || '') + '%';
  console.log(name);
  let data = await db.find("select * from fc_customer where 'status' = ? and name like  ?", [status, name]);
  if (!data) data = []
  return res.send(data)
}


/**
 * 新增顾客信息
 * @returns 
 */
async function addCustomer(req, res, next) {
  const body = req.body;
  const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  let idCardImgFrontSaveURL = "";
  let idCardImgBackSaveURL = "";
  try {
    idCardImgFrontSaveURL = await saveCacheImage(body.idCardImgFront);
    idCardImgBackSaveURL = await saveCacheImage(body.idCardImgBack);
  } catch (e) {
    return res.status(500).send("保存文件错误")
  }
  try {
    await db.insertOne('fc_customer', {
      id: nanoid(),
      'wx_name': body.wxName,
      'name': body.name,
      'phone': body.form,
      'id_card_number': body.idCardNumber,
      'id_card_img_front': idCardImgFrontSaveURL,
      'id_card_img_back': idCardImgFrontSaveURL,
      'remark': body.remark,
      'create_time': time,
      'modified_time': time
    })
    return res.send("成功")
  } catch (e) {
    console.log("sql错误", e);
    return res.status(500).send("插入数据错误")
  }
}
/**
 * 将缓存区的复制到uploads文件持久保存
 */
async function saveCacheImage(imagePath) {
  // 取文件名称
  return new Promise((resolve, reject) => {
    const pathname = new URL(imagePath).pathname;
    const filename = pathname.split('/').pop();
    if (pathname.indexOf('/cache')) {
      const source = path.resolve(__dirname, '../cache', filename);
      const dest = path.resolve(__dirname, '../uploads', filename);
      fs.copy(source, dest).then(() => {
        resolve(`/uploads/${filename}`)
      }).catch(err => {
        reject(err)
      })
    } else {
      resolve(`/uploads/${filename}`)
    }
  })
}

/**
 * 更新顾客信息
 * @returns 
 */
async function updateCustomer(req, res, next) {
  const body = req.body;
  const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  let idCardImgFrontSaveURL = "";
  let idCardImgBackSaveURL = "";
  try {
    idCardImgFrontSaveURL = await saveCacheImage(body.idCardImgFront);
    idCardImgBackSaveURL = await saveCacheImage(body.idCardImgBack);
  } catch (e) {
    return res.status(500).send("保存文件错误")
  }
  try {
    await db.updateOneById('fc_customer', {
      'wx_name': body.wxName,
      'name': body.name,
      'phone': body.form,
      'id_card_number': body.idCardNumber,
      'id_card_img_front': idCardImgFrontSaveURL,
      'id_card_img_back': idCardImgFrontSaveURL,
      'remark': body.remark,
      'modified_time': time
    }, {
      id: req.query.id
    })
    return res.send("更新成功")
  } catch (e) {
    console.log("sql错误", e);
    return res.status(500).send("插入数据错误")
  }
}

async function deleteCustomer(req, res, next) {
  res.send('删除成功')
}

/**
 * 上传文件
 * @returns 
 */
function uploadFile(req, res, next) {
  if (!req.file) {
    return res.status(200).send({
      status: 'error',
      message: "图片格式错误,请上传jpeg图片或者png格式图片"
    })
  }
  const file = req.file
  // 暂存缓存区
  file.url = `${URL_PATH}/cache/${file.filename}`

  return res.status(200).send({
    status: 'success',
    url: file.url
  })
}



module.exports = {
  getCustomerList,
  findCustomerList,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  uploadFile
}