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
  collectionUserIds: string[]
}

interface LikeQ {
  blogId: number
  id: string
}

/** 文章列表 */
export const postArticleList = (data: ArticleListQ) => {
  return request.post<ArticleListD>('/api/reception/article/list', data)
}

/** 文章列表 */
export const getArticleCategory = () => {
  return request.get<ArticleListD>('/api/reception/article/category')
}

/** 文章详情 */
export const getArticleDetail = (id: number) => {
  return request.get<Row>('/api/reception/article/detail', { id })
}

/** 文章详情点赞 */
export const postArticleDetailLike = (data: LikeQ) => {
  return request.post('/api/reception/article/like', data)
}

/** 文章详情取消点赞 */
export const postArticleDetailUnLike = (data: LikeQ) => {
  return request.post('/api/reception/article/unLike', data)
}

/** 文章详情收藏 */
export const postArticleDetailCollection = (data: LikeQ) => {
  return request.post('/api/reception/article/collection', data)
}

/** 文章详情取消收藏 */
export const postArticleDetailUnCollection = (data: LikeQ) => {
  return request.post('/api/reception/article/unCollection', data)
}

/** 文章详情访问 */
export const postArticleDetailVisit = (blogId: number) => {
  return request.post('/api/reception/article/visit', { blogId })
}
