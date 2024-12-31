#!/usr/bin/env node

import Debug from 'debug'
import http from 'http'
import dotenv from 'dotenv'
import path from 'path'
// 最早加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
import app from '../app'

const debug = Debug('blog-admin:server')

// 端口标准化
function normalizePort(val: string): number | string | boolean {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

// 错误事件处理
function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' 需要提升权限')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' 端口已被占用')
      process.exit(1)
    default:
      throw error
  }
}

// 监听事件处理
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
  debug('Listening on ' + bind)
  console.log(`服务器运行在 http://localhost:${port}`)
}

// 优雅关闭
async function gracefulShutdown() {
  console.log('正在关闭服务器...')
  server.close(() => {
    console.log('服务器已关闭')
    process.exit(0)
  })
}

const port = normalizePort(process.env.PORT || '3000')
const portNumber = typeof port === 'number' ? port : 3000
app.set('port', portNumber)

const server = http.createServer(app)

server.listen(portNumber, '0.0.0.0')
server.on('error', onError)
server.on('listening', onListening)

// 处理进程信号
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
