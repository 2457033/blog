import { Query } from '@/config/mysql'
import { filterTime, utcNow } from '@/utils/common'
import { v4 as uuidv4 } from 'uuid'

interface BlogListData {
  type: string
  tagType: string
  pageSize: number
  pageNum: number
  searchVal: string
  id: string
}

interface addBlogData {
  img: string
  text: string
  title: string
  detail: string
  categoryType: string
  tags: string
  blogType: number
  userId: string
}

interface updateBlogData {
  id: number
  img: string
  text: string
  title: string
  detail: string
  categoryType: string
  tags: string
}

class BlogModel {
  async getBlogList(data: BlogListData) {
    const { type, tagType, pageSize, pageNum, searchVal, id } = data
    let sql = `select b.*, count(bv.id) as visitCount,
            count(bc.id) as conmonCount, count(bl.id) as likeCount from blog b
            left join blog_visit bv on b.id = bv.blogId
            left join blog_common bc on b.id = bc.blogId
            left join blog_like bl on b.id = bl.blogId`
    let params = []
    let whereClause = ''
    if (type && type !== '全部') {
      if (whereClause) whereClause += ' and'
      whereClause += ` b.categoryType = ?`
      params.push(type)
    }
    if (tagType && tagType !== '全部') {
      if (whereClause) whereClause += ' and'
      whereClause += ` b.tags like ?`
      params.push(`%${tagType}%`)
    }
    if (searchVal) {
      if (whereClause) whereClause += ' and'
      whereClause += ` b.text like ? or b.title like ?`
      params.push(`%${searchVal}%`, `%${searchVal}%`)
    }
    if (id) {
      if (whereClause) whereClause += ' and'
      whereClause += ` b.userId = ?`
      params.push(id)
    }
    if (whereClause) {
      sql += ' where ' + whereClause
    }
    const num = (pageNum - 1) * pageSize
    sql += ` GROUP BY b.id ORDER BY b.createTime desc LIMIT ? OFFSET ?`
    params.push(pageSize, num)
    const result = await Query(sql, params)
    result.forEach((s) => {
      s.createTime = filterTime(s.createTime)
      if (s.tags) {
        s.tags = s.tags?.split(',')
      }
    })
    return result
  }
  async updateBlogType(data: { id: string; blogType: string }) {
    const { id, blogType } = data
    await Query(`update blog set blogType = ? where id = ?`, [blogType, id])
  }

  async deleteBlog(id: number) {
    await Query(`delete from blog where id = ?`, [id])
  }

  async addBlog(data: addBlogData) {
    const { img, text, title, detail, categoryType, tags, blogType, userId } =
      data
    const imgF = img == undefined ? null : `${img}`
    const tagsF = tags == undefined ? null : `${tags}`
    const categoryTypeF = categoryType == undefined ? null : `${categoryType}`
    await Query(
      `insert into blog(img, text, title, detail, userId, categoryType, tags, blogType, createTime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        imgF,
        text,
        title,
        detail,
        userId,
        categoryTypeF,
        tagsF,
        blogType,
        utcNow()
      ]
    )
  }

  async getBlogDetail(id: number) {
    const result = (await Query(`select * from blog where id = ?`, [id]))?.at(0)
    return result
  }

  async updateBlog(data: updateBlogData) {
    const { id, img, text, title, detail, categoryType, tags } = data
    const imgF = img === undefined ? null : `${img}`
    const textF = text === undefined ? null : `${text}`
    const titleF = title === undefined ? null : `${title}`
    const tagsF = tags == undefined ? null : `${tags}`
    const categoryTypeF = categoryType === undefined ? null : `${categoryType}`
    await Query(
      `
    update blog set
     img = ?,
     text = ?,
     title = ?,
     detail = ?,
     categoryType = ?,
     tags = ?
     where id = ?`,
      [imgF, textF, titleF, detail, categoryTypeF, tagsF, id]
    )
  }

  async getBlogSwiperList(data: { pageSize: number; pageNum: number }) {
    const { pageSize, pageNum } = data
    const num = (pageNum - 1) * pageSize
    const result = await Query(
      `select id, img, imgStatus, sort, createTime from blog_swiper LIMIT ? OFFSET ?`,
      [pageSize, num]
    )
    result.forEach((s) => {
      s.createTime = filterTime(s.createTime)
    })
    return result
  }

  async addBlogSwiper(data: { img: string; imgStatus: number; sort: number }) {
    const { img, imgStatus, sort } = data
    const responese = await Query(
      `select id from blog_swiper where imgStatus = 1`
    )
    if (responese.length >= 5 && imgStatus === 1) {
      throw new Error('最多只能开启五个图片轮播，请禁用此轮播图或禁用其他')
    }
    await Query(
      `insert into blog_swiper(img, imgStatus, sort, createTime) VALUES (?, ?, ?, ?)`,
      [img, imgStatus, sort, utcNow()]
    )
  }

  async updateBlogSwiper(data: {
    id: number
    img: string
    imgStatus: number
    sort: number
  }) {
    const { id, img, imgStatus, sort } = data
    let setClause = ''
    let params = []
    if (img) {
      if (setClause) setClause += ','
      setClause += ` img = ?`
      params.push(img)
    }
    if (imgStatus !== undefined || imgStatus !== null) {
      if (setClause) setClause += ','
      setClause += ` imgStatus = ?`
      params.push(imgStatus)
    }
    if (sort) {
      if (setClause) setClause += ','
      setClause += ` sort = ?`
      params.push(sort)
    }
    const response = await Query(
      `select id from blog_swiper where imgStatus = 1`
    )
    const index = response.findIndex((s) => s.id === id)
    if (response.length >= 5 && imgStatus === 1 && index == -1) {
      throw new Error('最多只能开启五个图片轮播，请禁用此轮播图或禁用其他')
    }
    let sql = `update blog_swiper`
    if (setClause) {
      sql += ' set' + setClause
    }
    sql += ` where id = ?`
    params.push(id)
    await Query(sql, params)
  }

  async updateBlogSwiperStatus(data: { id: number; imgStatus: number }) {
    const { id, imgStatus } = data
    const response = await Query(
      `select id from blog_swiper where imgStatus = 1`
    )
    if (response.length >= 5 && imgStatus === 1) {
      throw new Error('最多只能开启五个图片轮播，请禁用此轮播图或禁用其他')
    }
    await Query(`update blog_swiper set imgStatus = ? where id = ?`, [
      imgStatus,
      id
    ])
  }

  async deleteBlogSwiper(id: number) {
    await Query(`delete from blog_swiper where id = ?`, [id])
  }

  async getBlogCategory(id: string) {
    const result = await Query(
      `select
      bc.id,
      bc.category,
      bc.type,
      case 
        when bc.category = ? then (select count(id) from blog)
        else count(b.id)
      end as count,
      bc.sort
    from blog_category bc
    left join blog b on bc.category = b.categoryType
    where bc.userId = ? or bc.userId is null
    GROUP BY bc.category
    order by bc.sort`,
      ['全部', id]
    )
    return result
  }

  async addBlogCategory(data: { category: string; type: string; id: string }) {
    const { category, type, id } = data
    const response = await Query(
      `select id from blog_category where category = ? and userId = ?`,
      [category, id]
    )
    if (response.length > 0) {
      throw new Error('已有该标签')
    }
    const length = (
      await Query(
        `select count(id) as count from blog_category where userId = ? or userId is null`,
        [id]
      )
    )?.at(0).count
    await Query(
      `insert into blog_category(id, category, type, sort, userId, createTime) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), category, type, length + 1, id, utcNow()]
    )
  }

  async updateBlogCategory(data: {
    id: string
    category: string
    sort: number
    userId: string
  }) {
    const { id, category, sort, userId } = data
    let setClause = ''
    let params = []
    if (category) {
      if (setClause) setClause += ','
      setClause += ` category = ?`
      params.push(category)
    }
    if (sort) {
      if (setClause) setClause += ','
      setClause += ` sort = ?`
      params.push(sort)
    }
    params.push(id, userId)
    await Query(
      `update blog_category set ${setClause} where id = ? and userId = ?`,
      params
    )
  }

  async deleteBlogCategory(data: { id: number; userId: string }) {
    const { id, userId } = data
    await Query(`delete from blog_category where id = ? and userId = ?`, [
      id,
      userId
    ])
  }

  async updateBlogCategorySort(data: {
    drapSort: number
    drapCategory: string
    sort: number
    category: string
  }) {
    const { drapSort, drapCategory, sort, category } = data
    await Query(
      `
      update blog_category
      set 
        sort = case
        when category = ? then ?
        when category = ? then ?
        else sort
      end
      where category in (?, ?)  
      `,
      [drapCategory, drapSort, category, sort, drapCategory, category]
    )
  }

  async getBlogCategoryAll(userId: string) {
    const result = await Query(
      `select category from blog_category where userId = ? group by sort`,
      [userId]
    )
    return result
  }
}

export const blogModel = new BlogModel()
