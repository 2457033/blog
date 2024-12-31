import { Router } from 'express'
import { homeController } from '@/controllers/reception/home.controller'
const router = Router()

router.get('/home', homeController.getHomeList)

router.get('/newInfo', homeController.getNewInfo)

export default router
