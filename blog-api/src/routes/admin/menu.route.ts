import { menuController } from '@/controllers/admin/menu.controller'
import { checkPermission } from '@/middlewares/permission'
import { Router } from 'express'
const router = Router()

router.get('/', menuController.getMenu)

router.get('/list', menuController.getMenuList)

router.post(
  '/all',
  checkPermission('system:menu:all'),
  menuController.getMenuAll
)

router.post('/add', checkPermission('system:menu:add'), menuController.addMenu)

router.post(
  '/update',
  checkPermission('system:menu:update'),
  menuController.updateMenu
)

router.post(
  '/delete',
  checkPermission('system:menu:delete'),
  menuController.deleteMenu
)

export default router
