import request from '@/request'

interface ArticleListQ {
  pageSize: number
  pageNum: number
  category: string
}

interface ArticleListD {
  row: Row[]
  total: number
}

export interface Row {
  id: number
  img: string
  text: string
  title: string
  detail: string
  userId: string
  categoryType: string
  tags: string[]
  blogType: number
  createTime: string
  visitCount: number
  commonCount: number
  likeCount: number
  publishName: string
  publishIcon: string
  likedUserIds: string[]
}

/** 文章列表 */
export const postArticleList = (data: ArticleListQ) => {
  return request.post<ArticleListD>('/api/backend/article/list', data)
}

/** 文章列表 */
export const getArticleCategory = () => {
  return request.get<ArticleListD>('/api/backend/article/category')
}

/** 文章详情 */
export const getArticleDetail = (id: number) => {
  return request.get<Row>('/api/backend/article/detail', { id })
}
