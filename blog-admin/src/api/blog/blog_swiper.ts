import request from '@/request'

export interface Row {
  id?: number
  img?: string
  imgStatus?: number
  sort?: number
  createTime?: string
  loading?: boolean
}

interface BlogSwiperListD {
  row: Row[]
  total: number
}

interface BlogSwiperListQ {
  pageSize: number
  pageNum: number
}

interface BlogSwiperAddQ {
  img: string
  imgStatus: number
  sort: number
}

interface BlogSwiperUpdateQ extends BlogSwiperAddQ {
  id: number
}

interface BlogSwiperUpdateStatusQ {
  id: number
  imgStatus: number
}

/** 轮播列表 */
export const postBlogSwiperList = (data: BlogSwiperListQ) => {
  return request.post<BlogSwiperListD>('/api/blog_swiper/list', data)
}

/** 新增轮播 */
export const postBlogSwiperAdd = (data: BlogSwiperAddQ) => {
  return request.post('/api/blog_swiper/add', data)
}

/** 修改轮播 */
export const postBlogSwiperUpdate = (data: BlogSwiperUpdateQ) => {
  return request.post('/api/blog_swiper/update', data)
}

/** 修改轮播状态 */
export const postBlogSwiperUpdateStatus = (data: BlogSwiperUpdateStatusQ) => {
  return request.post('/api/blog_swiper/update/status', data)
}

/** 删除 */
export const getBlogSwiperDelete = (id: number) => {
  return request.get('/api/blog_swiper/delete', { id })
}
