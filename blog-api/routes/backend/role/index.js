var express = require('express')
var router = express.Router()
const db = require('../../../db')
const uuid = require('uuid')
const { utcNow, filterTime } = require('../../../utils/common')
const { checkPermission } = require('../../../utils/permission')
const xlsx = require('node-xlsx')

router.post('/list', checkPermission('system:role:list'), async (req, res, next) => {
  const { pageNum, pageSize, role, roleName, status, createStartTime, createEndTime } = req.body
  let sql = `select * from role`
  let whereClause = '';
  let params = []

  if (role) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` role LIKE ?`;
    params.push(`%${role}%`)
  }

  if (roleName) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` roleName LIKE ?`;
    params.push(`%${roleName}%`)
  }

  if (createStartTime && createEndTime) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` createTime BETWEEN ? AND ?`;
    params.push(createStartTime, createEndTime)
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

  sql += ` ORDER BY sort LIMIT ? OFFSET ?`;
  params.push(pageSize, num)
  const responese = await db(sql, params);
  responese.forEach(s => {
    s.createTime = filterTime(s.createTime)
    if (s.selectIds !== '*:*:*') {
      s.selectIds = s.selectIds?.split(',')
    }
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

router.post('/add', checkPermission('system:role:add'), async (req, res, next) => {
  const { roleName, role, sort, status, selectIds, halfSelecteIds, remark, id } = req.body

  if (!roleName) {
    res.send({
      msg: '请输入角色名称',
      code: 400
    })
  }

  if (!role) {
    res.send({
      msg: '请输入权限字符',
      code: 400
    })
  }

  if (!sort) {
    res.send({
      msg: '请输入角色顺序',
      code: 400
    })
  }

  const findRole = (await db(`select role from role where role = ? and id != ?`, [role, id]))?.at()
  if (findRole) {
    if (findRole?.role === 'admin') {
      res.send({
        msg: '该权限字符不可取, 请联系管理员',
        code: 400
      })
      return
    } else {
      res.send({
        msg: '该权限字符重复',
        code: 400
      })
      return
    }
  }

  let permissionF
  let selectIdsF

  const selectIdsAll = selectIds?.concat(halfSelecteIds)
  if (selectIdsAll.length > 0) {
    const conditions = selectIdsAll.map(id => `id = '${id}'`).join(' OR ');
    const data = await db(`SELECT permission FROM menus WHERE ${conditions}`)
    const dataF = data.filter(s => s.permission).map(s => s.permission)
    selectIdsF = `${selectIds.join(',')}`
    permissionF = `${dataF.join(',')}`
  } else {
    permissionF = null
    selectIdsF = null
  }

  const remarkF = remark == undefined ? null : `${remark}`

  const responese = (await db(`select id from role order by id DESC limit 1`))?.at()
  const length = parseInt(responese?.id)

  let params = [`${length + 1}`, role, roleName, permissionF, sort, status, remarkF, selectIdsF, `${utcNow()}`]

  await db(
    `INSERT INTO role(id, role, roleName, permission, sort, status, remark, selectIds, createTime) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    params
  )

  res.send({
    msg: '新增成功',
    code: 200
  })
})

// 修改某个角色的状态
router.post('/update/status', checkPermission('system:role:update:status'), async (req, res, next) => {
  const { id, status } = req.body

  if (!id) {
    res.send({
      msg: '没找到id',
      code: 400
    })
  }

  await db(
    `update role set status = ? where id = ?`, [status, id]
  )

  res.send({
    msg: '修改成功',
    code: 200
  })
})

// 修改某个角色
router.post('/update', checkPermission('system:role:update'), async (req, res, next) => {
  const { roleName, role, sort, status, selectIds, halfSelecteIds, remark, id } = req.body

  if (!id) {
    res.send({
      msg: '没找到id',
      code: 400
    })
  }

  if (!roleName) {
    res.send({
      msg: '请输入角色名称',
      code: 400
    })
  }

  if (!role) {
    res.send({
      msg: '请输入权限字符',
      code: 400
    })
  }

  if (!sort) {
    res.send({
      msg: '请输入角色顺序',
      code: 400
    })
  }

  const findRole = (await db(`select role from role where role = ? and id != ?`, [role, id]))?.at()
  if (findRole) {
    if (findRole?.role === 'admin') {
      res.send({
        msg: '该权限字符不可取, 请联系管理员',
        code: 400
      })
      return
    } else {
      res.send({
        msg: '该权限字符重复',
        code: 400
      })
      return
    }
  }

  let permissionF
  let selectIdsF
  const selectIdsAll = selectIds?.concat(halfSelecteIds)
  if (selectIdsAll.length > 0) {
    const conditions = selectIdsAll.map(id => `id = '${id}'`).join(' OR ');
    const data = await db(`SELECT permission FROM menus WHERE ${conditions}`)
    const dataF = data.filter(s => s.permission).map(s => s.permission)
    selectIdsF = `${selectIds.join(',')}`
    permissionF = `${dataF.join(',')}`
  } else {
    permissionF = null
    selectIdsF = null
  }

  const remarkF = remark == undefined ? null : `${remark}`

  let params = [roleName, role, sort, status, permissionF, remarkF, selectIdsF, id]

  await db(
    `update role set 
    roleName = ?, 
    role = ?, 
    sort = ?, 
    status = ?, 
    permission = ?,
    remark = ?,
    selectIds = ?
    where id = ?`,
    params
  )

  res.send({
    msg: '修改成功',
    code: 200
  })
})

// 删除某个角色
router.get('/delete', checkPermission('system:role:delete'), async (req, res, next) => {
  const { id } = req.query
  if (!id) {
    res.send({
      msg: '没找到id',
      code: 400
    })
  }

  const responese = await db(`select roleId from user_of_role where roleId = ?`, [id])
  if (responese && responese.length > 0) {
    await db(`delete from user_of_role where roleId = ?`, [id])
  }

  await db(
    `delete from role where id = ?`, [id]
  )

  res.send({
    msg: '删除成功',
    code: 200
  })
})

// 获取未绑定用户
router.post('/unBindUser/list', async (req, res, next) => {
  const { pageNum, pageSize } = req.body
  let sql = `select u.id, userName, phone, icon, nickName, u.createTime, u.status, sex, u.remark, ur.roleId from users u left join user_of_role ur on ur.userId = u.id where ur.roleId is null and userName != 'admin'`

  const num = (pageNum - 1) * pageSize
  sql += ` ORDER BY id LIMIT ? OFFSET ?`;
  const responese = await db(sql, [pageSize, num]);
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

// 获取已绑定用户
router.post('/bindUser/list', async (req, res, next) => {
  const { pageNum, pageSize, roleId } = req.body
  let sql = `select u.id, userName, phone, icon, nickName, u.createTime, u.status, sex, u.remark, ur.roleId from users u left join user_of_role ur on ur.userId = u.id where ur.roleId is not null and ur.roleId = '${roleId}' and userName != 'admin'`

  const num = (pageNum - 1) * pageSize

  sql += ` ORDER BY id LIMIT ? OFFSET ?`;
  const responese = await db(sql, [pageSize, num]);
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

// 分配用户
router.post('/bind', checkPermission('system:role:bind'), async (req, res, next) => {
  const { userIds, roleId } = req.body
  if (!userIds) {
    res.send({
      msg: '没找到用户信息',
      code: 400
    })
  }

  if (!roleId) {
    res.send({
      msg: '没找到角色信息',
      code: 400
    })
  }

  userIds.forEach(async s => {
    const responese = await db(`select userId, roleId from user_of_role where userId = ?`, [s])
    if (responese && responese.length > 0) {
      await db(
        `update user_of_role set roleId = ? where userId = ?`, [roleId, s]
      )
    } else {
      await db(
        `INSERT INTO user_of_role(id, userId, roleId, createTime) VALUES (?, ?, ?, ?);`,
        [`${uuid.v4()}`, s, roleId, `${utcNow()}`]
      )
    }
  })

  res.send({
    msg: '操作成功',
    code: 200
  })
})

// 取消分配用户
router.post('/unBind', checkPermission('system:role:unBind'), async (req, res, next) => {
  const { userIds, roleId } = req.body
  console.log(userIds);
  if (!userIds) {
    res.send({
      msg: '没找到用户信息',
      code: 400
    })
  }

  if (!roleId) {
    res.send({
      msg: '没找到角色信息',
      code: 400
    })
  }

  userIds.forEach(async s => {
    await db(
      `delete from user_of_role where roleId = ? and userId = ?`,
      [roleId, s]
    )
  })

  res.send({
    msg: '操作成功',
    code: 200
  })
})

// 导出
router.post('/export', checkPermission('system:role:export'), async (req, res, next) => {
  const { pageNum, pageSize, role, roleName, status, createStartTime, createEndTime } = req.body
  let sql = `select * from role`
  let whereClause = '';
  let params = []

  if (role) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` role LIKE ?`;
    params.push(`%${role}%`)
  }

  if (roleName) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` roleName LIKE ?`;
    params.push(`%${roleName}%`)
  }

  if (createStartTime && createEndTime) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` createTime BETWEEN ? AND ?`;
    params.push(createStartTime, createEndTime)
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

  sql += ` ORDER BY sort LIMIT ? OFFSET ?`;
  params.push(pageSize, num)
  const responese = await db(sql, params);
  const excelData = [
    ['角色编号', '角色名称', '权限字符', '显示顺序', '状态', '创建时间'],
    ...responese?.map(item => [item.id, item.roleName, item.role, item.sort, item.status === 1 ? '正常' : '停用', filterTime(item.createTime)])
  ]
  const buffer = xlsx.build([{ name: "导出表", data: excelData }]);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent('导出数据.xlsx'));

  res.send(buffer)
})

module.exports = router
