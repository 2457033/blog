const db = require('../db/index')

function checkPermission(requiredPermission) {
  return async (req, res, next) => {
    if (req.tokenPayload) {
      const { id } = req.tokenPayload
      if (!id) {
        res.status(401).send({
          msg: '请重新登录'
        })
        next()
      }
      const responese = (await db(`select permission as permission from role r join user_of_role uoo on r.id = uoo.roleId where uoo.userId = ?`, [id]))?.at()
      let permission = responese?.permission
      if (permission === '*:*:*') {
        next()
      } else {
        if (permission?.includes(requiredPermission) || permission === requiredPermission) {
          next()
        } else {
          res.status(403).send({
            msg: '暂无权限'
          })
        }
      }
    }
  }
}

module.exports = {
  checkPermission
}