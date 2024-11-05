var express = require('express')
var router = express.Router()
const db = require('../../../db')
const { utcNow, filterTime } = require('../../../utils/common')
const { getLocationIp, getWeather } = require('../../../classify/baiduApi')

/** 获取首页轮播图 */
router.get('/list', async (req, res, next) => {
  const swipers = await db(`select id, img, sort, createTime from blog_swiper where imgStatus = 1`)
  // const ipInfo = await getLocationIp('122.90.31.56')
  const ipInfo = await getLocationIp(req.ip)
  let nowWeather = {}
  if (ipInfo.status === 0) {
    const { address_detail } = ipInfo?.content
    const weather = await getWeather(address_detail?.adcode)
    const { now } = weather?.result
    nowWeather = weather?.result
    nowWeather.status = 200
  } else {
    nowWeather.status = 400
    nowWeather.msg = '当前ip无法查看天气'
  }
  res.send({
    msg: '获取成功',
    data: {
      swipers,
      weather: nowWeather
    },
    code: 200
  })
})

module.exports = router
