var express = require('express')
var router = express.Router()
const db = require('../../../db')
const tokenServer = require('../../../utils/token')
const { filterTime } = require('../../../utils/common')

router.post('/login', async (req, res, next) => {
  const { userName, password, code } = req.body
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

  const data = await db(sql, [userName, password, userName, password])

  if (data && data.length) {
    const userInfo = data[0]

    const tokenStr = tokenServer.signByPayload({
      id: userInfo.id
    })

    // if (data[0]?.userName !== 'admin') {
    //   if (data[0]?.status === 0) {
    //     return res.status(423).send({
    //       msg: '该账户已被禁用',
    //       code: 423
    //     })
    //   }
    //   if (!data[0]?.role) {
    //     return res.status(453).send({
    //       msg: '该用户未绑定角色，请联系管理员',
    //       code: 453
    //     })
    //   }
    //   if (data[0]?.roleStatus === 0) {
    //     return res.status(473).send({
    //       msg: '该账户绑定的角色已被禁用，请联系管理员',
    //       code: 473
    //     })
    //   }
    // }

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
  const { id } = req.tokenPayload || {}
  if (!id) {
    res.send({
      code: 400,
      msg: '登录失效'
    })
  }

  const responese = (
    await db(
      `select u.id, u.icon, u.createTime, u.nickName, u.phone, u.userName, u.sex, r.role, 
      r.roleName, r.permission, r.selectIds, r.remark, count(b.id) as articleCount,
      count(bv.id) as visitCount, count(bl.id) as likeCount
      from users u
      left join user_of_role ur on ur.userId = u.id
      left join role r on r.id = ur.roleId
      left join blog b on u.id = b.userId
      left join blog_visit bv on b.id = bv.blogId and u.id != bv.userId
      left join blog_like bl on b.id = bl.blogId and u.id != bl.userId
      where u.id = ? GROUP BY u.id;`,
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

module.exports = router
