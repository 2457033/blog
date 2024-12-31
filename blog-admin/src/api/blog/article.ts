import request from '@/request'

interface ArticleF {
  pageSize: number
  pageNum: number
  title: string
  nickName: string
}

interface Article {
  row: Row[]
  total: number
}

export interface Row {
  id: number
  img: string
  text: string
  title: string
  categoryType: string
  tags: string[]
  blogType: number
  nickName: string
  createTime: string
  visitCount: number
  commonCount: number
  likeCount: number
}

export interface ArticleDetail extends Row {
  detail: string
}

/** 获取全部文章 */
export const postArticleList = (data: ArticleF) => {
  return request.post<Article>('/api/article/list', data)
}

/** 获取文章详情 */
export const getArticleDetail = (id: number) => {
  return request.get<ArticleDetail>('/api/article/detail', { id })
}
