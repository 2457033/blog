import { articleController } from '@/controllers/reception/article.controller'
import { Router } from 'express'
const router = Router()

router.post('/list', articleController.getArticleList)

router.get('/category', articleController.getArticleCategory)

router.get('/detail', articleController.getArticleDetail)

router.post('/like', articleController.likeArticle)

router.post('/unLike', articleController.unLikeArticle)

router.post('/collection', articleController.collectionArticle)

router.post('/unCollection', articleController.unCollectionArticle)

router.post('/visit', articleController.visitArticle)

export default router
