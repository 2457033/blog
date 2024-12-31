import { Router } from 'express'
import { homeController } from '@/controllers/admin/home.controller'
const router = Router()

router.get('/', homeController.getHomeData)

router.post('/visitCount', homeController.getVisitCount)

router.get('/ipInfo', homeController.getIpInfo)

router.post('/deviceOrvisitAndCount', homeController.getDeviceOrVisitCount)

router.post('/record', homeController.recordVisit)

export default router
