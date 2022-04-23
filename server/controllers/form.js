const URL_PATH = "http://localhost:3000"

const { nanoid } = require('nanoid');
const db = require('../plugins/db');
const moment = require('moment')
const fs = require('fs-extra')
const path = require('path');
const { log } = require('console');


/**
 * 查询列表，带过滤
 * @returns 
 */
async function getCustomerList(req, res, next) {
  let query = req.query;

  // 查询条件提取
  const pageNo = parseInt(query.pageNo);
  const pageSize = parseInt(query.pageSize);
  let values = [];
  let equalPart = '';
  let searchPart = '';
  let datePart = '';
  // 条件查询
  if (query.status !== undefined) {
    equalPart = `status = ?`
    values.push(parseInt(query.status))
  }

  // 模糊查询信息
  let queryKeys = Object.keys(query).filter((key) => !(key === 'pageNo' || key === 'pageSize' || key === 'date' || key === 'status'));
  searchPart = queryKeys.map((key) => `${key} LIKE ?`).join(" AND ");
  let sqlValue = queryKeys.map((key) => `%${query[key]}%`);
  values = values.concat(sqlValue);


  // 过滤日期处理
  if (query.date) {
    const start = moment(new Date(query.date[0])).format('YYYY-MM-DD HH:mm:ss');
    const end = moment(new Date(query.date[1])).format('YYYY-MM-DD HH:mm:ss');
    if (equalPart !== '' || searchPart !== '') {
      datePart += ' AND '
    }
    datePart += `modified_time >= ? AND modified_time <= ?`;
    values.push(start)
    values.push(end)
  }
  let baseSql = 'SELECT * FROM fc_customer '
  if (equalPart !== '' || searchPart !== '' || datePart !== '') {
    baseSql += ' WHERE '
  }
  let sql = `${baseSql} ${equalPart} ${equalPart && searchPart !== '' ? `AND ${searchPart}` : searchPart}  ${datePart}  ORDER BY modified_time DESC LIMIT ?,?`;
  let data = await db.find(sql, [...values, (pageNo - 1) * pageSize, pageSize]);
  if (!data) data = []
  let baseCountSql = 'SELECT count(*) AS total FROM fc_customer'
  if (equalPart !== '' || searchPart !== '' || datePart !== '') {
    baseCountSql += ' WHERE '
  }
  let countSql = `${baseCountSql} ${equalPart} ${equalPart && searchPart !== '' ? `AND ${searchPart}` : searchPart} ${datePart}`;
  const searchCount = await db.find(countSql, values);
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
    console.log(imagePath);
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

async function updateBatchCustomerStatus(req, res, next) {
  let values = [];
  values.push(req.query.status)
  const ids = req.query.ids.split(",")
  let placeholder = ids.map(() => '?').join(',')
  values = [...values, ...ids]
  try {
    const sql = `UPDATE fc_customer SET status = ? where id in (${placeholder})`;
    db.querySync(sql, values)
    return res.send("更新成功")
  } catch (e) {
    console.log("sql错误", e);
    return res.status(500).send("更新错误")
  }
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
  addCustomer,
  updateCustomer,
  deleteCustomer,
  deleteBatchCustomer,
  uploadFile,
  updateBatchCustomerStatus
}