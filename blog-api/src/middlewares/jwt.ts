import { responseHandler } from '@/utils/response'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  id: number | string
  [key: string]: any
}

interface TokenConfig {
  secret: string
  signOptions: jwt.SignOptions
  requireCheckPaths: (RegExp | string)[]
}

class JWTService {
  private config: TokenConfig = {
    secret: process.env.JWT_SECRET!,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN
    },
    requireCheckPaths: [
      /^\/api\/users\/(?!(?:.*?\/)?login($|\/)).*$/,
      // /^\/api\/menus/,
      /^\/api\/role/,
      /^\/api\/auth\/(?!(?:.*?\/)?login($|\/)).*$/,
      /^\/api\/upload\/user/,
      /^\/api\/menus\/(?!$).+$/,
      /^\/api\/home/,
      /^\/api\/blog/,
      /^\/api\/blog_category/,
      /^\/api\/upload_image/
    ]
  }
  /**
   * 生成 token
   * @param payload 需要加密的数据
   */
  sign(payload: JWTPayload) {
    return jwt.sign(payload, this.config.secret!, this.config.signOptions)
  }

  /**
   * 验证路径是否需要token校验
   * @param path 请求路径
   */
  isPathRequireCheck(path: string): boolean {
    return this.config.requireCheckPaths.some((s) => {
      if (typeof s == 'object') return s.test(path)
      if (typeof s == 'string') return s == path
    })
  }

  /**
   * 验证 token
   * @param token JWT token字符串
   */
  verifyToken(token: string): Promise<JWTPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.config.secret!, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded as JWTPayload)
        }
      })
    })
  }

  /**
   * Express 中间件：验证 token
   */
  verify = async (req: Request, res: Response, next: NextFunction) => {
    const isForceCheck = this.isPathRequireCheck(req.url)
    const authorization = req.headers.authorization

    if (!authorization && isForceCheck) {
      responseHandler.customError(res, {
        code: 401,
        msg: '缺少认证资源'
      })
      return
    }
    if (authorization?.split(' ').length != 2 && isForceCheck) {
      responseHandler.customError(res, {
        code: 401,
        msg: '非法token'
      })
      return
    }
    const token = authorization?.split(' ')[1]
    if (!token && !isForceCheck) {
      next()
      return
    }

    try {
      const decoded = await this.verifyToken(token!)
      req.tokenPayload = decoded ?? {}
      next()
    } catch (err) {
      const message =
        err instanceof jwt.TokenExpiredError ? 'token已过期' : 'token无效'
      if (isForceCheck) {
        responseHandler.customError(res, {
          code: 401,
          msg: message
        })
      } else {
        next()
      }
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    tokenPayload: JWTPayload
  }
}

export const tokenServer = new JWTService()
