import { Query } from '@/config/mysql'
import { filterTime, utcNow } from '@/utils/common'
import { v4 as uuidv4 } from 'uuid'

class ArticleModel {
  async getArticleList(data: {
    pageSize: number
    pageNum: number
    title: string
    nickName: string
  }) {
    const { pageSize, pageNum, title, nickName } = data
    let whereClause = ''
    let params = []
    let paramsCount = []
    if (title) {
      if (whereClause) whereClause += ' and'
      whereClause += ` b.title like ?`
      params.push(`%${title}%`)
      paramsCount.push(`%${title}%`)
    }
    if (nickName) {
      if (whereClause) whereClause += ' and'
      whereClause += ` u.nickName like ?`
      params.push(`%${nickName}%`)
      paramsCount.push(`%${nickName}%`)
    }
    const num = (pageNum - 1) * pageSize
    let sql = `select b.id, b.img, b.text, b.title, b.categoryType, b.tags, b.blogType, b.createTime, u.nickName,
    (SELECT COUNT(*) FROM blog_visit WHERE blogId = b.id) as visitCount,
    (SELECT COUNT(*) FROM blog_common WHERE blogId = b.id) as commonCount,
    (SELECT COUNT(*) FROM blog_like WHERE blogId = b.id) as likeCount
    from blog b
    left join users u on b.userId = u.id
    `
    if (whereClause) {
      sql += ' where ' + whereClause
    }
    const sqlList = sql + ` order by b.createTime desc limit ? offset ?`
    const sqlCount = sql + ` order by b.createTime desc`
    params.push(pageSize, num)
    const [result, count] = await Promise.all([
      Query(sqlList, params),
      Query(sqlCount, paramsCount)
    ])
    result.forEach((s) => {
      s.createTime = filterTime(s.createTime)
      if (s.tags) {
        s.tags = s.tags?.split(',')
      }
    })
    return {
      row: result,
      total: count.length ?? 0
    }
  }

  async getArticleDetail(id: number) {
    let sql = `select b.id, b.img, b.text, b.title, b.detail, b.categoryType, b.tags, b.blogType, b.createTime, u.nickName,
    (SELECT COUNT(*) FROM blog_visit WHERE blogId = b.id) as visitCount,
    (SELECT COUNT(*) FROM blog_common WHERE blogId = b.id) as commonCount,
    (SELECT COUNT(*) FROM blog_like WHERE blogId = b.id) as likeCount
    from blog b
    left join users u on b.userId = u.id
    where b.id = ?`
    const [result] = await Query(sql, [id])
    result.createTime = filterTime(result.createTime)
    result.tags = result.tags ? result.tags?.split(',') : []
    return result
  }
}

export const articleModel = new ArticleModel()
