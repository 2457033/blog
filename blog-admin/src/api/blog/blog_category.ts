import request from '@/request'

export interface blogCategoryF {
  delLoading?: boolean
  loading?: boolean
  error?: any
  isEdit?: boolean
  value?: string
  id: string
  category: string
  count: number
  type: string
  sort: number
}

interface categoryEditD {
  id?: string
  category?: string
  sort?: string
}

interface CategorySortF {
  drapSort: number
  drapCategory: string
  sort: number
  category: string
}

/** 分类列表 */
export const getBlogCategory = () => {
  return request.get<blogCategoryF[]>('/api/blog/category')
}

/** 增加分类 */
export const postBlogCategoryAdd = (category: string) => {
  return request.post('/api/blog/category/add', { category })
}

/** 修改分类 */
export const postBlogCategoryEdit = (data: categoryEditD) => {
  return request.post('/api/blog/category/edit', data)
}

/** 修改排序 */
export const postBlogCategorySort = (data: CategorySortF) => {
  return request.post('/api/blog/category/sort/update', data)
}

/** 删除 */
export const getBlogCategoryDel = (id: string) => {
  return request.get('/api/blog/category/delete', { id })
}

/** 获取分类 */
export const getCategory = () => {
  return request.get('/api/blog/category/all')
}
