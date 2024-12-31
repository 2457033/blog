import express from 'express'
import { userController } from '@/controllers/admin/user.controller'
import { checkPermission } from '@/middlewares/permission'

const router = express.Router()

router.post(
  '/list',
  checkPermission('system:user:list'),
  userController.getUserList
)
router.post('/add', checkPermission('system:user:add'), userController.userAdd)
router.post(
  '/update/status',
  checkPermission('system:user:update:status'),
  userController.userUpdateStatus
)
router.post(
  '/update',
  checkPermission('system:user:update'),
  userController.userUpdate
)
router.get(
  '/delete',
  checkPermission('system:user:delete'),
  userController.userDelete
)
router.post(
  '/bind',
  checkPermission('system:user:bind'),
  userController.userBindRole
)
router.post(
  '/unbind',
  checkPermission('system:user:unbind'),
  userController.userUnBind
)
router.post('/upload/avatar', userController.uploadAvatar)
router.post('/update/pwd', userController.userUpdatePwd)
router.post('/downloadTem', userController.downloadTem)
router.post(
  '/import',
  checkPermission('system:user:import'),
  userController.import
)
router.post(
  '/export',
  checkPermission('system:user:export'),
  userController.export
)

export default router
