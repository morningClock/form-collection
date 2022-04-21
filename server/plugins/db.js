const mysql = require("mysql");
const configs = require("../configs/keys")

// 创建连接池
const pool = mysql.createPool(configs.database);

module.exports = {
  query: (sql, params, callBack) => {
    pool.getConnection((err, conn) => {
      if (err) return console.log(err);
      conn.query(sql, params, callBack);
      conn.release();
    })
  },
  // 异步查询
  querySync: (sql, params) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) return reject(err)
        conn.query(sql, params, (err, data) => {
          conn.release();  // 释放连接
          if (err) {
            reject(err)
          }
          else {
            resolve(data)
          }
        })
      })
    }).catch(err => {
      console.error(err)
    })
  },

  /**
 * 普通查询语句
 */
  find: (sql, params) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          return reject(err)
        }

        try {
          conn.query(sql, params, (error, results, fields) => {
            if (error) {
              throw error;
            }
            resolve(results.length ? results : null)
            // console.log('query results:', results)
            // console.log('query fields:', fields)
          });
        } finally {
          conn.release();  // 释放连接
        }
      })

    })
  },

  /**
   * 普通查询语句,返回单条首结果
   */
  findOne: (sql, params) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(sql, params, (error, results, fields) => {
          connection.release(); //释放数据库连接
          if (error) {
            throw error;
          }
          // connected!
          // 查询成功
          resolve(results.length ? results[0] : null)
        });
      })
    })
  },

  /**
 * 插入单条记录
 */
  insertOne: (tableName, insertObj) => {
    let keys = []
    let placeholder = []
    let values = []
    for (key in insertObj) {
      keys.push(key)
      placeholder.push('?')
      values.push(insertObj[key])
    }
    let sql = `INSERT INTO ${tableName}(${keys.join(',')}) VALUES(${placeholder.join(',')})`

    return new Promise((resolve) => {
      pool.getConnection((err, connection) => {
        connection.query(sql, values, (error, results, fields) => {
          connection.release();
          if (error) {
            throw error;
          }
          resolve(results)
        });
      })
    })
  },

  /**
 * 插入单条记录
 */
  updateOneById: (tableName, setObj, query) => {
    let values = [];
    let setStr = Object.keys(setObj).reduce((previousKey, currentKey) => {
      values.push(setObj[currentKey] || '')
      if (previousKey == '') {
        return `${currentKey} = ?`
      } else {
        return previousKey + ',' + `${currentKey} = ?`
      }
    }, '')
    values.push(query.id); //id作为update查询条件
    let sql = `UPDATE ${tableName} SET ${setStr} where id = ?`

    return new Promise((resolve) => {
      pool.getConnection((err, connection) => {
        connection.query(sql, values, (error, results, fields) => {
          connection.release();
          if (error) {
            throw error;
          }
          resolve(results)
        });
      })
    })
  }
}

