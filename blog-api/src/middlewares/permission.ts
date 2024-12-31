import { Query } from '@/config/mysql'
import { responseHandler } from '@/utils/response'
import { NextFunction, Request, Response } from 'express'

export function checkPermission(requiredPermission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.tokenPayload
    if (!id) {
      responseHandler.customError(res, { code: 401, msg: '请重新登录' })
      next()
    }
    const responese = (
      await Query(
        `select permission as permission from role r join user_of_role uoo on r.id = uoo.roleId where uoo.userId = ?`,
        [id]
      )
    )?.at(0)
    let permission = responese?.permission
    if (permission === '*:*:*') {
      next()
    } else {
      if (
        permission?.includes(requiredPermission) ||
        permission === requiredPermission
      ) {
        next()
      } else {
        responseHandler.customError(res, { code: 403, msg: '暂无权限' })
      }
    }
  }
}
