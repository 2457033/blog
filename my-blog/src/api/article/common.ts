import request from '@/request'

interface ArticleCommonListQ {
  pageSize: number
  pageNum: number
  blogId: number
}

interface ArticleListD {
  row: CommonRow[]
  total: number
}

export interface CommonRow {
  id?: number
  fId?: number
  userId?: string
  message?: string
  blogId?: number
  createTime?: string
  icon?: string
  nickName?: string
  isMessage?: boolean
  loading?: boolean
  toIcon?: string
  toNickName?: string
  commonCount?: number
  children?: CommonRow[]
  replyNum?: number
  replySize?: number
}

interface ArticleCommonAddQ {
  fId: number | null
  message: string
  blogId: number
  toUserId: string
}

export interface ArticleCommonExpandQ {
  id: number
  pageSize: number
  pageNum: number
}

/** 评论列表 */
export const postArticleCommonList = (data: ArticleCommonListQ) => {
  return request.post<ArticleListD>('/api/reception/comment/list', data)
}

/** 新增评论 */
export const postArticleCommonAdd = (data: ArticleCommonAddQ) => {
  return request.post('/api/reception/comment/add', data)
}

/** 展开更多回复 */
export const postArticleCommonExpand = (data: ArticleCommonExpandQ) => {
  return request.post('/api/reception/comment/expandApply', data)
}
