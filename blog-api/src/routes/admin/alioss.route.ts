import express from 'express'
import { aliossController } from '@/controllers/admin/alioss.controller'
const router = express.Router()

router.get('/sts', aliossController.sts)

export default router
