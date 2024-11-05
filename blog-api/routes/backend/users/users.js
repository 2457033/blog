var express = require('express')
var router = express.Router()
const db = require('../../../db')
const uuid = require('uuid')
const tokenServer = require('../../../utils/token')
const { utcNow, filterTime } = require('../../../utils/common')
const { checkPermission } = require('../../../utils/permission')
const { verifyPassword } = require('../../../utils/recursion')

router.post('/login', async (req, res, next) => {
  const { userName, password, phone, code } = req.body
  if (!userName) {
    res.send({
      code: 400,
      msg: '请输入用户名或手机号'
    })
  }

  if (!password) {
    res.send({
      code: 400,
      msg: '请输入密码'
    })
  }

  if (!password && !code) {
    res.send({
      code: 400,
      msg: '请输入验证码'
    })
  }

  let sql = `SELECT u.*, r.permission, r.selectIds, r.role, r.status as roleStatus FROM users u 
  left join user_of_role ur on ur.userId = u.id
  left join role r on r.id = ur.roleId
  WHERE (u.userName=? AND u.password=MD5(?)) or (u.phone=? AND u.password=MD5(?)) `

  const data = await db(sql, [userName, password, phone, password])

  if (data && data.length) {
    const userInfo = data[0]

    const tokenStr = tokenServer.signByPayload({
      id: userInfo.id
    })

    if (data[0]?.userName !== 'admin') {
      if (data[0]?.status === 0) {
        return res.status(423).send({
          msg: '该账户已被禁用',
          code: 423
        })
      }
      if (!data[0]?.role) {
        return res.status(453).send({
          msg: '该用户未绑定角色，请联系管理员',
          code: 453
        })
      }
      if (data[0]?.roleStatus === 0) {
        return res.status(473).send({
          msg: '该账户绑定的角色已被禁用，请联系管理员',
          code: 473
        })
      }
    }

    res.send({
      code: 200,
      msg: '登录成功',
      data: {
        token: tokenStr
      }
    })
  } else {
    res.send({
      code: 400,
      msg: '账号密码错误'
    })
  }
})

router.post('/info', async (req, res, next) => {
  const { id } = req.tokenPayload
  if (!id) {
    res.send({
      code: 400,
      msg: '缺少token'
    })
  }

  const responese = (
    await db(
      `select u.id, u.icon, u.createTime, u.nickName, u.phone, u.userName, u.sex, r.role, r.roleName, r.permission, r.selectIds, r.remark from users u
      left join user_of_role ur on ur.userId = u.id
      left join role r on r.id = ur.roleId
      where u.id = ?;`,
      [id]
    )
  )?.at()
  if (responese?.createTime) {
    responese.createTime = filterTime(responese.createTime)
  }
  res.send({
    code: 200,
    msg: '获取信息成功',
    data: responese
  })
})

router.post('/list', checkPermission('system:user:list'), async (req, res, next) => {
  const { pageNum, pageSize, userName, phone, status } = req.body
  let sql = `select u.id, userName, phone, icon, nickName, u.createTime, u.status, sex, u.remark, ur.roleId from users u left join user_of_role ur on ur.userId = u.id`
  let whereClause = '';
  let params = []

  if (userName) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` userName LIKE ?`;
    params.push(`%${userName}%`)
  }

  if (phone) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` phone LIKE ?`;
    params.push(`%${phone}%`)
  }

  if (status !== undefined) { // 假设 status 可以是 null 或其他非数字值，这里使用 !== undefined 来判断
    if (whereClause) whereClause += ' AND';
    whereClause += ` status = ?`;
    params.push(status)
  }

  if (whereClause) {
    sql += ` WHERE ${whereClause}`;
  }

  const num = (pageNum - 1) * pageSize

  sql += ` ORDER BY CAST(u.id AS UNSIGNED) LIMIT ? OFFSET ?`;
  params.push(pageSize, num)
  const responese = await db(sql, params);
  responese.forEach(s => {
    s.createTime = filterTime(s.createTime)
  })
  res.send({
    msg: '获取成功',
    code: 200,
    data: {
      row: responese,
      total: responese.length || 0
    }
  })
})

router.post('/add', checkPermission('system:user:add'), async (req, res, next) => {
  const { userName, password, phone, nickName, sex, remark, status } = req.body

  if (!userName) {
    res.send({
      msg: '请输入用户名称',
      code: 400
    })
  }

  if (!phone) {
    res.send({
      msg: '请输入手机号',
      code: 400
    })
  }

  if (!nickName) {
    res.send({
      msg: '请输入用户昵称',
      code: 400
    })
  }

  if (!password) {
    res.send({
      msg: '请输入密码',
      code: 400
    })
  }

  const remarkF = remark == undefined ? null : `${remark}`
  const sexF = sex == undefined ? `unknow` : `${sex}`

  const responese = (await db(`select id from users order by id DESC limit 1`))?.at()
  const length = parseInt(responese?.id)

  let params = [`${length + 1}`, userName, password, phone, 'https://img0.baidu.com/it/u=365878481,4199784825&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1718470800&t=7a0922588019d3d8db1084a3e3859c1a', nickName, sexF, status, remarkF, `${utcNow()}`]

  await db(
    `INSERT INTO users(id, userName, password, phone, code, icon, nickName, sex, status, remark, createTime) 
    VALUES (
    ?, ?, MD5(?), ?, NULL,
    ?,
    ?, ?, ?, ?,?);`,
    params
  )

  res.send({
    msg: '新增成功',
    code: 200
  })
})

// 修改某个用户的状态
router.post('/update/status', checkPermission('system:user:update:status'), async (req, res, next) => {
  const { id, status } = req.body

  if (!id) {
    res.send({
      msg: '没找到id',
      code: 400
    })
  }

  await db(
    `update users set status = ? where id = ?`,
    [status, id]
  )

  res.send({
    msg: '修改成功',
    code: 200
  })
})

// 修改某个用户
router.post('/update', checkPermission('system:user:update'), async (req, res, next) => {
  const { id, status, nickName, phone, sex, remark } = req.body
  if (!id) {
    res.send({
      msg: '没找到id',
      code: 400
    })
  }

  if (!nickName) {
    res.send({
      msg: '请输入用户昵称',
      code: 400
    })
  }

  if (!phone) {
    res.send({
      msg: '请输入用户手机号',
      code: 400
    })
  }

  let sql = ''
  let params = []

  if (nickName) {
    if (sql) sql += ', '
    sql += `nickName = ?`
    params.push(nickName)
    const responese = await db(`select nickName from users where nickName = ? and id != ?`, [nickName, id])
    if (responese && responese.length > 0) {
      res.send({
        code: 400,
        msg: '已有该昵称，请换一个昵称'
      })
    }
  }

  if (phone) {
    if (sql) sql += ', '
    sql += `phone = ?`
    params.push(phone)
    const responese = await db(`select phone from users where phone = '${phone}' and id != '${id}'`, [phone, id])
    if (responese && responese.length > 0) {
      res.send({
        code: 400,
        msg: '已有该手机号，请换一个手机号'
      })
    }
  }

  if (sex) {
    if (sql) sql += ', '
    sql += `sex = ?`
    params.push(sex)
  }

  if (status) {
    if (sql) sql += ','
    sql += `status = ?`
    params.push(status)
  }

  if (remark) {
    if (sql) sql += ', '
    const remarkF = remark == undefined ? null : `${remark}`
    sql += `remark = ?`
    params.push(remarkF)
  }

  params.push(id)

  await db(
    `update users set ${sql} where id = ?`,
    params
  )

  res.send({
    msg: '修改成功',
    code: 200
  })
})

// 删除某个用户
router.get('/delete', checkPermission('system:user:delete'), async (req, res, next) => {
  const { id } = req.query
  if (!id) {
    res.send({
      msg: '没找到id',
      code: 400
    })
  }

  const responese = await db(`select userId from user_of_role where userId = ?`, [id])
  if (responese && responese.length > 0) {
    await db(`delete from user_of_role where userId = ?`, [id])
  }

  await db(
    `delete from users where id = ?`, [id]
  )

  res.send({
    msg: '删除成功',
    code: 200
  })
})

// 绑定角色
router.post('/bind', checkPermission('system:user:bind'), async (req, res, next) => {
  const { userId, roleId } = req.body
  if (!userId) {
    res.send({
      msg: '没找到用户信息',
      code: 400
    })
  }

  if (!userId) {
    res.send({
      msg: '没找到角色信息',
      code: 400
    })
  }

  const responese = await db(`select userId, roleId from user_of_role where userId = ?`, [userId])
  if (responese && responese.length > 0) {
    await db(
      `update user_of_role set roleId = ? where userId = ?`,
      [roleId, userId]
    )
  } else {
    await db(
      `INSERT INTO user_of_role(id, userId, roleId, createTime) VALUES (?, ?, ?, ?);`,
      [`${uuid.v4()}`, userId, roleId, `${utcNow()}`]
    )
  }

  res.send({
    msg: '操作成功',
    code: 200
  })
})

// 取消绑定
router.post('/unBind', checkPermission('system:user:unBind'), async (req, res, next) => {
  const { userId, roleId } = req.body
  if (!userId) {
    res.send({
      msg: '没找到用户信息',
      code: 400
    })
  }

  if (!userId) {
    res.send({
      msg: '没找到角色信息',
      code: 400
    })
  }


  await db(
    `delete from user_of_role where roleId = ? and userId = ?`, [roleId, userId]
  )

  res.status(200).send({
    msg: '操作成功',
    code: 200
  })
})

/** 修改密码 */
router.post('/uptPwd', async (req, res, next) => {
  const { oldPwd, newPwd } = req.body
  const { id } = req.tokenPayload
  if (!id) {
    res.status(400).send({
      msg: '未找到token携带的id'
    });
  }
  if (!oldPwd) {
    res.send({
      msg: '请输入旧密码',
      code: 400
    })
  }

  if (!newPwd) {
    res.send({
      msg: '请输入新密码',
      code: 400
    })
  }
  const responese = (await db('select password from users where id = ?', [id]))?.at()
  if (responese.password !== verifyPassword(oldPwd)) {
    return res.send({
      msg: '您输入的旧密码有误，请重新输入',
      code: 400
    })
  }

  await db('update users set password = MD5(?) where id = ?', [newPwd, id])
  res.status(200).send({
    msg: '操作成功',
    code: 200
  })
})
module.exports = router
