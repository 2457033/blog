import { Router } from 'express'
import { commentController } from '@/controllers/reception/comment.controller'
const router = Router()

router.post('/list', commentController.getCommentList)

router.post('/add', commentController.addComment)

router.post('/expandApply', commentController.expandApply)

export default router
