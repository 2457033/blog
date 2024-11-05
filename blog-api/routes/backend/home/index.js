var express = require('express')
var router = express.Router()
const db = require('../../../db')
const { utcNow, getPastWeek, getPastMonth } = require('../../../utils/common')
const fs = require('fs').promises;
var path = require('path')
const { getLocationIp } = require('../../../classify/baiduApi')
const useragent = require('useragent')

async function getFileSize(filePath) {
  let fileSize = 0;

  try {
    const files = await fs.readdir(filePath);
    for (const file of files) {
      const fileStat = await fs.stat(path.join(filePath, file));
      fileSize += Number(fileStat.size / 1024 / 1024);
    }
    return fileSize
  } catch (err) {
    console.error(`错误: ${err.message}`);
    return 0
  }
}

router.get('/', async (req, res, next) => {
  const responese = (await db(
    `select
    (select count(id) from users) as usersCount,
    (select count(userId) from blog) as blogsCount,
    (select count(DISTINCT userIp) from visit_logs) as visitCount
    `
  ))?.at()
  const fileSize = await getFileSize('./uploads')
  const data = {
    usersCount: responese.usersCount || 0,
    blogsCount: responese.blogsCount || 0,
    visitCount: responese.visitCount || 0,
    fileSize: fileSize.toFixed(2)
  }
  res.status(200).send({
    msg: '获取成功',
    data: data,
    code: 200
  })
})

router.post('/visitCount', async (req, res, next) => {
  const { visitType } = req.body
  if (!visitType) {
    res.send({
      msg: '缺少查询时间类型',
      code: 400
    })
  }
  const times = visitType === 'past_week' ? getPastWeek() : getPastMonth()
  let dates = []
  for (let time of times) {
    const responese = (await db(`select count(id) as visitCount from visit_logs where visitTime between ? and ?`, [time + ' 00:00:00', time + ' 23:59:59']))?.at()
    dates.push(responese?.visitCount)
  }
  res.send({
    msg: '获取成功',
    data: {
      times: times,
      visitCounts: dates
    },
    code: 200
  })
})

router.get('/ipInfo', async (req, res, next) => {
  const ips = await db(`select DISTINCT userIp from visit_logs`)
  // const test = ['122.90.31.53', '122.90.31.53']
  let dates = []
  try {
    for (const ip of ips) {
      const responese = await getLocationIp(ip)
      console.log(responese);
      if (responese.status === 2) {
        return res.send({
          msg: '请求参数错误：ip非法',
          code: 400
        })
      }
      dates.push({
        name: responese?.content?.address_detail.city,
        value: [Number(responese?.content.point.x), Number(responese?.content.point.y)]
      })
    }
    res.send({
      msg: '获取成功',
      data: dates,
      code: 200
    })
  } catch (err) {
    console.log(err);
    res.send({
      msg: '获取失败',
      data: err,
      code: 400
    })
  }
})

/** 记录用户事件 */
router.post('/deviceOrvisitAndCount', async (req, res, next) => {
  const { type } = req.body
  if (!type) {
    res.send({
      msg: '缺少查询时间类型',
      code: 400
    })
  }
  const times = type === 'past_week' ? getPastWeek() : getPastMonth()
  const [deviceGroup, deviceCount, visitGroup, visitCount] = await Promise.all([
    db(`
      select device as name, count(DISTINCT userIp) as value from visit_logs where visitTime between ? and ? group by device
      `,
      [times[0] + ' 00:00:00', times[times.length - 1] + ' 23:59:59']),
    db(`
        select count(DISTINCT userIp) as count from visit_logs where visitTime between ? and ?`,
      [times[0] + ' 00:00:00', times[times.length - 1] + ' 23:59:59']),
    db(`
      select title as name, count(id) as value from visit_logs where visitTime between ? and ? group by title
      `, [times[0] + ' 00:00:00', times[times.length - 1] + ' 23:59:59']),
    db(`
        select count(id) as count from visit_logs where visitTime between ? and ?`,
      [times[0] + ' 00:00:00', times[times.length - 1] + ' 23:59:59']),
  ])
  const responese = {
    deviceInfo: {
      group: deviceGroup,
      total: deviceCount[0]?.count,
    },
    visitInfo: {
      group: visitGroup,
      total: visitCount[0]?.count
    }
  }
  res.send({
    msg: '获取成功',
    data: responese,
    code: 200
  })
})


function filterDevice(value) {
  if (value?.includes('macOS') || value?.includes('Macintosh') || value?.includes('Windows')) {
    return 'PC'
  } else {
    return '手机'
  }
}
/** 记录用户事件 */
router.post('/record', async (req, res, next) => {
  const { headers } = req
  const { url, title } = req.body
  const userIp = req.ip || req.connection.remoteAddress
  const userAgent = headers['user-agent']
  const referrer = headers['referer']
  const userId = req.tokenPayload ? req.tokenPayload.id : null
  const agent = useragent.parse(userAgent)
  const device = filterDevice(agent.os.toString())
  const browser = agent.family
  if (!referrer || !userId) {
    res.send()
    return
  }
  try {
    await db('insert into visit_logs (url, userIp, device, title, referrer, userId, browser, visitTime) values(?, ?, ?, ?, ?, ?, ?, ?)',
      [url, userIp.replace('::ffff:', ''), device, title, referrer, userId, browser, utcNow()]
    )
  } catch (err) {
    console.error('访问日志记录失败:', err);
  }
  res.send()
})

module.exports = router
