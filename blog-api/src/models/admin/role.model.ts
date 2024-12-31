import { Query } from '@/config/mysql'
import { filterTime, utcNow } from '@/utils/common'
import { v4 as uuidv4 } from 'uuid'
import xlsx from 'xlsx'

interface roleData {
  pageNum: number
  pageSize: number
  role: string
  roleName: string
  status: number
  createStartTime: string
  createEndTime: string
}

interface addRoleData {
  roleName: string
  role: string
  sort: number
  status: number
  selectIds: string[]
  halfSelecteIds: string[]
  remark: string
  id: string
}

class RoleModel {
  async getRoleList(data: roleData) {
    const {
      pageNum,
      pageSize,
      role,
      roleName,
      status,
      createStartTime,
      createEndTime
    } = data
    let sql = `select * from role`
    let whereClause = ''
    let params = []
    let paramsCount = []
    if (role) {
      if (whereClause) whereClause += ' AND'
      whereClause += `role LIKE ?`
      params.push(`%${role}%`)
      paramsCount.push(`%${role}%`)
    }
    if (roleName) {
      if (whereClause) whereClause += ' AND'
      whereClause += `roleName LIKE ?`
      params.push(`%${roleName}%`)
      paramsCount.push(`%${roleName}%`)
    }
    if (createStartTime && createEndTime) {
      if (whereClause) whereClause += ' AND'
      whereClause += `createTime BETWEEN ? AND ?`
      params.push(createStartTime, createEndTime)
      paramsCount.push(createStartTime, createEndTime)
    }
    if (status !== undefined) {
      if (whereClause) whereClause += ' AND'
      whereClause += `status = ?`
      params.push(status)
      paramsCount.push(status)
    }
    if (whereClause) {
      sql += ` WHERE ${whereClause}`
    }
    const sqlCount = sql + ` ORDER BY createTime DESC`
    const sqlList = sql + ` ORDER BY sort limit ? offset ?`
    const num = (pageNum - 1) * pageSize
    params.push(pageSize, num)
    const [result, count] = await Promise.all([
      Query(sqlList, params),
      Query(sqlCount, paramsCount)
    ])
    result.forEach((item: any) => {
      item.createTime = filterTime(item.createTime)
      if (item.selectIds !== '*:*:*') {
        item.selectIds = item.selectIds?.split(',')
      }
    })
    return { row: result, total: count.length || 0 }
  }

  async addRole(data: addRoleData) {
    const {
      roleName,
      role,
      sort,
      status,
      selectIds,
      halfSelecteIds,
      remark,
      id
    } = data
    const findRole = (
      await Query(`select role from role where role = ? and id != ?`, [
        role,
        id
      ])
    )?.at(0)
    if (findRole) {
      if (findRole?.role === 'admin') {
        throw new Error('该权限字符不可取, 请联系管理员')
      } else {
        throw new Error('该权限字符重复')
      }
    }

    let permissionF
    let selectIdsF

    const selectIdsAll = selectIds?.concat(halfSelecteIds)
    if (selectIdsAll.length > 0) {
      const conditions = selectIdsAll
        .map((id: any) => `id = '${id}'`)
        .join(' OR ')
      const data = await Query(
        `SELECT permission FROM menus WHERE ${conditions}`
      )
      const dataF = data.filter((s) => s.permission).map((s) => s.permission)
      selectIdsF = `${selectIds.join(',')}`
      permissionF = `${dataF.join(',')}`
    } else {
      permissionF = null
      selectIdsF = null
    }

    const remarkF = remark == undefined ? null : `${remark}`

    const responese = (
      await Query(`select id from role order by id DESC limit 1`)
    )?.at(0)
    const length = parseInt(responese?.id)

    const sql = `INSERT INTO role(id, role, roleName, permission, sort, status, remark, selectIds, createTime) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const params = [
      `${length + 1}`,
      role,
      roleName,
      permissionF,
      sort,
      status,
      remarkF,
      selectIdsF,
      `${utcNow()}`
    ]
    await Query(sql, params)
  }

  async updateRoleStatus(data: { id: string; status: number }) {
    const { id, status } = data
    await Query(`update role set status = ? where id = ?`, [status, id])
  }

  async updateRole(data: addRoleData) {
    const {
      id,
      roleName,
      role,
      sort,
      status,
      selectIds,
      halfSelecteIds,
      remark
    } = data

    const findRole = (
      await Query(`select role from role where role = ? and id != ?`, [
        role,
        id
      ])
    )?.at(0)
    if (findRole) {
      if (findRole?.role === 'admin') {
        throw new Error('该权限字符不可取, 请联系管理员')
      } else {
        throw new Error('该权限字符重复')
      }
    }

    let permissionF
    let selectIdsF
    const selectIdsAll = selectIds?.concat(halfSelecteIds)
    if (selectIdsAll.length > 0) {
      const conditions = selectIdsAll.map((id) => `id = '${id}'`).join(' OR ')
      const data = await Query(
        `SELECT permission FROM menus WHERE ${conditions}`
      )
      const dataF = data.filter((s) => s.permission).map((s) => s.permission)
      selectIdsF = `${selectIds.join(',')}`
      permissionF = `${dataF.join(',')}`
    } else {
      permissionF = null
      selectIdsF = null
    }

    const remarkF = remark == undefined ? null : `${remark}`

    let params = [
      roleName,
      role,
      sort,
      status,
      permissionF,
      remarkF,
      selectIdsF,
      id
    ]

    await Query(
      `update role set 
        roleName = ?, 
        role = ?, 
        sort = ?, 
        status = ?, 
        permission = ?,
        remark = ?,
        selectIds = ?
        where id = ?`,
      params
    )
  }

  async deleteRole(id: string) {
    const responese = await Query(
      `select roleId from user_of_role where roleId = ?`,
      [id]
    )
    if (responese && responese.length > 0) {
      await Query(`delete from user_of_role where roleId = ?`, [id])
    }
    await Query(`delete from role where id = ?`, [id])
  }

  async getUnBindUser(data: { pageNum: number; pageSize: number }) {
    const { pageNum, pageSize } = data
    const num = (pageNum - 1) * pageSize
    const sql = `select u.id, userName, phone, icon, nickName, u.createTime, u.status, sex, u.remark, ur.roleId from users u left join user_of_role ur on ur.userId = u.id where ur.roleId is null and userName != 'admin'`
    const sqlList = sql + ` ORDER BY id LIMIT ? OFFSET ?`
    const [result, count] = await Promise.all([
      Query(sqlList, [pageSize, num]),
      Query(sql)
    ])
    return { row: result, total: count.length || 0 }
  }

  async getBindUser(data: {
    pageNum: number
    pageSize: number
    roleId: string
  }) {
    const { pageNum, pageSize, roleId } = data
    const num = (pageNum - 1) * pageSize
    const sql = `select u.id, userName, phone, icon, nickName, u.createTime, u.status, sex, u.remark, ur.roleId from users u left join user_of_role ur on ur.userId = u.id where ur.roleId is not null and ur.roleId = ? and userName != 'admin'`
    const sqlList = sql + ` ORDER BY id LIMIT ? OFFSET ?`
    const params = [roleId, pageSize, num]
    const [result, count] = await Promise.all([
      Query(sqlList, params),
      Query(sql, [roleId])
    ])
    return { row: result, total: count.length || 0 }
  }

  async bindUser(data: { userIds: string[]; roleId: string }) {
    const { userIds, roleId } = data
    userIds.forEach(async (s) => {
      const responese = await Query(
        `select userId, roleId from user_of_role where userId = ?`,
        [s]
      )
      if (responese && responese.length > 0) {
        await Query(`update user_of_role set roleId = ? where userId = ?`, [
          roleId,
          s
        ])
      } else {
        await Query(
          `INSERT INTO user_of_role(id, userId, roleId, createTime) VALUES (?, ?, ?, ?);`,
          [uuidv4(), s, roleId, `${utcNow()}`]
        )
      }
    })
  }

  async unBindUser(data: { userIds: string[]; roleId: string }) {
    const { userIds, roleId } = data
    userIds.forEach(async (s) => {
      await Query(`delete from user_of_role where roleId = ? and userId = ?`, [
        roleId,
        s
      ])
    })
  }

  async exportRole(data: roleData) {
    const {
      pageNum,
      pageSize,
      role,
      roleName,
      status,
      createStartTime,
      createEndTime
    } = data
    let sql = `select * from role`
    let whereClause = ''
    let params = []

    if (role) {
      if (whereClause) whereClause += ' AND'
      whereClause += ` role LIKE ?`
      params.push(`%${role}%`)
    }

    if (roleName) {
      if (whereClause) whereClause += ' AND'
      whereClause += ` roleName LIKE ?`
      params.push(`%${roleName}%`)
    }

    if (createStartTime && createEndTime) {
      if (whereClause) whereClause += ' AND'
      whereClause += ` createTime BETWEEN ? AND ?`
      params.push(createStartTime, createEndTime)
    }

    if (status !== undefined) {
      // 假设 status 可以是 null 或其他非数字值，这里使用 !== undefined 来判断
      if (whereClause) whereClause += ' AND'
      whereClause += ` status = ?`
      params.push(status)
    }

    if (whereClause) {
      sql += ` WHERE ${whereClause}`
    }

    const num = (pageNum - 1) * pageSize

    sql += ` ORDER BY sort LIMIT ? OFFSET ?`
    params.push(pageSize, num)
    const responese = await Query(sql, params)
    const excelData = [
      ['角色编号', '角色名称', '权限字符', '显示顺序', '状态', '创建时间'],
      ...responese?.map((item) => [
        item.id,
        item.roleName,
        item.role,
        item.sort,
        item.status === 1 ? '正常' : '停用',
        item.createTime
      ])
    ]
    const buffer = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(
      buffer,
      xlsx.utils.aoa_to_sheet(excelData),
      '导出表'
    )
    const excelBuffer = xlsx.write(buffer, { type: 'buffer', bookType: 'xlsx' })
    return excelBuffer
  }
}

export const roleModel = new RoleModel()
