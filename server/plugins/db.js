const mysql = require("mysql");
const configs = require("../configs/keys")

// 创建连接池
const pool = mysql.createPool(configs.database);

module.exports = {
  query: (sql, post, callBack) => {
    pool.getConnection((err, conn) => {
      if (err) return console.log(err);
      try {
        conn.query(sql, post, callBack);
      } finally {
        conn.release();
      }
    })
  },
  //promise 回调
  queryAsync: (sql, post) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) return reject(err)
        else {
          try {
            conn.query(sql, post, (err, data) => {
              if (err) {
                reject(err)
              }
              else {
                resolve(data)
              }
            })
          } finally {
            conn.release();  // 释放连接
          }
        }
      })
    }).catch(err => {
      console.error(err)
    })
  }
}