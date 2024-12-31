import { articleModel } from '@/models/reception/article.model'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'

class ArticleController {
  /** 获取文章列表 */
  async getArticleList(req: Request, res: Response) {
    const { pageSize, pageNum, category, searchVal } = req.body
    const result = await articleModel.getArticleList({
      pageSize,
      pageNum,
      category,
      searchVal
    })
    responseHandler.successList(res, result)
  }

  /** 获取文章分类 */
  async getArticleCategory(req: Request, res: Response) {
    const { id } = req.tokenPayload || {}
    if (!id) {
      responseHandler.error(res, '登录已失效')
      return
    }
    const result = await articleModel.getArticleCategory(String(id))
    responseHandler.success(res, result)
  }

  /** 获取文章详情 */
  async getArticleDetail(req: Request, res: Response) {
    const { id } = req.query
    if (!id) {
      responseHandler.error(res, '缺少内容参数')
      return
    }
    const result = await articleModel.getArticleDetail(String(id))
    responseHandler.success(res, result)
  }

  /** 点赞 */
  async likeArticle(req: Request, res: Response) {
    const { blogId } = req.body
    const { id } = req.tokenPayload || {}
    if (!id) {
      responseHandler.error(res, '登录已失效')
      return
    }
    await articleModel.likeArticle({ id: String(id), blogId })
    responseHandler.success(res, null)
  }

  /** 取消点赞 */
  async unLikeArticle(req: Request, res: Response) {
    const { blogId } = req.body
    const { id } = req.tokenPayload || {}
    if (!id) {
      responseHandler.error(res, '登录已失效')
      return
    }
    await articleModel.unLikeArticle({ id: String(id), blogId })
    responseHandler.success(res, null)
  }

  /** 收藏 */
  async collectionArticle(req: Request, res: Response) {
    const { blogId } = req.body
    const { id } = req.tokenPayload || {}
    if (!id) {
      responseHandler.error(res, '登录已失效')
      return
    }
    await articleModel.collectionArticle({ id: String(id), blogId })
    responseHandler.success(res, null)
  }

  /** 取消收藏 */
  async unCollectionArticle(req: Request, res: Response) {
    const { blogId } = req.body
    const { id } = req.tokenPayload || {}
    if (!id) {
      responseHandler.error(res, '登录已失效')
      return
    }
    await articleModel.unCollectionArticle({ id: String(id), blogId })
    responseHandler.success(res, null)
  }

  /** 访问 */
  async visitArticle(req: Request, res: Response) {
    const { blogId } = req.body
    const { id } = req.tokenPayload || {}
    if (!id) {
      responseHandler.error(res, '登录已失效')
      return
    }
    await articleModel.visitArticle({ userId: String(id), blogId })
    responseHandler.success(res, null)
  }
}

export const articleController = new ArticleController()
