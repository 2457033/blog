var express = require('express')
var router = express.Router()
const uuid = require('uuid')
const db = require('../../../db')
const { utcNow } = require('../../../utils/common')
const { checkPermission } = require('../../../utils/permission')
const { textToPinyin } = require('../../../utils/pinyin')

/** 获取分类 */
router.get('/', async (req, res, next) => {
  const userId = req.tokenPayload.id
  const response = await db(`
    select
      bc.id,
      bc.category,
      bc.type,
      case 
        when bc.category = ? then (select count(id) from blog)
        else count(b.id)
      end as count,
      bc.sort
    from blog_category bc
    left join blog b on bc.category = b.categoryType
    where bc.userId = ? or bc.userId is null
    GROUP BY bc.category
    order by bc.sort`, ['全部', userId])
  res.send({
    msg: '获取成功',
    data: response,
    code: 200
  })
})

/** 新增分类 */
router.post('/add', async (req, res, next) => {
  const { category } = req.body
  const { id } = req.tokenPayload
  if (!category) {
    return res.send({
      msg: '缺少分类字段',
      code: 400
    })
  }
  const type = textToPinyin(category)
  if (!type) {
    return res.status(400).send({
      msg: '服务器出现错误',
      code: 400
    })
  }
  const responese = await db(`select * from blog_category where category = ? and userId = ?`, [category, id])
  if (responese.length > 0) {
    return res.send({
      msg: '已有该标签',
      code: 400
    })
  }
  const length = (await db(`select count(id) as count from blog_category where userId = ? or userId is null`, [id]))?.at().count
  await db(`insert into blog_category(id, category, type, sort, userId, createTime) values(?, ?, ?, ?, ?, ?)`, [uuid.v4(), category, type, length + 1, id, utcNow()])
  res.send({
    msg: '新增成功',
    code: 200
  })
})

/** 编辑分类 */
router.post('/edit', async (req, res, next) => {
  const { id, category, sort } = req.body
  const userId = req.tokenPayload.id
  if (!id) {
    res.send({
      msg: '缺少编辑id类型',
      code: 400
    })
  }
  let params = []
  let setClaus = ''
  if (category) {
    if (setClaus) setClaus += ','
    setClaus += ` category = ?`
    params.push(category)
  }
  if (sort) {
    if (setClaus) setClaus += ','
    setClaus += ` sort = ?`
    params.push(sort)
  }
  params.push(id, userId)
  await db(`update blog_category set ${setClaus} where id = ? and userId = ?`, params)
  res.send({
    msg: '修改成功',
    code: 200
  })
})

/** 删除 */
router.get('/delete', async (req, res, next) => {
  const { id } = req.query
  const userId = req.tokenPayload.id
  if (!id) {
    res.send({
      msg: '缺少删除id',
      code: 400
    })
  }
  await db(`delete from blog_category where id = ? and userId = ?`, [id, userId])
  res.send({
    msg: '删除成功',
    code: 200
  })
})

/** 修改排序 */
router.post('/sort', async (req, res, next) => {
  const { drapSort, drapCategory, sort, category } = req.body
  if ((!drapSort && !drapCategory) || !drapSort || !drapCategory) {
    res.send({
      msg: '缺少排序标签',
      code: 400
    })
  }
  if ((!sort && !category) || !sort || !category) {
    res.send({
      msg: '缺少排序数值',
      code: 400
    })
  }
  await db(`
    update blog_category
    set 
      sort = case
      when category = ? then ?
      when category = ? then ?
      else sort
    end
    where category in (?, ?)  
  `, [drapCategory, drapSort, category, sort, drapCategory, category])
  res.send({
    msg: '修改成功',
    code: 200
  })
})

/** 修改排序 */
router.get('/category', async (req, res, next) => {
  const { id } = req.tokenPayload
  const responese = await db(`select category from blog_category where userId = ? group by sort`, [id])
  const list = responese?.map(s => ({
    code: s.category,
    value: s.category
  }))
  res.send({
    msg: '获取成功',
    data: list,
    code: 200
  })
})

module.exports = router
