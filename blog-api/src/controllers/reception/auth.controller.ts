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
