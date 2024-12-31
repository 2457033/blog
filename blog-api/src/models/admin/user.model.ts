import { Query } from '@/config/mysql'
import { filterTime, utcNow } from '@/utils/common'
import {
  generateRandomName,
  generateRandomPhone,
  verifyPassword
} from '@/utils/recursion'
import { v4 as uuidv4 } from 'uuid'
import XLSX from 'xlsx'

interface UserListData {
  pageNum: number
  pageSize: number
  userName: string
  phone: string
  status: number
}

interface UserAddData {
  userName: string
  password: string
  phone: string
  nickName: string
  sex: number
  remark: string
  status: number
}

interface UserUpdateData {
  id: string
  status: number
  nickName: string
  phone: string
  sex: number
  remark: string
}

class UserModel {
  // 获取用户列表
  async getUserList(data: UserListData) {
    const { pageNum, pageSize, userName, phone, status } = data
    let sql = `select u.id, userName, phone, icon, nickName, u.createTime, u.status, sex, u.remark, ur.roleId from users u left join user_of_role ur on ur.userId = u.id`
    let whereClause = ''
    let params = []
    let paramsCount = []
    if (userName) {
      if (whereClause) whereClause += ' AND'
      whereClause += ` userName LIKE ?`
      params.push(`%${userName}%`)
      paramsCount.push(`%${userName}%`)
    }
    if (phone) {
      if (whereClause) whereClause += ' AND'
      whereClause += ` phone LIKE ?`
      params.push(`%${phone}%`)
      paramsCount.push(`%${phone}%`)
    }
    if (status !== undefined) {
      // 假设 status 可以是 null 或其他非数字值，这里使用 !== undefined 来判断
      if (whereClause) whereClause += ' AND'
      whereClause += ` status = ?`
      params.push(status)
      paramsCount.push(status)
    }
    if (whereClause) {
      sql += ` WHERE ${whereClause}`
    }
    const num = (pageNum - 1) * pageSize
    const sqlCount = sql + ` ORDER BY CAST(u.id AS UNSIGNED)`
    const sqlList = sql + ` ORDER BY CAST(u.id AS UNSIGNED) LIMIT ? OFFSET ?`
    params.push(pageSize, num)
    const [count, result] = await Promise.all([
      Query(sqlCount, paramsCount),
      Query(sqlList, params)
    ])
    result.forEach((s) => {
      s.createTime = filterTime(s.createTime)
    })
    return {
      row: result,
      total: count.length || 0
    }
  }

  // 添加用户
  async userAdd(data: UserAddData) {
    const { userName, password, phone, nickName, sex, remark, status } = data
    const response = (
      await Query(`select id from users order by id DESC limit 1`)
    )?.at(0)
    const length = parseInt(response?.id)
    const remarkF = remark ?? null
    const sexF = sex ?? 'unknown'

    let params = [
      `${length + 1}`,
      userName,
      password,
      phone,
      'https://img0.baidu.com/it/u=365878481,4199784825&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1718470800&t=7a0922588019d3d8db1084a3e3859c1a',
      nickName,
      sexF,
      status,
      remarkF,
      `${utcNow()}`
    ]
    const sql = `INSERT INTO users (userName, password, phone, nickName, sex, remark, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
    const result = await Query(sql, params)
    return result
  }

  // 修改用户状态
  async userUpdateStatus(id: string, status: number) {
    const sql = `update users set status = ? where id = ?`
    const result = await Query(sql, [status, id])
    return result
  }

  // 修改用户
  async userUpdate(data: UserUpdateData) {
    const { id, status, nickName, phone, sex, remark } = data
    if (nickName) {
      const responese = await Query(
        `select nickName from users where nickName = ? and id != ?`,
        [nickName, id]
      )
      if (responese && responese.length > 0) {
        throw new Error('已有该昵称，请换一个昵称')
      }
    }
    if (phone) {
      const responese = await Query(
        `select phone from users where phone = ? and id != ?`,
        [phone, id]
      )
      if (responese && responese.length > 0) {
        throw new Error('已有该手机号，请换一个手机号')
      }
    }
    const sql = `update users set nickName = ?, phone = ?, sex = ?, remark = ?, status = ? where id = ?`
    const result = await Query(sql, [nickName, phone, sex, remark, status, id])
    return result
  }

  // 删除用户
  async userDelete(id: string) {
    const responese = await Query(
      `select userId from user_of_role where userId = ?`,
      [id]
    )
    if (responese && responese.length > 0) {
      await Query(`delete from user_of_role where userId = ?`, [id])
    }
    const result = await Query(`delete from users where id = ?`, [id])
    return result
  }

  // 绑定角色
  async userBindRole(data: { userId: string; roleId: string }) {
    const { userId, roleId } = data
    const responese = await Query(
      `select userId, roleId from user_of_role where userId = ?`,
      [userId]
    )
    if (responese && responese.length > 0) {
      await Query(`update user_of_role set roleId = ? where userId = ?`, [
        roleId,
        userId
      ])
    } else {
      await Query(
        `INSERT INTO user_of_role(id, userId, roleId, createTime) VALUES (?, ?, ?, ?);`,
        [uuidv4(), userId, roleId, `${utcNow()}`]
      )
    }
  }

  // 取消绑定
  async userUnBind(data: { userId: string; roleId: string }) {
    const { userId, roleId } = data
    await Query(`delete from user_of_role where roleId = ? and userId = ?`, [
      roleId,
      userId
    ])
  }

  // 修改密码
  async userUpdatePwd(data: { id: string; oldPwd: string; newPwd: string }) {
    const { id, oldPwd, newPwd } = data
    const responese = (
      await Query(`select password from users where id = ?`, [id])
    )?.at(0)
    if (responese?.password !== verifyPassword(oldPwd)) {
      throw new Error('您输入的旧密码有误，请重新输入')
    }
    await Query('update users set password = MD5(?) where id = ?', [newPwd, id])
  }

  // 下载模板
  async downloadTem() {
    const userName = await getName()
    const phone = await getPhone()
    const excelData = [
      ['用户名称', '用户密码', '用户昵称', '手机号码', '用户性别', '状态'],
      [userName, '123456', userName, phone, 'unknown', '正常']
    ]
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(excelData)
    XLSX.utils.book_append_sheet(wb, ws, '下载模板表')
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
    return buffer
  }

  // 上传头像
  async uploadAvatar(id: string, url: string) {
    await Query(`update users set icon = ? where id = ?`, [url, id])
  }

  // 导出
  async export(data: UserListData) {
    const { pageNum, pageSize, userName, phone, status } = data
    let sql = `select u.id, userName, phone, icon, nickName, u.createTime, u.status, sex, u.remark, ur.roleId from users u left join user_of_role ur on ur.userId = u.id`
    let whereClause = ''
    let params = []
    if (userName) {
      whereClause += ` AND userName LIKE ?`
      params.push(`%${userName}%`)
    }
    if (phone) {
      whereClause += ` AND phone LIKE ?`
      params.push(`%${phone}%`)
    }
    if (status !== undefined) {
      whereClause += ` AND status = ?`
      params.push(status)
    }
    if (whereClause) {
      sql += ` WHERE ${whereClause}`
    }
    const num = (pageNum - 1) * pageSize
    sql += ` ORDER BY CAST(u.id AS UNSIGNED) LIMIT ? OFFSET ?`
    params.push(pageSize, num)
    const result = await Query(sql, params)
    const excelData = [
      ['用户编号', '用户名称', '用户昵称', '手机号码', '状态', '创建时间'],
      ...result?.map((item) => [
        item.id,
        item.userName,
        item.nickName,
        item.phone,
        item.status === 1 ? '正常' : '停用',
        filterTime(item.createTime)
      ])
    ]
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(excelData)
    XLSX.utils.book_append_sheet(wb, ws, '导出表')
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
    return buffer
  }

  // 导入
  async import(path: string) {
    const workbook = XLSX.readFile(path)
    let data: any[] = []
    let msg = ''
    for (let sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      // 这里可以处理 sheet 数据，例如将其转换为 JSON
      data = XLSX.utils.sheet_to_json(sheet)
      if (data.length > 0) {
        for (let s of data) {
          const responese = await Query(
            `select userName from users where userName = ?`,
            s['用户名称']
          )
          if (responese.length > 0) {
            if (msg) msg += '<br>'
            msg += `已有用户名为${s['用户名称']}的用户`
          } else {
            const responese = (
              await Query(
                `select id from users order by CAST(id AS UNSIGNED) DESC limit 1`
              )
            )?.at(0)
            let params = [
              `${parseInt(responese?.id) + 1}`,
              s['用户名称'],
              s['用户密码'],
              s['手机号码'],
              'https://img0.baidu.com/it/u=365878481,4199784825&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1718470800&t=7a0922588019d3d8db1084a3e3859c1a',
              s['用户昵称'],
              s['用户性别'],
              1,
              `${utcNow()}`
            ]
            await Query(
              `INSERT INTO users(id, userName, password, phone, code, icon, nickName, sex, status, remark, createTime) 
                      VALUES (
                      ?, ?, MD5(?), ?, null, ?,
                      ?, ?, ?, null,?);`,
              params
            )
          }
        }
      }
    }
    return msg
  }
}

async function getName() {
  let userName = generateRandomName(7)
  const responese = await Query(
    `select userName from users where userName = ?`,
    [userName]
  )
  if (responese.length > 0) {
    getName()
  }
  return userName
}

async function getPhone() {
  let phone = generateRandomPhone(11)
  const responese = await Query(`select phone from users where phone = ?`, [
    phone
  ])
  if (responese.length > 0) {
    getPhone()
  }
  return phone
}

export const userModel = new UserModel()
