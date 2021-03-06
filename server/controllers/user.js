const jwt = require('jsonwebtoken')
const md5 = require('md5');
// 生成验证码图片
const svgCaptcha = require('svg-captcha')
const db = require('../plugins/db');
const keys = require('../configs/keys')
const moment = require('moment')

/**
 * GET /captcha/get
 * [获取验证码]
 * @return 'success'
 */
function getCaptcha(req, res) {
  // 生成svg标签
  const captcha = svgCaptcha.create();
  // 该图片独特的id,5分钟后失效
  const captchaID = jwt.sign({
    text: md5(captcha.text.toLowerCase() + keys.secret)
  }, keys.secret, { expiresIn: 60 * 5 })
  // 生成携带加密验证码的token
  // 用于验证对应验证码使用
  res.send({
    captchaID: captchaID,
    captcha: captcha.data,
  })
}

/**
 * GET /captcha/check
 * @params captchaID
 * @params captcha
 * [验证验证码]
 * @return 'success'
 */
function checkCaptcha(req, res, next) {
  try {
    const decoded = jwt.verify(req.query.captchaID, keys.secret);
    if (decoded.text !== md5(req.query.captcha + keys.secret)) {
      return res.status(441).send({ message: '验证码输入错误!' })
    }
    return res.send({ message: '验证码通过!' })
  } catch (e) {
    return res.status(441).send({ message: '验证码失效,请重新输入!' })
  }
}

/**
 * POST /login
 * @params username
 * @params password
 * [登录接口]
 * @return 
 */
async function doLogin(req, res, next) {
  try {
    const { username, password } = req.body;
    // 取出默认不取出的password值
    const user = await db.findOne(`select * from fc_user where username = ?`, [username])
    // 1.根据用户查询是否存在用户
    if (!user) {
      return res.status(421).send({ message: '用户不存在' })
    }
    // 2.校验密码

    const isValid = user.password === md5(password + keys.secret)
    if (!isValid) {
      return res.status(422).send({ message: '密码错误' })
    }
    // 3. 登录成功，返回token
    const rules = {
      id: user.id
    }
    const token = await jwt.sign(rules, keys.secret, { expiresIn: 60 * 60 * 24 })
    return res.status(200).send({ token, message: '登陆成功!' })
  } catch (e) {
    console.error(e)
    return res.status(500).send("服务端发生错误")
  }
}

/**
 * 获取用户信息
 * @param {*} token 
 */
async function getInfo(req, res, next) {
  const { id } = req.user;
  const queryObj = await db.find("SELECT * FROM fc_user WHERE id = ?", [id]);
  const user = queryObj[0]
  if (user.password) {
    delete user.password;
  }
  // 登录权限路由
  // user.role = {
  //   id: 'admin',
  //   name: '管理员',
  //   permissions: [
  //     {
  //       permissionId: 'dashboard'
  //     },
  //     {
  //       permissionId: 'table'
  //     },
  //   ]
  // }
  user.role = {
    id: 'admin',
    name: '管理员',
    permissions: [
      'dashboard',
      'table',
      'user',
      'setting'
    ]
  }
  res.send({
    code: 0,
    message: '请求成功',
    data: user
  });
}

/**
 * POST /register
 * [注册接口]
 * @return 
 */
async function doRegister(req, res, next) {
  const body = req.body
  const isExist = await db.findOne(`select * from fc_user where username = ?`, [req.body.username])
  if (isExist) {
    return res.status(451).send({
      success: false,
      message: '用户已存在'
    })
  }
  const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  // 加密+特殊字串
  const newUser = {
    username: body.username,
    password: md5(body.password + keys.secret),
    create_time: time,
    modified_time: time,
  }
  let user = await db.insertOne('fc_user', newUser)
  return res.send({
    success: true,
    message: newUser.username + ' 注册成功'
  })
}

/**
 * 重置密码
 * @param {*}  token
 * @param {*}  oldPassword
 * @param {*}  newPassword
 */
async function resetPassword(req, res, next) {
  const { id } = req.user;
  const { oldPassword, newPassword } = req.body;
  const user = await db.findOne(`select * from fc_user where id = ? and password = ?`, [id, md5(oldPassword + keys.secret)])
  if (!user) {
    return res.status(441).send({
      code: -1,
      message: '密码错误'
    })
  }
  try {
    db.updateOneById("fc_user", { password: md5(newPassword + keys.secret) }, { id })
    res.status(200).send({
      code: 0,
      message: '修改成功',
      refresh: true
    })
  } catch (e) {
    console.error(e);
    res.status(500).send('服务发生错误')
  }
}

/**
 * 获取用户列表
 * @param {*} token
 */
async function getUserList(req, res, next) {
  let query = req.query;
  const pageNo = parseInt(query.pageNo);
  const pageSize = parseInt(query.pageSize);
  try {
    const data = await db.find("SELECT id, username FROM fc_user ORDER BY id LIMIT ?,?", [(pageNo - 1) * pageSize, pageSize])
    const totalQuery = await db.find("SELECT count(*) AS total FROM fc_user")
    const totalCount = totalQuery[0].total;
    const totalPage = Math.ceil(totalCount / pageSize);
    res.status(200).send({
      code: 0,
      message: '请求成功',
      result: {
        pageNo,
        pageSize,
        data,
        totalCount,
        totalPage
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
  getCaptcha,
  checkCaptcha,
  doLogin,
  doRegister,
  getInfo,
  getUserList,
  resetPassword
}