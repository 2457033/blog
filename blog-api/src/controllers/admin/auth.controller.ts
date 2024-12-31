import { tokenServer } from '@/middlewares/jwt'
import { authModel } from '@/models/admin/auth.model'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'

class AuthController {
  async login(req: Request, res: Response) {
    const { userName, password, phone, code } = req.body
    if (!userName) {
      responseHandler.error(res, '请输入用户名或手机号')
      return
    }
    if (!password) {
      responseHandler.error(res, '请输入密码')
      return
    }
    if (!password && !code) {
      responseHandler.error(res, '请输入验证码')
      return
    }
    try {
      const result = await authModel.login({ userName, password, phone, code })
      if (result && result.length) {
        const userInfo = result[0]

        const tokenStr = tokenServer.sign({
          id: userInfo.id
        })

        if (userInfo?.userName !== 'admin') {
          if (userInfo?.status === 0) {
            responseHandler.customError(res, {
              code: 423,
              msg: '该账户已被禁用'
            })
            return
          }
          if (!userInfo?.role) {
            responseHandler.customError(res, {
              code: 453,
              msg: '该用户未绑定角色，请联系管理员'
            })
            return
          }
          if (userInfo?.roleStatus === 0) {
            responseHandler.customError(res, {
              code: 473,
              msg: '该账户绑定的角色已被禁用，请联系管理员'
            })
            return
          }
        }

        responseHandler.success(res, {
          token: tokenStr
        })
      } else {
        responseHandler.error(res, '账号密码错误')
      }
    } catch (error) {
      responseHandler.error(res, '登录失败', 500)
    }
  }

  async getUserInfo(req: Request, res: Response) {
    const { id } = req.tokenPayload
    if (!id) {
      responseHandler.error(res, '缺少token')
      return
    }
    const result = await authModel.getUserInfo(id)
    responseHandler.success(res, result)
  }
}

export const authController = new AuthController()
