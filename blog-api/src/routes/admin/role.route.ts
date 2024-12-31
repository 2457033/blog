import { roleController } from '@/controllers/admin/role.controller'
import { checkPermission } from '@/middlewares/permission'
import { Router } from 'express'
const router = Router()

router.post(
  '/list',
  checkPermission('system:role:list'),
  roleController.getRoleList
)

router.post('/add', checkPermission('system:role:add'), roleController.addRole)

router.post(
  '/update',
  checkPermission('system:role:update'),
  roleController.updateRole
)

router.post(
  '/update/status',
  checkPermission('system:role:update:status'),
  roleController.updateRoleStatus
)

router.get(
  '/delete',
  checkPermission('system:role:delete'),
  roleController.deleteRole
)

router.post(
  '/unBindUser/list',
  checkPermission('system:role:unBindUser:list'),
  roleController.getUnBindUser
)

router.post(
  '/bindUser/list',
  checkPermission('system:role:bindUser:list'),
  roleController.getBindUser
)

router.post(
  '/bind',
  checkPermission('system:role:bind'),
  roleController.bindUser
)

router.post(
  '/unBind',
  checkPermission('system:role:unBind'),
  roleController.unBindUser
)

router.post(
  '/export',
  checkPermission('system:role:export'),
  roleController.exportRole
)

export default router
