import { userModel } from '@/models/admin/user.model'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'
import fs from 'fs'

class UserController {
  // 获取用户列表
  async getUserList(req: Request, res: Response) {
    const { pageNum, pageSize, userName, phone, status } = req.body
    const result = await userModel.getUserList({
      pageNum,
      pageSize,
      userName,
      phone,
      status
    })
    responseHandler.successList(res, result)
  }

  // 添加用户
  async userAdd(req: Request, res: Response) {
    const { userName, password, phone, nickName, sex, remark, status } =
      req.body
    if (!userName) {
      responseHandler.error(res, '请输入用户名称')
      return
    }
    if (!phone) {
      responseHandler.error(res, '请输入手机号')
      return
    }
    if (!nickName) {
      responseHandler.error(res, '请输入用户昵称')
      return
    }
    if (!password) {
      responseHandler.error(res, '请输入密码')
      return
    }
    await userModel.userAdd({
      userName,
      password,
      phone,
      nickName,
      sex,
      remark,
      status
    })
    responseHandler.success(res, '新增成功')
  }

  // 修改用户状态
  async userUpdateStatus(req: Request, res: Response) {
    const { id, status } = req.body
    if (!id) {
      responseHandler.error(res, '请输入用户id')
      return
    }
    await userModel.userUpdateStatus(id, status)
    responseHandler.success(res, '修改成功')
  }
  async userUpdate(req: Request, res: Response) {
    const { id, status, nickName, phone, sex, remark } = req.body
    if (!id) {
      responseHandler.error(res, '请输入用户id')
      return
    }
    if (!phone) {
      responseHandler.error(res, '请输入手机号')
      return
    }
    if (!nickName) {
      responseHandler.error(res, '请输入用户昵称')
      return
    }
    try {
      await userModel.userUpdate({
        id,
        phone,
        nickName,
        sex,
        remark,
        status
      })
      responseHandler.success(res, null)
    } catch (error: any) {
      responseHandler.error(res, error.message)
    }
  }

  // 删除用户
  async userDelete(req: Request, res: Response) {
    const { id } = req.query
    if (!id) {
      responseHandler.error(res, '请输入用户id')
      return
    }
    await userModel.userDelete(id as string)
    responseHandler.success(res, null)
  }

  // 绑定角色
  async userBindRole(req: Request, res: Response) {
    const { userId, roleId } = req.body
    if (!userId) {
      responseHandler.error(res, '没找到用户信息')
      return
    }
    if (!roleId) {
      responseHandler.error(res, '没找到角色信息')
      return
    }
    await userModel.userBindRole({ userId, roleId })
    responseHandler.success(res, null)
  }

  // 取消绑定
  async userUnBind(req: Request, res: Response) {
    const { userId, roleId } = req.body
    if (!userId) {
      responseHandler.error(res, '没找到用户信息')
      return
    }
    if (!roleId) {
      responseHandler.error(res, '没找到角色信息')
      return
    }
    await userModel.userUnBind({ userId, roleId })
    responseHandler.success(res, null)
  }

  // 修改密码
  async userUpdatePwd(req: Request, res: Response) {
    const { oldPwd, newPwd } = req.body
    const { id } = req.tokenPayload
    if (!id) {
      responseHandler.error(res, '未找到token携带的id')
      return
    }
    if (!oldPwd) {
      responseHandler.error(res, '请输入旧密码')
      return
    }
    if (!newPwd) {
      responseHandler.error(res, '请输入新密码')
      return
    }
    try {
      await userModel.userUpdatePwd({ id: id as string, oldPwd, newPwd })
      responseHandler.success(res, null)
    } catch (error: any) {
      responseHandler.error(res, error.message)
    }
  }

  // 下载模板
  async downloadTem(_req: Request, res: Response) {
    try {
      const buffer = await userModel.downloadTem()
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.setHeader('Content-Disposition', 'attachment; filename=download.xlsx')
      res.send(buffer)
    } catch (error: any) {
      responseHandler.error(res, error.message)
    }
  }

  // 上传头像
  async uploadAvatar(req: Request, res: Response) {
    const { url } = req.body
    const { id } = req.tokenPayload
    if (!url) {
      responseHandler.error(res, '未找到上传的路径')
      return
    }
    if (!id) {
      responseHandler.error(res, '未找到token携带的id')
      return
    }
    await userModel.uploadAvatar(id.toString(), url)
    responseHandler.success(res, null)
  }

  // 导出
  async export(req: Request, res: Response) {
    const { pageNum, pageSize, userName, phone, status } = req.body
    try {
      const buffer = await userModel.export({
        pageNum,
        pageSize,
        userName,
        phone,
        status
      })
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + encodeURIComponent('导出数据.xlsx')
      )
      res.send(buffer)
    } catch (error: any) {
      responseHandler.error(res, error.message)
    }
  }

  // 导入
  async import(req: Request & { file?: any }, res: Response) {
    const { file } = req
    if (!file) {
      responseHandler.error(res, '未找到上传的文件')
      return
    }
    const msg = await userModel.import(file.path)
    responseHandler.success(res, msg)
    fs.unlink(file.path, (err) => {
      if (err) {
        console.log(err.message)
        return
      }
      console.log(file.filename + '已被删除')
    })
  }
}

export const userController = new UserController()
