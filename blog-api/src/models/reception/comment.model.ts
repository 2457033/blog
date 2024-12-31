import { Query } from '@/config/mysql'
import { utcNow } from '@/utils/common'

class CommentModel {
  async getCommentList(data: {
    blogId: string
    pageSize: number
    pageNum: number
  }) {
    const { blogId, pageSize, pageNum } = data
    let sql = `
    select bc.id, bc.fId, bc.userId, bc.message, bc.blogId, bc.createTime, bc.toUserId, bc.commonType, u.icon, u.nickName from blog_common bc left join users u on bc.userId = u.id
    `
    const num = (pageNum - 1) * pageSize
    sql += ` where blogId = ? and fId is null GROUP BY createTime desc limit ? offset ?`
    const params = [blogId, pageSize, num]
    const [result, count] = await Promise.all([
      Query(sql, params),
      Query(`select count(id) as count from blog_common where blogId = ?`, [
        blogId
      ])
    ])
    for (const item of result) {
      const applyCount = (
        await Query(
          `select count(id) as count from blog_common where fId = ?`,
          [item.id]
        )
      )?.at(0)?.count
      item.commonCount = applyCount ?? 0
    }
    return {
      row: result,
      total: count[0]?.count ?? 0
    }
  }

  async addComment(data: {
    fId: string
    message: string
    blogId: string
    toUserId: string
    commonType: string
    userId: string
  }) {
    const { fId, message, blogId, toUserId, commonType, userId } = data
    const toUserIdF = toUserId === undefined || !toUserId ? null : `${toUserId}`
    await Query(
      `insert into blog_common(fId, userId, toUserId,  message, blogId, commonType, createTime) values(?, ?, ?, ?, ?, ?, ?)`,
      [fId, userId, toUserIdF, message, blogId, commonType, utcNow()]
    )
  }

  async expandApply(data: { id: string; pageSize: number; pageNum: number }) {
    const { id, pageSize, pageNum } = data
    const num = (pageNum - 1) * (pageSize - 2)
    const result = await Query(
      `
      select bc.id, bc.fId, bc.userId, bc.toUserId, bc.message, bc.blogId, 
      bc.createTime, bc.commonType, to_user.icon, to_user.nickName as toNickName from blog_common bc 
      left join users to_user on bc.toUserId = to_user.id 
      left join users from_user on bc.userId = from_user.id 
      where fId = ? order by createTime desc limit ? offset ?`,
      [id, pageSize, num]
    )
    return result
  }
}

export const commentModel = new CommentModel()
