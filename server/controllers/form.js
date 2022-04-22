const URL_PATH = "http://localhost:3000"

const { nanoid } = require('nanoid');
const db = require('../plugins/db');
const moment = require('moment')
const fs = require('fs-extra')
const path = require('path');
const { count, log } = require('console');


/**
 * 查询列表，status过滤
 * @returns 
 */
async function getCustomerList(req, res, next) {
  const status = parseInt(req.query.status) || 0;
  const pageNo = parseInt(req.query.pageNo);
  const pageSize = parseInt(req.query.pageSize);
  const sql = "SELECT * FROM fc_customer WHERE 'status' = ? ORDER BY modified_time DESC LIMIT ?,? ";
  let data = await db.find(sql, [status, (pageNo - 1) * pageSize, pageSize]);
  if (!data) data = []
  const searchCount = await db.find("SELECT COUNT(*) as total FROM fc_customer WHERE 'status' = ?", [status]);
  const totalCount = searchCount[0].total;
  const totalPage = Math.ceil(totalCount / pageSize);

  return res.send({
    code: 0,
    message: '',
    result: {
      pageNo,
      pageSize,
      data,
      totalCount,
      totalPage
    }
  })
}

/**
 * 模糊查询列表
 * @returns 
 */
async function findCustomerList(req, res, next) {
  const status = parseInt(req.query.status) || 0;
  const pageNo = parseInt(req.query.pageNo);
  const pageSize = parseInt(req.query.pageSize);
  const name = '%' + (req.query.name || '') + '%';
  const sql = "SELECT * FROM fc_customer WHERE 'status' = ? AND name LIKE  ? ORDER BY modified_time LIMIT ?,?";
  console.log(sql);
  let data = await db.find(sql, [status, name, (pageNo - 1) * pageSize, pageSize]);
  if (!data) data = []

  const searchCount = await db.find("select count(*) AS total from fc_customer where 'status' = ? and name like ?", [status, name]);
  const totalCount = searchCount[0].total;
  const totalPage = Math.ceil(totalCount / pageSize);

  return res.send({
    code: 0,
    message: '',
    result: {
      pageNo,
      pageSize,
      data,
      totalCount,
      totalPage
    }
  })
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
    idCardImgFrontSaveURL = await saveCacheImage(body.id_card_img_front);
    idCardImgBackSaveURL = await saveCacheImage(body.id_card_img_back);
  } catch (e) {
    return res.status(500).send("保存文件错误")
  }
  try {
    await db.insertOne('fc_customer', {
      id: nanoid(),
      'wx_name': body.wx_name,
      'name': body.name,
      'phone': body.phone,
      'id_card_number': body.id_card_number,
      'id_card_img_front': idCardImgFrontSaveURL,
      'id_card_img_back': idCardImgBackSaveURL,
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
    const pathname = imagePath;
    const filename = pathname.split('/').pop();
    if (pathname.indexOf('/cache')) {
      const source = path.resolve(__dirname, '../cache', filename);
      const dest = path.resolve(__dirname, '../uploads', filename);
      fs.copy(source, dest).then(() => {
        resolve(`/uploads/${filename}`)
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    } else {
      resolve(imagePath)
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
    idCardImgFrontSaveURL = await saveCacheImage(body.id_card_img_front);
    idCardImgBackSaveURL = await saveCacheImage(body.id_card_img_back);
  } catch (e) {
    return res.status(500).send("保存文件错误")
  }
  try {
    await db.updateOneById('fc_customer', {
      'wx_name': body.wx_name,
      'name': body.name,
      'phone': body.phone,
      'id_card_number': body.id_card_number,
      'id_card_img_front': idCardImgFrontSaveURL,
      'id_card_img_back': idCardImgBackSaveURL,
      'remark': body.remark,
      'modified_time': time
    }, {
      id: body.id
    })
    return res.send("更新成功")
  } catch (e) {
    console.log("sql错误", e);
    return res.status(500).send("插入数据错误")
  }
}

async function deleteCustomer(req, res, next) {
  const id = req.query.id
  try {
    await db.deleteByIds('fc_customer', [id])
    res.send('删除成功')
  } catch (e) {
    console.error(e);
    res.send('删除失败')
  }
}

async function deleteBatchCustomer(req, res, next) {
  const ids = req.query.ids.split(',')
  try {
    await db.deleteByIds('fc_customer', ids)
    res.send('删除成功')
  } catch (e) {
    console.error(e);
    res.send('删除失败')
  }
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
  file.url = `/cache/${file.filename}`

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
  deleteBatchCustomer,
  uploadFile
}