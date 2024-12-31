import { commentModel } from '@/models/reception/comment.model'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'

class CommentController {
  async getCommentList(req: Request, res: Response) {
    const { pageSize, pageNum, blogId } = req.body
    const result = await commentModel.getCommentList({
      pageSize,
      pageNum,
      blogId
    })
    responseHandler.successList(res, result)
  }

  async addComment(req: Request, res: Response) {
    const { fId, message, blogId, toUserId, commonType } = req.body
    const userId = req.tokenPayload?.id
    if (!userId) {
      responseHandler.error(res, '用户未登录', 401)
      return
    }
    if (!blogId) {
      responseHandler.error(res, '没有文章id')
      return
    }
    if (!message) {
      responseHandler.error(res, '没有输入消息')
      return
    }
    await commentModel.addComment({
      fId,
      message,
      blogId,
      toUserId,
      commonType,
      userId: String(userId)
    })
    responseHandler.success(res, null)
  }

  async expandApply(req: Request, res: Response) {
    const { id, pageSize, pageNum } = req.body
    if (!id) {
      responseHandler.error(res, '没有评论id')
      return
    }
    const result = await commentModel.expandApply({ id, pageSize, pageNum })
    responseHandler.success(res, result)
  }
}

export const commentController = new CommentController()
