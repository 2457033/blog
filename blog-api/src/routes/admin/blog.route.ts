import { blogController } from '@/controllers/admin/blog.controller'
import { Router } from 'express'

const router = Router()

router.post('/list', blogController.getBlogList)

router.post('/update/blogType', blogController.updateBlogType)

router.get('/delete', blogController.deleteBlog)

router.post('/add', blogController.addBlog)

router.get('/detail', blogController.getBlogDetail)

router.post('/detail/update', blogController.updateBlog)

router.post('/swiper/list', blogController.getBlogSwiperList)

router.post('/swiper/add', blogController.addBlogSwiper)

router.post('/swiper/update', blogController.updateBlogSwiper)

router.post('/swiper/update/status', blogController.updateBlogSwiperStatus)

router.get('/swiper/delete', blogController.deleteBlogSwiper)

router.get('/category', blogController.getBlogCategory)

router.post('/category/add', blogController.addBlogCategory)

router.post('/category/edit', blogController.updateBlogCategory)

router.get('/category/all', blogController.getBlogCategoryAll)

router.post('/category/delete', blogController.deleteBlogCategory)

router.post('/category/sort/update', blogController.updateBlogCategorySort)

export default router
