const mysql = require('mysql') //引入mysql

module.exports = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    // console.log('db ready');
    const db = mysql.createConnection({
      host: '127.0.0.1',
      // host: "localhost",
      user: 'root',
      password: '123456',
      database: 'vite-admin',
      multipleStatements: true //一次查询多条sql
    })

    db.connect() //连接
    const mergeSql = Array.isArray(sql) ? sql.join(';') : sql
    console.log(mergeSql)
    db.query(mergeSql, params, (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
        db.end() //结束..
      }
      db.end() //结束
      resolve(data)
    }) // 通过query方法查询数据库，传入回调
  })
}
