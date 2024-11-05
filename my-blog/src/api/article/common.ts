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
  replyLoading?: boolean
  toIcon?: string
  toNickName?: string
  commonCount?: number
  children?: CommonRow[]
}

interface ArticleCommonAddQ {
  fId: number | null
  message: string
  blogId: number
  toUserId: string
}

/** 评论列表 */
export const postArticleCommonList = (data: ArticleCommonListQ) => {
  return request.post<ArticleListD>('/api/backend/article/common/list', data)
}

/** 新增评论 */
export const postArticleCommonAdd = (data: ArticleCommonAddQ) => {
  return request.post('/api/backend/article/common/add', data)
}
