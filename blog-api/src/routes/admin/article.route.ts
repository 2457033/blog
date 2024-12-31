import { articleController } from '@/controllers/admin/article.controller'
import { Router } from 'express'

const router = Router()

/** 文章列表 */
router.post('/list', articleController.getArticleList)

router.get('/detail', articleController.getArticleDetail)

export default router
