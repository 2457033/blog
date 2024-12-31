import { menuModel } from '@/models/admin/menu.model'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'

class MenuController {
  // 获取菜单列表
  async getMenu(_req: Request, res: Response) {
    const result = await menuModel.getMenu()
    responseHandler.successList(res, {
      row: result,
      total: result.length || 0
    })
  }

  async getMenuList(_req: Request, res: Response) {
    const result = await menuModel.getMenuList()
    responseHandler.successList(res, {
      row: result,
      total: result.length || 0
    })
  }

  // 获取菜单列表
  async getMenuAll(req: Request, res: Response) {
    const { title, status, pageSize, pageNum } = req.body
    const result = await menuModel.getMenuAll({
      title,
      status,
      pageSize,
      pageNum
    })
    responseHandler.successList(res, result)
  }

  // 修改菜单
  async updateMenu(req: Request, res: Response) {
    const {
      id,
      title,
      status,
      icon,
      name,
      path,
      sort,
      menuType,
      showMenu,
      outChain,
      permission,
      cache,
      query
    } = req.body
    if (!id) {
      responseHandler.error(res, 'id不能为空')
      return
    }
    if (!title) {
      responseHandler.error(res, 'title不能为空')
      return
    }
    if (!status) {
      responseHandler.error(res, 'status不能为空')
      return
    }
    if (menuType !== 'button') {
      if (!name) {
        responseHandler.error(res, '请输入路由地址')
        return
      }
    }
    await menuModel.updateMenu({
      id,
      title,
      status,
      icon,
      name,
      path,
      sort,
      menuType,
      showMenu,
      outChain,
      permission,
      cache,
      query
    })
    responseHandler.success(res, null)
  }

  // 添加菜单
  async addMenu(req: Request, res: Response) {
    const {
      fId,
      title,
      status,
      icon,
      name,
      path,
      sort,
      menuType,
      showMenu,
      outChain,
      permission,
      cache,
      query
    } = req.body
    if (!title) {
      responseHandler.error(res, '请输入标题')
      return
    }
    if (menuType !== 'button') {
      if (!name) {
        responseHandler.error(res, '请输入路由地址')
        return
      }
    }
    if (!status) {
      responseHandler.error(res, '请输入菜单状态')
      return
    }
    await menuModel.addMenu({
      fId,
      title,
      status,
      icon,
      name,
      path,
      sort,
      menuType,
      showMenu,
      outChain,
      permission,
      cache,
      query
    })
    responseHandler.success(res, null)
  }

  // 删除菜单
  async deleteMenu(req: Request, res: Response) {
    const { id } = req.body
    if (!id) {
      responseHandler.error(res, '请输入id')
      return
    }
    await menuModel.deleteMenu(id)
    responseHandler.success(res, null)
  }
}

export const menuController = new MenuController()
