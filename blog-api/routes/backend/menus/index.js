var express = require('express')
var router = express.Router()
const db = require('../../../db')
const uuid = require('uuid')
const { utcNow, filterTime } = require('../../../utils/common')
const { checkPermission } = require('../../../utils/permission')
const { toSort, toTree } = require('../../../utils/recursion')

router.post('/', async (req, res, next) => {
  const responese = await db(
    `SELECT * FROM menus 
      WHERE status = 'open' 
      AND (menuType != 'button' OR menuType IS NULL)
      ORDER BY sort;`
  )
  let arr = []
  if (responese) {
    responese.forEach((s, index) => {
      s.createTime = filterTime(s.createTime)
      if (!s.fId) {
        arr.push({
          ...s,
          statusValue: s.status === 'open' ? '正常' : '停用',
          children: []
        })
      }
    })
  }

  arr.forEach((s) => {
    s.children = toTree(responese, s.id)
    s.children = toSort(s.children)
  })

  res.send({
    msg: '获取成功',
    isSuccess: true,
    data: {
      row: arr,
      total: arr.length || 0
    },
    code: 200
  })
})

router.post('/list', async (req, res, next) => {
  const responese = await db(
    `select * from menus where status = 'open' and fId is null and (menuType = 'menu' and permission is not null) or menuType != 'menu' ORDER BY sort`
  )
  const all = await db(`select * from menus where permission is not null`)
  let arr = []
  if (responese) {
    responese.forEach((s) => {
      s.createTime = filterTime(s.createTime)
      if (!s.fId) {
        arr.push({
          ...s,
          statusValue: s.status === 'open' ? '正常' : '停用',
          children: []
        })
      }
    })
  }

  arr.forEach((s) => {
    s.children = toTree(all, s.id)
    s.children = toSort(s.children)
  })

  res.send({
    msg: '获取成功',
    isSuccess: true,
    data: {
      row: arr,
      total: arr.length || 0
    },
    code: 200
  })
})

router.post(
  '/all',
  checkPermission('system:menu:all'),
  async (req, res, next) => {
    const { title, status, pageSize, pageNum } = req.body
    let sql = 'select * from menus where fId is null'
    let params = []

    let whereClause = ''
    if (title) {
      whereClause += ` and title like ?`
      params.push(`%${title}%`)
    }

    if (status) {
      whereClause += ` and status = ?`
      params.push(status)
    }

    if (whereClause) {
      sql += `${whereClause}`
    }

    const count = await db(sql, params)

    const num = (pageNum - 1) * pageSize
    const sqls = sql + ` ORDER BY sort limit ? offset ?`
    params.push(pageSize, num)
    const responese = await db(sqls, params)
    const pSql = await db(`select * from menus`)
    let arr = []
    if (responese) {
      responese.forEach((s) => {
        s.createTime = filterTime(s.createTime)
        if (!s.fId) {
          arr.push({
            ...s,
            statusValue: s.status === 'open' ? '正常' : '停用'
          })
        }
      })
    }

    arr.forEach((s) => {
      s.children = toTree(pSql, s.id)
      s.children = toSort(s.children)
    })

    res.send({
      msg: '获取成功',
      isSuccess: true,
      data: {
        row: arr,
        total: count.length || 0
      },
      code: 200
    })
  }
)

router.post(
  '/update',
  checkPermission('system:menu:update'),
  async (req, res, next) => {
    const {
      icon,
      title,
      name,
      path,
      status,
      id,
      sort,
      menuType,
      showMenu,
      outChain,
      permission,
      cache,
      query
    } = req.body
    // if (!icon) {
    //   res.send({
    //     msg: '请输入图像',
    //     isSuccess: false,
    //     code: 400
    //   })
    // }
    if (!title) {
      res.send({
        msg: '请输入标题',
        isSuccess: false,
        code: 400
      })
    }
    if (menuType !== 'button') {
      if (!name) {
        res.send({
          msg: '请输入路由地址',
          isSuccess: false,
          code: 400
        })
      }
    }

    if (!status) {
      res.send({
        msg: '请输入菜单状态',
        isSuccess: false,
        code: 400
      })
    }

    const iconF = icon == undefined ? null : `${icon}`
    const pathF = path == undefined ? null : `${path}`
    const permissionF = permission == undefined || !permission ? null : `${permission}`
    const queryF = query == undefined ? null : `${query}`
    const nameF = name == undefined ? null : `${name}`

    let params = [iconF, title, nameF, pathF, status, `${sort || null}`, menuType, showMenu, outChain, permissionF, cache, queryF, id]

    await db(
      `UPDATE menus SET 
      icon = ?, 
      title = ?,
      name = ?, 
      path = ?, 
      status = ?, 
      sort = ?, 
      menuType = ?, 
      showMenu = ?, 
      outChain=?, 
      permission=?, 
      cache=?, 
      query=?  
      WHERE id = ?;`, params
    )

    res.send({
      msg: '修改成功',
      isSuccess: true,
      code: 200
    })
  }
)

router.post(
  '/add',
  checkPermission('system:menu:add'),
  async (req, res, next) => {
    const {
      fId,
      icon,
      title,
      name,
      path,
      status,
      sort,
      menuType,
      showMenu,
      outChain,
      permission,
      cache,
      query
    } = req.body
    // if (!icon) {
    //   res.send({
    //     msg: '请输入图像',
    //     isSuccess: false
    //   })
    // }
    if (!title) {
      res.send({
        msg: '请输入标题',
        isSuccess: false,
        code: 400
      })
    }
    if (menuType !== 'button') {
      if (!name) {
        res.send({
          msg: '请输入路由地址',
          isSuccess: false,
          code: 400
        })
      }
    }

    if (!status) {
      res.send({
        msg: '请输入菜单状态',
        isSuccess: false,
        code: 400
      })
    }

    const fIdF = fId == undefined ? null : `${fId}`
    const iconF = icon == undefined ? null : `${icon}`
    const pathF = path == undefined ? null : `${path}`
    const permissionF = permission == undefined ? null : `${permission}`
    const queryF = query == undefined ? null : `${query}`
    const nameF = name == undefined ? null : `${name}`

    let params = [`${uuid.v4()}`, fIdF, iconF, title, nameF, pathF, status, sort, menuType, showMenu, outChain, permissionF, cache, queryF, `${utcNow()}`]

    await db(
      `INSERT INTO menus(id, fId, icon, title, name, path, status, sort, menuType, showMenu, outChain, permission, cache, query, createTime) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, params
    )

    res.send({
      msg: '新增成功',
      isSuccess: true,
      code: 200
    })
  }
)

router.post(
  '/delete',
  checkPermission('system:menu:delete'),
  async (req, res, next) => {
    const { id } = req.body
    if (!id) {
      res.send({
        msg: '缺少参数',
        isSuccess: false,
        code: 400
      })
    }

    await db(`delete from menus where id=?`, [id])

    res.send({
      msg: '新增成功',
      isSuccess: true,
      code: 200
    })
  }
)

module.exports = router
