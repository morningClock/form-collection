/**
 * 统一配置文件
 */

module.exports = {
  database: {
    host: 'localhost',
    port: '13306',
    user: 'root',
    password: 'huang123456',
    database: 'form_collection',
    timezone: '08:00'
  },

  // jwt加密密钥
  secret: 'from_collection'
}