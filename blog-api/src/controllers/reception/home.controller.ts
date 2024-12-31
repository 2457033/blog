import { Request, Response } from 'express'
import { homeModel } from '@/models/reception/home.model'
import { responseHandler } from '@/utils/response'

class HomeController {
  /** 获取首页数据 */
  async getHomeList(req: Request, res: Response) {
    const result = await homeModel.getHomeList(req.ip!)
    responseHandler.success(res, result)
  }

  /** 获取最新文章和评论 */
  async getNewInfo(req: Request, res: Response) {
    const result = await homeModel.getNewInfo()
    responseHandler.success(res, result)
  }
}

export const homeController = new HomeController()
