var express = require('express')
var router = express.Router()
const db = require('../../../db')
const { utcNow, filterTime } = require('../../../utils/common')

/** 博客列表 */
router.post('/list', async (req, res, next) => {
  const { pageSize, pageNum, category, searchVal } = req.body
  let sql = `
    select b.*, count(DISTINCT bv.id) as visitCount,
    count(DISTINCT bc.id) as commonCount, count(DISTINCT bl.id) as likeCount,
    u.nickName as publishName, u.icon as publishIcon 
    from blog b
    left join blog_visit bv on b.id = bv.blogId
    left join blog_common bc on b.id = bc.blogId
    left join blog_like bl on b.id = bl.blogId
    left join users u on b.userId = u.id
    where blogType = 1
  `
  let OrderBY = ''
  let whereCaluse = ''
  let params = []
  if (searchVal) {
    whereCaluse += ` and b.title like ? or b.text like ? or b.tags like ?`
    params.push(`%${searchVal}%`, `%${searchVal}%`, `%${searchVal}%`)
  }
  if (category !== '最热') {
    OrderBY = `ORDER BY b.createTime`
  } else {
    OrderBY = `ORDER BY b.createTime, visitCount`
  }
  if (whereCaluse) {
    sql += whereCaluse
  }
  const num = (pageNum - 1) * pageSize
  sql += ` GROUP BY b.id ${OrderBY} desc LIMIT ? OFFSET ?`
  params.push(pageSize, num)
  const responese = await db(sql, params)
  responese.forEach(s => {
    s.createTime = filterTime(s.createTime)
    if (s.tags) {
      s.tags = s.tags?.split(',')
    }
  })
  res.send({
    msg: '获取成功',
    data: {
      row: responese,
      total: responese.length
    },
    code: 200
  })
})

/** 获取分类 */
router.get('/category', async (req, res, next) => {
  const { id } = req.tokenPayload || {}
  if (!id) {
    return res.send({
      msg: '登录已失效'
    })
  }
  const responese = await db(`select id, category, sort, createTime from blog_category where userId = ? order by sort`, [id])
  res.send({
    msg: '获取成功',
    data: responese,
    code: 200
  })
})

/** 获取详情 */
router.get('/detail', async (req, res, next) => {
  const { id } = req.query
  if (!id) {
    return res.send({
      msg: '缺少内容参数'
    })
  }
  const responese = (await db(
    `select b.*, count(bv.id) as visitCount,
    count(bc.id) as conmonCount, count(bl.id) as likeCount,
    u.nickName as publishName, u.icon as publishIcon,
    GROUP_CONCAT(DISTINCT bl.userId) AS likedUserIds
    from blog b
    left join blog_visit bv on b.id = bv.blogId
    left join blog_common bc on b.id = bc.blogId
    left join blog_like bl on b.id = bl.blogId
    left join users u on b.userId = u.id
    where blogType = 1 and b.id = ?`, [id]
  ))?.at()
  responese.createTime = filterTime(responese.createTime)
  responese.likedUserIds = responese.likedUserIds?.split(",")
  res.send({
    msg: '获取成功',
    data: responese,
    code: 200
  })
})

module.exports = router
