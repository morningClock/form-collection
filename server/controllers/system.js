const db = require('../plugins/db');


/**
 * 获取Web端title
 * @param {*} token
 */
async function getSystemWebTitle(req, res, next) {
  try {
    const data = await db.find("SELECT web_title FROM fc_system_config where id = 1",)
    res.status(200).send({
      code: 0,
      message: '请求成功',
      result: {
        title: data[0].web_title
      }
    })
  } catch (e) {
    res.status(500).send({
      code: 400,
      message: '请求失败'
    })
  }
}


/**
 * 获取Admin端title
 * @param {*} token
 */
async function getSystemTitle(req, res, next) {
  try {
    const data = await db.find("SELECT admin_title,web_title  FROM fc_system_config where id = 1",)
    res.status(200).send({
      code: 0,
      message: '请求成功',
      result: {
        data: data[0]
      }
    })
  } catch (e) {
    res.status(500).send({
      code: 400,
      message: '请求失败'
    })
  }
}

async function setSystemTitle(req, res, next) {
  const { web_title, admin_title } = req.body;
  try {
    const data = await db.querySync("UPDATE fc_system_config SET web_title = ?, admin_title=?", [web_title, admin_title])
    res.status(200).send({
      code: 0,
      message: '请求成功',
      result: {
        title: data[0]
      }
    })
  } catch (e) {
    res.status(500).send({
      code: 400,
      message: '请求失败'
    })
  }
}



module.exports = {
  getSystemWebTitle,
  getSystemTitle,
  setSystemTitle
}