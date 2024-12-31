import request from '@/request'

interface BlogAllF {
  pageSize: number
  pageNum: number
  title: string
  nickName: string
}

interface BlogAllR {
  row: AllRow[]
  total: number
}

interface AllRow {
  id: number
  img: string
  text: string
  title: string
  categoryType: string
  tags: string[]
  blogType: number
  nickName: string
  createTime: string
}

interface BlogList {
  row: Row[]
  total: number
}

export interface Row {
  id: number
  img: string
  text: string
  title: string
  userId: string
  categoryType: string
  createTime: string
  conmonCount: number
  likeCount: number
  visitCount: number
  blogType: number
  tags: string[]
  isDel?: boolean
}

interface BlogListF {
  type: string
  pageSize: number
  pageNum: number
  tagType: string
  searchVal: string
}

interface BlogUpdateBlogType {
  id: number
  blogType: number
}

interface BlogAddD {
  img: string
  text: string
  title: string
  detail: string
  categoryType: string
  tags: string
  blogType: number
}

interface BlogDtail {
  img: string
  text: string
  title: string
  detail: string
  categoryType: string
  tags: string[]
}

interface BlogDetailUpdateD {
  id: number
  img: string
  text: string
  title: string
  detail: string
  categoryType: string
  tags: string
}

/** 获取全部文章 */
export const postBlogAll = (data: BlogAllF) => {
  return request.post<BlogAllR>('/api/blog/all', data)
}

/** 个人文章列表 */
export const postBlogList = (data: BlogListF) => {
  return request.post<BlogList>('/api/blog/list', data)
}

/** 发布或撤回某条博客 */
export const postBlogUpdateBlogType = (data: BlogUpdateBlogType) => {
  return request.post('/api/blog/update/blogType', data)
}

/** 删除某条博客 */
export const getBlogDelete = (id: number) => {
  return request.get('/api/blog/delete', { id })
}

/** 删除某条博客 */
export const postBlogAdd = (data: BlogAddD) => {
  return request.post('/api/blog/add', data)
}

/** 下载 */
export const uploadBlogImage = (file: File) => {
  return request.upload('/api/upload_image', file)
}

/** 获取详情 */
export const getBlogDetail = (id: number) => {
  return request.get<BlogDtail>('/api/blog/detail', { id })
}

/** 修改博客 */
export const postBlogDetailUpdate = (data: BlogDetailUpdateD) => {
  return request.post('/api/blog/detail/update', data)
}
