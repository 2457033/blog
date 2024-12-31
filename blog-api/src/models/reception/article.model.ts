import { Query } from '@/config/mysql'
import { filterTime, utcNow } from '@/utils/common'

class ArticleModel {
  async getArticleList(data: {
    pageSize: number
    pageNum: number
    category: string
    searchVal: string
  }) {
    const { pageSize, pageNum, category, searchVal } = data
    let sql = `select b.*, count(DISTINCT bv.id) as visitCount,
    count(DISTINCT bc.id) as commonCount, count(DISTINCT bl.id) as likeCount,
    u.nickName as publishName, u.icon as publishIcon 
    from blog b
    left join blog_visit bv on b.id = bv.blogId
    left join blog_common bc on b.id = bc.blogId
    left join blog_like bl on b.id = bl.blogId
    left join users u on b.userId = u.id
    where blogType = 1`
    let OrderBY = ''
    let whereCaluse = ''
    let params = []
    let paramsCount = []
    if (searchVal) {
      whereCaluse += ` and b.title like ? or b.text like ? or b.tags like ?`
      params.push(`%${searchVal}%`, `%${searchVal}%`, `%${searchVal}%`)
      paramsCount.push(`%${searchVal}%`, `%${searchVal}%`, `%${searchVal}%`)
    }
    if (category !== '最热') {
      OrderBY = `ORDER BY b.createTime`
    } else {
      OrderBY = `ORDER BY b.createTime, visitCount`
    }
    if (whereCaluse) {
      sql += whereCaluse
    }
    const num = (pageNum - 1) * pageSize
    const sqlCount = sql + ` GROUP BY b.id ${OrderBY} desc`
    const sqlList = sql + ` GROUP BY b.id ${OrderBY} desc LIMIT ? OFFSET ?`
    params.push(pageSize, num)
    const [result, resultCount] = await Promise.all([
      Query(sqlList, params),
      Query(sqlCount, paramsCount)
    ])
    return {
      row: result,
      total: resultCount.length || 0
    }
  }

  async getArticleCategory(userId: string) {
    const result = await Query(
      `
      select id, category, sort, createTime from blog_category where userId = ? order by sort
      `,
      [userId]
    )
    return result
  }

  async getArticleDetail(id: string) {
    const result = (
      await Query(
        `select b.*, count(bv.id) as visitCount,
    count(bc.id) as conmonCount, count(bl.id) as likeCount,
    u.nickName as publishName, u.icon as publishIcon,
    GROUP_CONCAT(DISTINCT bl.userId) AS likedUserIds,
    GROUP_CONCAT(DISTINCT bcoll.id) as collectionUserIds
    from blog b
    left join blog_visit bv on b.id = bv.blogId
    left join blog_common bc on b.id = bc.blogId
    left join blog_like bl on b.id = bl.blogId
    left join blog_collection bcoll on b.id = bcoll.blogId
    left join users u on b.userId = u.id
    where blogType = 1 and b.id = ?`,
        [id]
      )
    ).at(0)
    result.createTime = filterTime(result.createTime)
    result.likedUserIds = result.likedUserIds?.split(',') || []
    result.collectionUserIds = result.collectionUserIds?.split(',') || []
    return result
  }

  async likeArticle(data: { blogId: number; id: string }) {
    const { blogId, id } = data
    await Query(
      `insert into blog_like(blogId, userId, createTime) values(?, ?, ?)`,
      [blogId, id, utcNow()]
    )
  }

  async unLikeArticle(data: { blogId: number; id: string }) {
    const { blogId, id } = data
    await Query(`delete from blog_like where blogId = ? and userId = ?`, [
      blogId,
      id
    ])
  }

  async collectionArticle(data: { blogId: number; id: string }) {
    const { blogId, id } = data
    await Query(
      `insert into blog_collection(blogId, userId, createTime) values(?, ?, ?)`,
      [blogId, id, utcNow()]
    )
  }

  async unCollectionArticle(data: { blogId: number; id: string }) {
    const { blogId, id } = data
    await Query(`delete from blog_collection where blogId = ? and userId = ?`, [
      blogId,
      id
    ])
  }

  async visitArticle(data: { blogId: number; userId: string }) {
    const { blogId, userId } = data
    try {
      const exist = await Query(
        `select id from blog_visit where blogId = ? and userId = ?`,
        [blogId, userId]
      )
      if (exist?.length > 0) {
        return
      }
      await Query(
        `insert into blog_visit(blogId, userId, createTime) values(?, ?, ?)`,
        [blogId, userId, utcNow()]
      )
    } catch (error) {
      throw new Error('操作失败')
    }
  }
}

export const articleModel = new ArticleModel()
