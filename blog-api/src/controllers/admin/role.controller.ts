import { roleModel } from '@/models/admin/role.model'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'

class RoleController {
  // 获取角色列表
  async getRoleList(req: Request, res: Response) {
    const {
      pageNum,
      pageSize,
      role,
      roleName,
      status,
      createStartTime,
      createEndTime
    } = req.body
    const result = await roleModel.getRoleList({
      pageNum,
      pageSize,
      role,
      roleName,
      status,
      createStartTime,
      createEndTime
    })
    responseHandler.successList(res, result)
  }

  // 新增角色
  async addRole(req: Request, res: Response) {
    const {
      roleName,
      role,
      sort,
      status,
      selectIds,
      halfSelecteIds,
      remark,
      id
    } = req.body
    if (!role) {
      responseHandler.error(res, '请输入权限字符')
      return
    }
    if (!roleName) {
      responseHandler.error(res, '请输入角色名称')
      return
    }
    if (!sort) {
      responseHandler.error(res, '请输入角色顺序')
      return
    }
    await roleModel.addRole({
      role,
      roleName,
      sort,
      status,
      remark,
      selectIds,
      halfSelecteIds,
      id
    })
    responseHandler.success(res, null)
  }

  // 修改角色状态
  async updateRoleStatus(req: Request, res: Response) {
    const { id, status } = req.body
    if (!id) {
      responseHandler.error(res, '请输入角色id')
      return
    }
    await roleModel.updateRoleStatus({ id, status })
    responseHandler.success(res, null)
  }

  // 修改角色
  async updateRole(req: Request, res: Response) {
    const {
      id,
      roleName,
      role,
      sort,
      status,
      selectIds,
      halfSelecteIds,
      remark
    } = req.body
    if (!id) {
      responseHandler.error(res, '请输入角色id')
      return
    }
    if (!roleName) {
      responseHandler.error(res, '请输入角色名称')
      return
    }
    if (!role) {
      responseHandler.error(res, '请输入权限字符')
      return
    }
    if (!sort) {
      responseHandler.error(res, '请输入角色顺序')
      return
    }
    await roleModel.updateRole({
      id,
      roleName,
      role,
      sort,
      status,
      selectIds,
      halfSelecteIds,
      remark
    })
    responseHandler.success(res, null)
  }

  // 删除角色
  async deleteRole(req: Request, res: Response) {
    const { id } = req.query
    if (!id) {
      responseHandler.error(res, '请输入角色id')
      return
    }
    await roleModel.deleteRole(String(id))
    responseHandler.success(res, null)
  }

  // 获取未绑定用户
  async getUnBindUser(req: Request, res: Response) {
    const { pageNum, pageSize } = req.body
    const result = await roleModel.getUnBindUser({ pageNum, pageSize })
    responseHandler.successList(res, result)
  }

  // 获取已绑定用户
  async getBindUser(req: Request, res: Response) {
    const { pageNum, pageSize, roleId } = req.body
    const result = await roleModel.getBindUser({ pageNum, pageSize, roleId })
    responseHandler.successList(res, result)
  }

  // 绑定用户
  async bindUser(req: Request, res: Response) {
    const { userIds, roleId } = req.body
    if (!userIds) {
      responseHandler.error(res, '没找到用户信息')
      return
    }
    if (!roleId) {
      responseHandler.error(res, '没找到角色信息')
      return
    }
    await roleModel.bindUser({ userIds, roleId })
    responseHandler.success(res, null)
  }

  // 取消绑定用户
  async unBindUser(req: Request, res: Response) {
    const { userIds, roleId } = req.body
    if (!userIds) {
      responseHandler.error(res, '没找到用户信息')
      return
    }
    if (!roleId) {
      responseHandler.error(res, '没找到角色信息')
      return
    }
    await roleModel.unBindUser({ userIds, roleId })
    responseHandler.success(res, null)
  }

  // 导出角色
  async exportRole(req: Request, res: Response) {
    const {
      pageNum,
      pageSize,
      role,
      roleName,
      status,
      createStartTime,
      createEndTime
    } = req.body
    const result = await roleModel.exportRole({
      pageNum,
      pageSize,
      role,
      roleName,
      status,
      createStartTime,
      createEndTime
    })
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent('导出数据.xlsx')
    )
    res.send(result)
  }
}

export const roleController = new RoleController()
