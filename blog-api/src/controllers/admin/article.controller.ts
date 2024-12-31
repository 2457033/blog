import { articleModel } from '@/models/admin/article.model'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'

class ArticleController {
  /** 获取文章列表 */
  async getArticleList(req: Request, res: Response) {
    const { pageSize, pageNum, title, nickName } = req.body
    const result = await articleModel.getArticleList({
      pageSize,
      pageNum,
      title,
      nickName
    })
    responseHandler.successList(res, result)
  }

  /** 获取文章详情 */
  async getArticleDetail(req: Request, res: Response) {
    const { id } = req.query
    if (!id) {
      responseHandler.error(res, 'id不能为空')
      return
    }
    const result = await articleModel.getArticleDetail(Number(id))
    responseHandler.success(res, result)
  }
}

export const articleController = new ArticleController()
