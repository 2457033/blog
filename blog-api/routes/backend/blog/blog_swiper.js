var express = require('express')
var router = express.Router()
const db = require('../../../db')
const { utcNow, filterTime } = require('../../../utils/common')

/** 获取轮播图 */
router.post('/list', async (req, res, next) => {
  const { pageSize, pageNum } = req.body
  const num = (pageNum - 1) * pageSize
  const response = await db(`
    select id, img, imgStatus, sort, createTime from blog_swiper LIMIT ? OFFSET ?`,
    [pageSize, num]
  )
  response.forEach(s => s.createTime = filterTime(s.createTime))
  res.send({
    msg: '获取成功',
    data: {
      row: response,
      total: response?.length ?? 0
    },
    code: 200
  })
})

/** 新增轮播图 */
router.post('/add', async (req, res, next) => {
  const { img, imgStatus, sort } = req.body
  if (!img) {
    return res.send({
      msg: '缺少图片',
      code: 400
    })
  }
  if (imgStatus === undefined || imgStatus === null) {
    return res.send({
      msg: '缺少图片状态',
      code: 400
    })
  }
  if (!sort) {
    return res.send({
      msg: '缺少排序',
      code: 400
    })
  }
  const responese = await db(`select id from blog_swiper where imgStatus = 1`)
  if (responese.length >= 5 && imgStatus === 1) {
    return res.send({
      msg: '最多只能开启五个图片轮播，请禁用此轮播图或禁用其他',
      code: 400
    })
  }
  await db(`
    INSERT INTO 
    blog_swiper(img, imgStatus, sort, createTime)
    VALUES (?, ?, ?, ?)`,
    [img, imgStatus, sort, utcNow()]
  )
  res.send({
    msg: '新增成功',
    code: 200
  })
})

/** 编辑 */
router.post('/update', async (req, res, next) => {
  const { id, img, imgStatus, sort } = req.body
  if (!id) {
    return res.send({
      msg: '缺少列表id',
      code: 400
    })
  }
  let setClause = ''
  let params = []
  if (img) {
    if (setClause) setClause += ','
    setClause += ` img = ?`
    params.push(img)
  }
  if (imgStatus !== undefined || imgStatus !== null) {
    if (setClause) setClause += ','
    setClause += ` imgStatus = ?`
    params.push(imgStatus)
  }
  if (sort) {
    if (setClause) setClause += ','
    setClause += ` sort = ?`
    params.push(sort)
  }
  const responese = await db(`select id from blog_swiper where imgStatus = 1`)
  if (responese.length >= 5 && imgStatus === 1) {
    return res.send({
      msg: '最多只能开启五个图片轮播，请禁用此轮播图或禁用其他',
      code: 400
    })
  }
  let sql = `update blog_swiper`
  if (setClause) {
    sql += ' set' + setClause
  }
  sql += ` where id = ?`
  params.push(id)
  await db(sql, params)
  res.send({
    msg: '修改成功',
    code: 200
  })
})

/** 修改状态 */
router.post('/update/status', async (req, res, next) => {
  const { id, imgStatus } = req.body
  console.log(imgStatus);
  if (!id) {
    return res.send({
      msg: '缺少列表id',
      code: 400
    })
  }
  if (imgStatus === undefined || imgStatus === null) {
    return res.send({
      msg: '缺少状态',
      code: 400
    })
  }
  const responese = await db(`select id from blog_swiper where imgStatus = 1`)
  if (responese.length >= 5 && imgStatus === 1) {
    return res.send({
      msg: '最多只能开启五个图片轮播，请禁用此轮播图或禁用其他',
      code: 400
    })
  }
  await db(`update blog_swiper set imgStatus = ? where id = ?`, [imgStatus, id])
  res.send({
    msg: '修改成功',
    code: 200
  })
})

/** 删除 */
router.get('/delete', async (req, res, next) => {
  const { id } = req.query
  if (!id) {
    return res.send({
      msg: '缺少状态',
      code: 400
    })
  }
  await db(`delete from blog_swiper where id = ?`, [id])
  res.send({
    msg: '删除成功',
    code: 200
  })
})

module.exports = router
