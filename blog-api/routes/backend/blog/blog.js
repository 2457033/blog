var express = require('express')
var router = express.Router()
const db = require('../../../db')
const { utcNow, filterTime } = require('../../../utils/common')

/** 博客列表 */
router.post('/list', async (req, res, next) => {
  const { type, tagType, pageSize, pageNum, searchVal } = req.body
  const { id } = req.tokenPayload
  if (!type) {
    return res.send({
      msg: '缺少博客类型',
      code: 400
    })
  }
  if (!id) {
    return res.send({
      msg: '未登录或登录失效',
      code: 401
    })
  }
  let sql = `
    select b.*, count(bv.id) as visitCount,
    count(bc.id) as conmonCount, count(bl.id) as likeCount from blog b
    left join blog_visit bv on b.id = bv.blogId
    left join blog_common bc on b.id = bc.blogId
    left join blog_like bl on b.id = bl.blogId
  `
  let params = []
  let whereClause = ''
  if (type && type !== '全部') {
    if (whereClause) whereClause += ' and'
    whereClause += ` b.categoryType = ?`
    params.push(type)
  }
  if (tagType && tagType !== '全部') {
    if (whereClause) whereClause += ' and'
    whereClause += ` b.tags like ?`
    params.push(`%${tagType}%`)
  }
  if (searchVal) {
    if (whereClause) whereClause += ' and'
    whereClause += ` b.text like ? or b.title like ?`
    params.push(`%${searchVal}%`, `%${searchVal}%`)
  }
  if (id) {
    if (whereClause) whereClause += ' and'
    whereClause += ` b.userId = ?`
    params.push(id)
  }
  if (whereClause) {
    sql += 'where ' + whereClause
  }
  const num = (pageNum - 1) * pageSize
  sql += ` GROUP BY b.id ORDER BY b.createTime desc LIMIT ? OFFSET ?`
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

/** 发布或撤回某条博客 */
router.post('/update/blogType', async (req, res, next) => {
  const { id, blogType } = req.body
  if (blogType === null || blogType === undefined) {
    res.send({
      msg: '缺少发布或撤回类型',
      code: 400
    })
  }
  if (!id) {
    res.send({
      msg: '缺少博客id',
      code: 400
    })
  }
  await db(`update blog set blogType = ? where id = ?`, [blogType, id])
  res.send({
    msg: '修改成功',
    code: 200
  })
})

/** 删除某条博客 */
router.get('/delete', async (req, res, next) => {
  const { id } = req.query
  if (!id) {
    res.send({
      msg: '缺少博客id',
      code: 400
    })
  }
  await db(`delete from blog where id = ?`, [id])
  res.send({
    msg: '删除成功',
    code: 200
  })
})

/** 增加博客 */
router.post('/add', async (req, res, next) => {
  const { img, text, title, detail, categoryType, tags, blogType } = req.body
  const userId = req.tokenPayload.id
  if (!title) {
    return res.send({
      msg: '缺少博客标题',
      code: 400
    })
  }
  if (!text) {
    return res.send({
      msg: '缺少博客简介',
      code: 400
    })
  }
  if (!detail) {
    return res.send({
      msg: '缺少博客内容',
      code: 400
    })
  }
  if (!userId) {
    return res.send({
      msg: '登录失效',
      code: 401
    })
  }

  const imgF = img == undefined ? null : `${img}`
  const tagsF = tags == undefined ? null : `${tags}`
  const categoryTypeF = categoryType == undefined ? null : `${categoryType}`
  await db(
    `INSERT INTO blog(img, text, title, detail, userId, categoryType, tags, blogType, createTime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [imgF, text, title, detail, userId, categoryTypeF, tagsF, blogType, utcNow()]
  )
  res.send({
    msg: '新增成功',
    code: 200
  })
})

/** 博客详情 */
router.get('/detail', async (req, res, next) => {
  const { id } = req.query
  if (!id) {
    res.send({
      msg: '没有参数',
      code: 400
    })
  }
  const responese = (await db(`select * from blog where id = ?`, [id]))?.at()
  if (responese.tags) {
    responese.tags = responese.tags?.split(',')
  }
  res.send({
    msg: '获取成功',
    data: responese,
    code: 200
  })
})

/** 修改博客 */
router.post('/detail/update', async (req, res, next) => {
  const { id, img, text, title, detail, categoryType, tags } = req.body
  if (!id) {
    return res.send({
      msg: '没有参数',
      code: 400
    })
  }
  if (!title) {
    return res.send({
      msg: '缺少博客标题',
      code: 400
    })
  }
  if (!text) {
    return res.send({
      msg: '缺少博客简介',
      code: 400
    })
  }
  if (!detail) {
    return res.send({
      msg: '缺少博客内容',
      code: 400
    })
  }
  const imgF = img === undefined ? null : `${img}`
  const textF = text === undefined ? null : `${text}`
  const titleF = title === undefined ? null : `${title}`
  const tagsF = tags == undefined ? null : `${tags}`
  const categoryTypeF = categoryType === undefined ? null : `${categoryType}`

  await db(`
    update blog set
     img = ?,
     text = ?,
     title = ?,
     detail = ?,
     categoryType = ?,
     tags = ?
     where id = ?`,
    [imgF, textF, titleF, detail, categoryTypeF, tagsF, id]
  )
  res.send({
    msg: '修改成功',
    code: 200
  })
})

module.exports = router
