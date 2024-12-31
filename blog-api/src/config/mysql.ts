import mysql from 'mysql2/promise'

// MySQL连接配置
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true
}

// 创建连接池
const pool = mysql.createPool(dbConfig)

// 封装查询方法
export async function Query<T extends any[]>(
  sql: string,
  values?: any[]
): Promise<T> {
  try {
    const [rows] = await pool.query(sql, values)
    return rows as T
  } catch (error) {
    console.error('数据库查询错误:', error)
    throw error
  }
}

// 封装事务方法
export async function Transaction<T>(
  callback: (connection: mysql.Connection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// 测试连接
pool
  .getConnection()
  .then(() => console.log('数据库连接成功'))
  .catch((err) => console.error('数据库连接失败:', err))
