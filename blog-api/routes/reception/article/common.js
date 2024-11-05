var express = require('express')
var router = express.Router()
const db = require('../../../db')
const { utcNow, filterTime } = require('../../../utils/common')
const { toTree, toSort } = require('../../../utils/recursion')

/** 评论列表 */
router.post('/list', async (req, res, next) => {
  const { pageSize, pageNum, blogId } = req.body
  let params = []
  const count = (await db(`select count(id) as count from blog_common where blogId = ?`, [blogId]))?.at().count
  let sql = `
  select bc.id, bc.fId, bc.userId, bc.message, bc.blogId, bc.createTime, bc.toUserId, bc.commonType, u.icon, u.nickName from blog_common bc left join users u on bc.userId = u.id
  `
  const num = (pageNum - 1) * pageSize
  sql += ` where blogId = ? and fId is null GROUP BY createTime desc limit ? offset ?`
  params.push(Number(blogId), Number(pageSize), num)
  const arr = await db(sql, params)
  const list = await db(`
    select bc.*, u.icon, u.nickName, tu.icon as toIcon, tu.nickName as toNickName from blog_common bc 
    left join users u on bc.userId = u.id 
    left join users tu on bc.toUserId = tu.id
    where blogId = ? and fId is not null GROUP BY createTime desc`, [blogId])
  arr.forEach(s => {
    s.children = []
    s.createTime = filterTime(s.createTime)
    list.forEach(l => {
      l.createTime = filterTime(l.createTime)
      if (l.fId === s.id) {
        s.children.push(l)
        s.commonCount = s.children?.length ?? 0
      }
    })
  })

  res.send({
    msg: '获取成功',
    data: {
      row: arr,
      total: count ?? 0
    },
    code: 200
  })
})

router.post('/add', async (req, res, next) => {
  const { fId, message, blogId, toUserId, commonType } = req.body
  const userId = req?.tokenPayload?.id
  if (!userId) {
    return res.send({
      code: 401,
      msg: '用户未登录'
    })
  }
  if (!blogId) {
    return res.send({
      code: 400,
      msg: '没有文章id'
    })
  }
  if (!message) {
    return res.send({
      code: 400,
      msg: '没有输入消息'
    })
  }

  const toUserIdF = toUserId === undefined || !toUserId ? null : `${toUserId}`
  await db(
    `insert into blog_common(fId, userId, toUserId,  message, blogId, commonType, createTime) values(?, ?, ?, ?, ?, ?, ?)`,
    [fId, userId, toUserIdF, message, blogId, commonType, utcNow()]
  )
  res.send({
    msg: '操作成功',
    code: 200
  })
})

module.exports = router
