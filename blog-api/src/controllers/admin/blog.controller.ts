import { blogModel } from '@/models/admin/blog.model'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'

class BlogController {
  // 获取博客列表
  async getBlogList(req: Request, res: Response) {
    const { type, tagType, pageSize, pageNum, searchVal } = req.body
    const { id } = req.tokenPayload
    if (!type) {
      responseHandler.error(res, '缺少博客类型')
      return
    }
    if (!id) {
      responseHandler.error(res, '未登录或登录失效')
      return
    }
    try {
      const result = await blogModel.getBlogList({
        type,
        tagType,
        pageSize,
        pageNum,
        searchVal,
        id: String(id)
      })
      responseHandler.successList(res, {
        row: result,
        total: result.length
      })
    } catch (error) {
      responseHandler.error(res, '获取博客列表失败')
    }
  }
  // 修改博客类型
  async updateBlogType(req: Request, res: Response) {
    const { id, blogType } = req.body
    if (!id) {
      responseHandler.error(res, '缺少博客id')
      return
    }
    if (!blogType) {
      responseHandler.error(res, '缺少博客类型')
      return
    }
    try {
      await blogModel.updateBlogType({ id, blogType })
      responseHandler.success(res, '修改博客类型成功')
    } catch (error) {
      responseHandler.error(res, '修改博客类型失败')
    }
  }

  // 删除博客
  async deleteBlog(req: Request, res: Response) {
    const { id } = req.query
    if (!id) {
      responseHandler.error(res, '缺少博客id')
      return
    }
    await blogModel.deleteBlog(Number(id))
    responseHandler.success(res, '删除博客成功')
  }

  // 新增博客
  async addBlog(req: Request, res: Response) {
    const { id } = req.tokenPayload
    const data = req.body
    if (!data.title) {
      responseHandler.error(res, '缺少博客标题')
      return
    }
    if (!data.text) {
      responseHandler.error(res, '缺少博客简介')
      return
    }
    if (!data.detail) {
      responseHandler.error(res, '缺少博客内容')
      return
    }
    if (!id) {
      responseHandler.error(res, '未登录或登录失效', 401)
      return
    }
    await blogModel.addBlog({ ...data, userId: String(id) })
    responseHandler.success(res, '新增博客成功')
  }

  // 获取博客详情
  async getBlogDetail(req: Request, res: Response) {
    const { id } = req.query
    if (!id) {
      responseHandler.error(res, '缺少博客id')
      return
    }
    const result = await blogModel.getBlogDetail(Number(id))
    if (result.tags) {
      result.tags = result.tags.split(',')
    }
    responseHandler.success(res, result)
  }

  // 修改博客
  async updateBlog(req: Request, res: Response) {
    const { id, img, text, title, detail, categoryType, tags } = req.body
    if (!id) {
      responseHandler.error(res, '缺少博客id')
      return
    }
    if (!title) {
      responseHandler.error(res, '缺少博客标题')
      return
    }
    if (!text) {
      responseHandler.error(res, '缺少博客简介')
      return
    }
    if (!detail) {
      responseHandler.error(res, '缺少博客内容')
      return
    }
    await blogModel.updateBlog({
      id,
      img,
      text,
      title,
      detail,
      categoryType,
      tags
    })
    responseHandler.success(res, null)
  }

  // 获取轮播图列表
  async getBlogSwiperList(req: Request, res: Response) {
    const { pageSize, pageNum } = req.body
    const result = await blogModel.getBlogSwiperList({ pageSize, pageNum })
    responseHandler.successList(res, {
      row: result,
      total: result.length
    })
  }

  // 新增轮播图
  async addBlogSwiper(req: Request, res: Response) {
    const { img, imgStatus, sort } = req.body
    if (!img) {
      responseHandler.error(res, '缺少图片')
      return
    }
    if (imgStatus === undefined || imgStatus === null) {
      responseHandler.error(res, '缺少图片状态')
      return
    }
    if (!sort) {
      responseHandler.error(res, '缺少排序')
      return
    }
    try {
      await blogModel.addBlogSwiper({ img, imgStatus, sort })
      responseHandler.success(res, '新增轮播图成功')
    } catch (error: any) {
      responseHandler.error(res, error.message)
    }
  }

  // 修改轮播图
  async updateBlogSwiper(req: Request, res: Response) {
    const { id, img, imgStatus, sort } = req.body
    if (!id) {
      responseHandler.error(res, '缺少轮播图id')
      return
    }
    try {
      await blogModel.updateBlogSwiper({ id, img, imgStatus, sort })
      responseHandler.success(res, '修改轮播图成功')
    } catch (error: any) {
      responseHandler.error(res, error.message)
    }
  }

  // 修改轮播图状态
  async updateBlogSwiperStatus(req: Request, res: Response) {
    const { id, imgStatus } = req.body
    if (!id) {
      responseHandler.error(res, '缺少轮播图id')
      return
    }
    if (imgStatus === undefined || imgStatus === null) {
      responseHandler.error(res, '缺少轮播图状态')
      return
    }
    try {
      await blogModel.updateBlogSwiperStatus({ id, imgStatus })
      responseHandler.success(res, '修改轮播图状态成功')
    } catch (error: any) {
      responseHandler.error(res, error.message)
    }
  }

  // 删除轮播图
  async deleteBlogSwiper(req: Request, res: Response) {
    const { id } = req.query
    if (!id) {
      responseHandler.error(res, '缺少轮播图id')
      return
    }
    await blogModel.deleteBlogSwiper(Number(id))
    responseHandler.success(res, '删除轮播图成功')
  }

  // 获取博客分类
  async getBlogCategory(req: Request, res: Response) {
    const { id } = req.tokenPayload
    if (!id) {
      responseHandler.error(res, '未登录或登录失效')
      return
    }
    const result = await blogModel.getBlogCategory(String(id))
    responseHandler.success(res, result)
  }

  // 新增博客分类
  async addBlogCategory(req: Request, res: Response) {
    const { category } = req.body
    const { id } = req.tokenPayload
    if (!category) {
      responseHandler.error(res, '缺少分类字段')
      return
    }
    const type = '666'
    if (!type) {
      responseHandler.error(res, '服务器出现错误')
      return
    }
    await blogModel.addBlogCategory({
      category,
      type,
      id: String(id)
    })
    responseHandler.success(res, '新增博客分类成功')
  }

  // 修改博客分类
  async updateBlogCategory(req: Request, res: Response) {
    const { id, category, sort } = req.body
    const userId = req.tokenPayload.id
    if (!id) {
      responseHandler.error(res, '缺少博客分类id')
      return
    }
    await blogModel.updateBlogCategory({
      id,
      category,
      sort,
      userId: String(userId)
    })
    responseHandler.success(res, null)
  }

  // 删除博客分类
  async deleteBlogCategory(req: Request, res: Response) {
    const { id } = req.query
    const userId = req.tokenPayload.id
    if (!id) {
      responseHandler.error(res, '缺少博客分类id')
      return
    }
    await blogModel.deleteBlogCategory({
      id: Number(id),
      userId: String(userId)
    })
    responseHandler.success(res, null)
  }

  // 修改博客分类排序
  async updateBlogCategorySort(req: Request, res: Response) {
    const { drapSort, drapCategory, sort, category } = req.body
    if (!drapSort || !drapCategory || !sort || !category) {
      responseHandler.error(res, '缺少排序标签或排序数值')
      return
    }
    await blogModel.updateBlogCategorySort({
      drapSort,
      drapCategory,
      sort,
      category
    })
    responseHandler.success(res, null)
  }

  // 获取博客分类排序
  async getBlogCategoryAll(req: Request, res: Response) {
    const { id } = req.tokenPayload
    if (!id) {
      responseHandler.error(res, '未登录或登录失效')
      return
    }
    const result = await blogModel.getBlogCategoryAll(String(id))
    const list = result.map((item) => ({
      code: item.category,
      value: item.category
    }))
    responseHandler.success(res, list)
  }
}

export const blogController = new BlogController()
